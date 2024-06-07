import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

import { cn } from '@app/_lib/utils';
import { TCell } from '@app/_providers/file';

type TSortableItemProps = {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  item: TCell;
};

export const SortableItem = ({
  id,
  containerId,
  item,
  children,
}: PropsWithChildren<TSortableItemProps>) => {
  const { setNodeRef, listeners, attributes, transform, isOver } = useSortable({
    id,
    data: {
      containerId,
      item,
    },
  });
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      layoutId={String(id)}
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scaleX: transform.scaleX,
              scaleY: transform.scaleY,
            }
          : { x: 0, y: 0 }
      }
      transition={{
        easings: {
          type: 'spring',
        },
      }}
      className={cn(
        'relative w-[170px] h-[170px] border-dashed border-2 rounded-xl overflow-hidden',
        isOver && 'bg-[#FFFCF6]',
        item.children && 'border-none',
      )}
    >
      {children}
    </motion.div>
  );
};
