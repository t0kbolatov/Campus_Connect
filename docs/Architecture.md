# System Architecture

## 1. Architecture Style
Client–Server architecture using Backend-as-a-Service (BaaS).
This approach reduces backend maintenance and accelerates MVP delivery.

## 2. System Components
- Front end: React application running in the browser
- Back end: RESTful API managed by BaaS
- Database: PostgreSQL with Row Level Security
- External services: Authentication and token services

## 3. Component Diagram
The front end communicates with the backend API over HTTPS.  
The backend interacts with the database and enforces security rules.

## 4. Data Flow
1. User submits request via UI
2. Front end sends API request
3. Backend validates request and permissions
4. Database returns data
5. Response is rendered in UI

## 5. Database Schema
Main entities:
- Users (id, email, role)
- Announcements (id, title, content, created_at)
Relationships:
- One user can create many announcements (staff role)

## 6. Technology Decisions
- React: component-based UI development
- BaaS: faster development and built-in security
- PostgreSQL: reliability and scalability

## 7. Security Architecture
- JWT-based authentication
- RLS policies restricting data access by role

## 8. Deployment Architecture
- Front end hosted on Vercel
- Backend and database hosted via BaaS provider

## 9. Future Extensions
- Messaging module
- Notification service
- Analytics dashboard

