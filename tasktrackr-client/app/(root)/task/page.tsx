"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { GET_TASKS_URL } from "@/lib/constants/api.constant";
import { ITaskBoard } from "@/interface";
import useAxios from "@/hooks/useAxios.hook";
import KanbanBoard from "./components/kanBanBoard";
import TaskDialog from "./components/addEdittask";

function TaskView() {
    const [open, setOpen] = React.useState(false);
    const [fetchData, setFetchData] = React.useState(false);
    const [taskList, setTaskList] = React.useState<ITaskBoard | null>(null);
    const [taskListRes, , taskListRequest] = useAxios<ITaskBoard, null>(GET_TASKS_URL, "GET");

    React.useEffect(() => {
        if (taskListRes?.success && taskListRes?.data)
            setTaskList(taskListRes.data);
    }, [taskListRes]);

    React.useEffect(() => {
        taskListRequest();
    }, []);

    React.useEffect(() => {
        if (fetchData) {
            taskListRequest();
            setFetchData(false);
        }
    }, [fetchData]);

    return (
        <>
            {open && (
                <TaskDialog open={open} setOpen={setOpen} setFetchData={setFetchData} />
            )}
            <div className="mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Task Management</h1>
                    <Button className="btn btn-primary" onClick={() => setOpen(true)}>
                        <Plus />
                        Add Task
                    </Button>
                </div>

                {/* <div className="text-muted-foreground text-center">No tasks to show yet.</div> */}
                {taskList && (
                    <KanbanBoard taskList={taskList} setFetchData={setFetchData} />
                )}
            </div>
        </>
    );
}

export default TaskView;
