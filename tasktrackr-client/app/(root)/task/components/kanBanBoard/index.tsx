import { ITask, ITaskBoard } from "@/interface";
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Column from "./taskColumn";
import { CHANGE_TASK_STATUS_BY_ID_URL } from "@/lib/constants/api.constant";
import useAxios from "@/hooks/useAxios.hook";

interface TaskBoardProps {
    taskList: ITaskBoard;
    setFetchData?: React.Dispatch<React.SetStateAction<boolean>>;
}

const columns: (keyof ITaskBoard)[] = ["todo", "pending", "in-progress", "completed"];
export default function KanbanBoard({ taskList, setFetchData }: TaskBoardProps) {
    const [board, setBoard] = useState<ITaskBoard>(taskList);
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const [dropTask, setDropTask] = useState<{ id: string; status: keyof ITaskBoard } | null>(null)
    const [taskStatusRes, , taskStatusRequest] = useAxios<{ status: string }, null>(CHANGE_TASK_STATUS_BY_ID_URL + dropTask?.id, "PATCH");

    const findContainer = (taskId: string): keyof ITaskBoard | undefined => {
        return columns.find((column) => board[column].some((task) => task._id === taskId));
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const taskId = active.id as string;
        const container = findContainer(taskId);
        if (!container) return;

        const task = board[container].find((t) => t._id === taskId);
        if (task) setActiveTask(task);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = columns.includes(over.id as keyof ITaskBoard)
            ? (over.id as keyof ITaskBoard)
            : findContainer(over.id as string);

        if (!activeContainer || !overContainer) return;

        if (activeContainer === overContainer) {
            const oldIndex = board[activeContainer].findIndex((task) => task._id === active.id);
            const newIndex = board[overContainer].findIndex((task) => task._id === over.id);
            const updated = arrayMove(board[activeContainer], oldIndex, newIndex);
            setBoard({ ...board, [activeContainer]: updated });
        } else {
            const taskToMove = board[activeContainer].find((task) => task._id === active.id);
            if (!taskToMove) return;

            const updatedSource = board[activeContainer].filter((task) => task._id !== active.id);
            const updatedDestination = [taskToMove, ...board[overContainer]];
            taskToMove.status = overContainer;
            setBoard({
                ...board,
                [activeContainer]: updatedSource,
                [overContainer]: updatedDestination,
            });

            setDropTask({ id: taskToMove._id, status: overContainer })
        }
    };

    useEffect(() => {
        setBoard(taskList);
    }, [taskList]);

    useEffect(() => {
        if (dropTask) {
            taskStatusRequest({ status: dropTask.status });
            setDropTask(null);
        }
    }, [dropTask, taskStatusRequest]);

    useEffect(() => {
        if (taskStatusRes?.success) {
            setFetchData?.(true);
        }
    }, [taskStatusRes, setFetchData]);

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {columns.map((column) => (
                    <Column
                        key={column}
                        id={column}
                        title={column.replace(/-/g, " ")}
                        tasks={board[column]}
                        setFetchData={setFetchData}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeTask ? (
                    <div className="cursor-grabbing scale-105 shadow-2xl">
                        <Card className="bg-white dark:bg-gray-900 border shadow rounded-xl">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-sm">{activeTask.title}</h3>
                                {activeTask.description && (
                                    <p className="text-sm text-muted-foreground">{activeTask.description}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}