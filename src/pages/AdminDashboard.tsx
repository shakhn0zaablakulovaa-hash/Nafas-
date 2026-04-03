import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Heart, MessageSquare, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

const REGION_DATA = [
  { name: 'Toshkent', value: 35 },
  { name: 'Samarqand', value: 15 },
  { name: 'Farg\'ona', value: 12 },
  { name: 'Andijon', value: 10 },
  { name: 'Namangan', value: 8 },
  { name: 'Buxoro', value: 7 },
  { name: 'Xorazm', value: 5 },
  { name: 'Boshqa', value: 8 },
];

const USAGE_STATS = [
  { name: 'Yan', users: 400, help: 240 },
  { name: 'Feb', users: 600, help: 380 },
  { name: 'Mar', users: 800, help: 520 },
  { name: 'Apr', users: 1200, help: 850 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-32">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Admin Panel</h1>
          <p className="text-on-surface-variant">Nafas ilovasi statistikasi va boshqaruvi</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <TrendingUp size={20} />
          +12% o'sish
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Jami ayollar" value="4,280" subValue="+120 bugun" color="bg-blue-500" />
        <StatCard icon={<Heart />} label="Yordam oldi" value="2,850" subValue="66% samaradorlik" color="bg-pink-500" />
        <StatCard icon={<MessageSquare />} label="Feedbacklar" value="840" subValue="4.8 o'rtacha ball" color="bg-green-500" />
        <StatCard icon={<AlertTriangle />} label="SOS chaqiriqlar" value="42" subValue="-5% o'tgan oydan" color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Region Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <MapPin className="text-primary" />
            Viloyatlar kesimida ro'yxatdan o'tganlar (%)
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REGION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {REGION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {REGION_DATA.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <TrendingUp className="text-primary" />
            Ilovadan foydalanish dinamikasi
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USAGE_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]} name="Foydalanuvchilar" />
                <Bar dataKey="help" fill="#82ca9d" radius={[4, 4, 0, 0]} name="Yordam olganlar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6">
        <h2 className="text-xl font-bold">So'nggi feedbacklar va kamchiliklar</h2>
        <div className="space-y-4">
          <FeedbackItem 
            user="Bloom" 
            text="Ilova juda foydali, ayniqsa huquqiy maslahatlar. Lekin chatda javoblar ba'zan sekinroq." 
            rating={4} 
            type="Kamchilik"
          />
          <FeedbackItem 
            user="Anonim Muslimacha" 
            text="SOS tugmasi hayotimni saqlab qoldi. Rahmat sizlarga!" 
            rating={5} 
            type="Yutuq"
          />
          <FeedbackItem 
            user="Qimmatxon" 
            text="Viloyatlarda ham ko'proq ekspertlar bo'lsa yaxshi bo'lardi." 
            rating={3} 
            type="Taklif"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 space-y-2">
      <div className={`w-10 h-10 ${color} text-white rounded-lg flex items-center justify-center`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-sm text-on-surface-variant">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-green-500 font-medium">{subValue}</span>
      </div>
    </div>
  );
}

function FeedbackItem({ user, text, rating, type }: any) {
  return (
    <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/10">
      <div className="flex justify-between items-center">
        <span className="font-bold text-primary">{user}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          type === 'Kamchilik' ? 'bg-red-100 text-red-600' : 
          type === 'Yutuq' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {type}
        </span>
      </div>
      <p className="text-sm text-on-surface-variant">{text}</p>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i < rating ? 'bg-yellow-400' : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
}
