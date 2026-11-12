import { useState, useRef, useCallback } from 'react';

interface DragItem {
  id: string;
  type: 'opportunity';
}

interface DropResult {
  opportunityId: string;
  targetStage?: string;
}

export function usePipelineDnd() {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const dragItemRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({ id, type: 'opportunity' });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverStage(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, stageName: string) => {
    e.preventDefault();
    if (dragOverStage !== stageName) {
      setDragOverStage(stageName);
    }
  }, [dragOverStage]);

  const handleDrop = useCallback((e: React.DragEvent, stageName: string): DropResult | null => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData('text/plain');
    setDragOverStage(null);
    return opportunityId ? { opportunityId, targetStage: stageName } : null;
  }, []);

  const isDragOver = (stageName: string) => dragOverStage === stageName;

  return {
    draggedItem,
    dragOverStage,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    isDragOver,
    dragItemRef
  };
}
