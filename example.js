
const schedule = require('node-schedule');
const TaskScheduler = require('./TaskScheduler');

// Create a new task scheduler
const taskScheduler = new TaskScheduler();

// Define a task to be scheduled
const myTask = () => {
  console.log('Hello, world!');
}

// Schedule the task to run every minute
const rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1);
const metadata = { name: 'My task', description: 'Prints "Hello, world!" every minute' };
taskScheduler.scheduleTask(myTask, rule, metadata);

// Wait for 5 minutes, then cancel the task
setTimeout(async () => {
  console.log('Cancelling all tasks...');
  await taskScheduler.cancelTask(myTask);
 // await taskScheduler.cancelAllTasks();
}, 5 * 60 * 1000);


