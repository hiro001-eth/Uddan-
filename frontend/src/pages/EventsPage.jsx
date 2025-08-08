import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ExternalLink, Filter, Search } from 'lucide-react';

const EventsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    {
      id: 1,
      title: "Career Fair 2024 - Gulf Opportunities",
      description: "Join us for the biggest career fair featuring top employers from UAE, Saudi Arabia, and Qatar. Meet hiring managers directly and explore exciting job opportunities.",
      shortDescription: "Biggest career fair with Gulf employers",
      eventType: "career-fair",
      startDate: "2024-02-15",
      endDate: "2024-02-15",
      time: "10:00 AM - 6:00 PM",
      location: "Hotel Yak & Yeti, Kathmandu",
      online: false,
      meetingLink: null,
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
      isActive: true,
      featured: true,
      registrationRequired: true,
      maxParticipants: 500,
      currentParticipants: 320,
      price: "Free"
    },
    {
      id: 2,
      title: "Visa Process Workshop",
      description: "Learn everything about visa application processes for different countries. Expert guidance on documentation, requirements, and common mistakes to avoid.",
      shortDescription: "Expert guidance on visa processes",
      eventType: "workshop",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      time: "2:00 PM - 5:00 PM",
      location: "Uddaan Consultancy Office",
      online: false,
      meetingLink: null,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
      isActive: true,
      featured: false,
      registrationRequired: true,
      maxParticipants: 50,
      currentParticipants: 35,
      price: "Rs. 1000"
    },
    {
      id: 3,
      title: "Online: Interview Preparation Masterclass",
      description: "Master the art of job interviews with our comprehensive online masterclass. Learn techniques, practice with mock interviews, and boost your confidence.",
      shortDescription: "Master job interview techniques online",
      eventType: "masterclass",
      startDate: "2024-02-25",
      endDate: "2024-02-25",
      time: "7:00 PM - 9:00 PM",
      location: "Online",
      online: true,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      isActive: true,
      featured: true,
      registrationRequired: true,
      maxParticipants: 100,
      currentParticipants: 78,
      price: "Rs. 500"
    },
    {
      id: 4,
      title: "Success Stories: From Nepal to Global Careers",
      description: "Hear inspiring stories from professionals who successfully built international careers. Real experiences, challenges, and tips for your journey.",
      shortDescription: "Inspiring success stories from professionals",
      eventType: "seminar",
      startDate: "2024-03-05",
      endDate: "2024-03-05",
      time: "4:00 PM - 6:00 PM",
      location: "Nepal Tourism Board Hall",
      online: false,
      meetingLink: null,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      isActive: true,
      featured: false,
      registrationRequired: false,
      maxParticipants: 200,
      currentParticipants: 0,
      price: "Free"
    },
    {
      id: 5,
      title: "Documentation & CV Writing Workshop",
      description: "Learn to create professional CVs and prepare all necessary documents for international job applications. Expert tips and templates provided.",
      shortDescription: "Professional CV and document preparation",
      eventType: "workshop",
      startDate: "2024-03-10",
      endDate: "2024-03-10",
      time: "10:00 AM - 1:00 PM",
      location: "Uddaan Consultancy Office",
      online: false,
      meetingLink: null,
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
      isActive: true,
      featured: false,
      registrationRequired: true,
      maxParticipants: 30,
      currentParticipants: 22,
      price: "Rs. 1500"
    },
    {
      id: 6,
      title: "Monthly Job Market Update",
      description: "Stay updated with the latest job market trends, salary information, and emerging opportunities in different countries and industries.",
      shortDescription: "Latest job market trends and opportunities",
      eventType: "webinar",
      startDate: "2024-03-15",
      endDate: "2024-03-15",
      time: "6:00 PM - 7:30 PM",
      location: "Online",
      online: true,
      meetingLink: "https://zoom.us/j/123456789",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      isActive: true,
      featured: false,
      registrationRequired: true,
      maxParticipants: 150,
      currentParticipants: 95,
      price: "Free"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'career-fair', label: 'Career Fairs' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'masterclass', label: 'Masterclasses' },
    { id: 'seminar', label: 'Seminars' },
    { id: 'webinar', label: 'Webinars' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesFilter = selectedFilter === 'all' || event.eventType === selectedFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredEvents = events.filter(event => event.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="hero-premium py-20 text-white relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Events & News
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Stay updated with our latest events, workshops, and career opportunities
          </p>
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <p className="text-lg">
                "Join our events to accelerate your international career journey"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 gradient-text">Featured Events</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't miss these upcoming highlights
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <div key={event.id} className="job-card-premium group">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="badge badge-primary">{event.eventType.replace('-', ' ').toUpperCase()}</span>
                      <span className="badge badge-success">{event.price}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.shortDescription}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{event.currentParticipants}/{event.maxParticipants} registered</span>
                      </div>
                    </div>
                    
                    <button className="btn-premium w-full">
                      {event.registrationRequired ? 'Register Now' : 'Learn More'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">All Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through all our upcoming events and workshops
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="job-card-premium group">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.online && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Online
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="badge badge-primary">{event.eventType.replace('-', ' ').toUpperCase()}</span>
                    <span className="badge badge-success">{event.price}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.shortDescription}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{event.currentParticipants}/{event.maxParticipants} registered</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="btn-premium flex-1">
                      {event.registrationRequired ? 'Register Now' : 'Learn More'}
                    </button>
                    {event.online && event.meetingLink && (
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all duration-300">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest events and opportunities
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-xl border-0 focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-r-xl hover:bg-gray-100 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage; 