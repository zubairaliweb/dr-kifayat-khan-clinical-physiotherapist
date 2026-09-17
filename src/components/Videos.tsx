import React, { useState } from 'react';
import { 
  Play, 
  Video as VideoIcon, 
  Clock, 
  Calendar, 
  X, 
  Plus, 
  Share2,
  CheckCircle2,
  Film
} from 'lucide-react';
import { VideoItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface VideosProps {
  videos: VideoItem[];
  onOpenAdminVideos: () => void;
}

export const Videos: React.FC<VideosProps> = ({ videos, onOpenAdminVideos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  const categories = ['All', 'Spine Health', 'Sports Rehab', 'Ergonomics', 'Clinical Care', 'Rehabilitation'];

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleShare = (video: VideoItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#videos`);
      setCopiedId(video.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="videos" className="py-24 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>Clinical Demonstrations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Physiotherapy Videos & Guidance
            </h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 max-w-xl">
              Watch Dr. Kifayat Khan demonstrate rehabilitation exercises, spinal decompression, and athletic recovery protocols.
            </p>
          </div>

          {/* Admin Video Manager Quick Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  onOpenAdminVideos();
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all shadow-sm"
              title="Upload and manage video library"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>{isAuthenticated ? "Manage Videos (Admin)" : "Upload Video (Admin)"}</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 hover:dark:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid or Empty State */}
        {filteredVideos.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-500">
              <VideoIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Videos in this Category</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              There are currently no videos tagged under "{selectedCategory}". Upload one from the admin dashboard.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-cyan-400 hover:bg-slate-300 hover:dark:bg-slate-700"
            >
              View All Videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300/80 dark:border-slate-700/80 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Thumbnail Container with Play Overlay */}
                <div 
                  className="relative aspect-video bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  <img
                    src={video.thumbnailUrl || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-50/40 dark:bg-slate-950/40 group-hover:bg-slate-50/20 group-hover:dark:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-cyan-400 transition-transform pl-1">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100/90 dark:bg-slate-900/90 text-[11px] font-bold text-cyan-300 backdrop-blur-sm border border-slate-300 dark:border-slate-700">
                      {video.category}
                    </span>
                    {video.isUploaded && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 text-[10px] font-semibold text-emerald-300 border border-emerald-800">
                        Uploaded MP4
                      </span>
                    )}
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-semibold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 
                      onClick={() => setActiveVideo(video)}
                      className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer"
                    >
                      {video.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-slate-300/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500" />
                      {video.createdAt}
                    </span>
                    <button
                      onClick={() => handleShare(video)}
                      className="p-1.5 rounded-lg hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Share link"
                    >
                      {copiedId === video.id ? (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Copied
                        </span>
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-900/60 text-cyan-300 text-xs font-bold border border-blue-700">
                  {activeVideo.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-lg">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {(() => {
                const getEmbedUrl = (url: string): string | null => {
                  if (!url) return null;
                  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/i);
                  if (match && match[1]) {
                    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
                  }
                  return null;
                };

                const embedUrl = getEmbedUrl(activeVideo.videoUrl);

                if (embedUrl) {
                  return (
                    <iframe
                      src={embedUrl}
                      title={activeVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }

                return (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    poster={activeVideo.thumbnailUrl}
                  >
                    Your browser does not support HTML5 video streaming.
                  </video>
                );
              })()}
            </div>

            {/* Modal Footer Info */}
            <div className="p-5 bg-slate-100 dark:bg-slate-900 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Clinical Context & Instructions:
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeVideo.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Presenter: Dr. Kifayat Khan (Clinical Physiotherapist)</span>
                <span>Room #607, Mall of Islamabad</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
