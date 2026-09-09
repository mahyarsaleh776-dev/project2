const appName = "EventHorizon";

let events = [
  {
    title: "Team Standup",
    date: "2026-09-05",
    category: "work",
    location: "Zoom",
    attendance: null
  },

  {
    title: "Birthday Dinner",
    date: "2026-09-12",
    category: "social",
    location: "Downtown Grill",
    attendance: null
  },

  {
    title: "Dentist Appointment",
    date: "2026-08-20",
    category: "personal",
    location: "City Clinic",
    attendance: "attended"
  }
];

let currentStatusFilter = "all";
let currentCategoryFilter = "all";


let editingIndex = null;




function getCategoryClass(category) {

  if (category === "work") {
    return "category-work";

  } else if (category === "personal") {
    return "category-personal";

  } else if (category === "social") {
    return "category-social";

  } else {
    return "category-other";
  }
}




function getTimeStatus(dateString) {

  let today = new Date();

  today.setHours(0, 0, 0, 0);


  let eventDate = new Date(dateString);

  eventDate.setHours(0, 0, 0, 0);


  if (eventDate.getTime() === today.getTime()) {

    return "today";

  } else if (eventDate.getTime() > today.getTime()) {

    return "upcoming";

  } else {

    return "past";
  }
}





function getTimeStatusClass(status) {

  if (status === "today") {

    return "status-today";

  } else if (status === "upcoming") {

    return "status-upcoming";

  } else {

    return "status-past";
  }
}



function getTimeStatusLabel(status) {

  if (status === "today") {

    return "Today";

  } else if (status === "upcoming") {

    return "Upcoming";

  } else {

    return "Past";
  }
}



function calculateStats(eventsList) {

  let total = eventsList.length;

  let upcoming = 0;

  let attended = 0;


  for (let event of eventsList) {

    if (getTimeStatus(event.date) === "upcoming") {

      upcoming = upcoming + 1;
    }


    if (event.attendance === "attended") {

      attended = attended + 1;
    }
  }


  return {
    total: total,
    upcoming: upcoming,
    attended: attended
  };
}




function buildEventHTML(event) {

  let categoryClass =
    getCategoryClass(event.category);


  let timeStatus =
    getTimeStatus(event.date);


  let timeStatusClass =
    getTimeStatusClass(timeStatus);


  let timeStatusLabel =
    getTimeStatusLabel(timeStatus);




  let realIndex = events.indexOf(event);


  let attendanceHTML = "";


  if (event.attendance === "attended") {

    attendanceHTML =
      `<span class="attendance-tag attendance-attended">
        Attended
      </span>`;

  } else if (event.attendance === "cancelled") {

    attendanceHTML =
      `<span class="attendance-tag attendance-cancelled">
        Cancelled
      </span>`;
  }


  return `
    <div
      class="event-card ${timeStatusClass}"
      data-index="${realIndex}"
    >

      <div class="event-card-top">

        <h3>${event.title}</h3>

        <span class="category-tag ${categoryClass}">
          ${event.category}
        </span>

      </div>


      <p>${event.date} · ${timeStatusLabel}</p>

      <p>${event.location}</p>


      ${attendanceHTML}


      <div class="event-actions">

        <button
          class="attend-btn"
          data-index="${realIndex}"
        >
          Attend
        </button>


        <button
          class="cancel-btn"
          data-index="${realIndex}"
        >
          Cancel
        </button>


        <button
          class="edit-btn"
          data-index="${realIndex}"
        >
          Edit
        </button>


        <button
          class="delete-btn"
          data-index="${realIndex}"
        >
          Delete
        </button>

      </div>

    </div>
  `;
}



function renderEvents(eventsList) {

  let container =
    document.querySelector(".event-list");


  let html = "<h2>My Events</h2>";


  if (eventsList.length === 0) {

    html += `
      <p class="empty-state">
        No events found.
      </p>
    `;

  } else {

    for (
      let i = 0;
      i < eventsList.length;
      i = i + 1
    ) {

      html += buildEventHTML(eventsList[i]);
    }
  }


  container.innerHTML = html;


  attachEventButtonListeners();
}



