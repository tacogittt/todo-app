/* ============================================
   STATE MANAGEMENT
   ============================================ */

// Application state
const state = {
  todos: [],
  currentFilter: 'all',
  darkMode: false,
  editingId: null
};

// Local Storage keys
const STORAGE_KEY = 'todos-app';
const THEME_KEY = 'todos-theme';

// Load state from localStorage on init
function loadState() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTodos) {
    try {
      state.todos = JSON.parse(savedTodos);
    } catch (e) {
      console.error('Failed to load todos:', e);
      state.todos = [];
    }
  }

  if (savedTheme) {
    state.darkMode = savedTheme === 'dark';
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

// Save theme preference
function saveTheme() {
  localStorage.setItem(THEME_KEY, state.darkMode ? 'dark' : 'light');
}

/* ============================================
   TODO OPERATIONS (CRUD)
   ============================================ */

// Create TODO
function createTodo(text) {
  const todo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.todos.unshift(todo); // Add to beginning
  saveState();
  render();
}

// Update TODO
function updateTodo(id, updates) {
  const index = state.todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    state.todos[index] = { ...state.todos[index], ...updates };
    saveState();
    render();
  }
}

// Delete TODO
function deleteTodo(id) {
  state.todos = state.todos.filter(todo => todo.id !== id);
  saveState();
  render();
}

// Toggle TODO completion
function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveState();
    render();
  }
}

// Clear completed TODOs
function clearCompleted() {
  state.todos = state.todos.filter(todo => !todo.completed);
  saveState();
  render();
}

// Get filtered TODOs
function getFilteredTodos() {
  switch (state.currentFilter) {
    case 'active':
      return state.todos.filter(todo => !todo.completed);
    case 'completed':
      return state.todos.filter(todo => todo.completed);
    default:
      return state.todos;
  }
}

// Get remaining count
function getRemainingCount() {
  return state.todos.filter(todo => !todo.completed).length;
}

/* ============================================
   DOM MANIPULATION & RENDERING
   ============================================ */

// Main render function
function render() {
  renderTodoList();
  renderRemainingCount();
  updateFilterButtons();
  updateClearButton();
}

// Render TODO list
function renderTodoList() {
  const todoList = document.getElementById('todo-list');
  const filteredTodos = getFilteredTodos();

  // Clear existing items (except empty state)
  const existingItems = todoList.querySelectorAll('.todo-item');
  existingItems.forEach(item => item.remove());

  // Toggle empty state class
  if (filteredTodos.length === 0 && state.todos.length === 0) {
    todoList.classList.remove('has-items');
  } else {
    todoList.classList.add('has-items');
  }

  // Render filtered TODOs
  filteredTodos.forEach(todo => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });

  // Show empty message if no results for filter
  if (filteredTodos.length === 0 && state.todos.length > 0) {
    const emptyFilter = document.createElement('li');
    emptyFilter.className = 'empty-state';
    const filterLabels = { all: 'すべて', active: '進行中', completed: '完了済み' };
    emptyFilter.innerHTML = `
      <span class="empty-icon">🔍</span>
      <p class="empty-message">${filterLabels[state.currentFilter]}のタスクはありません</p>
    `;
    todoList.appendChild(emptyFilter);
  }
}

// Create TODO element
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => toggleTodo(todo.id));

  // Text or edit input
  let textElement;
  if (state.editingId === todo.id) {
    textElement = document.createElement('input');
    textElement.type = 'text';
    textElement.className = 'todo-edit-input';
    textElement.value = todo.text;
    textElement.addEventListener('blur', () => finishEdit(todo.id, textElement.value));
    textElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        finishEdit(todo.id, textElement.value);
      }
    });
    textElement.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cancelEdit();
      }
    });
    setTimeout(() => textElement.focus(), 0);
  } else {
    textElement = document.createElement('span');
    textElement.className = 'todo-text';
    textElement.textContent = todo.text;
    textElement.addEventListener('dblclick', () => startEdit(todo.id));
  }

  // Actions container
  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'todo-action-btn edit-btn';
  editBtn.setAttribute('aria-label', 'タスクを編集');
  editBtn.addEventListener('click', () => startEdit(todo.id));

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo-action-btn delete-btn';
  deleteBtn.setAttribute('aria-label', 'タスクを削除');
  deleteBtn.addEventListener('click', () => deleteTodoWithAnimation(todo.id, li));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(textElement);
  li.appendChild(actions);

  return li;
}

// Delete with animation
function deleteTodoWithAnimation(id, element) {
  element.classList.add('deleting');
  setTimeout(() => {
    deleteTodo(id);
  }, 300);
}

// Start editing
function startEdit(id) {
  state.editingId = id;
  render();
}

// Finish editing
function finishEdit(id, newText) {
  if (newText.trim()) {
    updateTodo(id, { text: newText.trim() });
  }
  state.editingId = null;
  render();
}

// Cancel editing
function cancelEdit() {
  state.editingId = null;
  render();
}

// Render remaining count
function renderRemainingCount() {
  const badge = document.getElementById('remaining-count');
  const count = getRemainingCount();
  badge.textContent = `${count} 件の未完了`;
}

// Update filter button states
function updateFilterButtons() {
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(btn => {
    if (btn.dataset.filter === state.currentFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Update clear button state
function updateClearButton() {
  const clearButton = document.getElementById('clear-completed');
  const completedCount = state.todos.filter(t => t.completed).length;
  clearButton.disabled = completedCount === 0;
}

/* ============================================
   EVENT HANDLERS
   ============================================ */

// Form submit handler
function handleFormSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  const text = input.value.trim();

  if (text) {
    createTodo(text);
    input.value = '';
    input.focus();
  }
}

// Filter button handler
function handleFilterChange(filter) {
  state.currentFilter = filter;
  render();
}

// Dark mode toggle handler
function handleDarkModeToggle() {
  state.darkMode = !state.darkMode;
  const root = document.documentElement;

  if (state.darkMode) {
    root.classList.add('dark-mode');
  } else {
    root.classList.remove('dark-mode');
  }

  saveTheme();
}

// Clear completed handler
function handleClearCompleted() {
  const completedCount = state.todos.filter(t => t.completed).length;

  if (completedCount === 0) {
    return;
  }

  if (confirm(`完了済みのタスク ${completedCount} 件を削除しますか？`)) {
    clearCompleted();
  }
}

/* ============================================
   INITIALIZATION
   ============================================ */

function init() {
  // Load saved state
  loadState();

  // Apply dark mode if saved
  if (state.darkMode) {
    document.documentElement.classList.add('dark-mode');
  }

  // Initial render
  render();

  // Attach event listeners
  const form = document.getElementById('todo-form');
  form.addEventListener('submit', handleFormSubmit);

  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => handleFilterChange(btn.dataset.filter));
  });

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('click', handleDarkModeToggle);

  const clearButton = document.getElementById('clear-completed');
  clearButton.addEventListener('click', handleClearCompleted);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape to cancel editing
    if (e.key === 'Escape' && state.editingId) {
      cancelEdit();
    }
  });

  // Focus input on load
  document.getElementById('todo-input').focus();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
