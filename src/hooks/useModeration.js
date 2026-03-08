import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../../config';

export function useModeration() {
  const { user } = useAuth();  // ✅ Get user from AuthContext

  const moderateContent = useCallback(async (contentType, contentId, text) => {
    try {
      const token = localStorage.getItem('devsta_token');
      
      // ✅ Use user from context instead of localStorage
      if (!user || !user._id) {
        throw new Error('User not found - please log in');
      }

      const res = await fetch(`${BACKEND_URL}/api/moderation/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contentType,
          contentId,
          text,
          authorId: user._id,  // ✅ Use user._id from context
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || 'Moderation failed');
      }
      
      return await res.json();
    } catch (err) {
      console.error('Moderation error:', err);
      throw err;
    }
  }, [user]);  // ✅ Add user to dependency array

  return { moderateContent };
}