let places = JSON.parse(localStorage.getItem("places")) || [];
let sortAsc = true;
let editIndex = null;

function saveData() {
    localStorage.setItem("places", JSON.stringify(places));
}

function addPlace() {
    const placeInput = document.getElementById("placeInput");
    const status = document.getElementById("status");

    if (placeInput.value.trim() === "") return;

    places.push({
        name: placeInput.value.trim(),
        status: status.value
    });

    placeInput.value = "";
    saveData();
    renderTables();
}

function toggleSort() {
    sortAsc = !sortAsc;
    places.sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    renderTables();
}

function renderTables() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const toVisitTable = document.getElementById("toVisitTable");
    const visitedTable = document.getElementById("visitedTable");

    toVisitTable.innerHTML = "";
    visitedTable.innerHTML = "";

    places.forEach((place, index) => {
        
        if (!place.name.toLowerCase().startsWith(search)) return;

        const row = document.createElement("tr");

        if (place.status === "toVisit") {
            row.innerHTML = `
                <td>${place.name}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="openEdit(${index})">Edit</button>
                    <button class="btn btn-sm btn-success" onclick="moveToVisited(${index})">Visited</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePlace(${index})">Delete</button>
                </td>
            `;
            toVisitTable.appendChild(row);
        } else {
            row.innerHTML = `
                <td>${place.name}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="openEdit(${index})">Edit</button>
                    <button class="btn btn-sm btn-secondary" onclick="moveToToVisit(${index})">Move Back</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePlace(${index})">Delete</button>
                </td>
            `;
            visitedTable.appendChild(row);
        }
    });
}

function openEdit(index) {
    editIndex = index;
    document.getElementById("editInput").value = places[index].name;
    new bootstrap.Modal(document.getElementById("editModal")).show();
}

function saveEdit() {
    const value = document.getElementById("editInput").value.trim();
    if (value) {
        places[editIndex].name = value;
        saveData();
        renderTables();
    }
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
}

function moveToVisited(index) {
    places[index].status = "visited";
    saveData();
    renderTables();
}

function moveToToVisit(index) {
    places[index].status = "toVisit";
    saveData();
    renderTables();
}

function deletePlace(index) {
    if (confirm("Delete this place?")) {
        places.splice(index, 1);
        saveData();
        renderTables();
    }
}


renderTables();
