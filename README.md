# 🧠 Forumly — Backend

A robust backend powering **Forumly**, a discussion platform inspired by Stack Overflow, Slack, and Reddit.  
It supports real-time discussions, authentication, rich text posts, upvotes, bookmarks, notifications, and more.

---

## 🌐 Live Links

- **Frontend (Full App):** [https://forumly.vercel.app](https://formuly-frontend.vercel.app/)
- **Backend (API):** [https://forumly-backend.onrender.com](https://forumly-backend.onrender.com)

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Real-time:** Socket.io  
- **Authentication:** JWT + Cookies  
- **Uploads:** Multer + Cloudinary  
- **Deployment:** Render (Backend), Vercel (Frontend), MongoDB Atlas (Database)

---

## ✨ Features

- 🔐 JWT Authentication with cookies  
- 💬 Create, read, and reply to discussions  
- 📈 Upvotes, bookmarks, and likes  
- 🏷️ Tags system with filtering  
- ⚡ Real-time notifications via Socket.io  
- 🧾 Rich text editor + media uploads  
- 📱 Mobile-friendly full-stack integration  
- 🚨 Rate limiting and validation middleware  

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Orewa-Veer/forumly-backend.git
cd forumly-backend
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Create a .env File
env
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
### 4️⃣ Run in Development Mode
```bash
npm run dev
The backend will start on http://localhost:5000
```
## 📂 Project Structure
```bash
forumly-backend/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
└── package.json
```
## 📡 API Endpoints
```bash
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user

Discussions
Method	Endpoint	Description
GET	/api/discussions	Get all discussions
GET	/api/discussions/:id	Get a single discussion
POST	/api/discussions	Create a new discussion

Replies
Method	Endpoint	Description
POST	/api/replies/:discussionId	Reply to a discussion

Tags & Notifications
Method	Endpoint	Description
GET	/api/tags	Fetch all tags
GET	/api/notifications	Fetch user notifications
```

🤝 Contributing
Fork the repository

Create a new branch (git checkout -b feature-name)

Commit your changes (git commit -m "Add feature-name")

Push to your branch (git push origin feature-name)

Create a Pull Request

🧑‍💻 Author
Veer — SDE

GitHub: [@Orewa-Veer](https://github.com/Orewa-Veer)

LinkedIn: [linkedin.com/in/veer](https://www.linkedin.com/in/veer-dev/)
