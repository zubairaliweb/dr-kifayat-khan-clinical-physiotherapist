import React from 'react';
import { 
  Activity, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ChevronRight,
  Linkedin,
  Facebook,
  Video
} from 'lucide-react';
import { ClinicProfile } from '../types';

interface FooterProps {
  profile: ClinicProfile;
  onOpenAppointment: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAppointment, onOpenAdmin }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column footer layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Column 1: Doctor Identity & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Dr. Kifayat Khan
                </span>
                <span className="block text-xs font-semibold text-cyan-400">
                  Clinical Physiotherapist • DPT
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Dedicated to restoring pain-free biomechanics, functional athletic vitality, and neuromuscular recovery across Islamabad.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Official Social Profiles:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* LinkedIn Professional Profile */}
                <a
                  href={profile.socialLinks.linkedin || "https://www.linkedin.com/in/dr-kifayat-khan-670672156/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-social-linkedin"
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:bg-sky-600/10 text-slate-700 dark:text-slate-300 hover:text-sky-400 text-xs font-bold flex items-center gap-2 transition-colors"
                  title="Dr. Kifayat Khan - Professional LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-sky-400" />
                  <span>LinkedIn</span>
                </a>

                {/* Facebook */}
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-social-facebook"
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-600/10 text-slate-700 dark:text-slate-300 hover:text-blue-400 text-xs font-bold flex items-center gap-2 transition-colors"
                  title="Facebook Clinical Page"
                >
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook</span>
                </a>

                {/* TikTok */}
                <a
                  href={profile.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-social-tiktok"
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500 hover:bg-pink-600/10 text-slate-700 dark:text-slate-300 hover:text-pink-400 text-xs font-bold flex items-center gap-2 transition-colors"
                  title="TikTok Videos & Demonstrations"
                >
                  <Video className="w-4 h-4 text-pink-400" />
                  <span>TikTok</span>
                </a>

                {/* Direct WhatsApp */}
                <a
                  href={profile.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-social-whatsapp"
                  className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="WhatsApp Direct Consultation"
                >
                  <MessageSquare className="w-4 h-4 fill-current text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-xs">
              {['home', 'about', 'education', 'services', 'skills', 'videos', 'blog', 'contact'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="hover:text-cyan-400 capitalize transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-700 dark:text-slate-600" />
                    <span>{id}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Clinical Services Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Specialized Care
            </span>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>Clinical Physiotherapy</li>
              <li>Sports Injury Rehabilitation</li>
              <li>Spinal Manual Therapy</li>
              <li>Neurological Rehabilitation</li>
              <li>Pilates & Core Training</li>
              <li>Ergonomic Posture Correction</li>
              <li>Exercise Prescription</li>
            </ul>
          </div>

          {/* Column 4: Contact & Clinic Coordinates (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Clinic Address
            </span>
            <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Room #607, 6th Floor, Mall of Islamabad, Jinnah Ave, Blue Area, Islamabad</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:03138161676" className="text-slate-900 dark:text-white hover:text-cyan-400 font-semibold">
                  03138161676
                </a>
              </p>
              <p className="pt-2">
                <button
                  onClick={onOpenAppointment}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Book Appointment Now
                </button>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar with copyright and admin access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-500">
          <p>
            © {new Date().getFullYear()} Dr. Kifayat Khan. All rights reserved. Clinical Physiotherapist, Islamabad.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 dark:text-slate-500 hover:text-slate-700 hover:dark:text-slate-300 text-xs transition-colors flex items-center gap-1"
            >
              <span>Clinic Administration</span>
            </button>
            <span>•</span>
            <a
              href="https://wa.me/923138161676"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:text-emerald-400"
            >
              Direct WhatsApp 03138161676
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
