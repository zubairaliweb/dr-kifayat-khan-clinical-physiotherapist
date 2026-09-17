import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  X, 
  Tag, 
  Plus,
  Stethoscope
} from 'lucide-react';
import { BlogPost } from '../types';
import { useAuth } from '../context/AuthContext';

interface BlogProps {
  blogs: BlogPost[];
  onOpenAdminBlogs: () => void;
  onOpenAppointment: () => void;
}

export const Blog: React.FC<BlogProps> = ({ blogs, onOpenAdminBlogs, onOpenAppointment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  const categories = ['All', 'Sports Medicine', 'Spine Health', 'Ergonomics', 'Physiotherapy', 'Rehabilitation'];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      b.title.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evidence-Based Articles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Physiotherapy & Health Insights
            </h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 max-w-xl">
              Educational articles written by Dr. Kifayat Khan covering musculoskeletal health, injury management, and clinical rehabilitation.
            </p>
          </div>

          {/* Admin Create Blog Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  onOpenAdminBlogs();
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 hover:dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all shadow-sm"
              title="Publish or manage blog posts"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>{isAuthenticated ? "Write Article (Admin)" : "Manage Blog (Admin)"}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Badges */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 hover:dark:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or symptoms..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Blog Cards Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 dark:text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Articles Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No published articles match your current search criteria. Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                {/* Cover Image */}
                <div 
                  className="relative aspect-[16/10] bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer"
                  onClick={() => setActiveBlog(blog)}
                >
                  <img
                    src={blog.coverImage || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm text-[11px] font-bold text-cyan-300 border border-slate-200 dark:border-slate-800">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500" />
                        {blog.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500" />
                        {blog.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setActiveBlog(blog)}
                      className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {blog.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>

                  {/* Footer Author & Read Link */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-900/50 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
                        DK
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          {blog.author}
                        </span>
                        <span className="block text-[10px] text-slate-600 dark:text-slate-500">
                          {blog.authorRole}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveBlog(blog)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/btn"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>

              </article>
            ))}
          </div>
        )}

      </div>

      {/* Full Blog Reader Modal Dialog */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveBlog(null)}
              className="sticky top-4 float-right mr-4 z-20 p-2 rounded-full bg-slate-50/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 hover:dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cover Banner */}
            <div className="relative aspect-[21/9] w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
              <img
                src={activeBlog.coverImage}
                alt={activeBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold">
                  {activeBlog.category}
                </span>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-10 space-y-6">
              
              {/* Meta Header */}
              <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    {activeBlog.author} ({activeBlog.authorRole})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeBlog.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {activeBlog.readTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {activeBlog.title}
                </h1>
              </div>

              {/* Formatted Article Content */}
              <div className="prose prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                {activeBlog.content.split('\n\n').map((block, idx) => {
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-xl font-bold text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-200 dark:border-slate-800">
                        {block.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-cyan-300 pt-3">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('1. ') || block.startsWith('- ')) {
                    const lines = block.split('\n');
                    return (
                      <ul key={idx} className="space-y-1.5 list-disc pl-5">
                        {lines.map((l, li) => (
                          <li key={li} className="text-slate-700 dark:text-slate-300">
                            {l.replace(/^[0-9]\.\s*|-\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed">
                      {block}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                {activeBlog.tags.map((t, ti) => (
                  <span key={ti} className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Call to Action Banner inside Reader */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-100 dark:via-slate-900 to-cyan-950 border border-cyan-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                    Suffering from similar symptoms?
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    Consult Dr. Kifayat Khan at Mall of Islamabad for personalized clinical diagnosis.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveBlog(null);
                    onOpenAppointment();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold shadow-md hover:from-blue-500 hover:to-cyan-500 whitespace-nowrap"
                >
                  Book Assessment
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
