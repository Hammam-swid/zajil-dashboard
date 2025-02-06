"use client"
import DriverForm from "@/components/templates/DriverForm"
import api from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

interface Driver {
  id: string
  name: string
  phone: string
  email: string
}

export default function Page() {
  const params = useParams()
  // const { data, isLoading } = useQuery({
  //   queryKey: ["driver"],
  //   queryFn: () =>
  //     api
  //       .get(`https://adimtech.com.ly/zajil/api/driver/${params.driverId}`)
  //       .then((res) => res.data as Driver)
  // })
  const driver = {
    id: params.driverId,
    name: "همام سويد",
    phone: "0910064106",
    email: "hmam.swid@gmail.com"
  }
  return <DriverForm driver={driver} formType='edit' />
}
