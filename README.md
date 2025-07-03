# Movie Reservation System

## Project Description

A RESTful API for managing a movie reservation system. This project handles user authentication, movie management, showtime scheduling, and seat reservations. The system includes features such as filtering, sorting, searching, and pagination for movie listings.

## Key Features

* User authentication (signup, login, password reset)
* Admin-protected routes for movie management
* Movie CRUD operations with image upload and resizing
* Movie filtering, sorting, searching, and pagination using API features
* ShowTime management with movie population
* Secure authentication using JWT tokens

## Technologies Used

* Node.js
* Express.js
* MongoDB (Mongoose)
* Multer (for image upload)
* Sharp (for image processing)
* Swagger (for API documentation)

## API Documentation

The API is fully documented using Swagger. You can access the documentation at:

```
http://localhost:2000/api-docs
```

## API Endpoints

### Authentication

* `POST /api/v1/auth/signup`: Register a new user
* `POST /api/v1/auth/login`: Login user
* `POST /api/v1/auth/forgotPassword`: Request password reset token
* `PATCH /api/v1/auth/resetPassword/:token`: Reset password using token

### Movies

* `GET /api/v1/movies`: Retrieve all movies with filtering, sorting, searching, and pagination
* `POST /api/v1/movies`: Create a new movie (admin only)
* `GET /api/v1/movies/:id`: Get a specific movie by ID
* `PATCH /api/v1/movies/:id`: Update a specific movie by ID (admin only)
* `DELETE /api/v1/movies/:id`: Delete a specific movie by ID (admin only)

### Movies - Query Features

#### Example Queries

* Search: `GET /api/v1/movies?search=Action`
* Filter: `GET /api/v1/movies?genre=Drama`
* Sort: `GET /api/v1/movies?sort=duration,-rating`
* Select fields: `GET /api/v1/movies?fields=title,genre`
* Pagination: `GET /api/v1/movies?page=2&limit=5`
* Advanced filtering: `GET /api/v1/movies?duration[gte]=120&rating[gte]=8`

### ShowTimes

* `GET /api/v1/showtimes`: Retrieve all showtimes (includes movie details)
* `POST /api/v1/showtimes`: Create a new showtime
* `GET /api/v1/showtimes/:id`: Get a specific showtime by ID
* `PATCH /api/v1/showtimes/:id`: Update a specific showtime by ID
* `DELETE /api/v1/showtimes/:id`: Delete a specific showtime by ID

## How to Run

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file for your environment variables (e.g., database URL, JWT secret).
4. Run `npm start` to start the server.
5. Access the API documentation at `http://localhost:2000/api-docs`

---

If you need help adding more details or want to customize the file further, I’m ready to help!
