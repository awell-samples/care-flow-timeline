import {
  Answer,
  enumUserQuestionType,
  Question,
  UserQuestionType,
} from "@awell-health/awell-sdk";
import { Card, Heading, Spinner, Table } from "@radix-ui/themes";
import { isEmpty } from "lodash";
import { useForm, useFormResponse } from "../../../hooks";

interface FormResultsProps {
  careFlowId: string;
  activityId: string;
  formId: string;
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
  formId,
  careFlowId,
  activityId,
}) => {
  const { data: formDefinition, loading: loadingFormDefinition } =
    useForm(formId);
  const {
    data: formResponse,
    loading: loadingFormResponse,
    error,
  } = useFormResponse({ careFlowId, activityId });

  return (
    <Card>
      <Heading size="3">Answers</Heading>
      {(loadingFormDefinition || loadingFormResponse) && <Spinner />}
      {!loadingFormDefinition && !loadingFormResponse && (
        <Table.Root size="1" variant="surface" className="mt-4 mb-2">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Question</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Answer</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {formResponse.map((answer) => {
              const questionDefinition = formDefinition.questions.find(
                (question) => question.id === answer.question_id
              );

              return (
                <Table.Row key={answer.question_id}>
                  <Table.RowHeaderCell>
                    {questionDefinition?.title ?? "Question label not found"}{" "}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {questionDefinition
                      ? renderAnswer(
                          questionDefinition.userQuestionType,
                          answer
                        )
                      : "Question and answer not found"}
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
