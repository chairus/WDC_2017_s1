$(document).ready(function() {
    // page is now ready, initialize the calendar...
    $('#calendar').fullCalendar({
        eventMouseover: function(event, jsEvent, view) {
            displayEventTooltip(event, jsEvent, view);
        },
        
//        eventMouseover: function(event, jsEvent, view) {
//            $('.fc-event-container', this).prevObject.append('<div id=\"event1\" class=\"hover-end\">'+$.fullCalendar.formatDate(event.end, 'h:mmt')+'</div>');
//            console.log($.fullCalendar.formatDate(event.start, 'h:mmt'))
//        },
//
//        eventMouseout: function(event, jsEvent, view) {
//            $('#event1').remove();
//        },
        
        
        eventClick: function(event, jsEvent, view) {
            changeToEntryPage();
            // Set title of the entry to the title of the event
            document.getElementById("entry-title").value = event.title;
            // Simulate click input for add entry so that the event listener for the save entry button will be added
            buttonAddEntry.click();
        }
    });
});

var entryCount = 0;     // Keeps track of the next entry number
var activeIdEntryWrapper = null;    // Contains the ID of the saved journal entry curently being viewed/edited
var buttonDeleteEntry = document.querySelector(".btn-delete-entry");
var buttonAddEntry = document.querySelector(".btn-add-entry");
var buttonSaveEntry = document.querySelector(".btn-save-entry");
var buttonSettings = document.querySelector(".btn-settings");
var buttonApply = document.querySelector(".btn-apply");
var buttonCancel = document.querySelector(".btn-cancel");
var buttonOK = document.querySelector(".btn-ok-delete");
var buttonCancelDelete = document.querySelector(".btn-cancel-delete");
var buttonAddTag = document.querySelector(".btn-add-tag");
var buttonDeleteTag = document.querySelector(".btn-delete-tag");
var buttonSaveTag = document.querySelector(".btn-save-tag");
var buttonCancelTag = document.querySelector(".btn-cancel-tag");
var buttonLink = document.getElementById("btn-link");
var buttonSignOut = document.querySelector(".btn-sign-out");
var maxResults = 100;    // Holds the number of calendar events to be fetched
var events = [];    // An object with an array property that holds the events in the Google Calendar


/* =============================== 
    Google Calendar API functions 
   =============================== */

// Client ID and API key from the Developer Console
var CLIENT_ID = '244625899194-4ue11aentbj66bifpirfqs9satdv6gj9.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = buttonLink;
var signoutButton = buttonSignOut;

/**
*  On load, called to load the "auth2" library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
//      authorizeButton.style.display = 'none';
        authorizeButton.disabled = true;
        authorizeButton.innerHTML = "linked";
//      signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
//      authorizeButton.style.display = 'block';
        authorizeButton.disabled = false;
        authorizeButton.innerHTML = "link";
//      signoutButton.style.display = 'none';
    }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
    console.log(message);
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': maxResults,
      'orderBy': 'startTime'
    }).then(function(response) {
        addEventToCalendar(response);
    });
}


/* Retrieve events from Google Calendar and display it on the calendar. */

function addEventToCalendar(response) {
    var eventsGC = response.result.items;
//    appendPre('Upcoming events:');

    if (eventsGC.length > 0) {
        for (i = 0; i < eventsGC.length; i++) {
            events.push({});
            var event = eventsGC[i];
            events[i].title = event.summary;    // Add title of the event
            events[i].start = event.start.dateTime; // Add start date
            events[i].end = event.end.dateTime; // Add end date
            events[i].allDay = false;   // Will display the time
            console.log(event);
            var when = event.start.dateTime;
            if (!when) {
                when = event.start.date;
            }
//            appendPre(event.summary + ' (' + when + ')')
        }
    } else {
        appendPre('No upcoming events found.');
    }
//    console.log(events);
    $("#calendar").fullCalendar("addEventSource", events);  // Display Google Calendar events on the calendar
}


/* ======================================================================= */

