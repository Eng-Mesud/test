// src/components/form/useFormWithErrors.ts
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ZodSchema } from "zod"
import { toast } from "sonner"

export function useFormWithErrors<T>(
  schema: ZodSchema<T>,
  defaultValues?: Partial<T>
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleBackendError = (err: any) => {
    toast.error(
      err?.message ||
      err?.errorCode ||
      "Something went wrong"
    )
  }

  return {
    form,
    handleBackendError,
  }
}
