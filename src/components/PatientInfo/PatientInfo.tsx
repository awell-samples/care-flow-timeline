"use client";
import { usePatient } from "../../hooks";
import { DataList, Link, Spinner } from "@radix-ui/themes";
import { FC } from "react";

interface PatientInfoProps {
  patientId: string;
}

export const PatientInfo: FC<PatientInfoProps> = ({ patientId }) => {
  const { data, loading, error } = usePatient(patientId);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <DataList.Root
      orientation={{ initial: "vertical", sm: "horizontal" }}
      className="border border-dashed rounded-md p-2"
    >
      <DataList.Item>
        <DataList.Label minWidth="88px">Name</DataList.Label>
        <DataList.Value>{data.profile.name}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Mobile phone</DataList.Label>
        <DataList.Value>{data.profile.mobile_phone}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Email</DataList.Label>
        <DataList.Value>
          <Link href={data.profile.email}>{data.profile.email}</Link>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
};
