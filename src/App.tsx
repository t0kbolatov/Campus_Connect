// Educational Project: CampusConnect
// Main application component with navigation and routing

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Events from './components/Events';
import CalendarPage from './components/CalendarPage';
import RoomBooking from './components/RoomBooking';
import LostFound from './components/LostFound';
import { Calendar, CalendarDays, DoorOpen, Package, LogOut, User } from 'lucide-react';

type Page = 'events' | 'calendar' | 'booking' | 'lostfound';

function App() {
  const { user, loading, signOut } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('events');

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show login/register if user is not authenticated
  if (!user) {
    return showRegister ? (
      <Register onToggle={() => setShowRegister(false)} />
    ) : (
      <Login onToggle={() => setShowRegister(true)} />
    );
  }

  // Navigation buttons configuration
  const navItems = [
    { id: 'events' as Page, label: 'Events', icon: Calendar },
    { id: 'calendar' as Page, label: 'Calendar', icon: CalendarDays },
    { id: 'booking' as Page, label: 'Room Booking', icon: DoorOpen },
    { id: 'lostfound' as Page, label: 'Lost & Found', icon: Package },
  ];

  // Render the current page component
  const renderPage = () => {
    switch (currentPage) {
      case 'events':
        return <Events />;
      case 'calendar':
        return <CalendarPage />;
      case 'booking':
        return <RoomBooking />;
      case 'lostfound':
        return <LostFound />;
      default:
        return <Events />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-blue-600">CampusConnect</h1>

              {/* Navigation Buttons */}
              <div className="hidden md:flex gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                        ${
                          currentPage === item.id
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User size={18} />
                <span className="text-sm">{user.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">{renderPage()}</main>
    </div>
  );
}

export default App;
