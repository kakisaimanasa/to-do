/**
 * TaskFlow - To-Do List Application
 * A comprehensive task management application with local storage persistence
 */


class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentEditId = null;
        this.taskIdCounter = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.loadTasks();
        this.updateUI();
    }

    /** Initialize DOM element references */
    initializeElements() {
        this.elements = {
            taskInput: document.getElementById('taskInput'),
            addTaskBtn: document.getElementById('addTaskBtn'),
            tasksList: document.getElementById('tasksList'),
            emptyState: document.getElementById('emptyState'),
            errorMessage: document.getElementById('errorMessage'),
            taskCounter: document.getElementById('taskCounter'),
            completedCounter: document.getElementById('completedCounter'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            confirmModal: document.getElementById('confirmModal'),
            confirmDeleteBtn: document.getElementById('confirmDelete'),
            cancelDeleteBtn: document.getElementById('cancelDelete')
        };
    }

    /** Bind event listeners */
    bindEvents() {
        this.elements.taskInput.addEventListener('input', this.handleInputChange.bind(this));
        this.elements.taskInput.addEventListener('keypress', this.handleInputKeyPress.bind(this));
        this.elements.addTaskBtn.addEventListener('click', this.handleAddTask.bind(this));
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', this.handleFilterChange.bind(this));
        });
        this.elements.confirmDeleteBtn.addEventListener('click', this.handleConfirmDelete.bind(this));
        this.elements.cancelDeleteBtn.addEventListener('click', this.hideConfirmModal.bind(this));
        this.elements.confirmModal.addEventListener('click', this.handleModalOverlayClick.bind(this));
        document.addEventListener('keydown', this.handleGlobalKeyPress.bind(this));
    }

    handleInputChange() {
        const hasValue = this.elements.taskInput.value.trim().length > 0;
        this.elements.addTaskBtn.disabled = !hasValue;
        this.hideError();
    }

    handleInputKeyPress(event) {
        if (event.key === 'Enter' && !this.elements.addTaskBtn.disabled) {
            this.handleAddTask();
        }
    }

    handleGlobalKeyPress(event) {
        if (event.key === 'Escape' && this.elements.confirmModal.classList.contains('show')) {
            this.hideConfirmModal();
        }
    }

    handleAddTask() {
        const taskText = this.elements.taskInput.value.trim();
        if (!this.validateTaskText(taskText)) {
            return;
        }
        const task = this.createTask(taskText);
        this.tasks.unshift(task);
        this.saveTasks();
        this.elements.taskInput.value = '';
        this.elements.addTaskBtn.disabled = true;
        this.updateUI();
        this.hideError();
        this.elements.taskInput.focus();
    }

    validateTaskText(text) {
        if (!text) {
            this.showError('Please enter a task description');
            return false;
        }
        if (text.length > 200) {
            this.showError('Task description must be 200 characters or less');
            return false;
        }
        return true;
    }

    createTask(text) {
        return {
            id: ++this.taskIdCounter,
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
    }

    handleFilterChange(event) {
        const filter = event.target.dataset.filter;
        this.currentFilter = filter;
        this.elements.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.updateTasksDisplay();
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.updateUI();
        }
    }

    startEditTask(taskId) {
        if (this.currentEditId !== null) {
            this.cancelEditTask();
        }
        this.currentEditId = taskId;
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        const textElement = taskElement.querySelector('.task-text');
        const actionsElement = taskElement.querySelector('.task-actions');
        const currentText = textElement.textContent;
        textElement.innerHTML = `<input type="text" class="task-edit-input" value="${this.escapeHtml(currentText)}" maxlength="200">`;
        actionsElement.innerHTML = `
            <button class="task-btn save-btn" onclick="taskManager.saveEditTask(${taskId})">Save</button>
            <button class="task-btn cancel-btn" onclick="taskManager.cancelEditTask()">Cancel</button>
        `;
        const editInput = textElement.querySelector('.task-edit-input');
        editInput.focus();
        editInput.select();
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveEditTask(taskId);
            }
        });
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cancelEditTask();
            }
        });
    }

    saveEditTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        const editInput = taskElement.querySelector('.task-edit-input');
        const newText = editInput.value.trim();
        if (!this.validateTaskText(newText)) {
            editInput.focus();
            return;
        }
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newText;
            this.saveTasks();
        }
        this.currentEditId = null;
        this.updateTasksDisplay();
        this.hideError();
    }

    cancelEditTask() {
        this.currentEditId = null;
        this.updateTasksDisplay();
        this.hideError();
    }

    showDeleteConfirmation(taskId) {
        this.taskToDelete = taskId;
        this.elements.confirmModal.classList.add('show');
        setTimeout(() => {
            this.elements.confirmDeleteBtn.focus();
        }, 100);
    }

    handleModalOverlayClick(event) {
        if (event.target === this.elements.confirmModal) {
            this.hideConfirmModal();
        }
    }

    hideConfirmModal() {
        this.elements.confirmModal.classList.remove('show');
        this.taskToDelete = null;
    }

    handleConfirmDelete() {
        if (this.taskToDelete !== null) {
            this.deleteTask(this.taskToDelete);
            this.hideConfirmModal();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.updateUI();
        if (this.currentEditId === taskId) {
            this.currentEditId = null;
        }
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    updateUI() {
        this.updateCounters();
        this.updateTasksDisplay();
    }

    updateCounters() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        this.elements.taskCounter.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
        this.elements.completedCounter.textContent = `${completedTasks} completed`;
    }

    updateTasksDisplay() {
        const filteredTasks = this.getFilteredTasks();
        if (filteredTasks.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
            this.renderTasks(filteredTasks);
        }
    }

    renderTasks(tasks) {
        this.elements.tasksList.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');
    }

    createTaskHTML(task) {
        const isEditing = this.currentEditId === task.id;
        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-content">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="taskManager.toggleTaskCompletion(${task.id})"
                        aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
                    >
                    <div class="task-text">
                        ${isEditing ? 
                            `<input type="text" class="task-edit-input" value="${this.escapeHtml(task.text)}" maxlength="200">` :
                            this.escapeHtml(task.text)
                        }
                    </div>
                    <div class="task-actions">
                        ${isEditing ? `
                            <button class="task-btn save-btn" onclick="taskManager.saveEditTask(${task.id})">Save</button>
                            <button class="task-btn cancel-btn" onclick="taskManager.cancelEditTask()">Cancel</button>
                        ` : `
                            <button class="task-btn edit-btn" onclick="taskManager.startEditTask(${task.id})" aria-label="Edit task">Edit</button>
                            <button class="task-btn delete-btn" onclick="taskManager.showDeleteConfirmation(${task.id})" aria-label="Delete task">Delete</button>
                        `}
                    </div>
                </div>
            </li>
        `;
    }

    showEmptyState() {
        this.elements.emptyState.classList.remove('hidden');
        this.elements.tasksList.innerHTML = '';
    }

    hideEmptyState() {
        this.elements.emptyState.classList.add('hidden');
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.add('show');
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.elements.errorMessage.classList.remove('show');
    }

    saveTasks() {
        try {
            const data = {
                tasks: this.tasks,
                taskIdCounter: this.taskIdCounter
            };
            localStorage.setItem('taskflow-data', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save tasks to localStorage:', error);
            this.showError('Failed to save tasks. Your changes may not persist.');
        }
    }

    loadTasks() {
        try {
            const savedData = localStorage.getItem('taskflow-data');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.tasks = data.tasks || [];
                this.taskIdCounter = data.taskIdCounter || 0;
                this.tasks.forEach(task => {
                    if (typeof task.id !== 'number') {
                        task.id = ++this.taskIdCounter;
                    } else if (task.id > this.taskIdCounter) {
                        this.taskIdCounter = task.id;
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load tasks from localStorage:', error);
            this.tasks = [];
            this.taskIdCounter = 0;
        }
    }

    /** Escape HTML to prevent XSS */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /** Export tasks (for potential future use) */
    exportTasks() {
        return {
            tasks: this.tasks,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /** Import tasks (for potential future use) */
    importTasks(data) {
        if (data.tasks && Array.isArray(data.tasks)) {
            this.tasks = data.tasks;
            this.saveTasks();
            this.updateUI();
            return true;
        }
        return false;
    }

    /** Clear all tasks (for potential future use) */
    clearAllTasks() {
        this.tasks = [];
        this.taskIdCounter = 0;
        this.currentEditId = null;
        this.saveTasks();
        this.updateUI();
    }

    /** Get statistics about tasks */
    getStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const active = total - completed;
        return {
            total,
            completed,
            active,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});

// Service Worker registration for potential offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker implementation would go here (uncomment and provide the script if needed)
        // navigator.serviceWorker.register('/sw.js');
    });
}
