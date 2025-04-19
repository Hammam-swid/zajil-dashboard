"use client";

import StoreForm from "@/components/templates/StoreForm";
import api from "@/lib/api";
import { Store } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getStore = async (storeId: string) => {
  const res = await api.get<{ data: Store }>(`/dashboards/stores/${storeId}`);
  return res.data.data;
};

export default function Page() {
  const { storeId } = useParams();
  const { data: store, isLoading } = useQuery({
    queryKey: ["store-details", { storeId }],
    queryFn: () => getStore(storeId),
  });
  return <div>{store && <StoreForm type="edit" store={store} />}</div>;
}
