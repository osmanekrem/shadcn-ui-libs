"use client";

import React, { ComponentType, ReactNode, Suspense, lazy } from "react";

// Lazy load DndContext and related components
const DndContextLazy = lazy(() =>
  import("@dnd-kit/core").then((mod) => ({
    default: mod.DndContext,
  }))
);

const SortableContextLazy = lazy(() =>
  import("@dnd-kit/sortable").then((mod) => ({
    default: mod.SortableContext,
  }))
);

// Type definitions for DND components
type DragEndEvent = import("@dnd-kit/core").DragEndEvent;
type DragStartEvent = import("@dnd-kit/core").DragStartEvent;
type SensorDescriptor = import("@dnd-kit/core").SensorDescriptor<any>;
type Modifier = import("@dnd-kit/core").Modifier;

type DndWrapperProps = {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  sensors: SensorDescriptor<any>[];
  collisionDetection?: any;
  modifiers?: Modifier[];
};

// Wrapper component that lazy loads DndContext
export function DndWrapper({
  children,
  onDragEnd,
  onDragStart,
  sensors,
  collisionDetection,
  modifiers,
}: DndWrapperProps) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <DndContextLazy
        collisionDetection={collisionDetection}
        modifiers={modifiers}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        sensors={sensors}
      >
        {children}
      </DndContextLazy>
    </Suspense>
  );
}

type SortableContextWrapperProps = {
  children: ReactNode;
  items: string[];
  strategy: any;
};

// Wrapper component that lazy loads SortableContext
export function SortableContextWrapper({
  children,
  items,
  strategy,
}: SortableContextWrapperProps) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <SortableContextLazy items={items} strategy={strategy}>
        {children}
      </SortableContextLazy>
    </Suspense>
  );
}

// Lazy load sensors
export const useSensorsLazy = () => {
  const [sensors, setSensors] = React.useState<any[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      import("@dnd-kit/core").then((mod) => ({
        MouseSensor: mod.MouseSensor,
        TouchSensor: mod.TouchSensor,
        KeyboardSensor: mod.KeyboardSensor,
        useSensor: mod.useSensor,
        useSensors: mod.useSensors,
      })),
    ]).then(([dndKit]) => {
      const sensors = dndKit.useSensors(
        dndKit.useSensor(dndKit.MouseSensor, {}),
        dndKit.useSensor(dndKit.TouchSensor, {}),
        dndKit.useSensor(dndKit.KeyboardSensor, {})
      );
      setSensors(sensors);
      setIsLoaded(true);
    });
  }, []);

  return { sensors, isLoaded };
};

// Lazy load utilities
export const lazyLoadDndUtilities = async () => {
  const [
    { closestCenter },
    { restrictToHorizontalAxis },
    { arrayMove, horizontalListSortingStrategy },
  ] = await Promise.all([
    import("@dnd-kit/core"),
    import("@dnd-kit/modifiers"),
    import("@dnd-kit/sortable"),
  ]);

  return {
    closestCenter,
    restrictToHorizontalAxis,
    arrayMove,
    horizontalListSortingStrategy,
  };
};

