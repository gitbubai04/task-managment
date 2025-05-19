import { ITask, ITaskBoard } from "@/interface";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./taskCard";

interface TaskColumnProps {
    id: keyof ITaskBoard;
    title: string;
    tasks: ITask[];
    setFetchData?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Column({ id, title, tasks, setFetchData }: TaskColumnProps) {

    const { setNodeRef } = useDroppable({
        id, // This is important!
    });

    return (
        <div className="bg-muted rounded-xl p-4 min-h-[20rem]" ref={setNodeRef}>
            <h2 className="text-xl font-bold mb-4 capitalize">{title}</h2>
            <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} setFetchData={setFetchData} />
                ))}
            </SortableContext>
        </div>
    );
}

export default Column;