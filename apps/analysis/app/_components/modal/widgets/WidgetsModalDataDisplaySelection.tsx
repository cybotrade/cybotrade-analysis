import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { SortableContext, arraySwap, rectSwappingStrategy } from '@dnd-kit/sortable';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import { WidgetsModalHeader } from '@app/_components/modal/widgets/WidgetsModalHeader';
import { DataDisplaySelectionList } from '@app/_components/modal/widgets/selection/left';
import { DataDisplaySelectionGrid } from '@app/_components/modal/widgets/selection/right';
import { SortableItem } from '@app/_components/modal/widgets/selection/right/SortableItem';
import { getWidgetById } from '@app/_components/widgets';
import { PerformanceData } from '@app/_lib/calculation';
import { TCell, useFileAPI, useFileData } from '@app/_providers/file';

type TWidgetsModalDataDisplaySelectionProps = {
  performance: PerformanceData;
  onToggleModal: (open: boolean) => void;
};
export const WidgetsModalDataDisplaySelection = ({
  performance,
  onToggleModal,
}: TWidgetsModalDataDisplaySelectionProps) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 0.01,
    },
  });
  const sensors = useSensors(mouseSensor);
  const { widgets } = useFileData();
  const { onWidgetsChange } = useFileAPI();

  const [items, setItems] = useState<Record<string, TCell[]>>(widgets);
  const [containers, setContainers] = useState<UniqueIdentifier[]>(Object.keys(items));
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over?.id) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
    const overIndex = items[overContainer].findIndex((item) => item.id === over.id);

    if (activeContainer === overContainer) {
      setItems({
        ...items,
        [overContainer]: arraySwap(items[overContainer], activeIndex, overIndex),
      });
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over?.id) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!overContainer) {
      setActiveId(null);
      return;
    }

    if (activeContainer !== overContainer) {
      const overItems = items[overContainer];
      const overIndex = overItems.findIndex((item) => item.id === over.id);
      const newItem = {
        ...items[overContainer][overIndex],
        children: { type: active.id },
      };
      setItems({
        ...items,
        [overContainer]: [
          ...items[overContainer].slice(0, overIndex),
          newItem,
          ...items[overContainer].slice(overIndex + 1),
        ],
      });
    }
    setActiveId(null);
  };
  const handleDragCancel = () => setActiveId(null);
  const handleItemDelete = (id: UniqueIdentifier) => {
    const activeContainer = findContainer(id);
    if (activeContainer) {
      const activeIndex = items[activeContainer].findIndex((item) => item.id === id);
      const updatedItem = {
        ...items[activeContainer][activeIndex],
        children: null,
      };
      setItems({
        ...items,
        [activeContainer]: [
          ...items[activeContainer].slice(0, activeIndex),
          updatedItem,
          ...items[activeContainer].slice(activeIndex + 1),
        ],
      });
    }
  };
  const findContainer = (id: UniqueIdentifier | null) => {
    if (!id) return;
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].find((item) => item.id === id));
  };

  const handleApply = () => {
    onWidgetsChange(items);
    onToggleModal(false);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <WidgetsModalHeader onApply={handleApply} />
      <div className="grid auto-cols-[1fr_28rem] h-fit gap-8">
        <DataDisplaySelectionList items={items} />
        <DataDisplaySelectionGrid>
          {containers.map((containerId) => (
            <SortableContext
              key={containerId}
              items={items[containerId]}
              strategy={rectSwappingStrategy}
            >
              {items[containerId].map((cell) => (
                <SortableItem key={cell.id} containerId={containerId} id={cell.id} item={cell}>
                  {cell.children && (
                    <>
                      <X
                        className="absolute top-0 right-0 w-4 h-4 m-2 cursor-pointer z-50"
                        onClick={() => handleItemDelete(cell.id)}
                      />
                      {getWidgetById(cell.children.type, performance)}
                    </>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          ))}
        </DataDisplaySelectionGrid>
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={null} modifiers={[snapCenterToCursor]}>
          {activeId && getWidgetById(activeId, performance)}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};
