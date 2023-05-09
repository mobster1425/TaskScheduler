//require('dotenv').config();
const schedule = require('node-schedule');
const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  rule: Object,
  task: Object
});

// Define the Task model
const Task = mongoose.model('Task', taskSchema);

class TaskScheduler {
  constructor(mongodbURL) {
    this.scheduledTasks = [];
    this.connectToDatabase(mongodbURL);
  }

  async connectToDatabase(mongodbURL) {
   
   // const url = process.env.MONGODB_URI;

    console.log('connecting to', mongodbURL)
    //mongoose.connect(url)
    mongoose.connect(mongodbURL,{serverSelectionTimeoutMS:30000})
      .then(result => {
        console.log('connected to MongoDB')
       
      })
      .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
      })
  


  }

  async scheduleTask(task, rule, metadata) {
    const scheduledTask = schedule.scheduleJob(rule, async () => {
      try {
        await task();
      } catch (err) {
        console.error(err);
      }
    });

    // Save the task to the database
    const dbTask = new Task({
      name: metadata.name,
      description: metadata.description,
      rule: rule,
      task: task.toString()
    });
    await dbTask.save();

    this.scheduledTasks.push(scheduledTask);
  }

  async cancelTask(task) {
    this.scheduledTasks = this.scheduledTasks.filter(async (scheduledTask) => {
      if (scheduledTask.job === task) {
        scheduledTask.cancel();

        // Delete the task from the database
        await Task.deleteOne({ task: task.toString() });
        return false;
      }
      return true;
    });
  }

  async cancelAllTasks() {
    this.scheduledTasks.forEach(async (scheduledTask) => {
      scheduledTask.cancel();
      await Task.deleteOne({ task: scheduledTask.job.toString() });
    });
    this.scheduledTasks = [];
  }

  async getAllTasks() {
    const tasks = await Task.find();
    return tasks;
  }
}

module.exports = TaskScheduler;