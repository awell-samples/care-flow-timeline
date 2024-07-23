"use client";
import { enumActivityObjectType } from "@awell-health/awell-sdk";
import { Timeline, TimelineElement } from "../../../../components/Timeline";
import { usePathwayActivities } from "../../../../hooks";
import { Spinner } from "@radix-ui/themes";
import { FC, useMemo } from "react";

interface SingleTimelineProps {
  careFlowId: string;
  queryFilters?: {
    activity_status?: string[];
    activity_type?: string[];
  };
  frontEndFilters?: {
    stakeholder?: string;
  };
  colorClass?: string;
}

export const SingleTimeline: FC<SingleTimelineProps> = ({
  careFlowId,
  queryFilters,
  frontEndFilters,
  colorClass,
}) => {
  const memoizedInput = useMemo(
    () => ({
      careFlowId,
      filters: queryFilters,
    }),
    [careFlowId, queryFilters]
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
  } = usePathwayActivities(memoizedInput);

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
    <Timeline>
      {filteredActivities.map((activity) => (
        <TimelineElement
          key={activity.id}
          activity={activity}
          refresh={refreshActivities}
          colorClass={colorClass}
          renderColorIndicatorForLastItem={true}
        />
      ))}
    </Timeline>
  );
};
