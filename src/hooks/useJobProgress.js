/**
 * src/hooks/useJobProgress.js
 */

import { useState, useEffect, useRef } from "react";
import { getJobStatus } from "../api/monetizationApi";

const WS_BASE = "ws://127.0.0.1:8000/api/m5";
const TERMINAL = new Set(["complete", "failed"]);

export function useJobProgress(jobId, userId) {   // ← ADD userId param
  const [status,   setStatus]   = useState("pending");
  const [progress, setProgress] = useState(0);
  const [error,    setError]    = useState(null);
  const wsRef  = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;

    let wsOk = false;

    try {
      // ── Pass userId as ?token= so ws_router.py can auth the connection ──
      const wsUrl = userId
        ? `${WS_BASE}/ws/jobs/${jobId}?token=${encodeURIComponent(userId)}`
        : `${WS_BASE}/ws/jobs/${jobId}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => { wsOk = true; };

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.error) {
          setError(data.error);
          ws.close();
          return;
        }
        setStatus(data.status);
        setProgress(data.progress);
        if (TERMINAL.has(data.status)) ws.close();
      };

      ws.onerror = () => {
        if (!wsOk) startPolling();
      };

      ws.onclose = () => {};
    } catch {
      startPolling();
    }

    function startPolling() {
      pollRef.current = setInterval(async () => {
        try {
          const data = await getJobStatus(jobId);
          setStatus(data.status);
          setProgress(data.progress);
          if (data.error) setError(data.error);
          if (TERMINAL.has(data.status)) clearInterval(pollRef.current);
        } catch (err) {
          setError(err.message);
          clearInterval(pollRef.current);
        }
      }, 2000);
    }

    return () => {
      wsRef.current?.close();
      clearInterval(pollRef.current);
    };
  }, [jobId, userId]);   // ← add userId to deps

  return {
    status,
    progress,
    error,
    isDone:   status === "complete",
    isFailed: status === "failed",
  };
}