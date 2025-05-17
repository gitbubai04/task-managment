# 🧩 TaskTrackr – A Task Management App

TaskTrackr is a full-stack task management application built using the **MERN** stack with **Next.js** handling both the frontend and backend API routes. Users can register, log in, and manage personal tasks securely and efficiently.

---

## 🚀 Features

### 👤 User Authentication
- User **Registration** and **Login**
- Password **hashing** with `bcrypt`
- **JWT Authentication** stored in **HTTP-only cookies**
- **Protected API routes** via custom middleware

### ✅ Task Management (CRUD)
- **Create Task**: Title, Description, Due Date, Status
- **Read Tasks**: Filtered by pending/completed
- **Update Task**: Edit task details
- **Delete Task**
- **Mark Complete/Incomplete**

---

## ⚙ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | [Next.js](https://nextjs.org/) |
| Backend      | Next.js API Routes             |
| Database     | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| Auth         | JWT, bcrypt                    |
| Styling      | Tailwind CSS or MUI            |
| State Mgmt   | React Context / useState / useEffect |

---

## 🔒 Authentication Flow

- On successful **login/register**, a **JWT** is generated and stored in a secure **HTTP-only cookie**.
- A custom **middleware** (`withAuth`) checks for valid JWTs on protected routes.
- **Logout** clears the authentication cookie.

---

## 🧪 Bonus Features (Optional)

- 🔄 Drag-and-drop task ordering
- 🏷️ Categories or priority tags
- 🌙 Dark mode toggle
- 🙋‍♂️ User profile page

---

## 📁 Project Structure

```bash
.
├── client/              # Next.js app (frontend + API routes)
│   ├── app/ or pages/   # App Router or Pages Router
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utilities (e.g., auth middleware)
│   ├── styles/          # Tailwind/MUI styles
│   └── public/          # Static assets
├── server/              # Express server (if used separately)
│   ├── models/          # Mongoose models
│   ├── controllers/     # Task/user logic
│   ├── routes/          # Express routes (if any)
│   └── middleware/      # Auth middleware
└── README.md
