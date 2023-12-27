import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef } from 'react';

// import { cn } from '@app/_lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={className} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { hidecircle?: boolean }
>(({ className, children, hidecircle, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={`
        flex flex-1 items-center justify-between text-xl font-bold px-10 py-6 transition-all bg-[#F9F9F9] hover:bg-[#F2F2F2] dark:bg-[#382F23] dark:border-[#575757] rounded-xl
        ${className}`}
      {...props}
    >
      <div className="w-full flex items-center">
        {!hidecircle && (
          <div className="h-6 w-6 mr-4 transition-transform duration-200 rounded-full bg-[#E59E2E] dark:bg-[#855E1F]" />
        )}
        {children}
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={`
      'px-9 py-10',
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      ${className}`}
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
