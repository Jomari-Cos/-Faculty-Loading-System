// ===============================
// Faculty Loading System
// ===============================

let loads = [];
let sections = [];
let subjects = [];
let deleteIndex = -1;
let sortColumn = null;
let sortDirection = 'asc';

const STORAGE_KEY_LOADS = "facultyLoadingSystem.loads";
const STORAGE_KEY_SECTIONS = "facultyLoadingSystem.sections";
const STORAGE_KEY_SUBJECTS = "facultyLoadingSystem.subjects";

// ===============================
// localStorage Functions
// ===============================

function saveLoads() {
    localStorage.setItem(STORAGE_KEY_LOADS, JSON.stringify(loads));
}

function loadSavedLoads() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_LOADS);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            loads = parsed;
        }
    } catch {
        loads = [];
    }
}

function saveSections() {
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(sections));
}

function loadSavedSections() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_SECTIONS);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            sections = parsed;
        }
    } catch {
        sections = [];
    }
}

function saveSubjects() {
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
}

function loadSavedSubjects() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_SUBJECTS);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            subjects = parsed;
        }
    } catch {
        subjects = [];
    }
}

// ===============================
// Form Elements
// ===============================

const form = document.getElementById("loadForm");
const editIndex = document.getElementById("editIndex");
const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");

const faculty = document.getElementById("faculty");
const section = document.getElementById("section");
const subject = document.getElementById("subject");
const day = document.getElementById("day");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");

// Datalists
const facultyList = document.getElementById("facultyList");
const subjectSuggestions = document.getElementById("subjectSuggestions");

// Tables
const loadingTable = document.getElementById("loadingTable");
const loadingTableFull = document.getElementById("loadingTableFull");
const emptyState = document.getElementById("emptyState");
const recordCount = document.getElementById("recordCount");
const recordCountFull = document.getElementById("recordCountFull");
const sectionsTableBody = document.getElementById("sectionsTableBody");
const subjectsTableBody = document.getElementById("subjectsTableBody");

// Summary
const totalLoads = document.getElementById("totalLoads");
const totalFaculty = document.getElementById("totalFaculty");
const totalSections = document.getElementById("totalSections");
const totalSubjects = document.getElementById("totalSubjects");

// Buttons
const exportCSV = document.getElementById("exportCSV");
const confirmReset = document.getElementById("confirmReset");
const confirmDelete = document.getElementById("confirmDelete");
const importCSVBtn = document.getElementById("importCSVBtn");
const importFileInput = document.getElementById("importFileInput");

// Form toggle
const addLoadHeaderBtn = document.getElementById("addLoadHeaderBtn");
const addLoadViewBtn = document.getElementById("addLoadViewBtn");
const formCard = document.getElementById("formCard");
const closeFormBtn = document.getElementById("closeFormBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");

// Navigation
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const navItems = document.querySelectorAll(".nav-item[data-view]");
const viewContainers = document.querySelectorAll(".view-container");
const manageSectionsBtn = document.getElementById("manageSectionsBtn");
const manageSubjectsBtn = document.getElementById("manageSubjectsBtn");

// Section Management
const sectionForm = document.getElementById("sectionForm");
const sectionProgram = document.getElementById("sectionProgram");
const sectionYear = document.getElementById("sectionYear");
const sectionName = document.getElementById("sectionName");
const editSectionIndex = document.getElementById("editSectionIndex");
const sectionBtnText = document.getElementById("sectionBtnText");
const cancelSectionBtn = document.getElementById("cancelSectionBtn");
const sectionSearchInput = document.getElementById("sectionSearchInput");

// Subject Management
const subjectForm = document.getElementById("subjectForm");
const subjectSection = document.getElementById("subjectSection");
const subjectNameInput = document.getElementById("subjectName");
const editSubjectIndex = document.getElementById("editSubjectIndex");
const subjectBtnText = document.getElementById("subjectBtnText");
const cancelSubjectBtn = document.getElementById("cancelSubjectBtn");
const subjectSearchInput = document.getElementById("subjectSearchInput");

// Search & Filter
const searchInput = document.getElementById("searchInput");
const searchCategory = document.getElementById("searchCategory");
const dayFilter = document.getElementById("dayFilter");

// Sort
const sortableHeaders = document.querySelectorAll(".sortable");

// Delete Modal
const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteModal")
);

// ===============================
// Expected column headers (case-insensitive)
// ===============================

const HEADER_MAP = {
    "faculty": "faculty",
    "section": "section",
    "subject": "subject",
    "day": "day",
    "start time": "startTime",
    "starttime": "startTime",
    "end time": "endTime",
    "endtime": "endTime",
    "time start": "startTime",
    "time end": "endTime"
};

// ===============================
// Navigation Functions
// ===============================

function switchView(viewName) {
    // Update nav items
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Update view containers
    viewContainers.forEach(container => {
        container.classList.add('d-none');
    });

    // Show the target view
    const targetView = document.getElementById(viewName + 'View');
    if (targetView) {
        targetView.classList.remove('d-none');
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 900) {
        sidebar.classList.remove('show');
    }

    // Update icons
    lucide.createIcons();
}

