import React from 'react';
import { useData } from '../contexts/DataProvider';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Wallet, ArrowUpRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTranslation } from '../lib/i18n';
import { formatCurrency, formatNumber } from '../lib/formatters';

const Dashboard: React.FC = () => {
  const { invoices, stats } = useData();
  const { t } = useTranslation();

  // Determine health status based on overdue revenue
  const healthStatus = stats.overdueRevenue > 2000 ? t.dashboard.healthAttention : t.dashboard.healthExcellent;
  const healthColor = stats.overdueRevenue > 2000 ? 'text-orange-700 bg-orange-100 border-orange-200' : 'text-green-700 bg-green-100 border-green-200';

  // Mock chart data generation (simplified with French months)
  const chartData = [
    { name: 'Jan', ca: 4000, treso: 2400 },
    { name: 'Fév', ca: 3000, treso: 1398 },
    { name: 'Mar', ca: 9800, treso: 9800 },
    { name: 'Avr', ca: 3908, treso: 3908 },
    { name: 'Mai', ca: 4800, treso: 4800 },
    { name: 'Juin', ca: 3800, treso: 3800 },
    { name: 'Juil', ca: stats.totalRevenue / 3, treso: stats.totalRevenue / 3.5 }, 
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {t.dashboard.title}
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h1>
          <p className="text-slate-500 mt-1">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex items-center self-start md:self-auto">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border shadow-sm transition-all duration-500 ${healthColor}`}>
            <Activity size={14} className="mr-1.5" /> {healthStatus}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard 
          title={t.dashboard.kpi.revenue} 
          value={stats.totalRevenue} 
          icon={Wallet} 
          color="blue" 
          trend="+12,5 %" 
          footerLabel={t.dashboard.kpi.vsLastMonth}
        />
        <KPICard 
          title={t.dashboard.kpi.pending} 
          value={stats.pendingRevenue} 
          icon={Clock} 
          color="orange" 
          footerLabel={`${invoices.filter(i => i.status === 'SENT').length} factures en cours`}
        />
        <KPICard 
          title={t.dashboard.kpi.overdue} 
          value={stats.overdueRevenue} 
          icon={AlertCircle} 
          color="red" 
          trend={stats.overdueRevenue > 0 ? t.dashboard.kpi.actionRequired : t.dashboard.kpi.allGood}
          trendColor={stats.overdueRevenue > 0 ? "text-red-500" : "text-green-500"}
          footerLabel={`${invoices.filter(i => i.status === 'OVERDUE').length} relances à faire`}
        />
        <KPICard 
          title={t.dashboard.kpi.invoicesTotal} 
          value={stats.invoicesCount} 
          isCurrency={false}
          icon={TrendingUp} 
          color="indigo" 
          trend="Base active"
          trendColor="text-indigo-600"
          footerLabel={`${stats.clientsCount} Clients`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ArrowUpRight size={20} className="text-blue-500"/> {t.dashboard.charts.revenueEvolution}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  cursor={{stroke: '#3b82f6', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="ca" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCa)" activeDot={{r: 6, strokeWidth: 0}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Wallet size={20} className="text-indigo-500"/> {t.dashboard.charts.cashForecast}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                   formatter={(value: number) => formatCurrency(value)}
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="treso" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, color, trend, footerLabel, isCurrency = true, trendColor = "text-green-600" }: any) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 transition-all duration-500">
            {isCurrency && typeof value === 'number' 
              ? formatCurrency(value)
              : value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${(colorStyles as any)[color]} bg-opacity-50`}>
          <Icon size={22} />
        </div>
      </div>
      
      {(trend || footerLabel) && (
        <div className="flex items-center text-sm">
          {trend && (
            <span className={`font-bold ${trendColor} flex items-center mr-2`}>
               {trend}
            </span>
          )}
          <span className="text-slate-400 truncate">{footerLabel}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;