class Modal {
    constructor() {
        this._overlay = document.getElementById('modal-overlay');
        this._openBtn = document.getElementById('btn-add');
        this._closeBtn = document.getElementById('btn-close');
        this._modalTitle = document.getElementById('modal-title');
        this._form = document.getElementById('task-form');
        this._taskIdInput = document.getElementById('task-id');
        
        this._onSubmit = null;
        this._importanceSelect = document.getElementById('importance');
        this._addEventListeners();
        this._setupImportanceSelect();
    }

    _setupImportanceSelect() {
        this._updateImportanceColor();
        this._importanceSelect.addEventListener('change', () => this._updateImportanceColor());
    }

    _updateImportanceColor() {
        const value = this._importanceSelect.value;
        this._importanceSelect.className = `importance-${value}`;
    }

    _addEventListeners() {
        this._openBtn.addEventListener('click', () => this.open());
        this._closeBtn.addEventListener('click', () => this.close());
        this._overlay.addEventListener('click', (e) => {
            if (e.target === this._overlay) {
                this.close();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._overlay.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(task = null) {
        // Reset form
        this._form.reset();
        this._taskIdInput.value = '';
        
        // Load saved creator name from localStorage
        const savedCreator = localStorage.getItem('createdBy') || '';
        document.getElementById('createdBy').value = savedCreator;
        
        if (task) {
            // Edit mode
            this._modalTitle.textContent = 'Edit Task';
            this._taskIdInput.value = task._id;
            document.getElementById('title').value = task.title || '';
            document.getElementById('description').value = task.description || '';
            document.getElementById('responsible').value = task.responsible || '';
            if (task.dueDate) {
                document.getElementById('dueDate').value = task.dueDate.split('T')[0];
            }
            if (task.importance) {
                document.getElementById('importance').value = task.importance;
                this._updateImportanceColor();
            }
            if (task.createdBy) {
                document.getElementById('createdBy').value = task.createdBy;
            }
        } else {
            // Create mode
            this._modalTitle.textContent = 'New Task';
            // Set default due date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('dueDate').value = tomorrow.toISOString().split('T')[0];
            this._updateImportanceColor();
        }
        
        this._overlay.classList.add('active');
        document.getElementById('title').focus();
    }

    close() {
        this._overlay.classList.remove('active');
        this._form.reset();
        this._taskIdInput.value = '';
    }

    setOnSubmit(callback) {
        this._onSubmit = callback;
        
        this._form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = this._form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            
            const createdBy = document.getElementById('createdBy').value.trim();
            
            const formData = {
                title: document.getElementById('title').value.trim(),
                description: document.getElementById('description').value.trim(),
                responsible: document.getElementById('responsible').value.trim(),
                dueDate: document.getElementById('dueDate').value,
                importance: document.getElementById('importance').value,
                createdBy: createdBy,
            };
            
            // Validate all required fields
            if (!formData.title || !formData.description || !formData.responsible || !formData.dueDate || !formData.createdBy) {
                alert('Please fill in all fields');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }
            
            // Save creator name to localStorage for future use
            localStorage.setItem('createdBy', createdBy);
            
            const taskId = this._taskIdInput.value;
            
            try {
                await this._onSubmit(formData, taskId || null);
                this.close();
            } catch (error) {
                console.error('Error saving task:', error);
                alert('Failed to save task: ' + (error.message || 'Unknown error'));
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

export default Modal;
