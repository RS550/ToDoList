let items = [];

const itemDiv = document.getElementById("items")
const itemInput = document.getElementById("itemInput")
const buttItem = document.getElementById("buttItem")
const inputT = document.querySelector('input[type="text"]');

const storageKey = "items"

function getContainer(){
    return document.getElementById('contentContainer')
}

function getInputRow(){
    const container = getContainer();
    return Array.from(container.querySelectorAll('.inputRow'));
}

function renderItems() {
    const container = getContainer();
 
    // Remove all task rows
    container.querySelectorAll('.taskRow').forEach(el => el.remove());
 
    // Build one grid row per item (3 cells each)
    items.forEach((item, index) => {
        // Column 1: Checkbox
        const checkCell = document.createElement("div");
        checkCell.classList.add("cell", "taskRow");
        const label = document.createElement("label");
        label.classList.add("checkLabel");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkB");
        label.appendChild(checkbox);
        checkCell.appendChild(label);
        
 
        // Column 2: Text
        const textCell = document.createElement("div");
        textCell.classList.add("cell", "taskRow", "taskText");
        const text = document.createElement("p");
        text.textContent = item;
        textCell.appendChild(text);
 
        // Strike through text when checkbox is ticked
        checkbox.addEventListener('change', function() {
            text.style.textDecoration = this.checked ? 'line-through' : 'none';
            text.style.opacity = this.checked ? '0.5' : '1';
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




//local storage method
function loadItems(){
    const oldItems = localStorage.getItem(storageKey)
    if(oldItems) items = JSON.parse(oldItems)
    renderItems()
}

function saveItems() {
    localStorage.setItem(storageKey, JSON.stringify(items));
}

function addItem() {
    const input = document.getElementById("itemInput");
    const value = input.value.trim();
    if (!value) return;
    items.push(value);
    renderItems();
    document.getElementById("itemInput").value = "";
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

