import type React from "react";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Marker } from "react-map-gl";
import { useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import { useNewFiltersState } from "../context/filters";
import { useMapState } from "../context/map";
import { MapBox } from "../shared/components/MapBox";
import { useSupabaseItemById } from "../shared/hooks/useSupabaseItemById";
import type { Action } from "../shared/types";
import ActionCard from "./ActionCard";

export default (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { mapStyle } = useMapState();

  // Try Supabase first
  const { item: supabaseAction } = useSupabaseItemById<Action>("actions_published_view", id);

  // Fallback: find in context (includes static Hedera data)
  const { allActions } = useNewFiltersState();
  const contextAction = useMemo(() => {
    if (supabaseAction) return null;
    return allActions?.find((a) => a.id === id) ?? null;
  }, [supabaseAction, allActions, id]);

  const action = supabaseAction || contextAction;

  if (!action) {
    return (
      <div className="w-svw h-svh flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const hasLocation = action.location?.latitude && action.location?.longitude;

  return (
    <>
      <Helmet>
        <title>{action.title}</title>
        <meta name="description" content={`${action.description?.substring(0, 160) || action.title}...`} />
      </Helmet>
      <Header />
      <div className="main-container">
        <div className="pt-[60px] lg:pt-[80px]">
          <div className="grid lg:grid-cols-[440px_1fr] gap-4">
            <div>
              <ActionCard action={action} selectClicked={() => {}} />
            </div>
            {hasLocation && (
              <div>
                <MapBox
                  mapStyle={mapStyle}
                  initialViewState={{
                    longitude: action.location?.longitude,
                    latitude: action.location?.latitude,
                    zoom: 5,
                  }}
                >
                  <Marker key={action.id} latitude={action.location?.latitude} longitude={action.location?.longitude} />
                </MapBox>
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
