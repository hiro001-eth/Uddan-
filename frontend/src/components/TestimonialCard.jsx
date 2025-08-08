import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
      {/* Quote Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
          <Quote className="w-6 h-6 text-primary-600" />
        </div>
      </div>

      {/* Testimonial Text */}
      <div className="text-center mb-6">
        <p className="text-gray-700 text-lg leading-relaxed italic">
          "{testimonial.testimonial}"
        </p>
      </div>

      {/* Rating */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-1">
          {renderStars(testimonial.rating)}
        </div>
      </div>

      {/* Author Info */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-600">{testimonial.position}</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p className="font-medium">{testimonial.company}</p>
          <p>{testimonial.country}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 