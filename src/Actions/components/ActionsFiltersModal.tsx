import clsx from "clsx";
import { useMemo, useState } from "react";
import { Action, ActionProtocol, SDG } from "../../shared/types";
import { getSDGShortTitle } from "../../shared/sdgGoals";
import { CheckboxBox } from "../../shared/components";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

interface ActionsFiltersModalProps {
  actions: Action[];
  selectedProtocols: string[];
  selectedSDGs: number[];
  onProtocolsChange: (protocols: string[]) => void;
  onSDGsChange: (sdgs: number[]) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const ActionsFiltersModal = ({
  actions,
  selectedProtocols,
  selectedSDGs,
  onProtocolsChange,
  onSDGsChange,
  onClearAll,
  onClose,
}: ActionsFiltersModalProps): JSX.Element => {
  const [openSection, setOpenSection] = useState<"protocol" | "sdg" | null>(null);

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

  const handleProtocolToggle = (id: string) => {
    if (selectedProtocols.includes(id)) {
      onProtocolsChange(selectedProtocols.filter((p) => p !== id));
    } else {
      onProtocolsChange([...selectedProtocols, id]);
    }
  };

  const handleSDGToggle = (id: number) => {
    if (selectedSDGs.includes(id)) {
      onSDGsChange(selectedSDGs.filter((s) => s !== id));
    } else {
      onSDGsChange([...selectedSDGs, id]);
    }
  };

  return (
    <div className="flex flex-col h-full pb-24">
      <div className="text-2xl font-semibold mb-6">Filters</div>

      <div className="grid gap-3">
        {/* Protocol filter section */}
        <div
          onClick={() => setOpenSection(openSection === "protocol" ? null : "protocol")}
          className={clsx(
            "flex justify-between items-center border-[1px] border-white rounded-lg bg-slate-50",
            "px-4 py-4 font-medium text-lg cursor-pointer",
            selectedProtocols.length > 0 && "!border-blue-950"
          )}
        >
          <div className="text-blue-950">Protocol</div>
          <div className="flex items-center gap-2">
            <span className={selectedProtocols.length > 0 ? "text-primary-500" : "text-slate-400"}>
              {selectedProtocols.length > 0 ? `${selectedProtocols.length} selected` : "All"}
            </span>
            {openSection === "protocol" ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </div>
        </div>
        {openSection === "protocol" && (
          <div className="px-4 py-2 bg-slate-50 rounded-lg max-h-[200px] overflow-y-auto">
            {protocols.map((protocol) => (
              <div
                key={protocol.id}
                className="flex items-center gap-3 py-2 cursor-pointer"
                onClick={() => handleProtocolToggle(protocol.id)}
              >
                <CheckboxBox
                  className="flex-shrink-0 !border-blue-950"
                  checked={selectedProtocols.includes(protocol.id)}
                />
                {protocol.logo && (
                  <img
                    src={protocol.logo}
                    alt={protocol.name}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span>{protocol.name}</span>
              </div>
            ))}
            {protocols.length === 0 && (
              <div className="text-gray-500 py-2">No protocols available</div>
            )}
          </div>
        )}

        {/* SDG filter section */}
        <div
          onClick={() => setOpenSection(openSection === "sdg" ? null : "sdg")}
          className={clsx(
            "flex justify-between items-center border-[1px] border-white rounded-lg bg-slate-50",
            "px-4 py-4 font-medium text-lg cursor-pointer",
            selectedSDGs.length > 0 && "!border-blue-950"
          )}
        >
          <div className="text-blue-950">SDG Outcomes</div>
          <div className="flex items-center gap-2">
            <span className={selectedSDGs.length > 0 ? "text-primary-500" : "text-slate-400"}>
              {selectedSDGs.length > 0 ? `${selectedSDGs.length} selected` : "All"}
            </span>
            {openSection === "sdg" ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </div>
        </div>
        {openSection === "sdg" && (
          <div className="px-4 py-2 bg-slate-50 rounded-lg max-h-[200px] overflow-y-auto">
            {sdgs.map((sdg) => (
              <div
                key={sdg.id}
                className="flex items-center gap-3 py-2 cursor-pointer"
                onClick={() => handleSDGToggle(sdg.id)}
              >
                <CheckboxBox
                  className="flex-shrink-0 !border-blue-950"
                  checked={selectedSDGs.includes(sdg.id)}
                />
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-grayTag text-xs font-bold">
                  {sdg.code}
                </div>
                <span className="text-sm">{getSDGShortTitle(sdg.code, sdg.title)}</span>
              </div>
            ))}
            {sdgs.length === 0 && (
              <div className="text-gray-500 py-2">No SDGs available</div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-auto pt-6">
        <button className="button button-gray !px-8" onClick={onClearAll}>
          Clear
        </button>
        <button className="button button-gradient !px-8" onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  );
};
