import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MessageSquare, Users, GraduationCap, Gavel, ClipboardCheck, LogOut, User as UserIcon, PlayCircle, Wind, Phone, Scan, LayoutDashboard, ChevronRight, Gamepad2, AlertTriangle } from 'lucide-react';
import { Logo } from './components/Logo';
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
            <div className="w-32 h-32 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10 overflow-hidden">
              <Logo size={96} className="animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold text-on-surface tracking-tight">Nafas</h1>
            <p className="text-primary font-medium italic">Har nafasda o'zingni tanla</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <p className="text-on-surface-variant">Xush kelibsiz! Platformadan foydalanish uchun rolni tanlang va davom eting.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => { setRole('user'); setStep(3); }}
                      className="p-8 rounded-3xl border-2 border-primary/10 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-6 group text-left"
                    >
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={32} />
                      </div>
                      <div>
                        <span className="block font-black text-lg text-on-surface">Foydalanuvchi</span>
                        <span className="text-xs text-on-surface-variant">Platformadan foydalanish va yordam olish</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setRole('admin'); setStep(3); }}
                      className="p-8 rounded-3xl border-2 border-secondary/10 hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-6 group text-left"
                    >
                      <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LayoutDashboard size={32} />
                      </div>
                      <div>
                        <span className="block font-black text-lg text-on-surface">Administrator</span>
                        <span className="text-xs text-on-surface-variant">Statistika va tizim boshqaruvi</span>
                      </div>
                    </button>
                  </div>
                </div>
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
                  <div className="space-y-3">
                    <button 
                      onClick={signIn}
                      disabled={isSigningIn}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {isSigningIn ? "Kirilmoqda..." : "Platformaga kirish"}
                    </button>
                  </div>
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
    { path: '/chat', icon: MessageSquare, label: 'Chat (Moderatsiya)' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className={cn(
      "min-h-screen pb-20 md:pb-0 md:pl-20 transition-colors duration-500",
      isAdmin ? "bg-[#fdf8fb]" : "bg-surface-container-low"
    )}>
      {/* Desktop Sidebar */}
      <nav className={cn(
        "hidden md:flex fixed left-0 top-0 bottom-0 w-20 border-r border-outline-variant/10 flex-col items-center py-8 space-y-8 z-50 transition-colors duration-500",
        isAdmin ? "bg-white border-gray-100" : "bg-white"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
          isAdmin ? "bg-[#745286] text-white border-none" : "bg-primary/5 text-primary border-primary/10"
        )}>
          <Logo size={32} />
        </div>
        <div className="flex-grow flex flex-col gap-6 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-3 rounded-xl transition-all group relative flex items-center justify-center",
                location.pathname === item.path 
                  ? (isAdmin ? "bg-[#f3e8f4] text-[#745286]" : "bg-primary/10 text-primary") 
                  : (isAdmin ? "text-gray-400 hover:bg-gray-50" : "text-on-surface-variant hover:bg-surface-container-high")
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
          className={cn(
            "p-3 rounded-xl transition-all",
            isAdmin ? "text-gray-400 hover:bg-red-50 hover:text-red-500" : "text-on-surface-variant hover:bg-red-50 hover:text-red-500"
          )}
        >
          <LogOut size={24} />
        </button>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 border-t border-outline-variant/10 px-4 py-3 flex justify-between items-center z-50 transition-colors duration-500",
        isAdmin ? "bg-white border-gray-100" : "bg-white"
      )}>
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === item.path 
                ? "text-primary" 
                : (isAdmin ? "text-gray-400" : "text-on-surface-variant")
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Header */}
      <header className={cn(
        "sticky top-0 backdrop-blur-md border-b border-outline-variant/10 px-6 py-4 flex justify-between items-center z-40 transition-colors duration-500",
        isAdmin ? "bg-white/80 border-gray-100" : "bg-white/80"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "md:hidden w-10 h-10 rounded-lg flex items-center justify-center border",
            isAdmin ? "bg-[#745286] text-white border-none" : "bg-primary/5 text-primary border-primary/10"
          )}>
            <Logo size={24} />
          </div>
          <h1 className={cn(
            "font-bold text-xl",
            isAdmin ? "text-[#3c2a4d]" : "text-on-surface"
          )}>Nafas</h1>
          {profile?.uid?.startsWith('sim_') && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold animate-pulse">
              <AlertTriangle size={12} />
              Simulyatsiya rejimi (Firebase Auth cheklangan)
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className={cn(
              "text-xs font-bold",
              isAdmin ? "text-[#3c2a4d]" : "text-primary"
            )}>{profile?.nickname || 'Anonim'}</p>
            <p className={cn(
              "text-[10px]",
              isAdmin ? "text-gray-400" : "text-on-surface-variant"
            )}>{profile?.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}</p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isAdmin ? "bg-gray-100 text-gray-400" : "bg-surface-container-highest text-primary"
          )}>
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
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <Logo className="text-primary" size={48} />
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
