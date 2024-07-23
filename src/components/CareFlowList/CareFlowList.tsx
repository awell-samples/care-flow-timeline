"use client";
import { usePathway } from "../../hooks";
import { Text } from "@radix-ui/themes";
import clsx from "clsx";
import { FC } from "react";

interface CareFlowItemProps {
  careFlowId: string;
  isSelected: boolean;
  onSelect: () => void;
  colorClass?: string;
}

const CareFlowItem: FC<CareFlowItemProps> = ({
  careFlowId,
  isSelected,
  onSelect,
  colorClass,
}) => {
  const { data: careFlow, loading, error } = usePathway(careFlowId);

  return (
    <div
      className={clsx(
        "flex px-4 py-3 cursor-pointer gap-x-4 items-center border border-transparent rounded-lg hover:bg-slate-50 hover:border-slate-100",
        isSelected && "border-slate-200 bg-slate-100"
      )}
      onClick={onSelect}
      data-careflow-id={careFlowId}
    >
      {colorClass && (
        <span
          className={clsx("w-2.5 h-2.5 rounded-full", colorClass && colorClass)}
        />
      )}
      <Text size="2" weight="medium" className="text-slate-800">
        {loading === false ? careFlow.title : "Loading"}
      </Text>
    </div>
  );
};

interface CareFlowListProps {
  careFlowIds: string[];
  value: string | null;
  onSelect: (option: string | null) => void;
  colorClasses?: { id: string; colorClass: string }[];
}

export const CareFlowList: FC<CareFlowListProps> = ({
  careFlowIds,
  value = "0",
  onSelect,
  colorClasses,
}) => {
  return (
    <div className="w-full flex flex-col gap-y-1">
      <div
        className={clsx(
          "flex px-4 py-3 cursor-pointer gap-x-12 border border-transparent rounded-lg hover:bg-slate-50 hover:border-slate-100",
          value === null && "rounded-lg border border-slate-200 bg-slate-100"
        )}
        onClick={() => onSelect(null)}
      >
        <Text size="2" weight="medium" className="text-slate-800">
          All care flows
        </Text>
      </div>
      {careFlowIds.sort().map((careFlowId, index) => (
        <CareFlowItem
          key={careFlowId}
          careFlowId={careFlowId}
          isSelected={value === careFlowId}
          onSelect={() => onSelect(careFlowId)}
          colorClass={colorClasses.find((_) => _.id === careFlowId).colorClass}
        />
      ))}
    </div>
  );
};
