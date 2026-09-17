import React, { useState } from 'react';
import { 
  Stethoscope, 
  Activity, 
  Brain, 
  HandMetal, 
  Dumbbell, 
  ShieldCheck, 
  ClipboardList, 
  Zap, 
  Sparkles, 
  HeartPulse, 
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  X,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesProps {
  services: ServiceItem[];
  onBookService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onBookService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = ['All', 'Clinical Care', 'Sports Medicine', 'Neurology', 'Active Rehabilitation', 'Preventative Care', 'Conditioning'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-cyan-400" />;
      case 'Activity': return <Activity className="w-6 h-6 text-blue-400" />;
      case 'Brain': return <Brain className="w-6 h-6 text-indigo-400" />;
      case 'HandMetal': return <HandMetal className="w-6 h-6 text-emerald-400" />;
      case 'Dumbbell': return <Dumbbell className="w-6 h-6 text-sky-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-teal-400" />;
      case 'ClipboardList': return <ClipboardList className="w-6 h-6 text-cyan-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-blue-400" />;
      default: return <Activity className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Healthcare Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Specialized Physiotherapy & Rehabilitation
          </h2>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
            Targeted evidence-based treatments restoring painless mobility, athletic performance, and muscular equilibrium.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-900/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 hover:dark:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-200 hover:dark:bg-slate-800 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-4">
                {/* Top icon and category */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                    {service.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Key Indications list */}
                <div className="pt-2 border-t border-slate-300/60 dark:border-slate-700/60 space-y-1.5">
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                    Ideal For:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.indications.slice(0, 3).map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100/80 dark:bg-slate-900/80 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-slate-300/60 dark:border-slate-700/60 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveModalService(service)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group/btn"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onBookService(service.title)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-colors"
                >
                  Book Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Learn More Modal Dialog */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                {getIcon(activeModalService.iconName)}
              </div>
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                  {activeModalService.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeModalService.title}
                </h3>
              </div>
            </div>

            {/* Detailed Description */}
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              {activeModalService.fullDesc}
            </p>

            {/* Clinical Indications */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Treated Indications & Symptoms:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeModalService.indications.map((ind, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800/70 p-2 rounded-lg border border-slate-300/60 dark:border-slate-700/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Benefits */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Therapeutic Outcomes & Benefits:
              </h4>
              <div className="space-y-1.5">
                {activeModalService.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Location: Room #607, 6th Floor, Mall of Islamabad
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/923138161676?text=Hello%20Dr.%20Kifayat%20Khan,%20I%20am%20interested%20in%20learning%20more%20about%20your%20${encodeURIComponent(activeModalService.title)}%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    const serviceName = activeModalService.title;
                    setActiveModalService(null);
                    onBookService(serviceName);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
