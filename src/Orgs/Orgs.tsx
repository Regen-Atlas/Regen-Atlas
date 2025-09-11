import { Marker, Popup } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useMapState } from "../context/map";
import { MapBox } from "../shared/components/MapBox";
import Header from "../Header";
import { Org } from "../shared/types";
import supabase from "../shared/helpers/supabase";
import { Link } from "react-router-dom";

export default (): React.ReactElement => {
  const [openPopupOrgId, setOpenPopupOrgId] = useState<number | null>(null);
  const mapRef = useRef<MapRef>();
  const { mapStyle } = useMapState();
  const [orgs, setOrgs] = useState<Array<Org>>([]);

  useEffect(() => {
    async function fetchOrgs() {
      const { error, data } = await supabase
        .from("orgs_published_view")
        .select();

      if (error) {
        console.error("Error fetching orgs:", error);
        return;
      }

      setOrgs(data as Org[]);
    }
    fetchOrgs();
  }, []);

  const handleMarkerClick = (orgId: number) => {
    setOpenPopupOrgId(orgId);
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <div className={clsx("pt-[60px] md:pt-[80px]")}>
          <div>
            <div
              className={clsx(
                "w-full rounded-xl overflow-hidden",
                "map-wrapper-orgs"
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
                {orgs.map((org) => (
                  <div key={org.id}>
                    <Marker
                      key={org.id}
                      latitude={org?.coordinates?.latitude}
                      longitude={org?.coordinates?.longitude}
                      onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        handleMarkerClick(org.id);
                      }}
                    />
                    {openPopupOrgId === org.id && (
                      <Popup
                        latitude={org?.coordinates?.latitude}
                        longitude={org?.coordinates?.longitude}
                        closeButton={false}
                      >
                        <div className="font-bold">{org?.name}</div>
                        <a
                          href={org.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Website
                        </a>
                      </Popup>
                    )}
                  </div>
                ))}
              </MapBox>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
