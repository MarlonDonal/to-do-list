
function menuTodo(a, b) {
    document.getElementsByClassName('modal_bg_transparent')[0].style.display = a;
    document.getElementById('todo_menu_container').style.display = b;
}

const deleteMsg = `You'll lose all the task inside this list. This cannot be recover once deleted.<br><br>Are you sure you want to permanently delete this list?`;

function updateTodoTaskSection() {
    todoTaskSection.innerHTML = `
        <section class="todo_header_container">
            <h1 class="todo_header_title">${localStorage.getItem("list-selected").substring(5)}</h1>
            <div class="list_footer_group">
                <i class="icon_btns" onclick="menuTodo('block', 'flex')">&#xe712;</i>
                <div class="modal_bg_transparent" onclick="menuTodo('none', 'none')"></div>
                <ul id="todo_menu_container">
                    <li onclick="renameTodo()"><i>&#xe8ac;</i>Rename</li>
                    <li onclick="deleteConfirm('Delete List', deleteMsg)"><i>&#xe74d;</i>Delete</li>
                </ul>
            </div>
        </section>
        <div class="line_dividerX"></div>
        <button id="add_task_btn"><i>&#xe710;</i>Add a task</button>
    `;
}

function renameTodo() {
    menuTodo('none', 'none');
    var renameTodoSection = document.createElement("div");
    pageBody[0].appendChild(renameTodoSection);
    renameTodoSection.setAttribute("id", "create_list_section");
    renameTodoSection.setAttribute("class", "modal_bg");
    renameTodoSection.innerHTML = `
        <form class="modal_container form_input" autocomplete="off">
            <header class="modal_header">
                <b>Rename</b>
                <i class="close_btn">&#xe8bb;</i>
            </header>
            <div class="line_dividerX"></div>
            <main class="form_body add_list_body">
                <div class="input_section">
                    <input type="text" id="name_list" class="input_text" placeholder="Enter a name" value="${localStorage.getItem("list-selected").substring(5)}">
                    <button id="save_btn" disabled>Save</button>
                </div>
                <p class="form_error hidden">There is an error renaming your todo.</p>
            </main>
        </form>`;

    var inputField = document.getElementById("name_list"),
        saveBtn = document.getElementById("save_btn");

    closeMenu("create_list_section");
    focusInput(inputField);

    function saveRenameTodo(e) {
        e.preventDefault();
        let oldValue = localStorage.getItem(localStorage.getItem("list-selected")),
            idKey = localStorage.getItem("list-selected").slice(0, 5) + inputField.value.charAt(0).toUpperCase() + inputField.value.slice(1);
        localStorage.removeItem(localStorage.getItem("list-selected"));
        localStorage.removeItem("list-selected");
        localStorage.setItem("list-selected", idKey);
        localStorage.setItem(idKey, oldValue);
        document.querySelector(".list_container.list_active .list_name").innerText = idKey.substring(5);
        document.getElementsByClassName("todo_header_title")[0].innerText = idKey.substring(5);
        document.getElementsByClassName("close_btn")[0].click();
    }
    inputField.oninput = () => {
        if (inputField.value == "" || inputField.value.match(/^\s*$/)) {
            saveBtn.setAttribute("disabled", "");
        } else {
            saveBtn.removeAttribute("disabled");
        }
    };
    saveBtn.onclick = saveRenameTodo;
}

function deleteConfirm(title, msg) {
    menuTodo('none', 'none');
    const deleteConfirmSection = document.createElement("div");
    pageBody[0].appendChild(deleteConfirmSection);
    deleteConfirmSection.setAttribute("id", "delete_confirm_section");
    deleteConfirmSection.setAttribute("class", "modal_bg");
    deleteConfirmSection.innerHTML = `
        <form class="modal_container form_input">
            <header class="modal_header">
                <b>${title}</b>
                <i class="close_btn">&#xe8bb;</i>
            </header>
            <div class="line_dividerX"></div>
            <main class="form_body add_list_body">
                <p>${msg}</p>
            </main>
            <div class="line_dividerX"></div>
            <footer class="form_footer">
                ada
            </footer>
        </form>`;
    
    closeMenu("delete_confirm_section");
}

