"use client";
import { Pathway } from "@awell-health/awell-sdk";
import { usePathways } from "../../../../hooks";
import { Skeleton, Spinner, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { FC } from "react";

interface CareFlowItemProps {
  careFlow?: Pathway;
  isSelected: boolean;
  onSelect: () => void;
  colorClass?: string;
  loading?: boolean;
}

const CareFlowItem: FC<CareFlowItemProps> = ({
  careFlow,
  isSelected,
  onSelect,
  colorClass,
  loading,
}) => {
  return (
    <div
      className={clsx(
        "flex px-4 py-3 cursor-pointer gap-x-4 items-center border border-transparent rounded-lg hover:bg-slate-50 hover:border-slate-100",
        isSelected &&
          "border-slate-300 bg-slate-100 hover:border-slate-300 hover:bg-slate-100"
      )}
      onClick={onSelect}
      data-careflow-id={careFlow?.id}
    >
      {loading && <Spinner size="1" />}
      {!loading && colorClass && (
        <span
          className={clsx(
            "w-2.5 h-2.5 rounded-full",
            colorClass && `bg-${colorClass}`
          )}
        />
      )}
      <div className="flex flex-col">
        <Text size="2" weight="medium" className="text-slate-800">
          <Skeleton loading={loading} width="150">
            {careFlow?.title}
          </Skeleton>
        </Text>
        <Text size="1" weight="medium" className="text-slate-400">
          <Skeleton loading={loading}>
            Started on {new Date(careFlow?.start_date).toLocaleDateString()}
          </Skeleton>
        </Text>
      </div>
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
  const { data: careFlows, loading, error } = usePathways(careFlowIds);

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

      {careFlowIds.map((careFlowId, index) => (
        <CareFlowItem
          key={index}
          careFlow={careFlows.find((_) => _.pathway.id === careFlowId)?.pathway}
          isSelected={value === careFlowId}
          onSelect={() => onSelect(careFlowId)}
          colorClass={colorClasses.find((_) => _.id === careFlowId)?.colorClass}
          loading={loading}
        />
      ))}
    </div>
  );
};
