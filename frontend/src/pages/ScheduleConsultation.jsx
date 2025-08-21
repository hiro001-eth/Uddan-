import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Phone, Mail, Send } from 'lucide-react';

const ScheduleConsultation = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const csrfRes = await fetch(`/api/auth/csrf`, { credentials: 'include' });
      const { data: csrfData } = await csrfRes.json();
      const res = await fetch(`/api/consultations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          [csrfData?.headerName || 'x-csrf-token']: csrfData?.csrfToken || ''
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredDate: new Date(data.date).toISOString(),
          preferredTime: data.time,
          status: 'pending'
        })
      });
      if (!res.ok) throw new Error('Failed to book');
      toast.success('Consultation booked! We will confirm via email.');
      reset();
    } catch {
      toast.error('Failed to book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-premium py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#3452d6be' }}>Schedule a 1:1 Consultation</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto" style={{ color: '#3452d6be' }}>Get personalized guidance for your overseas job journey.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="form-premium">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Book Your Session</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label-premium flex items-center gap-2"><User className="w-4 h-4"/> Full Name *</label>
                  <input className="form-input-premium" {...register('name', { required: 'Required' })} placeholder="Your full name" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="form-label-premium flex items-center gap-2"><Phone className="w-4 h-4"/> Phone *</label>
                  <input className="form-input-premium" {...register('phone', { required: 'Required' })} placeholder="Your phone number" />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label-premium flex items-center gap-2"><Mail className="w-4 h-4"/> Email *</label>
                  <input className="form-input-premium" {...register('email', { required: 'Required' })} placeholder="you@example.com" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="form-label-premium flex items-center gap-2"><Calendar className="w-4 h-4"/> Preferred Date *</label>
                  <input type="date" className="form-input-premium" {...register('date', { required: 'Required' })} />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>
              </div>
              <div>
                <label className="form-label-premium flex items-center gap-2"><Clock className="w-4 h-4"/> Preferred Time *</label>
                <select className="form-input-premium" {...register('time', { required: 'Required' })}>
                  <option value="">Select time</option>
                  <option>09:00 - 10:00</option>
                  <option>11:00 - 12:00</option>
                  <option>13:00 - 14:00</option>
                  <option>15:00 - 16:00</option>
                  <option>17:00 - 18:00</option>
                </select>
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-premium w-full flex items-center justify-center gap-2">
                {isSubmitting ? 'Booking...' : (<><Send className="w-4 h-4"/> Book Consultation</>)}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScheduleConsultation; 