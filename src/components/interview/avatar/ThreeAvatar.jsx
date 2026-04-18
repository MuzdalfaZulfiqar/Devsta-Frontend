// // components/avatar/ThreeAvatar.jsx
// import { useRef, useImperativeHandle, forwardRef, useState, useEffect, useCallback } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, Text, Html } from '@react-three/drei';
// import * as THREE from 'three';
// import { Volume2, VolumeX } from "lucide-react";

// // Inner 3D Avatar Component
// const AvatarModel = forwardRef(({ isSpeaking, isThinking, mouthOpen }, ref) => {
//   const groupRef = useRef();
//   const headRef = useRef();
//   const leftEyeRef = useRef();
//   const rightEyeRef = useRef();
//   const mouthRef = useRef();
//   const [blink, setBlink] = useState(false);
//   const [lookAt, setLookAt] = useState({ x: 0, y: 0 });

//   // Auto blink every 3-5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBlink(true);
//       setTimeout(() => setBlink(false), 150);
//     }, 3000 + Math.random() * 2000);
//     return () => clearInterval(interval);
//   }, []);

//   // Eye movement - follow mouse
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       const x = (e.clientX / window.innerWidth) * 2 - 1;
//       const y = (e.clientY / window.innerHeight) * 2 - 1;
//       setLookAt({ x: x * 0.3, y: y * 0.2 });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Animate head and eyes
//   useFrame((state) => {
//     if (groupRef.current) {
//       // Subtle idle animation
//       const time = state.clock.getElapsedTime();
//       groupRef.current.position.y = Math.sin(time * 1.5) * 0.02;
      
//       // Head tilt when thinking
//       if (isThinking) {
//         groupRef.current.rotation.z = Math.sin(time * 3) * 0.03;
//         groupRef.current.rotation.x = Math.sin(time * 2) * 0.02;
//       } else {
//         groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.01;
//         groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.005;
//       }
//     }

//     // Eye movement
//     if (leftEyeRef.current && rightEyeRef.current) {
//       leftEyeRef.current.position.x = lookAt.x * 0.1;
//       leftEyeRef.current.position.y = lookAt.y * 0.08;
//       rightEyeRef.current.position.x = lookAt.x * 0.1;
//       rightEyeRef.current.position.y = lookAt.y * 0.08;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       {/* Body */}
//       <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
//         <cylinderGeometry args={[0.6, 0.5, 1.2, 32]} />
//         <meshStandardMaterial color="#2c2c3e" roughness={0.3} metalness={0.1} />
//       </mesh>

//       {/* Neck */}
//       <mesh position={[0, -0.2, 0]} castShadow>
//         <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
//         <meshStandardMaterial color="#3a3a4e" />
//       </mesh>

//       {/* Head */}
//       <mesh ref={headRef} position={[0, 0.2, 0]} castShadow receiveShadow>
//         <sphereGeometry args={[0.55, 64, 64]} />
//         <meshStandardMaterial color="#3d3d54" roughness={0.2} metalness={0.05} />
//       </mesh>

//       {/* Hair */}
//       <mesh position={[0, 0.55, 0.1]} castShadow>
//         <sphereGeometry args={[0.58, 32, 32]} />
//         <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
//       </mesh>

//       {/* Eyes White */}
//       <mesh ref={leftEyeRef} position={[-0.2, 0.35, 0.52]} castShadow>
//         <sphereGeometry args={[0.12, 32, 32]} />
//         <meshStandardMaterial color="#ffffff" roughness={0.1} />
//       </mesh>
//       <mesh ref={rightEyeRef} position={[0.2, 0.35, 0.52]} castShadow>
//         <sphereGeometry args={[0.12, 32, 32]} />
//         <meshStandardMaterial color="#ffffff" roughness={0.1} />
//       </mesh>

//       {/* Pupils */}
//       <mesh position={[-0.2 + lookAt.x * 0.05, 0.35 + lookAt.y * 0.04, 0.64]}>
//         <sphereGeometry args={[0.07, 32, 32]} />
//         <meshStandardMaterial color="#1a1a2e" />
//       </mesh>
//       <mesh position={[0.2 + lookAt.x * 0.05, 0.35 + lookAt.y * 0.04, 0.64]}>
//         <sphereGeometry args={[0.07, 32, 32]} />
//         <meshStandardMaterial color="#1a1a2e" />
//       </mesh>

//       {/* Eye highlights */}
//       <mesh position={[-0.24 + lookAt.x * 0.04, 0.39 + lookAt.y * 0.03, 0.66]}>
//         <sphereGeometry args={[0.03, 16, 16]} />
//         <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
//       </mesh>
//       <mesh position={[0.16 + lookAt.x * 0.04, 0.39 + lookAt.y * 0.03, 0.66]}>
//         <sphereGeometry args={[0.03, 16, 16]} />
//         <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
//       </mesh>

