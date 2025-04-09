export const convertOrderStatus = (status: string): string => {
  switch (status) {
    case "pending":
      return "قيد الانتظار";
    case "accepted_by_store":
      return "تم القبول من المتجر";
    case "rejected_by_store":
      return "تم الرفض من المتجر";
    case "finding_driver":
      return "جاري البحث عن سائق";
    case "failed_to_find_driver":
      return "فشل في العثور على سائق";
    case "proccessing":
      return "قيد المعالجة";
    case "on_the_road":
      return "في الطريق";
    case "delivered":
      return "تم التوصيل";
    case "returned":
      return "تم الإرجاع";
    case "replaced":
      return "تم الاستبدال";
    case "canceled":
      return "تم الإلغاء";
    default:
      return "غير معروف";
  }
};

export const convertOrderStatusVariant = (
  status: string
): "info" | "success" | "error" | "warning" => {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted_by_store":
      return "success";
    case "rejected_by_store":
      return "error";
    case "finding_driver":
      return "info";
    case "failed_to_find_driver":
      return "error";
    case "proccessing":
      return "info";
    case "on_the_road":
      return "info";
    case "delivered":
      return "success";
    case "returned":
      return "error";
    case "replaced":
      return "warning";
    case "canceled":
      return "error";
    default:
      return "error";
  }
};
