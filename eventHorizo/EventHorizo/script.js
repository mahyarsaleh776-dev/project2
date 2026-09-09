const appName = "EventHorizon";

let events = [
  { title: "Team Standup", date: "2026-09-05", category: "work", location: "latakia", attendance: null },
  { title: "Birthday", date: "2026-09-12", category: "social", location: "jableh", attendance: null },
  { title: "Dentist Appointment", date: "2026-08-20", category: "personal", location: "latakia", attendance: "attended" }
];

let currentStatusFilter = "all";
let currentCategoryFilter = "all";

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

function buildEventHTML(event, index) {
  let categoryClass = getCategoryClass(event.category);
  let timeStatus = getTimeStatus(event.date);
  let timeStatusClass = getTimeStatusClass(timeStatus);
  let timeStatusLabel = getTimeStatusLabel(timeStatus);

  let attendanceHTML = "";
  if (event.attendance === "attended") {
    attendanceHTML = `<span class="attendance-tag attendance-attended">Attended</span>`;
  } else if (event.attendance === "cancelled") {
    attendanceHTML = `<span class="attendance-tag attendance-cancelled">Cancelled</span>`;
  }

  return `
    <div class="event-card ${timeStatusClass}" data-index="${index}">
      <div class="event-card-top">
        <h3>${event.title}</h3>
        <span class="category-tag ${categoryClass}">${event.category}</span>
      </div>
      <p>${event.date} · ${timeStatusLabel}</p>
      <p>${event.location}</p>
      ${attendanceHTML}
      <div class="event-actions">
        <button class="attend-btn" data-index="${index}">Attend</button>
        <button class="cancel-btn" data-index="${index}">Cancel</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    </div>
  `;
}

function renderEvents(eventsList) {
  let container = document.querySelector(".event-list");
  let html = "<h2>My Events</h2>";

  if (eventsList.length === 0) {
    html += `<p class="empty-state">No events found.</p>`;
  } else {
    for (let i = 0; i < eventsList.length; i = i + 1) {
      html += buildEventHTML(eventsList[i], i);
    }
  }

  container.innerHTML = html;
  attachEventButtonListeners();
}

function attachEventButtonListeners() {
  let attendButtons = document.querySelectorAll(".attend-btn");
  let cancelButtons = document.querySelectorAll(".cancel-btn");
  let deleteButtons = document.querySelectorAll(".delete-btn");

  for (let button of attendButtons) {
    button.addEventListener("click", handleAttend);
  }

  for (let button of cancelButtons) {
    button.addEventListener("click", handleCancel);
  }

  for (let button of deleteButtons) {
    button.addEventListener("click", handleDelete);
  }
}

function handleAttend(event) {
  let index = Number(event.target.getAttribute("data-index"));
  events[index].attendance = "attended";
  refreshApp();
}

function handleCancel(event) {
  let index = Number(event.target.getAttribute("data-index"));
  events[index].attendance = "cancelled";
  refreshApp();
}

function handleDelete(event) {
  let index = Number(event.target.getAttribute("data-index"));
  events.splice(index, 1);
  refreshApp();
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

  if (category !== "work" && category !== "personal" && category !== "social" && category !== "other") {
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
  let messageElement = document.getElementById("formMessage");
  messageElement.textContent = text;
  messageElement.className = "message " + type;
}

function updateStatsDisplay(stats) {
  document.getElementById("totalEvents").textContent = stats.total;
  document.getElementById("upcomingEvents").textContent = stats.upcoming;
  document.getElementById("attendedEvents").textContent = stats.attended;
}

function getFilteredEvents(statusFilter, categoryFilter) {
  let result = [];

  for (let event of events) {
    let matchesStatus = statusFilter === "all" || getTimeStatus(event.date) === statusFilter;
    let matchesCategory = categoryFilter === "all" || event.category === categoryFilter;

    if (matchesStatus && matchesCategory) {
      result.push(event);
    }
  }

  return result;
}

function updateFilterButtons(activeStatusFilter, activeCategoryFilter) {
  let statusButtons = document.querySelectorAll(".status-filter-btn");
  for (let button of statusButtons) {
    if (button.getAttribute("data-status-filter") === activeStatusFilter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  }

  let categoryButtons = document.querySelectorAll(".category-filter-btn");
  for (let button of categoryButtons) {
    if (button.getAttribute("data-category-filter") === activeCategoryFilter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  }
}

function refreshApp() {
  let stats = calculateStats(events);
  updateStatsDisplay(stats);

  let visibleEvents = getFilteredEvents(currentStatusFilter, currentCategoryFilter);
  renderEvents(visibleEvents);
  updateFilterButtons(currentStatusFilter, currentCategoryFilter);
}


document.getElementById("eventForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let titleInput = document.getElementById("eventTitle");
  let dateInput = document.getElementById("eventDate");
  let categoryInput = document.getElementById("eventCategory");
  let locationInput = document.getElementById("eventLocation");

  let title = titleInput.value.trim();
  let date = dateInput.value;
  let category = categoryInput.value;
  let location = locationInput.value.trim();

  let error = validateEvent(title, date, category, location);

  if (error !== "") {
    showMessage(error, "error");
    return;
  }

  addEvent(title, date, category, location);
  titleInput.value = "";
  dateInput.value = "";
  categoryInput.value = "work";
  locationInput.value = "";
  showMessage("Event added successfully!", "success");
  refreshApp();
});


let statusFilterButtons = document.querySelectorAll(".status-filter-btn");
for (let i = 0; i < statusFilterButtons.length; i = i + 1) {
  statusFilterButtons[i].addEventListener("click", function () {
    currentStatusFilter = statusFilterButtons[i].getAttribute("data-status-filter");
    refreshApp();
  });
}


let categoryFilterButtons = document.querySelectorAll(".category-filter-btn");
for (let i = 0; i < categoryFilterButtons.length; i = i + 1) {
  categoryFilterButtons[i].addEventListener("click", function () {
    currentCategoryFilter = categoryFilterButtons[i].getAttribute("data-category-filter");
    refreshApp();
  });
}

refreshApp();

console.log(`${appName} loaded with ${events.length} events.`);
