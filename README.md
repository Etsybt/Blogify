# Blogify API

## Project Overview
**Blogify API** is a full-featured blogging platform where users can create, manage, and share their blog posts. It provides authentication and authorization using JWT, allowing users to register, log in, create, update, delete, and search blogs. Users can also like, comment, and save posts for future reference. Blogify uses **MongoDB** for data storage, **Express** for backend routing, and **Mongoose** for data modeling. Passwords are securely hashed using **bcrypt**.

## Features
- **User Management**: User registration, login, profile management, and account deletion.
- **Blog Management**: Create, update, delete, and search blog posts.
- **Interactivity**: Users can like and comment on blog posts, and save them for later.
- **Security**: JWT-based authentication and password hashing with bcrypt.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **File Uploads**: Multer for handling file uploads

---

## Installation

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Postman](https://www.postman.com/) (Optional, for API testing)

### Clone the Repository
```bash
git clone https://github.com/Etsybt/blogify.git
cd Blogify
```

### Install dependencies
```bash
npm install
```

### Setup Environment Variables
Create a .env file in the root directory and add the following environment variables:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogify
JWT_SECRET=your_jwt_secret
```

### Run the Application
To start the server, run:
```bash
npm run dev
```

---

### License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

### Contact
For any inquiries or questions, please reach out to [hmidouchnouhaila2@gmail.com](mailto:hmidouchnouhaila2@gmail.com).