// ===============================
// Update Datalists from table data
// ===============================

function updateDatalists() {
    const uniqueFaculty = new Set(loads.map(l => l.faculty));

    // Populate Faculty datalist
    facultyList.innerHTML = "";
    uniqueFaculty.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f;
        facultyList.appendChild(opt);
    });

    // Update section dropdown in Faculty Loading form
    updateSectionDropdown();

    // Update section dropdown in Subject Management
    updateSubjectSectionDropdown();
}

// ===============================
// Update Section Dropdown
// ===============================

function updateSectionDropdown() {
    // Clear and repopulate section dropdown in loading form
    const sectionDropdown = document.getElementById("section");
    if (sectionDropdown) {
        const currentValue = sectionDropdown.value;
        sectionDropdown.innerHTML = '<option value="">Select Section</option>';
        sections.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.fullName;
            opt.textContent = s.fullName;
            sectionDropdown.appendChild(opt);
        });
        if (currentValue) {
            sectionDropdown.value = currentValue;
        }
    }
}

// ===============================
// Update Subject Section Dropdown
// ===============================

function updateSubjectSectionDropdown() {
    subjectSection.innerHTML = '<option value="">Select Section</option>';
    sections.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.fullName;
        opt.textContent = s.fullName;
        subjectSection.appendChild(opt);
    });
}

// ===============================
// Update Subject Dropdown (based on selected section)
// ===============================

function updateSubjectDropdown(selectedSection) {
    const subjectDropdown = document.getElementById("subject");
    if (subjectDropdown) {
        const currentValue = subjectDropdown.value;
        subjectDropdown.innerHTML = '<option value="">Select Subject</option>';

        const sectionSubjects = subjects.filter(sub => sub.section === selectedSection);
        sectionSubjects.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.name;
            opt.textContent = s.name;
            subjectDropdown.appendChild(opt);
        });

        if (currentValue) {
            subjectDropdown.value = currentValue;
        }
    }
}

// ===============================
// Toast Notifications
// ===============================

