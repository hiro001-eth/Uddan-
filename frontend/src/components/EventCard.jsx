import React from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

const EventCard = ({ event }) => {
  const getEventTypeBadge = (eventType) => {
    const badges = {
      workshop: 'bg-blue-100 text-blue-800',
      seminar: 'bg-green-100 text-green-800',
      webinar: 'bg-purple-100 text-purple-800',
      conference: 'bg-orange-100 text-orange-800',
      news: 'bg-gray-100 text-gray-800',
      announcement: 'bg-red-100 text-red-800'
    };
    return badges[eventType] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeLabel = (eventType) => {
    const labels = {
      workshop: 'Workshop',
      seminar: 'Seminar',
      webinar: 'Webinar',
      conference: 'Conference',
      news: 'News',
      announcement: 'Announcement'
    };
    return labels[eventType] || eventType;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUpcoming = new Date(event.startDate) > new Date();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Image */}
      {event.image && (
        <div className="h-48 bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`badge ${getEventTypeBadge(event.eventType)} text-xs px-3 py-1`}>
              {getEventTypeLabel(event.eventType)}
            </span>
          </div>
          {isUpcoming && (
            <div className="absolute top-4 left-4">
              <span className="badge bg-green-100 text-green-800 text-xs px-3 py-1">
                Upcoming
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.shortDescription}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.startDate)}</span>
            {event.startDate !== event.endDate && (
              <span> - {formatDate(event.endDate)}</span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(event.startDate)}</span>
          </div>

          {event.location && !event.online && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}

          {event.online && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <ExternalLink className="w-4 h-4" />
              <span>Online Event</span>
            </div>
          )}

          {event.registrationRequired && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {event.currentParticipants}/{event.maxParticipants} registered
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
            {event.registrationRequired ? 'Register Now' : 'Learn More'}
          </button>
          
          {event.meetingLink && (
            <button className="px-4 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200">
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 