import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapBox } from "../shared/components/MapBox";
import { useMapState } from "../context/map";
import Footer from "../Footer";
import Header from "../Header";
import { useSupabaseItemById } from "../shared/hooks/useSupabaseItemById";
import { Org } from "../shared/types";
import OrgCard from "./OrgCard";
import React from "react";

export default (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { mapStyle } = useMapState();

  const { item: org } = useSupabaseItemById<Org>("orgs_published_view", id);

  if (!org) {
    return (
      <div className="w-svw h-svh flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{org.name}</title>
        <meta
          name="description"
          content={`${org.description.substring(0, 160)}...`}
        />
      </Helmet>
      <Header />
      <div className="main-container">
        <div className="pt-[60px] md:pt-[80px]">
          <div className="grid lg:grid-cols-[440px_1fr] md:grid-cols-2 gap-4">
            <div>
              <OrgCard org={org} />
            </div>
            <div>
              <MapBox
                mapStyle={mapStyle}
                initialViewState={{
                  longitude: org.coordinates.longitude,
                  latitude: org.coordinates.latitude,
                  zoom: 5,
                }}
              ></MapBox>
            </div>
          </div>
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
