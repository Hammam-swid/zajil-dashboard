"use client";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import { VehicleType } from "@/types";
const getVehicleTypes = async () => {
  const res = await api.get<{ data: VehicleType[] }>(
    "/dashboards/vehicle-types"
  );
  return res.data.data;
};
export default function Page() {
  const { data: vehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: () => getVehicleTypes(),
  });
  return (
    <div>
      {vehicleTypes?.map((type) => (
        <div key={type.id}>{type.name}</div>
      ))}
    </div>
  );
}
