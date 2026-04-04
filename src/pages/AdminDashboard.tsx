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

const COLORS = ['#8b80d0', '#82ca9d', '#00C49F', '#0088FE', '#FF8042', '#FFBB28', '#ffc658', '#ff8042'];

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-[#3c2a4d]">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Nafas ilovasi statistikasi va boshqaruvi</p>
        </div>
        <div className="bg-[#f3e8f4] text-[#a376ac] px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-sm">
          <TrendingUp size={18} />
          +12% o'sish
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={20} />} 
          label="Jami ayollar" 
          value="4,280" 
          subValue="+120 bugun" 
          iconColor="bg-[#3b82f6]" 
        />
        <StatCard 
          icon={<Heart size={20} />} 
          label="Yordam oldi" 
          value="2,850" 
          subValue="66% samaradorlik" 
          iconColor="bg-[#ec4899]" 
        />
        <StatCard 
          icon={<MessageSquare size={20} />} 
          label="Feedbacklar" 
          value="840" 
          subValue="4.8 o'rtacha ball" 
          iconColor="bg-[#22c55e]" 
        />
        <StatCard 
          icon={<AlertTriangle size={20} />} 
          label="SOS chaqiriqlar" 
          value="42" 
          subValue="-5% o'tgan oydan" 
          iconColor="bg-[#ef4444]" 
          isNegative={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Region Chart */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg text-[#3c2a4d]">
            <MapPin size={20} className="text-gray-400" />
            Viloyatlar kesimida ro'yxatdan o'tganlar (%)
          </div>
          <div className="h-[300px] flex items-center justify-center">
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
          <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-[11px] font-medium text-gray-500">
            {REGION_DATA.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg text-[#3c2a4d]">
            <TrendingUp size={20} className="text-gray-400" />
            Ilovadan foydalanish dinamikasi
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USAGE_STATS} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="users" fill="#8b80d0" radius={[4, 4, 0, 0]} barSize={35} />
                <Bar dataKey="help" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-2xl font-bold text-[#3c2a4d]">So'nggi feedbacklar va kamchiliklar</h2>
        <div className="space-y-4">
          <FeedbackItem 
            user="Bloom" 
            text="Ilova juda foydali, ayniqsa huquqiy maslahatlar. Lekin chatda javoblar ba'zan sekinroq." 
            type="Kamchilik"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, iconColor, isNegative }: any) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className={`w-10 h-10 ${iconColor} text-white rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#3c2a4d]">{value}</span>
          <span className={`text-[10px] font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
            {subValue}
          </span>
        </div>
      </div>
    </div>
  );
}

function FeedbackItem({ user, text, type }: any) {
  return (
    <div className="p-6 bg-[#fdf8fb] rounded-2xl space-y-2 border border-gray-50">
      <div className="flex justify-between items-center">
        <span className="font-bold text-[#3c2a4d]">{user}</span>
        <span className="text-[10px] px-3 py-1 bg-red-100 text-red-600 rounded-full font-bold">
          {type}
        </span>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}
