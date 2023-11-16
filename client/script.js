//Button event handlers
document.getElementById("all-submit").addEventListener("click", getAll);
document.getElementById("field-submit").addEventListener("click", getFields);
document.getElementById("new-list-submit").addEventListener("click", createInfoList);
document.getElementById("update-list-submit").addEventListener("click", updateList);
document.getElementById("delete-list-submit").addEventListener("click", deleteList);
document.getElementById("display-list-submit").addEventListener("click", displayList);

//Get info DOM elements
const all_search_field = document.getElementById("all-search");
const field_search_field = document.getElementById("field-search");
const all_radio_container = document.getElementById("all-radio-container");
const field_radio_container = document.getElementById("field-radio-container");
const all_publishers = document.getElementById("publishers");
const update_name = document.getElementById("update-list-name");

//Keeps track of selected IDs for creating list
var new_selectedIds = [];
var update_selectedIds = [];

//JSON's and arrays used for list creation
var newList = {};
var updatedList = {};
const powers = {};
const heroes = {};
const heroArray = [];
const powerArray = [];

//List DOM elements
const new_multiselect = document.getElementById("new-multiselect");
const update_multiselect = document.getElementById("update-multiselect");

//Loads ID options for new list creation
document.addEventListener("DOMContentLoaded", function() {
    fetch("api/info/")
        .then(res => res.json()
        .then(data => {
            data.forEach(e => {
                const item = document.createElement("option");
                item.textContent = e["id"];
                item.setAttribute("value", e["id"]);
                new_multiselect.appendChild(item);
                
        }) 
    }));
});

//Loads ID options for updating lists
document.addEventListener("DOMContentLoaded", function() {
    fetch("api/info/")
        .then(res => res.json()
        .then(data => {
            data.forEach(e => {
                const item = document.createElement("option");
                item.textContent = e["id"];
                item.setAttribute("value", e["id"]);
                update_multiselect.appendChild(item);
                
        }) 
    }));
});

//"Search All" input sanitization
all_radio_container.addEventListener("change", function () {
    all_search_field.value = "";
    if(all_publishers.checked){
        all_search_field.disabled=true;
    }else{
        all_search_field.disabled=false;
    }
});
all_search_field.addEventListener('input', function() {
    all_search_field.maxLength = "3";
    this.value = this.value.replace(/[^0-9]/g, "");
});

//Radio button gets cleared when new one clicked
field_radio_container.addEventListener("change", function () {
    field_search_field.value = "";
});

//Input sanitization for the remainder of the search boxes
const searchBoxes = document.querySelectorAll(".search-box");
function maxLengthHandler(event) {
    event.target.maxLength = "20";
}
searchBoxes.forEach(box => {
    box.addEventListener("input", maxLengthHandler);
})

//Returning "Search All" info
function getAll() {
    var all_choice = document.querySelector('#all-radio-container input[type="radio"]:checked').value;
    var all_search_sanitized = DOMPurify.sanitize(all_search_field.value);
    if(all_choice === "all-info"){
        fetch("api/info/" + all_search_sanitized)
        .then(res => {
            if(res.ok){
                res.json()
                .then(data => {
                    console.log(data);
                    const results = document.getElementById("all-search-results");
                    results.replaceChildren();
                    const item = document.createElement("p");
                    var info_string = `Name: ${data.name}<br>Gender: ${data.Gender}<br>Eye Colour: ${data["Eye color"]}<br>Race: ${data.Race}<br>Hair Colour: ${data["Hair color"]}<br>Height: ${data.Height}<br>Publisher: ${data.Publisher}<br>Skin Colour: ${data["Skin color"]}<br>Alignment: ${data.Alignment}<br>Weight: ${data.Weight}`;
                    item.innerHTML = info_string;
                    results.appendChild(item);
                })
            }
            else{
                console.log("Error: ", res.status);
                alert("Hero ID does not exists!");
            }
    })}
    if(all_choice === "all-powers"){
        fetch("api/powers/" + all_search_sanitized)
        .then(res => {
            if(res.ok){
                res.json()
                .then(data => {
                console.log(data);
                let power_string = ""
                for(let p in data){
                    if(data[p] === "True"){
                        power_string += `${p}<br>`
                    }
                }
                const results = document.getElementById("all-search-results");
                results.replaceChildren();
                const item = document.createElement("p");
                item.innerHTML = power_string;
                results.appendChild(item);
            })
        }
        else{
            console.log("Error: ", res.status);
            alert("Hero ID does not exists!");
        }
    })}
    if(all_choice === "all-publishers"){
        fetch("api/publishers")
        .then(res => res.json()
        .then(data => {
            console.log(data);
            let publisher_string = ""
            for(let p in data){
                publisher_string += ` ${data[p]}<br>`;  
            }
            const results = document.getElementById("all-search-results");
            results.replaceChildren();
            const item = document.createElement("p");
            item.innerHTML = publisher_string;
            results.appendChild(item);
        })
    )}
}

