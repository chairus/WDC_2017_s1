var entryCount = 0;
var idEntryWrapper;

function changeToHomepage() {
    // Display the headers, buttons and search input of the journal entry page
    document.getElementById("journal-entries").style.display = "block";
    document.getElementById("journal-entries-header").style.display = "block";
    document.getElementById("search-entry").style.display = "block";
    document.querySelector(".btn-add-entry").style.display = "block";
    
    // Hide the headers and buttons of edit entry page
    document.getElementById("entry-title").value = "";
    document.getElementById("entry-content").value = "";
    document.getElementById("edit-entry-header").style.display = "none";
    document.querySelector(".save-and-del-btn").style.display = "none";
    document.getElementById("edit-entry").style.display = "none";
}

function changeToEntryPage() {
    // Hide the headers, buttons and search input of the journal entry page
    document.getElementById("journal-entries").style.display = "none";
    document.getElementById("journal-entries-header").style.display = "none";
    document.getElementById("search-entry").style.display = "none";
    document.querySelector(".btn-add-entry").style.display = "none";
    
    // Display the headers and buttons of edit entry page
    document.getElementById("edit-entry-header").style.display = "block";
    document.getElementById("edit-entry").style.display = "block";
    document.querySelector(".save-and-del-btn").style.display = "block";
}

// Event handler for "Add entry" button
document.querySelector(".btn-add-entry").addEventListener("click", function() {
    changeToEntryPage();
    
    document.querySelector(".btn-save-entry").removeEventListener("click", replaceEntryCaller);
    document.querySelector(".btn-save-entry").addEventListener("click", postEntry);
});


function postEntry() {
    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;
    var date = new Date();
    
    changeToHomepage();
    
    // Append/Add the new journal entry onto the journal entries
    if (title !== "" || content !== "") {
        // Create a "p" HTML element
        var par = document.createElement("p");
        par.setAttribute("id","entry-wrapper-" + entryCount);
        par.addEventListener("click",function() {
            editEntry(this.id);
        });
        par.style.border = "2px solid black";
        par.style.fontFamily = "Raleway";
        par.style.height = "85px";
        par.style.overflowX = "hidden";
        par.style.overflowY = "hidden";
        par.style.margin = "0px 10px";
        par.style.backgroundColor = "LightGrey";
        var dateEl = document.createElement("p");
        dateEl.setAttribute("id","date-entry-" + entryCount);
        dateEl.style.margin = "0px";
        dateEl.style.padding = "0px";
        dateEl.style.color = "rgb(0,100,255)";
        var fullDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + "-" + " " + date.getHours() + ":" + date.getMinutes();
        var dateNode = document.createTextNode(fullDate);
        dateEl.appendChild(dateNode);
        var titleEl = document.createElement("p");
        titleEl.setAttribute("id","title-entry-" + entryCount);
        titleEl.style.fontWeight = "700";
        titleEl.style.fontSize = "23px";
        titleEl.style.margin = "10px 0";
        if (title === "") {
            title = "[No title]";
        }
        var titleNode = document.createTextNode(title);
        titleEl.appendChild(titleNode);
        var contentEl = document.createElement("p");
        contentEl.setAttribute("id","content-entry-" + entryCount);
        contentEl.style.margin = "0px";
        contentEl.style.padding = "0px";
        if (content === "") {
            content = "[No Content]";
        }
        var contentNode = document.createTextNode(content);
        contentEl.appendChild(contentNode);
        par.appendChild(dateEl);
        par.appendChild(titleEl);
        par.appendChild(contentEl);
        var element = document.getElementById("journal-entries");
        element.appendChild(par);
        entryCount++;
    }
}


function editEntry(id) {
    idEntryWrapper = id;
    
    changeToEntryPage();
    
    // Change Event Listener of the save button
    document.querySelector(".btn-save-entry").removeEventListener("click", postEntry);
    document.querySelector(".btn-save-entry").addEventListener("click", replaceEntryCaller);
    
    // Obtain the child elements of the paragraph(p) HTML element
    var childElements = document.getElementById(id).getElementsByTagName("p");
    
    document.getElementById("entry-title").value = childElements[1].innerHTML;
    document.getElementById("entry-content").value = childElements[2].innerHTML;
}


function replaceEntryCaller() {
    replaceEntry(idEntryWrapper);
}

function replaceEntry(id) {

    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;
    
    var idName = document.getElementById(id).getAttribute("id");
    var idEntryCount = idName.substr((idName.length-1),1);
    
    var parent = document.getElementById(id);
    var childTitle = document.getElementById("title-entry-"+idEntryCount);
    var childContent = document.getElementById("content-entry-"+idEntryCount);
    
    var titleEl = document.createElement("p");
    titleEl.setAttribute("id","title-entry-" + idEntryCount);
    titleEl.style.fontWeight = "700";
    titleEl.style.fontSize = "23px";
    titleEl.style.margin = "10px 0";
    if (title === "") {
        title = "[No title]";
    }
    var titleNode = document.createTextNode(title);
    titleEl.appendChild(titleNode);
    
    var contentEl = document.createElement("p");
    contentEl.setAttribute("id","content-entry-" + idEntryCount);
    contentEl.style.margin = "0px";
    contentEl.style.padding = "0px";
    if (content === "") {
        content = "[No Content]";
    }
    var contentNode = document.createTextNode(content);
    contentEl.appendChild(contentNode);
    
    parent.replaceChild(titleEl, childTitle);
    parent.replaceChild(contentEl, childContent);
    
    changeToHomepage();
}