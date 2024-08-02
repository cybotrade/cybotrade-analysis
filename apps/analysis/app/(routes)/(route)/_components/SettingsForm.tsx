import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@app/_ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@app/_ui/Form';
import { Input } from '@app/_ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/_ui/Select';

import EntryForm from './EntryForm';

export type SettingsValue = {
  initial_capital?: number;
  // order_size_unit?: string;
  // order_size_value?: string;
  // leverage?: string;
  fees?: number;
  // take_profit?: { value?: string }[];
  // stop_lost?: { value?: string }[];
  // entry?: { value?: string }[];
};

const SettingsForm = ({
  onUpdate,
  values,
}: {
  onUpdate: (values: SettingsValue) => void;
  values: SettingsValue;
}) => {
  const formSchema = z.object({
    initial_capital: z.number().min(1).optional(),
    order_size_unit: z.string().optional(),
    order_size_value: z.string().optional(),
    // leverage: z.string().optional(),
    fees: z.number().optional(),
    // take_profit: z
    //   .array(
    //     z.object({
    //       value: z.string(),
    //     }),
    //   )
    //   .optional(),
    // stop_lost: z
    //   .array(
    //     z.object({
    //       value: z.string(),
    //     }),
    //   )
    //   .optional(),
    // entry: z
    //   .array(
    //     z.object({
    //       value: z.string(),
    //     }),
    //   )
    //   .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: values,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onUpdate(values);
  };

  return (
    <div className="w-full h-full p-4 text-black overflow-y-auto relative">
      <div className="text-xl">Settings</div>
      <hr className="mt-2 mb-5" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-2 gap-y-4">
          <FormField
            control={form.control}
            name="fees"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-black mb-0 text-base">Fees</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    suffix={<div className="text-gray-500 text-sm">USDT</div>}
                    onChange={(v) => {
                      const parsedValue = parseInt(v.target.value);
                      form.setValue('fees', isNaN(parsedValue) ? undefined : parsedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="font-bold text-lg w-max" size="xl">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsForm;
