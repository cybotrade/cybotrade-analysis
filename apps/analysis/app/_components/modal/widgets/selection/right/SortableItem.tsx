import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

import { TCell } from '@app/_components/modal/widgets/type';
import { cn } from '@app/_lib/utils';

type TSortableItemProps = {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  item: TCell;
  onItemDelete: (id: UniqueIdentifier) => void;
};

export const SortableItem = ({ id, containerId, item, onItemDelete }: TSortableItemProps) => {
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
      {item.children && (
        <X
          className="absolute top-0 right-0 w-4 h-4 m-2 cursor-pointer z-50"
          onClick={() => onItemDelete(id)}
        />
      )}
      {item.children && item.children.element}
    </motion.div>
  );
};
