# API Specification

## Base URL
http://localhost:3000

---

## Endpoint: /auth/register
Method: POST  
Purpose: Register a new user  

Request Body:
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com"
}

Error Codes:
- 400: invalid input
- 409: user already exists

---

## Endpoint: /auth/login
Method: POST  
Purpose: Authenticate user  

Request Body:
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}

Response:
{
  "token": "jwt_token"
}

Error Codes:
- 401: unauthorized

---

## Endpoint: /announcements
Method: GET  
Purpose: Retrieve announcements  

Response:
{
  "items": [
    {
      "id": "uuid",
      "title": "Exam Schedule",
      "content": "Final exams start next week"
    }
  ]
}

Error Codes:
- 403: access denied
