import React, { useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import VideoClip from "./VideoClip"; // This should be your component for rendering individual video clips

const VideoTimeline = ({ clips, setClips }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10, axis: "x" }, // Lock to horizontal drag
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
      const newIndex = clips.findIndex((c) => c.id === over?.id);
      const newOrder = arrayMove(clips, oldIndex, newIndex);
      setClips(newOrder);
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
        <div className="inset-x-5 bottom-5 flex flex-row gap-4 overflow-x-auto p-4 border border-gray-300 rounded-md">
          {clips.map((clip) => (
            <SortableVideo
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

const SortableVideo = ({ clip, onTrimChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: clip.id });

  // Lock transform to horizontal axis only

  const adjustedTransform = transform ? { ...transform, y: 0 } : null;

  const style = {
    transform: CSS.Transform.toString(adjustedTransform),
    transition,
    touchAction: "none",
  };

  return (
    <div
      className="w-[20]"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <VideoClip clip={clip} onTrimChange={onTrimChange} />
    </div>
  );
};

export default VideoTimeline;
