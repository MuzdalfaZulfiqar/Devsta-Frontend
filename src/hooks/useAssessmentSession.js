// // hooks/useAssessmentSession.js
// import { useState, useEffect } from "react";

// export default function useAssessmentSession(jobId) {
//   const [session, setSession] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch session once on mount
//   useEffect(() => {
//     if (!jobId) {
//       setError("No job ID provided");
//       setLoading(false);
//       return;
//     }

//     const fetchSession = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token"); // or however you store it
//         if (!token) throw new Error("No authentication token found");

//         const res = await fetch(`/api/developer/${jobId}/session`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.error || "Failed to load test session");
//         }

//         setSession(data);
//         setError(null);

//         // Calculate initial time left
//         const endTime = new Date(data.endsAt).getTime();
//         const remaining = Math.floor((endTime - Date.now()) / 1000);
//         setTimeLeft(remaining > 0 ? remaining : 0);
//       } catch (err) {
//         setError(err.message);
//         console.error("Session fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSession();

//     // Refresh session every 30 seconds (handles expiry, status changes)
//     const refreshInterval = setInterval(fetchSession, 30000);
//     return () => clearInterval(refreshInterval);
//   }, [jobId]);

//   // Countdown timer
//   useEffect(() => {
//     if (timeLeft <= 0 || submitted || loading) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           handleSubmit(true); // auto-submit when time reaches 0
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, submitted, loading]);

//   const handleSubmit = async (auto = false) => {
//     if (submitted) return;

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`/api/developer/${jobId}/submit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to submit test");
//       }

//       setSubmitted(true);
//       alert(auto ? "Time expired. Test auto-submitted." : "Test submitted successfully!");
//     } catch (err) {
//       console.error("Submit failed:", err);
//       alert("Submission failed. Please try again or contact support.");
//     }
//   };

//   return { session, timeLeft, submitted, handleSubmit, error, loading };
// }

// import { useState, useEffect } from "react";
// import { BACKEND_URL } from "../../config";

// export default function useAssessmentSession(jobId) {
//   const [session, setSession] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!jobId) {
//       setError("No job ID provided");
//       setLoading(false);
//       return;
//     }

//     const initializeSession = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("devsta_token");
//         if (!token) {
//           throw new Error("No authentication token found. Please log in again.");
//         }

//         const headers = {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         };

//         // Try to get existing session
//         let res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/session`, { headers });

//         let data;
//         if (res.ok) {
//           data = await res.json();
//         } else if (res.status === 404) {
//           // No session → start one
//           console.log("No session found, starting new test...");
//           res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/start`, {
//             method: "POST",
//             headers,
//           });

//           if (!res.ok) {
//             const errData = await res.json();
//             throw new Error(errData.error || "Failed to start test session");
//           }

//           // Fetch the new session
//           res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/session`, { headers });
//           if (!res.ok) {
//             const errData = await res.json();
//             throw new Error(errData.error || "Failed to fetch session after start");
//           }

//           data = await res.json();
//         } else {
//           const errData = await res.json();
//           throw new Error(errData.error || "Failed to load test session");
//         }

//         // Set session and calculate time
//         setSession(data);
//         if (data?.endsAt) {
//           const endTime = new Date(data.endsAt).getTime();
//           const remaining = Math.floor((endTime - Date.now()) / 1000);
//           setTimeLeft(remaining > 0 ? remaining : 0);
//         }

//       } catch (err) {
//         setError(err.message);
//         console.error("Session initialization error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeSession();

//     const refreshInterval = setInterval(initializeSession, 30000);
//     return () => clearInterval(refreshInterval);
//   }, [jobId]);

//   // Timer countdown — guard against null session
//   useEffect(() => {
//     if (timeLeft <= 0 || submitted || loading || !session?.endsAt) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           handleSubmit(true);
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, submitted, loading, session]);

//  const handleSubmit = async (auto = false) => {
//   if (submitted) return;

//   try {
//     const token = localStorage.getItem("devsta_token");
//     if (!token) throw new Error("No authentication token found");

//     const res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/submit`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || "Failed to submit test");
//     }

