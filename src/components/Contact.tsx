import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Calendar,
  Building,
  Navigation,
  Linkedin,
  Facebook,
  Video
} from 'lucide-react';
import { ClinicProfile } from '../types';

interface ContactProps {
  profile: ClinicProfile;
  prefilledService?: string;
}

export const Contact: React.FC<ContactProps> = ({ profile, prefilledService }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(prefilledService ? `Consultation for ${prefilledService}` : '');
  const [preferredDate, setPreferredDate] = useState('');
  const [service, setService] = useState(prefilledService || 'Clinical Physiotherapy');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (prefilledService) {
      setService(prefilledService);
      setSubject(`Consultation for ${prefilledService}`);
    }
  }, [prefilledService]);

  const servicesList = [
    "Clinical Physiotherapy",
    "Sports Injury Rehabilitation",
    "Neurological Rehabilitation",
    "Manual Therapy",
    "Exercise Prescription",
    "Injury Prevention",
    "Treatment Planning",
    "Fitness Training",
    "Pilates Training",
    "Physical Therapy and Rehabilitation",
    "Patient Education",
    "General Initial Assessment"
  ];

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = "Please enter your full name";
    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (phone.trim().length < 8) {
      errs.phone = "Please enter a valid phone number";
    }
    if (!message.trim()) errs.message = "Please describe your symptoms or inquiry";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          subject: subject || `Consultation: ${service}`,
          service,
          preferredDate,
          message
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try again or WhatsApp us.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please contact Dr. Khan directly on WhatsApp.');
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setPreferredDate('');
    setMessage('');
    setStatus('idle');
    setValidationErrors({});
  };

  return (
    <section id="contact" className="py-24 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultation & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Schedule Your Visit or Inquire
          </h2>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
            Book an in-clinic evaluation with Dr. Kifayat Khan at Mall of Islamabad or send your medical questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Clinic Coordinates, Direct WhatsApp, Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Callout Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-100 dark:via-slate-900 to-slate-100 dark:to-slate-900 border border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant WhatsApp Booking</h3>
                  <p className="text-xs text-emerald-300 font-medium">Fastest response for appointments</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Need quick advice, emergency pain assessment, or want to confirm clinic availability today? Message Dr. Kifayat Khan directly.
              </p>
              <a
                href="https://wa.me/923138161676?text=Hello%20Dr.%20Kifayat%20Khan,%20I%20would%20like%20to%20inquire%20about%20a%20physiotherapy%20consultation%20at%20Mall%20of%20Islamabad."
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp-direct"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat Directly: 03138161676</span>
              </a>
            </div>

            {/* Clinic Details Card */}
            <div className="p-6 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Mall of Islamabad Clinic</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-semibold">Address:</strong>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      Room #607, 6th Floor, Mall of Islamabad, Jinnah Ave, Block J, Blue Area, Area F 7/1, Islamabad, 44210, Pakistan.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-semibold">Phone:</strong>
                    <a href="tel:03138161676" className="text-cyan-400 hover:text-cyan-300 font-medium">
                      03138161676
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-semibold">Email:</strong>
                    <a href={`mailto:${profile.email}`} className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white">
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-semibold">Clinical Timings:</strong>
                    <span className="text-slate-700 dark:text-slate-300">{profile.timings}</span>
                  </div>
                </div>

              </div>

              {/* Google Maps Direction CTA */}
              <div className="pt-2">
                <a
                  href={profile.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-maps-link"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-300/80 hover:dark:bg-slate-700/80 text-cyan-300 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open in Google Maps</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

            {/* Visual Location Preview Frame */}
            <div className="rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-700/80 shadow-lg relative bg-slate-50 dark:bg-slate-950">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <span>Mall of Islamabad, Blue Area Location</span>
                <span className="text-cyan-400">Islamabad, PK</span>
              </div>
              <div className="h-44 w-full relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Room #607, 6th Floor, Mall of Islamabad
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Jinnah Avenue, Block J, Blue Area, F-7/1
                  </p>
                  <a
                    href={profile.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline font-bold pt-1"
                  >
                    View Official Clinic Pin on Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Professional Profiles & Social Media Card */}
            <div className="p-6 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 space-y-3.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-sky-400" />
                <span>Professional Profiles & Social Media</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect directly with Dr. Kifayat Khan on verified professional networks and medical education channels:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* LinkedIn */}
                <a
                  href={profile?.socialLinks?.linkedin || "https://www.linkedin.com/in/dr-kifayat-khan-670672156/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-social-linkedin"
                  className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-700/80 hover:border-sky-500 hover:bg-sky-950/40 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">LinkedIn Profile</div>
                    <div className="text-[11px] text-sky-400 truncate">Dr. Kifayat Khan</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500 group-hover:text-slate-700 group-hover:dark:text-slate-300 shrink-0" />
                </a>

                {/* WhatsApp */}
                <a
                  href={profile?.socialLinks?.whatsapp || "https://wa.me/923138161676"}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-social-whatsapp"
                  className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-700/80 hover:border-emerald-500 hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                    <MessageSquare className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">WhatsApp</div>
                    <div className="text-[11px] text-emerald-400 truncate">03138161676</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500 group-hover:text-slate-700 group-hover:dark:text-slate-300 shrink-0" />
                </a>

                {/* Facebook */}
                <a
                  href={profile?.socialLinks?.facebook || "https://www.facebook.com/share/1QHUMWEYrL/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-social-facebook"
                  className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-700/80 hover:border-blue-500 hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">Facebook</div>
                    <div className="text-[11px] text-blue-400 truncate">Clinical Updates</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500 group-hover:text-slate-700 group-hover:dark:text-slate-300 shrink-0" />
                </a>

                {/* TikTok */}
                <a
                  href={profile?.socialLinks?.tiktok || "https://www.tiktok.com/@drkaifpt"}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-social-tiktok"
                  className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-700/80 hover:border-pink-500 hover:bg-pink-950/40 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-colors shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">TikTok</div>
                    <div className="text-[11px] text-pink-400 truncate">@drkaifpt</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500 group-hover:text-slate-700 group-hover:dark:text-slate-300 shrink-0" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Consultation & Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 shadow-2xl relative">
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Send Consultation Request
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Fill out your details below. Dr. Kifayat Khan or our clinical coordinator will contact you promptly.
              </p>

              {status === 'success' ? (
                <div className="p-8 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Inquiry Received Successfully!</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. Your consultation request for <strong className="text-cyan-300">{service}</strong> has been logged in Dr. Kifayat Khan's clinic system. We will contact you at <strong className="text-slate-900 dark:text-white">{phone}</strong>.
                  </p>
                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/923138161676?text=Hello%20Dr.%20Kifayat%20Khan,%20I%20just%20submitted%20a%20consultation%20form%20for%20${encodeURIComponent(fullName)}%20(${encodeURIComponent(phone)})%20for%20${encodeURIComponent(service)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Confirm Faster on WhatsApp</span>
                    </a>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (validationErrors.fullName) setValidationErrors({ ...validationErrors, fullName: '' });
                        }}
                        placeholder="e.g. Tariq Mehmood"
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                          validationErrors.fullName ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                      {validationErrors.fullName && (
                        <p className="mt-1 text-[11px] text-rose-400">{validationErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: '' });
                        }}
                        placeholder="0313 1234567"
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                          validationErrors.phone ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                      {validationErrors.phone && (
                        <p className="mt-1 text-[11px] text-rose-400">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Email & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Service / Condition
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      >
                        {servicesList.map((s, idx) => (
                          <option key={idx} value={s} className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject & Preferred Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Back pain evaluation"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Symptoms, Injury Details or Message <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (validationErrors.message) setValidationErrors({ ...validationErrors, message: '' });
                      }}
                      placeholder="Please describe how long you have had pain, what movements aggravate it, or any previous surgeries/treatments..."
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-y ${
                        validationErrors.message ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                    {validationErrors.message && (
                      <p className="mt-1 text-[11px] text-rose-400">{validationErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      id="contact-submit-btn"
                      className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {status === 'submitting' ? (
                        <span>Processing Inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Consultation Request</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
