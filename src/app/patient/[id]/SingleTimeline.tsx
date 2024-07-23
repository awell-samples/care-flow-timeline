"use client";
import { Timeline, TimelineElement } from "../../../components/Timeline";
import { usePathwayActivities } from "../../../hooks";
import { Spinner } from "@radix-ui/themes";
import { FC, useMemo } from "react";

interface SingleTimelineProps {
  careFlowId: string;
  filters?: {
    activity_status?: string[];
    activity_type?: string[];
  };
  colorClass?: string;
}

export const SingleTimeline: FC<SingleTimelineProps> = ({
  careFlowId,
  filters,
  colorClass,
}) => {
  const memoizedInput = useMemo(
    () => ({
      careFlowId,
      filters,
    }),
    [careFlowId, filters]
  );

  const {
    data: activities,
    loading: loadingActivities,
    error: activitiesError,
    refresh: refreshActivities,
  } = usePathwayActivities(memoizedInput);

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
          colorClass={colorClass}
        />
      ))}
    </Timeline>
  );
};
