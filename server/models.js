const mongoose = require("mongoose")

const Task = new mongoose.Schema({
  kaid: { type: String, required: true },
  title: { type: String, required: true },
  name: { type: String, required: true },
})

exports.Task = mongoose.model("Task", Task)

const Topics = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [Task],
})

exports.Topics = mongoose.model("Topics", Topics)

const Mission = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  topics: [Topics],
})

exports.Mission = mongoose.model("Mission", Mission, "mission")

const TaskList = new mongoose.Schema({
  kaid: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
})

exports.TaskList = mongoose.model("TaskList", TaskList)

const User = new mongoose.Schema({
  kaid: String,
  username: String,
})
exports.User = mongoose.model("User", User, "user")
