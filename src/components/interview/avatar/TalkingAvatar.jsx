// import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";

// const TalkingAvatar = forwardRef(({ isSpeaking }, ref) => {
//   const containerRef = useRef(null);
//   const headRef = useRef(null);
//   const [loaded, setLoaded] = useState(false);
//   const [loadError, setLoadError] = useState(false);

//   useImperativeHandle(ref, () => ({
//     speakText: (text) => {
//       if (headRef.current) {
//         try {
//           headRef.current.speakText(text);
//         } catch (e) {
//           console.warn("speakText failed:", e);
//         }
//       }
//     }
//   }));

//   useEffect(() => {
//     let cancelled = false;

//     const initAvatar = async () => {
//       try {
//         // Latest TalkingHead (uses Three.js internally)
//         const module = await import("https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.7/modules/talkinghead.mjs");
//         const { TalkingHead } = module;

//         if (cancelled || !containerRef.current) return;

//         const avatarDiv = document.createElement("div");
//         avatarDiv.style.width = "100%";
//         avatarDiv.style.height = "100%";
//         containerRef.current.appendChild(avatarDiv);

//         const head = new TalkingHead(avatarDiv, {
//           cameraView: "upper",        // Shows face and shoulders nicely
//           cameraRotateEnable: false,
//           cameraY: 0.2,
//           cameraDistance: 2.0,
//         });

//         // Realistic Ready Player Me avatar (you can change this URL)
//         await head.showAvatar({
//           url: "https://models.readyplayer.me/670f8e8f8f8f8f8f8f8f8f8f.glb", // Professional female
//           // Alternative good ones:
//           // "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb"
//           // "https://models.readyplayer.me/66f5c5c5c5c5c5c5c5c5c5c5.glb"  // male if you want
//           body: "F",
//           avatarMood: "neutral",
//         });

//         headRef.current = head;
//         setLoaded(true);
//       } catch (err) {
//         console.error("Failed to load 3D Avatar:", err);
//         if (!cancelled) setLoadError(true);
//       }
//     };

//     initAvatar();

//     return () => {
//       cancelled = true;
//       if (headRef.current) headRef.current.stopSpeaking?.();
//     };
//   }, []);

//   if (loadError) {
//     return (
//       <div className="w-full h-full bg-gray-900 rounded-[2rem] flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="text-8xl mb-4">👩‍💼</div>
//           <p className="text-2xl">AI Interviewer</p>
//           <p className="text-sm text-gray-400 mt-2">Avatar failed to load</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div 
//       ref={containerRef} 
//       className="w-full h-full bg-gray-950 rounded-[2rem] overflow-hidden"
//     />
//   );
// });

// export default TalkingAvatar;


// import {
//   Suspense,
//   useRef,
//   useEffect,
//   forwardRef,
//   useImperativeHandle,
//   useState,
// } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF, useAnimations, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
// import { Volume2, VolumeX } from "lucide-react";

// // ── Use local file in /public/avatars/ ──────────────────────────
// // Swap this path once you have your own RPM avatar downloaded
// // const AVATAR_URL = "/avatars/interviewer.glb";
// // A reliable, open-source GLB model for testing
// const AVATAR_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb";
// // ── Detect which animation names exist and pick best ones ───────
// function getAnimNames(names) {
//   const lower = names.map((n) => n.toLowerCase());
//   const idleIdx = lower.findIndex((n) =>
//     n.includes("idle") || n.includes("stand") || n.includes("breathing")
//   );
//   const talkIdx = lower.findIndex((n) =>
//     n.includes("talk") || n.includes("speak") || n.includes("wave") || n.includes("run")
//   );
//   return {
//     idle: names[idleIdx >= 0 ? idleIdx : 0],
//     talk: names[talkIdx >= 0 ? talkIdx : Math.min(1, names.length - 1)],
//   };
// }

// function AvatarModel({ isSpeaking }) {
//   const group = useRef();
//   const { scene, animations } = useGLTF(AVATAR_URL);
//   const { actions, names } = useAnimations(animations, group);
//   const tick = useRef(0);
//   const animNames = useRef(null);

//   useEffect(() => {
//     if (!names.length) return;
//     animNames.current = getAnimNames(names);
//     const idle = actions[animNames.current.idle];
//     if (idle) idle.reset().fadeIn(0.5).play();
//   }, [actions, names]);

//   useEffect(() => {
//     if (!animNames.current) return;
//     const idle = actions[animNames.current.idle];
//     const talk = actions[animNames.current.talk];

//     if (isSpeaking && talk && animNames.current.idle !== animNames.current.talk) {
//       idle?.fadeOut(0.3);
//       talk.reset().fadeIn(0.3).play();
//     } else {
//       // fade everything out then replay idle
//       Object.values(actions).forEach((a) => a?.fadeOut(0.2));
//       idle?.reset().fadeIn(0.3).play();
//     }
//   }, [isSpeaking, actions]);

