"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";

const Form = FormProvider;
const FormFieldContext = React.createContext<{ name: string } | null>(null);
const FormItemContext = React.createContext<{ id: string } | null>(null);

function FormField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
  TOutput = TValues,
>(props: ControllerProps<TValues, TName, TOutput>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const field = React.useContext(FormFieldContext);
  const item = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: field?.name });

  if (!field || !item) {
    throw new Error("Form controls must be inside a FormField and FormItem.");
  }

  return {
    ...getFieldState(field.name, formState),
    formItemId: `${item.id}-control`,
    formMessageId: `${item.id}-message`,
  };
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel(props: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      data-slot="form-label"
      data-error={Boolean(error)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

// Base UI composes the child element and its ref, including RHF's focus ref.
function FormControl({ children }: { children: React.ReactElement }) {
  const { error, formItemId, formMessageId } = useFormField();

  return useRender({
    render: children,
    props: {
      "data-slot": "form-control",
      id: formItemId,
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? formMessageId : undefined,
    },
  });
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const message = error?.message ?? children;
  if (!message) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm text-destructive", className)}
      aria-live="polite"
      {...props}
    >
      {message}
    </p>
  );
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage };
