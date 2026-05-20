let items = [];
let draggedIndex = null;

const storageKey = "items";

function getContainer() {
    return document.getElementById("contentContainer");
}


function renderItems() {
    const container = getContainer();
 
    // Remove all task rows
    container.querySelectorAll('.taskRow').forEach(el => el.remove());
 
    items.forEach((item, index) => {
 
        // ── Column 1: Checkbox (also the drag handle) ──
        const checkCell = document.createElement("div");
        checkCell.classList.add("cell", "taskRow", "dragHandle");
        checkCell.draggable = true;
        checkCell.title = "Drag to reorder";
 
        const label = document.createElement("label");
        label.classList.add("checkLabel");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkB");
        checkbox.checked = item.checked;
        label.appendChild(checkbox);
        checkCell.appendChild(label);
 
        // ── Drag events ──
        checkCell.addEventListener('dragstart', (e) => {
            draggedIndex = index;
            // mark all 3 cells of this row
            checkCell.classList.add('dragging');
            textCell.classList.add('dragging');
            btnCell.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
 
        checkCell.addEventListener('dragend', () => {
            document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
            document.querySelectorAll('.dragOver').forEach(el => el.classList.remove('dragOver'));
        });
 
        checkCell.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedIndex !== index) {
                checkCell.classList.add('dragOver');
                textCell.classList.add('dragOver');
                btnCell.classList.add('dragOver');
            }
        });
 
        checkCell.addEventListener('dragleave', () => {
            checkCell.classList.remove('dragOver');
            textCell.classList.remove('dragOver');
            btnCell.classList.remove('dragOver');
        });
 
        checkCell.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedIndex !== null && draggedIndex !== index) {
                const dragged = items.splice(draggedIndex, 1)[0];
                items.splice(index, 0, dragged);
                saveItems();
                renderItems();
            }
        });
 
        // ── Column 2: Text (double-click to edit) ──
        const textCell = document.createElement("div");
        textCell.classList.add("cell", "taskRow", "taskText");
 
        const text = document.createElement("p");
        text.textContent = item.text;
        text.title = "Double-click to edit";
        if (item.checked) {
            text.style.textDecoration = 'line-through';
            text.style.opacity = '0.5';
        }
        textCell.appendChild(text);
 
        // Also handle drag events on textCell so the whole row highlights
        textCell.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedIndex !== index) {
                checkCell.classList.add('dragOver');
                textCell.classList.add('dragOver');
                btnCell.classList.add('dragOver');
            }
        });
        textCell.addEventListener('dragleave', () => {
            checkCell.classList.remove('dragOver');
            textCell.classList.remove('dragOver');
            btnCell.classList.remove('dragOver');
        });
        textCell.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedIndex !== null && draggedIndex !== index) {
                const dragged = items.splice(draggedIndex, 1)[0];
                items.splice(index, 0, dragged);
                saveItems();
                renderItems();
            }
        });
 
        // Double-click to edit
        text.addEventListener('dblclick', () => {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = item.text;
            editInput.classList.add('inlineEdit');
            textCell.replaceChild(editInput, text);
            editInput.focus();
            editInput.select();
 
            function commitEdit() {
                const newValue = editInput.value.trim();
                if (newValue) {
                    items[index].text = newValue;
                    saveItems();
                }
                renderItems();
            }
 
            editInput.addEventListener('blur', commitEdit);
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { editInput.removeEventListener('blur', commitEdit); commitEdit(); }
                if (e.key === 'Escape') renderItems(); // cancel
            });
        });
 
        // Checkbox change
        checkbox.addEventListener('change', function () {
            items[index].checked = this.checked;
            text.style.textDecoration = this.checked ? 'line-through' : 'none';
            text.style.opacity = this.checked ? '0.5' : '1';
            saveItems();
        });
 
        // ── Column 3: Delete button ──
        const btnCell = document.createElement("div");
        btnCell.classList.add("cell", "taskRow", "btnCell");
        const button = document.createElement("button");
        button.textContent = "✕";
        button.onclick = () => removeItem(index);
        btnCell.appendChild(button);
 
        container.appendChild(checkCell);
        container.appendChild(textCell);
        container.appendChild(btnCell);
    });
}


function loadItems() {
    const oldItems = localStorage.getItem(storageKey);
    if (oldItems) items = JSON.parse(oldItems);
    renderItems();
}

function saveItems() {
    localStorage.setItem(storageKey, JSON.stringify(items));
}

function addItem() {
    const input = document.getElementById("itemInput");
    const value = input.value.trim();
    if (!value) return;
    items.push({ text: value, checked: false }); // store as object
    renderItems();
    input.value = "";
    saveItems();
}

function removeItem(index) {
    items.splice(index, 1);
    renderItems();
    saveItems();
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("itemInput");
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') addItem();
    });
    loadItems();
});