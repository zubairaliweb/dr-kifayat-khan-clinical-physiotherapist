import React from 'react';
import { 
  Activity, 
  Award, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  MessageSquare,
  Stethoscope,
  Sparkles,
  Linkedin
} from 'lucide-react';

import { ClinicProfile } from '../types';

interface HeroProps {
  profile?: ClinicProfile;
  onOpenAppointment: () => void;
  onExploreServices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenAppointment, onExploreServices }) => {
  const handleExplore = () => {
    if (onExploreServices) {
      onExploreServices();
    } else {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const phone = profile?.phone || "03138161676";
  const clinicAddress = profile?.clinicAddress || "Room 607, 6th Floor, Mall of Islamabad, Blue Area";
  const whatsappUrl = profile?.socialLinks?.whatsapp || `https://wa.me/923138161676?text=${encodeURIComponent("Hello Dr. Kifayat Khan, I would like to book a physiotherapy appointment at Mall of Islamabad.")}`;
  const linkedinUrl = profile?.socialLinks?.linkedin || "https://www.linkedin.com/in/dr-kifayat-khan-670672156/";
  return (
    <section
      id="home"
      className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 dark:from-slate-950 via-slate-100 dark:via-slate-900 to-slate-50 dark:to-slate-950 text-white"
    >
      {/* Background glowing gradients & medical grid pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Bio, CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>Available for Clinical Consultations in Islamabad</span>
            </div>

            {/* Doctor Name & Titles */}
            <div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide uppercase">
                <span>Clinical Physiotherapist</span>
                <span>•</span>
                <span>Sports Physical Therapist</span>
                <span>•</span>
                <span>HOD</span>
              </div>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Dedicated to Better <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Movement</span>, Health, and Recovery
              </h1>
            </div>

            {/* Professional Statement & Description */}
            <p className="text-lg text-slate-700 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
              "Four years of physiotherapy experience dedicated to helping people improve their health, mobility, and quality of life."
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Providing modern, evidence-based orthopedic rehabilitation, spinal manual therapy, sports injury recovery, and kinetic retraining at <strong className="text-slate-800 dark:text-slate-200">Mall of Islamabad, Blue Area</strong>.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {/* Primary: Book Appointment */}
              <button
                onClick={onOpenAppointment}
                id="hero-book-btn"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-cyan-900/30 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Secondary: Explore Services */}
              <button
                onClick={handleExplore}
                id="hero-explore-btn"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-800 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300/80 hover:dark:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition-all hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <span>Explore Services</span>
              </button>

              {/* Direct WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5"
                title={`Direct WhatsApp: ${phone}`}
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>

              {/* LinkedIn Professional Profile */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-linkedin-btn"
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm text-white bg-sky-700 hover:bg-sky-600 shadow-md shadow-sky-950/40 transition-all transform hover:-translate-y-0.5"
                title="Connect with Dr. Kifayat Khan on LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-slate-900 dark:text-white" />
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Trust highlights checklist */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>DPT (Doctor of Physical Therapy)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sports Injury Specialist</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Modern Mall of Islamabad Clinic</span>
              </div>
            </div>

          </div>

          {/* Right Column: Doctor's Professional Profile Photo & Floating Badges */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-md">
              
              {/* Backing decorative frames */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 rounded-3xl blur-md opacity-40 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300/80 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-900 shadow-2xl">
                {/* Doctor's Photo */}
                <img
                  src="/images/dr_kifayat_hero.jpg"
                  alt="Dr. Kifayat Khan - Clinical Physiotherapist in Islamabad"
                  className="w-full h-[440px] sm:h-[480px] object-cover object-top hover:scale-102 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to high quality medical photo if not yet copied
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop";
                  }}
                />

                {/* Gradient vignette over photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Overlay Name & Clinic Location */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Dr. Kifayat Khan</span>
                        <Award className="w-4 h-4 text-cyan-400" />
                      </h3>
                      <p className="text-xs text-cyan-300 font-medium">Clinical Physiotherapist & Sports Specialist</p>
                    </div>
                    <div className="text-right flex items-center gap-1.5">
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950/90 border border-sky-500/50 text-[11px] font-semibold text-sky-300 hover:text-white hover:bg-sky-900 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-3 h-3 text-sky-400" />
                        <span>LinkedIn</span>
                      </a>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-[11px] font-semibold text-blue-200">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        Islamabad
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
                      {clinicAddress.split(',')[0]}
                    </span>
                    <a 
                      href={`tel:${phone}`}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Floating Stat Pill: 4 Years Experience */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-slate-900 dark:text-white leading-tight">4+ Years</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Physiotherapy Career</span>
                </div>
              </div>

              {/* Floating Stat Pill: Patient Care */}
              <div className="absolute top-1/2 -right-4 sm:-right-6 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-500/40 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">1,500+</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Patients Rehabilitated</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
