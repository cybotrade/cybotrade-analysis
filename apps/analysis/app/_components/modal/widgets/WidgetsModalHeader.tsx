import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@app/_ui/Breadcrumb';
import { Button } from '@app/_ui/Button';

type TWidgetsModalHeaderProps = {
  onApply: () => void;
};

export const WidgetsModalHeader = ({ onApply }: TWidgetsModalHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary text-md">BackTest Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#7A7A7A]" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-md text-[#7A7A7A]">
              Data Display Selection
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button
        onClick={onApply}
        className="bg-transparent border border-primary text-primary font-bold min-w-[12rem] p-6 hover:border-primary"
      >
        Apply
      </Button>
    </div>
  );
};
