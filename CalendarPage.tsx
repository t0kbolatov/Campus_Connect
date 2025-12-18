// Educational Project: CampusConnect
// Calendar page with monthly view and event highlighting

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  // Fetch events from database
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
  };

  // Get the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Get the number of days in the month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Check if a date has events
  const hasEvents = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateString);
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
    setSelectedDayEvents(getEventsForDay(day));
  };

  // Generate calendar grid
  const generateCalendar = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvent = hasEvents(day);
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            p-2 h-20 border border-gray-200 cursor-pointer transition-colors
            ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'}
            ${hasEvent ? 'font-bold' : ''}
          `}
        >
          <div className="text-right">
            <span className={isToday ? 'text-blue-600' : 'text-gray-700'}>
              {day}
            </span>
          </div>
          {hasEvent && (
            <div className="mt-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto"></div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Format the current month and year
  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Event Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{formatMonthYear()}</h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendar()}
            </div>
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Events
            </h3>

            {selectedDate ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No events on this day.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedDayEvents.map(event => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock size={14} className="text-blue-600" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={14} className="text-blue-600" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm">Click on a day to see events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
