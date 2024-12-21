# HAPPIE E-Commerce Platform 🛍️

[![Development Status](https://img.shields.io/badge/Status-Development-yellow)](https://github.com/kunalsahu20/ecom-web)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/kunalsahu20/ecom-web/pulls)

HAPPIE is a modern e-commerce platform built with Node.js, Express, and MongoDB. It features a sleek user interface, secure Razorpay payment integration, and a powerful admin dashboard for seamless product management.

## ✨ Features

### Customer Features
- 🛒 Intuitive shopping cart with real-time updates
- 💳 Secure payment processing via Razorpay
- 🔍 Smart product search and category filtering
- 📱 Fully responsive design for all devices
- 🎯 Product recommendations
- 💫 Smooth animations and transitions

### Admin Features
- 📊 Modern admin dashboard
- 📦 Product management (CRUD operations)
- 📝 Order tracking and management
- 📈 Basic analytics and reporting
- 🔐 Secure admin authentication
- 🎨 User-friendly interface

## ⚠️ Development Status

> **This project is currently in active development. While core features are functional, you may encounter some bugs or incomplete features. We welcome bug reports and contributions to improve the platform.**

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment**: Razorpay
- **Authentication**: JWT
- **Other Tools**: Font Awesome, Chart.js

## 📋 Prerequisites

Before installation, ensure you have:
- Node.js (v14.0.0 or higher)
- MongoDB (v4.4.0 or higher)
- npm (v6.0.0 or higher)
- A Razorpay account with test/live credentials

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunalsahu20/ecom-web.git
   cd ecom-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   # Linux/Mac
   sudo service mongod start
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Main Store: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 👨‍💻 Admin Access

Access the admin panel with these credentials:
- **URL**: http://localhost:3000/admin
- **Username**: admin
- **Password**: admin123

## 🔒 Environment Variables

Create a `.env` file with these variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add YourFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a Pull Request

## 🐛 Bug Reports

Found a bug? Please create an issue using this template:

```markdown
**Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. [First Step]
2. [Second Step]
3. [Additional Steps...]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., 16.13.0]
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Razorpay](https://razorpay.com/) - Payment gateway
- [Font Awesome](https://fontawesome.com/) - Icons
- [Chart.js](https://www.chartjs.org/) - Analytics charts

## 📞 Contact & Support

- **Developer**: Kunal Sahu
- **GitHub**: [@kunalsahu20](https://github.com/kunalsahu20)
- **Project Repository**: [ecom-web](https://github.com/kunalsahu20/ecom-web)

## 🚀 Upcoming Features

- 👥 User authentication and profiles
- 📱 Mobile app integration
- 📊 Advanced analytics dashboard
- 🌐 Multi-language support
- 📦 Multiple payment gateway options
- 📨 Email notifications
- 🎨 Customizable themes

---
Made with ❤️ by [Kunal Sahu](https://github.com/kunalsahu20)
