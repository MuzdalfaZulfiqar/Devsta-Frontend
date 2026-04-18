// import { useRef, useState, useCallback, useEffect } from "react";

// export function useSpeech({ onTranscriptFinal } = {}) {
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [sttSupported, setSttSupported] = useState(true);

//   const recognitionRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);
//   const finalTranscriptRef = useRef("");

//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       setSttSupported(false);
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = "en-US";
//     recognition.maxAlternatives = 1;

//     recognition.onresult = (event) => {
//       let interim = "";
//       let final = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const text = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           final += text;
//         } else {
//           interim += text;
//         }
//       }

//       if (final) {
//         finalTranscriptRef.current += " " + final;
//         setTranscript(finalTranscriptRef.current.trim());
//       } else {
//         setTranscript((finalTranscriptRef.current + " " + interim).trim());
//       }
//     };

//     recognition.onerror = (e) => {
//       if (e.error !== "no-speech") {
//         console.warn("STT error:", e.error);
//       }
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   const startListening = useCallback(() => {
//     if (!recognitionRef.current) return;
//     finalTranscriptRef.current = "";
//     setTranscript("");
//     try {
//       recognitionRef.current.start();
//       setIsListening(true);
//     } catch (e) {
//       console.warn("Recognition start failed:", e);
//     }
//   }, []);

//   const stopListening = useCallback(() => {
//     if (!recognitionRef.current) return;
//     try {
//       recognitionRef.current.stop();
//     } catch (e) {}
//     setIsListening(false);
//     return finalTranscriptRef.current.trim();
//   }, []);

//   const speak = useCallback((text, { onEnd } = {}) => {
//     if (!text) return;
//     synthRef.current.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.92;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     const voices = synthRef.current.getVoices();
//     const preferred =
//       voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en-US")) ||
//       voices.find((v) => v.lang.startsWith("en-US")) ||
//       voices.find((v) => v.lang.startsWith("en"));

//     if (preferred) utterance.voice = preferred;

//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       onEnd?.();
//     };
//     utterance.onerror = () => setIsSpeaking(false);

//     synthRef.current.speak(utterance);
//   }, []);

//   const cancelSpeech = useCallback(() => {
//     synthRef.current.cancel();
//     setIsSpeaking(false);
//   }, []);

//   return {
//     isListening,
//     isSpeaking,
//     transcript,
//     setTranscript,
//     sttSupported,
//     startListening,
//     stopListening,
//     speak,
//     cancelSpeech,
//   };
// }
import { useRef, useState, useCallback, useEffect } from "react";

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sttMode, setSttMode] = useState("speech"); // "speech" | "typing"

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const finalRef = useRef("");
  const listeningRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSttMode("typing"); return; }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";

    r.onstart = () => { setIsListening(true); };

    r.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) {
        finalRef.current = (finalRef.current + " " + final).trim();
      }
      setTranscript((finalRef.current + " " + interim).trim());
    };

    r.onend = () => {
      if (listeningRef.current) {
        try { r.start(); } catch(e) {}
      } else {
        setIsListening(false);
      }
    };

    r.onerror = (e) => {
      console.warn("STT error:", e.error);
      if (e.error === "network") {
        // Google STT servers unreachable — switch to typing mode
        setSttMode("typing");
        listeningRef.current = false;
        setIsListening(false);
      } else if (e.error === "not-allowed") {
        setSttMode("typing");
        listeningRef.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = r;
  }, []);

  const startListening = useCallback(() => {
    if (sttMode === "typing") {
      // in typing mode, just signal that we're "listening" (user types)
      finalRef.current = "";
      setTranscript("");
      setIsListening(true);
      return;
    }
    if (listeningRef.current) return;
    finalRef.current = "";
    setTranscript("");
    listeningRef.current = true;
    try { recognitionRef.current?.start(); } catch(e) {}
  }, [sttMode]);

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    setIsListening(false);
    try { recognitionRef.current?.stop(); } catch(e) {}
    return finalRef.current.trim();
  }, []);

  // For typing mode — user types directly into transcript
  const setTypedTranscript = useCallback((text) => {
    finalRef.current = text;
    setTranscript(text);
  }, []);

  const speak = useCallback((text, { onEnd } = {}) => {
    if (!text) { onEnd?.(); return; }
    synthRef.current.cancel();
    const go = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9; u.pitch = 1.0; u.volume = 1.0;
      const voices = synthRef.current.getVoices();
      const v = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en-US"))
             || voices.find(v => v.lang.startsWith("en-US"))
             || voices[0];
      if (v) u.voice = v;
      u.onstart = () => setIsSpeaking(true);
      u.onend   = () => { setIsSpeaking(false); onEnd?.(); };
      u.onerror = () => { setIsSpeaking(false); onEnd?.(); };
      synthRef.current.speak(u);
    };
    if (synthRef.current.getVoices().length) go();
    else synthRef.current.addEventListener("voiceschanged", go, { once: true });
  }, []);

  const cancelSpeech = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening, isSpeaking, transcript, setTranscript,
    sttMode, setTypedTranscript,
    startListening, stopListening, speak, cancelSpeech,
  };
}