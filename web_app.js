// Event handler for "Add entry" button
document.querySelector(".btn-add-entry").addEventListener("click",function() {
    // Hide the headers, buttons and search input of the journal entry page
    document.getElementById("journal-entries").style.display = "none";
    document.getElementById("journal-entries-header").style.display = "none";
    document.getElementById("search-entry").style.display = "none";
    document.querySelector(".btn-add-entry").style.display = "none";
    
    // Display the headers and buttons of edit entry page
    document.getElementById("edit-entry-header").style.display = "block";
    document.getElementById("edit-entry").style.display = "block";
    document.querySelector(".save-and-del-btn").style.display = "block";
});

// Event handler for "Save" button
document.querySelector(".btn-save-entry").addEventListener("click", function() {
    // Display the headers, buttons and search inout of the journal entry page
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
})