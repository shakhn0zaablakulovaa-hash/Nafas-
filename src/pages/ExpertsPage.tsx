import React from 'react';
import { Star, Video, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';
import { Expert } from '../types';

const EXPERTS: Expert[] = [
  {
    id: '1',
    name: 'Dr. Malika Karimova',
    title: 'Psixolog, Travma mutaxassisi',
    specialty: 'Oilaviy zo\'ravonlik va psixologik tiklanish',
    bio: '15 yillik tajribaga ega mutaxassis. Xalqaro sertifikatlarga ega.',
    photoUrl: 'https://picsum.photos/seed/expert1/200/200',
    price: 150000,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Aziza Mansurova',
    title: 'Advokat, Huquqshunos',
    specialty: 'Ayollar huquqlari va ajrim masalalari',
    bio: 'Xotin-qizlarni himoya qilish bo\'yicha 10 yillik tajriba.',
    photoUrl: 'https://picsum.photos/seed/expert2/200/200',
    price: 200000,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Nigora Aliyeva',
    title: 'Klinik psixolog',
    specialty: 'Depressiya va xavotir bilan ishlash',
    bio: 'Ayollar uchun maxsus terapiya kurslari muallifi.',
    photoUrl: 'https://picsum.photos/seed/expert3/200/200',
    price: 120000,
    rating: 5.0
  }
];

export default function ExpertsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12 pb-32">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
          <ShieldCheck size={16} />
          <span>Tasdiqlangan mutaxassislar</span>
        </div>
        <h1 className="text-4xl font-bold text-on-surface leading-tight">
          Malakali ekspertlar <br />
          <span className="text-primary italic">yordami</span>
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg">
          Bizning barcha mutaxassislarimiz maxsus tekshiruvdan o'tgan va ayollar huquqlari bo'yicha katta tajribaga ega.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPERTS.map((expert) => (
          <div key={expert.id} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <img src={expert.photoUrl} alt={expert.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary-container" />
              <div>
                <h3 className="font-bold text-on-surface">{expert.name}</h3>
                <p className="text-xs text-primary font-bold">{expert.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold">{expert.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-bold text-outline uppercase tracking-widest">Mutaxassisligi</p>
              <p className="text-sm text-on-surface-variant">{expert.specialty}</p>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl flex justify-between items-center">
              <span className="text-lg font-bold text-primary">{expert.price.toLocaleString()} so'm</span>
              <span className="text-xs text-on-surface-variant">1 seans / 45 daqiqa</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-surface-container-highest rounded-full font-bold text-sm flex items-center justify-center gap-2">
                <Calendar size={16} /> Bron qilish
              </button>
              <button className="py-3 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
                <Video size={16} /> Zoom uchrashuv
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-primary-container p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="space-y-4 flex-grow">
          <h2 className="text-2xl font-bold text-on-primary-container">Bepul maslahat kerakmi?</h2>
          <p className="text-on-primary-container/80">Har hafta oxirida bizning mutaxassislarimiz bepul guruhli terapiya seanslarini o'tkazishadi.</p>
          <button className="py-3 px-8 bg-primary text-white rounded-full font-bold">Ro'yxatdan o'tish</button>
        </div>
        <div className="w-24 h-24 opacity-20">
          <MessageSquare size={96} />
        </div>
      </section>
    </div>
  );
}