function attachEventButtonListeners() {

  let attendButtons =
    document.querySelectorAll(".attend-btn");


  let cancelButtons =
    document.querySelectorAll(".cancel-btn");


  let editButtons =
    document.querySelectorAll(".edit-btn");


  let deleteButtons =
    document.querySelectorAll(".delete-btn");


  for (let button of attendButtons) {

    button.addEventListener("click", handleAttend);
  }


  for (let button of cancelButtons) {

    button.addEventListener("click", handleCancel);
  }


  for (let button of editButtons) {

    button.addEventListener("click", handleEdit);
  }


  for (let button of deleteButtons) {

    button.addEventListener("click", handleDelete);
  }
}



function handleAttend(event) {

  let index =
    Number(event.target.getAttribute("data-index"));


  events[index].attendance = "attended";


  refreshApp();
}



function handleCancel(event) {

  let index =
    Number(event.target.getAttribute("data-index"));


  events[index].attendance = "cancelled";


  refreshApp();
}



function handleDelete(event) {

  let index =
    Number(event.target.getAttribute("data-index"));


  events.splice(index, 1);


  refreshApp();
}



function handleEdit(event) {

  let index =
    Number(event.target.getAttribute("data-index"));


  
  editingIndex = index;


  let selectedEvent = events[index];



  let titleInput =
    document.getElementById("eventTitle");


  let dateInput =
    document.getElementById("eventDate");


  let categoryInput =
    document.getElementById("eventCategory");


  let locationInput =
    document.getElementById("eventLocation");


  

  titleInput.value = selectedEvent.title;

  dateInput.value = selectedEvent.date;

  categoryInput.value = selectedEvent.category;

  locationInput.value = selectedEvent.location;


  

  document.getElementById("formTitle").textContent =
    "Edit Event";


  
  document.getElementById("submitButton").textContent =
    "Update Event";


  showMessage(
    "You are editing this event.",
    "success"
  );



  document
    .querySelector(".form-section")
    .scrollIntoView({
      behavior: "smooth"
    });
}




function validateEvent(title, date, category, location) {

  let trimmedTitle = title.trim();

  let trimmedLocation = location.trim();


  if (trimmedTitle === "") {

    return "Event title cannot be empty.";
  }


  if (trimmedTitle.length < 3) {

    return "Event title must be at least 3 characters.";
  }


  if (date === "") {

    return "Please choose a date.";
  }


  

  let today = new Date();

  today.setHours(0, 0, 0, 0);


  let selectedDate = new Date(date);

  selectedDate.setHours(0, 0, 0, 0);


  if (
    editingIndex === null &&
    selectedDate.getTime() < today.getTime()
  ) {

    return "Event date cannot be in the past.";
  }


  if (
    category !== "work" &&
    category !== "personal" &&
    category !== "social" &&
    category !== "other"
  ) {

    return "Please choose a valid category.";
  }


  if (trimmedLocation === "") {

    return "Location cannot be empty.";
  }


  return "";
}



function addEvent(title, date, category, location) {

  let newEvent = {

    title: title,

    date: date,

    category: category,

    location: location,

    attendance: null
  };


  events.push(newEvent);
}



function showMessage(text, type) {

  let messageElement =
    document.getElementById("formMessage");


  messageElement.textContent = text;


  messageElement.className =
    "message " + type;
}


function updateStatsDisplay(stats) {

  document.getElementById("totalEvents").textContent =
    stats.total;


  document.getElementById("upcomingEvents").textContent =
    stats.upcoming;


  document.getElementById("attendedEvents").textContent =
    stats.attended;
}



function getFilteredEvents(
  statusFilter,
  categoryFilter
) {

  let result = [];


  for (let event of events) {

    let matchesStatus =
      statusFilter === "all" ||
      getTimeStatus(event.date) === statusFilter;


    let matchesCategory =
      categoryFilter === "all" ||
      event.category === categoryFilter;


    if (matchesStatus && matchesCategory) {

      result.push(event);
    }
  }


  return result;
}



