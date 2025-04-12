import { useFormik } from "formik";
import { Badge, Button, Input } from "../atomics";
import { Modal } from "../moleculs";
import { WalletIcon } from "lucide-react";
import * as Yup from "yup";

interface StorePayDuesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  maxValue: number;
}

export default function StorePayDuesModal({
  open,
  setOpen,
  maxValue,
}: StorePayDuesModalProps) {
  const { formik } = useDueForm(maxValue);
  return (
    <>
      <Modal
        setOpen={setOpen}
        variant="default"
        className="max-w-md"
        open={open}
        title="دفع المستحقات"
      >
        <form
          onSubmit={formik.handleSubmit}
          className="mt-4 flex flex-col gap-4"
        >
          <p>
            أقصى قيمة:{" "}
            <Badge variant={"info"}>
              <span className="text-base">{maxValue.toFixed(2)} د.ل</span>
            </Badge>
          </p>
          <Input
            value={formik.values.amount.toString()}
            id="amount"
            placeholder="القيمة"
            onChange={formik.handleChange}
            label="القيمة"
            onBlur={formik.handleBlur}
            variant={
              formik.errors.amount && formik.touched.amount
                ? "default-error"
                : "default"
            }
            message={
              formik.errors.amount && formik.touched.amount
                ? formik.errors.amount
                : ""
            }
          />
          <Button type="submit" variant="primary-bg" className="mt-4">
            دفع <WalletIcon className="h-5 w-5" />
          </Button>
        </form>
      </Modal>
      <Button
        onClick={() => setOpen(true)}
        size="md"
        variant="primary-outline"
        href="/outlet/edit"
      >
        دفع المستحقات
      </Button>
    </>
  );
}

const useDueForm = (maxValue: number) => {
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("يجب إدخال القيمة")
      .max(maxValue, "يجب ألا تتخطى القيمة " + maxValue)
      .positive("يجب أن يقوم القيمة أكبر من صفر")
      .typeError("يمكنك إدخال أرقام فقط"),
  });
  const formik = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema,
    onSubmit: () => {},
  });
  return { formik };
};