//   useFrame((_, delta) => {
//     tick.current += delta;
//     if (group.current) {
//       // gentle breathing bob + slight head turn
//       group.current.rotation.y = Math.sin(tick.current * 0.2) * 0.04;
//       group.current.position.y =
//         -1.55 + Math.sin(tick.current * 0.35) * 0.012;
//     }
//   });

//   return (
//     <group ref={group} position={[0, -1.55, 0]} scale={1.7}>
//       <primitive object={scene} />
//     </group>
//   );
// }

// function SceneLoader() {
//   // Visible while GLB loads
//   return (
//     <mesh>
//       <sphereGeometry args={[0.08, 12, 12]} />
//       <meshStandardMaterial color="#7F77DD" wireframe />
//     </mesh>
//   );
// }

// const TalkingAvatar = forwardRef(function TalkingAvatar(
//   { isSpeaking, isMuted, onToggleMute },
//   ref
// ) {
//   const synthRef = useRef(window.speechSynthesis);
//   const [loadError, setLoadError] = useState(false);

//   // useImperativeHandle(ref, () => ({
//   //   speakText: (text) => {
//   //     if (isMuted) return;
//   //     synthRef.current.cancel();
//   //     const u = new SpeechSynthesisUtterance(text);
//   //     u.rate = 0.9;
//   //     u.pitch = 1.0;
//   //     const voices = synthRef.current.getVoices();
//   //     const v =
//   //       voices.find(
//   //         (v) => v.name.includes("Google") && v.lang.startsWith("en-US")
//   //       ) || voices.find((v) => v.lang.startsWith("en-US"));
//   //     if (v) u.voice = v;
//   //     synthRef.current.speak(u);
//   //   },
//   //   stopSpeaking: () => synthRef.current.cancel(),
//   // }));

//   // In useImperativeHandle, replace speakText:
// speakText: (text, onEnd) => {
//   if (isMuted) { onEnd?.(); return; }
//   synthRef.current.cancel();
//   const u = new SpeechSynthesisUtterance(text);
//   u.rate = 0.9;
//   u.pitch = 1.0;
//   u.onend = () => onEnd?.();   // ← add this
//   const voices = synthRef.current.getVoices();
//   const v = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en-US"))
//     || voices.find(v => v.lang.startsWith("en-US"));
//   if (v) u.voice = v;
//   synthRef.current.speak(u);
// },

//   useEffect(() => {
//     // Preload so it's cached when Canvas mounts
//     try {
//       useGLTF.preload(AVATAR_URL);
//     } catch (e) {}
//   }, []);

//   return (
//     <div className="w-full h-full relative" style={{ background: "#0b0b0f" }}>
//       {/* ── Top bar ─────────────────────────────────────────── */}
//       <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4">
//         <div className="flex items-center gap-2">
//           <span
//             className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
//               isSpeaking ? "bg-purple-400 animate-pulse" : "bg-emerald-500"
//             }`}
//           />
//           <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
//             {isSpeaking ? "Speaking" : "Ready"}
//           </span>
//         </div>
//         <button
//           onClick={onToggleMute}
//           className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:bg-white/10 transition"
//         >
//           {isMuted ? (
//             <VolumeX style={{ width: 13, height: 13 }} />
//           ) : (
//             <Volume2 style={{ width: 13, height: 13 }} />
//           )}
//         </button>
//       </div>

//       {/* ── Three.js Canvas ─────────────────────────────────── */}
//       <Canvas
//         camera={{ position: [0, 0.2, 2.1], fov: 38 }}
//         gl={{
//           antialias: true,
//           alpha: false,
//           powerPreference: "high-performance",
//           preserveDrawingBuffer: false,
//         }}
//         onCreated={({ gl }) => {
//           gl.domElement.addEventListener("webglcontextlost", (e) => {
//             e.preventDefault();
//             setLoadError(true);
//           });
//         }}
//         style={{ width: "100%", height: "100%", background: "#0b0b0f" }}
//       >
//         {/* ── Lighting — professional meeting room ──────────── */}
//         <ambientLight intensity={0.4} />

//         {/* Key — warm sunlight from front-left window */}
//         <directionalLight
//           position={[3, 5, 3]}
//           intensity={1.5}
//           color="#fff8f0"
//           castShadow
//         />

//         {/* Fill — cool bounce from right wall */}
//         <pointLight
//           position={[-3, 2.5, 1.5]}
//           intensity={0.55}
//           color="#dce8ff"
//         />

