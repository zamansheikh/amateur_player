"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { useCloudUpload } from "@/lib/useCloudUpload";
import AddressModal from "@/components/AddressModal";
import Link from 'next/link';
import Image from 'next/image';

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
  Trash2,
  Edit2,
  X,
  Upload,
  Loader2,
  LayoutList
} from "lucide-react";

// --- Interfaces ---

interface EventLocation {
  location_id?: number;
  address_str: string;
  zipcode?: string;
  lat: string;
  long: string;
}

interface EventUser {
  user_id: number;
  name: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  roles: {
    is_pro: boolean;
    is_center_admin: boolean;
    is_tournament_director: boolean;
  };
  profile_picture_url: string;
  cover_picture_url?: string;
  is_followable: boolean;
  is_following: boolean;
  follower_count: number;
}

interface PlayerEvent {
  event_id: number;
  title: string;
  description: string;
  event_datetime: string;
  location: EventLocation;
  total_interested: number;
  is_interested: boolean;
  flyer_url?: string;
  user: EventUser;
}

// Calendar Event Interface (Internal for Calendar View)
interface CalendarEvent {
  id: string;
  title: string;
  type: 'tournament' | 'league' | 'special' | 'practice' | 'maintenance' | 'user_event';
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
  rawEvent: PlayerEvent; // Reference to original event
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export default function EventsPage() {
  const { user } = useAuth();
  
  // View State
  const [viewMode, setViewMode] = useState<'calendar' | 'manage'>('calendar');
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  
  // Data State
  const [events, setEvents] = useState<PlayerEvent[]>([]);
  const [myEvents, setMyEvents] = useState<PlayerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyEvents, setLoadingMyEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calendar Logic State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Create/Edit Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // Form State
  const flyerUpload = useCloudUpload();
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: {
      address_str: '',
      zipcode: '',
      lat: '',
      long: ''
    },
    flyer_url: ''
  });
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data Fetching ---

  const fetchFeedEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events/v1/feed');
      setEvents(response.data || []);
    } catch (err) {
      console.error('Error fetching event feed:', err);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    if (!user) return;
    try {
      setLoadingMyEvents(true);
      const response = await api.get('/api/events/v1');
      setMyEvents(response.data || []);
    } catch (err) {
      console.error('Error fetching my events:', err);
    } finally {
      setLoadingMyEvents(false);
    }
  };

  useEffect(() => {
    fetchFeedEvents();
  }, []);

  useEffect(() => {
    if (viewMode === 'manage') {
      fetchMyEvents();
    }
  }, [viewMode]);

  // --- Calendar Helpers ---

  const convertEventsToCalendarEvents = (playerEvents: PlayerEvent[]): CalendarEvent[] => {
    return playerEvents.map(event => {
      const eventDate = new Date(event.event_datetime);
      const isPast = eventDate < new Date();
      
      return {
        id: event.event_id.toString(),
        title: event.title,
        type: 'user_event', // Simplified for now, or derive from desc/title
        date: event.event_datetime.split('T')[0],
        time: format(eventDate, 'h:mm a'),
        description: event.description,
        location: event.location.address_str,
        participants: event.total_interested,
        organizer: event.user.name,
        status: isPast ? 'completed' : 'upcoming',
        priority: 'medium',
        rawEvent: event
      };
    });
  };

  const calendarEvents = convertEventsToCalendarEvents(events);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendar: CalendarDay[] = [];

    // Previous month filler
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      calendar.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }

    // Current month
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDay = new Date(year, month, date);
      const isToday = currentDay.toDateString() === today.toDateString();
      const dayEvents = calendarEvents.filter(event => {
        // Adjust date comparison to be timezone safe or string based
        // Since api returns ISO, let's use the date string YYYY-MM-DD
        return event.date === format(currentDay, 'yyyy-MM-dd');
      });

      calendar.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: dayEvents
      });
    }

    // Next month filler
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
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // --- Handlers ---

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.location.lat) {
      alert('Please select a location');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalFlyerUrl = createForm.flyer_url;

      if (flyerFile) {
        const result = await flyerUpload.uploadFile(flyerFile, 'cdn');
        if (result.success && result.publicUrl) {
          finalFlyerUrl = result.publicUrl;
        } else {
          throw new Error('Failed to upload flyer');
        }
      }

      // Combine date and time
      const dateTime = new Date(`${createForm.date}T${createForm.time || '00:00'}`);

      const payload = {
        meta: {
          title: createForm.title,
          description: createForm.description,
          flyer_url: finalFlyerUrl
        },
        event_datetime: dateTime.toISOString(),
        location: {
          address_str: createForm.location.address_str,
          zipcode: createForm.location.zipcode,
          lat: createForm.location.lat,
          long: createForm.location.long
        }
      };

      await api.post('/api/events/v1', payload);
      
      // Cleanup and refresh
      setIsCreateModalOpen(false);
      resetForm();
      if (viewMode === 'manage') fetchMyEvents();
      fetchFeedEvents(); // Refresh calendar too
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/api/events/v1/delete/${eventId}`);
      // Optimistic or refetch
      setMyEvents(prev => prev.filter(e => e.event_id !== eventId));
      fetchFeedEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event.');
    }
  };

  const handleLocationSelect = (address: any) => {
    setCreateForm(prev => ({
      ...prev,
      location: {
        address_str: address.address,
        zipcode: address.zipcode,
        lat: address.latitude,
        long: address.longitude
      }
    }));
    setIsAddressModalOpen(false);
  };

  const resetForm = () => {
    setCreateForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: { address_str: '', zipcode: '', lat: '', long: '' },
      flyer_url: ''
    });
    setFlyerFile(null);
    setFlyerPreview(null);
    flyerUpload.reset();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFlyerFile(file);
      setFlyerPreview(URL.createObjectURL(file));
    }
  };

  // Filter Calendar Events
  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return calendarEvents.filter(event => {
      // Compare YYYY-MM-DD
      return event.date === format(selectedDate, 'yyyy-MM-dd');
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
      else newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const selectDate = (day: CalendarDay) => {
      if (day.isCurrentMonth) {
          const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
          setSelectedDate(newSelectedDate);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Header --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Events</h1>
              <p className="text-sm text-gray-600">Discover and manage bowling events</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'calendar' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('manage')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'manage' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <LayoutList className="w-4 h-4 inline-block mr-2" />
                  Manage Events
                </button>
              </div>

              {/* Create/Action Button */}
              {user && (
                 <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#8BC342] hover:bg-[#7ac85a] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- Calendar View --- */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Calendar Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-1">
                       <button onClick={() => navigateMonth('prev')} className="p-1 hover:bg-gray-100 rounded">
                         <ChevronLeft className="w-5 h-5 text-gray-600" />
                       </button>
                       <button onClick={() => navigateMonth('next')} className="p-1 hover:bg-gray-100 rounded">
                         <ChevronRight className="w-5 h-5 text-gray-600" />
                       </button>
                    </div>
                  </div>
                  <button onClick={() => {
                        const today = new Date();
                        setCurrentDate(today);
                        setSelectedDate(today);
                    }} className="text-sm font-medium text-[#8BC342]">
                    Today
                  </button>
                </div>

                {/* Calendar Grid */}
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#8BC342]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {calendar.map((day, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectDate(day)}
                        className={`min-h-[100px] border border-gray-100 rounded-lg p-2 cursor-pointer transition-colors ${
                          !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'
                        } ${day.isToday ? 'ring-2 ring-[#8BC342] ring-inset' : ''} ${
                          selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date), 'yyyy-MM-dd') && day.isCurrentMonth
                             ? 'bg-green-50' 
                             : ''
                        }`}
                      >
                         <div className="flex justify-between items-start">
                           <span className={`text-sm font-medium ${day.isToday ? 'text-[#8BC342]' : ''}`}>
                             {day.date}
                           </span>
                           {day.events.length > 0 && day.isCurrentMonth && (
                             <span className="bg-[#8BC342] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                               {day.events.length}
                             </span>
                           )}
                         </div>
                         <div className="mt-1 space-y-1">
                           {day.events.slice(0, 2).map((evt, i) => (
                             <div key={i} className="text-[10px] truncate bg-green-100 text-green-800 px-1 rounded">
                               {evt.time} {evt.title}
                             </div>
                           ))}
                           {day.events.length > 2 && (
                             <div className="text-[10px] text-gray-400 pl-1">
                               +{day.events.length - 2} more
                             </div>
                           )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar / Selected Date */}
            <div className="space-y-6">
               {selectedDate ? (
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">
                     {format(selectedDate, 'EEEE, MMMM do')}
                   </h3>
                   <div className="space-y-4 max-h-[500px] overflow-y-auto">
                     {getSelectedDateEvents().length === 0 ? (
                       <p className="text-gray-500 text-sm">No events scheduled for this day.</p>
                     ) : (
                       getSelectedDateEvents().map(event => (
                         <div key={event.id} className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start mb-1">
                               <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{event.title}</h4>
                               <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                 {event.time}
                               </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                               <MapPin className="w-3 h-3" />
                               <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-200">
                                   <Image 
                                      src={event.rawEvent.user.profile_picture_url || '/default-avatar.png'}
                                      alt={event.organizer}
                                      fill
                                      className="object-cover"
                                   />
                               </div>
                               <span className="text-xs text-gray-600 truncate">
                                 By {event.organizer}
                               </span>
                            </div>
                         </div>
                       ))
                     )}
                   </div>
                 </div>
               ) : (
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center h-48">
                    <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">Select a date to view events</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* --- Manage Events View --- */}
        {viewMode === 'manage' && (
          <div className="space-y-6">
            {!user ? (
               <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Sign in to manage events</h3>
                  <p className="text-gray-500 mt-2">You need to be logged in to create and manage your own events.</p>
               </div>
            ) : loadingMyEvents ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="w-8 h-8 animate-spin text-[#8BC342]" />
               </div>
            ) : myEvents.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                 <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-semibold text-gray-900">No events created yet</h3>
                 <p className="text-gray-500 mb-6">Create your first event to get started</p>
                 <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#8BC342] hover:bg-[#7ac85a] text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Event
                </button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {myEvents.map(event => (
                    <div key={event.event_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                       {/* Banner/Flyer */}
                       <div className="h-40 bg-gray-100 relative">
                          {event.flyer_url ? (
                             <Image 
                               src={event.flyer_url}
                               alt={event.title}
                               fill
                               className="object-cover"
                             />
                          ) : (
                             <div className="flex items-center justify-center h-full text-gray-400">
                               <Calendar className="w-10 h-10" />
                             </div>
                          )}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm">
                             <button
                               onClick={() => handleDeleteEvent(event.event_id)}
                               className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                               title="Delete Event"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                       
                       <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                             <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md text-center min-w-[50px]">
                                {format(new Date(event.event_datetime), 'MMM')}<br/>
                                <span className="text-lg">{format(new Date(event.event_datetime), 'dd')}</span>
                             </div>
                             <div className="flex-1 ml-3">
                                <h3 className="font-bold text-gray-900 line-clamp-1">{event.title}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(event.event_datetime), 'h:mm a')}
                                </div>
                             </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                             <MapPin className="w-3 h-3 shrink-0" />
                             <span className="truncate">{event.location.address_str}</span>
                          </div>
                       </div>
                    </div>
                 ))}
               </div>
            )}
          </div>
        )}
      </div>

      {/* --- Create Event Modal --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                   <X className="w-6 h-6" />
                </button>
             </div>
             
             <form onSubmit={handleCreateEvent} className="p-6 space-y-6">
                
                {/* Title & Desc */}
                <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                     <input
                       type="text"
                       required
                       value={createForm.title}
                       onChange={e => setCreateForm({...createForm, title: e.target.value})}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none"
                       placeholder="e.g. Saturday Night Tournament"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                     <textarea
                       rows={3}
                       required
                       value={createForm.description}
                       onChange={e => setCreateForm({...createForm, description: e.target.value})}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none resize-none"
                       placeholder="Tell people about your event..."
                     />
                   </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                     <input
                       type="date"
                       required
                       value={createForm.date}
                       onChange={e => setCreateForm({...createForm, date: e.target.value})}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                     <input
                       type="time"
                       required
                       value={createForm.time}
                       onChange={e => setCreateForm({...createForm, time: e.target.value})}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none"
                     />
                   </div>
                </div>

                {/* Location */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                   {createForm.location.address_str ? (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                         <MapPin className="w-5 h-5 text-gray-500" />
                         <span className="flex-1 text-sm text-gray-700">{createForm.location.address_str}</span>
                         <button
                           type="button"
                           onClick={() => setIsAddressModalOpen(true)}
                           className="text-sm text-[#8BC342] font-medium hover:underline"
                         >
                           Change
                         </button>
                      </div>
                   ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#8BC342] hover:text-[#8BC342] transition-colors flex items-center justify-center gap-2"
                      >
                         <MapPin className="w-5 h-5" />
                         Select Location
                      </button>
                   )}
                </div>

                {/* Flyer Upload */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Flyer (Optional)</label>
                   <div 
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                       flyerPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#8BC342]'
                      }`}
                   >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {flyerPreview ? (
                         <div className="relative w-full h-40">
                            <Image src={flyerPreview} alt="Preview" fill className="object-contain" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                               <p className="text-white font-medium">Click to change</p>
                            </div>
                         </div>
                      ) : (
                         <div className="space-y-2">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                         </div>
                      )}
                      
                      {flyerUpload.isUploading && (
                         <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-[#8BC342] mb-2" />
                            <span className="text-sm font-medium">Uploading... {flyerUpload.progress}%</span>
                         </div>
                      )}
                   </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                   <button
                     type="button"
                     onClick={() => setIsCreateModalOpen(false)}
                     className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={isSubmitting || flyerUpload.isUploading}
                     className="bg-[#8BC342] hover:bg-[#7ac85a] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
                   >
                     {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                     ) : (
                        'Create Event'
                     )}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* --- Address Modal --- */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleLocationSelect}
        title="Select Event Location"
      />
    </div>
  );
}
