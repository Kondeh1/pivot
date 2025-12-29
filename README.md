To make this as easy as possible, I have combined the entire **README.md** into one clean, copy-pasteable block. This follows the standard Markdown format used for documentation.

```markdown
# Pivot – Streamlined Task Management

**Pivot** is a modern, responsive to-do list application designed to help users organize their daily tasks with speed and precision. Built with a focus on fluid transitions and user-centric design, Pivot allows you to capture, edit, and manage your life's shifts gracefully.

---

## 🚀 Features

* **User Authentication:** Full Register and Login system with integrated **Google OAuth** support.
* **Dynamic Dashboard:** Personalized welcome messages and task lists for authenticated users.
* **Full CRUD Functionality:**
    * **Create:** Instantly add new items via the quick-entry bar.
    * **Read:** View tasks in a clean, categorized interface.
    * **Update:** In-line editing of task descriptions using a custom JS handler.
    * **Delete:** Remove tasks instantly using the checkbox-form trigger.
* **Modern UI/UX:**
    * **Top-Down Menu:** Animated navigation that slides from the top.
    * **Modal System:** Interactive Login/Signup containers with background blur.
    * **Responsive:** Fully optimized for mobile, specifically tested for iPhone 13 Mini resolutions.



---

## 🛠️ Tech Stack

* **Frontend:** EJS (Embedded JavaScript Templates), CSS3 (Flexbox/Keyframes), Vanilla JavaScript.
* **Backend:** Node.js, Express.
* **Database:** PostgreSQL.
* **Authentication:** Passport.js (Local Strategy & Google OAuth 2.0).

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js** and **PostgreSQL** installed.

### 2. Installation
Clone the repository and enter the directory:
```bash
git clone [https://github.com/your-username/pivot.git](https://github.com/your-username/pivot.git)
cd pivot

```

### 3. Install Dependencies

```bash
npm install express ejs pg passport passport-local passport-google-oauth2 body-parser

```

### 4. Database Setup

Run the following query in your SQL terminal:

```sql
Todo Table
CREATE TABLE todos (
  todo_id SERIAL PRIMARY KEY,
  task_description TEXT NOT NULL,
  username VARCHAR(100)
);

```

### 5. Run the Application

```bash
node app.js

```

The app will be accessible at `http://localhost:3000`.

---

## 📂 Project Structure

* `index.ejs`: Landing page with welcome messages and Auth modals.
* `dashboard.ejs`: User-specific task management interface.
* `partials/`: Modular components (`header`, `footer`, `dashboardheader`).
* `public/script.js`: Handles top-down menu animations and modal visibility logic.

---

## 💡 Core Logic

### In-line Editing Handler

The dashboard uses a specialized function to swap static text with an update form dynamically:

```javascript
function handler(id) {
  document.getElementById("edit" + id).setAttribute("hidden", true);
  document.getElementById("done" + id).removeAttribute("hidden");
  document.getElementById("input" + id).removeAttribute("hidden");
}

```

### Top-Down Navigation

The menu is controlled via CSS transitions on the `translateY` property. When the `active` class is added via JavaScript, the menu slides into view from above the viewport.

---

## 📝 License

2025 © Copyright Pivot. All Rights Reserved.