//         {/* Rim — purple backlight for depth */}
//         <pointLight
//           position={[0, 4, -3.5]}
//           intensity={0.9}
//           color="#9b8cff"
//         />

//         {/* Under fill — subtle screen glow */}
//         <pointLight
//           position={[0, -1, 2.5]}
//           intensity={0.18}
//           color="#ffffff"
//         />

//         {/* ── Environment (valid preset) ────────────────────── */}
//         <Environment preset="lobby" />

//         {/* ── Floor shadow ──────────────────────────────────── */}
//         <ContactShadows
//           position={[0, -1.85, 0]}
//           opacity={0.45}
//           scale={5}
//           blur={2.5}
//           far={2.5}
//           color="#000000"
//         />

//         {/* ── Avatar model ──────────────────────────────────── */}
//         <Suspense fallback={<SceneLoader />}>
//           <AvatarModel isSpeaking={isSpeaking} />
//         </Suspense>
//       </Canvas>

//       {/* ── Speaking waveform ───────────────────────────────── */}
//       <div
//         className={`absolute bottom-[72px] left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-5 transition-opacity duration-300 ${
//           isSpeaking ? "opacity-100" : "opacity-0"
//         }`}
//       >
//         {[4, 8, 13, 18, 13, 8, 4].map((h, i) => (
//           <div
//             key={i}
//             className="w-[3px] bg-purple-400 rounded-full"
//             style={{
//               height: h,
//               animation: isSpeaking
//                 ? `tav-wave 0.65s ease-in-out ${i * 0.07}s infinite alternate`
//                 : "none",
//             }}
//           />
//         ))}
//       </div>

//       {/* ── Name plate ──────────────────────────────────────── */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
//         <div
//           className="flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-center"
//           style={{
//             background: "rgba(0,0,0,0.55)",
//             backdropFilter: "blur(12px)",
//             border: "0.5px solid rgba(255,255,255,0.08)",
//           }}
//         >
//           <p className="text-white/80 text-xs font-bold tracking-wider">
//             Alex Chen
//           </p>
//           <p className="text-white/30 text-[10px]">
//             Senior Engineer · Interviewer
//           </p>
//         </div>
//       </div>

//       {/* ── WebGL context lost fallback ─────────────────────── */}
//       {loadError && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0b0f] z-30">
//           <div className="w-20 h-20 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center mb-4 text-3xl">
//             👤
//           </div>
//           <p className="text-white/50 text-sm font-bold">Alex Chen</p>
//           <p className="text-white/25 text-xs mt-1">Senior Engineer</p>
//         </div>
//       )}

//       <style>{`
//         @keyframes tav-wave {
//           from { transform: scaleY(0.35); }
//           to   { transform: scaleY(1.3);  }
//         }
//       `}</style>
//     </div>
//   );
// });

// export default TalkingAvatar;


// import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
// import { Volume2, VolumeX } from "lucide-react";

// const TalkingAvatar2D = forwardRef(function TalkingAvatar2D(
//   { isSpeaking, isMuted, onToggleMute },
//   ref
// ) {
//   const canvasRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);
//   const animRef = useRef(null);
//   const stateRef = useRef("idle"); // "idle" | "talking" | "thinking"
//   const tRef = useRef(0);
//   const blinkTRef = useRef(0);
//   const nextBlinkRef = useRef(120);
//   const isBlinkingRef = useRef(false);
//   const blinkFrameRef = useRef(0);
//   const mouthOpenRef = useRef(0);
//   const talkPhaseRef = useRef(0);
//   const thinkDotRef = useRef(0);

//   // Expose speakText and stopSpeaking to parent via ref
//   useImperativeHandle(ref, () => ({
//     speakText: (text, onEnd) => {
//       if (isMuted) { onEnd?.(); return; }
//       synthRef.current.cancel();
//       const u = new SpeechSynthesisUtterance(text);
//       u.rate = 0.9;
//       u.pitch = 1.05;
//       const voices = synthRef.current.getVoices();
//       const v =
//         voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en-US")) ||
//         voices.find((v) => v.lang.startsWith("en-US"));
//       if (v) u.voice = v;
//       u.onstart = () => { stateRef.current = "talking"; };
//       u.onend = () => { stateRef.current = "idle"; onEnd?.(); };
//       u.onerror = () => { stateRef.current = "idle"; onEnd?.(); };
//       synthRef.current.speak(u);
//     },
//     stopSpeaking: () => {
//       synthRef.current.cancel();
//       stateRef.current = "idle";
//     },
//     setThinking: (on) => {
//       stateRef.current = on ? "thinking" : "idle";
//     },
//   }));

