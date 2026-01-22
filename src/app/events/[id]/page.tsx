"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Share2,
  Star,
  User,
  ExternalLink,
  FileText,
  Loader2,
  Shield,
  Trophy
} from "lucide-react";

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

interface EventDetails {
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

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interestLoading, setInterestLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/events/v1/details/${id}`);
      setEvent(response.data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to load event details. It might have been removed.");
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async () => {
    if (!event || !user || interestLoading) return;

    // Optimistic UI update
    const previousState = { ...event };
    const newState = !event.is_interested;
    const newCount = newState ? event.total_interested + 1 : Math.max(0, event.total_interested - 1);

    setEvent({
      ...event,
      is_interested: newState,
      total_interested: newCount
    });
    setInterestLoading(true);

    try {
      const response = await api.get(`/api/events/v1/interest/${event.event_id}`);
      // Server returns { is_interested: boolean, total_interested: number }
      setEvent(prev => prev ? {
        ...prev,
        is_interested: response.data.is_interested,
        total_interested: response.data.total_interested
      } : null);
    } catch (err) {
      console.error("Error toggling interest:", err);
      // Revert on error
      setEvent(previousState);
      alert("Failed to update interest status.");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Check out this event: ${event?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8BC342]" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-col items-center justify-center p-4">
        <div className="text-center">
             <h2 className="text-xl font-bold text-gray-900 mb-2">Event Not Found</h2>
             <p className="text-gray-500 mb-6">{error || "This event doesn't exist anymore."}</p>
             <button 
                onClick={() => router.back()}
                className="text-[#8BC342] font-medium hover:underline flex items-center justify-center gap-2"
             >
                <ChevronLeft className="w-4 h-4" /> Go Back
             </button>
        </div>
      </div>
    );
  }

  const isPdf = event.flyer_url?.toLowerCase().endsWith('.pdf');
  const eventDate = new Date(event.event_datetime);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
             <button
                onClick={handleShare} 
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
             >
                <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Flyer / Media */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
           {event.flyer_url ? (
             isPdf ? (
               <div className="aspect-[16/9] bg-gray-100 flex flex-col items-center justify-center gap-4 py-12">
                   <FileText className="w-16 h-16 text-gray-400" />
                   <div className="text-center">
                      <p className="text-gray-900 font-medium mb-2">Event Flyer (PDF)</p>
                      <a 
                        href={event.flyer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                         <ExternalLink className="w-4 h-4" />
                         View Details
                      </a>
                   </div>
               </div>
             ) : (
               <div className="relative aspect-[16/9] md:aspect-[21/9] bg-gray-100">
                  <Image 
                     src={event.flyer_url}
                     alt={event.title}
                     fill
                     className="object-cover"
                     priority
                  />
               </div>
             )
           ) : (
             <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 flex flex-col items-center justify-center">
                 <Calendar className="w-16 h-16 text-gray-300 mb-2" />
                 <p className="text-gray-400">No event flyer available</p>
             </div>
           )}
        </div>

        {/* Status / Title Block */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Interested Button */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
               <div className="flex-1">
                   <div className="flex items-center gap-3 text-sm text-[#8BC342] font-semibold tracking-wide uppercase mb-3">
                       <span>{format(eventDate, 'EEEE, MMMM do')}</span>
                       <span className="w-1 h-1 bg-[#8BC342] rounded-full"></span>
                       <span>{format(eventDate, 'h:mm a')}</span>
                   </div>
                   
                   <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                   
                   <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3 text-gray-600">
                         <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                         <div>
                            <p className="font-medium text-gray-900">{event.location.address_str}</p>
                            <p className="text-sm text-gray-500">
                               Lat: {event.location.lat}, Long: {event.location.long}
                            </p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                         <div className="w-5 flex justify-center shrink-0">
                           <User className="w-4 h-4 text-gray-400" />
                         </div>
                         <div className="flex items-center gap-2">
                             <span>Hosted by</span>
                             <Link href={`/profile/${event.user.username}`} className="font-medium text-gray-900 hover:text-[#8BC342]">
                                {event.user.name}
                             </Link>
                             {event.user.roles.is_pro && <Shield className="w-4 h-4 text-blue-500 fill-blue-500" />}
                         </div>
                      </div>
                   </div>
               </div>

               <div className="flex flex-col gap-3 md:w-48 shrink-0">
                  <button 
                    onClick={handleInterest}
                    disabled={!user || interestLoading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold transition-all ${
                       event.is_interested 
                         ? 'bg-[#8BC342] text-white shadow-lg shadow-green-200' 
                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                     <Star className={`w-5 h-5 ${event.is_interested ? 'fill-white' : ''}`} />
                     {event.is_interested ? 'Interested' : 'Interested?'}
                  </button>
                  <p className="text-center text-sm text-gray-500">
                     {event.total_interested} people interested
                  </p>
               </div>
            </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-4">About this Event</h3>
           <div className="prose prose-green max-w-none text-gray-600 whitespace-pre-wrap">
              {event.description}
           </div>
        </div>

        {/* Organizer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-4">Organizer</h3>
           <div className="flex items-center gap-4">
              <Link href={`/profile/${event.user.username}`}>
                 <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                     <Image 
                        src={event.user.profile_picture_url}
                        alt={event.user.name}
                        fill
                        className="object-cover"
                     />
                 </div>
              </Link>
              <div>
                 <Link href={`/profile/${event.user.username}`}>
                    <h4 className="font-bold text-gray-900 hover:underline">{event.user.name}</h4>
                 </Link>
                 <p className="text-sm text-gray-500">@{event.user.username}</p>
                 <div className="flex items-center gap-2 mt-1">
                    {event.user.roles.is_pro && (
                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                          <Trophy className="w-3 h-3" /> Pro Player
                       </span>
                    )}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
