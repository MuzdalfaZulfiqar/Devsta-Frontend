
import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

export default function ModerationQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchQueue();
  }, [page]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('devsta_token');
      const res = await fetch(
        `http://localhost:5000/api/moderation/queue?page=${page}&limit=20`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (logId, decision, notes = '') => {
    try {
      const token = localStorage.getItem('devsta_token');
      const res = await fetch(
        `http://localhost:5000/api/moderation/review/${logId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ decision, notes }),
        }
      );

      if (!res.ok) throw new Error('Review failed');

      setItems(prev => prev.filter(i => i._id !== logId));
    } catch (err) {
      console.error('Review error:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiAlertCircle className="text-orange-500" />
        Moderation Queue ({total})
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No items to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p className="font-bold">{item.violationType}</p>
                  <p className="text-sm text-gray-600">By: {item.authorId.name}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  item.severity === 'high' ? 'bg-red-100 text-red-800' :
                  item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {item.severity}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleReview(item._id, 'approve')}
                  className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <FiCheck /> Approve
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Reason for rejection:');
                    if (notes) handleReview(item._id, 'reject', notes);
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FiX /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

