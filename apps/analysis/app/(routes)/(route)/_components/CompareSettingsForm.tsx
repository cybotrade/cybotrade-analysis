import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@app/_ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@app/_ui/Form';
import { ToggleGroup, ToggleGroupItem } from '@app/_ui/toggle-group';

export type SettingsValue = {
  [key: string]: string;
};

const CompareSettingsForm = ({
  onUpdate,
  values,
}: {
  onUpdate: (values: SettingsValue) => void;
  values: SettingsValue;
}) => {
  const files: { key: string; name: string; permutations: string[] }[] = [
    {
      key: '1',
      name: 'ada.json',
      permutations: ['permutation#1', 'short', 'selected', 'long text'],
    },
    {
      key: '2',
      name: 'btc.json',
      permutations: ['permutation#1', 'permutation#2', 'permutation#3', 'permutation#4'],
    },
  ];

  const formSchemaObject: Record<string, z.ZodString> = {};
  files.forEach(({ key }) => {
    formSchemaObject[key.toString()] = z.string();
  });

  const formSchema = z.object(formSchemaObject);

  const defaultValues: Record<string, string> = {};
  files.forEach(({ key, permutations }) => {
    defaultValues[key] = permutations[0];
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('values', values);
    onUpdate(values);
  };

  return (
    <div className="w-full h-full p-4 text-black overflow-y-auto relative">
      <div className="text-xl">Settings</div>
      <hr className="mt-2 mb-2" />
      <p className="text-gray-500 text-sm mb-5">
        To select the permutation you would like to compare between two json files.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {files.map((file) => (
            <FormField
              control={form.control}
              name={file.key}
              key={file.key}
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-black mb-0 text-base">{file.name}</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        variant="outline"
                        type="single"
                        className="flex flex-wrap justify-start gap-2"
                        onValueChange={(values) => {
                          form.setValue(file.key, values);
                        }}
                        value={field.value}
                      >
                        {file.permutations.map((permutation, index) => (
                          <ToggleGroupItem
                            value={permutation}
                            aria-label="permutation"
                            className=" text-gray-400 rounded-full px-4"
                            key={index}
                          >
                            {permutation}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
          <Button type="submit" className="font-bold text-lg w-max" size="xl">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompareSettingsForm;
