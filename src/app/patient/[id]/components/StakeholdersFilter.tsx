"use client";
import { useStakeholdersByReleaseIds } from "../../../../hooks";
import { Select } from "@radix-ui/themes";
import { FC, useCallback, useMemo } from "react";

interface StakeholdersFilterProps {
  releaseIds: string[];
  value: string;
  onSelect: (stakeholderId: string | null) => void;
}

export const StakeholdersFilter: FC<StakeholdersFilterProps> = ({
  releaseIds,
  value,
  onSelect,
}) => {
  const releaseIdsMemoized = useMemo(() => releaseIds, [releaseIds]);

  const {
    data: stakeholders,
    loading: loadingStakeholders,
    error: stakeholdersError,
  } = useStakeholdersByReleaseIds({ releaseIds: releaseIdsMemoized });

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
    },
    [onSelect]
  );

  console.log(value);

  return (
    <Select.Root
      defaultValue="all"
      value={value === null ? "all" : value}
      onValueChange={handleSelect}
    >
      <Select.Trigger />
      <Select.Content position="popper">
        <Select.Item value="all">All stakeholders</Select.Item>
        {!loadingStakeholders &&
          stakeholders.map((stakeholder) => (
            <Select.Item value={stakeholder.label.en} key={stakeholder.id}>
              {stakeholder.label.en}
            </Select.Item>
          ))}
      </Select.Content>
    </Select.Root>
  );
};
