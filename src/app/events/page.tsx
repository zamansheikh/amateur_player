"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  MapPin,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Star,
  Target,
  Award,
  DollarSign,
  CalendarDays,
  ArrowRight,
  Timer,
  Flag,
  Crown,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'tournament' | 'league' | 'special' | 'practice' | 'maintenance';
  date: string;
  time: string;
  endTime?: string;
  description: string;
  location: string;
  participants: number;
  maxParticipants?: number;
  entryFee?: number;
  prizePool?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  organizer: string;
  registrationDeadline?: string;
  format?: string;
  gameType?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export default function EventsPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock events data
  const mockEvents: CalendarEvent[] = [
    // August 2025 Events
    {
      id: '1',
      title: 'Summer Championship Tournament',
      type: 'tournament',
      date: '2025-08-16',
      time: '10:00 AM',
      endTime: '6:00 PM',
      description: 'Annual summer championship with cash prizes. Open to all skill levels.',
      location: 'Main Lanes 1-16',
      participants: 45,
      maxParticipants: 64,
      entryFee: 50,
      prizePool: 3200,
      status: 'upcoming',
      priority: 'high',
      organizer: 'Bowlers Network',
      registrationDeadline: '2025-08-14',
      format: 'Singles',
      gameType: 'Scratch'
    },
    {
      id: '2',
      title: 'Sunday Night League - Week 4',
      type: 'league',
      date: '2025-08-17',
      time: '7:00 PM',
      endTime: '10:00 PM',
      description: 'Regular league play for Sunday Night League teams.',
      location: 'Lanes 5-12',
      participants: 32,
      status: 'upcoming',
      priority: 'medium',
      organizer: 'Sunday League Committee',
      format: 'Teams',
      gameType: 'Handicap'
    },
    {
      id: '3',
      title: 'Monday Mixed League - Week 3',
      type: 'league',
      date: '2025-08-18',
      time: '6:30 PM',
      endTime: '9:30 PM',
      description: 'Mixed doubles league play with handicap scoring.',
      location: 'Lanes 1-8',
      participants: 24,
      status: 'upcoming',
      priority: 'medium',
      organizer: 'Mixed League Committee',
      format: 'Doubles',
      gameType: 'Mixed'
    },
    {
      id: '4',
      title: 'Youth Bowling Clinic',
      type: 'special',
      date: '2025-08-19',
      time: '4:00 PM',
      endTime: '6:00 PM',
      description: 'Free bowling clinic for kids aged 8-16. Equipment provided.',
      location: 'Lanes 17-20',
      participants: 12,
      maxParticipants: 20,
      status: 'upcoming',
      priority: 'medium',
      organizer: 'Youth Program',
      format: 'Clinic',
      gameType: 'Instructional'
    },
    {
      id: '5',
      title: 'Wednesday Senior League',
      type: 'league',
      date: '2025-08-20',
      time: '2:00 PM',
      endTime: '5:00 PM',
      description: 'Senior league for bowlers 55+. Afternoon timing.',
      location: 'Lanes 9-16',
      participants: 18,
      status: 'upcoming',
      priority: 'medium',
      organizer: 'Senior Committee',
      format: 'Singles',
      gameType: 'Handicap'
    },
    {
      id: '6',
      title: 'Cosmic Bowling Night',
      type: 'special',
      date: '2025-08-22',
      time: '9:00 PM',
      endTime: '12:00 AM',
      description: 'Glow-in-the-dark bowling with music and special lighting.',
      location: 'All Lanes',
      participants: 0,
      maxParticipants: 100,
      entryFee: 15,
      status: 'upcoming',
      priority: 'low',
      organizer: 'Event Team',
      format: 'Open',
      gameType: 'Fun'
    },
    {
      id: '7',
      title: 'Pro-Am Tournament',
      type: 'tournament',
      date: '2025-08-24',
      time: '1:00 PM',
      endTime: '8:00 PM',
      description: 'Professional and amateur bowlers compete together.',
      location: 'Championship Lanes 1-8',
      participants: 32,
      maxParticipants: 32,
      entryFee: 75,
      prizePool: 2400,
      status: 'upcoming',
      priority: 'high',
      organizer: 'Pro Shop',
      format: 'Pro-Am',
      gameType: 'Scratch'
    },
    {
      id: '8',
      title: 'Lane Maintenance',
      type: 'maintenance',
      date: '2025-08-25',
      time: '6:00 AM',
      endTime: '12:00 PM',
      description: 'Scheduled lane maintenance and cleaning. Center closed for public.',
      location: 'All Lanes',
      participants: 0,
      status: 'upcoming',
      priority: 'high',
      organizer: 'Maintenance Team'
    },
    // September 2025 Events
    {
      id: '9',
      title: 'Labor Day Weekend Tournament',
      type: 'tournament',
      date: '2025-08-30',
      time: '11:00 AM',
      endTime: '7:00 PM',
      description: 'Special Labor Day weekend tournament with double prizes.',
      location: 'All Tournament Lanes',
      participants: 28,
      maxParticipants: 48,
      entryFee: 60,
      prizePool: 2880,
      status: 'upcoming',
      priority: 'high',
      organizer: 'Tournament Committee',
      registrationDeadline: '2025-08-28',
      format: 'Singles',
      gameType: 'Handicap'
    },
    {
      id: '10',
      title: 'Back to School Family Night',
      type: 'special',
      date: '2025-09-01',
      time: '5:00 PM',
      endTime: '9:00 PM',
      description: 'Family-friendly bowling with discounted rates and prizes.',
      location: 'Family Lanes 13-20',
      participants: 15,
      maxParticipants: 80,
      entryFee: 12,
      status: 'upcoming',
      priority: 'medium',
      organizer: 'Family Events',
      format: 'Family',
      gameType: 'Fun'
    }
  ];

  // Calendar generation logic
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const calendar: CalendarDay[] = [];
    
    // Add previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonth.getDate() - i;
      calendar.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }
    
    // Add current month's days
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDay = new Date(year, month, date);
      const isToday = currentDay.toDateString() === today.toDateString();
      const dayEvents = mockEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === currentDay.toDateString();
      });
      
      calendar.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: dayEvents
      });
    }
    
    // Add next month's leading days
    const remainingDays = 42 - calendar.length;
    for (let date = 1; date <= remainingDays; date++) {
      calendar.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }
    
    return calendar;
  };

  const calendar = generateCalendar();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'tournament': return 'bg-red-500';
      case 'league': return 'bg-blue-500';
      case 'special': return 'bg-purple-500';
      case 'practice': return 'bg-green-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'tournament': return <Trophy className="w-4 h-4" />;
      case 'league': return <Calendar className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'maintenance': return <Timer className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="w-4 h-4 text-red-600" />;
      case 'medium': return <Flag className="w-4 h-4 text-yellow-600" />;
      case 'low': return <Flag className="w-4 h-4 text-green-600" />;
      default: return null;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const selectDate = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
      setSelectedDate(selectedDate);
    }
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  };

  const filteredEvents = getSelectedDateEvents().filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Events Calendar</h1>
              <p className="text-gray-600 mt-1">
                Track all tournaments, leagues, and special events in one place
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {[
                  { mode: 'month', label: 'Month', icon: CalendarDays },
                  { mode: 'week', label: 'Week', icon: Calendar },
                  { mode: 'day', label: 'Day', icon: Clock }
                ].map((view) => (
                  <button
                    key={view.mode}
                    onClick={() => setViewMode(view.mode as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === view.mode
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <view.icon className="w-4 h-4" />
                    {view.label}
                  </button>
                ))}
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-5 h-5" />
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Today
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Week Day Headers */}
                {weekDays.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {calendar.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => selectDate(day)}
                    className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-all ${
                      day.isCurrentMonth
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-50 text-gray-400'
                    } ${
                      day.isToday
                        ? 'ring-2 ring-green-500 ring-inset'
                        : ''
                    } ${
                      selectedDate && selectedDate.getDate() === day.date && day.isCurrentMonth
                        ? 'bg-green-50 ring-2 ring-green-500 ring-inset'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        day.isToday ? 'text-green-600' : 
                        day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {day.date}
                      </span>
                      {day.events.length > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {day.events.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{day.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="space-y-6">
            {/* Event Type Legend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
              <div className="space-y-3">
                {[
                  { type: 'tournament', label: 'Tournaments', count: mockEvents.filter(e => e.type === 'tournament').length },
                  { type: 'league', label: 'League Games', count: mockEvents.filter(e => e.type === 'league').length },
                  { type: 'special', label: 'Special Events', count: mockEvents.filter(e => e.type === 'special').length },
                  { type: 'practice', label: 'Practice Sessions', count: mockEvents.filter(e => e.type === 'practice').length },
                  { type: 'maintenance', label: 'Maintenance', count: mockEvents.filter(e => e.type === 'maintenance').length }
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${getEventTypeColor(item.type)}`}></div>
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Date Events */}
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {getSelectedDateEvents().length} event(s)
                  </span>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 mb-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="tournament">Tournaments</option>
                    <option value="league">League Games</option>
                    <option value="special">Special Events</option>
                    <option value="practice">Practice</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Events List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            {getPriorityIcon(event.priority)}
                          </div>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time} {event.endTime && `- ${event.endTime}`}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          
                          {event.participants > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>
                                {event.participants}
                                {event.maxParticipants && `/${event.maxParticipants}`} participants
                              </span>
                            </div>
                          )}
                          
                          {event.entryFee && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>${event.entryFee} entry fee</span>
                            </div>
                          )}
                          
                          {event.prizePool && (
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              <span>${event.prizePool.toLocaleString()} prize pool</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                          
                          <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 transition-colors">
                            View Details <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        {getSelectedDateEvents().length === 0 
                          ? "No events on this date" 
                          : "No events match your filters"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-600">Tournaments</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {mockEvents.filter(e => e.type === 'tournament' && new Date(e.date).getMonth() === currentDate.getMonth()).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">League Games</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {mockEvents.filter(e => e.type === 'league' && new Date(e.date).getMonth() === currentDate.getMonth()).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Special Events</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {mockEvents.filter(e => e.type === 'special' && new Date(e.date).getMonth() === currentDate.getMonth()).length}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Total Events</span>
                    <span className="text-lg font-bold text-green-600">
                      {mockEvents.filter(e => new Date(e.date).getMonth() === currentDate.getMonth()).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
