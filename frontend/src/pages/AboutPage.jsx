import React from 'react';
import { Users, Globe, Award, Shield, Heart, Target, Zap, Star } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Opportunities",
      description: "Access to job opportunities in Gulf countries, Europe, and worldwide destinations."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert Guidance",
      description: "Professional consultation for visa processes, documentation, and career planning."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Process",
      description: "Safe and reliable job placement with verified employers and legitimate opportunities."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personal Support",
      description: "Dedicated support team to assist you throughout your journey."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Career Growth",
      description: "Opportunities for skill development and career advancement."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Processing",
      description: "Quick application processing and timely updates on your application status."
    }
  ];

  const stats = [
    { number: "500+", label: "Successful Placements" },
    { number: "50+", label: "Partner Companies" },
    { number: "15+", label: "Countries" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="hero-premium py-20 text-white relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            About Uddaan Consultancy
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Your trusted partner in transforming dreams into global opportunities
          </p>
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <p className="text-lg">
                "Empowering Nepali professionals to achieve their international career goals"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-6 gradient-text">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                To bridge the gap between talented Nepali professionals and global opportunities, 
                providing comprehensive support for international career development and job placement.
              </p>
              <p className="text-lg text-gray-700">
                We believe every individual deserves the chance to pursue their dreams on a global stage, 
                and we're committed to making that journey smooth, secure, and successful.
              </p>
            </div>
            <div className="animate-slide-up">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">Our Vision</h3>
                <p className="text-gray-700 mb-4">
                  To become the leading consultancy in Nepal, recognized for excellence in international 
                  job placement and career guidance.
                </p>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Excellence in Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Why Choose Uddaan Consultancy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive support to help you achieve your international dreams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="testimonial-card-premium text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Success Story</h2>
            <p className="text-xl opacity-90">
              Numbers that speak for our commitment and success
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-bounce-gentle">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to your success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial-card-premium text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                U
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Consultants</h3>
              <p className="text-gray-600 mb-4">
                Experienced professionals with deep knowledge of international job markets
              </p>
              <div className="flex justify-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
            </div>
            
            <div className="testimonial-card-premium text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                S
              </div>
              <h3 className="text-xl font-bold mb-2">Support Team</h3>
              <p className="text-gray-600 mb-4">
                Dedicated support staff to assist you throughout your journey
              </p>
              <div className="flex justify-center space-x-2">
                <Heart className="w-5 h-5 text-red-400 fill-current" />
                <span className="text-sm text-gray-600">24/7 Support</span>
              </div>
            </div>
            
            <div className="testimonial-card-premium text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                P
              </div>
              <h3 className="text-xl font-bold mb-2">Process Experts</h3>
              <p className="text-gray-600 mb-4">
                Specialists in visa processes and documentation requirements
              </p>
              <div className="flex justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-600">Secure Process</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful professionals who have achieved their international dreams
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

export default AboutPage; 