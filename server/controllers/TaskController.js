const Task = require("../models/Task");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const user = await User.findById({ _id: req.session.userId });

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.session.userId,
    });

    // Save the task to the database
    await newTask.save();

    // Access the Socket.IO instance from the app
    const io = req.app.get("io");

    // Emit a 'newTaskAssigned' event with the task data
    // This will broadcast the new task to all connected clients
    io.emit("newTaskAssigned", newTask, user.name); // This will be received by the client

    await newTask.save();
    res.status(200).json({ message: "new task created", task: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Task", error: error.message });
  }
};

exports.getTaskCreatedUser = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.session.userId })
      .populate("createdBy", "name")
      .populate("assignedTo", "name");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

exports.getTaskAssignedToUser = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.session.userId })
      .populate("assignedTo", "name")
      .populate("createdBy", "name");
    // console.log(tasks);
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById({ _id: req.params.id }).populate(
      "createdBy",
      "name"
    );

    console.log(task);

    if (!task) return res.status(400).json({ message: "task is not found" });

    console.log(task.createdBy._id.toString(), req.session.userId);

    if (task.createdBy._id.toString() !== req.session.userId) {
      return res.status(400).json({ message: "you not authorized" });
    }

    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;

    const io = req.app.get("io");
    await task.save();
    io.emit("taskUpdated", {
      task,
      assignedTo: task.assignedTo?.toString(),
    });

    res.status(200).json({ message: "task updated", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById({ _id: req.params.id });
    if (!task) return res.status(400).json({ message: "task is not found" });

    console.log(req.session.userId, task.createdBy.toString());

    if (task.createdBy.toString() !== req.session.userId) {
      return res
        .status(400)
        .json({ message: "You are not authorized to delete this task'" });
    }

    const deletedTaskId = task._id;
    const assignedUserId = task.assignedTo?.toString();

    const io = req.app.get("io");
    io.emit("taskDeleted", {
      taskId: deletedTaskId,
      assignedTo: assignedUserId,
    });

    await task.deleteOne({ _id: task._id });
    res.status(200).json({ message: "task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleing task" });
  }
};

exports.overDueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.session.userId },
        { assignedTo: req.session.userId },
      ],
    })
      .populate("createdBy", "name")
      .populate("assignedTo", "name");

    const overDuetasks = tasks.filter((task) => {
      if (
        task.dueDate < Date.now() &&
        (task.status === "In Progress" || task.status === "Pending")
      ) {
        return tasks;
      }
    });
    return res.status(200).json({ tasks: overDuetasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
