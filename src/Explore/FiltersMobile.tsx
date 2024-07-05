import { useState } from "react";
import { FunnelSimple } from "@phosphor-icons/react";
import { useFiltersDispatch, useFiltersState } from "../context/filters";
import { Modal } from "../shared/components/Modal";
import FiltersModal from "./FiltersModal";

export default (): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, filteredAssets } = useFiltersState();
  const dispatchFilters = useFiltersDispatch();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // count the number of filters applied if any type is selected count as 1
  const filtersCount =
    (Object.keys(filters.assetTypes).length > 0 ? 1 : 0) +
    (filters.provider ? 1 : 0) +
    (filters.chainId ? 1 : 0);

  return (
    <div className="flex justify-between py-4">
      <div className="rounded-full h-7 px-3 flex items-center bg-blue-950 text-white">
        {filteredAssets.length} assets listed
      </div>
      <div
        onClick={handleOpenModal}
        className="rounded-full h-7 px-3 flex items-center bg-white gap-2"
      >
        <FunnelSimple size={16} />
        filters
        <div className="h-[18px] w-[18px] flex items-center justify-center rounded-full text-xs bg-blue-950 text-white">
          {filtersCount}
        </div>
      </div>
      {isModalOpen && (
        <Modal fullScreen onClose={() => setIsModalOpen(false)}>
          <FiltersModal />
        </Modal>
      )}
    </div>
  );
};
