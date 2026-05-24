import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  RefreshCcw, 
  ShieldCheck, 
  ChevronRight,
  Loader2,
  Calendar,
  Mail,
  DollarSign,
  Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchEntries();
    } else {
      setError('Invalid credentials');
    }
  };

  const fetchEntries = async () => {
    if (!supabase) {
      setError('Database connection not configured.');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedData = (data || []).map(entry => ({
        ...entry,
        excitedFeature: entry.excited_feature,
        userType: entry.user_type,
        createdAt: new Date(entry.created_at)
      }));
      
      setEntries(formattedData);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const { error: deleteError } = await supabase
        .from('waitlist')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setEntries(entries.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'WTP', 'Feature', 'Date'];
    const rows = entries.map(e => [
      e.name,
      e.email,
      e.wtp,
      e.excitedFeature,
      e.createdAt.toLocaleString()
    ]);
    
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredEntries = entries.filter(e => 
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Access Token</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button className="w-full bg-neutral-100 text-neutral-950 font-bold py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
              Unlock Dashboard <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 lg:p-12">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-500" />
            Waitlist Management
          </h1>
          <p className="text-neutral-500 mt-1">Real-time overview of your future customers.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchEntries}
            className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-all text-neutral-400"
          >
            <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 text-neutral-950 font-bold hover:bg-white transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Total Signups</p>
            <p className="text-4xl font-bold">{entries.length}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">New This Week</p>
            <p className="text-4xl font-bold">
              {entries.filter(e => e.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">High Intent ($20+)</p>
            <p className="text-4xl font-bold">
              {entries.filter(e => e.wtp === '$20+ per month').length}
            </p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden">
          <div className="p-6 border-b border-neutral-800 flex items-center gap-4">
            <Search className="w-5 h-5 text-neutral-600" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-neutral-600"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800">
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Preferences</th>
                  <th className="px-8 py-6">Joined</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-orange-500">
                          {entry.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-200">{entry.name || 'Anonymous'}</p>
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {entry.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <DollarSign className="w-3 h-3 text-green-500" />
                          <span className="text-neutral-300">{entry.wtp || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Star className="w-3 h-3 text-purple-500" />
                          <span className="text-neutral-500 italic">{entry.excitedFeature || 'No preference'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Calendar className="w-3 h-3" />
                        {entry.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEntries.length === 0 && !isLoading && (
            <div className="py-24 text-center">
              <Users className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
              <p className="text-neutral-500">No matching entries found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
