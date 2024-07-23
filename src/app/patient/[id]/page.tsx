"use client";
import { enumActivityObjectType } from "@awell-health/awell-sdk";
import { usePatient, usePatientPathways } from "../../../hooks";
import { Card, Heading, Tabs, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { CareFlowList } from "../../../components/CareFlowList";
import { getColorClasses } from "../../../lib/utils/getColorClasses";
import { SingleTimeline } from "./SingleTimeline";
import { PatientTimeline } from "./PatientTimeline";

export default function Page({ params }: { params: { id: string } }) {
  const [selectedCareFlowId, setSelectedCareFlowId] = useState<string | null>(
    null
  );
  const [uniquecareFlowIdsWithColors, setUniquecareFlowIdsWithColors] =
    useState<{ id: string; colorClass: string }[]>([]);

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
            <div className="flex flex-col mb-6">
              <Heading as="h2" size="5">
                Care flow activity
              </Heading>
              <Text size="3">
                Events executed in care flows the patient is enrolled in.
              </Text>
            </div>
            <div className="flex gap-x-12">
              <div className="flex-none w-[360px]">
                <CareFlowList
                  careFlowIds={uniquecareFlowIdsWithColors.map((_) => _.id)}
                  value={selectedCareFlowId}
                  onSelect={setSelectedCareFlowId}
                  colorClasses={uniquecareFlowIdsWithColors}
                />
              </div>
              {/* Timelines */}
              <div className="">
                {selectedCareFlowId === null && patient && (
                  <PatientTimeline
                    patientId={params.id}
                    filters={filters}
                    colorClasses={uniquecareFlowIdsWithColors}
                  />
                )}
                {selectedCareFlowId !== null && (
                  <SingleTimeline
                    careFlowId={selectedCareFlowId}
                    filters={filters}
                    colorClass={
                      uniquecareFlowIdsWithColors.find(
                        (_) => _.id === selectedCareFlowId
                      ).colorClass
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
