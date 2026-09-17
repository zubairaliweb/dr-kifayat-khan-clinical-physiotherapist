import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Award, 
  MapPin, 
  Trophy, 
  CheckCircle2 
} from 'lucide-react';
import { EducationItem } from '../types';

interface EducationProps {
  education: EducationItem[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <section id="education" className="py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Education & Clinical Qualifications
          </h2>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
            A solid academic foundation in medical science, human kinetics, and doctoral physical therapy training.
          </p>
        </div>

        {/* Timeline / Cards Display */}
        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:w-0.5 before:-ml-px before:bg-gradient-to-b before:from-cyan-500 before:via-blue-600 before:to-slate-200 before:dark:to-slate-800 before:hidden md:before:block">
          
          {education.map((item, index) => {
            const isDoctorate = item.degree.includes("Doctor");
            const isLeft = index % 2 === 0;

            return (
              <div 
                key={item.id} 
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                
                {/* Center marker on timeline */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-cyan-400 items-center justify-center shadow-lg shadow-cyan-500/20 z-10">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-[calc(50%-2.5rem)]">
                  <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl relative overflow-hidden group">
                    
                    {/* Top indicator tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isDoctorate 
                          ? 'bg-blue-900/70 text-cyan-300 border border-blue-700/60' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                      }`}>
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        {item.duration}
                      </span>
                      {item.grade && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-semibold">
                          <Award className="w-3 h-3" />
                          {item.grade}
                        </span>
                      )}
                    </div>

                    {/* Degree & Institution */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">
                      {item.degree}
                    </h3>
                    <p className="text-cyan-400 font-semibold text-sm mt-0.5">
                      {item.institution}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-slate-600 dark:text-slate-500" />
                      {item.location} • Field: <strong className="text-slate-700 dark:text-slate-300">{item.field}</strong>
                    </p>

                    {/* Extracurricular Activities */}
                    {item.activities && (
                      <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-700/40 text-amber-300 text-xs font-medium">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Extracurricular: {item.activities}</span>
                      </div>
                    )}

                    {/* Key Highlights */}
                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {item.highlights.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Empty side balance on desktop */}
                <div className="hidden md:block w-[calc(50%-2.5rem)]" />

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
