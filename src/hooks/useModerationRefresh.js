// hooks/useModerationRefresh.js
// Use this hook in CommentSection to trigger dashboard refresh

import { useCallback } from 'react';

export function useModerationRefresh() {
  const refreshModerationAlerts = useCallback(() => {
    // ✅ Call the function stored on window by Dashboard
    if (window._refreshModerationAlerts) {
      window._refreshModerationAlerts();
      console.log('✅ Moderation alerts refreshed');
    } else {
      console.warn('⚠️ Dashboard not initialized or refresh function not available');
    }
  }, []);

  return { refreshModerationAlerts };
}