function deleteTodo() {
    localStorage.removeItem(localStorage.getItem("list-selected"));

    location.reload();
}

function loadTasks() {
    if (localStorage.getItem(localStorage.getItem("list-selected")) !== "[]") {
        todoTaskSection.innerHTML += `<ul id="todo_container"></ul>`;

        var todos = Array.from(JSON.parse(localStorage.getItem(localStorage.getItem("list-selected")))),
            taskID = 0,
            todoContainer = document.getElementById("todo_container");

        todos.forEach(todo => {
            todoContainer.innerHTML += `
                <li class="task_list">
                    <input type="checkbox" class="task_checkbox" id="task_checkbox_${taskID}" onclick="checkTask(${taskID})" ${todo.completed == true ? "checked" : ""}/>
                    <input type="text" class="task_input" id="task_input_${taskID}" value="${todo.name}" oninput="editTask(${taskID})" />
                    <i class="task_delete" id="task_delete_${taskID}" onclick="deleteTask(${taskID})">&#xe8bb;</i>
                </li>`;
            taskID++;
        })
    }
}

function checkTask(n) {
    const selected = localStorage.getItem("list-selected"),
          todos = Array.from(JSON.parse(localStorage.getItem(selected)));
    if (document.getElementById("task_checkbox_" + n).checked) {
        todos[n].completed = true;
        localStorage.setItem(selected, JSON.stringify(todos));
    } else {
        todos[n].completed = false;
        localStorage.setItem(selected, JSON.stringify(todos));
    }
}

function editTask(n) {
    const selected = localStorage.getItem("list-selected"),
          todos = Array.from(JSON.parse(localStorage.getItem(selected)));
    todos[n].name = document.getElementById("task_input_" + n).value;
    localStorage.setItem(selected, JSON.stringify(todos));
}

function deleteTask(n) {
    const selected = localStorage.getItem("list-selected"),
          todos = Array.from(JSON.parse(localStorage.getItem(selected)));
    todos.splice(n, 1);
    localStorage.setItem(selected, JSON.stringify(todos));
    location.reload();
}

function updateActiveTodo() {
    const activeTodo = document.querySelector(".list_container.list_active"),
          listSelected = localStorage.getItem("list-selected"),
          listID = localStorage.getItem("list-last-id"),
          currentSelected = document.getElementById(listSelected.substring(0, 5)),
          activeElmnts = `<div class="list_color"></div><p class="list_name">${listSelected.substring(5)}</p>`;

    if (listID == 1) {
        currentSelected.innerHTML = activeElmnts;
    } else {
        activeTodo.classList.remove("list_active");
        document.getElementsByClassName("list_color")[0].remove();
        currentSelected.classList.add("list_active");
        currentSelected.innerHTML = activeElmnts;
    }
    
    updateTodoTaskSection();
    
    loadTasks();

    document.getElementById("add_task_btn").onclick = createTodo;
}

if (Object.keys(localStorage).some(key => key.startsWith("#"))) {
    listContainer.innerHTML = "";

    var keys = Object.keys(localStorage);

    keys.sort();

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key.startsWith("#")) {
            if (localStorage.getItem(localStorage.getItem("list-selected")) == null) {
                localStorage.setItem("list-selected", key);
            }

            if (localStorage.getItem("list-selected") == key) {
                listContainer.innerHTML += `
                <div class="list_container list_active" id="${key.substring(0, 5)}">
                    <div class="list_color"></div>
                    <p class="list_name">${key.substring(5)}</p>
                </div>`;
            } else {
                listContainer.innerHTML += `
                <div class="list_container" id="${key.substring(0, 5)}">
                    <p class="list_name">${key.substring(5)}</p>
                </div>`;
            }
        }
    }

    updateTodoTaskSection();
    
    loadTasks();

    document.getElementById("add_task_btn").onclick = createTodo;
}

function eventListContainer() {
    for (let i = 0; i < listsContainer.length; i++) {
        const list = listsContainer[i];
    
        list.onclick = () => {
            localStorage.setItem("list-selected", listsContainer[i].getAttribute("id") + listName[i].innerText);
            updateActiveTodo();
        }
    }
}

eventListContainer();