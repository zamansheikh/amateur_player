"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { BowlingCenter } from "@/types"; // Import BowlingCenter type
import { format } from "date-fns";
import { useCloudUpload } from "@/lib/useCloudUpload";
import { useMapboxGeocoding } from '@/lib/useMapboxGeocoding';
import AddressModal from "@/components/AddressModal";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";

import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown, // Import ChevronDown
  Plus,
  Star,
  Search,
  ThumbsUp,
  Trash2,
  X,
  Upload,
  User,
  Loader2,
  LayoutList,
  FileText,
  Mail, // Imported Mail icon
  Building2, // Import Building2 icon
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
  location?: EventLocation; // Location is optional if center is provided
  center?: BowlingCenter;   // Center is optional if location is provided
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
  const router = useRouter();

  // View State
  const [viewMode, setViewMode] = useState<'calendar' | 'feed' | 'manage' | 'invitations'>('calendar');

  // Data State
  const [events, setEvents] = useState<PlayerEvent[]>([]);
  const [myEvents, setMyEvents] = useState<PlayerEvent[]>([]);
  const [invitations, setInvitations] = useState<PlayerEvent[]>([]); // New invitations state
  const [loading, setLoading] = useState(true);
  const [loadingMyEvents, setLoadingMyEvents] = useState(false);
  const [loadingInvitations, setLoadingInvitations] = useState(false); // New loading state for invitations
  const [error, setError] = useState<string | null>(null);

  // Search/Filter State
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    radius: '50', // Default 50 miles
  });

  // Geocoding for Radius Filter
  const { geocode } = useMapboxGeocoding();
  const [filterCoords, setFilterCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!filters.location) {
        setFilterCoords(null);
        return;
      }

      // Only geocode if we have a location string
      try {
        const result = await geocode(filters.location);
        if (result.success && result.latitude && result.longitude) {
          setFilterCoords({ lat: result.latitude, lng: result.longitude });
        }
      } catch (error) {
        console.error("Geocoding failed for filter:", error);
      }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timer);
  }, [filters.location, geocode]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  // Frontend Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by Name
      const matchesName = !filters.name ||
        event.title.toLowerCase().includes(filters.name.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.name.toLowerCase());

      // Filter by Location 
      let matchesLocation = true;

      // If we have geocoded coordinates for the filter, use radius logic
      // Check if event has valid coordinates (location OR center)
      const lat = event.location?.lat || event.center?.lat;
      const long = event.location?.long || event.center?.long;

      if (filters.location && filterCoords && lat && long) {
        const eventLat = parseFloat(lat);
        const eventLng = parseFloat(long);

        if (!isNaN(eventLat) && !isNaN(eventLng)) {
          const distance = calculateDistance(filterCoords.lat, filterCoords.lng, eventLat, eventLng);
          matchesLocation = distance <= parseFloat(filters.radius);
        } else {
          // Fallback to string match if coordinates invalid
          const address = event.location?.address_str || event.center?.address_str || '';
          const zipcode = event.location?.zipcode || event.center?.zipcode || '';

          matchesLocation =
            address.toLowerCase().includes(filters.location.toLowerCase()) ||
            (!!zipcode && zipcode.includes(filters.location));
        }
      } else {
        // Fallback or while loading coords: text match
        const address = event.location?.address_str || event.center?.address_str || '';
        const zipcode = event.location?.zipcode || event.center?.zipcode || '';

        matchesLocation = !filters.location ||
          address.toLowerCase().includes(filters.location.toLowerCase()) ||
          (!!zipcode && zipcode.includes(filters.location));
      }

      return matchesName && matchesLocation;
    });
  }, [events, filters, filterCoords]);

  // Calendar Logic State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Create/Edit Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Center Selection State
  const [centers, setCenters] = useState<BowlingCenter[]>([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);
  const [centerSearch, setCenterSearch] = useState(''); // Search state for centers
  const [isCenterDropdownOpen, setIsCenterDropdownOpen] = useState(false);
  const [locationMode, setLocationMode] = useState<'custom' | 'center'>('center'); // Default to center for better data quality

  // Form State
  const flyerUpload = useCloudUpload();
  const [createForm, setCreateForm] = useState({
    title: '',
    event_type: 'Podcast',
    description: '',
    date: '',
    time: '',
    location: {
      address_str: '',
      zipcode: '',
      lat: '',
      long: ''
    },
    center_id: '', // New field for selected center ID
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

  const fetchCenters = async () => {
    try {
      setIsLoadingCenters(true);
      const response = await api.get('/api/centers');
      setCenters(response.data || []);
    } catch (err) {
      console.error('Error fetching centers:', err);
    } finally {
      setIsLoadingCenters(false);
    }
  };

  const fetchInvitations = async () => {
    if (!user) return;
    try {
      setLoadingInvitations(true);
      const response = await api.get('/api/events/v1/invitations');
      setInvitations(response.data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
    } finally {
      setLoadingInvitations(false);
    }
  };

  useEffect(() => {
    fetchFeedEvents();
    // Set selected date to today initially if not set
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, []); // Only fetch once on mount

  useEffect(() => {
    if (viewMode === 'manage') {
      fetchMyEvents();
    } else if (viewMode === 'invitations') {
      fetchInvitations();
    }
  }, [viewMode]);

  // Fetch centers when modal opens
  useEffect(() => {
    if (isCreateModalOpen && centers.length === 0) {
      fetchCenters();
    }
  }, [isCreateModalOpen]);

  // --- Calendar Helpers ---

  const convertEventsToCalendarEvents = (playerEvents: PlayerEvent[]): CalendarEvent[] => {
    return playerEvents.map(event => {
      const eventDate = new Date(event.event_datetime);
      const isPast = eventDate < new Date();

      // Determine location string safely
      const locationStr = event.location?.address_str ||
        (event.center ? `${event.center.name}, ${event.center.address_str}` : 'Unknown Location');

      return {
        id: event.event_id.toString(),
        title: event.title,
        type: 'user_event', // Simplified for now, or derive from desc/title
        date: event.event_datetime.split('T')[0],
        time: format(eventDate, 'h:mm a'),
        description: event.description,
        location: locationStr,
        participants: event.total_interested,
        organizer: event.user.name,
        status: isPast ? 'completed' : 'upcoming',
        priority: 'medium',
        rawEvent: event
      };
    });
  };

  const calendarEvents = convertEventsToCalendarEvents(filteredEvents);

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

  const handleInterestToggle = async (eventId: number, currentInterested: boolean) => {
    if (!user) {
      alert("Please login to show interest");
      return;
    }

    // Optimistic Update
    setEvents(prev => prev.map(e => {
      if (e.event_id === eventId) {
        return {
          ...e,
          is_interested: !currentInterested,
          total_interested: currentInterested ? Math.max(0, e.total_interested - 1) : e.total_interested + 1
        };
      }
      return e;
    }));

    try {
      await api.get(`/api/events/v1/interest/${eventId}`);
      // Optionally refetch or rely on optimism. 
    } catch (err) {
      console.error("Error toggling interest:", err);
      // Revert
      setEvents(prev => prev.map(e => {
        if (e.event_id === eventId) {
          return {
            ...e,
            is_interested: currentInterested,
            total_interested: currentInterested ? e.total_interested + 1 : Math.max(0, e.total_interested - 1)
          };
        }
        return e;
      }));
      alert("Something went wrong");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation moved to specific modes below

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

      const payload: any = {
        meta: {
          title: createForm.title,
          event_type: createForm.event_type,
          description: createForm.description,
          flyer_url: finalFlyerUrl
        },
        event_datetime: dateTime.toISOString(),
      };

      if (locationMode === 'center') {
        if (!createForm.center_id) {
          alert('Please select a bowling center');
          setIsSubmitting(false);
          return;
        }
        payload.location = null;
        payload.center = { center_id: createForm.center_id };

        // Optional: Can fallback to center's location for geocoding if needed by backend, 
        // but user spec says location: null when center is selected.
      } else {
        if (!createForm.location.lat) {
          alert('Please select a location');
          setIsSubmitting(false);
          return;
        }
        // Payload adjustments for custom location
        payload.center = { center_id: null }; // Explicitly nullify center ID as requested
        payload.location = {
          address_str: createForm.location.address_str,
          zipcode: createForm.location.zipcode,
          lat: createForm.location.lat,
          long: createForm.location.long
        };
      }

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
      event_type: 'Podcast',
      description: '',
      date: '',
      time: '',
      location: { address_str: '', zipcode: '', lat: '', long: '' },
      center_id: '',
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

      if (file.type === 'application/pdf') {
        setFlyerPreview('pdf-placeholder'); // Special marker for PDF
      } else {
        setFlyerPreview(URL.createObjectURL(file));
      }
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Events</h1>
              <p className="text-sm text-gray-600">Discover and manage bowling events</p>
            </div>

            <div className="flex flex-col sm:flex-row item-start sm:items-center gap-3 w-full lg:w-auto">
              {/* View Toggle */}
              <div className="bg-gray-100 p-1 rounded-lg flex items-center overflow-x-auto max-w-full scrollbar-hide">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap shrink-0 ${viewMode === 'calendar' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('feed')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap shrink-0 ${viewMode === 'feed' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <ThumbsUp className="w-4 h-4 inline-block mr-2" />
                  All Events
                </button>
                <button
                  onClick={() => setViewMode('manage')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap shrink-0 ${viewMode === 'manage' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <User className="w-4 h-4 inline-block mr-2" />
                  My Events
                </button>
                <button
                  onClick={() => setViewMode('invitations')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap shrink-0 ${viewMode === 'invitations' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Invitations
                </button>
              </div>

              {/* Create/Action Button */}
              {user && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#8BC342] hover:bg-[#7ac85a] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors sm:w-auto w-full shrink-0"
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
            <div className="lg:col-span-2 order-2 lg:order-1">
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
                        className={`min-h-[100px] border border-gray-100 rounded-lg p-2 cursor-pointer transition-colors ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'
                          } ${day.isToday ? 'ring-2 ring-[#8BC342] ring-inset' : ''} ${selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date), 'yyyy-MM-dd') && day.isCurrentMonth
                            ? 'bg-green-50 ring-2 ring-green-300 ring-inset'
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
            <div className="space-y-6 lg:col-span-1 order-1 lg:order-2">
              {selectedDate ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 sticky top-0 bg-white z-10 py-2">
                    {format(selectedDate, 'EEEE, MMMM do')}
                  </h3>
                  <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {getSelectedDateEvents().length === 0 ? (
                      <p className="text-gray-500 text-sm">No events scheduled for this day.</p>
                    ) : (
                      getSelectedDateEvents().map(event => (
                        <div key={event.id} className="group p-3 border border-gray-100 rounded-lg hover:shadow-md transition-all bg-white">
                          <Link href={`/events/${event.id}`}>
                            <div className="flex justify-between items-start mb-1 cursor-pointer">
                              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-[#8BC342] transition-colors">{event.title}</h4>
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ml-2">
                                {event.time}
                              </span>
                            </div>
                          </Link>

                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{event.location}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                            <div className="flex items-center gap-2">
                              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                                <Image
                                  src={event.rawEvent.user.profile_picture_url || '/default-avatar.png'}
                                  alt={event.organizer}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs text-gray-600 truncate max-w-20">
                                {event.organizer}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInterestToggle(event.rawEvent.event_id, event.rawEvent.is_interested);
                              }}
                              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${event.rawEvent.is_interested
                                ? 'bg-[#8BC342] text-white hover:bg-[#7ac85a]'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                                }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${event.rawEvent.is_interested ? 'fill-current' : ''}`} />
                              <span>{event.rawEvent.is_interested ? 'Interested' : 'Interested?'} ({event.rawEvent.total_interested})</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center h-48 sticky top-24">
                  <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">Select a date to view events</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Events Feed View --- */}
        {viewMode === 'feed' && (
          <div className="space-y-6">
            {/* Search/Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-2 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search by Name */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by event name..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC342] focus:border-transparent transition-all"
                    value={filters.name}
                    onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Search by Location */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, State or Zip Code"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC342] focus:border-transparent transition-all"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                {/* Radius */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Show within</span>
                  <select
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC342] transition-all"
                    value={filters.radius}
                    onChange={(e) => setFilters(prev => ({ ...prev, radius: e.target.value }))}
                  >
                    <option value="10">10 Miles</option>
                    <option value="25">25 Miles</option>
                    <option value="50">50 Miles</option>
                    <option value="100">100 Miles</option>
                    <option value="250">250 Miles</option>
                    <option value="500">500 Miles</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#8BC342]" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No events found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <div key={event.event_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                    {/* Banner/Flyer */}
                    <div className="h-48 bg-gray-100 relative cursor-pointer" onClick={() => router.push(`/events/${event.event_id}`)}>
                      {event.flyer_url ? (
                        event.flyer_url.toLowerCase().endsWith('.pdf') ? (
                          <div className="flex flex-col items-center justify-center h-full gap-2 bg-gray-50">
                            <FileText className="w-10 h-10 text-[#8BC342]" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">PDF Flyer Attached</span>
                          </div>
                        ) : (
                          <Image
                            src={event.flyer_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Calendar className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-green-50 text-[#8BC342] text-xs font-bold px-2.5 py-1.5 rounded-lg text-center min-w-[55px] shrink-0 border border-green-100 shadow-sm transition-transform group-hover:scale-105">
                          {format(new Date(event.event_datetime), 'MMM')}<br />
                          <span className="text-xl leading-none">{format(new Date(event.event_datetime), 'dd')}</span>
                        </div>
                        <div className="flex-1 ml-4 min-w-0">
                          <Link href={`/events/${event.event_id}`}>
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-[#8BC342] transition-colors leading-tight">{event.title}</h3>
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {format(new Date(event.event_datetime), 'h:mm a')}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">
                        {event.description}
                      </p>

                      <div className="space-y-4 pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg">
                          <MapPin className="w-4 h-4 shrink-0 text-[#8BC342]" />
                          <span className="truncate">{event.location?.address_str || event.center?.address_str || 'Unknown Location'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white ring-1 ring-gray-100 bg-gray-50">
                              <Image
                                src={event.user.profile_picture_url || '/default-avatar.png'}
                                alt={event.user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{event.user.name}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInterestToggle(event.event_id, event.is_interested);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${event.is_interested
                              ? 'bg-[#8BC342] text-white shadow-green-100'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                              }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${event.is_interested ? 'fill-current' : ''}`} />
                            {event.is_interested ? 'Interested' : 'Interested?'} ({event.total_interested})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  <div key={event.event_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    {/* Banner/Flyer */}
                    <div className="h-40 bg-gray-100 relative cursor-pointer" onClick={() => router.push(`/events/${event.event_id}`)}>
                      {event.flyer_url ? (
                        event.flyer_url.toLowerCase().endsWith('.pdf') ? (
                          <div className="flex flex-col items-center justify-center h-full gap-2 bg-gray-50">
                            <FileText className="w-8 h-8 text-[#8BC342]" />
                            <span className="text-xs font-bold text-gray-500 uppercase">PDF Flyer</span>
                          </div>
                        ) : (
                          <Image
                            src={event.flyer_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Calendar className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.event_id);
                          }}
                          className="bg-white/90 backdrop-blur rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <Link href={`/events/${event.event_id}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md text-center min-w-[50px] shrink-0">
                            {format(new Date(event.event_datetime), 'MMM')}<br />
                            <span className="text-lg">{format(new Date(event.event_datetime), 'dd')}</span>
                          </div>
                          <div className="flex-1 ml-3 min-w-0">
                            <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#8BC342] transition-colors">{event.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(event.event_datetime), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      </Link>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg max-w-[70%]">
                          <MapPin className="w-3 h-3 shrink-0 text-[#8BC342]" />
                          <span className="truncate">{event.location?.address_str || event.center?.address_str || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8BC342] text-xs font-bold border border-green-100 bg-green-50 px-2.5 py-1.5 rounded-lg shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Interested: {event.total_interested}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Invitations View --- */}
        {viewMode === 'invitations' && (
          <div className="space-y-6">
            {!user ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Sign in to view invitations</h3>
                <p className="text-gray-500 mt-2">You need to be logged in to see your event invitations.</p>
              </div>
            ) : loadingInvitations ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#8BC342]" />
              </div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No invitations yet</h3>
                <p className="text-gray-500 mb-6">When you are invited to events, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invitations.map(event => (
                  <div key={event.event_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                    {/* Banner/Flyer */}
                    <div className="h-48 bg-gray-100 relative cursor-pointer" onClick={() => router.push(`/events/${event.event_id}`)}>
                      {event.flyer_url ? (
                        event.flyer_url.toLowerCase().endsWith('.pdf') ? (
                          <div className="flex flex-col items-center justify-center h-full gap-2 bg-gray-50">
                            <FileText className="w-10 h-10 text-[#8BC342]" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">PDF Flyer Attached</span>
                          </div>
                        ) : (
                          <Image
                            src={event.flyer_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Calendar className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-green-50 text-[#8BC342] text-xs font-bold px-2.5 py-1.5 rounded-lg text-center min-w-[55px] shrink-0 border border-green-100 shadow-sm transition-transform group-hover:scale-105">
                          {format(new Date(event.event_datetime), 'MMM')}<br />
                          <span className="text-xl leading-none">{format(new Date(event.event_datetime), 'dd')}</span>
                        </div>
                        <div className="flex-1 ml-4 min-w-0">
                          <Link href={`/events/${event.event_id}`}>
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-[#8BC342] transition-colors leading-tight">{event.title}</h3>
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {format(new Date(event.event_datetime), 'h:mm a')}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">
                        {event.description}
                      </p>

                      <div className="space-y-4 pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg">
                          <MapPin className="w-4 h-4 shrink-0 text-[#8BC342]" />
                          <span className="truncate">{event.location?.address_str || event.center?.address_str || 'Unknown Location'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white ring-1 ring-gray-100 bg-gray-50">
                              <Image
                                src={event.user.profile_picture_url || '/default-avatar.png'}
                                alt={event.user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{event.user.name}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInterestToggle(event.event_id, event.is_interested);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${event.is_interested
                              ? 'bg-[#8BC342] text-white shadow-green-100'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                              }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${event.is_interested ? 'fill-current' : ''}`} />
                            {event.is_interested ? 'Interested' : 'Interested?'} ({event.total_interested})
                          </button>
                        </div>
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
                    onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none"
                    placeholder="e.g. Saturday Night Tournament"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    required
                    value={createForm.event_type}
                    onChange={e => setCreateForm({ ...createForm, event_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none bg-white"
                  >
                    <option value="Podcast">Podcast</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Practice">Practice</option>
                    <option value="Charity Event">Charity Event</option>
                    <option value="Sweeper">Sweeper</option>
                    <option value="Senior Event">Senior Event</option>
                    <option value="Youth Event">Youth Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={createForm.description}
                    onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
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
                    onChange={e => setCreateForm({ ...createForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={createForm.time}
                    onChange={e => setCreateForm({ ...createForm, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>

                {/* Location Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
                  <button
                    type="button"
                    onClick={() => setLocationMode('center')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${locationMode === 'center' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                      }`}
                  >
                    <Building2 className="w-4 h-4 inline-block mr-2" />
                    Bowling Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationMode('custom')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${locationMode === 'custom' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                      }`}
                  >
                    <MapPin className="w-4 h-4 inline-block mr-2" />
                    Custom Location
                  </button>
                </div>

                {locationMode === 'center' ? (
                  <div className="relative">
                    {/* Selected Center Display / Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsCenterDropdownOpen(!isCenterDropdownOpen)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between focus:ring-2 focus:ring-[#8BC342] focus:border-transparent"
                    >
                      <span className={`block truncate ${createForm.center_id ? 'text-gray-900' : 'text-gray-500'}`}>
                        {createForm.center_id
                          ? centers.find(c => c.id.toString() === createForm.center_id.toString())?.name || 'Unknown Center'
                          : 'Select a Bowling Center...'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCenterDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isCenterDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsCenterDropdownOpen(false)}
                        />
                        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {/* Search Sticky Header */}
                          <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-10">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search centers..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC342] focus:border-transparent"
                                value={centerSearch}
                                onChange={(e) => setCenterSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Options List */}
                          {isLoadingCenters ? (
                            <div className="px-4 py-2 text-sm text-gray-500">Loading centers...</div>
                          ) : centers.filter(c => c.name.toLowerCase().includes(centerSearch.toLowerCase()) || c.address_str.toLowerCase().includes(centerSearch.toLowerCase())).length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500">No centers match your search</div>
                          ) : (
                            centers
                              .filter(c =>
                                c.name.toLowerCase().includes(centerSearch.toLowerCase()) ||
                                c.address_str.toLowerCase().includes(centerSearch.toLowerCase())
                              )
                              .map(center => (
                                <div
                                  key={center.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCreateForm({ ...createForm, center_id: center.id.toString() });
                                    setIsCenterDropdownOpen(false);
                                  }}
                                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-green-50 ${createForm.center_id === center.id.toString() ? 'bg-green-50 text-[#8BC342] font-medium' : 'text-gray-900'
                                    }`}
                                >
                                  <span className="block truncate">{center.name}</span>
                                  <span className="block truncate text-xs text-gray-500">{center.address_str}</span>
                                </div>
                              ))
                          )}
                        </div>
                      </>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Select a registered center for automatic verification and linking.</p>
                  </div>
                ) : (
                  createForm.location.address_str ? (
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
                  )
                )}
              </div>

              {/* Flyer Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Flyer (Optional)</label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${flyerPreview ? 'border-[#8BC342] bg-green-50' : 'border-gray-300 hover:border-[#8BC342]'
                    }`}
                >
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {flyerPreview ? (
                    <div className="relative w-full h-40 flex flex-col items-center justify-center">
                      {flyerPreview === 'pdf-placeholder' ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-12 h-12 text-[#8BC342]" />
                          <span className="text-sm font-medium text-gray-700">{flyerFile?.name}</span>
                          <span className="text-xs text-gray-500">PDF Document Selected</span>
                        </div>
                      ) : (
                        <Image src={flyerPreview} alt="Preview" fill className="object-contain" />
                      )}
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