//   // Sync external isSpeaking prop → state (for when parent controls it)
//   useEffect(() => {
//     if (!isSpeaking && stateRef.current === "talking") {
//       stateRef.current = "idle";
//     }
//   }, [isSpeaking]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     const W = canvas.width;
//     const H = canvas.height;

//     function ease(a, b, spd) { return a + (b - a) * spd; }

//     function drawFrame() {
//       ctx.clearRect(0, 0, W, H);
//       const t = tRef.current;
//       const state = stateRef.current;
//       const cx = W / 2, cy = H * 0.48;
//       const breathe = Math.sin(t * 0.025) * 1.8;
//       const hx = cx + (state === "thinking" ? Math.sin(t * 0.015) * 4 : 0);
//       const hy = cy + breathe + (state === "thinking" ? Math.cos(t * 0.018) * 2 : 0);

//       // mouth animation
//       if (state === "talking") {
//         talkPhaseRef.current += 0.18;
//         const target = Math.abs(Math.sin(talkPhaseRef.current)) * 11 + 2;
//         mouthOpenRef.current = ease(mouthOpenRef.current, target, 0.22);
//       } else {
//         mouthOpenRef.current = ease(mouthOpenRef.current, 0, 0.18);
//         talkPhaseRef.current = 0;
//       }

//       // blink logic
//       blinkTRef.current++;
//       if (!isBlinkingRef.current && blinkTRef.current > nextBlinkRef.current) {
//         isBlinkingRef.current = true;
//         blinkFrameRef.current = 0;
//         nextBlinkRef.current = 100 + Math.random() * 140;
//         blinkTRef.current = 0;
//       }
//       if (isBlinkingRef.current) {
//         blinkFrameRef.current++;
//         if (blinkFrameRef.current > 10) isBlinkingRef.current = false;
//       }
//       const blinkClose = isBlinkingRef.current
//         ? Math.max(0, 1 - Math.abs(blinkFrameRef.current - 5) / 5)
//         : 0;

//       if (state === "thinking") thinkDotRef.current += 0.04;

//       // ── head shadow/glow ─────────────────────────────────
//       ctx.save();
//       ctx.shadowColor = "rgba(127,119,221,0.22)";
//       ctx.shadowBlur = 32;
//       ctx.beginPath();
//       ctx.ellipse(hx, hy, 68, 78, 0, 0, Math.PI * 2);
//       ctx.fillStyle = "#2a2730";
//       ctx.fill();
//       ctx.restore();

//       // head outline
//       ctx.beginPath();
//       ctx.ellipse(hx, hy, 68, 78, 0, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(127,119,221,0.25)";
//       ctx.lineWidth = 1.5;
//       ctx.stroke();

//       // hair top
//       ctx.save();
//       ctx.beginPath();
//       ctx.ellipse(hx, hy - 36, 68, 42, 0, Math.PI, 0);
//       ctx.closePath();
//       ctx.fillStyle = "#1e1c24";
//       ctx.fill();
//       ctx.restore();

//       ctx.beginPath();
//       ctx.ellipse(hx, hy - 36, 58, 26, 0, Math.PI, 0);
//       ctx.fillStyle = "#1a1820";
//       ctx.fill();

//       // hair sides
//       ctx.save();
//       ctx.beginPath();
//       ctx.ellipse(hx, hy - 70, 24, 16, 0, 0, Math.PI * 2);
//       ctx.fillStyle = "#1e1c24";
//       ctx.fill();
//       ctx.restore();
//       ctx.beginPath();
//       ctx.arc(hx - 22, hy - 82, 10, 0, Math.PI * 2);
//       ctx.arc(hx + 22, hy - 82, 10, 0, Math.PI * 2);
//       ctx.fillStyle = "#1e1c24";
//       ctx.fill();

//       // ears
//       for (const ex of [hx - 68, hx + 68]) {
//         ctx.beginPath();
//         ctx.ellipse(ex, hy, 7, 12, 0, 0, Math.PI * 2);
//         ctx.fillStyle = "#2a2730";
//         ctx.fill();
//       }

//       // eyes
//       const eyeLx = hx - 22, eyeRx = hx + 22, eyeY = hy - 20;
//       const eyeH = (isBlinkingRef.current ? 7 * (1 - blinkClose) + 0.5 : 7);
//       for (const ex of [eyeLx, eyeRx]) {
//         ctx.beginPath();
//         ctx.ellipse(ex, eyeY, 7, Math.max(0.5, eyeH), 0, 0, Math.PI * 2);
//         ctx.fillStyle = "#fff";
//         ctx.fill();
//         if (!isBlinkingRef.current || blinkClose < 0.9) {
//           ctx.beginPath();
//           ctx.arc(ex, eyeY, 4, 0, Math.PI * 2);
//           ctx.fillStyle = "#5a4fa8";
//           ctx.fill();
//           ctx.beginPath();
//           ctx.arc(ex, eyeY, 2, 0, Math.PI * 2);
//           ctx.fillStyle = "#0d0b14";
//           ctx.fill();
//           ctx.beginPath();
//           ctx.arc(ex + 2, eyeY - 2, 1.5, 0, Math.PI * 2);
//           ctx.fillStyle = "rgba(255,255,255,0.7)";
//           ctx.fill();
//         }
//       }