//     setSubmitted(true);

//     // Show nice modal instead of alert
//     setInfoModal({
//       open: true,
//       title: auto ? "Time Expired" : "Test Submitted",
//       message: auto 
//         ? "Your time has expired. The test has been auto-submitted." 
//         : "Your test has been submitted successfully!",
//     });

//   } catch (err) {
//     console.error("Submit failed:", err);
//     setInfoModal({
//       open: true,
//       title: "Submission Failed",
//       message: err.message || "Something went wrong. Please try again.",
//     });
//   }
// };

//   return { session, timeLeft, submitted, handleSubmit, error, loading };
// }


// import { useState, useEffect } from "react";
// import { BACKEND_URL } from "../../config";

// export default function useAssessmentSession(jobId) {
//   const [session, setSession] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!jobId) {
//       setError("No job ID provided");
//       setLoading(false);
//       return;
//     }

//     const initializeSession = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("devsta_token");
//         if (!token) {
//           throw new Error("No authentication token found. Please log in again.");
//         }

//         const headers = {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         };

//         let res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/session`, { headers });
//         let data;

//         if (res.ok) {
//           data = await res.json();
//         } else if (res.status === 404) {
//           // No session → auto-start
//           res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/start`, {
//             method: "POST",
//             headers,
//           });

//           if (!res.ok) {
//             const errData = await res.json();
//             throw new Error(errData.error || "Failed to start test session");
//           }

//           // Fetch newly created session
//           res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/session`, { headers });
//           if (!res.ok) {
//             const errData = await res.json();
//             throw new Error(errData.error || "Failed to fetch session after start");
//           }

//           data = await res.json();
//         } else {
//           const errData = await res.json();
//           throw new Error(errData.error || "Failed to load test session");
//         }

//         setSession(data);
//         if (data?.endsAt) {
//           const endTime = new Date(data.endsAt).getTime();
//           const remaining = Math.floor((endTime - Date.now()) / 1000);
//           setTimeLeft(remaining > 0 ? remaining : 0);
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error("Session init error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeSession();

//     // Refresh every 30s
//     const refreshInterval = setInterval(initializeSession, 30000);
//     return () => clearInterval(refreshInterval);
//   }, [jobId]);

//   // Countdown timer
//   useEffect(() => {
//     if (timeLeft <= 0 || submitted || loading || !session?.endsAt) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           handleSubmit(true); // auto-submit on timeout
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, submitted, loading, session]);

//   const handleSubmit = async (auto = false) => {
//     if (submitted) return { success: false, error: "Already submitted" };

//     try {
//       const token = localStorage.getItem("devsta_token");
//       if (!token) throw new Error("No authentication token found");

//       const res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/submit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to submit test");
//       }

//       setSubmitted(true);
//       return { success: true, auto };
//     } catch (err) {
//       console.error("Submit failed:", err);
//       return { success: false, error: err.message };
//     }
//   };

//   return { session, timeLeft, submitted, handleSubmit, error, loading };
// }



import { useState, useEffect, useRef } from "react";
import { BACKEND_URL } from "../../config";

export default function useAssessmentSession(jobId) {
  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const initRef = useRef(0);
  
  // const handleSubmit = async (auto = false, reason = null) => {
  //   if (submitted) return { success: false, error: "Already submitted" };
  
  //   try {
  //     const token = localStorage.getItem("devsta_token");
  //     const res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/submit`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ 
  //         auto,
  //         reason: auto ? (reason || "unknown_auto_reason") : null
  //       }),
  //     });
  
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error || "Submit failed");
  
  //     setSubmitted(true);
  
  //     // Update local session state immediately
  //     setSession(prev => prev ? {
  //       ...prev,
  //       status: auto ? "auto-submitted" : "submitted",
  //       submissionType: auto ? "auto" : "manual",
  //       autoSubmitReason: auto ? (reason || "violation_detected") : null,
  //       closedAt: new Date().toISOString()
  //     } : prev);
  
  //     return { success: true, auto };
  //   } catch (err) {
  //     console.error("Submit failed:", err);
  //     return { success: false, error: err.message };
  //   }
  // };
  // useAssessmentSession hook
