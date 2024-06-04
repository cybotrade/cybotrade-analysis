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
import { Decimal } from 'decimal.js';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import { DataDisplaySelectionList } from '@app/_components/modal/widgets/selection/left';
import { DataDisplaySelectionGrid } from '@app/_components/modal/widgets/selection/right';
import { SortableItem } from '@app/_components/modal/widgets/selection/right/SortableItem';
import { TCell } from '@app/_components/modal/widgets/type';
import {
  AverageTradesDaysWidget,
  BestTradeWidget,
  LargestRoiWidget,
  MaxDDWidget,
  WinRateWidget,
} from '@app/_components/widgets';
import { PerformanceData } from '@app/_lib/calculation';
import { createRange } from '@app/_utils/helper';

type TWidgetsModalDataDisplaySelectionProps = {
  performance: PerformanceData;
};
export const WidgetsModalDataDisplaySelection = ({
  performance,
}: TWidgetsModalDataDisplaySelectionProps) => {
  const WIDGETS: Record<string, React.ReactNode> = {
    'win-rate': <WinRateWidget winRate={new Decimal(performance.winRate)} />,
    'best-trade': <BestTradeWidget bestTrade={new Decimal(performance.bestTradePnl)} />,
    'largest-roi': <LargestRoiWidget largestRoi={new Decimal(performance.largestRoi)} />,
    'max-drawdown': <MaxDDWidget maxDrawdown={new Decimal(performance.maxDrawdown)} />,
    'average-trades-per-day': (
      <AverageTradesDaysWidget averageTradesPerDay={performance.averageTradesPerDay} />
    ),
  };
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 0.01,
    },
  });
  const sensors = useSensors(mouseSensor);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const [items, setItems] = useState<Record<string, TCell[]>>({
    A: createRange(6, (index) => ({
      id: `A${index + 1}`,
      children: null,
    })),
  });
  const [containers, setContainers] = useState<UniqueIdentifier[]>(Object.keys(items));
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
      setItems((prevItems) => {
        return {
          ...prevItems,
          [overContainer]: arraySwap(items[overContainer], activeIndex, overIndex),
        };
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
      setItems((prevItems) => {
        const overItems = prevItems[overContainer];
        const overIndex = overItems.findIndex((item) => item.id === over.id);
        const newItem = {
          ...prevItems[overContainer][overIndex],
          children: { element: WIDGETS[active.id], type: active.id },
        };
        return {
          ...prevItems,
          [overContainer]: [
            ...prevItems[overContainer].slice(0, overIndex),
            newItem,
            ...prevItems[overContainer].slice(overIndex + 1),
          ],
        };
      });
    }
    setActiveId(null);
  };
  const handleDragCancel = () => setActiveId(null);
  const handleItemDelete = (id: UniqueIdentifier) => {
    const activeContainer = findContainer(id);
    if (activeContainer) {
      setItems((prevItems) => {
        const activeIndex = items[activeContainer].findIndex((item) => item.id === id);
        const updatedItem = {
          ...prevItems[activeContainer][activeIndex],
          children: null,
        };

        return {
          ...prevItems,
          [activeContainer]: [
            ...prevItems[activeContainer].slice(0, activeIndex),
            updatedItem,
            ...prevItems[activeContainer].slice(activeIndex + 1),
          ],
        };
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
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid auto-cols-[1fr_28rem] h-fit gap-8">
        <DataDisplaySelectionList items={items} />
        <DataDisplaySelectionGrid>
          {containers.map((containerId) => (
            <SortableContext
              key={containerId}
              items={items[containerId]}
              strategy={rectSwappingStrategy}
            >
              {items[containerId].map((cell, index) => (
                <SortableItem
                  key={cell.id}
                  containerId={containerId}
                  id={cell.id}
                  item={cell}
                  onItemDelete={handleItemDelete}
                />
              ))}
            </SortableContext>
          ))}
        </DataDisplaySelectionGrid>
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={null} modifiers={[snapCenterToCursor]}>
          {activeId && activeId in WIDGETS && WIDGETS[activeId]}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};
