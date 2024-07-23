"use client";
import { enumActivityObjectType } from "@awell-health/awell-sdk";
import { Timeline, TimelineElement } from "../../../../components/Timeline";
import { useActivities } from "../../../../hooks";
import { Spinner } from "@radix-ui/themes";
import { FC, useMemo } from "react";

interface PatientTimelineProps {
  patientId: string;
  queryFilters?: {
    activity_status?: string[];
    activity_type?: string[];
  };
  frontEndFilters?: {
    stakeholder?: string;
  };
  colorClasses: { id: string; colorClass: string }[];
}

export const PatientTimeline: FC<PatientTimelineProps> = ({
  patientId,
  queryFilters,
  frontEndFilters,
  colorClasses,
}) => {
  const memoizedFilters = useMemo(
    () => ({
      patient_id: patientId,
      ...(queryFilters && queryFilters),
    }),
    [patientId, queryFilters]
  );

  const memoizedStakeholdersFilters = useMemo(
    () => frontEndFilters?.stakeholder,
    [frontEndFilters]
  );

  const {
    data: activities,
    loading: loadingActivities,
    error: activitiesError,
    refresh: refreshActivities,
  } = useActivities({
    filters: memoizedFilters,
  });

  const filteredActivities = useMemo(() => {
    if (!memoizedStakeholdersFilters) return activities;

    if (memoizedStakeholdersFilters === "Patient")
      return activities.filter(
        (activity) =>
          activity.indirect_object?.type === enumActivityObjectType.PATIENT
      );

    return activities.filter(
      (activity) =>
        activity.indirect_object?.name === memoizedStakeholdersFilters
    );
  }, [activities, memoizedStakeholdersFilters]);

  if (loadingActivities) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Timeline>
        {filteredActivities.map((activity) => (
          <TimelineElement
            key={activity.id}
            activity={activity}
            refresh={refreshActivities}
            colorClass={
              colorClasses.find((c) => c.id === activity.stream_id).colorClass
            }
            renderColorIndicatorForLastItem={true}
          />
        ))}
      </Timeline>
    </div>
  );
};
