"use client";
import { useActivities } from "../../hooks";
import { Activity, enumActivityObjectType } from "@awell-health/awell-sdk";
import { Card, Heading, Spinner, Table } from "@radix-ui/themes";
import { useMemo } from "react";

type Task = {
  id: string;
  careFlowId: string;
  taskName: string;
  todoCount: number;
  stakeholders: string[];
};

export default function Page({ params }: { params: { id: string } }) {
  const filters = useMemo(
    () => ({
      pathway_definition_id: ["pkXDImd3WyAp"],
      activity_type: [
        enumActivityObjectType.FORM,
        enumActivityObjectType.MESSAGE,
      ],
    }),
    []
  );

  const sorting = useMemo(
    () => ({
      field: "date",
      direction: "asc",
    }),
    []
  );

  const {
    data: activities,
    loading: loadingActivities,
    error: activitiesError,
    refresh: refreshActivities,
  } = useActivities({
    filters,
    sorting,
  });

  const formattedData = useMemo(() => {
    // Group activities by stream ID and then by track ID
    const groupedActivities = activities.reduce<
      Record<
        string,
        Record<
          string,
          {
            trackId: string;
            trackTitle: string;
            count: number;
            stakeholders: Set<string>;
          }
        >
      >
    >((acc, activity) => {
      const streamId = activity.stream_id;
      const trackId = activity.track.id;
      const trackTitle = activity.track.title;

      if (!acc[streamId]) {
        acc[streamId] = {};
      }

      if (!acc[streamId][trackId]) {
        acc[streamId][trackId] = {
          trackId: trackId,
          trackTitle: trackTitle,
          count: 0,
          stakeholders: new Set<string>(),
        };
      }

      acc[streamId][trackId].count += 1;

      if (activity?.indirect_object?.name) {
        acc[streamId][trackId].stakeholders.add(activity.indirect_object.name);
      }

      return acc;
    }, {});

    // Transform the grouped activities into the desired format
    const tasks: Task[] = [];
    for (const [streamId, tracks] of Object.entries(groupedActivities)) {
      for (const track of Object.values(tracks)) {
        tasks.push({
          id: `${streamId}_${track.trackTitle}`,
          careFlowId: `${streamId}`,
          taskName: `${track.trackTitle}`,
          todoCount: track.count,
          stakeholders: Array.from(track.stakeholders),
        });
      }
    }

    return tasks;
  }, [activities]);

  console.log(formattedData);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card className="px-8 py-8">
        {/* Timeline */}
        <div className="flex justify-between">
          <Heading as="h2" size="5">
            Tasks
          </Heading>
        </div>
        {loadingActivities && (
          <div className="flex justify-center py-8">
            <Spinner size="3" />
          </div>
        )}
        {!loadingActivities && formattedData && (
          <div>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Care flow</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Task</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Open items</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>For whom</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {formattedData.map((_row) => (
                  <Table.Row key={_row.id}>
                    <Table.RowHeaderCell>{_row.careFlowId}</Table.RowHeaderCell>
                    <Table.RowHeaderCell>{_row.taskName}</Table.RowHeaderCell>
                    <Table.Cell>{_row.todoCount}</Table.Cell>
                    <Table.Cell>{_row.stakeholders.join(", ")}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        )}
      </Card>
    </div>
  );
}
