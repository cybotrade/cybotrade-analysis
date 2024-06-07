import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { PropsWithChildren } from 'react';

type TDraggableItemProps = {
  id: UniqueIdentifier;
  disabled: boolean;
};
export const Draggable = ({ id, disabled, children }: PropsWithChildren<TDraggableItemProps>) => {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id,
    disabled,
  });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
