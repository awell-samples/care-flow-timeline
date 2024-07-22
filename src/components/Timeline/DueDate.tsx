import { useEffect, useState, type FC } from "react";
import { useBaselineInfo } from "../../hooks";
import { BaselineDataPoint } from "@awell-health/awell-sdk";
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
import { isEmpty, isNil } from "lodash";

interface DueDateProps {
  pathway_id: string;
}

export const DueDate: FC<DueDateProps> = ({ pathway_id }) => {
  const {
    data: dataPointDefinitions,
    loading: loadingDataPointDefinitions,
    error: dataPointDefinitionsError,
  } = useBaselineInfo({
    pathway_id,
  });

  const [dueDate, setDueDate] = useState<BaselineDataPoint | null>(null);

  useEffect(() => {
    const dueDate = dataPointDefinitions.find(
      (dpd) => dpd.definition.key == "dueDate"
    );
    if (dueDate) {
      setDueDate(dueDate);
    }
  }, [dataPointDefinitions]);

  useEffect(() => {}, [dueDate]);

  if (isNil(dueDate) || isEmpty(dueDate)) {
    return (
      <div className="flex flex-col">
        <Text size="1">No Due Date</Text>
      </div>
    );
  } else {
    return (
      <Text size="1">
        Due{" "}
        {new Date(dueDate.value as string).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        })}
      </Text>
    );
  }
};
