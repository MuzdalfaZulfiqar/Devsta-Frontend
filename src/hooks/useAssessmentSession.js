// hooks/useAssessmentSession.js  (mocked version for testing)
import { useState, useEffect } from "react";

export default function useAssessmentSession(jobId) {
  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Mock session data — pretend the backend returned this
    const mockSession = {
      sessionId: "mock-session-123",
      startedAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
      testTotalTime: 45,
      challenges: [
        {
          challengeId: "ch1",
          title: "Echo Input",
          problemStatement: "Write a program that reads a single line of input and prints it exactly as received.",
          constraints: "Input will contain a single line of text.\nNo extra spaces or newlines allowed.\nMaximum length: 1000 characters.",
          testCases: [
            { input: "Hello", expected_output: "Hello" },
            { input: "World!", expected_output: "World!" },
            { input: "  leading spaces", expected_output: "  leading spaces" },
            { input: "12345", expected_output: "12345" },
          ],
          timeLimit: 15, // minutes
          order: 0,
        },
        {
          challengeId: "ch2",
          title: "Reverse String",
          problemStatement: "Write a function that takes a string and returns it reversed.",
          constraints: "String length between 1 and 5000 characters.\nMay contain any printable characters.",
          testCases: [
            { input: "hello", expected_output: "olleh" },
            { input: "racecar", expected_output: "racecar" },
            { input: "A man a plan a canal Panama", expected_output: "amanaP lanac a nalp a nam A" },
            { input: "12321", expected_output: "12321" },
          ],
          timeLimit: 20,
          order: 1,
        },
        {
          challengeId: "ch3",
          title: "Sum of Two Numbers",
          problemStatement: "Given two integers, return their sum.",
          constraints: "-10^9 ≤ a, b ≤ 10^9",
          testCases: [
            { input: "1\n2", expected_output: "3" },
            { input: "-5\n7", expected_output: "2" },
            { input: "0\n0", expected_output: "0" },
            { input: "1000000000\n-1000000000", expected_output: "0" },
          ],
          timeLimit: 10,
          order: 2,
        },
      ],
      submissions: [], // empty for now
    };

    setSession(mockSession);

    // Calculate initial time left
    const endTime = new Date(mockSession.endsAt).getTime();
    const remaining = Math.floor((endTime - Date.now()) / 1000);
    setTimeLeft(remaining > 0 ? remaining : 0);

    // Timer countdown
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((endTime - now) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
      if (remaining <= 0) {
        handleSubmit(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId]);

  const handleSubmit = (auto = false) => {
    if (submitted) return;
    setSubmitted(true);
    alert(auto ? "Time expired. Test auto-submitted." : "Test submitted successfully!");
    // In real version → call backend submit
  };

  return { session, timeLeft, submitted, handleSubmit };
}