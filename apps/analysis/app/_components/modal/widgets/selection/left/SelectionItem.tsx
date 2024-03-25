type SelectionItemProps = {
  text: string;
};

export const SelectionItem = ({ text }: SelectionItemProps) => {
  return (
    <div className="px-3 py-2 border border-[#7A7A7A] text-sm text-[#7A7A7A] rounded-md cursor-pointer">
      {text}
    </div>
  );
};
