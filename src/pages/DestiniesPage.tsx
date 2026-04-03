import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Share2, Plus, Users, Wind, Send } from 'lucide-react';
import { useAuth } from '../services/firebase';

const MOCK_POSTS = [
  {
    id: '1',
    author: 'Anonim Muslimacha',
    content: 'Assalomu alaykum. Men 5 yil davomida tazyiq ostida yashadim. Nafas orqali huquqiy maslahat oldim va hozirda o\'zimni xavfsiz his qilyapman. Opa-singillar, qo\'rqmang, yordam so\'rashdan uyalmang.',
    likes: 124,
    comments: [
      { author: 'Nilvarim', text: 'Siz juda kuchli ayolsiz! Biz siz bilan faxrlanamiz.' },
      { author: 'Bloom', text: 'Alloh sizga kuch-quvvat bersin. Men ham shunday vaziyatdaman, maslahatingiz uchun rahmat.' }
    ],
    time: '2 soat avval'
  },
  {
    id: '2',
    author: 'Qimmatxon',
    content: 'Bugun birinchi marta psixolog bilan gaplashdim. Ichimdagi barcha og\'riqlarni aytdim. O\'zimni ancha yengil his qilyapman. Bu ilova haqiqiy Nafas ekan.',
    likes: 89,
    comments: [
      { author: 'Zumradxon', text: 'Qaysi psixolog bilan gaplashdingiz? Men ham yozilmoqchi edim.' }
    ],
    time: '5 soat avval'
  },
  {
    id: '3',
    author: 'Bloom',
    content: 'Ish joyimda kamsitishlarga duch kelyapman. Huquqshunoslar bilan bog\'landim, ular menga qanday yo\'l tutishni o\'rgatishdi. Haq-huquqimizni bilishimiz kerak!',
    likes: 56,
    comments: [],
    time: 'Kecha'
  }
];

const NICKNAMES = ['Anonim Muslimacha', 'Nilvarim', 'Bloom', 'Qimmatxon', 'Zumradxon'];

export default function DestiniesPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = React.useState(MOCK_POSTS);
  const [newPost, setNewPost] = React.useState('');
  const [isPosting, setIsPosting] = React.useState(false);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now().toString(),
      author: profile?.nickname || NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)],
      content: newPost,
      likes: 0,
      comments: [],
      time: 'Hozir'
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setIsPosting(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
          <Wind size={14} />
          <span>Xavfsiz va Anonim</span>
        </div>
        <h1 className="text-4xl font-bold text-on-surface">Taqdirlar</h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Sizning hikoyangiz boshqalarga kuch berishi mumkin. Bu yerda hamma narsa anonim va xavfsiz.
        </p>
      </header>

      {/* Create Post */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            {profile?.nickname?.[0] || 'A'}
          </div>
          <button 
            onClick={() => setIsPosting(true)}
            className="flex-grow text-left px-4 py-3 bg-surface-container-low rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Hikoyangizni ulashing...
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Yangi hikoya</h2>
                <button onClick={() => setIsPosting(false)} className="text-on-surface-variant">Bekor qilish</button>
              </div>
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Nima haqida yozmoqchisiz?"
                className="w-full h-40 p-4 bg-surface-container-low rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-on-surface-variant flex items-center gap-2">
                  <Wind size={14} className="text-green-500" />
                  Siz {profile?.nickname || 'Anonim'} sifatida yozyapsiz
                </div>
                <button 
                  onClick={handlePost}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  Ulashish <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div 
            layout
            key={post.id} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-primary font-bold">
                  {post.author[0]}
                </div>
                <div>
                  <h3 className="font-bold text-primary">{post.author}</h3>
                  <p className="text-xs text-on-surface-variant">{post.time}</p>
                </div>
              </div>
              <button className="text-on-surface-variant"><Share2 size={18} /></button>
            </div>
            <p className="text-on-surface leading-relaxed">{post.content}</p>
            
            <div className="flex items-center gap-6 pt-2 border-t border-outline-variant/10">
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-red-500 transition-colors">
                <Heart size={20} />
                <span className="text-sm font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                <MessageSquare size={20} />
                <span className="text-sm font-bold">{post.comments.length}</span>
              </button>
            </div>

            {/* Comments */}
            {post.comments.length > 0 && (
              <div className="space-y-3 pt-4 pl-4 border-l-2 border-primary/10">
                {post.comments.map((comment, i) => (
                  <div key={i} className="bg-surface-container-low p-3 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-primary">{comment.author}</span>
                    <p className="text-sm text-on-surface">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
