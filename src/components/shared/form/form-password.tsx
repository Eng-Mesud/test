"use client"

import * as React from "react"
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface FormPasswordProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
}

export function FormPassword<T extends FieldValues>({ control, name, label, description }: FormPasswordProps<T>) {
  const [show, setShow] = React.useState(false)
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <div className="relative">
            <Input 
                {...field} 
                id={name} 
                type={show ? "text" : "password"} 
                className="pr-10"
                placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}