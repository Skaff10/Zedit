const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");
const createTask = asyncHandler(async (req, res) => {
  const { tasks } = req.body;
  const createdTask = await Promise.all(
    tasks.map((task) =>
      Task.create({
        documentId: req.params.id,
        createdBy: req.user._id,
        text: task,
      })
    )
  );

  res.status(201).json(createdTask);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.status = req.body.status;
  await task.save();
  res.status(200).json(task);
});

module.exports = {
  createTask,
  updateTaskStatus,
};