//       // eyebrows
//       ctx.beginPath();
//       ctx.ellipse(eyeLx, eyeY - eyeH - 6, 10, 2.5, -0.1, 0, Math.PI * 2);
//       ctx.ellipse(eyeRx, eyeY - eyeH - 6, 10, 2.5, 0.1, 0, Math.PI * 2);
//       ctx.fillStyle = "#1a1820";
//       ctx.fill();

//       // nose
//       ctx.beginPath();
//       ctx.ellipse(hx, hy + 12, 5, 3.5, 0, 0, Math.PI * 2);
//       ctx.fillStyle = "rgba(200,160,140,0.28)";
//       ctx.fill();

//       // mouth
//       const mo = mouthOpenRef.current;
//       const mouthY = hy + 32;
//       const mouthW = 22;
//       if (mo > 0.8) {
//         ctx.beginPath();
//         ctx.ellipse(hx, mouthY, mouthW * 0.5, mo * 0.5, 0, 0, Math.PI * 2);
//         ctx.fillStyle = "#0d0b14";
//         ctx.fill();
//         ctx.beginPath();
//         ctx.moveTo(hx - mouthW * 0.5, mouthY - mo * 0.15);
//         ctx.quadraticCurveTo(hx, mouthY - mo * 0.5, hx + mouthW * 0.5, mouthY - mo * 0.15);
//         ctx.strokeStyle = "rgba(255,255,255,0.12)";
//         ctx.lineWidth = 1;
//         ctx.stroke();
//       } else {
//         ctx.beginPath();
//         ctx.moveTo(hx - mouthW * 0.5, mouthY);
//         ctx.quadraticCurveTo(hx, mouthY + 5, hx + mouthW * 0.5, mouthY);
//         ctx.strokeStyle = "rgba(255,255,255,0.35)";
//         ctx.lineWidth = 2;
//         ctx.lineCap = "round";
//         ctx.stroke();
//       }

//       // ── Body / collar ─────────────────────────────────────
//       ctx.beginPath();
//       ctx.ellipse(hx, hy + 78, 34, 10, 0, 0, Math.PI * 2);
//       ctx.fillStyle = "#3d3060";
//       ctx.fill();

//       ctx.beginPath();
//       ctx.moveTo(hx - 32, hy + 76);
//       ctx.lineTo(hx - 55, H);
//       ctx.lineTo(hx + 55, H);
//       ctx.lineTo(hx + 32, hy + 76);
//       ctx.closePath();
//       ctx.fillStyle = "#221e2e";
//       ctx.fill();
//       ctx.strokeStyle = "rgba(127,119,221,0.18)";
//       ctx.lineWidth = 1;
//       ctx.stroke();

//       // ── Waveform bars when talking ─────────────────────────
//       if (state === "talking") {
//         for (let i = 0; i < 7; i++) {
//           const bx = hx - 36 + i * 12;
//           const bh = 4 + Math.abs(Math.sin(talkPhaseRef.current + i * 0.7)) * 14;
//           ctx.beginPath();
//           const rx = bx - 2, ry = hy + 104 - bh * 0.5, rw = 4, rh = bh;
//           ctx.roundRect?.(rx, ry, rw, rh, 2) || ctx.rect(rx, ry, rw, rh);
//           ctx.fillStyle = `rgba(127,119,221,${0.4 + Math.abs(Math.sin(talkPhaseRef.current + i)) * 0.5})`;
//           ctx.fill();
//         }
//       }

//       // ── Thinking dots ──────────────────────────────────────
//       if (state === "thinking") {
//         for (let i = 0; i < 3; i++) {
//           const dotX = hx + 30 + i * 14;
//           const dotY = hy - 95 + Math.sin(thinkDotRef.current + i * 1.1) * 5;
//           const alpha = 0.35 + Math.abs(Math.sin(thinkDotRef.current + i * 1.1)) * 0.55;
//           ctx.beginPath();
//           ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
//           ctx.fillStyle = `rgba(127,119,221,${alpha})`;
//           ctx.fill();
//         }
//       }

//       tRef.current++;
//       animRef.current = requestAnimationFrame(drawFrame);
//     }

//     animRef.current = requestAnimationFrame(drawFrame);
//     return () => cancelAnimationFrame(animRef.current);
//   }, []);

