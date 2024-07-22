"use client";
import {
  Timeline,
  TimelineElement,
  DueDate,
} from "../../../components/Timeline";
import {
  usePathway,
  usePathwayActivities,
  useStakeholdersByReleaseIds,
} from "../../../hooks";
import { enumActivityObjectType } from "@awell-health/awell-sdk";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import {
  Card,
  Text,
  DataList,
  Link,
  Button,
  Strong,
  Heading,
  Spinner,
  Select,
} from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { PatientInfo } from "../../../components/PatientInfo";

export default function Page({ params }: { params: { id: string } }) {
  const [releaseIds, setReleaseIds] = useState<string[]>([]);
  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(
    null
  );

  const { data: pathwayData, loading: loadingPathway } = usePathway(params.id);
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

  const {
    data: activities,
    loading: loadingActivities,
    error: activitiesError,
    refresh,
  } = usePathwayActivities({
    pathwayId: params.id,
    filters: filters,
  });

  useEffect(() => {
    if (pathwayData?.release_id) {
      setReleaseIds([pathwayData.release_id]);
    }
  }, [pathwayData]);

  useEffect(() => {
    if (pathwayData?.patient_id) {
      setPatientId(pathwayData.patient_id);
    }
  }, [pathwayData]);

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
    return activities.filter(
      (activity) => activity.indirect_object?.id === selectedStakeholder
    );
  }, [activities, selectedStakeholder]);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card>
        {/* Heading */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" asChild>
            <a href="#" title="Task List">
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
            <Select.Root
              defaultValue="all"
              onValueChange={handleStakeholderFilter}
            >
              <Select.Trigger />
              <Select.Content position="popper">
                <Select.Item value="all">All stakeholders</Select.Item>
                {stakeholders.map((stakeholder) => (
                  <Select.Item value={stakeholder.id} key={stakeholder.id}>
                    {stakeholder.label.en}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
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
