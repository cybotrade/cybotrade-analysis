import { useState } from 'react';

export interface IDrawer {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const useDrawer = (): IDrawer => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return { open, close, isOpen };
};

export default useDrawer;
