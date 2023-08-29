"use client";

import APIAlert from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";

import { useParams } from "next/navigation";

interface APIListProps {
  entityName: string;
  entityIdName: string;
}

export const APIList: React.FC<APIListProps> = ({
  entityName,
  entityIdName,
}) => {
  const { storeId } = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${storeId}`;

  return (
    <>
      <APIAlert
        variant="public"
        title="GET"
        description={`${baseUrl}/${entityName}`}
      />
      <APIAlert
        variant="public"
        title="GET"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <APIAlert
        variant="admin"
        title="POST"
        description={`${baseUrl}/${entityName}`}
      />

      <APIAlert
        variant="admin"
        title="PATCH"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />

      <APIAlert
        variant="admin"
        title="DELETE"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};
