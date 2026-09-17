import React, { useState } from 'react';
import { 
  Award, 
  Brain, 
  Activity, 
  ShieldCheck, 
  HeartHandshake, 
  Dumbbell, 
  Sparkles,
  Check
} from 'lucide-react';
import { SkillCategory } from '../types';

interface SkillsProps {
  categories: SkillCategory[];
}

export const Skills: React.FC<SkillsProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!categories || categories.length === 0) {
    return null;
  }

  const currentCategory = categories[activeTab] || categories[0];

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0: return <Brain className="w-5 h-5 text-cyan-400" />;
      case 1: return <HeartHandshake className="w-5 h-5 text-emerald-400" />;
      case 2: return <Activity className="w-5 h-5 text-blue-400" />;
      case 3: return <Dumbbell className="w-5 h-5 text-amber-400" />;
      case 4: return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Clinical Competencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Professional Skills & Healthcare Expertise
          </h2>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
            A comprehensive matrix of medical science, manual manipulation, athletic conditioning, and clinical ethics.
          </p>
        </div>

        {/* Tab Buttons for Desktop & Tablet */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === idx
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-400/50'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 hover:dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {getCategoryIcon(idx)}
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Active Category Display */}
        <div className="bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                {getCategoryIcon(activeTab)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentCategory.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentCategory.description}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-cyan-400 border border-slate-300 dark:border-slate-700 w-fit">
              {currentCategory.skills.length} Core Competencies
            </span>
          </div>

          {/* Grid of skill badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCategory.skills.map((skill, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/60 dark:border-slate-700/60 hover:border-cyan-500/40 hover:bg-slate-200 hover:dark:bg-slate-800 transition-all duration-200 space-y-1.5 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h4>
                </div>
                {skill.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-7 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* All Skills Quick Tag Cloud / Badge overview */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Complete Clinical Scope Overview</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Physiology", "Anatomy", "Treatment Planning", "Exercise Prescription", 
              "Patient Education", "Healthcare Professionals", "Sports Medicine", 
              "Sports Science", "Manual Therapy", "Healthcare", "Flexible Approach", 
              "Organization Skills", "Hard Work", "Professional Behavior", 
              "Neurological Rehabilitation", "Sports Injuries", "Physical Therapy", 
              "Rehabilitation", "Injury Prevention", "Prevention", "Fitness Training", 
              "Pilates Trainer", "Fitness Instruction", "Sports Chiropractic", "Chiropractic"
            ].map((name, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500/50 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
