import { useHostedPagesActivitySession } from "../../hooks/useHostedPagesActivitySession";
import { Activity, enumActivitySubjectType } from "@awell-health/awell-sdk";
import { Dialog, Button, Flex, Spinner } from "@radix-ui/themes";
import { useState } from "react";

interface CompleteTaskProps {
  activity: Activity;
  onClose: () => void;
}

export const CompleteTask: React.FC<CompleteTaskProps> = ({
  activity,
  onClose,
}) => {
  const { createSession } = useHostedPagesActivitySession();
  const [sessionUrl, setSessionUrl] = useState<undefined | string>(undefined);
  const stakeholderId = getStakeholderId(activity);
  const handleCompleteTask = async () => {
    const res = await createSession({
      careFlowId: activity.stream_id,
      stakeholderId,
    });

    setSessionUrl(res);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <div className="mt-2 mb-2">
          <Button size="1" variant="soft" onClick={() => handleCompleteTask()}>
            Complete activity
          </Button>
        </div>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="768px" size="4">
        <Dialog.Title>Complete activity</Dialog.Title>

        {sessionUrl === undefined && (
          <div>
            <Spinner size="3" className="mx-auto" />
          </div>
        )}
        {sessionUrl && (
          <div className="w-full relative">
            <iframe
              className="w-full border-0 min-h-[500px]"
              src={sessionUrl}
            />
          </div>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={onClose}>
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

function getStakeholderId(activity: Activity) {
  switch (activity.indirect_object?.type) {
    case enumActivitySubjectType.STAKEHOLDER:
      return activity.indirect_object.id;
    case enumActivitySubjectType.PLUGIN:
      if (activity.stakeholders.length > 0) return activity.stakeholders[0].id;
    default:
      return "unknown";
  }
}
