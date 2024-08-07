"use client";
import { enumActivityObjectType } from "@awell-health/awell-sdk";
import { usePatient, usePatientPathways } from "../../../hooks";
import { Button, Card, Heading, Tabs, Text, Tooltip } from "@radix-ui/themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isEmpty, isNil } from "lodash";
import { getColorClasses } from "../../../lib/utils/getColorClasses";
import {
  PatientTimeline,
  SingleTimeline,
  StakeholdersFilter,
  CareFlowList,
} from "./components/";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons";

export default function Page({ params }: { params: { id: string } }) {
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(
    null
  );
  const [selectedCareFlowId, setSelectedCareFlowId] = useState<string | null>(
    null
  );
  const [uniquecareFlowIdsWithColors, setUniquecareFlowIdsWithColors] =
    useState<{ id: string; colorClass: string }[]>([]);
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const {
    data: patient,
    loading: loadingPatient,
    error: patientError,
  } = usePatient(params.id);

  const {
    data: patientCareFlows,
    loading: loadingPatientCareFlows,
    error: patientCareFlowsError,
  } = usePatientPathways(params.id);

  const filters = useMemo(
    () => ({
      patient_id: params.id,
      activity_type: [
        enumActivityObjectType.FORM,
        enumActivityObjectType.MESSAGE,
        enumActivityObjectType.PLUGIN_ACTION,
        enumActivityObjectType.CLINICAL_NOTE,
        enumActivityObjectType.CHECKLIST,
      ],
    }),
    [params]
  );

  const sorting = useMemo(
    () => ({
      field: "date",
      direction: sortDirection,
    }),
    [sortDirection]
  );

  useEffect(() => {
    if (!isEmpty(patientCareFlows)) {
      const careFlowIds = patientCareFlows.map((c) => c.id);

      const uniqueCareFlowColorClasses = getColorClasses(careFlowIds);

      const combinedState = careFlowIds.map((id, index) => ({
        id,
        colorClass: uniqueCareFlowColorClasses[index],
      }));

      setUniquecareFlowIdsWithColors(combinedState);
    }
  }, [patientCareFlows]);

  const handleStakeholderFilter = useCallback(
    (stakeholderId: string | null) => {
      setSelectedStakeholder(stakeholderId === "all" ? null : stakeholderId);
    },
    []
  );

  const releaseIds = useMemo(() => {
    if (!isNil(selectedCareFlowId))
      return [
        patientCareFlows.find((_) => _.id === selectedCareFlowId).release_id,
      ];

    return Array.from(new Set(patientCareFlows.map((_) => _.release_id)));
  }, [patientCareFlows, selectedCareFlowId]);

  const careFlowIds = useMemo(() => {
    return uniquecareFlowIdsWithColors.map((_) => _.id);
  }, [uniquecareFlowIdsWithColors]);

  const handleCareFlowSelection = (id: string) => {
    setSelectedStakeholder(null);
    setSelectedCareFlowId(id);
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <Card className="p-8">
        <Heading as="h1" size="6">
          {patient && patient.profile.name}
        </Heading>

        <Tabs.Root defaultValue="activity">
          <Tabs.List className="mt-8 mb-6" size="2">
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
            <Tabs.Trigger value="profile" disabled={true}>
              Profile
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="activity">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <Heading as="h2" size="5">
                  Care flow activity
                </Heading>
                <Text size="3">
                  Events executed in care flows the patient is enrolled in.
                </Text>
              </div>
              <div className="flex gap-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (sortDirection === "asc") {
                      setSortDirection("desc");
                      return;
                    }

                    setSortDirection("asc");
                  }}
                >
                  {sortDirection === "asc" ? (
                    <ArrowDownIcon />
                  ) : (
                    <ArrowUpIcon />
                  )}{" "}
                  Sort
                </Button>
                {!loadingPatientCareFlows && (
                  <StakeholdersFilter
                    releaseIds={releaseIds}
                    value={selectedStakeholder}
                    onSelect={handleStakeholderFilter}
                  />
                )}
                <Tooltip content="Open Single Timeline view">
                  <Button variant="soft" asChild>
                    {selectedCareFlowId && (
                      <a
                        href={`/care-flow/${selectedCareFlowId}`}
                        title="Go back"
                      >
                        <OpenInNewWindowIcon />
                      </a>
                    )}
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="flex gap-x-12">
              <div className="flex-none w-[360px]">
                <CareFlowList
                  careFlowIds={careFlowIds}
                  value={selectedCareFlowId}
                  onSelect={handleCareFlowSelection}
                  colorClasses={uniquecareFlowIdsWithColors}
                />
              </div>
              {/* Timelines */}
              <div className="">
                {selectedCareFlowId === null && patient && (
                  <PatientTimeline
                    patientId={params.id}
                    queryFilters={filters}
                    frontEndFilters={{ stakeholder: selectedStakeholder }}
                    sorting={sorting}
                    colorClasses={uniquecareFlowIdsWithColors}
                  />
                )}
                {selectedCareFlowId !== null && (
                  <SingleTimeline
                    careFlowId={selectedCareFlowId}
                    queryFilters={filters}
                    frontEndFilters={{ stakeholder: selectedStakeholder }}
                    sorting={sorting}
                    colorClass={
                      uniquecareFlowIdsWithColors.find(
                        (_) => _.id === selectedCareFlowId
                      )?.colorClass
                    }
                  />
                )}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Card>
    </div>
  );
}
