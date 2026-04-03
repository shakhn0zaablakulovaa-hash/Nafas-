import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MessageSquare, Users, GraduationCap, Gavel, ClipboardCheck, LogOut, User as UserIcon, PlayCircle, Wind, Phone, Scan, LayoutDashboard, ChevronRight, Gamepad2 } from 'lucide-react';
import { useAuth } from './services/firebase';
import SOSButton from './components/SOSButton';
import { cn } from './lib/utils';

// Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import DestiniesPage from './pages/DestiniesPage';
import ExpertsPage from './pages/ExpertsPage';
import LegalPage from './pages/LegalPage';
import AssessmentPage from './pages/AssessmentPage';
import PodcastsPage from './pages/PodcastsPage';
import GamesPage from './pages/GamesPage';
import AdminDashboard from './pages/AdminDashboard';

const NICKNAMES = ['Anonim Muslimacha', 'Nilvarim', 'Bloom', 'Qimmatxon', 'Zumradxon'];
const REGIONS = ['Toshkent', 'Samarqand', 'Farg\'ona', 'Andijon', 'Namangan', 'Buxoro', 'Xorazm', 'Navoiy', 'Jizzax', 'Qashqadaryo', 'Surxondaryo', 'Sirdaryo', 'Qoraqalpog\'iston'];

const LoginPage = () => {
  const { signIn, isSigningIn, user, profile, completeProfile } = useAuth();
  const [step, setStep] = React.useState(1); // 1: Role, 2: Phone/FaceID, 3: Profile
  const [role, setRole] = React.useState<'user' | 'admin'>('user');
  const [isScanning, setIsScanning] = React.useState(false);
  const [nickname, setNickname] = React.useState(NICKNAMES[0]);
  const [region, setRegion] = React.useState(REGIONS[0]);

  const handleFaceID = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep(3);
    }, 2000);
  };

  const handleComplete = async () => {
    await completeProfile({ role, nickname, region });
  };

  if (user && profile) return <Navigate to={profile.role === 'admin' ? '/admin' : '/'} />;

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/10"
      >
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wind size={32} />
            </div>
            <h1 className="text-3xl font-bold text-on-surface">Nafas</h1>
            <p className="text-on-surface-variant">Xavfsiz va maxfiy yordam platformasi</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-center font-bold text-on-surface-variant">Kim sifatida kirmoqchisiz?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setRole('user'); setStep(2); }}
                    className="p-6 rounded-2xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all space-y-2 text-center group"
                  >
                    <Users className="mx-auto text-primary group-hover:scale-110 transition-transform" size={32} />
                    <span className="block font-bold">Foydalanuvchi</span>
                  </button>
                  <button 
                    onClick={() => { setRole('admin'); setStep(2); }}
                    className="p-6 rounded-2xl border-2 border-secondary/20 hover:border-secondary hover:bg-secondary/5 transition-all space-y-2 text-center group"
                  >
                    <LayoutDashboard className="mx-auto text-secondary group-hover:scale-110 transition-transform" size={32} />
                    <span className="block font-bold">Admin</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 relative"
              >
                <div className="space-y-4">
                  <p className="text-center font-bold text-on-surface-variant">Xavfsizlikni tasdiqlang</p>
                  <div className="space-y-3">
                    <button 
                      onClick={handleFaceID}
                      className="w-full p-4 bg-surface-container-high rounded-2xl flex items-center gap-4 hover:bg-surface-container-highest transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <Scan size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold">Face ID orqali</span>
                        <span className="text-xs text-on-surface-variant">Faqat ayollar uchun identifikatsiya</span>
                      </div>
                      <ChevronRight className="ml-auto text-outline" size={20} />
                    </button>
                    <button className="w-full p-4 bg-surface-container-high rounded-2xl flex items-center gap-4 hover:bg-surface-container-highest transition-colors group">
                      <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                        <Phone size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold">Telefon raqam orqali</span>
                        <span className="text-xs text-on-surface-variant">SMS tasdiqlash bilan</span>
                      </div>
                      <ChevronRight className="ml-auto text-outline" size={20} />
                    </button>
                  </div>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center space-y-4 z-10 rounded-2xl">
                    <div className="w-32 h-32 border-4 border-primary rounded-3xl relative overflow-hidden">
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                      />
                    </div>
                    <p className="font-bold text-primary animate-pulse">Yuzni skanerlash...</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <p className="text-center font-bold text-on-surface-variant">Profilni yakunlang</p>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase ml-2">Taxallus (Nickname)</label>
                    <select 
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full p-4 bg-surface-container-high rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {NICKNAMES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase ml-2">Viloyat</label>
                    <select 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-4 bg-surface-container-high rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                {!user ? (
                  <button 
                    onClick={signIn}
                    disabled={isSigningIn}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {isSigningIn ? "Kirilmoqda..." : "Google orqali tasdiqlash"}
                  </button>
                ) : (
                  <button 
                    onClick={handleComplete}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Tayyor!
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  
  const isAdmin = profile?.role === 'admin';

  const userNavItems = [
    { path: '/', icon: Home, label: 'Asosiy' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/community', icon: Users, label: 'Taqdirlar' },
    { path: '/podcasts', icon: PlayCircle, label: 'Podkastlar' },
    { path: '/games', icon: Gamepad2, label: 'O\'yinlar' },
    { path: '/experts', icon: GraduationCap, label: 'Ekspertlar' },
    { path: '/legal', icon: Gavel, label: 'Huquq' },
    { path: '/assessment', icon: ClipboardCheck, label: 'Test' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/community', icon: Users, label: 'Taqdirlar' },
    { path: '/podcasts', icon: PlayCircle, label: 'Podkastlar' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-surface-container-low pb-20 md:pb-0 md:pl-20">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-outline-variant/10 flex-col items-center py-8 space-y-8 z-50">
        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Wind size={24} />
        </div>
        <div className="flex-grow flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-3 rounded-xl transition-all group relative",
                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <item.icon size={24} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-on-surface text-surface text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
        <button 
          onClick={signOut}
          className="p-3 text-on-surface-variant hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
        >
          <LogOut size={24} />
        </button>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/10 px-4 py-3 flex justify-between items-center z-50">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === item.path ? "text-primary" : "text-on-surface-variant"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 px-6 py-4 flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <div className="md:hidden w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
            <Wind size={18} />
          </div>
          <h1 className="font-bold text-xl text-on-surface">Nafas</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-primary">{profile?.nickname || 'Anonim'}</p>
            <p className="text-[10px] text-on-surface-variant">{profile?.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}</p>
          </div>
          <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-primary">
            <UserIcon size={20} />
          </div>
        </div>
      </header>

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        {!isAdmin && <SOSButton />}
      </main>
    </div>
  );
}

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <Wind className="text-primary" size={32} />
        </motion.div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={
        (!user || !profile) ? <Navigate to="/login" /> : (
          <Layout>
            <Routes>
              <Route path="/" element={profile.role === 'admin' ? <Navigate to="/admin" /> : <HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/community" element={<DestiniesPage />} />
              <Route path="/experts" element={<ExpertsPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/podcasts" element={<PodcastsPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/admin" element={profile.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            </Routes>
          </Layout>
        )
      } />
    </Routes>
  );
}
