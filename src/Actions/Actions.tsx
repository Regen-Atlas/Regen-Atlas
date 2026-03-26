import type { MapRef } from "react-map-gl";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMapState } from "../context/map";
import { MapBox } from "../shared/components/MapBox";
import Header from "../Header";
import { Action } from "../shared/types";
import supabase from "../shared/helpers/supabase";
import ActionCard from "./ActionCard";
import Footer from "../Footer";
import { ClusteredActionsLayer } from "./ClusteredActionsLayer";
import { ActionsFiltersBar } from "./components/ActionsFiltersBar";
import { TimeSlider } from "./components/TimeSlider";

const getMonthValue = (date: Date): number => {
  return date.getFullYear() * 12 + date.getMonth();
};

const isActionActiveAtDate = (action: Action, date: Date): boolean => {
  const start = action.action_start_date ? new Date(action.action_start_date) : null;
  const end = action.action_end_date ? new Date(action.action_end_date) : null;
  const selectedMonth = getMonthValue(date);

  if (!start && !end) return true;
  if (start && !end) return selectedMonth >= getMonthValue(start);
  if (!start && end) return selectedMonth <= getMonthValue(end);
  return selectedMonth >= getMonthValue(start!) && selectedMonth <= getMonthValue(end!);
};

const hasMatchingProtocol = (action: Action, protocolIds: string[]): boolean => {
  if (protocolIds.length === 0) return true;
  return action.proofs.some((proof) => protocolIds.includes(proof.protocol.id));
};

const hasMatchingSDG = (action: Action, sdgIds: number[]): boolean => {
  if (sdgIds.length === 0) return true;
  return action.sdg_outcomes.some((sdg) => sdgIds.includes(sdg.id));
};

export default (): React.ReactElement => {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const mapRef = useRef<MapRef>();
  const { mapStyle } = useMapState();
  const [actions, setActions] = useState<Array<Action>>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  useEffect(() => {
    async function fetchActions() {
      const { error, data } = await supabase
        .from("actions_published_view")
        .select();

      if (error) {
        console.error("Error fetching actions:", error);
        return;
      }

      setActions(data as Action[]);
    }
    fetchActions();
  }, []);

  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      const matchesDate = !selectedDate || isActionActiveAtDate(action, selectedDate);
      const matchesProtocol = hasMatchingProtocol(action, selectedProtocols);
      const matchesSDG = hasMatchingSDG(action, selectedSDGs);
      return matchesDate && matchesProtocol && matchesSDG;
    });
  }, [actions, selectedDate, selectedProtocols, selectedSDGs]);

  const handleClearFilters = () => {
    setSelectedProtocols([]);
    setSelectedSDGs([]);
  };

  const handleMarkerClick = ({
    actionId,
    lng,
    lat,
  }: {
    actionId: string;
    lng: number;
    lat: number;
  }) => {
    setSelectedActionId(actionId);
    mapRef?.current?.flyTo({
      center: [lng, lat],
      zoom: 6,
    });
  };

  const handleActionCardClick = (action: Action) => {
    if (action.location) {
      mapRef?.current?.flyTo({
        center: [action.location.longitude, action.location.latitude],
        zoom: 6,
      });
    }
  };

  const actionsToDisplay = selectedActionId
    ? [
      filteredActions.find((action) => action.id === selectedActionId),
      ...filteredActions.filter((action) => action.id !== selectedActionId),
    ].filter((action) => action !== undefined)
    : filteredActions;

  return (
    <>
      <Header />
      <div className="main-container">
        <div className={clsx("pt-[60px] md:pt-[80px]")}>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[500px_1fr] xl:grid-cols-[500px_1fr] md:gap-4">
            <div className="order-2 md:order-1 mb-20">
              <ActionsFiltersBar
                actions={actions}
                filteredCount={filteredActions.length}
                selectedProtocols={selectedProtocols}
                selectedSDGs={selectedSDGs}
                onProtocolsChange={setSelectedProtocols}
                onSDGsChange={setSelectedSDGs}
                onClearAll={handleClearFilters}
              />
              {actionsToDisplay.length > 0 ? (
                actionsToDisplay.map((action) => (
                  <div key={action.id} className="mb-4">
                    <ActionCard
                      action={action}
                      selectClicked={() => handleActionCardClick(action)}
                    />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl bg-cardBackground border border-white text-center">
                  <p className="text-blue-950 font-medium mb-2">No actions match your filters</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Try adjusting the date or filters to see more actions.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      handleClearFilters();
                      setSelectedDate(null);
                    }}
                    className="button button-gradient !px-6"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            <div className="relative order-1 md:order-2 mb-4 md:mb-0 flex flex-col">
              <div
                className={clsx(
                  "w-full rounded-xl overflow-hidden",
                  "map-wrapper-orgs",
                  "md:fixed md:w-[calc(50vw-32px)]",
                  "md:h-[calc(100vh-80px)] md:top-[80px] lg:w-[calc(100vw-563px)]"
                )}
              >
                <MapBox
                  mapStyle={mapStyle}
                  initialViewState={{
                    longitude: 15,
                    latitude: 30,
                    zoom: 1.6,
                  }}
                  showMapStyleSwitch={true}
                  mapRef={mapRef as React.RefObject<MapRef>}
                >
                  <ClusteredActionsLayer
                    actions={filteredActions}
                    onActionClick={handleMarkerClick}
                  />
                </MapBox>
                {/* Time slider on desktop: floating on map */}
                <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-10 lg:bottom-[100px] w-[calc(100%-32px)] max-w-[500px]">
                  <TimeSlider
                    actions={actions}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                </div>
                <div
                  className={`hidden lg:block w-[100vw] fixed left-0 bottom-0 z-50 bg-background pr-8 h-[80px]`}
                >
                  <Footer />
                </div>
              </div>
              {/* Time slider on mobile: below map */}
              <div className="md:hidden w-full mt-4">
                <TimeSlider
                  actions={actions}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
