import { MinusCircle } from 'lucide-react';
import React, { ReactNode } from 'react';
import { FieldValues, Path, UseFormReturn, useFieldArray } from 'react-hook-form';

import { cn } from '@app/_lib/utils';
import { Button } from '@app/_ui/Button';
import { Input } from '@app/_ui/Input';

type EntryFormProps<T extends FieldValues> = {
  name: string;
  form: UseFormReturn<T, any, undefined>;
  className: string;
  label?: string;
  buttonText?: string | ReactNode;
};
const EntryForm = <T extends FieldValues>({
  name,
  form,
  className,
  label,
  buttonText,
}: EntryFormProps<T>) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  return (
    <div
      className={cn('p-4 border border-primary-light rounded-md flex flex-col gap-2', className)}
    >
      {label && <div className="font-bold text-base text-black">{label}</div>}
      {fields.map((field, index) => (
        <div className="flex items-center gap-2">
          <span>{index + 1}</span>
          <Input
            className="flex-grow"
            type="number"
            key={field.id}
            suffix={<div className="text-gray-300">60%</div>}
            {...form.register(`${name}.${index}.value` as unknown as Path<T>)}
          />
          <MinusCircle
            className="cursor-pointer"
            onClick={() => remove(index)}
            size={16}
            strokeWidth={1}
            color="#E1C3A0"
          />
        </div>
      ))}
      <div className="flex gap-2">
        <span className="opacity-0">0</span>
        <Button
          onClick={() => {
            append({ value: '' });
          }}
          variant={'outline'}
          className="w-max"
        >
          {buttonText ? buttonText : '+'}
        </Button>
      </div>
    </div>
  );
};

export default EntryForm;
