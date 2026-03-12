import { FunnelSimple } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Action, ActionProtocol, SDG } from "../../shared/types";
import { getSDGShortTitle } from "../../shared/sdgGoals";
import { ActionsFilterDropdown } from "./ActionsFilterDropdown";
import { Modal } from "../../shared/components/Modal";
import { ActionsFiltersModal } from "./ActionsFiltersModal";

interface ActionsFiltersBarProps {
  actions: Action[];
  filteredCount: number;
  selectedProtocols: string[];
  selectedSDGs: number[];
  onProtocolsChange: (protocols: string[]) => void;
  onSDGsChange: (sdgs: number[]) => void;
  onClearAll: () => void;
}

export const ActionsFiltersBar = ({
  actions,
  filteredCount,
  selectedProtocols,
  selectedSDGs,
  onProtocolsChange,
  onSDGsChange,
  onClearAll,
}: ActionsFiltersBarProps): JSX.Element => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const { protocols, sdgs } = useMemo(() => {
    const protocolMap = new Map<string, ActionProtocol>();
    const sdgMap = new Map<number, SDG>();

    for (const action of actions) {
      for (const proof of action.proofs) {
        if (proof.protocol && !protocolMap.has(proof.protocol.id)) {
          protocolMap.set(proof.protocol.id, proof.protocol);
        }
      }
      for (const sdg of action.sdg_outcomes) {
        if (!sdgMap.has(sdg.id)) {
          sdgMap.set(sdg.id, sdg);
        }
      }
    }

    return {
      protocols: Array.from(protocolMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      sdgs: Array.from(sdgMap.values()).sort((a, b) =>
        parseInt(a.code, 10) - parseInt(b.code, 10)
      ),
    };
  }, [actions]);

  const protocolOptions = protocols.map((p) => ({
    id: p.id,
    name: p.name,
    logo: p.logo,
  }));

  const sdgOptions = sdgs.map((s) => ({
    id: s.id,
    name: `${s.code} - ${getSDGShortTitle(s.code, s.title)}`,
  }));

  const hasActiveFilters =
    selectedProtocols.length > 0 ||
    selectedSDGs.length > 0;

  const filtersCount =
    (selectedProtocols.length > 0 ? 1 : 0) +
    (selectedSDGs.length > 0 ? 1 : 0);

  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:block bg-cardBackground rounded-xl p-4 mb-4 border border-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ActionsFilterDropdown
              label="Protocol"
              options={protocolOptions}
              selectedIds={selectedProtocols}
              onSelectionChange={(ids) => onProtocolsChange(ids as string[])}
            />
            <ActionsFilterDropdown
              label="SDG"
              options={sdgOptions}
              selectedIds={selectedSDGs}
              onSelectionChange={(ids) => onSDGsChange(ids as number[])}
            />
          </div>

          <div className="rounded-full h-7 px-3 flex items-center bg-blue-950 text-white text-sm">
            {filteredCount} action{filteredCount !== 1 ? "s" : ""} listed
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      <div className="md:hidden flex justify-between pb-4">
        <div className="rounded-full h-7 px-3 flex items-center bg-blue-950 text-white text-sm">
          {filteredCount} action{filteredCount !== 1 ? "s" : ""}
        </div>
        <div
          onClick={() => setIsMobileModalOpen(true)}
          className="rounded-full h-7 px-3 flex items-center bg-white gap-2 cursor-pointer"
        >
          <FunnelSimple size={16} />
          <span className="text-sm">filters</span>
          {filtersCount > 0 && (
            <div className="h-[18px] w-[18px] flex items-center justify-center rounded-full text-xs bg-blue-950 text-white">
              {filtersCount}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters modal */}
      {isMobileModalOpen && (
        <Modal fullScreen onClose={() => setIsMobileModalOpen(false)}>
          <ActionsFiltersModal
            actions={actions}
            selectedProtocols={selectedProtocols}
            selectedSDGs={selectedSDGs}
            onProtocolsChange={onProtocolsChange}
            onSDGsChange={onSDGsChange}
            onClearAll={onClearAll}
            onClose={() => setIsMobileModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};
