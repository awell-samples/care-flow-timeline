"use client";
import { Timeline, TimelineElement } from "../../../components/Timeline";
import {
  usePathway,
  usePathwayActivities,
  useStakeholdersByReleaseIds,
} from "../../../hooks";
import { enumActivityObjectType } from "@awell-health/awell-sdk";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretLeftIcon,
} from "@radix-ui/react-icons";
import { Card, Button, Heading, Spinner, Select } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { PatientInfo } from "../../../components/PatientInfo";

export default function Page({ params }: { params: { id: string } }) {
  const [releaseIds, setReleaseIds] = useState<string[]>([]);
  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const { data: careFlowData, loading: loadingPathway } = usePathway(params.id);
  const filters = useMemo(
    () => ({
      activity_type: [
        enumActivityObjectType.FORM,
        enumActivityObjectType.MESSAGE,
        enumActivityObjectType.PLUGIN_ACTION,
        enumActivityObjectType.CLINICAL_NOTE,
        enumActivityObjectType.CHECKLIST,
      ],
    }),
    []
  );

  const sorting = useMemo(
    () => ({
      field: "date",
      direction: sortDirection,
    }),
    [sortDirection]
  );

  const {
    data: activities,
    loading: loadingActivities,
    error: activitiesError,
    refresh,
  } = usePathwayActivities({
    careFlowId: params.id,
    filters: filters,
    sorting,
  });

  useEffect(() => {
    if (careFlowData?.release_id) {
      setReleaseIds([careFlowData.release_id]);
    }
  }, [careFlowData]);

  useEffect(() => {
    if (careFlowData?.patient_id) {
      setPatientId(careFlowData.patient_id);
    }
  }, [careFlowData]);

  const {
    data: stakeholders,
    loading: loadingStakeholders,
    error: stakeholdersError,
  } = useStakeholdersByReleaseIds({
    releaseIds,
  });

  const handleStakeholderFilter = (stakeholderId: string | null) => {
    setSelectedStakeholder(stakeholderId === "all" ? null : stakeholderId);
  };

  const filteredActivities = useMemo(() => {
    if (!selectedStakeholder) return activities;

    if (selectedStakeholder === "Patient")
      return activities.filter(
        (activity) =>
          activity.indirect_object?.type === enumActivityObjectType.PATIENT
      );

    return activities.filter(
      (activity) => activity.indirect_object?.name === selectedStakeholder
    );
  }, [activities, selectedStakeholder]);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card>
        {/* Heading */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" asChild>
            <a href={`/patient/${patientId}`} title="Go back">
              <CaretLeftIcon /> Go back
            </a>
          </Button>
        </div>
        {/* Patient info */}
        {patientId && <PatientInfo patientId={patientId} />}
        {/* Timeline */}
        <div className="mt-8">
          <div className="flex justify-between">
            <Heading as="h2" size="5">
              Activity Feed
            </Heading>

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
                {sortDirection === "asc" ? <ArrowDownIcon /> : <ArrowUpIcon />}{" "}
                Sort
              </Button>
              <Select.Root
                defaultValue="all"
                onValueChange={handleStakeholderFilter}
              >
                <Select.Trigger />
                <Select.Content position="popper">
                  <Select.Item value="all">All stakeholders</Select.Item>
                  {stakeholders.map((stakeholder) => (
                    <Select.Item
                      value={stakeholder.label.en}
                      key={stakeholder.id}
                    >
                      {stakeholder.label.en}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          {loadingActivities && (
            <div className="flex justify-center py-8">
              <Spinner size="3" />
            </div>
          )}
          <Timeline>
            {filteredActivities.map((activity) => (
              <TimelineElement
                key={activity.id}
                activity={activity}
                refresh={refresh}
              />
            ))}
          </Timeline>
        </div>
      </Card>
    </div>
  );
}
