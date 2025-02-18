import { UploadSimpleIcon } from "@/assets/icons";
import { Button } from "../atomics";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

interface DropzoneProps {
  fieldName: string;
  file?: File | null;
  arabicName?: string;
  className?: string;
  setField: (field: string, value: any) => void;
  setTouched: (field: string, value: boolean) => void;
}

export default function Dropzone({
  setField,
  fieldName,
  file,
  arabicName,
  className,
  setTouched,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // if (acceptedFiles[0].size > 2048) {
      //   throw new Error("File size is too large");
      // }
      setField(fieldName, acceptedFiles[0]);
      setTouched(fieldName, true);
    },
    [setField, fieldName, setTouched]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div
      {...getRootProps()}
      className={`group relative flex h-[180px] w-[180px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-netral-30 bg-netral-15 ${className}`}
    >
      <input {...getInputProps()} accept="image/*" />
      <p className="mb-4 font-semibold">{arabicName}</p>

      <UploadSimpleIcon className="h-8 w-8 text-netral-50" />

      <Button
        type="button"
        size="sm"
        variant="primary-bg"
        className="mb-2 mt-5"
      >
        إضافة صورة
      </Button>

      <p className="text-center text-body-sm font-medium text-netral-50">
        أو قم بسحب الصورة هنا
      </p>
    </div>
  );
}
