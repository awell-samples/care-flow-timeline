import { timeSince } from "../../lib/utils/timeSince";
import {
  enumActionType,
  enumActivityObjectType,
  enumActivityResolution,
  enumActivityStatus,
  type Activity,
} from "@awell-health/awell-sdk";
import { Text, Strong, Tooltip } from "@radix-ui/themes";
import clsx from "clsx";
import React from "react";
import { FormResults, CompleteTask, ClinicalNote, Checklist } from "./atoms";

interface TimelineElementProps {
  activity: Activity;
  colorClass?: string;
  refresh: () => void;
  renderColorIndicatorForLastItem?: boolean;
}

export const TimelineElement: React.FC<TimelineElementProps> = ({
  activity,
  colorClass,
  refresh,
  renderColorIndicatorForLastItem = false,
}) => {
  const getActivityTitle = () => {
    const title = activity?.action_component?.title ?? "Unsupported title";

    if (activity.status === enumActivityStatus.ACTIVE)
      return (
        <>
          <Strong>
            {title}
            {activity.indirect_object?.type === enumActionType.PLUGIN
              ? ` (${activity.indirect_object.name})`
              : ""}
          </Strong>{" "}
          needs to be completed
        </>
      );

    if (
      activity.status === enumActivityStatus.FAILED ||
      activity.resolution === enumActivityResolution.FAILURE
    )
      return (
        <>
          <Strong>
            {title}
            {activity.indirect_object?.type === enumActionType.PLUGIN
              ? ` (${activity.indirect_object.name})`
              : ""}
          </Strong>{" "}
          failed
        </>
      );

    if (activity.status === enumActivityStatus.DONE)
      return (
        <>
          <Strong>
            {title}
            {activity.indirect_object?.type === enumActionType.PLUGIN
              ? ` (${activity.indirect_object.name})`
              : ""}
          </Strong>{" "}
          was completed
        </>
      );

    return (
      <>
        <Strong>
          {title}
          {activity.indirect_object?.type === enumActionType.PLUGIN
            ? ` (${activity.indirect_object.name})`
            : ""}
        </Strong>{" "}
        has an unknown status
      </>
    );
  };

  return (
    <div className="relative pl-8 py-4 group">
      {/* Vertical line (::before) ~ Date ~ Title ~ Circle marker (::after) */}
      <div
        className={clsx(
          "flex flex-col items-start mb-1 before:absolute before:left-2 before:h-full before:px-[1.5px] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 after:w-2 after:h-2 after:border-4 after:box-content after:border-slate-50 after:rounded-full after:-translate-x-1/2 after:translate-y-1.5",
          activity.status === enumActivityStatus.DONE &&
            activity.resolution !== enumActivityResolution.FAILURE &&
            "after:bg-green-600",
          activity.status === enumActivityStatus.ACTIVE && "after:bg-blue-600",
          activity.status === enumActivityStatus.FAILED ||
            (activity.resolution == enumActivityResolution.FAILURE &&
              "after:bg-red-600"),
          colorClass ? `before:${colorClass}` : "before:bg-slate-300",
          !renderColorIndicatorForLastItem && "group-last:before:hidden"
        )}
      >
        <div className="flex gap-x-2 items-center pt-1">
          <Text size="2">{getActivityTitle()}</Text>
          <Text size="1" color="gray">
            <Tooltip content={new Date(activity.date).toLocaleString()}>
              <time>{timeSince(activity.date)}</time>
            </Tooltip>
          </Text>
        </div>
      </div>
      {/* Content */}
      {activity.status === enumActivityStatus.DONE &&
        activity.object.type === enumActivityObjectType.FORM && (
          <div className="mt-4 mb-2">
            <FormResults
              activityId={activity.id}
              careFlowId={activity.stream_id}
              formId={activity.object.id}
            />
          </div>
        )}
      {activity.status === enumActivityStatus.DONE &&
        activity.object.type === enumActivityObjectType.CLINICAL_NOTE && (
          <div className="mt-4 mb-2">
            <ClinicalNote id={activity.object.id} />
          </div>
        )}
      {activity.status === enumActivityStatus.DONE &&
        activity.object.type === enumActivityObjectType.CHECKLIST && (
          <div className="mt-4 mb-2">
            <Checklist id={activity.object.id} />
          </div>
        )}
      {activity.status === enumActivityStatus.ACTIVE && (
        <CompleteTask activity={activity} onClose={refresh} />
      )}
    </div>
  );
};

export const Timeline: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>{children}</div>;
};
