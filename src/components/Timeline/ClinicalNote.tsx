import { Card, Heading, Spinner, Text } from "@radix-ui/themes";
import { useClinicalNote } from "../../hooks";
import * as Accordion from "@radix-ui/react-accordion";
import React from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface ClinicalNoteProps {
  id: string;
}

interface AccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <div className="rounded bg-slate-100">
    <Accordion.Trigger
      className={clsx(
        "w-full flex items-center justify-between py-2 px-4",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Heading as="h4" size="2">
        {children}
      </Heading>
      <ChevronDownIcon className="AccordionChevron" aria-hidden />
    </Accordion.Trigger>
  </div>
));

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={clsx("AccordionContent", className)}
    {...props}
    ref={forwardedRef}
  >
    {/* You might want to add additional styling to the HTML here */}
    <div className="mx-4 py-2">
      <Text size="2">{children}</Text>
    </div>
  </Accordion.Content>
));

export const ClinicalNote: React.FC<ClinicalNoteProps> = ({ id }) => {
  const { data, loading, error } = useClinicalNote(id);

  return (
    <Card>
      {loading && <Spinner />}
      {!loading && (
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue={`${id}-0`}
          collapsible
        >
          {data.narratives?.map((narrative, i) => (
            <div key={i}>
              <Accordion.Item className="AccordionItem" value={`${id}-${i}`}>
                <AccordionTrigger>{narrative.title}</AccordionTrigger>
                <AccordionContent>
                  <div dangerouslySetInnerHTML={{ __html: narrative.body }} />
                </AccordionContent>
              </Accordion.Item>
            </div>
          ))}
        </Accordion.Root>
      )}
    </Card>
  );
};
