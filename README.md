
# 🚀 **UDDAAN CONSULTANCY - ENTERPRISE ADMIN SYSTEM**

A complete enterprise-grade job consultancy platform with comprehensive admin management system, built with modern security practices and scalable architecture.

## 🌟 **ENTERPRISE FEATURES**

### **🔐 Security & Authentication**
- ✅ Multi-Factor Authentication (TOTP/QR Code)
- ✅ Role-Based Access Control (RBAC)
- ✅ JWT with secure session management
- ✅ Password hashing with bcrypt
- ✅ Rate limiting and DDoS protection
- ✅ Comprehensive audit logging
- ✅ Input validation and sanitization
- ✅ CSRF protection and security headers

### **👥 User Management**
- ✅ Advanced user roles and permissions
- ✅ User session management
- ✅ Profile management with image upload
- ✅ Password reset functionality
- ✅ User activity tracking

### **💼 Job Management**
- ✅ Advanced job posting with rich content
- ✅ SEO optimization for job listings
- ✅ Featured jobs and job categories
- ✅ Application tracking system
- ✅ Bulk job import/export (CSV)
- ✅ Job analytics and statistics

### **📝 Content Management**
- ✅ Page builder with reusable blocks
- ✅ WYSIWYG editor with HTML support
- ✅ SEO fields and meta management
- ✅ Multi-language support (Nepali/English)
- ✅ Content versioning and scheduling
- ✅ Draft and publish workflow

### **📁 Media Management**
- ✅ Advanced file upload with validation
- ✅ Image processing and thumbnails
- ✅ CDN integration ready
- ✅ File organization with tags
- ✅ Secure file access controls
- ✅ Multiple storage backends support

### **📊 Analytics & Monitoring**
- ✅ Comprehensive dashboard with KPIs
- ✅ Real-time statistics and charts
- ✅ User activity monitoring
- ✅ System health monitoring
- ✅ Performance metrics
- ✅ Error tracking and reporting

### **🎨 Theme & Customization**
- ✅ Advanced theme management
- ✅ Color customization
- ✅ Font management
- ✅ Dark mode support
- ✅ Custom CSS injection
- ✅ Responsive design controls

### **📅 Event Management**
- ✅ Event creation and management
- ✅ Registration tracking
- ✅ Calendar integration
- ✅ Ticket management
- ✅ Event analytics

### **💬 Consultation System**
- ✅ Booking management
- ✅ Automated notifications
- ✅ Client communication tools
- ✅ Follow-up scheduling
- ✅ Meeting link integration

## 🛠️ **TECHNOLOGY STACK**

### **Backend**
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt + Speakeasy (2FA)
- **File Processing**: Multer + Sharp
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

### **Frontend**
- **Framework**: React 18 with Modern Hooks
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: Date-fns

### **Database Schema**
```
Users (RBAC) → Roles → Permissions
Jobs → Applications → Candidates
Pages → Content → SEO
Media → Files → Thumbnails
Events → Registrations
Consultations → Bookings → Follow-ups
Audit Logs → Activity Tracking
Themes → Customization
Settings → Configuration
```

## 🚀 **QUICK START**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB 5.0+
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/uddaan-consultancy.git
cd uddaan-consultancy
```

### **2. Environment Setup**
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit with your configuration
nano backend/.env
```

