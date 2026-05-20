let items = [];

const storageKey = "items";

function getContainer() {
    return document.getElementById("contentContainer");
}

function renderItems() {
    const container = getContainer();

    // Remove all task rows
    container.querySelectorAll('.taskRow').forEach(el => el.remove());

    items.forEach((item, index) => {
        // Column 1: Checkbox
        const checkCell = document.createElement("div");
        checkCell.classList.add("cell", "taskRow");
        const label = document.createElement("label");
        label.classList.add("checkLabel");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkB");
        checkbox.checked = item.checked; // restore saved state
        label.appendChild(checkbox);
        checkCell.appendChild(label);

        // Column 2: Text
        const textCell = document.createElement("div");
        textCell.classList.add("cell", "taskRow", "taskText");
        const text = document.createElement("p");
        text.textContent = item.text;
        if (item.checked) {
            text.style.textDecoration = 'line-through';
            text.style.opacity = '0.5';
        }
        textCell.appendChild(text);

        // Save checked state and update strikethrough on change
        checkbox.addEventListener('change', function() {
            items[index].checked = this.checked;
            text.style.textDecoration = this.checked ? 'line-through' : 'none';
            text.style.opacity = this.checked ? '0.5' : '1';
            saveItems();
        });

        // Column 3: Delete button
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