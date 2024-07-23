"use client";
import { Timeline, TimelineElement } from "../../../components/Timeline";
import { useActivities } from "../../../hooks";
import { Spinner } from "@radix-ui/themes";
import { FC, useMemo } from "react";

interface PatientTimelineProps {
  patientId: string;
  filters?: {
    activity_status?: string[];
    activity_type?: string[];
  };
  colorClasses: { id: string; colorClass: string }[];
}

export const PatientTimeline: FC<PatientTimelineProps> = ({
  patientId,
  filters,
  colorClasses,
}) => {
  const memoizedFilters = useMemo(
    () => ({
      patient_id: patientId,
      ...(filters && filters),
    }),
    [patientId, filters]
  );

  const {
    data: activities,
    loading: loadingActivities,
    error: activitiesError,
    refresh: refreshActivities,
  } = useActivities({
    filters: memoizedFilters,
  });

  if (loadingActivities) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <Timeline>
      {activities.map((activity) => (
        <TimelineElement
          key={activity.id}
          activity={activity}
          refresh={refreshActivities}
          colorClass={
            colorClasses.find((c) => c.id === activity.stream_id).colorClass
          }
        />
      ))}
    </Timeline>
  );
};