function displayEventTooltip(event, jsEvent, view) {
    var time = event.start._i;
    var formattedTime;
    var formattedEventTime;
    var pos = time.indexOf('T');
    var hours = Number(time.slice(pos+1,pos+3));
    var minutes = time.slice(pos+4,pos+6);
    var tooltip = jsEvent.target.title;
    // Handles the problem when the "div" or "span" element is triggered instead of the "a" element
    var obj = jsEvent.target;
    if (obj.tagName.toLowerCase() == "div") {
        obj = obj.parentElement;
    } else if (obj.tagName.toLowerCase() == "span") {
        obj = obj.parentElement.parentElement;
    }
    var objChildren = obj.childNodes;
    var hasTooltip = false;
    
    for (var i = 0;i < objChildren.length;i++) {
        if (objChildren[i.toString()].tagName.toLowerCase() == "span") {
            var classes = objChildren[i.toString()].classList;
            for (var j = 0;j < classes.length;j++) {
                if (classes[j] == "tooltiptext") {
                    hasTooltip = true;
                    break;
                }
            }
        }
        if (hasTooltip) break;
    }
    
    if (!hasTooltip) {
        var text = document.createElement("span");
        text.setAttribute("class", "tooltiptext");
        formattedTime = $.fullCalendar.formatDate(event.start, 'h:mmt');    // fomrat time to 12-hour clock
        formattedEventTime = event.title + " on " + event.start._d.toDateString() + " at " + formattedTime;
        var content = document.createTextNode(formattedEventTime);
        text.appendChild(content);
        obj.appendChild(text);
    }
}


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
    document.querySelector(".container").style.display = "none";
}

function changeToEntryPage() {
    // Hide the headers, buttons and search input of the journal entry page
    document.getElementById("journal-entries").style.display = "none";
    document.getElementById("journal-entries-header").style.display = "none";
    document.getElementById("search-entry").style.display = "none";
    document.querySelector(".btn-add-entry").style.display = "none";
    
    // Display the headers and buttons of edit entry page
    document.querySelector(".container").style.display = "block";
    document.getElementById("edit-entry-header").style.display = "block";
    document.getElementById("edit-entry").style.display = "block";
    document.querySelector(".save-and-del-btn").style.display = "block";
}

// Event handler for "Add entry" button
buttonAddEntry.addEventListener("click", function() {
    changeToEntryPage();
    
    activeIdEntryWrapper = null;
    
    buttonSaveEntry.removeEventListener("click", replaceEntry);
    buttonSaveEntry.addEventListener("click", postEntry);
});

// Event handler for "Delete entry" button
buttonDeleteEntry.addEventListener("click", function() {
    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;
    
    if (title !== "" || content !== "") {
        document.getElementById("confirm-delete").classList.toggle("show");
        document.querySelector(".modal").style.display = "block";
    } else {
        changeToHomepage();
    }
});

// Event handlers for confirming the deletion of an entry
buttonOK.addEventListener("click", function() {
    document.getElementById("confirm-delete").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
    removeEntry();
});

buttonCancelDelete.addEventListener("click", function() {
    document.getElementById("confirm-delete").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
});

// Event handler for adding a tag
buttonAddTag.addEventListener("click", function() {
    document.getElementById("add-tag-entry").classList.toggle("show");
    document.querySelector(".modal").style.display = "block";
});

// Event handler for saving a tag
buttonSaveTag.addEventListener("click", function() {
    tagSectionChildren = document.getElementById("tags").childNodes;
    var create = true;
    var tagTitle = document.getElementById("tag-title").value;
    for (var i = 0; i < tagSectionChildren.length; i++) {
        if (tagSectionChildren[i].lastElementChild.innerHTML == tagTitle) {
            create = false;
            document.getElementById("tag-title").value = "";
            break;
        }
    }
    
    if (tagTitle != "" && create) {
        createTag();
    }
    
    document.getElementById("add-tag-entry").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
});

buttonCancelTag.addEventListener("click", function() {
    document.getElementById("tag-title").value = "";
    document.getElementById("add-tag-entry").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
});

// Event handler for deleting a tag
buttonDeleteTag.addEventListener("click", function() {
    var parent = document.getElementById("tags");
    var children = parent.childNodes;
    var child;
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.firstChild.checked) {
            parent.removeChild(child);
            i--;
        }
    }
});

// Event handler for signing out
buttonSignOut.addEventListener("click", function() {
    location.href = "welcome.html";
});


function createTag() {
    var tagSection = document.getElementById("tags");
    var tagTitle = document.getElementById("tag-title").value;
    var tagLi = document.createElement("li");
    tagLi.id = tagTitle;
    var tagCheckbox = document.createElement("input");
    tagCheckbox.type = "checkbox";
    var tagLabel = document.createElement("label");
    var tagTitleText = document.createTextNode(tagTitle);
    tagLabel.appendChild(tagTitleText);
    tagLi.appendChild(tagCheckbox);
    tagLi.appendChild(tagLabel);
    tagSection.appendChild(tagLi);
    document.getElementById("tag-title").value = "";
}

