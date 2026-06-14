const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Load tasks as soon as the widget opens
document.addEventListener('DOMContentLoaded', loadTasks);

// Save Function
function saveTasks() {
  const tasks = [];
  // Look at every list item and push its text into our array
  document.querySelectorAll('#todo-list li').forEach(li => {
    tasks.push(li.textContent);
  });
  // convert array to text format (JSON)
  localStorage.setItem('pixelTasks', JSON.stringify(tasks));
}

// load
function loadTasks() {
  // Grab saved text and convert it back to JavaScript array
  const savedTasks = JSON.parse(localStorage.getItem('pixelTasks'));
  
  // If there are saved tasks, create them on the screen
  if (savedTasks) {
    savedTasks.forEach(taskText => {
      createTaskElement(taskText);
    });
  }
}

// creating
// We moved this into its own function so we can use it for BOTH new and saved tasks
function createTaskElement(taskText) {
  const li = document.createElement('li');
  li.textContent = taskText;
  
  // delete task on click
  li.addEventListener('click', () => {
    li.remove();
    saveTasks(); // save new state after deleting
  });

  todoList.appendChild(li);
}

// add a new task
function addTask() {
  const taskText = taskInput.value.trim().toLowerCase();
  
  if (taskText !== '') {
    createTaskElement(taskText);
    saveTasks(); 
    taskInput.value = ''; 
  }
}

// listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});