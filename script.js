'strict mode';
//////

const nameInput = document.querySelector('#name');
const newTodoForm = document.querySelector('#new-todo-form');
const todoList = document.querySelector('.list');
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let username = localStorage.getItem('username') || '';

//////

const saveTodosToLocalStorage = todos => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

///////

// Display username in the input field
nameInput.value = username;
nameInput.addEventListener('change', function (e) {
  localStorage.setItem('username', e.target.value);
});

// Add new todo on form submit
newTodoForm.addEventListener('submit', e => {
  e.preventDefault();

  const todo = {
    content: e.target.elements.content.value,
    category: e.target.elements.category.value,
    done: false,
    createdAt: new Date().getTime(),
  };

  todos.push(todo);
  saveTodosToLocalStorage(todos);
  e.target.reset();
  updateTodoList();
});

// Update todo list
const updateTodoList = function () {
  let todosHtml = '';

  todos.forEach((todo, i) => {
    todosHtml += `
    <div class="todo__item ${todo.done ? 'done' : ''}">
      <label>
        <input type="checkbox" ${todo.done ? 'checked' : ''} />
        <span class="bubble ${todo.category}"></span>
      </label>

      <div class="todo__content">
        <input type="text" value="${todo.content}" readonly />
      </div>

      <div class="actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    </div>
  `;
  });

  todoList.innerHTML = todosHtml;

  // Updates todo completion status
  const checkboxInput = todoList.querySelectorAll(
    '.todo__item input[type="checkbox"]'
  );

  checkboxInput.forEach((checkbox, i) => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        todos[i].done = true;
        checkbox.closest('.todo__item').classList.add('done');
      }

      if (!checkbox.checked) {
        todos[i].done = false;
        checkbox.closest('.todo__item').classList.remove('done');
      }
      saveTodosToLocalStorage(todos);
    });
  });

  // Add 'done' class to todo items the are marked as done
  todos.forEach((todo, i) => {
    if (todo.done) {
      const todoItem = todoList.children[i];
      todoItem.classList.add('done');
    }
  });

  // Edit todo content
  const editButtons = document.querySelectorAll('.edit');
  editButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
      const input = button
        .closest('.todo__item')
        .querySelector('input[type="text"]');
      input.removeAttribute('readonly');
      input.focus();
      input.addEventListener('blur', () => {
        input.setAttribute('readonly', true);
        todos[i].content = input.value;
        saveTodosToLocalStorage(todos);
      });
    });
  });

  // Loop through delete buttons and add event listeners
  const deleteButtons = document.querySelectorAll('.delete');
  deleteButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
      todos.splice(i, 1);
      saveTodosToLocalStorage(todos);
      updateTodoList();
    });
  });
};

updateTodoList();