//Returning "Fields" info
function getFields(){
    var field_choice = document.querySelector('#field-radio-container input[type="radio"]:checked').value;
    var field_search_sanitized = DOMPurify.sanitize(field_search_field.value);
    const sort = document.getElementById("sort-box"); 
    var num_select = parseInt(document.getElementById("results-num").value);
    if(field_choice === "powers"){
        fetch("api/powers/field/" + field_search_sanitized)
        .then(res => res.json()
        .then(data => {
            const results = document.getElementById("field-search-results");
            results.replaceChildren();
            var counter = 0;
            if(sort.checked){ 
                data.sort((a,b) => {
                    const valueA = a["power"].toLowerCase(); 
                    const valueB = b["power"].toLowerCase();
                    return valueA.localeCompare(valueB);
                });
            }
            data.forEach(e => {
                if(counter === num_select) {return;};
                const item = document.createElement("li");
                item.innerHTML = `${e["id"]} (${e["power"]})`;
                results.appendChild(item);
                counter ++;
            })
        })
    )}
    else{
        fetch("api/info/")
        .then(res => res.json()
        .then(data => {
            const results = document.getElementById("field-search-results");
            results.replaceChildren();
            var counter = 0;
            if(sort.checked){
                data.sort((a,b) => {
                    const valueA = a[field_choice].toLowerCase(); 
                    const valueB = b[field_choice].toLowerCase();
                    return valueA.localeCompare(valueB);
                });
            }
            data.forEach(e => {
                    if(counter === num_select) {return;};
                    if((e[field_choice].toLowerCase()).includes((field_search_sanitized).toLowerCase())){
                        const item = document.createElement("li");
                        item.appendChild(document.createTextNode(`${e["id"]} (${e[field_choice]})`));
                        results.appendChild(item);
                        counter ++;
                }
            })
        })
    )}
}

//Controls "Add List" multiselect
new_multiselect.addEventListener("change", function() {
    new_selectedIds = Array.from(new_multiselect.selectedOptions).map(option => option.value);
});

//Controls "Update List" multiselect
update_multiselect.addEventListener("change", function() {
    update_selectedIds = Array.from(update_multiselect.selectedOptions).map(option => option.value);
    update_selectedIds.sort();
});

//Accesses info data for list creation
function createInfoList() {
    new_selectedIds.sort();
    console.log(new_selectedIds);
    const fetchPromises = [];
    if(new_selectedIds.length > 0) {
        for(let i =0; i<new_selectedIds.length; i++) {
            const promise = fetch("api/info/" + new_selectedIds[i])
            .then(res => res.json())
            .then(info => {
                heroArray.push(info);
            });
            fetchPromises.push(promise);
        }
        Promise.all(fetchPromises)
        .then(() => {
            createPowerList();
        })
    }
}

//Accesses power data for list creation
function createPowerList(){
    const fetchPromises = [];
    for(let i =0; i<new_selectedIds.length; i++) {
        let cleaned_powers = {};
        const promise = fetch("api/powers/" + new_selectedIds[i])
        .then(res => res.json()
        .then(pows => {
        cleaned_powers["id"] = new_selectedIds[i];
        for(let p in pows){
            if(pows[p] === "True"){
                cleaned_powers[p] = "True";
            }
        }
        powerArray.push(cleaned_powers);
        })
        .catch(err => powers[new_selectedIds[i]] = "No powers found!")
        )
        fetchPromises.push(promise);
    }
    Promise.all(fetchPromises)
    .then(() => {
        createFullList();
    })
}

