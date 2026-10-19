

const today = new Date().toLocaleDateString("en-CA");

const documents = [
    { trackingId: "Yin.676767", type: "Scaffold", date: today, time: "08:45" },
    { trackingId: "Yin.101010", type: "Written Work", date: today, time: "09:30" },
    { trackingId: "Yin.202020", type: "Excuse Letter", date: today, time: "10:05" },
];

const COUNTER_IDS = {
    "Scaffold": "scaffold",
    "Written Work": "written-work",
    "Excuse Letter": "excuse-letter",
};

// Get HTML elements
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");
const trackingInput = document.getElementById("tracking-id");
const searchBtn = document.getElementById("search-btn");
const searchMessage = document.getElementById("search-message");
const tableBody = document.getElementById("document-table");
const totalCounter = document.getElementById("total-submitted");

// Get today's date in YYYY-MM-DD format
function getLocalDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getTodaysDocuments() {
    const currentDate = getLocalDate();

    return documents.filter((doc) => doc.date === currentDate);
}

// Update submission counters
function renderCounters() {
    const todays = getTodaysDocuments();

    for (const [type, counterId] of Object.entries(COUNTER_IDS)) {
        const counter = document.getElementById(counterId);

        if (counter) {
            counter.textContent = todays.filter(
                (doc) => doc.type === type
            ).length;
        }
    }

    if (totalCounter) {
        totalCounter.textContent = todays.length;
    }
}

// Display documents in the table
function renderTable(list) {
    tableBody.replaceChildren();

    if (list.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 4;
        cell.textContent = "No documents to show.";

        return;
    }

    for (const doc of list) {
        const row = tableBody.insertRow();

        row.insertCell().textContent = doc.trackingId;
        row.insertCell().textContent = doc.type;
        row.insertCell().textContent = doc.date;
        row.insertCell().textContent = doc.time;
    }
}

// Search documents using their Tracking ID
function searchByTrackingId() {
    const query = trackingInput.value.trim();

    if (query === "") {
        searchMessage.textContent = "Please enter a Tracking ID.";
        renderTable(getTodaysDocuments());
        return;
    }

    const matches = documents.filter(
        (doc) => doc.trackingId.toLowerCase() === query.toLowerCase()
    );

    renderTable(matches);

    searchMessage.textContent = matches.length
        ? `Found ${matches.length} document(s) for ${query}.`
        : `No documents found for ${query}. Check the Tracking ID and try again.`;
}

// Search button
searchBtn.addEventListener("click", searchByTrackingId);

// Search when Enter is pressed
trackingInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchByTrackingId();
    }
});

// Add a new document submission
function addDocument(trackingId, type) {
    const now = new Date();

    if (!Object.prototype.hasOwnProperty.call(COUNTER_IDS, type)) {
        console.error("Invalid document type:", type);
        return;
    }

    documents.push({
        trackingId: trackingId,
        type: type,
        date: getLocalDate(now),
        time: now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }),
    });

    renderCounters();
    renderTable(getTodaysDocuments());
}

// Mobile navigation menu
if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
    });
}

// Initial page display
renderCounters();
renderTable(getTodaysDocuments());
