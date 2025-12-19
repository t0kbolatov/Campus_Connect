# CampusConnect - University Web Platform

**Educational Project** - A comprehensive university platform for managing campus activities, events, room bookings, and lost & found items.

## Features

### Authentication System
- **User Registration**: Create new accounts with email and password
- **User Login**: Secure authentication using Supabase Auth
- **Session Management**: Automatic session handling and persistence

### Pages & Functionality

1. **Events Page**
   - View all campus events with details (title, description, date, time, location)
   - Create new events (requires login)
   - Events stored in database with real-time updates

2. **Calendar Page**
   - Interactive monthly calendar view
   - Event days are highlighted with blue dots
   - Click any day to see events scheduled for that date
   - Navigate between months with arrow buttons

3. **Room Booking Page** (Login Required)
   - Book rooms for events and activities
   - Select from 10 available campus rooms
   - Specify date, time, and event name
   - View and manage your own bookings
   - Delete bookings when no longer needed

4. **Lost & Found Page** (Login Required to Post)
   - Report lost or found items
   - View all reported items
   - Each item includes: name, description, date, location, and contact info
   - Anyone can view items, but login required to post

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend & Database
- **Supabase** for database and authentication
- **PostgreSQL** database with Row Level Security (RLS)
- **Secure authentication** with email/password

### Database Tables
- `events` - Campus events and activities
- `bookings` - Room bookings by users
- `lost_found` - Lost and found items
- `auth.users` - User accounts (managed by Supabase)

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   The project already includes a `.env` file with Supabase credentials.

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Usage Guide

### Getting Started
1. Open the application in your browser
2. Create an account by clicking "Register here"
3. Fill in your name, email, and password
4. After registration, you'll be automatically logged in

### Using the Platform

**Navigate between pages** using the navigation bar at the top:
- Events - View and create campus events
- Calendar - See events in a monthly calendar view
- Room Booking - Book rooms for your activities
- Lost & Found - Report and find lost items

**Creating Events:**
1. Go to Events page
2. Click "Add Event" button
3. Fill in event details
4. Click "Create Event"

**Booking Rooms:**
1. Go to Room Booking page
2. Select a room from the dropdown
3. Enter event name, date, and time
4. Click "Book Room"
5. View your bookings below the form

**Reporting Lost/Found Items:**
1. Go to Lost & Found page
2. Click "Report Item"
3. Fill in item details
4. Click "Submit Report"

## Project Structure

```
src/
├── components/           # All page components
│   ├── Login.tsx        # Login page
│   ├── Register.tsx     # Registration page
│   ├── Events.tsx       # Events listing and creation
│   ├── CalendarPage.tsx # Calendar with event highlighting
│   ├── RoomBooking.tsx  # Room booking system
│   └── LostFound.tsx    # Lost & found items
├── contexts/
│   └── AuthContext.tsx  # Authentication state management
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── App.tsx              # Main app with navigation
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Security Features

- **Row Level Security (RLS)** enabled on all database tables
- **Authentication required** for creating content and managing bookings
- **User isolation** - Users can only modify their own bookings
- **Secure password handling** through Supabase Auth
- **Protected routes** - Certain features require authentication

## Database Schema

### Events Table
- `id` - Unique identifier
- `title` - Event name
- `description` - Event details
- `date` - Event date
- `time` - Event time
- `location` - Where the event takes place

### Bookings Table
- `id` - Unique identifier
- `user_id` - Reference to user who made the booking
- `room` - Room name/number
- `date` - Booking date
- `time` - Booking time
- `event_name` - Purpose of booking

### Lost & Found Table
- `id` - Unique identifier
- `item_name` - Name of item
- `description` - Item details
- `date` - Date lost/found
- `location` - Where item was lost/found
- `contact` - How to contact
- `user_id` - User who reported the item

## Educational Notes

This project demonstrates:
- **Modern React development** with hooks and functional components
- **TypeScript** for type safety
- **Authentication flows** and protected routes
- **Database operations** with Supabase
- **Responsive design** with Tailwind CSS
- **State management** using React Context
- **Form handling** and validation
- **CRUD operations** (Create, Read, Update, Delete)
- **User experience** with loading states and error handling

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## License

This is an educational project for learning purposes.

## Support

For issues or questions about the codebase, refer to the inline comments throughout the code which explain each component's purpose and functionality.