//       {/* Blink eyelids */}
//       {blink && (
//         <>
//           <mesh position={[-0.2, 0.35, 0.6]} scale={[0.26, 0.04, 0.1]}>
//             <boxGeometry />
//             <meshStandardMaterial color="#3d3d54" />
//           </mesh>
//           <mesh position={[0.2, 0.35, 0.6]} scale={[0.26, 0.04, 0.1]}>
//             <boxGeometry />
//             <meshStandardMaterial color="#3d3d54" />
//           </mesh>
//         </>
//       )}

//       {/* Eyebrows */}
//       <mesh position={[-0.2, 0.48, 0.52]} scale={[0.18, 0.05, 0.05]} rotation={[0, 0, -0.2]}>
//         <boxGeometry />
//         <meshStandardMaterial color="#1a1a2e" />
//       </mesh>
//       <mesh position={[0.2, 0.48, 0.52]} scale={[0.18, 0.05, 0.05]} rotation={[0, 0, 0.2]}>
//         <boxGeometry />
//         <meshStandardMaterial color="#1a1a2e" />
//       </mesh>

//       {/* MOUTH - animates based on speech! */}
//       <mesh ref={mouthRef} position={[0, 0.22, 0.52]} scale={[0.35, 0.08 + mouthOpen * 0.12, 0.1]} castShadow>
//         <boxGeometry />
//         <meshStandardMaterial color="#6a2a2a" />
//       </mesh>

//       {/* Nose */}
//       <mesh position={[0, 0.28, 0.6]} castShadow>
//         <sphereGeometry args={[0.08, 16, 16]} />
//         <meshStandardMaterial color="#4a4a64" />
//       </mesh>

//       {/* Glasses */}
//       <mesh position={[-0.2, 0.34, 0.58]} scale={[0.32, 0.28, 0.05]}>
//         <torusGeometry args={[0.2, 0.03, 16, 64]} />
//         <meshStandardMaterial color="#a78bfa" metalness={0.8} roughness={0.2} />
//       </mesh>
//       <mesh position={[0.2, 0.34, 0.58]} scale={[0.32, 0.28, 0.05]}>
//         <torusGeometry args={[0.2, 0.03, 16, 64]} />
//         <meshStandardMaterial color="#a78bfa" metalness={0.8} roughness={0.2} />
//       </mesh>
//       <mesh position={[0, 0.34, 0.58]} scale={[0.2, 0.05, 0.05]}>
//         <boxGeometry />
//         <meshStandardMaterial color="#a78bfa" metalness={0.8} />
//       </mesh>

//       {/* Thinking particles */}
//       {isThinking && (
//         <Html position={[0, 0.9, 0]} center>
//           <div className="thinking-dots-3d">
//             <span>.</span><span>.</span><span>.</span>
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// });

// // Main Avatar Component
// const ThreeAvatar = forwardRef(({ isSpeaking, isMuted, onToggleMute, userName = "Alex Chen", userTitle = "Senior Engineer · Interviewer" }, ref) => {
//   const [mouthOpen, setMouthOpen] = useState(0);
//   const [isThinking, setIsThinking] = useState(false);
//   const synthRef = useRef(window.speechSynthesis);
//   const speakingIntervalRef = useRef(null);

//   // Simulate mouth movement based on speaking
//   const startMouthAnimation = useCallback(() => {
//     if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
    
//     speakingIntervalRef.current = setInterval(() => {
//       // Random mouth movement to simulate speech
//       const openness = 0.3 + Math.random() * 0.7;
//       setMouthOpen(openness);
//     }, 80);
//   }, []);

//   const stopMouthAnimation = useCallback(() => {
//     if (speakingIntervalRef.current) {
//       clearInterval(speakingIntervalRef.current);
//       speakingIntervalRef.current = null;
//     }
//     setMouthOpen(0);
//   }, []);

//   const speakText = useCallback((text, onEnd) => {
//     if (isMuted) {
//       onEnd?.();
//       return;
//     }
    
//     // Cancel any ongoing speech
//     if (synthRef.current.speaking) {
//       synthRef.current.cancel();
//     }
    
//     stopMouthAnimation();
//     setIsThinking(false);
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;
    
//     // Get a good voice
//     const voices = synthRef.current.getVoices();
//     const voice = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en-US"))
//       || voices.find(v => v.lang.startsWith("en-US"))
//       || voices[0];
//     if (voice) utterance.voice = voice;
    
//     utterance.onstart = () => {
//       startMouthAnimation();
//     };
    
//     utterance.onend = () => {
//       stopMouthAnimation();
//       onEnd?.();
//     };
    
