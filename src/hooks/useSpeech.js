import { useRef, useState, useCallback, useEffect } from "react";

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sttSupported, setSttSupported] = useState(true);
  const [sttMode, setSttMode] = useState("speech");
  const [micError, setMicError] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const finalTranscriptRef = useRef("");
  const isListeningRef = useRef(false); // ← track real state in ref
  const restartTimerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSttSupported(false);
      setSttMode("typing");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += text;
        else interim += text;
      }
      if (final) {
        finalTranscriptRef.current += " " + final;
        setTranscript(finalTranscriptRef.current.trim());
      } else {
        setTranscript((finalTranscriptRef.current + " " + interim).trim());
      }
    };

    recognition.onerror = (e) => {
      console.warn("STT error:", e.error);
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        setSttMode("typing");
        setMicError("not-allowed");
        isListeningRef.current = false;
        setIsListening(false);
      } else if (e.error === "network") {
        // Don't switch to typing — network errors are transient
        // Just let onend handle the restart
        console.warn("STT network error — will retry");
      } else if (e.error === "no-speech") {
        // Normal — do nothing, let it restart via onend
      } else {
        console.warn("STT unknown error:", e.error);
      }
    };

    // KEY FIX: onend fires when recognition stops for ANY reason
    // If we're still supposed to be listening, restart it
    recognition.onend = () => {
      if (isListeningRef.current) {
        // We want to keep listening — restart after brief pause
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (e) {
              // Already started, ignore
            }
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(restartTimerRef.current);
      try { recognition.stop(); } catch (e) {}
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || sttMode === "typing") return;
    finalTranscriptRef.current = "";
    setTranscript("");
    setMicError(null);
    isListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition start failed:", e.message);
      // Already running is fine
    }
  }, [sttMode]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    clearTimeout(restartTimerRef.current);
    setIsListening(false);
    try { recognitionRef.current?.stop(); } catch (e) {}
    return finalTranscriptRef.current.trim();
  }, []);

  const speak = useCallback((text, { onEnd } = {}) => {
    if (!text) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const voices = synthRef.current.getVoices();
    const preferred =
      voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); onEnd?.(); };
    utterance.onerror = () => { setIsSpeaking(false); onEnd?.(); };
    synthRef.current.speak(utterance);
  }, []);

  const cancelSpeech = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  const setTypedTranscript = useCallback((val) => {
    finalTranscriptRef.current = val;
    setTranscript(val);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    setTranscript: (val) => {
      finalTranscriptRef.current = "";
      setTranscript(val);
    },
    sttSupported,
    sttMode,
    micError,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    setTypedTranscript,
  };
}