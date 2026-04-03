import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Heart, Users, ArrowRight, PlayCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const PODCASTS = [
  { id: 'Qe0f9I4PZYE', title: 'Zo\'ravonlikka qarshi kurash', author: 'Nafas' },
  { id: 'j63cf5ztjzU', title: 'Psixologik travmalar bilan ishlash', author: 'Nafas' },
  { id: 'iHj0bPJ8sdc', title: 'Huquqlaringizni himoya qiling', author: 'Huquqshunos' },
  { id: 'iMokGfKUhCc', title: 'Ayollar huquqlari va erkinliklari', author: 'BMT' },
  { id: 'wgW3k8cHRP8', title: 'O\'z-o\'zini tiklash va motivatsiya', author: 'Psixolog' },
  { id: 'e6PUr80OYn4', title: 'Jamiyatda ayolning o\'rni va roli', author: 'Ekspert' },
];

export default function HomePage() {
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

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
          <Wind size={16} />
          <span>Xavfsiz hudud</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-on-surface leading-tight">
          Bugun o'zingizni <br />
          <span className="text-primary italic">qanday</span> his qilyapsiz?
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg">
          Nafas - bu sizning sirdoshingiz. Biz har qanday vaziyatda sizni tinglashga va huquqiy yordam berishga tayyormiz.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/assessment" className="bg-primary-container p-8 rounded-xl space-y-4 hover:scale-[1.02] transition-transform group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary">
            <Heart size={24} />
          </div>
          <h2 className="text-2xl font-bold text-on-primary-container">Psixologik holatni aniqlash</h2>
          <p className="text-on-primary-container/80">5ta savol orqali stress darajangizni aniqlang va AI maslahatlarini oling.</p>
          <div className="flex items-center gap-2 font-bold text-primary group-hover:gap-4 transition-all">
            Boshlash <ArrowRight size={20} />
          </div>
        </Link>

        <Link to="/chat" className="bg-surface-container-highest p-8 rounded-xl space-y-4 hover:scale-[1.02] transition-transform group">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-2xl font-bold text-on-surface">AI Yordamchi</h2>
          <p className="text-on-surface-variant">24/7 maxfiy va hamdard suhbatdosh. Huquqiy va ruhiy yordam.</p>
          <div className="flex items-center gap-2 font-bold text-primary group-hover:gap-4 transition-all">
            Suhbatni boshlash <ArrowRight size={20} />
          </div>
        </Link>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Foydali podkastlar</h2>
            <p className="text-on-surface-variant">Zo'ravonlikni yengish va o'z-o'zini tiklash haqida.</p>
          </div>
          <Link to="/podcasts" className="text-primary font-bold">Hammasini ko'rish</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {PODCASTS.map((video) => (
            <div 
              key={video.id} 
              className="min-w-[280px] space-y-3 cursor-pointer group"
              onClick={() => setSelectedVideo(video.id)}
            >
              <div className="aspect-video bg-surface-container rounded-lg overflow-hidden relative">
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={48} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-xs text-on-surface-variant">{video.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary-container p-8 rounded-xl flex flex-col md:flex-row items-center gap-8">
        <div className="space-y-4 flex-grow">
          <h2 className="text-3xl font-bold text-on-secondary-container">Anonim hamjamiyat</h2>
          <p className="text-on-secondary-container/80">Siz yolg'iz emassiz. Boshqa ayollar bilan tajriba almashing va bir-biringizni qo'llab-quvvatlang.</p>
          <Link to="/community" className="inline-block py-3 px-8 bg-secondary text-white rounded-full font-bold">Hamjamiyatga qo'shilish</Link>
        </div>
        <div className="w-32 h-32 opacity-20">
          <Users size={128} />
        </div>
      </section>
    </div>
  );
}
