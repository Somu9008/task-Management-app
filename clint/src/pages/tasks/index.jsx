import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { io } from "socket.io-client";
import {
  useCreateTaskMutation,
  useDeleteTasksMutation,
  useGetCreatedTasksQuery,
  useGetUserTasksQuery,
  useOverDueTaskQuery,
  useUpdateTasksMutation,
} from "@/features/task/taskApi";
import { useDispatch, useSelector } from "react-redux";

import { openPopUp } from "@/features/task/taskSlice.js";
import { setMessage } from "@/features/auth/authSlice.js";

const socket = io("https://task-management-app-l3ar.onrender.com", {
  withCredentials: true,
});

export default function index() {
  const [createTask, { isLoading, error }] = useCreateTaskMutation();
  const [editTaskId, setEditTaskId] = useState(null);
  const [newTask, setNewTask] = useState(false);
  const [assignedTaskList, setAssignedTaskList] = useState([]);
  const [notification, setNotification] = useState(false);
  const [assignedUser, setAssignedUser] = useState("");
  const [createdUser, setCreatedUser] = useState([]);
  const [overDueTaskList, setOverDueTaskList] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [createdClick, setCreatedClick] = useState(true);
  const [assignedClick, setAssignedClick] = useState(false);
  const [overDueClick, setOverDueClick] = useState(false);
  const [assignedCount, setAssignedCount] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
    assignedTo: "",
  });

  const taskState = useSelector((state) => state.task);
  const userState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  console.log(userState);
  console.log(createdUser, assignedTaskList);

  const {
    data: assignedTasks,
    isLoading: assignedLoading,
    refetch,
  } = useGetUserTasksQuery();
  const { data: createdTasks, isLoading: createdLoading } =
    useGetCreatedTasksQuery();
  const {
    data: overDueTasks,
    isLoading: overDueLoading,
    refetch: refetch2,
  } = useOverDueTaskQuery();

  const [deleteTasks] = useDeleteTasksMutation();
  const [updateTasks] = useUpdateTasksMutation();

  console.log(status);

  useEffect(() => {
    // Filter created tasks
    let filteredCreated = createdTasks?.tasks || [];
    if (status) {
      filteredCreated = filteredCreated.filter(
        (task) => task.status.toLowerCase() === status.toLowerCase()
      );
    }
    if (priority) {
      filteredCreated = filteredCreated.filter(
        (task) => task.priority.toLowerCase() === priority.toLowerCase()
      );
    }
    setCreatedUser(filteredCreated);

    // Filter assigned tasks
    let filteredAssigned = assignedTasks?.tasks || [];
    if (status) {
      filteredAssigned = filteredAssigned.filter(
        (task) => task.status.toLowerCase() === status.toLowerCase()
      );
    }
    if (priority) {
      filteredAssigned = filteredAssigned.filter(
        (task) => task.priority.toLowerCase() === priority.toLowerCase()
      );
    }

    setAssignedTaskList(filteredAssigned);

    //filter overDueTask

    let filteredOverDueTasks = overDueTasks?.tasks || [];
    if (status) {
      filteredOverDueTasks = filteredOverDueTasks.filter(
        (task) => task.status.toLowerCase() === status.toLowerCase()
      );
    }
    if (priority) {
      filteredOverDueTasks = filteredOverDueTasks.filter(
        (task) => task.priority.toLowerCase() === priority.toLowerCase()
      );
    }
    setOverDueTaskList(filteredOverDueTasks);

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredCreated = filteredCreated.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearch) ||
          task.description.toLowerCase().includes(lowerSearch)
      );
      filteredAssigned = filteredAssigned.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearch) ||
          task.description.toLowerCase().includes(lowerSearch)
      );
      filteredOverDueTasks = filteredOverDueTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearch) ||
          task.description.toLowerCase().includes(lowerSearch)
      );
    }
    setOverDueTaskList(filteredOverDueTasks);
    setCreatedUser(filteredCreated);
    setAssignedTaskList(filteredAssigned);
  }, [createdTasks, assignedTasks, status, priority, searchTerm, overDueTasks]);

  useEffect(() => {
    if (assignedTasks?.tasks && overDueTasks?.tasks) {
      // if (assignedName) {
      //   dispatch(openPopUp(name));
      // }
      refetch();
      refetch2();
      setAssignedTaskList(assignedTasks.tasks);
      setOverDueTaskList(overDueTasks.tasks);
    }
  }, [assignedTasks?.tasks, overDueTasks?.tasks]);

  useEffect(() => {
    // Listen for 'newTaskAssigned' event from the server
    socket.on("newTaskAssigned", (task, name) => {
      console.log("New task assigned: ", task);
      if (task.assignedTo === userState.user?._id) {
        setAssignedCount((prev) => prev + 1);
        dispatch(openPopUp(name));
        // setAssignedName(name);
        // refetch(); // Update assigned tasks for the current user immediately
      }
    });
    // Cleanup when the component unmounts
    // return () => {
    //   socket.off("newTaskAssigned");
    // };
  }, [userState.user?._id, refetch]);

  useEffect(() => {
    socket.on("taskDeleted", ({ taskId, assignedTo }) => {
      if (assignedTo === userState.user?._id) {
        setAssignedTaskList((prev) =>
          prev.filter((task) => task._id !== taskId)
        );
      }
    });

    return () => {
      socket.off("taskDeleted");
    };
  }, [userState.user?._id]);

  useEffect(() => {
    socket.on("taskUpdated", ({ task, assignedTo }) => {
      if (assignedTo === userState.user?._id) {
        setAssignedTaskList((prevTasks) =>
          prevTasks.map((t) => (t._id === task._id ? task : t))
        );
      }
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, [userState.user?._id]);

  if (assignedLoading || createdLoading) {
    return <p>Loading....</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createTask(form).unwrap();
    setForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "low",
      status: "",
      assignedTo: "",
    });
    console.log(res);
    dispatch(setMessage(res.message));
    refetch();
  };

  return (
    <>
      {!newTask && (
        <>
          <div className={style.searchAndFilter}>
            <div className={style.search}>
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>Search</button>
              </div>

              <button
                onClick={() => {
                  setNewTask(true);
                }}
                style={{
                  borderRadius: "1rem",
                  background: "lightgreen",
                  color: "black",
                }}
              >
                new Task
              </button>
            </div>
          </div>
          <div className={style.tasks}>
            <div className={style.filter}>
              <h1>Filtre By</h1>

              <div className={style.filterStatus}>
                <h1>Filter By STATUS</h1>
                <div>
                  <label htmlFor="alltasks">All Tasks</label>
                  <input
                    type="radio"
                    name="status"
                    id="alltasks"
                    onChange={(e) => {
                      setStatus("");
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="pending">Pending</label>
                  <input
                    type="radio"
                    name="status"
                    value="pending"
                    id="pending"
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="InProgress">In progress</label>
                  <input
                    type="radio"
                    value="In Progress"
                    name="status"
                    id="InProgress"
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="complete">Complete</label>
                  <input
                    type="radio"
                    name="status"
                    value="Completed"
                    id="complete"
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                </div>
              </div>
              <br />
              <div className={style.filterPriority}>
                <h1>Filter By PRIORITY</h1>
                <div>
                  <label htmlFor="alltasks">All Tasks</label>
                  <input
                    type="radio"
                    name="priority"
                    id="alltasks"
                    onChange={(e) => {
                      setPriority("");
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="low">Low</label>
                  <input
                    type="radio"
                    name="priority"
                    id="low"
                    value="low"
                    onChange={(e) => {
                      setPriority(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="medium">Medium</label>
                  <input
                    type="radio"
                    name="priority"
                    id="medium"
                    value="Medium"
                    onChange={(e) => {
                      setPriority(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="high">High</label>
                  <input
                    type="radio"
                    name="priority"
                    id="high"
                    value="high"
                    onChange={(e) => {
                      setPriority(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={style.currentTasks}>
              <div className={style.currentTasksBox}>
                <div
                  style={{
                    color: `${createdClick ? " rgb(25, 255, 121)" : ""}`,
                  }}
                  onClick={() => {
                    setCreatedClick(true),
                      setAssignedClick(false),
                      setOverDueClick(false);
                  }}
                >
                  Created Tasks
                </div>
                <div
                  style={{
                    color: `${assignedClick ? " rgb(25, 255, 121)" : ""}`,
                  }}
                  onClick={() => {
                    setCreatedClick(false),
                      setAssignedClick(true),
                      setOverDueClick(false);
                    setAssignedCount(0);
                    refetch();
                  }}
                >
                  Assigned Tasks{" "}
                  {!assignedClick && assignedCount > 0 && (
                    <span
                      style={{
                        background: "orangeRed",
                        padding: "0.1rem",
                        paddingInline: "0.3rem",
                        borderRadius: "50%",
                        color: "white",
                      }}
                    >
                      {assignedCount}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    color: `${overDueClick ? " rgb(25, 255, 121)" : ""}`,
                  }}
                  onClick={() => {
                    setCreatedClick(false),
                      setAssignedClick(false),
                      setOverDueClick(true);
                  }}
                >
                  Over Due Tasks
                </div>
              </div>

              {createdClick && (
                <div className={style.userCreatedTasks}>
                  <h2>Your Created Tasks:</h2>

                  {createdUser.map((task) => {
                    return (
                      <div key={index}>
                        <p>title : {task.title}</p>

                        <p>description : {task.description}</p>
                        <p>Status: {task.status}</p>
                        <p>Priority : {task.priority}</p>
                        <p>assignedTo : {task.assignedTo.name}</p>
                        {editTaskId == task._id && (
                          <div className={style.editTask}>
                            <div>
                              <label htmlFor="">Priority :</label>
                              <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                              >
                                <option value="low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="">Status : </label>
                              <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <p>dueDate : {task.dueDate?.slice(0, 10)}</p>

                        {editTaskId != task._id ? (
                          <button
                            onClick={async () => {
                              setEditTaskId(task._id);
                            }}
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const res = await updateTasks({
                                taskId: task._id,
                                taskdata: {
                                  status: form.status,
                                  priority: form.priority,
                                },
                              });
                              console.log(res);
                              dispatch(setMessage(res.data.message));
                              setEditTaskId(null);
                            }}
                          >
                            Update
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            await deleteTasks(task._id);
                            dispatch(setMessage("Task deleted"));
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {assignedClick && (
                <div className={style.assignedTasks}>
                  <h2> Tasks Assigned To you:</h2>
                  {assignedTaskList?.map((task) => {
                    return (
                      <div>
                        <p>title{task.title}</p>
                        <p> status :{task.status}</p>
                        <p>description : {task.description}</p>
                        <p>priority : {task.priority}</p>
                        <p>dueDate : {task.dueDate?.slice(0, 10)}</p>
                        <p>created :{task.createdBy.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {overDueClick && (
                <div className={style.dueDate}>
                  <h2>Over DueTasks :</h2>
                  {overDueTaskList.map((task) => {
                    return (
                      <div key={index}>
                        <p>title : {task.title}</p>
                        <p>description : {task.description}</p>
                        <p>Status: {task.status}</p>
                        <p>Priority : {task.priority}</p>
                        <p>assignedTo : {task.assignedTo?.name}</p>
                        <p>created By:{task.createdBy?.name}</p>
                        <p>dueDate : {task.dueDate?.slice(0, 10)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {newTask && (
        <>
          <div className={style.createTask}>
            <button
              onClick={() => {
                setNewTask(false);
              }}
              style={{ margin: "2rem" }}
            >
              {"<--Back"}
            </button>
            <h2>Create Task</h2>
            <form
              action=""
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div>
                <label htmlFor="">title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="">description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="">Due Date</label>
                <input
                  type="Date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={style.dropdown}>
                <div>
                  <label htmlFor="">Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="">AssignedTo :</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">
                {isLoading ? "creating..." : "create task"}
              </button>
              {error && <p>{error.data.message}</p>}
            </form>
          </div>
        </>
      )}
    </>
  );
}
