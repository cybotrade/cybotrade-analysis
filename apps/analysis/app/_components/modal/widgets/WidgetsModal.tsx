import React from 'react';

import Modal from '@app/_components/shared/Modal';

type WidgetsModalProps = {
  button: React.ReactNode;
  content: React.ReactNode;
};

export const WidgetsModal = ({ button, content }: WidgetsModalProps) => {
  return <Modal button={button} content={content} />;
};