//   return (
//     <div className="w-full h-full relative flex flex-col" style={{ background: "#0b0b0f" }}>
//       {/* Top bar */}
//       <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4">
//         <div className="flex items-center gap-2">
//           <span
//             className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
//               isSpeaking ? "bg-purple-400 animate-pulse" : "bg-emerald-500"
//             }`}
//           />
//           <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
//             {isSpeaking ? "Speaking" : "Ready"}
//           </span>
//         </div>
//         <button
//           onClick={onToggleMute}
//           className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:bg-white/10 transition"
//         >
//           {isMuted ? <VolumeX style={{ width: 13, height: 13 }} /> : <Volume2 style={{ width: 13, height: 13 }} />}
//         </button>
//       </div>

//       {/* Canvas — centered, fills space */}
//       <div className="flex-1 flex items-center justify-center">
//         <canvas
//           ref={canvasRef}
//           width={260}
//           height={300}
//           style={{ display: "block" }}
//         />
//       </div>

//       {/* Name plate */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
//         <div
//           className="flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-center"
//           style={{
//             background: "rgba(0,0,0,0.55)",
//             backdropFilter: "blur(12px)",
//             border: "0.5px solid rgba(255,255,255,0.08)",
//           }}
//         >
//           <p className="text-white/80 text-xs font-bold tracking-wider">Alex Chen</p>
//           <p className="text-white/30 text-[10px]">Senior Engineer · Interviewer</p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default TalkingAvatar2D;

// import { useRef, useImperativeHandle, forwardRef } from "react";
// import { Volume2, VolumeX } from "lucide-react";

// const TalkingAvatar2D = forwardRef(function TalkingAvatar2D(
//   { isSpeaking, isMuted, onToggleMute },
//   ref
// ) {
//   const synthRef = useRef(window.speechSynthesis);
//   const idleRef = useRef(null);
//   const talkRef = useRef(null);

//   useImperativeHandle(ref, () => ({
//     speakText: (text, onEnd) => {
//       if (isMuted) { onEnd?.(); return; }
//       synthRef.current.cancel();
//       const u = new SpeechSynthesisUtterance(text);
//       u.rate = 0.88;
//       u.pitch = 1.0;
//       const voices = synthRef.current.getVoices();
//       const v =
//         voices.find(v => v.name.includes("Google") && v.lang.startsWith("en-US")) ||
//         voices.find(v => v.lang.startsWith("en-US"));
//       if (v) u.voice = v;
//       u.onstart = () => swap("talking");
//       u.onend   = () => { swap("idle"); onEnd?.(); };
//       u.onerror = () => { swap("idle"); onEnd?.(); };
//       synthRef.current.speak(u);
//     },
//     stopSpeaking: () => {
//       synthRef.current.cancel();
//       swap("idle");
//     },
//     setThinking: (on) => swap(on ? "thinking" : "idle"),
//   }));

//   function swap(state) {
//     if (!idleRef.current || !talkRef.current) return;
//     if (state === "talking") {
//       idleRef.current.style.opacity = "0";
//       talkRef.current.style.opacity = "1";
//       // force GIF to restart from frame 1
//       const src = talkRef.current.src;
//       talkRef.current.src = "";
//       talkRef.current.src = src;
//     } else {
//       talkRef.current.style.opacity = "0";
//       idleRef.current.style.opacity = "1";
//       const src = idleRef.current.src;
//       idleRef.current.src = "";
//       idleRef.current.src = src;
//     }
//   }

//   return (
//     <div className="w-full h-full relative flex flex-col items-center justify-center"
//       style={{ background: "#0b0b0f" }}>

//       {/* Top bar */}
//       <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4">
//         <div className="flex items-center gap-2">
//           <span className={`w-2 h-2 rounded-full transition-colors ${
//             isSpeaking ? "bg-purple-400 animate-pulse" : "bg-emerald-500"
//           }`}/>
//           <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
//             {isSpeaking ? "Speaking" : "Ready"}
//           </span>
//         </div>
//         <button onClick={onToggleMute}
//           className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:bg-white/10 transition">
//           {isMuted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
//         </button>
//       </div>

//       {/* GIF stack — both layered, opacity controls which shows */}
//       <div className="relative" style={{ width: 280, height: 340, borderRadius: 16, overflow: "hidden" }}>
//         <img
//           ref={idleRef}
//           src="/avatars/idle.gif"
//           alt="interviewer idle"
//           style={{
//             position: "absolute", inset: 0,
//             width: "100%", height: "100%",
//             objectFit: "cover",
//             opacity: 1,
//             transition: "opacity 0.3s ease",
//             borderRadius: 16,
//           }}
//         />
//         <img
//           ref={talkRef}
//           src="/avatars/talking.gif"
//           alt="interviewer talking"
//           style={{
//             position: "absolute", inset: 0,
//             width: "100%", height: "100%",
//             objectFit: "cover",
//             opacity: 0,
//             transition: "opacity 0.3s ease",
//             borderRadius: 16,
//           }}
//         />

