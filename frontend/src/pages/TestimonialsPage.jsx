import React, { useState } from 'react';
import { Star, Quote, Filter, Search, Award, Globe, Building } from 'lucide-react';

const TestimonialsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      position: "Software Engineer",
      company: "TechCorp Dubai",
      country: "UAE",
      testimonial: "Uddaan Consultancy helped me secure a fantastic job in Dubai. Their guidance throughout the process was exceptional. The team was professional, responsive, and made everything so smooth. I'm now earning 3x more than I was in Nepal!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: true,
      order: 1,
      jobType: "IT",
      salary: "$5000/month"
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "Marketing Manager",
      company: "Global Retail Qatar",
      country: "Qatar",
      testimonial: "I was skeptical about working abroad, but Uddaan made it possible. They helped me with everything from CV preparation to visa processing. The job I got is perfect for my career growth. Highly recommended!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: true,
      order: 2,
      jobType: "Marketing",
      salary: "$4500/month"
    },
    {
      id: 3,
      name: "Amit Patel",
      position: "Accountant",
      company: "Finance Solutions Saudi",
      country: "Saudi Arabia",
      testimonial: "The team at Uddaan is incredibly professional. They guided me through every step of the process and helped me understand what to expect. Now I'm working in Riyadh with great benefits and career opportunities.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: false,
      order: 3,
      jobType: "Finance",
      salary: "$4000/month"
    },
    {
      id: 4,
      name: "Sita Devi",
      position: "Nurse",
      company: "Medical Center Kuwait",
      country: "Kuwait",
      testimonial: "As a healthcare professional, I was looking for opportunities abroad. Uddaan helped me find the perfect position in Kuwait. The salary is excellent and the working conditions are great. Thank you team!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: false,
      order: 4,
      jobType: "Healthcare",
      salary: "$3500/month"
    },
    {
      id: 5,
      name: "Bikash Thapa",
      position: "Construction Supervisor",
      company: "BuildCorp Oman",
      country: "Oman",
      testimonial: "Uddaan Consultancy is the real deal! They helped me get a job in Oman's construction sector. The process was transparent and they kept me informed at every step. Great experience overall.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: false,
      order: 5,
      jobType: "Construction",
      salary: "$3000/month"
    },
    {
      id: 6,
      name: "Lakshmi Gurung",
      position: "Hotel Manager",
      company: "Luxury Hotels Bahrain",
      country: "Bahrain",
      testimonial: "I'm so grateful to Uddaan for helping me secure a management position in Bahrain's hospitality sector. The team was supportive throughout and the job exceeded my expectations.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: false,
      order: 6,
      jobType: "Hospitality",
      salary: "$4200/month"
    },
    {
      id: 7,
      name: "Deepak Singh",
      position: "Sales Executive",
      company: "Tech Solutions UAE",
      country: "UAE",
      testimonial: "Uddaan helped me transition from a local sales job to an international position. The salary improvement is significant and the career growth opportunities are amazing. Highly recommend!",
      rating: 4,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: false,
      order: 7,
      jobType: "Sales",
      salary: "$3800/month"
    },
    {
      id: 8,
      name: "Anita Tamang",
      position: "Teacher",
      company: "International School Qatar",
      country: "Qatar",
      testimonial: "Teaching abroad was my dream and Uddaan made it come true. The school is excellent and the benefits are great. The team was very helpful with all the documentation process.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      isActive: true,
      featured: false,
      order: 8,
      jobType: "Education",
      salary: "$3500/month"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Testimonials' },
    { id: 'IT', label: 'IT Sector' },
    { id: 'Marketing', label: 'Marketing' },
    { id: 'Finance', label: 'Finance' },
    { id: 'Healthcare', label: 'Healthcare' },
    { id: 'Construction', label: 'Construction' },
    { id: 'Hospitality', label: 'Hospitality' },
    { id: 'Sales', label: 'Sales' },
    { id: 'Education', label: 'Education' }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesFilter = selectedFilter === 'all' || testimonial.jobType === selectedFilter;
    const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredTestimonials = testimonials.filter(testimonial => testimonial.featured);

  const stats = [
    { number: "500+", label: "Successful Placements" },
    { number: "15+", label: "Countries" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "4.9", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="hero-premium py-20 text-white relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Client Testimonials
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Real stories from professionals who achieved their international dreams
          </p>
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <p className="text-lg">
                "Hear from our successful clients about their journey to global opportunities"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-bounce-gentle">
                <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">{stat.number}</div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 gradient-text">Featured Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Inspiring stories from our most successful placements
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card-premium group">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-200 transition-colors duration-300"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="badge badge-primary">{testimonial.jobType}</span>
                        <span className="badge badge-success">{testimonial.salary}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1 text-gray-800">{testimonial.name}</h3>
                      <p className="text-gray-600 mb-2">{testimonial.position} at {testimonial.company}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-500">{testimonial.country}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-200" />
                        <p className="text-gray-700 italic pl-6">{testimonial.testimonial}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">All Testimonials</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through all our client success stories
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
                  placeholder="Search testimonials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card-premium group">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-200 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="badge badge-primary">{testimonial.jobType}</span>
                      <span className="badge badge-success">{testimonial.salary}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{testimonial.position}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-500">{testimonial.company}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-500">{testimonial.country}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-5 h-5 text-blue-200" />
                      <p className="text-sm text-gray-700 italic pl-4 line-clamp-4">{testimonial.testimonial}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Quote className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No testimonials found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Success Stories?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey towards international career success today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-premium">
              Browse Job Opportunities
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300">
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage; 