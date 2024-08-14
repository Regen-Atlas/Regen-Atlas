import { useParams } from "react-router-dom";
import { useFiltersState } from "../context/filters";
import AssetCard from "../Explore/AssetCard";

export default (): React.ReactElement => {
  const { assetId } = useParams<{ assetId: string }>();
  const { filteredAssets } = useFiltersState();
  const asset = filteredAssets.find((a) => a.id === assetId);

  return (
    <div className="main-container">
      <div className="pt-[60px] md:pt-[100px]">
        {!asset && (
          <div className="text-center text-white text-2xl">Asset not found</div>
        )}
        {asset && (
          <div className="grid grid-cols-[500px_1fr] gap-4">
            <AssetCard
              asset={asset}
              onPinClicked={() => {}}
              displayLearnMore={false}
            />
            <div></div>
          </div>
        )}
      </div>
      <h1>Asset Details: {assetId}</h1>
    </div>
  );
};
