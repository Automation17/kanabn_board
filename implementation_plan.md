# Kanban Board Project — MERN Stack

## General View
تطبيق Kanban Board كامل باستخدام MongoDB + Express + React + Node.js مع نظام تسجيل دخول JWT وإشعارات فورية عبر Socket.io.

**المستوى المستهدف**: مبتدئ (شرح كل خطوة)
**الميزات الرئيسية**: JWT Auth + Real-time Notifications (Socket.io)

---

## Project Structure

```
kanban-app/
│
├── backend/
│   ├── server.js              ← نقطة البداية (Express + Socket.io)
│   ├── .env                   ← JWT_SECRET, MONGO_URI
│   │
│   ├── config/
│   │   └── db.js              ← الاتصال بـ MongoDB
│   │
│   ├── models/
│   │   ├── User.js            ← Schema المستخدم
│   │   └── Task.js            ← Schema المهمة
│   │
│   ├── routes/
│   │   ├── auth.routes.js     ← POST /api/auth/register و /login
│   │   └── task.routes.js     ← GET/POST/PUT/DELETE /api/tasks
│   │
│   ├── controllers/
│   │   ├── auth.controller.js ← منطق التسجيل وإنشاء JWT
│   │   └── task.controller.js ← منطق CRUD للمهام
│   │
│   ├── middleware/
│   │   └── auth.middleware.js ← التحقق من JWT في كل طلب محمي
│   │
│   └── socket/
│       └── socket.js          ← أحداث Socket.io (task:added, task:moved...)
│
└── frontend/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── context/
        │   └── AuthContext.jsx    ← useContext لبيانات المستخدم
        ├── pages/
        │   ├── LoginPage.jsx
        │   └── BoardPage.jsx      ← صفحة Kanban الرئيسية
        ├── components/
        │   ├── Column.jsx         ← عمود (Todo / In Progress / Done)
        │   ├── TaskCard.jsx       ← بطاقة المهمة القابلة للسحب
        │   └── AddTaskModal.jsx
        └── hooks/
            └── useSocket.js       ← Hook مخصص لـ Socket.io
```

---

##  Building Plan (7 Steps)

| # | Step | Technology |
|---|---------|----------|
| 1 | Creating the project and connecting with MongoDB | Node.js, Express, Mongoose |
| 2 | Register & Login System | bcrypt, JWT |
| 3 | Middleware to protect the routes | JWT verify |
| 4 | Full CRUD operations for tasks (API) | Express routes + controllers |
| 5 | React Interface: Login + Board page | React, useContext, useReducer |
| 6 | Drag & Drop between the columns | @dnd-kit library |
| 7 | Integrating Socket.io (for instant notifications) | Socket.io client + server |

---

## Require Packages

```bash
# Backend
npm install express mongoose dotenv bcryptjs jsonwebtoken cors socket.io

# Frontend
npm install axios react-router-dom socket.io-client @dnd-kit/core @dnd-kit/sortable
```

---

## حالة التنفيذ

- [x] المرحلة 1: إعداد السيرفر والاتصال بـ MongoDB
- [x] المرحلة 2: نظام المصادقة (Register/Login + JWT)
- [x] المرحلة 3: Middleware للحماية
- [x] المرحلة 4: CRUD API للمهام
- [x] المرحلة 5: واجهة React (BoardPage + Column + TaskCard + AddTaskModal)
- [x] المرحلة 6: Drag & Drop (@dnd-kit/core + @dnd-kit/sortable)
- [x] المرحلة 7: Socket.io الفورية
