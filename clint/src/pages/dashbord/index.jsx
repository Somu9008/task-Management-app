import React from "react";
import {
  useGetCreatedTasksQuery,
  useGetUserTasksQuery,
} from "@/features/task/taskApi";
import style from "./style.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data: createdTasksData } = useGetCreatedTasksQuery();
  const { data: assignedTasksData } = useGetUserTasksQuery();

  const createdTasks = createdTasksData?.tasks || [];
  const assignedTasks = assignedTasksData?.tasks || [];

  const totalCreated = createdTasks.length;
  const totalAssigned = assignedTasks.length;
  const allTasks = [...createdTasks, ...assignedTasks];

  const completedTasks = allTasks.filter(
    (task) => task.status.toLowerCase() === "completed"
  );
  const pendingTasks = allTasks.filter(
    (task) =>
      task.status.toLowerCase() === "pending" ||
      task.status.toLowerCase().includes("progress")
  );

  const recentTasks = allTasks.slice(0, 5);

  const chartData = recentTasks.map((task) => ({
    title: task.title,
    Completed: task.status.toLowerCase() === "completed" ? 1 : 0,
    Pending:
      task.status.toLowerCase() === "pending" ||
      task.status.toLowerCase().includes("progress")
        ? 1
        : 0,
  }));

  return (
    <div className={style.dashboard}>
      <h1>Dashboard</h1>
      <div className={style.cards}>
        <div className={style.card}>Created: {totalCreated}</div>
        <div className={style.card}>Assigned: {totalAssigned}</div>
        <div className={style.card}>Completed: {completedTasks.length}</div>
        <div className={style.card}>
          Pending/In Progress: {pendingTasks.length}
        </div>
      </div>

      <h2>Recent Tasks</h2>
      <div className={style.taskList}>
        {recentTasks.map((task) => (
          <div key={task._id} className={style.task}>
            <p>
              <strong>{task.title}</strong> - {task.status}
            </p>
            <p>{task.description}</p>
            <p>Due: {task.dueDate?.slice(0, 10)}</p>
          </div>
        ))}
      </div>

      <h2>Task Overview Chart</h2>
      <div className={style.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Completed" fill="#4CAF50" />
            <Bar dataKey="Pending" fill="#FFC107" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
