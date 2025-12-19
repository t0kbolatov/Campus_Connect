/*
  # CampusConnect Database Schema - Educational Project
  
  This migration creates the database structure for the CampusConnect university platform.
  
  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `title` (text) - Event title
      - `description` (text) - Event description
      - `date` (date) - Event date
      - `time` (time) - Event time
      - `location` (text) - Event location
      - `created_at` (timestamp) - When the event was created
    
    - `bookings`
      - `id` (uuid, primary key) - Unique identifier for each booking
      - `user_id` (uuid, foreign key) - References auth.users
      - `room` (text) - Room name/number
      - `date` (date) - Booking date
      - `time` (time) - Booking time
      - `event_name` (text) - Name of the event being booked for
      - `created_at` (timestamp) - When the booking was created
    
    - `lost_found`
      - `id` (uuid, primary key) - Unique identifier for each item
      - `item_name` (text) - Name of the lost/found item
      - `description` (text) - Item description
      - `date` (date) - Date item was lost/found
      - `location` (text) - Where item was lost/found
      - `contact` (text) - Contact information
      - `user_id` (uuid, foreign key) - User who posted the item
      - `created_at` (timestamp) - When the entry was created
  
  2. Security
    - Enable RLS on all tables
    - Events: Public read access, authenticated users can create
    - Bookings: Users can only see and manage their own bookings
    - Lost & Found: Authenticated users can create, all can read
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  event_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lost_found table
CREATE TABLE IF NOT EXISTS lost_found (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  description text DEFAULT '',
  date date NOT NULL,
  location text NOT NULL,
  contact text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;

-- Events policies: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Bookings policies: Users can only manage their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Lost & Found policies: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can view lost and found items"
  ON lost_found FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create lost and found items"
  ON lost_found FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lost and found items"
  ON lost_found FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lost and found items"
  ON lost_found FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);