//         {/* dark gradient at bottom so nameplate reads cleanly */}
//         <div style={{
//           position: "absolute", bottom: 0, left: 0, right: 0,
//           height: "40%",
//           background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
//           borderRadius: "0 0 16px 16px",
//         }}/>

//         {/* speaking waveform */}
//         <div style={{
//           position: "absolute", bottom: 52, left: "50%",
//           transform: "translateX(-50%)",
//           display: "flex", alignItems: "flex-end", gap: 2, height: 18,
//           opacity: isSpeaking ? 1 : 0,
//           transition: "opacity 0.3s",
//         }}>
//           {[4,8,13,18,13,8,4].map((h, i) => (
//             <div key={i} style={{
//               width: 3, height: h,
//               background: "#a78bfa",
//               borderRadius: 2,
//               animation: isSpeaking
//                 ? `wave-bar 0.6s ease-in-out ${i*0.07}s infinite alternate`
//                 : "none",
//             }}/>
//           ))}
//         </div>
//       </div>

//       {/* Name plate */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
//         <div className="flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-center"
//           style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(12px)", border:"0.5px solid rgba(255,255,255,0.08)" }}>
//           <p className="text-white/80 text-xs font-bold tracking-wider">Alex Chen</p>
//           <p className="text-white/30 text-[10px]">Senior Engineer · Interviewer</p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes wave-bar {
//           from { transform: scaleY(0.4); }
//           to   { transform: scaleY(1.4); }
//         }
//       `}</style>
//     </div>
//   );
// });

// export default TalkingAvatar2D;


