import React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@app/_ui/Dialog';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  button: React.ReactNode;
  content: React.ReactNode;
};

const Modal = ({ open, onOpenChange, button, content }: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{button}</DialogTrigger>
      {content}
    </Dialog>
  );
};

export default Modal;
