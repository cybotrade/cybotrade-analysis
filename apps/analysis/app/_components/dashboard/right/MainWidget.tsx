type MainWidgetProps = {
  content: React.ReactNode;
};
export const MainWidget = ({ content }: MainWidgetProps) => {
  return <div className="w-full grow">{content}</div>;
};
