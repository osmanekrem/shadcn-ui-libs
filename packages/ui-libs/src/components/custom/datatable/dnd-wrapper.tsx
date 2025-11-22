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

// Component that creates sensors using hooks
// This component lazy loads dnd-kit and calls hooks in component body
type SensorsCreatorProps = {
  onSensorsReady: (sensors: any[]) => void;
};

// Lazy load the sensors creator component
export const SensorsCreatorLazy = lazy(() =>
  import("@dnd-kit/core").then((mod) => {
    const SensorsCreatorInner = ({ onSensorsReady }: SensorsCreatorProps) => {
      // Call hooks in component body - this is the correct way
      const sensors = mod.useSensors(
        mod.useSensor(mod.MouseSensor, {}),
        mod.useSensor(mod.TouchSensor, {}),
        mod.useSensor(mod.KeyboardSensor, {})
      );

      // Use ref to track if sensors have been set to avoid infinite loops
      const sensorsSetRef = React.useRef(false);
      const onSensorsReadyRef = React.useRef(onSensorsReady);

      // Keep callback ref updated
      React.useEffect(() => {
        onSensorsReadyRef.current = onSensorsReady;
      }, [onSensorsReady]);

      // Set sensors only once when they're ready
      React.useEffect(() => {
        if (!sensorsSetRef.current && sensors.length > 0) {
          sensorsSetRef.current = true;
          onSensorsReadyRef.current(sensors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [sensors.length]); // Only depend on sensors.length to avoid infinite loops

      return null;
    };

    return { default: SensorsCreatorInner };
  })
);

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

