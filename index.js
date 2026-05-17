let items = [];

const itemDiv = document.getElementById("items")
const itemInput = document.getElementById("itemInput")
const storageKey = "items"

function renderItems(){
    itemDiv.innerHTML = null;

    //allows us to access the index and the item at the index for the items list
    for(const[index, item]of Object.entries(items)){

        //to include a button on each item we need a container for item + button
        const container = document.createElement("div")
        container.style.marginBottom = "15px"       //seperates item + button

        //make text item
        const text = document.createElement("p")
        text.style.display = "inline"
        text.style.paddingInlineEnd ="15px" //if does not add space use .marginRight
        text.textContent = item;

        //make button item
        const button = document.createElement("button")
        button.textContent = "Delete"           //button display
        //on button click, calls the function () => to then call the removeItem(index) function to remove
        button.onclick = () => removeItem(index)   
        
        container.appendChild(text);
        container.appendChild(button);

        itemDiv.appendChild(container);
    }
}

//local storage method
function loadItems(){
    const oldItems = localStorage.getItem(storageKey)
    if(oldItems) items = JSON.parse(oldItems)
    renderItems()
}

function saveItems(){
    const stringItems = JSON.stringify(items);
    localStorage.setItem(storageKey, stringItems) 
    //will override existing value in local storage
}

function addItem(){
    //take content from the input box and render
    const value = itemInput.value;

    //conferm that the textbox contains something
    if(!value){
        alert("You cannot add an empty item")
        return
    }

    items.push(value)
    renderItems()
    itemInput.value = ""
    saveItems()
}

function removeItem(index){
    //delete item at index, then reload items
    items.splice(index,1) //splice = remove item from array (at index, remove n items)
    renderItems();
    saveItems();
}

//html event listener that calls the loadItems() function when the page loads
document.addEventListener("DOMContentLoaded", loadItems)