function showToast(message, type = 'success') {
    const container = document.getElementById("toastContainer");

    const iconNames = {
        success: 'check-circle',
        info: 'info',
        error: 'alert-circle'
    };

    const iconColors = {
        success: '#2e7d32',
        info: '#1a237e',
        error: '#c62828'
    };

    const titles = {
        success: 'Success',
        info: 'Information',
        error: 'Error'
    };

    const iconName = iconNames[type] || iconNames.info;
    const iconColor = iconColors[type] || iconColors.info;
    const title = titles[type] || titles.info;

    const toastId = 'toast-' + Date.now();

    const toastHTML = `
        <div id="${toastId}" class="toast toast-notification ${type}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3500">
            <div class="toast-header bg-transparent">
                <i data-lucide="${iconName}" style="width:20px;height:20px;color:${iconColor};" class="me-2"></i>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHTML);

    const toastEl = document.getElementById(toastId);
    lucide.createIcons({ scope: toastEl });
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', function () {
        toastEl.remove();
    });
}

// ===============================
// CSV/Excel Import - Header-Based Column Mapping
// ===============================

function mapColumns(headers) {
    const mapping = {};
    headers.forEach((header, index) => {
        const key = header.toString().trim().toLowerCase();
        const clean = key.replace(/^["\']|["\']$/g, "");
        const field = HEADER_MAP[clean];
        if (field) {
            mapping[index] = field;
        }
    });
    return mapping;
}

function parseCSV(text) {
    const lines = [];
    let current = [];
    let inQuotes = false;
    let field = "";

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const next = text[i + 1];

        if (inQuotes) {
            if (ch === '"' && next === '"') {
                field += '"';
                i++;
            } else if (ch === '"') {
                inQuotes = false;
            } else {
                field += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ",") {
                current.push(field.trim());
                field = "";
            } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
                current.push(field.trim());
                if (current.length > 0 && current.some(c => c !== "")) {
                    lines.push(current);
                }
                current = [];
                field = "";
                if (ch === "\r") i++;
            } else if (ch === "\r") {
                current.push(field.trim());
                if (current.length > 0 && current.some(c => c !== "")) {
                    lines.push(current);
                }
                current = [];
                field = "";
            } else {
                field += ch;
            }
        }
    }
    current.push(field.trim());
    if (current.length > 0 && current.some(c => c !== "")) {
        lines.push(current);
    }

    return lines;
}

function convertToLoads(rows, mapping) {
    const result = [];

    for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.every(cell => !cell || cell.toString().trim() === "")) continue;

        const load = {};

        for (let colIndex in mapping) {
            const fieldName = mapping[colIndex];
            const value = row[colIndex] ? row[colIndex].toString().trim() : "";
            load[fieldName] = value;
        }

        // Validate required fields
        if (!load.faculty || !load.section || !load.subject || !load.day || !load.startTime || !load.endTime) {
            continue;
        }

        result.push(load);
    }

    return result;
}

function processImportFile(file) {
    const reader = new FileReader();
    const fileName = file.name;

    if (file.name.toLowerCase().endsWith(".csv")) {
        reader.onload = function (e) {
            const text = e.target.result;
            const rows = parseCSV(text);
            if (rows.length < 2) {
                showToast("That file doesn't have a header row with data. Please check and try again.", "error");
                return;
            }
            importRows(rows, fileName);
        };
        reader.readAsText(file);
    } else if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                if (json.length < 2) {
                    showToast("That file doesn't have a header row with data. Please check and try again.", "error");
                    return;
                }
                importRows(json, fileName);
            } catch (err) {
                showToast("Couldn't read that Excel file. The format may be unsupported.", "error");
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        showToast("Unsupported file type. Please use .csv, .xlsx, or .xls files.", "error");
    }
}

function importRows(rows, fileName) {
    const headers = rows[0];
    const mapping = mapColumns(headers);

    const foundFields = Object.values(mapping);
    const required = ["faculty", "section", "subject", "day", "startTime", "endTime"];
    const missing = required.filter(f => !foundFields.includes(f));

    if (missing.length > 0) {
        showToast(
            "Couldn't match these columns: " +
            missing.join(", ") +
            ". Your file needs headers like: Faculty, Section, Subject, Day, Start Time, End Time",
            "error"
        );
        return;
    }

    const newLoads = convertToLoads(rows, mapping);

    if (newLoads.length === 0) {
        showToast("No complete rows were found. Make sure every row has all 6 fields filled.", "error");
        return;
    }

    // Check for conflicts before adding
    const conflicts = [];
    const validLoads = [];

    for (const newLoad of newLoads) {
        const conflict = checkConflict(newLoad, -1);
        if (conflict) {
            conflicts.push(conflict);
        } else {
            validLoads.push(newLoad);
        }
    }

    if (conflicts.length > 0) {
        showToast(`Skipped ${conflicts.length} record(s) due to conflicts. First conflict: ${conflicts[0]}`, "error");
    }

    // Append valid loads to existing
    validLoads.forEach(l => loads.push(l));
    saveLoads();

    renderTable();
    updateSummary();
    updateDatalists();
    lucide.createIcons();

    showToast(
        `Imported ${validLoads.length} record${validLoads.length !== 1 ? 's' : ''} from "${fileName}". Total: ${loads.length} load${loads.length !== 1 ? 's' : ''}.`,
        "success"
    );
}

// ===============================
// Check Time Overlap
// ===============================

function hasOverlap(start1, end1, start2, end2) {
    return start1 < end2 && end1 > start2;
}

// ===============================
// Conflict Validation
// ===============================

function checkConflict(newLoad, ignoreIndex = -1) {
    for (let i = 0; i < loads.length; i++) {
        if (i === ignoreIndex) continue;

        const load = loads[i];
        if (load.day !== newLoad.day) continue;

        if (
            load.faculty === newLoad.faculty &&
            hasOverlap(newLoad.startTime, newLoad.endTime, load.startTime, load.endTime)
        ) {
            return `"${load.faculty}" is already scheduled on ${load.day} from ${load.startTime} to ${load.endTime}.`;
        }

        if (
            load.section === newLoad.section &&
            hasOverlap(newLoad.startTime, newLoad.endTime, load.startTime, load.endTime)
        ) {
            return `Section "${load.section}" already has "${load.subject}" on ${load.day} from ${load.startTime} to ${load.endTime}.`;
        }
    }

    return null;
}

// ===============================
// Form Submit
// ===============================

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (startTime.value >= endTime.value) {
        showToast("The end time must be later than the start time. Please adjust.", "error");
        startTime.focus();
        return;
    }

    const newLoad = {
        faculty: faculty.value.trim(),
        section: section.value,
        subject: subject.value,
        day: day.value,
        startTime: startTime.value,
        endTime: endTime.value
    };

    const index = editIndex.value;
    const conflict = checkConflict(newLoad, index === "" ? -1 : Number(index));

    if (conflict) {
        showToast(conflict, "error");
        return;
    }

    if (index === "") {
        loads.push(newLoad);
        showToast(`"${newLoad.faculty}" — ${newLoad.subject} has been added.`, "success");
    } else {
        loads[index] = newLoad;
        editIndex.value = "";
        submitBtnText.textContent = "Add Load";
        submitBtn.title = "Add this schedule entry (Ctrl + Enter)";
        showToast(`Entry updated successfully.`, "info");
    }

    saveLoads();

    // Keep Faculty and Section values, clear the rest
    const facultyVal = faculty.value;
    const sectionVal = section.value;

    subject.value = "";
    day.value = "";
    startTime.value = "";
    endTime.value = "";

    faculty.value = facultyVal;
    section.value = sectionVal;

    renderTable();
    updateSummary();
    updateDatalists();
    lucide.createIcons();

    // Scroll back to form for next entry
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===============================
// Keyboard Shortcut: Ctrl + Enter to submit
// ===============================

form.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
});

// ===============================
// Get Filtered & Sorted Data
// ===============================

function getFilteredData() {
    let filtered = [...loads];

    const selectedDay = dayFilter.value;
    if (selectedDay !== 'all') {
        filtered = filtered.filter(load => load.day === selectedDay);
    }

    const query = searchInput.value.trim().toLowerCase();
    const category = searchCategory.value;

    if (query) {
        filtered = filtered.filter(load => {
            if (category === 'all') {
                return (
                    load.faculty.toLowerCase().includes(query) ||
                    load.section.toLowerCase().includes(query) ||
                    load.subject.toLowerCase().includes(query) ||
                    load.day.toLowerCase().includes(query)
                );
            }
            return load[category].toLowerCase().includes(query);
        });
    }

    if (sortColumn) {
        filtered.sort((a, b) => {
            const valA = a[sortColumn].toLowerCase();
            const valB = b[sortColumn].toLowerCase();
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return filtered;
}

// ===============================
// Render Table
// ===============================

function getEmptyStateRow() {
    return `
        <tr id="emptyState">
            <td colspan="7">
                <div class="empty-state-content">
                    <img src="images/empty_state.png" alt="Empty state illustration" class="empty-state-image" />
                    <h4 class="text-muted">No faculty loads yet</h4>
                    <p class="text-muted small mb-1">
                        Add your first faculty load or import data from a CSV/Excel file.
                    </p>
                    <p class="text-muted small mb-0">
                        Required fields: Faculty, Section, Subject, Day, Start Time, End Time.
                    </p>
                </div>
            </td>
        </tr>
    `;
}

function getEmptyStateRowFull() {
    return `
        <tr id="emptyStateFull">
            <td colspan="7">
                <div class="empty-state-content">
                    <img src="images/empty_state.png" alt="Empty state illustration" class="empty-state-image" />
                    <h4 class="text-muted">No faculty loads yet</h4>
                    <p class="text-muted small mb-1">
                        Add your first faculty load or import data from a CSV/Excel file.
                    </p>
                    <p class="text-muted small mb-0">
                        Required fields: Faculty, Section, Subject, Day, Start Time, End Time.
                    </p>
                </div>
            </td>
        </tr>
    `;
}

function renderTable() {
    const filtered = getFilteredData();

    // Update Dashboard view table
    if (loads.length === 0) {
        loadingTable.innerHTML = getEmptyStateRow();
        recordCount.textContent = "0 entries";
    } else {
        loadingTable.innerHTML = "";
        recordCount.textContent = `${loads.length} entr${loads.length !== 1 ? "ies" : "y"}`;
    }

    // Update Faculty Loading view table
    if (loadingTableFull) {
        if (loads.length === 0) {
            loadingTableFull.innerHTML = getEmptyStateRowFull();
            recordCountFull.textContent = "0 entries";
        } else {
            loadingTableFull.innerHTML = "";
            recordCountFull.textContent = `${loads.length} entr${loads.length !== 1 ? "ies" : "y"}`;
        }

        if (filtered.length === 0 && loads.length > 0) {
            loadingTableFull.innerHTML = `
                <tr>
                    <td colspan="7" class="text-muted py-4">
                        <i data-lucide="search" style="width:16px;height:16px;"></i>
                        No records match your search. Try different keywords or clear the filter.
                    </td>
                </tr>
            `;
        } else if (filtered.length > 0) {
            filtered.forEach((load, index) => {
                const originalIndex = loads.indexOf(load);

                loadingTableFull.innerHTML += `
                    <tr class="clickable-row" data-index="${originalIndex}" draggable="true">
                        <td>
                            <span class="badge-faculty">
                                <i data-lucide="badge-check" style="width:14px;height:14px;" class="me-1"></i>
                                ${escapeHtml(load.faculty)}
                            </span>
                        </td>
                        <td>
                            <span class="badge-section">
                                <i data-lucide="users" style="width:14px;height:14px;" class="me-1"></i>
                                ${escapeHtml(load.section)}
                            </span>
                        </td>
                        <td>
                            <span class="badge-subject">
                                <i data-lucide="book-open" style="width:14px;height:14px;" class="me-1"></i>
                                ${escapeHtml(load.subject)}
                            </span>
                        </td>
                        <td>
                            <span class="badge-day">
                                <i data-lucide="calendar" style="width:14px;height:14px;" class="me-1"></i>
                                ${escapeHtml(load.day)}
                            </span>
                        </td>
                        <td>
                            <span class="badge-time">
                                <i data-lucide="clock" style="width:14px;height:14px;" class="me-1"></i>
                                ${load.startTime}
                            </span>
                        </td>
                        <td>
                            <span class="badge-time">
                                <i data-lucide="clock" style="width:14px;height:14px;" class="me-1"></i>
                                ${load.endTime}
                            </span>
                        </td>
                        <td>
                            <button
                                class="btn btn-warning btn-sm action-btn"
                                onclick="editLoad(${originalIndex})"
                                title="Edit this record">
                                <i data-lucide="pencil" style="width:14px;height:14px;"></i>
                            </button>
                            <button
                                class="btn btn-danger btn-sm action-btn"
                                onclick="confirmDeleteLoad(${originalIndex})"
                                title="Delete this record">
                                <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    // Update Dashboard view table (for when there are records)
    if (loads.length > 0 && filtered.length > 0) {
        loadingTable.innerHTML = "";
        filtered.forEach((load, index) => {
            const originalIndex = loads.indexOf(load);

            loadingTable.innerHTML += `
                <tr class="clickable-row" data-index="${originalIndex}" draggable="true">
                    <td>
                        <span class="badge-faculty">
                            <i data-lucide="badge-check" style="width:14px;height:14px;" class="me-1"></i>
                            ${escapeHtml(load.faculty)}
                        </span>
                    </td>
                    <td>
                        <span class="badge-section">
                            <i data-lucide="users" style="width:14px;height:14px;" class="me-1"></i>
                            ${escapeHtml(load.section)}
                        </span>
                    </td>
                    <td>
                        <span class="badge-subject">
                            <i data-lucide="book-open" style="width:14px;height:14px;" class="me-1"></i>
                            ${escapeHtml(load.subject)}
                        </span>
                    </td>
                    <td>
                        <span class="badge-day">
                            <i data-lucide="calendar" style="width:14px;height:14px;" class="me-1"></i>
                            ${escapeHtml(load.day)}
                        </span>
                    </td>
                    <td>
                        <span class="badge-time">
                            <i data-lucide="clock" style="width:14px;height:14px;" class="me-1"></i>
                            ${load.startTime}
                        </span>
                    </td>
                    <td>
                        <span class="badge-time">
                            <i data-lucide="clock" style="width:14px;height:14px;" class="me-1"></i>
                            ${load.endTime}
                        </span>
                    </td>
                    <td>
                        <button
                            class="btn btn-warning btn-sm action-btn"
                            onclick="editLoad(${originalIndex})"
                            title="Edit this record">
                            <i data-lucide="pencil" style="width:14px;height:14px;"></i>
                        </button>
                        <button
                            class="btn btn-danger btn-sm action-btn"
                            onclick="confirmDeleteLoad(${originalIndex})"
                            title="Delete this record">
                            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } else if (loads.length > 0 && filtered.length === 0) {
        loadingTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-muted py-4">
                    <i data-lucide="search" style="width:16px;height:16px;"></i>
                    No records match your search. Try different keywords or clear the filter.
                </td>
            </tr>
        `;
    }

    attachDragEvents();
    lucide.createIcons();
}

// ===============================
// Attach drag events to rows (after render)
// ===============================

function attachDragEvents() {
    // Dashboard view table
    document.querySelectorAll("#loadingTable .clickable-row").forEach(row => {
        row.setAttribute("draggable", "true");

        row.addEventListener("dragstart", function (e) {
            const index = parseInt(this.dataset.index);
            if (isNaN(index)) return;

            const load = loads[index];
            if (!load) return;

            e.dataTransfer.setData("application/json", JSON.stringify(load));
            e.dataTransfer.effectAllowed = "copy";
            this.classList.add("dragging");
        });

        row.addEventListener("dragend", function () {
            this.classList.remove("dragging");
        });
    });

    // Faculty Loading view table
    if (loadingTableFull) {
        document.querySelectorAll("#loadingTableFull .clickable-row").forEach(row => {
            row.setAttribute("draggable", "true");

            row.addEventListener("dragstart", function (e) {
                const index = parseInt(this.dataset.index);
                if (isNaN(index)) return;

                const load = loads[index];
                if (!load) return;

                e.dataTransfer.setData("application/json", JSON.stringify(load));
                e.dataTransfer.effectAllowed = "copy";
                this.classList.add("dragging");
            });

            row.addEventListener("dragend", function () {
                this.classList.remove("dragging");
            });
        });
    }
}

// ===============================
// Escape HTML helper
// ===============================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===============================
// Edit Record
// ===============================

function editLoad(index) {
    const load = loads[index];

    faculty.value = load.faculty;
    section.value = load.section;
    subject.value = load.subject;
    day.value = load.day;
    startTime.value = load.startTime;
    endTime.value = load.endTime;

    editIndex.value = index;
    submitBtnText.textContent = "Update Load";
    submitBtn.title = "Save changes (Ctrl + Enter)";

    lucide.createIcons();

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    faculty.focus();
}

// ===============================
// Confirm Delete (Modal)
// ===============================

function confirmDeleteLoad(index) {
    deleteIndex = index;
    deleteModal.show();
}

// ===============================
// Delete Record (from modal)
// ===============================

confirmDelete.addEventListener("click", function () {
    if (deleteIndex === -1) return;

    const deleted = loads[deleteIndex];
    loads.splice(deleteIndex, 1);
    deleteIndex = -1;

    saveLoads();

    deleteModal.hide();

    renderTable();
    updateSummary();
    updateDatalists();
    showToast(`"${deleted.faculty}" — ${deleted.subject} has been removed.`, "info");
});

// ===============================
// Update Summary
// ===============================

function updateSummary() {
    totalLoads.textContent = loads.length;
    totalFaculty.textContent = new Set(loads.map(load => load.faculty)).size;
    totalSections.textContent = sections.length;
    totalSubjects.textContent = subjects.length;
}

// ===============================
// Export CSV
// ===============================

exportCSV.addEventListener("click", function () {
    if (loads.length === 0) {
        showToast("Nothing to export yet. Add some records first.", "error");
        return;
    }

    let csv = "Faculty,Section,Subject,Day,Start Time,End Time\n";

    loads.forEach(load => {
        csv += `"${load.faculty}","${load.section}","${load.subject}","${load.day}","${load.startTime}","${load.endTime}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Faculty_Loading.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showToast(`Exported ${loads.length} record${loads.length !== 1 ? 's' : ''} as "Faculty_Loading.csv".`, "success");
});

// ===============================
// Reset / New Semester
// ===============================

confirmReset.addEventListener("click", function () {
    const count = loads.length + sections.length + subjects.length;
    loads = [];
    sections = [];
    subjects = [];
    localStorage.removeItem(STORAGE_KEY_LOADS);
    localStorage.removeItem(STORAGE_KEY_SECTIONS);
    localStorage.removeItem(STORAGE_KEY_SUBJECTS);

    form.reset();
    sectionForm.reset();
    subjectForm.reset();
    editIndex.value = "";
    editSectionIndex.value = "";
    editSubjectIndex.value = "";
    submitBtnText.textContent = "Add Load";
    submitBtn.title = "Add this schedule entry (Ctrl + Enter)";
    sectionBtnText.textContent = "Add Section";
    subjectBtnText.textContent = "Add Subject";

    renderTable();
    renderSectionsTable();
    renderSubjectsTable();
    updateSummary();
    updateDatalists();

    bootstrap.Modal.getInstance(document.getElementById("resetModal")).hide();

    showToast(`New semester started. All data has been cleared.`, "info");
});

// ===============================
// Search & Filter Events
// ===============================

searchInput.addEventListener("input", renderTable);
searchCategory.addEventListener("change", renderTable);
dayFilter.addEventListener("change", renderTable);

// ===============================
// Sort
// ===============================

sortableHeaders.forEach(header => {
    header.addEventListener("click", function () {
        const column = this.dataset.sort;

        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        sortableHeaders.forEach(h => {
            const indicator = h.querySelector('.sort-indicator');
            if (indicator) {
                indicator.classList.remove('active-asc', 'active-desc');
            }
        });

        const activeIndicator = this.querySelector('.sort-indicator');
        if (activeIndicator) {
            activeIndicator.classList.add(sortDirection === 'asc' ? 'active-asc' : 'active-desc');
        }

        renderTable();
    });
});

// ===============================
// Clickable Row — Browse & Populate Form
// ===============================

loadingTable.addEventListener("click", function (e) {
    const row = e.target.closest(".clickable-row");
    if (!row) return;

    const index = parseInt(row.dataset.index);
    if (isNaN(index)) return;

    const load = loads[index];
    if (!load) return;

    faculty.value = load.faculty;
    section.value = load.section;
    subject.value = load.subject;
    day.value = load.day;
    startTime.value = load.startTime;
    endTime.value = load.endTime;

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    faculty.focus();
});

// Clickable Row for Faculty Loading view
if (loadingTableFull) {
    loadingTableFull.addEventListener("click", function (e) {
        const row = e.target.closest(".clickable-row");
        if (!row) return;

        const index = parseInt(row.dataset.index);
        if (isNaN(index)) return;

        const load = loads[index];
        if (!load) return;

        faculty.value = load.faculty;
        section.value = load.section;
        subject.value = load.subject;
        day.value = load.day;
        startTime.value = load.startTime;
        endTime.value = load.endTime;

        // Show the form when clicking from Faculty Loading view
        showForm();
        faculty.focus();
    });
}

// ===============================
// Form Toggle — Show/Hide Form Card
// ===============================

function showForm() {
    formCard.style.display = "block";
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideForm() {
    formCard.style.display = "none";
    editIndex.value = "";
    submitBtnText.textContent = "Add Load";
    submitBtn.title = "Add this schedule entry (Ctrl + Enter)";
    lucide.createIcons();
}

addLoadHeaderBtn.addEventListener("click", function() {
    switchView('loading');
    showForm();
});

addLoadViewBtn.addEventListener("click", showForm);
closeFormBtn.addEventListener("click", hideForm);
cancelFormBtn.addEventListener("click", hideForm);

// ===============================
// Section Management
// ===============================

function getSectionFullName(program, year, name) {
    return `${program} ${year} ${name}`;
}

function renderSectionsTable() {
    const query = sectionSearchInput.value.trim().toLowerCase();

    const filtered = sections.filter(s =>
        s.program.toLowerCase().includes(query) ||
        s.year.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query) ||
        s.fullName.toLowerCase().includes(query)
    );

    if (sections.length === 0) {
        sectionsTableBody.innerHTML = `
            <tr id="sectionsEmptyState">
                <td colspan="4" class="text-muted py-4">
                    No sections added yet. Add your first section above.
                </td>
            </tr>
        `;
        return;
    }

    sectionsTableBody.innerHTML = "";

    filtered.forEach((s, index) => {
        sectionsTableBody.innerHTML += `
            <tr>
                <td>${escapeHtml(s.program)}</td>
                <td>${escapeHtml(s.year)}</td>
                <td>${escapeHtml(s.name)}</td>
                <td>
                    <button class="btn btn-warning btn-sm action-btn" onclick="editSection(${index})" title="Edit this section">
                        <i data-lucide="pencil" style="width:14px;height:14px;"></i>
                    </button>
                    <button class="btn btn-danger btn-sm action-btn" onclick="deleteSection(${index})" title="Delete this section">
                        <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    lucide.createIcons();
}

sectionForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const program = sectionProgram.value.trim();
    const year = sectionYear.value;
    const name = sectionName.value.trim();

    if (!program || !year || !name) {
        showToast("All fields are required.", "error");
        return;
    }

    const fullName = getSectionFullName(program, year, name);

    // Check for duplicate
    const existingIndex = sections.findIndex(s => s.fullName === fullName);
    if (existingIndex !== -1 && existingIndex !== Number(editSectionIndex.value)) {
        showToast(`Section "${fullName}" already exists.`, "error");
        return;
    }

    const sectionData = {
        program,
        year,
        name,
        fullName
    };

    if (editSectionIndex.value === "") {
        sections.push(sectionData);
        showToast(`Section "${fullName}" has been added.`, "success");
    } else {
        sections[editSectionIndex.value] = sectionData;
        editSectionIndex.value = "";
        sectionBtnText.textContent = "Add Section";
        showToast(`Section updated successfully.`, "info");
    }

    saveSections();
    sectionForm.reset();
    renderSectionsTable();
    updateDatalists();
    updateSummary();
});

sectionSearchInput.addEventListener("input", renderSectionsTable);

cancelSectionBtn.addEventListener("click", function() {
    sectionForm.reset();
    editSectionIndex.value = "";
    sectionBtnText.textContent = "Add Section";
});

function editSection(index) {
    const s = sections[index];
    sectionProgram.value = s.program;
    sectionYear.value = s.year;
    sectionName.value = s.name;
    editSectionIndex.value = index;
    sectionBtnText.textContent = "Update Section";
    sectionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteSection(index) {
    const deleted = sections[index];

    // Also remove subjects associated with this section
    const subjectCount = subjects.filter(s => s.section === deleted.fullName).length;
    subjects = subjects.filter(s => s.section !== deleted.fullName);

    // Also remove loads associated with this section
    const loadCount = loads.filter(l => l.section === deleted.fullName).length;
    loads = loads.filter(l => l.section !== deleted.fullName);

    sections.splice(index, 1);

    saveSections();
    saveSubjects();
    saveLoads();

    renderSectionsTable();
    renderSubjectsTable();
    renderTable();
    updateDatalists();
    updateSummary();

    showToast(`Section "${deleted.fullName}" and ${subjectCount} associated subjects and ${loadCount} loads have been removed.`, "info");
}

// ===============================
// Subject Management
// ===============================

function renderSubjectsTable() {
    const query = subjectSearchInput.value.trim().toLowerCase();

    const filtered = subjects.filter(s =>
        s.section.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query)
    );

    if (subjects.length === 0) {
        subjectsTableBody.innerHTML = `
            <tr id="subjectsEmptyState">
                <td colspan="3" class="text-muted py-4">
                    No subjects added yet. Add your first subject above.
                </td>
            </tr>
        `;
        return;
    }

    subjectsTableBody.innerHTML = "";

    filtered.forEach((s, index) => {
        subjectsTableBody.innerHTML += `
            <tr>
                <td>${escapeHtml(s.section)}</td>
                <td>${escapeHtml(s.name)}</td>
                <td>
                    <button class="btn btn-warning btn-sm action-btn" onclick="editSubject(${index})" title="Edit this subject">
                        <i data-lucide="pencil" style="width:14px;height:14px;"></i>
                    </button>
                    <button class="btn btn-danger btn-sm action-btn" onclick="deleteSubject(${index})" title="Delete this subject">
                        <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    lucide.createIcons();
}

subjectForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const section = subjectSection.value;
    const name = subjectNameInput.value.trim();

    if (!section || !name) {
        showToast("All fields are required.", "error");
        return;
    }

    // Check for duplicate within the same section
    const existingIndex = subjects.findIndex(s => s.section === section && s.name === name);
    if (existingIndex !== -1 && existingIndex !== Number(editSubjectIndex.value)) {
        showToast(`Subject "${name}" already exists in section "${section}".`, "error");
        return;
    }

    const subjectData = {
        section,
        name
    };

    if (editSubjectIndex.value === "") {
        subjects.push(subjectData);
        showToast(`Subject "${name}" has been added to ${section}.`, "success");
    } else {
        subjects[editSubjectIndex.value] = subjectData;
        editSubjectIndex.value = "";
        subjectBtnText.textContent = "Add Subject";
        showToast(`Subject updated successfully.`, "info");
    }

    saveSubjects();
    subjectForm.reset();
    renderSubjectsTable();
    updateDatalists();
    updateSummary();
});

subjectSearchInput.addEventListener("input", renderSubjectsTable);

cancelSubjectBtn.addEventListener("click", function() {
    subjectForm.reset();
    editSubjectIndex.value = "";
    subjectBtnText.textContent = "Add Subject";
});

function editSubject(index) {
    const s = subjects[index];
    subjectSection.value = s.section;
    subjectNameInput.value = s.name;
    editSubjectIndex.value = index;
    subjectBtnText.textContent = "Update Subject";
    subjectForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteSubject(index) {
    const deleted = subjects[index];
    subjects.splice(index, 1);

    saveSubjects();
    renderSubjectsTable();
    updateDatalists();
    updateSummary();

    showToast(`Subject "${deleted.name}" has been removed.`, "info");
}

// ===============================
// Section Change - Update Subject Dropdown
// ===============================

section.addEventListener("change", function() {
    updateSubjectDropdown(this.value);
});

// ===============================
// Navigation Event Listeners
// ===============================

navItems.forEach(item => {
    item.addEventListener("click", function(e) {
        e.preventDefault();
        const view = this.dataset.view;
        switchView(view);
    });
});

sidebarToggle.addEventListener("click", function() {
    sidebar.classList.toggle('show');
});

manageSectionsBtn.addEventListener("click", function() {
    switchView('sections');
});

manageSubjectsBtn.addEventListener("click", function() {
    switchView('subjects');
});

// ===============================
// Import Button
// ===============================

importCSVBtn.addEventListener("click", function () {
    importFileInput.click();
});

importFileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    processImportFile(file);
    this.value = "";
});

// ===============================
// Drag & Drop file onto the table card
// ===============================

const tableCard = document.querySelector("#loadingTableCard") || document.querySelector("#tableCard");
const fileDropZone = document.getElementById("fileDropZone");

if (tableCard && fileDropZone) {
    tableCard.addEventListener("dragover", function (e) {
        if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            this.classList.add("file-drag-over");
            if (fileDropZone) fileDropZone.classList.add("show");
        }
    });

    tableCard.addEventListener("dragleave", function (e) {
        this.classList.remove("file-drag-over");
        if (fileDropZone) fileDropZone.classList.remove("show");
    });

    tableCard.addEventListener("drop", function (e) {
        e.preventDefault();
        this.classList.remove("file-drag-over");
        if (fileDropZone) fileDropZone.classList.remove("show");

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        const file = files[0];
        const validExt = [".csv", ".xlsx", ".xls"];
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
        if (!validExt.includes(ext)) {
            showToast("Please drop a .csv, .xlsx, or .xls file.", "error");
            return;
        }

        processImportFile(file);
    });
}

// ===============================
// Drag & Drop Support (table rows onto form fields)
// ===============================

function setupDropTargets() {
    document.querySelectorAll(".drop-target").forEach(target => {
        target.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            const dropField = this.closest(".drop-field");
            if (dropField) dropField.classList.add("drag-over");
        });

        target.addEventListener("dragleave", function () {
            const dropField = this.closest(".drop-field");
            if (dropField) dropField.classList.remove("drag-over");
        });

        target.addEventListener("drop", function (e) {
            e.preventDefault();

            const dropField = this.closest(".drop-field");
            if (dropField) dropField.classList.remove("drag-over");

            const rawData = e.dataTransfer.getData("application/json");
            if (!rawData) return;

            let loadData;
            try {
                loadData = JSON.parse(rawData);
            } catch {
                return;
            }

            const fieldName = dropField ? dropField.dataset.field : null;
            if (!fieldName || !loadData[fieldName]) return;

            const value = loadData[fieldName];

            if (this.tagName === "SELECT") {
                const options = this.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === value) {
                        this.value = value;
                        break;
                    }
                }
            } else {
                this.value = value;
            }

            this.dispatchEvent(new Event("input", { bubbles: true }));
            this.dispatchEvent(new Event("change", { bubbles: true }));

            showToast(`Pasted "${value}" into the ${fieldName} field.`, "info");
        });
    });
}

// ===============================
// Initialize Lucide + App
// ===============================

loadSavedLoads();
loadSavedSections();
loadSavedSubjects();
lucide.createIcons();
setupDropTargets();
renderTable();
renderSectionsTable();
renderSubjectsTable();
updateSummary();
updateDatalists();

// ===============================
// User Manual Modal
// ===============================

const manualModal = document.getElementById('manualModal');
if (manualModal) {
    manualModal.addEventListener('shown.bs.modal', function () {
        lucide.createIcons({ scope: this });
    });
}
