# 🔐 License Management System

A full-stack License Management System with Admin & User dashboards with involving AWS.

Built using **MERN stack**, deployed on **AWS EC2**, supports license assignment, activation, email notifications, cron-based expiry, activity logs and exportable reports.

---

## 🚀 Live Demo

🌍 Frontend: http://13.61.94.101/register  
🛠 Backend API: http://13.61.94.101:5000/api

> Note: Server Is Currently Turned off!!
> Backend runs using PM2 on AWS EC2 (Ubuntu + Nginx)

---

## ✨ Features

### 👨‍💼 Admin Features
- Create licenses
- Assign licenses to users
- Renew / extend expiry
- View license activity logs
- Export:
  - CSV
  - Excel
  - PDF
- Dashboard analytics
- Manage users (enable/disable/change role)

### 👤 User Features
- View assigned licenses
- Activate license
- View status & expiry date
- Email notifications

---

## ✉ Email Notifications (AWS SES)

System automatically sends:

✔ License Assigned  
✔ License Activated  
✔ Expiry Reminder (cron-driven, 7 days before)

---

## 🛠 Tech Stack

**Frontend**
- React + Vite
- Axios
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- PM2 Process Manager
- Node-Cron Scheduler
- AWS SES Email Service

**Deployment**
- AWS EC2 Ubuntu
- NGINX reverse proxy
- PM2 auto-restart
- Elastic IP

---

## 📊 Dashboard Screens

- Admin Dashboard
- Manage Users
- Manage Licenses
- Activity Logs
- Reports Export Page

---

## 🧰 API Endpoints (Important)

| Method | Endpoint | Description |
|--------|--------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| PUT | /api/auth/password | Change password |
| POST | /api/licenses/create | Create license |
| POST | /api/licenses/assign | Assign license |
| POST | /api/licenses/activate | Activate license |
| PUT | /api/licenses/renew/:id | Renew license |
| GET | /api/logs | View activity logs |

---

## 🔧 Run Locally

```bash
git clone https://github.com/Sanjay173-design/license-management-system
cd license-management-system
```

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🌍 Deployment Notes (AWS EC2)

Backend runs using **PM2 auto-boot**

```bash
pm2 start server.js --name license-backend
pm2 save
pm2 startup
```

Frontend served via **Nginx**

Build:
```bash
npm run build
```

Upload:
```bash
scp -i key.pem -r dist ubuntu@EC2:/var/www/html
```

---

## 🏆 Author

👤 **HN Sanjay**

- GitHub — https://github.com/Sanjay173-design
- Portfolio — coming soon 😉

---

## ⭐ Contribute / Support

If you like this project:

⭐ Star this repo  
🐛 Open issues  
📩 Suggestions welcome

---

## 🛡 License

This project is MIT Licensed.