function removeEntry() {
    if (activeIdEntryWrapper !== null) {
        var parent = document.getElementById("journal-entries");
        var child = document.getElementById(activeIdEntryWrapper);
        parent.removeChild(child);
        activeIdEntryWrapper == null;
    }
    changeToHomepage();
}

function postEntry() {
    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;
    var date = new Date();
    
    // Append/Add the new journal entry onto the journal entries
    if (title !== "" || content !== "") {
        // Create a "p" HTML element
        var par = document.createElement("p");
        par.setAttribute("id","entry-wrapper-" + entryCount);
        par.setAttribute("class",entryCount);
        
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
        dateEl.setAttribute("class",entryCount);
        dateEl.style.margin = "0px";
        dateEl.style.padding = "0px";
        dateEl.style.color = "rgb(0,100,255)";
        var fullDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + "-" + " " + date.getHours() + ":";
        var min = date.getMinutes();
        if (min > 9) {
            fullDate = fullDate + min;
        } else {
            fullDate = fullDate + "0" + min;
        }
        var dateNode = document.createTextNode(fullDate);
        dateEl.appendChild(dateNode);
        var titleEl = document.createElement("p");
        titleEl.setAttribute("id","title-entry-" + entryCount);
        titleEl.setAttribute("class",entryCount);
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
        contentEl.setAttribute("class",entryCount);
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
    
    changeToHomepage();
}


function editEntry(id) {
    activeIdEntryWrapper = id;
    
    changeToEntryPage();
    
    // Change Event Listener of the save button
    document.querySelector(".btn-save-entry").removeEventListener("click", postEntry);
    document.querySelector(".btn-save-entry").addEventListener("click", replaceEntry);
    
    // Obtain the child elements of the paragraph(p) HTML element
    var childElements = document.getElementById(id).getElementsByTagName("p");
    
    document.getElementById("entry-title").value = childElements[1].innerHTML;
    document.getElementById("entry-content").value = childElements[2].innerHTML;
}


function replaceEntry() {

    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;
    
    // Obtain the entry count number so that we can determine which entry to remove
    var idEntryCount = document.getElementById(activeIdEntryWrapper).getAttribute("class");
    
    var parent = document.getElementById(activeIdEntryWrapper);
    var childTitle = document.getElementById("title-entry-"+idEntryCount);
    var childContent = document.getElementById("content-entry-"+idEntryCount);
    
    var titleEl = document.createElement("p");
    titleEl.setAttribute("id","title-entry-" + idEntryCount);
    titleEl.setAttribute("class",idEntryCount);
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
    contentEl.setAttribute("class",idEntryCount);
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

//Event handler for "Setting" button
buttonSettings.addEventListener("click",function(){
    document.getElementById("settPopup").classList.toggle("show");
    document.getElementById("settModal").style.display = "block";
})

//Event handler for "Apply" button
buttonApply.addEventListener("click",function(){
    var a = document.getElementById("color-options");
    var usr = a.options[a.selectedIndex].value;
    if(usr == "Red")
    {
      document.getElementById("indexbody").style.backgroundColor = "Crimson";
      document.getElementById("calendar-header").style.backgroundColor = "darkred"
      document.getElementById("journal-entries-header").style.backgroundColor = "darkred"
      document.getElementById("tag-header").style.backgroundColor = "darkred";
      document.getElementById("edit-entry-header").style.backgroundColor = "darkred";
      document.getElementById("settPopup").style.backgroundColor = "darkred";

    }
    else if(usr == "Blue")
    {
      document.getElementById("indexbody").style.backgroundColor = "dodgerblue";
      document.getElementById("calendar-header").style.backgroundColor = "darkblue"
      document.getElementById("journal-entries-header").style.backgroundColor = "darkblue"
      document.getElementById("tag-header").style.backgroundColor = "darkblue";
      document.getElementById("edit-entry-header").style.backgroundColor = "darkblue";
      document.getElementById("settPopup").style.backgroundColor = "darkblue";    
    }

document.getElementById("settModal").style.display = "none";
document.getElementById("settPopup").classList.toggle("show");    

})

//Event handler for "Cancel" button
buttonCancel.addEventListener("click",function(){
  	document.getElementById("settPopup").classList.toggle("show");
  	document.getElementById("settModal").style.display = "none";
})
