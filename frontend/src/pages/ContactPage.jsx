import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+977-1-4444444", "+977-985-1234567"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@uddaanconsultancy.com", "support@uddaanconsultancy.com"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: ["Birtamod, Jhapa", "Nepal"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Sunday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="hero-premium py-20 text-white relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Get in touch with our expert team for personalized guidance
          </p>
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <p className="text-lg">
                "Your success is our priority - Let's discuss your international career goals"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you achieve your international career dreams. 
              Reach out to us through any of these channels.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="testimonial-card-premium text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 mb-2">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold mb-8 gradient-text">Send Us a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label-premium">Full Name *</label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="form-input-premium"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label-premium">Phone Number *</label>
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9+\-\s()]+$/,
                          message: 'Please enter a valid phone number'
                        }
                      })}
                      className="form-input-premium"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="form-label-premium">Email Address *</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="form-input-premium"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label-premium">Subject *</label>
                  <select
                    {...register('subject', { required: 'Subject is required' })}
                    className="form-input-premium"
                  >
                    <option value="">Select a subject</option>
                    <option value="job-inquiry">Job Inquiry</option>
                    <option value="consultation">Career Consultation</option>
                    <option value="visa-support">Visa Support</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label-premium">Message *</label>
                  <textarea
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      }
                    })}
                    rows={5}
                    className="form-input-premium"
                    placeholder="Tell us about your inquiry or career goals..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium w-full flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Visit Our Office</h3>
                
                {/* Map Placeholder */}
                <div className="bg-gray-200 rounded-xl h-64 mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">Birtamod, Jhapa, Nepal</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Free Consultation</h4>
                      <p className="text-sm text-gray-600">Get expert advice on your career path</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Quick Response</h4>
                      <p className="text-sm text-gray-600">We respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Secure Process</h4>
                      <p className="text-sm text-gray-600">Your information is safe with us</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our services and processes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="testimonial-card-premium">
              <h3 className="text-xl font-bold mb-4 text-gray-800">How long does the process take?</h3>
              <p className="text-gray-600">
                The timeline varies depending on the job type and country. Typically, 
                the entire process takes 2-6 months from application to placement.
              </p>
            </div>
            
            <div className="testimonial-card-premium">
              <h3 className="text-xl font-bold mb-4 text-gray-800">What documents do I need?</h3>
              <p className="text-gray-600">
                You'll need your passport, educational certificates, experience letters, 
                and other relevant documents. We'll guide you through the complete list.
              </p>
            </div>
            
            <div className="testimonial-card-premium">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Is there a consultation fee?</h3>
              <p className="text-gray-600">
                Initial consultation is completely free. We only charge fees when we 
                successfully place you in a job opportunity.
              </p>
            </div>
            
            <div className="testimonial-card-premium">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Which countries do you work with?</h3>
              <p className="text-gray-600">
                We have partnerships with companies in Gulf countries, Europe, 
                Australia, and other international destinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us today and take the first step towards your international career
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-premium" onClick={() => navigate('/consultation')}>
              Schedule Consultation
            </button>
            <button className="bg-white/20 hover:bg-white/25 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300" onClick={() => navigate('/jobs')}>
              Browse Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 