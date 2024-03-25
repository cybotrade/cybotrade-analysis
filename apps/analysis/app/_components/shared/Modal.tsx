import React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@app/_ui/Dialog';

type ModalProps = {
  button: React.ReactNode;
  content: React.ReactNode;
};

const Modal = ({ button, content }: ModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>{button}</DialogTrigger>
      {content}
    </Dialog>
  );
};

export default Modal;