const handleSubmit = async (auto = false, reason = null, submissions = []) => {
  if (submitted) return { success: false, error: "Already submitted" };

  try {
    const token = localStorage.getItem("devsta_token");
    const res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        auto,
        reason: auto ? (reason || "unknown_auto_reason") : null,
        submissions   // ← NEW: send the array!
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Submit failed");

    setSubmitted(true);

    setSession(prev => prev ? {
      ...prev,
      status: auto ? "auto-submitted" : "submitted",
      submissionType: auto ? "auto" : "manual",
      autoSubmitReason: auto ? (reason || "violation_detected") : null,
      closedAt: new Date().toISOString()
    } : prev);

    return { success: true, auto };
  } catch (err) {
    console.error("Submit failed:", err);
    return { success: false, error: err.message };
  }
};
  
  
  useEffect(() => {
    if (!jobId) {
      setError("No job ID provided");
      setLoading(false);
      return;
    }

    const initializeSession = async () => {
      if (isInitializing || submitted) return;

      setIsInitializing(true);
      setLoading(true);
      if (initRef.current === 0) setError(null);

      try {
        const token = localStorage.getItem("devsta_token");
        if (!token) throw new Error("No authentication token found.");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        let res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/session`, { headers });
        let data;

        if (res.ok) {
          data = await res.json();
        } else if (res.status === 404) {
          // No session → start new
          res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/start`, {
            method: "POST",
            headers,
          });

          if (res.ok) {
            res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/session`, { headers });
            if (!res.ok) throw new Error("Failed to fetch after start");
            data = await res.json();
          } else {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.error || "Failed to start";

            if (msg.toLowerCase().includes("already started") || res.status === 400) {
              console.warn(`[useAssessmentSession ${jobId}] 400 detected:`, msg);

              if (msg.toLowerCase().includes("submitted") || msg.toLowerCase().includes("closed")) {
                // Already submitted → show message, no retry
                setError("This test has already been submitted. You cannot start it again.");
                return;
              }

              // Possible race → retry limited times
              if (initRef.current < 3) {
                setTimeout(initializeSession, 800);
                return;
              } else {
                setError("Could not start test session. Please refresh or contact support.");
                return;
              }
            }

            throw new Error(msg);
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load session");
        }

        setSession(data);
        setError(null);

        if (data?.status === "submitted" || data?.status === "auto-submitted") {
          setSubmitted(true);
        }

        if (data?.endsAt) {
          const endTime = new Date(data.endsAt).getTime();
          const remaining = Math.floor((endTime - Date.now()) / 1000);
          setTimeLeft(remaining > 0 ? remaining : 0);
        }
      } catch (err) {
        console.error("Session init error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setIsInitializing(false);
        initRef.current++;
      }
    };

    initializeSession();

    // Poll only when needed
    const interval = setInterval(() => {
      if (session && !submitted && timeLeft > 15 && !isInitializing) {
        initializeSession();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [jobId]); // ← important: only jobId dependency

  // Countdown timer
  // useEffect(() => {
  //   if (timeLeft <= 0 || submitted || loading || !session?.endsAt) return;

  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => {
  //       if (prev <= 1) {
  //         handleSubmit(true);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [timeLeft, submitted, loading, session]);


  useEffect(() => {
  if (timeLeft <= 0 || submitted || loading || !session?.endsAt) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        handleSubmit(true, "time_expired");   // ← send reason
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, submitted, loading, session, handleSubmit]);


  // const handleSubmit = async (auto = false) => {
  //   if (submitted) return { success: false, error: "Already submitted" };

  //   try {
  //     const token = localStorage.getItem("devsta_token");
  //     const res = await fetch(`${BACKEND_URL}/api/developer/test/${jobId}/submit`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error || "Submit failed");

  //     setSubmitted(true);
  //     return { success: true, auto };
  //   } catch (err) {
  //     return { success: false, error: err.message };
  //   }
  // };
// in useAssessmentSession hook — improve handleSubmit
  return { session, timeLeft, submitted, handleSubmit, error, loading, isInitializing };
}