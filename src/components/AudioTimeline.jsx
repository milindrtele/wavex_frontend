import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AudioClip from "./AudioClip";

const AudioTimeline = ({ clips, setClips }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10, axis: "x" },
    })
  );

  const handleTrimChange = (id, updatedClip) => {
    const updatedClips = clips.map((c) => (c.id === id ? updatedClip : c));
    setClips(updatedClips);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = clips.findIndex((c) => c.id === active.id);
      const newIndex = clips.findIndex((c) => c.id === over.id);
      const reordered = arrayMove(clips, oldIndex, newIndex);
      setClips(reordered);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={clips.map((clip) => clip.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="inset-x-5 bottom-5 flex flex-row gap-4 overflow-x-auto p-4 border border-green-300 rounded-md">
          {clips.map((clip) => (
            <SortableAudio
              key={clip.id}
              clip={clip}
              onTrimChange={handleTrimChange}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const SortableAudio = ({ clip, onTrimChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: clip.id });

  const adjustedTransform = transform ? { ...transform, y: 0 } : null;
  const style = {
    transform: CSS.Transform.toString(adjustedTransform),
    transition,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AudioClip clip={clip} onTrimChange={onTrimChange} />
    </div>
  );
};

export default AudioTimeline;