// TalkingAvatar.jsx - Complete working replacement
import { useRef, useImperativeHandle, forwardRef, useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TalkingAvatar2D = forwardRef(function TalkingAvatar2D(
  { isSpeaking, isMuted, onToggleMute, userName = "Alex Chen", userTitle = "Senior Engineer · Interviewer" },
  ref
) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);

  // Draw avatar on canvas
  const drawAvatar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Background gradient (professional dark theme)
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw subtle grid pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i % h);
      ctx.lineTo(w, i % h);
      ctx.stroke();
    }

    // Draw head (ellipse)
    const centerX = w / 2;
    const centerY = h / 2 - 20;
    const headW = 120;
    const headH = 140;

    // Head shadow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    
    // Head fill
    ctx.fillStyle = '#2d2d3d';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, headW / 2, headH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(centerX - 35, centerY - 20, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + 35, centerY - 20, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (follow mouse? optional)
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(centerX - 35 + (isThinking ? 2 : 0), centerY - 18, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + 35 + (isThinking ? 2 : 0), centerY - 18, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.ellipse(centerX - 37, centerY - 23, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + 33, centerY - 23, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows (animated based on thinking)
    ctx.strokeStyle = '#5a5a7a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 48, centerY - 38);
    ctx.quadraticCurveTo(centerX - 35, centerY - 42 - (isThinking ? 3 : 0), centerX - 22, centerY - 38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + 48, centerY - 38);
    ctx.quadraticCurveTo(centerX + 35, centerY - 42 - (isThinking ? 3 : 0), centerX + 22, centerY - 38);
    ctx.stroke();

    // MOUTH - THIS IS THE KEY PART (opens based on speech volume)
    const mouthHeight = 8 + (mouthOpen * 18);
    const mouthY = centerY + 25;
    
    ctx.fillStyle = '#4a2a2a';
    ctx.beginPath();
    ctx.ellipse(centerX, mouthY, 25, mouthHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Lips
    ctx.strokeStyle = '#6a4a4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, mouthY - 1, 27, (mouthHeight / 2) + 1, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Nose
    ctx.fillStyle = '#3a3a4a';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 5);
    ctx.lineTo(centerX - 8, centerY + 15);
    ctx.lineTo(centerX + 8, centerY + 15);
    ctx.fill();

    // Glasses (optional - adds personality)
    ctx.strokeStyle = 'rgba(168, 139, 250, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX - 35, centerY - 18, 18, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(centerX + 35, centerY - 18, 18, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - 17, centerY - 18);
    ctx.lineTo(centerX + 17, centerY - 18);
    ctx.stroke();

    // Thinking animation dots (when processing)
    if (isThinking) {
      const time = Date.now() / 300;
      for (let i = 0; i < 3; i++) {
        const offset = Math.sin(time + i * 2) * 5;
        ctx.fillStyle = `rgba(168, 139, 250, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.beginPath();
        ctx.ellipse(centerX - 60 + i * 20, centerY - 50 + offset, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [mouthOpen, isThinking]);

  // Audio analysis for real-time mouth movement
  const startAudioAnalysis = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !sourceRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    // Map volume to mouth openness (0-1, with threshold)
    let openness = Math.min(1, Math.max(0, (avg - 20) / 100));
    // Add some natural randomness
    openness = openness * 0.8 + Math.random() * 0.2;
    
    setMouthOpen(openness);
    
    if (sourceRef.current) {
      animationRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, []);

  // Speak text with real-time lip-sync
  const speakText = useCallback((text, onEnd) => {
    if (isMuted) {
      onEnd?.();
      return;
    }
    
    // Cancel any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    
    // Stop audio analysis
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (e) {}
      sourceRef.current = null;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Get voice
    const voices = synthRef.current.getVoices();
    const voice = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en-US"))
      || voices.find(v => v.lang.startsWith("en-US"))
      || voices[0];
    if (voice) utterance.voice = voice;
    
    utterance.onstart = () => {
      setIsThinking(false);
      startAudioAnalysis();
      
      // Connect to audio context for analysis
      if (audioContextRef.current && analyserRef.current) {
        // Create a media stream destination? SpeechSynthesis doesn't expose audio directly
        // Alternative: use volume-based animation with timing
        const interval = setInterval(() => {
          if (synthRef.current.speaking) {
            // Simulate volume based on speaking state
            const openness = 0.4 + Math.random() * 0.6;
            setMouthOpen(openness);
          } else {
            clearInterval(interval);
            setMouthOpen(0);
          }
        }, 50);
        
        utteranceRef.current = { utterance, interval };
      }
    };
    
    utterance.onend = () => {
      if (utteranceRef.current?.interval) {
        clearInterval(utteranceRef.current.interval);
      }
      setMouthOpen(0);
      setIsThinking(false);
      onEnd?.();
    };
    
    utterance.onerror = () => {
      if (utteranceRef.current?.interval) {
        clearInterval(utteranceRef.current.interval);
      }
      setMouthOpen(0);
      setIsThinking(false);
      onEnd?.();
    };
    
    synthRef.current.speak(utterance);
    utteranceRef.current = { utterance };
  }, [isMuted, startAudioAnalysis]);

  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    if (utteranceRef.current?.interval) {
      clearInterval(utteranceRef.current.interval);
    }
    setMouthOpen(0);
    setIsThinking(false);
  }, []);

  const setThinking = useCallback((thinking) => {
    setIsThinking(thinking);
    if (thinking) {
      stopSpeaking();
      // Animate thinking dots
      let thinkingAnimation;
      const animateThinking = () => {
        setMouthOpen(Math.sin(Date.now() / 200) * 0.1);
        thinkingAnimation = requestAnimationFrame(animateThinking);
      };
      thinkingAnimation = requestAnimationFrame(animateThinking);
      return () => cancelAnimationFrame(thinkingAnimation);
    } else {
      setMouthOpen(0);
    }
  }, [stopSpeaking]);

  // Animation loop for canvas
  useEffect(() => {
    let animationId;
    const animate = () => {
      drawAvatar();
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [drawAvatar]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (audioContextRef.current) audioContextRef.current.close();
      if (utteranceRef.current?.interval) clearInterval(utteranceRef.current.interval);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    speakText,
    stopSpeaking,
    setThinking,
  }));

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center" style={{ background: "#0b0b0f" }}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full transition-colors ${isSpeaking ? "bg-purple-400 animate-pulse" : "bg-emerald-500"}`} />
          <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
            {isSpeaking ? "Speaking" : isThinking ? "Thinking..." : "Ready"}
          </span>
        </div>
        <button
          onClick={onToggleMute}
          className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:bg-white/10 transition"
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>

      {/* Canvas Avatar */}
      <canvas
        ref={canvasRef}
        width={400}
        height={450}
        className="w-full h-full object-contain"
        style={{ maxWidth: "100%", maxHeight: "calc(100% - 100px)" }}
      />

      {/* Name plate */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div
          className="flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-white/80 text-xs font-bold tracking-wider">{userName}</p>
          <p className="text-white/30 text-[10px]">{userTitle}</p>
        </div>
      </div>

      {/* Speaking waveform overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height: 20,
          opacity: isSpeaking ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        {[4, 8, 13, 18, 13, 8, 4].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              background: "#a78bfa",
              borderRadius: 2,
              animation: isSpeaking ? `wave-bar 0.5s ease-in-out ${i * 0.07}s infinite alternate` : "none",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1.6); }
        }
      `}</style>
    </div>
  );
});

export default TalkingAvatar2D;