import React from 'react';
import { 
  Award, 
  Phone, 
  Heart, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Target,
  Building,
  Linkedin
} from 'lucide-react';
import { ClinicProfile } from '../types';

interface AboutProps {
  profile: ClinicProfile;
  onOpenAppointment?: () => void;
}

export const About: React.FC<AboutProps> = ({ profile, onOpenAppointment }) => {
  const handleAppointmentClick = () => {
    if (onOpenAppointment) {
      onOpenAppointment();
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section id="about" className="py-24 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Professional Profile</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Dr. Kifayat Khan
          </h2>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Clinical Physiotherapist, Sports Physical Therapist & Head of Department practicing in Islamabad, Pakistan.
          </p>
        </div>

        {/* Main Grid: Portrait and Professional Biography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Portrait and Clinic Snapshot */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative mx-auto max-w-md">
              
              {/* Outer frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shadow-xl">
                <img
                  src="/images/dr_kifayat_formal.jpg"
                  alt="Dr. Kifayat Khan - Formal Medical Portrait"
                  className="w-full h-[400px] object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="p-5 bg-slate-50/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Dr. Kifayat Khan</h4>
                      <p className="text-xs text-cyan-400 font-medium">Doctor of Physical Therapy (DPT)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-blue-900/60 text-blue-300 text-xs font-semibold border border-blue-700/50">
                      4 Years Exp.
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "Helping people improve their health, mobility, and quality of life."
                  </p>
                </div>
              </div>

              {/* Clinic Location Card under photo */}
              <div className="mt-4 p-4 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/70 dark:border-slate-700/70 text-xs space-y-2">
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                  <Building className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-semibold">Clinic Location:</strong>
                    <span>Room #607, 6th Floor, Mall of Islamabad, Jinnah Ave, Block J, Blue Area, Islamabad</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-300/60 dark:border-slate-700/60">
                  <a
                    href="tel:03138161676"
                    className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>03138161676</span>
                  </a>
                  <a
                    href={profile.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Narrative, Core Values, Career Goals & Patient Approach */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bio Paragraphs */}
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                <strong className="text-slate-900 dark:text-white font-semibold">Dr. Kifayat Khan</strong> is a dedicated Clinical Physiotherapist with four continuous years of clinical expertise across orthopedics, post-surgical rehabilitation, sports trauma, and neuro-motor recovery.
              </p>
              <p>
                Holding a comprehensive <strong className="text-slate-900 dark:text-white">Doctor of Physical Therapy (DPT)</strong> degree from the prestigious Khyber Medical University, Dr. Khan treats patients not merely as cases, but as individuals striving to reclaim full independence, athletic vitality, and comfortable daily living.
              </p>
              <p>
                Having served as <strong className="text-slate-900 dark:text-white">Head of Department (HOD)</strong> and specialized <strong className="text-slate-900 dark:text-white">Sports Physical Therapist</strong>, he integrates hands-on spinal manual therapy, targeted therapeutic exercise prescription, and modern electro-physical modalities to achieve lasting pain eradication without reliance on recurring pain medication or premature surgery.
              </p>
            </div>

            {/* Core Pillars: Patient-Centered, Sports Expertise, Evidence-Based */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 hover:border-cyan-500/40 transition-colors space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Patient-Focused Approach</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every patient undergoes a 45-minute biomechanical evaluation. Treatment plans are customized to their personal lifestyle, work posture, and recovery goals.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 hover:border-blue-500/40 transition-colors space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sports Physiotherapy Expertise</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  As an active sportsman and clinical sports specialist, Dr. Khan designs high-velocity kinetic loading and agility drills that safely return athletes to peak performance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 hover:border-sky-500/40 transition-colors space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Career Goals & Values</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Advancing non-surgical orthopedic excellence in Islamabad, elevating clinical physiotherapy standards, and instilling movement confidence through patient education.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 hover:border-indigo-500/40 transition-colors space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Clinical Integrity & Safety</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Strict adherence to medical hygiene, diagnostic imaging review (MRI/X-Ray correlation), and coordination with primary healthcare physicians.
                </p>
              </div>

            </div>

            {/* Quick Action Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={handleAppointmentClick}
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
              >
                Schedule Consultation with Dr. Khan
              </button>

              <a
                href={profile?.socialLinks?.linkedin || "https://www.linkedin.com/in/dr-kifayat-khan-670672156/"}
                target="_blank"
                rel="noopener noreferrer"
                id="about-linkedin-link"
                className="px-4 py-3 rounded-xl font-semibold text-xs text-sky-300 bg-sky-950/80 border border-sky-800/80 hover:bg-sky-900/90 hover:text-white transition-all flex items-center gap-2"
                title="View Dr. Kifayat Khan's Verified Profile on LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-sky-400" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 text-sky-400/70" />
              </a>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                Clinic Room #607, Mall of Islamabad • Mon - Sat
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