### **3. Install Dependencies**
```bash
# Install all dependencies
./start.sh

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### **4. Database Setup**
```bash
# Seed database with sample data
cd backend
npm run seed
```

### **5. Start Development**
```bash
# Start both frontend and backend
npm run dev
```

## 📁 **PROJECT STRUCTURE**

```
uddaan-consultancy/
├── backend/
│   ├── models/           # Database models
│   │   ├── User.js       # User & authentication
│   │   ├── Role.js       # RBAC system
│   │   ├── Job.js        # Job management
│   │   ├── Application.js # Application tracking
│   │   ├── Page.js       # Content management
│   │   ├── Media.js      # File management
│   │   ├── Event.js      # Event management
│   │   ├── Consultation.js # Booking system
│   │   ├── AuditLog.js   # Activity tracking
│   │   ├── Theme.js      # UI customization
│   │   └── Setting.js    # Configuration
│   ├── server.js         # Main application server
│   ├── seedData.js       # Database initialization
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Application pages
│   │   │   ├── AdminDashboard.jsx # Enterprise admin panel
│   │   │   ├── AdminLogin.jsx     # Secure login
│   │   │   └── ...
│   │   ├── App.js        # Main application
│   │   └── index.css     # Global styles
│   └── package.json      # Frontend dependencies
├── uploads/              # File storage
├── .env.example          # Environment template
├── start.sh              # Quick start script
└── README.md             # This file
```

## 🌐 **ACCESS POINTS**

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/secure-admin-access-2024
- **API Health**: http://localhost:5000/api/health
- **API Documentation**: http://localhost:5000/api/docs

## 🔐 **DEFAULT CREDENTIALS**

### **Super Admin**
- **Email**: admin@uddaan.com
- **Password**: uddaan123

### **Content Manager**
- **Email**: content@uddaan.com
- **Password**: uddaan123

## 📊 **ADMIN PANEL FEATURES**

### **Dashboard**
- Real-time statistics and KPIs
- Interactive charts and analytics
- Recent activity monitoring
- System health indicators
- Quick action buttons

### **User Management**
- Create/edit users with roles
- Permission management
- Session monitoring
- Activity tracking
- Bulk operations

### **Content Management**
- Page builder with blocks
- SEO optimization tools
- Media library integration
- Publishing workflow
- Version control

### **Job Management**
- Advanced job editor
- Application tracking
- Candidate management
- Analytics and reporting
- Bulk import/export

### **System Administration**
- Audit log viewing
- Security monitoring
- Performance metrics
- Configuration management
- Backup and maintenance

## 🔧 **API ENDPOINTS**

### **Authentication**
```
POST   /api/admin/login          # Admin login
POST   /api/admin/logout         # Admin logout
POST   /api/admin/mfa/setup      # Setup 2FA
POST   /api/admin/mfa/verify     # Verify 2FA
```

### **User Management**
```
GET    /api/admin/users          # List users
POST   /api/admin/users          # Create user
PUT    /api/admin/users/:id      # Update user
DELETE /api/admin/users/:id      # Delete user
```

### **Job Management**
```
GET    /api/admin/jobs           # List jobs
POST   /api/admin/jobs           # Create job
PUT    /api/admin/jobs/:id       # Update job
DELETE /api/admin/jobs/:id       # Delete job
```

### **Content Management**
```
GET    /api/admin/pages          # List pages
POST   /api/admin/pages          # Create page
PUT    /api/admin/pages/:id      # Update page
DELETE /api/admin/pages/:id      # Delete page
```

### **Media Management**
```
GET    /api/admin/media          # List media
POST   /api/admin/media          # Upload files
DELETE /api/admin/media/:id      # Delete media
```

## 🛡️ **SECURITY FEATURES**

### **Authentication & Authorization**
- JWT tokens with secure expiration
- Multi-factor authentication (TOTP)
- Role-based access control (RBAC)
- Session management
- Password security policies

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- File upload security

### **Network Security**
- Rate limiting
- CORS configuration
- Security headers (Helmet)
- IP-based restrictions
- DDoS protection

### **Monitoring & Auditing**
- Comprehensive audit logging
- Real-time monitoring
- Error tracking
- Performance monitoring
- Security event logging

## 📈 **PERFORMANCE OPTIMIZATION**

- Database indexing for optimal queries
- Image compression and optimization
- CDN integration support
- Caching strategies
- Code splitting and lazy loading
- Bundle optimization

## 🚀 **DEPLOYMENT**

### **Development**
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

### **Environment Variables**
Configure the following in `backend/.env`:
- Database connections
- JWT secrets
- Email configuration
- File storage settings
- External API keys

## 🔍 **MONITORING & MAINTENANCE**

### **Health Checks**
- Database connectivity
- File system health
- Memory usage
- Response times
- Error rates

### **Backup Strategy**
- Automated database backups
- File storage backups
- Configuration backups
- Disaster recovery procedures

### **Updates & Maintenance**
- Security patch management
- Dependency updates
- Performance optimization
- Feature enhancements

## 🤝 **CONTRIBUTING**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📞 **SUPPORT**

For technical support and inquiries:
- **Email**: tech@uddaanconsultancy.com
- **Phone**: +977-1-4444444
- **Website**: https://uddaanconsultancy.com

## 📄 **LICENSE**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Uddaan Consultancy Team**

*Connecting Nepali Professionals with Global Opportunities*