function updateFilterButtons(
  activeStatusFilter,
  activeCategoryFilter
) {

  let statusButtons =
    document.querySelectorAll(".status-filter-btn");


  for (let button of statusButtons) {

    if (
      button.getAttribute("data-status-filter") ===
      activeStatusFilter
    ) {

      button.classList.add("active");

    } else {

      button.classList.remove("active");
    }
  }


  let categoryButtons =
    document.querySelectorAll(".category-filter-btn");


  for (let button of categoryButtons) {

    if (
      button.getAttribute("data-category-filter") ===
      activeCategoryFilter
    ) {

      button.classList.add("active");

    } else {

      button.classList.remove("active");
    }
  }
}




function resetForm() {

  document.getElementById("eventTitle").value = "";

  document.getElementById("eventDate").value = "";

  document.getElementById("eventCategory").value = "work";

  document.getElementById("eventLocation").value = "";


  document.getElementById("formTitle").textContent =
    "Add New Event";


  document.getElementById("submitButton").textContent =
    "Add Event";


  editingIndex = null;
}


function refreshApp() {

  let stats = calculateStats(events);

  updateStatsDisplay(stats);


  let visibleEvents =
    getFilteredEvents(
      currentStatusFilter,
      currentCategoryFilter
    );


  renderEvents(visibleEvents);


  updateFilterButtons(
    currentStatusFilter,
    currentCategoryFilter
  );
}


document
  .getElementById("eventForm")
  .addEventListener("submit", function (event) {

    event.preventDefault();


    let titleInput =
      document.getElementById("eventTitle");


    let dateInput =
      document.getElementById("eventDate");


    let categoryInput =
      document.getElementById("eventCategory");


    let locationInput =
      document.getElementById("eventLocation");


    let title =
      titleInput.value.trim();


    let date =
      dateInput.value;


    let category =
      categoryInput.value;


    let location =
      locationInput.value.trim();


    let error =
      validateEvent(
        title,
        date,
        category,
        location
      );


    if (error !== "") {

      showMessage(error, "error");

      return;
    }


   

    if (editingIndex === null) {

      addEvent(
        title,
        date,
        category,
        location
      );


      showMessage(
        "Event added successfully!",
        "success"
      );


    } else {

   

      events[editingIndex].title = title;

      events[editingIndex].date = date;

      events[editingIndex].category = category;

      events[editingIndex].location = location;


      showMessage(
        "Event updated successfully!",
        "success"
      );
    }


    resetForm();

    refreshApp();
  });




let statusFilterButtons =
  document.querySelectorAll(".status-filter-btn");


for (
  let i = 0;
  i < statusFilterButtons.length;
  i = i + 1
) {

  statusFilterButtons[i]
    .addEventListener("click", function () {

      currentStatusFilter =
        statusFilterButtons[i]
          .getAttribute("data-status-filter");


      refreshApp();
    });
}



let categoryFilterButtons =
  document.querySelectorAll(".category-filter-btn");


for (
  let i = 0;
  i < categoryFilterButtons.length;
  i = i + 1
) {

  categoryFilterButtons[i]
    .addEventListener("click", function () {

      currentCategoryFilter =
        categoryFilterButtons[i]
          .getAttribute("data-category-filter");


      refreshApp();
    });
}




const THEME_STORAGE_KEY =
  "eventhorizon-theme";


function applyTheme(theme) {

  document.documentElement
    .setAttribute("data-theme", theme);


  localStorage.setItem(
    THEME_STORAGE_KEY,
    theme
  );


  let icon =
    document.getElementById("themeToggleIcon");


  let toggleBtn =
    document.getElementById("themeToggle");


  if (theme === "dark") {

    icon.textContent = "☀️";

    toggleBtn.setAttribute(
      "aria-label",
      "Switch to light mode"
    );

  } else {

    icon.textContent = "🌙";

    toggleBtn.setAttribute(
      "aria-label",
      "Switch to dark mode"
    );
  }
}


function initTheme() {

  let savedTheme =
    localStorage.getItem(
      THEME_STORAGE_KEY
    );


  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {

    applyTheme(savedTheme);

  } else {

   
    applyTheme("light");
  }
}


document
  .getElementById("themeToggle")
  .addEventListener("click", function () {

    let currentTheme =
      document.documentElement
        .getAttribute("data-theme");


    let nextTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";


    applyTheme(nextTheme);
  });


initTheme();



refreshApp();


console.log(
  `${appName} loaded with ${events.length} events.`
);