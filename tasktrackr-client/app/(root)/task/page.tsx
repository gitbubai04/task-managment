"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import TaskDialog from "./components/addEdittask";

function TaskView() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {
                open && (
                    <TaskDialog open={open} setOpen={setOpen} />
                )
            }
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Task Management</h1>
                    <Button className="btn btn-primary" onClick={() => setOpen(true)}>
                        <Plus />
                        Add Task
                    </Button>
                </div>
                <div className="text-muted-foreground text-center">No tasks to show yet.</div>
            </div>
        </>
    );
}

export default TaskView;
