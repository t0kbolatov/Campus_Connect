// Educational Project: CampusConnect
// Room booking page for authenticated users

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Trash2, AlertCircle } from 'lucide-react'; // Добавил иконку AlertCircle
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  id: string;
  room: string;
  date: string;
  time: string;
  event_name: string;
  created_at: string;
}

export default function RoomBooking() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Состояние для ошибок

  // Form state
  const [newBooking, setNewBooking] = useState({
    room: '',
    date: '',
    time: '',
    event_name: '',
  });

  // Fetch user's bookings when component loads
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: true });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  // Функция для проверки пересечения времени (конфликтов)
  const checkAvailability = async (room: string, date: string, time: string) => {
    // 1. Получаем ВСЕ бронирования для этой комнаты в эту дату
    // (не только текущего пользователя, а вообще всех)
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('time')
      .eq('room', room)
      .eq('date', date);

    if (!existingBookings || existingBookings.length === 0) return true;

    // Преобразуем новое время в минуты для удобного сравнения
    const newTimeDate = new Date(`2000-01-01T${time}`);
    const newTimeMinutes = newTimeDate.getHours() * 60 + newTimeDate.getMinutes();

    // 2. Проверяем каждое существующее бронирование
    for (const booking of existingBookings) {
      const existingTimeDate = new Date(`2000-01-01T${booking.time}`);
      const existingTimeMinutes = existingTimeDate.getHours() * 60 + existingTimeDate.getMinutes();

      // Вычисляем разницу в минутах
      const diff = Math.abs(newTimeMinutes - existingTimeMinutes);

      // Если разница меньше 60 минут, значит есть конфликт
      // Например: занято в 10:00. 
      // Попытка в 10:30 -> разница 30 мин (Конфликт)
      // Попытка в 09:30 -> разница 30 мин (Конфликт)
      // Попытка в 11:00 -> разница 60 мин (Свободно)
      if (diff < 60) {
        return false;
      }
    }

    return true;
  };

  // Handle creating a new booking
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null); // Сброс ошибки

    // Шаг 1: Проверяем доступность
    const isAvailable = await checkAvailability(
      newBooking.room, 
      newBooking.date, 
      newBooking.time
    );

    if (!isAvailable) {
      setErrorMsg('This room is already booked for this time slot (±1 hour). Please choose another time.');
      return;
    }

    // Шаг 2: Если свободно, создаем бронирование
    const { error } = await supabase.from('bookings').insert([
      {
        ...newBooking,
        user_id: user?.id,
      },
    ]);

    if (!error) {
      // Reset form and refresh bookings
      setNewBooking({ room: '', date: '', time: '', event_name: '' });
      fetchBookings();
    } else {
      setErrorMsg('Failed to create booking. Please try again.');
    }
  };

  // Handle deleting a booking
  const handleDeleteBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);

    if (!error) {
      fetchBookings();
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const availableRooms = [
    'Football pitch A',
    'Football Pitch B',
    'Red Hall',
    'Blue Hall',
    'Sdu Dorm',
    'WI-FI Zone',
    'I310–I311',
    'RED Coffee',
    'Library Meeting Room',
    'Student Center Hall',
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Room Booking</h1>

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Book a Room</h2>
        
        {/* Сообщение об ошибке */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Room
              </label>
              <select
                required
                value={newBooking.room}
                onChange={(e) => setNewBooking({ ...newBooking, room: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a room...</option>
                {availableRooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                required
                value={newBooking.event_name}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, event_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Study Group Meeting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time (Start Time)
              </label>
              <input
                type="time"
                required
                value={newBooking.time}
                onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Bookings are for 1 hour slots.</p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Room
          </button>
        </form>
      </div>

      {/* My Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

        {loading ? (
          <p className="text-gray-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">You don't have any bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {booking.event_name}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-blue-600" />
                      <span>{booking.room}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-blue-600" />
                      <span>{formatDate(booking.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-blue-600" />
                      <span>{booking.time} - 1 Hour</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteBooking(booking.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel booking"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}