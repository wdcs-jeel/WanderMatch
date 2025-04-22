# WanderMatch Backend API

This is the backend API for the WanderMatch application, providing user authentication, profile management, and other core functionalities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wandermatch
JWT_SECRET=your_jwt_secret_key
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "travelType": "Solo Traveler",
    "lookingFor": ["Friendship", "Adventure Partners"],
    "travelStyle": ["Adventure", "Cultural"]
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Profile Management

#### Update Profile
- **PUT** `/api/profile/update`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "fullName": "John Doe",
    "travelType": "Solo Traveler",
    "lookingFor": ["Friendship", "Adventure Partners"],
    "travelStyle": ["Adventure", "Cultural"],
    "bio": "Love traveling and meeting new people",
    "topDestinations": ["Paris", "Tokyo", "New York"],
    "languages": ["English", "Spanish"]
  }
  ```

#### Upload Identity Document
- **POST** `/api/profile/upload-identity`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "documentUrl": "https://example.com/document.jpg"
  }
  ```

#### Upload Profile Photos
- **POST** `/api/profile/upload-photos`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "photoUrls": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg"
    ]
  }
  ```

#### Get Profile
- **GET** `/api/profile/me`
- **Headers:** `Authorization: Bearer <token>`

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 500: Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is enabled for cross-origin requests
- Input validation is implemented using express-validator 