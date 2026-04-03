import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, ArrowRight, Shield } from 'lucide-react';

const PODCASTS = [
  { id: 'Qe0f9I4PZYE', title: 'Zo\'ravonlikka qarshi kurash', author: 'Nafas' },
  { id: 'j63cf5ztjzU', title: 'Psixologik travmalar bilan ishlash', author: 'Nafas' },
  { id: 'iHj0bPJ8sdc', title: 'Huquqlaringizni himoya qiling', author: 'Huquqshunos' },
  { id: 'iMokGfKUhCc', title: 'Ayollar huquqlari va erkinliklari', author: 'BMT' },
  { id: 'wgW3k8cHRP8', title: 'O\'z-o\'zini tiklash va motivatsiya', author: 'Psixolog' },
  { id: 'e6PUr80OYn4', title: 'Jamiyatda ayolning o\'rni va roli', author: 'Ekspert' },
];

export default function PodcastsPage() {
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12 pb-32">
      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <ArrowRight className="rotate-180" size={24} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
          <PlayCircle size={16} />
          <span>Media kutubxona</span>
        </div>
        <h1 className="text-4xl font-bold text-on-surface leading-tight">
          Foydali <span className="text-primary italic">podkastlar</span> va videolar
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg">
          Zo'ravonlikni yengish, o'z-o'zini tiklash va huquqlaringizni himoya qilish haqida mutaxassislar maslahati.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PODCASTS.map((video) => (
          <div 
            key={video.id} 
            className="space-y-4 cursor-pointer group"
            onClick={() => setSelectedVideo(video.id)}
          >
            <div className="aspect-video bg-surface-container rounded-2xl overflow-hidden relative shadow-sm border border-outline-variant/10">
              <img 
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                  <PlayCircle size={40} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">{video.title}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{video.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
