//Fields

//Add Task Buttons
const addTaskButtonBacklog = document.getElementById('addTaskButtonBacklog');
const addTaskButtonToDos = document.getElementById('addTaskButtonToDos');
const addTaskButtonInProgress = document.getElementById('addTaskButtonInProgress');
const addTaskButtonDone = document.getElementById('addTaskButtonDone');
//Input Buttons
const inputTaskButtonBacklog = document.getElementById('inputTaskButtonBacklog');
const inputTaskButtonToDos = document.getElementById('inputTaskButtonToDos');
const inputTaskButtonInProgress = document.getElementById('inputTaskButtonInProgress');
const inputTaskButtonDone = document.getElementById('inputTaskButtonDone');
//Remove Buttons
const removeAll = document.getElementById('removeAllElements');




//Functions

function createEntryCard(entry){
    //Creates List Element
    let deleteButton = document.createElement('img')
    deleteButton.setAttribute('src','https://img.icons8.com/ios-filled/60/000000/minus.png')
    deleteButton.setAttribute('data-key', entry.key)
    deleteButton.addEventListener('click', () => removeOneTask(entry.key))
    let li = document.createElement('li' );
    li.setAttribute("class", "entryCard")
    li.setAttribute("data-key", entry.key);
    li.innerHTML = entry.text;
    li.appendChild(deleteButton);
    return li;
}

//Adds a task to a list and saves it in local storage
function addToList(columnKey){
    //Gets Input from Input Field
    let newEntry = document.getElementById(`input${columnKey}`).value;
    let index = 0;
    //Checks whether value was entered
    if(newEntry === null || newEntry === "") {
        console.log("empty");
        window.alert("Empty tasks are not allowed")
    } else {
        //Generate UUID for new Entry
        const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

        let newEntryObject = {key: uuid, text: newEntry}

        const newEntryCardElement = createEntryCard(newEntryObject);
        document.getElementById(`taskList${columnKey}`).appendChild(newEntryCardElement);

        //Gets all entries from local Storage
        let allEntries = JSON.parse(localStorage.getItem('allEntries') || JSON.stringify({}));


        //Checks if there is an entry in localStorage and puts new entry in Storage
        if(!allEntries[columnKey]){
            allEntries[columnKey] = [newEntryObject];
        } else {
            allEntries[columnKey].push(newEntryObject);
        }


        //Puts new Entry into localStorage
        localStorage.setItem('allEntries', JSON.stringify(allEntries));
    }
}

//Remove One Task
function removeOneTask(keyToDelete){
    //removes task from localStorage
    let allEntries = JSON.parse(localStorage.getItem('allEntries') || JSON.stringify({}));
    Object.keys(allEntries).forEach(key => {
        allEntries[key].forEach((element, index) => {
            if(keyToDelete === element.key){
                allEntries[key].splice(index, 1)
            }
        })
    })
    localStorage.setItem('allEntries', JSON.stringify(allEntries));

    //removes task from list
    Array.from(document.getElementsByClassName("entryCard")).forEach(
        element => {
            let key = element.getAttribute('data-key');
            if(keyToDelete === key){
                element.remove();

            }
        }
    );
}

//Remove All Tasks
function removeAllEntries(){
    localStorage.removeItem('allEntries');
}

//Gets Local Storage and displays it on load
function onLoad() {
    const allEntries = JSON.parse(localStorage.getItem('allEntries'));
    if(allEntries){
        const columnKeys = Object.keys(allEntries)
        if(columnKeys){
            columnKeys.forEach(key => {
                const entries = allEntries[key];
                entries.forEach(entry => {
                    const newEntryCardElement = createEntryCard(entry);
                    document.getElementById(`taskList${key}`).appendChild(newEntryCardElement);
                })
            })
        }
    }

}


//Shows Input Field
function toggleInputButton(columnKey){
    let inputFieldAndButton = document.getElementById(`inputTask${columnKey}`);
    let addTaskButton = document.getElementById(`addTaskButton${columnKey}`);
    if(inputFieldAndButton.style.display === 'none'){
        inputFieldAndButton.style.display = 'flex';
        addTaskButton.style.display = 'none';
        document.getElementById(`input${columnKey}`).value = "";
    } else {
        inputFieldAndButton.style.display = 'none';
    }
}


//Shows Add Task Button
function toggleAddTaskButton(columnKey) {
    let addTaskButton = document.getElementById(`addTaskButton${columnKey}`);
    let inputFieldAndButton = document.getElementById(`inputTask${columnKey}`)
    if(addTaskButton.style.display === 'none'){
        addTaskButton.style.display = 'flex';
        inputFieldAndButton.style.display = 'none';
    } else {
        addTaskButton.style.display = 'none';
    }
}

//Functionality

//On Load Functionality
window.addEventListener('load', () => onLoad())

//Backlog Column Functionality
inputTaskButtonBacklog.addEventListener('click',() => {
    addToList('Backlog');
    toggleAddTaskButton('Backlog');
});
addTaskButtonBacklog.addEventListener('click', () => toggleInputButton('Backlog'));

//To Dos Column Functionality
inputTaskButtonToDos.addEventListener('click',() => {
    addToList('ToDos');
    toggleAddTaskButton('ToDos');
});
addTaskButtonToDos.addEventListener('click', () => toggleInputButton('ToDos'));

//In Progress Column Functionality
inputTaskButtonInProgress.addEventListener('click',() => {
    addToList('InProgress');
    toggleAddTaskButton('InProgress');
});
addTaskButtonInProgress.addEventListener('click', () => toggleInputButton('InProgress'));

//Done Column Functionality
inputTaskButtonDone.addEventListener('click',() => {
    addToList('Done');
    toggleAddTaskButton('Done');
});
addTaskButtonDone.addEventListener('click', () => toggleInputButton('Done'));

//Remove All Functionality
removeAll.addEventListener('click', () => {
    removeAllEntries();
    window.location.reload();
});

