
import React, { useState, useEffect } from 'react';
import ModerationQueue from '../../components/admin/ModerationQueue';

export default function ModerationPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('devsta_token');
      const res = await fetch(
        'http://localhost:5000/api/moderation/stats',
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch');
      setStats(await res.json());
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Moderated</p>
            <p className="text-3xl font-bold">{stats.totalModerated}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Auto-Hidden</p>
            <p className="text-3xl font-bold text-red-600">{stats.autoHidden}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>
      )}

      <ModerationQueue />
    </div>
  );
}
