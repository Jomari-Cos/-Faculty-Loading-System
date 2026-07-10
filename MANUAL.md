# Faculty Loading System - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Section Management](#section-management)
4. [Subject Management](#subject-management)
5. [Room Management](#room-management)
6. [Adding Faculty Loads](#adding-faculty-loads)
7. [Faculty List](#faculty-list)
8. [Importing Data](#importing-data)
9. [Exporting Data](#exporting-data)
10. [Searching and Filtering](#searching-and-filtering)
11. [Editing Records](#editing-records)
12. [Deleting Records](#deleting-records)
13. [Managing Your Data](#managing-your-data)
14. [Understanding the Interface](#understanding-the-interface)
15. [Troubleshooting](#troubleshooting)

---

## Introduction

The **Faculty Loading System** is a web-based application designed to help academic institutions manage and track faculty teaching schedules. The system allows you to:

- Create and manage sections (BSCpE 1A, BSIT 2B, etc.)
- Assign subjects to sections
- Add, edit, and delete faculty load entries
- Import schedule data from CSV or Excel files
- Export your data for backup or reporting
- Search and filter records by various criteria
- Detect scheduling conflicts automatically
- View summary statistics of your faculty loads

---

## Getting Started

### Accessing the System
1. Open the `index.html` file in a modern web browser (Chrome, Firefox, Edge, Safari)
2. The system works entirely in your browser - no server installation required
3. Your data is saved locally in your browser's storage

### System Requirements
- Modern web browser with JavaScript enabled
- No internet connection required (all libraries are loaded via CDN)
- Local storage must be enabled for data persistence

---

## Section Management

### Creating Sections

**Step 1:** Navigate to Section Management
- Click on **"Section Management"** in the sidebar, or
- Click the **"Manage Sections"** button on the dashboard

**Step 2:** Fill in the section details
| Field | Description | Example |
|-------|-------------|---------|
| **Program** | Academic program code | BSCpE, BSIT, BSCS |
| **Year Level** | Academic year | 1st Year, 2nd Year, etc. |
| **Section Name** | Section identifier | A, B, C |

**Step 3:** Click **"Add Section"**
- The system will create a full section name (e.g., "BSCpE 1st Year A")
- Duplicate sections are prevented

### Example Sections to Create
```
Program: BSCpE, Year: 1st Year, Section: A  → BSCpE 1st Year A
Program: BSCpE, Year: 1st Year, Section: B  → BSCpE 1st Year B
Program: BSCpE, Year: 1st Year, Section: C  → BSCpE 1st Year C
Program: BSIT, Year: 2nd Year, Section: A   → BSIT 2nd Year A
Program: BSIT, Year: 2nd Year, Section: B   → BSIT 2nd Year B
```

### Managing Sections
- **Edit:** Click the pencil icon to modify a section
- **Delete:** Click the trash icon to remove a section (also removes associated subjects and loads)
- **Search:** Use the search box to filter sections by program, year, or name

---

## Subject Management

### Adding Subjects to Sections

**Step 1:** Navigate to Subject Management
- Click on **"Subject Management"** in the sidebar, or
- Click the **"Manage Subjects"** button on the dashboard

**Step 2:** Select a section
- Choose from the dropdown (populated from Section Management)

**Step 3:** Enter the subject name
- Type the subject code or name (e.g., "Programming 1", "Calculus")

**Step 4:** Click **"Add Subject"**
- Duplicate subjects within the same section are prevented

### Example Subjects for BSCpE 1st Year A
```
Section: BSCpE 1st Year A
- Programming 1
- Calculus 1
- Physics
- Engineering Drawing
- PE 1
- NSTP
- Purposive Communication
```

### Managing Subjects
- **Edit:** Click the pencil icon to modify a subject
- **Delete:** Click the trash icon to remove a subject
- **Search:** Use the search box to filter subjects

### Apply to All Sections of Same Year
- Check the **"Apply to all sections of the same year level"** checkbox to add a subject to all sections of the same year
- This is useful for subjects that are common across all sections (e.g., PE, NSTP, English)
- When checked, the section dropdown is disabled
- The system will add the subject to all sections of the selected year level

---

## Room Management

### Creating Rooms

**Step 1:** Navigate to Room Management
- Click on **"Room Management"** in the sidebar, or
- Click the **"Manage Rooms"** button on the dashboard

**Step 2:** Fill in the room details
| Field | Description | Example |
|-------|-------------|---------|
| **Room Name** | Name or number of the room | Room 101, Lab A, BSC 201 |
| **Capacity** | Maximum number of students | 30, 50, 100 |

**Step 3:** Click **"Add Room"**
- Duplicate room names are prevented
- Rooms are available for selection in the Faculty Loading form

### Managing Rooms
- **Edit:** Click the pencil icon to modify a room
- **Delete:** Click the trash icon to remove a room
- **Search:** Use the search box to filter rooms by name or capacity

### Room Conflict Checking
- The system prevents double-booking of rooms
- If you try to assign a room that's already booked at the same time on the same day, you'll get a conflict error
- **Error message:** "Room "[room name]" is already booked on [day] from [time] to [time]."

---

## Adding Faculty Loads

### Step-by-Step Workflow

**Step 1:** Navigate to Faculty Loading
- Click on **"Faculty Loading"** in the sidebar, or
- Click the **"Add Faculty Load"** button on the dashboard

**Step 2:** Click **"Add Faculty Load"** to show the form

**Step 3:** Fill in the required fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Faculty** | Name of the instructor | Dr. Cruz, Prof. Santos |
| **Section** | Select from existing sections | BSCpE 1st Year A |
| **Subject** | Select from section's subjects | Programming 1 |
| **Day** | Day of the week | Monday, Tuesday, etc. |
| **Start Time** | Class start time (24-hour) | 08:00, 13:30 |
| **End Time** | Class end time (24-hour) | 09:30, 15:00 |
| **Room** | Select from available rooms | Room 101, Lab A |
| **Units** | Number of units/credits | 1, 2, 3 |

**Step 4:** Click **"Add Load"** or press **Ctrl + Enter** to save

### Example Faculty Load Entry
```
Section: BSCpE 1st Year A
Subject: Programming 1
Professor: Prof. Santos
Day: Monday
Start: 08:00
End: 09:30
Room: Room 101
Units: 3
```

### Important Notes
- Subjects are filtered based on the selected section
- The system automatically checks for schedule conflicts (faculty, section, subject, and room)
- After adding, Faculty and Section are retained for quick re-entry
- Room and Units are optional fields

---

## Faculty List

### Viewing Faculty Information

**Step 1:** Navigate to Faculty List
- Click on **"Faculty List"** in the sidebar

**Step 2:** View faculty summary
- The table shows all faculty members with their:
  - Total number of loads
  - Total units taught
  - Sections assigned
  - Subjects taught

### Managing Faculty List
- **Search:** Use the search box to filter faculty by name, section, or subject
- The list is automatically populated from the Faculty Loading entries
- No manual editing - data is read-only

---

## Importing Data

### Supported File Formats
- **CSV** (.csv)
- **Excel** (.xlsx, .xls)

### Required Column Headers
Your file must contain the following headers (case-insensitive):

| Header | Alternative Names |
|--------|-------------------|
| Faculty | - |
| Section | - |
| Subject | - |
| Day | - |
| Start Time | starttime, time start |
| End Time | endtime, time end |
| Room | - |
| Units | - |

### Import Methods

#### Method 1: Click to Import
1. Click the **"Import"** button in the search bar
2. Select your CSV or Excel file
3. The system will automatically map columns and import data

#### Method 2: Drag and Drop
1. Drag your file from your file explorer
2. Drop it onto the table area
3. The file will be automatically processed

### Sample CSV Format
```csv
Faculty,Section,Subject,Day,Start Time,End Time,Room,Units
Prof. Santos,BSCpE 1st Year A,Programming 1,Monday,08:00,09:30,Room 101,3
Prof. Cruz,BSCpE 1st Year A,Calculus 1,Monday,09:30,11:00,Room 102,3
```

---

## Exporting Data

### Export to CSV
1. Click the **"Export"** button in the search bar
2. A file named `Faculty_Loading.csv` will be downloaded
3. The file contains all your current records

### When to Export
- Before starting a new semester
- For backup purposes
- For sharing with colleagues
- For reporting to administration

---

## Searching and Filtering

### Search Functionality
1. Use the **search input** to find records by keyword
2. Select a **search category** to limit search scope:
   - **All** - Searches all fields
   - **Faculty** - Searches only faculty names
   - **Subject** - Searches only subjects
   - **Section** - Searches only sections

### Day Filter
1. Use the **day filter dropdown** to show records for a specific day
2. Select **"All Days"** to show all records
3. Select a specific day (Monday-Saturday) to filter

### Sorting
1. Click on any **sortable column header** (Faculty, Section, Subject)
2. First click: Sort ascending (A-Z)
3. Second click: Sort descending (Z-A)
4. Active sort is indicated by highlighted chevron icons

---

## Editing Records

### How to Edit
1. Click on any **table row** to populate the form with that record's data
2. The **"Add Load"** button changes to **"Update Load"**
3. Modify the fields as needed
4. Click **"Update Load"** or press **Ctrl + Enter** to save changes

### Alternative Method
1. Click the **pencil (Edit)** button in the Actions column
2. The form will appear with the record's data
3. Make your changes and save

---

## Deleting Records

### Single Record Deletion
1. Click the **trash (Delete)** button in the Actions column
2. Confirm deletion in the modal dialog
3. Click **"Delete"** to confirm or **"Cancel"** to abort

### Bulk Deletion
1. Click the **"Reset Semester"** button in the sidebar
2. This opens the "Start New Semester" dialog
3. **Warning:** This deletes ALL records permanently
4. **Tip:** Export your data first before resetting

---

## Managing Your Data

### Data Persistence
- By default, data is cached in your browser so the app can still open quickly offline
- When Supabase is configured, the shared database becomes the main source of truth
- Other devices will pick up changes on the next sync poll, so everyone sees the same schedule

### Supabase Sync Setup
1. Create a table named `faculty_loading_state` in Supabase
2. Use this schema:

```sql
create table if not exists public.faculty_loading_state (
   id text primary key,
   state jsonb not null,
   updated_at timestamptz not null default now()
);
```

3. Add your project URL and anon key in the `SUPABASE_CONFIG` block inside `index.html`
4. Keep `rowId` set to `main` if you want one shared timetable for all devices
5. Make sure Row Level Security policies allow your anon key to read and write this table

Example policy for a shared class project:

```sql
alter table public.faculty_loading_state enable row level security;

create policy "Allow read access" on public.faculty_loading_state
for select using (true);

create policy "Allow write access" on public.faculty_loading_state
for insert with check (true);

create policy "Allow update access" on public.faculty_loading_state
for update using (true) with check (true);
```

### Starting a New Semester
1. **Export** your current data as backup
2. Click the **"Reset Semester"** button in the sidebar
3. Confirm in the modal dialog
4. All records will be cleared

### Data Recovery
- If Supabase sync is enabled, the reset is shared to every device using the same row
- If you need to undo a reset, restore from an exported file or re-import the previous data
- Regular exports are still recommended for important data

---

## Understanding the Interface

### Navigation Sidebar
| Icon | Section | Description |
|------|---------|-------------|
| 🏠 | Dashboard | Overview with statistics and quick actions |
| 👥 | Section Management | Create and manage class sections |
| 📖 | Subject Management | Assign subjects to sections |
| 🏢 | Room Management | Manage rooms and facilities |
| 👤 | Faculty List | View faculty summary and statistics |
| 📋 | Faculty Loading | Manage faculty schedules |
| 📘 | User Manual | This documentation |
| 🗑️ | Reset Semester | Clear all data |

### Statistics Cards
| Card | Description |
|------|-------------|
| **Loads** | Total number of schedule entries |
| **Faculty** | Number of unique faculty members |
| **Section** | Number of unique sections |
| **Subject** | Number of unique subjects |
| **Room** | Number of unique rooms |

### Form Fields
- **Section Dropdown:** Select from existing sections
- **Subject Dropdown:** Automatically filtered based on selected section
- **Room Dropdown:** Select from available rooms (optional)
- **Units:** Number of units/credits (optional, 1-5)
- **Time Fields:** Use 24-hour format (HH:MM)
- **Day Field:** Select from Monday to Saturday

### Table Columns
| Column | Description |
|--------|-------------|
| **Faculty** | Instructor name (click to sort) |
| **Section** | Class section (click to sort) |
| **Subject** | Subject code/name (click to sort) |
| **Day** | Day of the week |
| **Start** | Class start time |
| **End** | Class end time |
| **Room** | Assigned room |
| **Units** | Number of units |
| **Actions** | Edit/Delete buttons |

### Apply to All Sections Feature
- In Subject Management, you can check **"Apply to all sections of the same year level"**
- This will add the subject to all sections of the same year (e.g., all 1st Year sections)
- The section dropdown will be disabled when this option is checked

### Keyboard Shortcuts
- **Ctrl + Enter**: Submit the form (add or update)

---

## Troubleshooting

### Common Issues

#### "All fields are required"
- **Cause**: Empty field in section or subject form
- **Solution**: Fill in all required fields before submitting

#### "The end time must be later than the start time"
- **Cause**: Invalid time range entered
- **Solution**: Ensure end time is after start time

#### "Section already exists"
- **Cause**: Attempting to add a duplicate section
- **Solution**: Each section must be unique (program + year + name combination)

#### "Subject already exists in section"
- **Cause**: Attempting to add a duplicate subject to the same section
- **Solution**: Each subject can only be added once per section

#### "is already scheduled on [day] from [time] to [time]"
- **Cause**: Scheduling conflict detected
- **Solution**: The faculty member already has a class at that time
- **Action**: Choose a different time slot or day

#### Remote sync is not updating other devices
- **Cause**: Supabase URL/key are missing, or the RLS policies block access
- **Solution**: Fill in `SUPABASE_CONFIG` and confirm the table policies allow read/write access
- **Tip**: The app polls for changes every few seconds, so refresh delays are normal

#### "has overlapping classes on [day]"
- **Cause**: A section has two classes scheduled at the same time on the same day
- **Solution**: Sections cannot have overlapping class times on the same day
- **Action**: Adjust the schedule to avoid time conflicts within the same section

#### "Room is already booked on [day] from [time] to [time]"
- **Cause**: The room is already assigned to another class at the same time on the same day
- **Solution**: Choose a different room or adjust the time slot
- **Action**: The system prevents double-booking of rooms

#### "Subject is already assigned to section [section] on [day] from [time] to [time] with a different professor"
- **Cause**: The same subject is already being taught to the same section by a different professor at the same time
- **Solution**: This is not allowed - the same subject cannot be taught to the same section by different professors at the same time
- **Action**: Choose a different time slot or assign the same professor

#### "Couldn't match these columns"
- **Cause**: Missing or incorrect column headers in import file

#### "No complete rows were found"
- **Cause**: Some rows in your file are missing data
- **Solution**: Ensure all rows have values for all 6 required fields (Room and Units are optional)

### Browser Compatibility
- Works best in modern browsers
- If icons don't appear, refresh the page
- If data doesn't save, check browser's local storage settings

### Data Not Saving
1. Check if cookies/local storage are enabled
2. Try a different browser
3. Clear browser cache and try again

---

## Sample Workflow

### Step 1: Create Sections
1. Go to **Section Management**
2. Add:
   - BSCpE 1st Year A
   - BSCpE 1st Year B
   - BSCpE 1st Year C

### Step 2: Add Subjects
1. Go to **Subject Management**
2. For BSCpE 1st Year A, add:
   - Programming 1
   - Calculus 1
   - Physics
   - Engineering Drawing
   - PE 1
   - NSTP
   - Purposive Communication

### Step 3: Create Rooms
1. Go to **Room Management**
2. Add:
   - Room 101 (Capacity: 30)
   - Room 102 (Capacity: 30)
   - Room 103 (Capacity: 30)

### Step 4: Assign Professors
1. Go to **Faculty Loading**
2. Add:
   - Programming 1 → Prof. Santos, Monday, 08:00-09:30, Room 101, 3 units
   - Calculus 1 → Prof. Cruz, Monday, 09:30-11:00, Room 102, 3 units
   - Programming 1 → Prof. Santos, Monday, 10:00-11:30, Room 103 (BSCpE 1st Year B)

### Step 5: Check for Conflicts
If you try to add:
- Programming 1 → Prof. Santos, Monday, 08:30-10:00 (BSCpE 1st Year C)

The system will reject it because Prof. Santos is already teaching from 08:00-09:30.

---

## Tips and Best Practices

1. **Create sections first** before adding subjects or faculty loads
2. **Add all subjects** to each section before creating faculty loads
3. **Regular Backups:** Export your data regularly
4. **Consistent Naming:** Use consistent naming conventions for faculty and sections
5. **Time Format:** Use 24-hour format for clarity
6. **Conflict Checking:** The system automatically prevents double-booking
7. **Quick Entry:** After adding a load, Faculty and Section are retained for quick re-entry

---

## Support

For issues or questions:
1. Check this manual first
2. Ensure your browser is up to date
3. Try refreshing the page
4. Contact your system administrator

---

*Manual Version 2.0 | Last Updated: July 2026*