//Sends list to server via POST request
function createFullList(){
    var name_unsanitized = document.getElementById("new-list-name");
    var name = DOMPurify.sanitize(name_unsanitized.value);
    if(name.length > 0){
        newList = {
            list_name: name,
            info: heroArray,
            powers: powerArray
        }
        console.log(newList);
        fetch('api/lists/' + name, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newList)
        })
        .then(res => {
            if(res.ok) {
                res.json()
                .then(data => {
                    alert(`Created list ${data["list_name"]}!`)
                })
                .catch(err => console.log("Failed to get json object"))
            }
            else{
                console.log("Error: ", res.status);
                alert("List name already exists!");
            }
        })
        .catch()
        heroArray.length = 0;
        powerArray.length = 0;
        newList = {};
    }
    else{
        alert("You must enter a name!");
    }
    name_unsanitized.value = "";
}

//Checks if the list name exists
function updateList() {
    update_name_sanitized = DOMPurify.sanitize(update_name.value);
    fetch('api/lists/' + update_name_sanitized)
    .then(res => {
        if(res.ok) {
            updateInfoList();
        }
        else{
            console.log("Error: " + res.status);
            alert("This list name does not exist!");
            update_name_sanitized = "";
        }
    })
}

//Accesses info data for list update
function updateInfoList() {
    update_selectedIds.sort();
    console.log(update_selectedIds);
    const fetchPromises = [];
    for(let i =0; i<update_selectedIds.length; i++) {
        const promise = fetch("api/info/" + update_selectedIds[i])
        .then(res => res.json())
        .then(info => {
            heroArray.push(info);
        });
        fetchPromises.push(promise);
    }
    Promise.all(fetchPromises)
    .then(() => {
        console.log(heroArray);
        updatePowerList();
    })
}

//Accesses power data for list update
function updatePowerList(){
    const fetchPromises = [];
    for(let i =0; i<update_selectedIds.length; i++) {
        let cleaned_powers = {};
        const promise = fetch("api/powers/" + update_selectedIds[i])
        .then(res => res.json()
        .then(pows => {
        cleaned_powers["id"] = update_selectedIds[i];
        for(let p in pows){
            if(pows[p] === "True"){
                cleaned_powers[p] = "True";
            }
        }
        powerArray.push(cleaned_powers);
        })
        .catch(err => powers[update_selectedIds[i]] = "No powers found!")
        )
        fetchPromises.push(promise);
    }
    Promise.all(fetchPromises)
    .then(() => {
        console.log(powerArray);
        updateFullList();
    })
}

//Sends updated list to server via POST request
function updateFullList(){
        updatedList = {
            list_name: update_name_sanitized,
            info: heroArray,
            powers: powerArray
        }
        console.log(updatedList);
        fetch('api/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedList)
        })
        .then(res => {
            if(res.ok) {
                res.json()
                .then(data => {
                    alert(`Updated list ${data["list_name"]}!`)
                })
                .catch(err => console.log("Failed to get json object"))
            }
            else{
                console.log("Error: ", res.status);
                alert("Couldn't update list!");
            }
        })
        .catch(err => {
            console.error("Error: ", err);
        })
        heroArray.length = 0;
        powerArray.length = 0;
        updatedList = {};
    
    update_name.value = "";
}

//Deletes list as requested by user
function deleteList(){
    const delete_name = document.getElementById("delete-list-name");
    const delete_name_sanitized = DOMPurify.sanitize(delete_name.value);
    fetch('api/lists/' + delete_name_sanitized, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
        if(res.ok) {
            res.json()
            .then(data => {
                alert(`Deleted list ${data["list_name"]}!`)
            })
            .catch(err => console.log("Failed to get json object"))
        }
        else{
            console.log("Error: ", res.status);
            alert("List name doesn't exists!");
        }
    })
    delete_name.value="";
}

