# FoodieAI – LLM-Based Restaurant Recommender System

## How to Run the Project

### 1. Start MongoDB

Make sure MongoDB is running.

On Windows, check the MongoDB service status:

```powershell
Get-Service *mongo*
```

Expected output:

```text
Status   Name      DisplayName
------   ----      -----------
Running  MongoDB   MongoDB Server (MongoDB)
```

MongoDB connection string:

```text
mongodb://localhost:27017
```

---

### 2. Run Spring Boot Backend

Navigate to the backend folder:

```powershell
cd backend
```

Start the Spring Boot application:

```powershell
.\mvnw spring-boot:run
```

The backend will be available at:

```text
http://localhost:8080
```

Authentication endpoints:

```http
POST http://localhost:8080/api/auth/register
POST http://localhost:8080/api/auth/login
```

---

### 3. Run React Frontend

Open a new terminal and navigate to the frontend folder:

```powershell
cd frontend
```

Install dependencies if this is the first run:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

### 4. Recommended Running Order

```text
1. Start MongoDB
2. Start Spring Boot backend
3. Start React frontend
4. Open http://localhost:5173
```

---

### 5. Test Flow

1. Open the registration page:

```text
http://localhost:5173/register
```

2. Create a new account.

3. Verify the user in MongoDB Compass:

```text
Database: foodieai
Collection: users
```

4. Login using the registered account.

5. After successful login, the user is redirected to:

```text
/recommendations
```

---

# Project Overview

FoodieAI is an intelligent restaurant recommendation platform that combines traditional filtering techniques with Large Language Models (LLMs) to provide personalized restaurant suggestions and explainable recommendations.

The system is designed as a full-stack application consisting of:

* **Frontend:** React + Vite
* **Authentication Backend:** Spring Boot + MongoDB
* **Recommendation Backend:** FastAPI (to be implemented)
* **Database:** MongoDB
* **LLM Integration:** Planned for recommendation explanations

---

# Current Development Status

## Frontend (React)

The following pages and components have been implemented:

### Authentication

* Login Page
* Register Page
* Form validation
* Success and error messages
* Automatic redirect after successful registration/login

### Navigation

* Responsive Navbar
* Active page highlighting
* Logged-in user name display
* Logout functionality

### Recommendations Page

* Hero section
* Recommendation cards
* Filter panel including:

  * Cuisine
  * Radius (All, 1, 3, 5, 10, 15, 20 km)
  * Minimum Rating
  * Price Range
  * Minimum Review Count
  * Top-K Results
* Why Recommended popup
* Restaurant detail navigation

### Search Page

* Restaurant search functionality
* Category filtering
* Empty state handling
* Search results display

### Restaurant Detail Page

* Restaurant information
* Popular dishes section
* User reviews section
* Add review form
* Google Maps button

### Responsive Design

Mobile responsiveness has been implemented for:

* Login/Register pages
* Navbar
* Recommendations page
* Search page
* Restaurant Detail page

---

# Backend (Spring Boot)

## Technologies

* Spring Boot
* Spring Security
* Spring Data MongoDB
* Validation
* Lombok

## Authentication Features

Implemented authentication functionalities include:

### User Registration

Endpoint:

```http
POST /api/auth/register
```

Example request:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Features:

* Email uniqueness validation
* User persistence in MongoDB
* Frontend integration completed

---

### User Login

Endpoint:

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Features:

* Email lookup
* Password verification
* Frontend integration completed
* Logged-in user's full name returned to frontend

---

### User Logout

Current implementation:

* Removes user information from localStorage
* Redirects the user to the login page

---

# Database (MongoDB)

MongoDB has been successfully integrated.

Database:

```text
foodieai
```

Current collections:

```text
users
```

Example document:

```json
{
  "_id": "...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

> **Note:** Passwords are currently stored as plain text for development purposes. BCrypt hashing will be implemented in future iterations.

---

# Application Architecture

## Current Architecture

```text
React Frontend
        ↓
Spring Boot
        ↓
MongoDB
```

## Target Architecture

```text
React Frontend
        ↓

 ┌─────────────────────────────┐
 │                             │
Spring Boot               FastAPI
(Authentication)    (Recommendation Engine)
 │                             │
 └────────── MongoDB ──────────┘
                    │
                    ↓
                   LLM
```

---

# Planned Features

## Authentication Improvements

* BCrypt password hashing
* JWT authentication
* Protected routes
* Token-based session management

---

## FastAPI Recommendation Service

Planned endpoints:

### Recommendations

```http
GET /recommendations
```

Returns personalized restaurant recommendations.

---

### Search

```http
GET /search?q=
```

Search restaurants by keyword.

---

### Restaurant Details

```http
GET /restaurants/{id}
```

Returns detailed restaurant information.

---

### Recommendation Explanation

```http
GET /explanation/{id}
```

Returns LLM-generated reasoning explaining why a restaurant was recommended.

---

# LLM Integration Goals

FoodieAI aims to improve transparency by providing explainable recommendations such as:

* Matches the user's cuisine preferences
* Highly rated by similar users
* Popular for specific dishes
* Positive customer sentiment
* Meets selected filtering criteria

Example:

```text
Why was this restaurant recommended?

• Matches your preference for Turkish cuisine.
• Frequently praised for fast service.
• Rated highly by similar users.
• Fits within your selected filters.
```

---

# Current Project Milestones Achieved

* React frontend developed
* Responsive UI implemented
* Spring Boot backend configured
* MongoDB integrated
* User registration completed
* User login completed
* Logout functionality completed
* Frontend-backend communication established
* MongoDB Compass integration verified

---

# Next Development Steps

1. Implement protected routes.
2. Introduce BCrypt password hashing.
3. Implement JWT authentication.
4. Develop FastAPI recommendation APIs.
5. Integrate restaurant and review collections.
6. Implement LLM-generated recommendation explanations.
7. Dockerize the application.
8. Prepare deployment environment.

---

# Authors

FoodieAI is being developed as a graduation project focusing on explainable, LLM-enhanced restaurant recommendation systems.