//     utterance.onerror = () => {
//       stopMouthAnimation();
//       onEnd?.();
//     };
    
//     synthRef.current.speak(utterance);
//   }, [isMuted, startMouthAnimation, stopMouthAnimation]);

//   const stopSpeaking = useCallback(() => {
//     synthRef.current.cancel();
//     stopMouthAnimation();
//     setIsThinking(false);
//   }, [stopMouthAnimation]);

//   const setThinking = useCallback((thinking) => {
//     setIsThinking(thinking);
//     if (thinking) {
//       stopSpeaking();
//       // Animate thinking dots via mouth micro-movement
//       let thinkingInterval;
//       thinkingInterval = setInterval(() => {
//         setMouthOpen(Math.sin(Date.now() / 200) * 0.1);
//       }, 50);
//       return () => clearInterval(thinkingInterval);
//     } else {
//       setMouthOpen(0);
//     }
//   }, [stopSpeaking]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (synthRef.current) synthRef.current.cancel();
//       if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
//     };
//   }, []);

//   useImperativeHandle(ref, () => ({
//     speakText,
//     stopSpeaking,
//     setThinking,
//   }));

//   return (
//     <div className="w-full h-full relative" style={{ background: "#0b0b0f" }}>
//       {/* Top bar controls */}
//       <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4">
//         <div className="flex items-center gap-2">
//           <span className={`w-2 h-2 rounded-full transition-colors ${isSpeaking ? "bg-purple-400 animate-pulse" : "bg-emerald-500"}`} />
//           <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
//             {isSpeaking ? "Speaking" : isThinking ? "Thinking..." : "Ready"}
//           </span>
//         </div>
//         <button
//           onClick={onToggleMute}
//           className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:bg-white/10 transition"
//         >
//           {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
//         </button>
//       </div>

//       {/* 3D Canvas */}
//       <Canvas
//         shadows
//         camera={{ position: [0, 0, 3.5], fov: 45 }}
//         style={{ background: "#0b0b0f" }}
//       >
//         <ambientLight intensity={0.5} />
//         <pointLight position={[5, 5, 5]} intensity={1} castShadow />
//         <pointLight position={[-3, 2, 4]} intensity={0.5} color="#a78bfa" />
//         <directionalLight position={[0, 3, 2]} intensity={0.8} castShadow />
//         <spotLight position={[0, 2, 2]} intensity={0.6} angle={0.3} penumbra={0.5} />
        
//         <AvatarModel 
//           ref={ref}
//           isSpeaking={isSpeaking}
//           isThinking={isThinking}
//           mouthOpen={mouthOpen}
//         />
        
//         {/* Ground shadow */}
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
//           <circleGeometry args={[1.5, 32]} />
//           <shadowMaterial opacity={0.3} transparent />
//         </mesh>
        
//         <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
//       </Canvas>

//       {/* Name plate */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
//         <div
//           className="flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-center"
//           style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "0.5px solid rgba(255,255,255,0.08)" }}
//         >
//           <p className="text-white/80 text-xs font-bold tracking-wider">{userName}</p>
//           <p className="text-white/30 text-[10px]">{userTitle}</p>
//         </div>
//       </div>

//       {/* Speaking waveform */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: 80,
//           left: "50%",
//           transform: "translateX(-50%)",
//           display: "flex",
//           alignItems: "flex-end",
//           gap: 3,
//           height: 20,
//           opacity: isSpeaking ? 1 : 0,
//           transition: "opacity 0.3s",
//         }}
//       >
//         {[4, 8, 13, 18, 13, 8, 4].map((h, i) => (
//           <div
//             key={i}
//             style={{
//               width: 3,
//               height: h,
//               background: "#a78bfa",
//               borderRadius: 2,
//               animation: isSpeaking ? `wave-bar 0.5s ease-in-out ${i * 0.07}s infinite alternate` : "none",
//             }}
//           />
//         ))}
//       </div>

//       <style>{`
//         @keyframes wave-bar {
//           from { transform: scaleY(0.4); }
//           to { transform: scaleY(1.6); }
//         }
//         .thinking-dots-3d {
//           display: flex;
//           gap: 4px;
//           font-size: 24px;
//           color: #a78bfa;
//           animation: thinking-pulse 1s ease-in-out infinite;
//         }
//         .thinking-dots-3d span {
//           animation: dot-bounce 0.6s ease-in-out infinite;
//         }
//         .thinking-dots-3d span:nth-child(2) { animation-delay: 0.2s; }
//         .thinking-dots-3d span:nth-child(3) { animation-delay: 0.4s; }
//         @keyframes dot-bounce {
//           0%, 100% { transform: translateY(0); opacity: 0.3; }
//           50% { transform: translateY(-5px); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// });

// export default ThreeAvatar;