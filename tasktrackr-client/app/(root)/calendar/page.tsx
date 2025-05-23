'use client';

import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ITask, TTaskStatus } from "@/interface";
import useAxios from "@/hooks/useAxios.hook";
import { GET_CALENDAR_TASKS_URL } from "@/lib/constants/api.constant";
import TaskDetailsDialog from "../task/components/taskDetails";
import { EventClickArg } from "@fullcalendar/core/index.js";

function CalendarView() {
    const [tasks, setTasks] = React.useState<ITask[]>([]);
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const [detailsData, setDetailsData] = React.useState<ITask | null>(null);
    const [taskListRes, , taskListRequest] = useAxios<ITask[], null>(GET_CALENDAR_TASKS_URL, "GET");

    React.useEffect(() => {
        if (taskListRes?.success && taskListRes?.data)
            setTasks(taskListRes.data);
    }, [taskListRes]);

    React.useEffect(() => {
        taskListRequest();
    }, []);

    const statusColorMap: Record<TTaskStatus, string> = {
        todo: '#facc15',
        pending: '#60a5fa',
        'in-progress': '#fb923c',
        completed: '#4ade80',
    };


    const events = tasks
        .filter(task => task.dueDate)
        .map(task => ({
            id: task._id,
            title: task.title,
            date: task.dueDate as string,
            color: statusColorMap[task.status],
        }));

    const handelOpenTaskDetails = (info: EventClickArg) => {
        console.log(info.event.id);
        const task = tasks.find((task) => task._id === info.event.id);
        if (task) {
            setDetailsData(task);
            setDetailsOpen(true);
        }
    };

    return (
        <div>
            {detailsOpen && <TaskDetailsDialog open={detailsOpen} setOpen={setDetailsOpen} task={detailsData} />}
            <div className=" h-screen p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    events={events}
                    height="100%"
                    displayEventTime={false}
                    eventClick={(info) => handelOpenTaskDetails(info)}
                />
            </div>
        </div>
    );
}

export default CalendarView;
