# 🚀 **UDDAAN CONSULTANCY - YOUR GATEWAY TO GLOBAL OPPORTUNITIES**

A complete job and study opportunity platform with admin management system.

## 📋 **FEATURES**

### **For Users:**
- ✅ Browse jobs by country and type
- ✅ View detailed job information
- ✅ Submit applications with resume upload
- ✅ Professional, responsive design
- ✅ Mobile-friendly interface

### **For Admin:**
- ✅ Secure admin login
- ✅ Add, edit, and delete jobs
- ✅ View all applications
- ✅ Contact applicants directly
- ✅ Dashboard with analytics
- ✅ Application status management

## 🛠️ **TECHNOLOGY STACK**

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **File Upload**: Multer
- **Authentication**: JWT (basic)
- **Styling**: Tailwind CSS with custom components

## 🚀 **QUICK START**

### **1. Install Dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### **2. Setup MongoDB**
```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Or on macOS with Homebrew
brew services start mongodb-community
```

### **3. Create Environment File**
Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/uddaan-consultancy
PORT=5000
NODE_ENV=development
```

### **4. Start the Application**
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
# Backend: npm run server
# Frontend: npm run client
```

## 🌐 **ACCESS YOUR APPLICATION**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

## 🔐 **ADMIN CREDENTIALS**

- **Username**: admin
- **Password**: uddaan123

## 📁 **PROJECT STRUCTURE**

```
uddaan-consultancy/
├── backend/
│   ├── models/
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Admin.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── JobListPage.jsx
│   │   │   ├── JobDetailPage.jsx
│   │   │   ├── ApplicationForm.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── package.json
└── README.md
```

## 🎯 **USER JOURNEY**

1. **User visits website** → Sees job search form
2. **User searches jobs** → Selects country and job type
3. **User sees job list** → Clicks on a job
4. **User views job details** → Clicks "Apply Now"
5. **User fills form** → Uploads resume and submits
6. **Admin gets notification** → Sees application in admin panel
7. **Admin contacts user** → Via email or phone

## 🔧 **ADMIN FEATURES**

### **Dashboard**
- Total jobs count
- Total applications count
- Recent applications
- Quick actions

### **Job Management**
- Add new job
- Edit existing job
- Delete job
- View all jobs

### **Application Management**
- View all applications
- Filter by status
- Contact applicant
- Update application status

## 📱 **RESPONSIVE DESIGN**

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 **DEPLOYMENT**

### **Local Development**
```bash
npm run dev
```

### **Production Build**
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start
```

## 🛡️ **SECURITY FEATURES**

- Input validation
- File upload restrictions
- Rate limiting
- CORS protection
- Secure headers

## 📞 **SUPPORT**

For any issues or questions:
- Check the console for error messages
- Ensure MongoDB is running
- Verify all dependencies are installed
- Check environment variables

## 🎨 **CUSTOMIZATION**

### **Colors**
Edit `frontend/tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: { /* Your colors */ },
  secondary: { /* Your colors */ },
  accent: { /* Your colors */ }
}
```

### **Content**
- Update job listings in admin panel
- Modify company information in components
- Change contact details in Footer component

---

**Built with ❤️ for Uddaan Consultancy**
