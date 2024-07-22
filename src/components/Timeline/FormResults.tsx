import { useFormResponse } from "../../hooks/useFormResponse";
import {
  Answer,
  enumUserQuestionType,
  Question,
  UserQuestionType,
} from "@awell-health/awell-sdk";
import { Card, Heading, Spinner, Table } from "@radix-ui/themes";
import { isEmpty } from "lodash";

interface FormResultsProps {
  pathwayId: string;
  activityId: string;
  formQuestions?: Question[];
}

const renderAnswer = (
  questionType: UserQuestionType,
  answer: Answer
): string => {
  if (questionType === enumUserQuestionType.YES_NO)
    return answer.value === "0"
      ? "No"
      : answer.value === "1"
        ? "Yes"
        : "Unanswered";

  return !isEmpty(answer.label) ? answer.label : answer.value;
};

export const FormResults: React.FC<FormResultsProps> = ({
  formQuestions = [],
  pathwayId,
  activityId,
}) => {
  const { data, loading, error } = useFormResponse({ pathwayId, activityId });

  return (
    <Card>
      <Heading size="3">Answers</Heading>
      {loading && <Spinner />}
      {!loading && (
        <Table.Root size="1" variant="surface" className="mt-4 mb-2">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Question</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Answer</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map((answer) => {
              const questionDefinition = formQuestions.find(
                (question) => question.id === answer.question_id
              );

              return (
                <Table.Row key={answer.question_id}>
                  <Table.RowHeaderCell>
                    {questionDefinition?.title ?? "Question label not found"}{" "}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {renderAnswer(questionDefinition.userQuestionType, answer)}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      )}
    </Card>
  );
};