//Displays the list requested by the user
function displayList() {
    var display_name = document.getElementById("display-list-name");
    var display_name_sanitized = DOMPurify.sanitize(display_name.value);
    const list_display = document.getElementById("list-list");
    const header = document.getElementById("list-name-header");
    header.textContent = "";
    var hero_description = "";
    list_display.replaceChildren();
    fetch('api/lists/' + display_name_sanitized)
    .then(res => {
        if(res.ok) {
            res.json()
            .then(data => {
                header.textContent = data["list_name"];
                const sorted = sortList(data);
                for(let i = 0; i<data.info.length; i++){
                    const item = document.createElement("li");
                    hero_description = `<span class = "white-text"><strong>Info</strong></span><br>Name: ${sorted.info[i].name}<br>Gender: ${sorted.info[i].Gender}<br>Eye Colour: ${sorted.info[i]["Eye color"]}<br>
                    Race: ${sorted.info[i]["Race"]}<br>Hair Colour: ${sorted.info[i]["Hair color"]}<br>Height: ${sorted.info[i]["Height"]}<br>
                    Publisher: ${sorted.info[i]["Publisher"]}<br>Skin Colour: ${sorted.info[i]["Skin color"]}<br>Alignment: ${sorted.info[i]["Alignment"]}<br>
                    Weight: ${sorted.info[i]["Weight"]}<br>
                    <span class = "white-text"><strong>Powers</strong></span>`;
                    for(var p in sorted.powers[i]){
                        if(!(p === "id")){
                            hero_description += `<br>${p}`;
                        }   
                    }
                    item.innerHTML = hero_description;
                    list_display.appendChild(item);
                }
            })
        }
        else{
            console.log("Error: " + res.status);
            alert("This list name does not exist!");
        }
    })
    display_name.value = "";
}

//Sorts the list by field selected by user
function sortList(list) {
    var sort_choice = document.querySelector('#sort-radio-container input[type="radio"]:checked').value;
    if(sort_choice === "sort-id"){
        const listInfo = list.info;
        listInfo.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        list.info = listInfo;
        
        const listPowers = list.powers;
        list.powers = listInfo.map(infoItem => {
            const matchingPowerItem = listPowers.find(powerItem => parseInt(powerItem.id) === infoItem.id);
            return matchingPowerItem;
        });

        return list;
    }
    if(sort_choice === "sort-name"){
        const listInfo = list.info;
        listInfo.sort((a,b) => {
            const valueA = a["name"].toLowerCase(); 
            const valueB = b["name"].toLowerCase();
            return valueA.localeCompare(valueB);
        });
        list.info = listInfo;

        const listPowers = list.powers;
        list.powers = listInfo.map(infoItem => {
            const matchingPowerItem = listPowers.find(powerItem => parseInt(powerItem.id) === infoItem.id);
            return matchingPowerItem;
        });

        return list;
    }
    if(sort_choice === "sort-race"){
        const listInfo = list.info;
        listInfo.sort((a,b) => {
            const valueA = a["Race"].toLowerCase(); 
            const valueB = b["Race"].toLowerCase();
            return valueA.localeCompare(valueB);
        });
        list.info = listInfo;

        const listPowers = list.powers;
        list.powers = listInfo.map(infoItem => {
            const matchingPowerItem = listPowers.find(powerItem => parseInt(powerItem.id) === infoItem.id);
            return matchingPowerItem;
        });

        return list;
    }
    if(sort_choice === "sort-publisher"){
        const listInfo = list.info;
        listInfo.sort((a,b) => {
            const valueA = a["Publisher"].toLowerCase(); 
            const valueB = b["Publisher"].toLowerCase();
            return valueA.localeCompare(valueB);
        });
        list.info = listInfo;

        const listPowers = list.powers;
        list.powers = listInfo.map(infoItem => {
            const matchingPowerItem = listPowers.find(powerItem => parseInt(powerItem.id) === infoItem.id);
            return matchingPowerItem;
        });

        return list;
    }
    if(sort_choice === "sort-power"){
        const listPowers = list.powers;
        function sortSize(a, b) {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            return keysB.length - keysA.length;
        }
        listPowers.sort(sortSize);
        
        const listInfo = list.info;
        list.info = listPowers.map(powerItem => {
            const matchingInfoItem = listInfo.find(infoItem => parseInt(powerItem.id) === infoItem.id);
            return matchingInfoItem;
        });

        return list;
    }
}
