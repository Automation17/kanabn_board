const Task = require('../models/Task');

// GET /api/tasks — Get all tasks
async function getTasks(req, res) {
  try {
    const tasks = await Task.find({}).populate('assignedTo', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// POST /api/tasks — Create a new task
async function createTask(req, res) {
  try {
    const { title, description, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || null,
      createdBy: req.user.id, // Comes from the protect middleware
    });

    const populated = await task.populate('assignedTo', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

  // PUT /api/tasks/:id — Update a task (for moving it between columns)
async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    await updatedTask.populate('assignedTo', 'name');
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// DELETE /api/tasks/:id — Delete a task
async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };