import React from 'react';

import Modal from '@app/_components/shared/Modal';

type WidgetsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  button: React.ReactNode;
  content: React.ReactNode;
};

export const WidgetsModal = ({ open, onOpenChange, button, content }: WidgetsModalProps) => {
  return <Modal open={open} onOpenChange={onOpenChange} button={button} content={content} />;
};
