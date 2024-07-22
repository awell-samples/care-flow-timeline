import { Card, Heading, Spinner, Text } from "@radix-ui/themes";
import { useChecklist } from "../../hooks";
import React from "react";
import { CheckboxIcon } from "@radix-ui/react-icons";

interface ChecklistProps {
  id: string;
}

export const Checklist: React.FC<ChecklistProps> = ({ id }) => {
  const { data, loading, error } = useChecklist(id);

  return (
    <Card>
      <Heading size="3">Checklist</Heading>
      {loading && <Spinner />}
      {!loading && (
        <ul className="mt-2 flex flex-col gap-y-1">
          {data.items.map((item, index) => (
            <li key={index} className="flex items-center gap-x-2">
              <CheckboxIcon className="w-5 h-5 text-green-600 relative top-[1px]" />{" "}
              <Text size="3">{item}</Text>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
