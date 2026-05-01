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


// // components/avatar/TalkingAvatar.jsx
// import {
//   useRef, useState, useEffect, useCallback,
//   forwardRef, useImperativeHandle,
// } from "react";
// import { Volume2, VolumeX } from "lucide-react";

// const TalkingAvatar = forwardRef(function TalkingAvatar(
//   { isSpeaking, isMuted, onToggleMute,
//     userName = "Alex Chen", userTitle = "Senior Engineer · Interviewer" },
//   ref
// ) {
//   const canvasRef = useRef(null);
//   const mouthOpenRef = useRef(0);       // use ref not state — avoids re-render on every frame
//   const isThinkingRef = useRef(false);
//   const [statusLabel, setStatusLabel] = useState("Ready");
//   const [showWave, setShowWave] = useState(false);
//   const synthRef = useRef(window.speechSynthesis);
//   const speakIntervalRef = useRef(null);
//   const animFrameRef = useRef(null);
//   const blinkRef = useRef(false);
//   const blinkTimerRef = useRef(null);
//   const tickRef = useRef(0);

//   // ── Auto blink ─────────────────────────────────────────────
//   useEffect(() => {
//     const scheduleBlink = () => {
//       blinkTimerRef.current = setTimeout(() => {
//         blinkRef.current = true;
//         setTimeout(() => {
//           blinkRef.current = false;
//           scheduleBlink();
//         }, 140);
//       }, 2800 + Math.random() * 2200);
//     };
//     scheduleBlink();
//     return () => clearTimeout(blinkTimerRef.current);
//   }, []);

//   // ── Canvas draw loop ────────────────────────────────────────
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");

//     const draw = () => {
//       tickRef.current += 0.016;
//       const t = tickRef.current;
//       const W = canvas.width;
//       const H = canvas.height;
//       const cx = W / 2;
//       const cy = H / 2 - 10;

//       ctx.clearRect(0, 0, W, H);

//       // Background
//       const bg = ctx.createLinearGradient(0, 0, 0, H);
//       bg.addColorStop(0, "#13131f");
//       bg.addColorStop(1, "#0b0b14");
//       ctx.fillStyle = bg;
//       ctx.fillRect(0, 0, W, H);

//       // Subtle dot grid
//       ctx.fillStyle = "rgba(255,255,255,0.025)";
//       for (let gx = 20; gx < W; gx += 30) {
//         for (let gy = 20; gy < H; gy += 30) {
//           ctx.beginPath();
//           ctx.arc(gx, gy, 1, 0, Math.PI * 2);
//           ctx.fill();
//         }
//       }

//       // Subtle breathing bob
//       const bob = Math.sin(t * 1.4) * 3;

//       // ── Shoulders / suit ─────────────────────────────────
//       ctx.fillStyle = "#1e1e30";
//       ctx.beginPath();
//       ctx.ellipse(cx, cy + 190 + bob, 130, 70, 0, 0, Math.PI * 2);
//       ctx.fill();

//       // Suit jacket shape
//       ctx.fillStyle = "#252538";
//       ctx.beginPath();
//       ctx.moveTo(cx - 90, cy + 260 + bob);
//       ctx.quadraticCurveTo(cx - 100, cy + 190 + bob, cx - 55, cy + 155 + bob);
//       ctx.lineTo(cx - 25, cy + 145 + bob);
//       ctx.lineTo(cx, cy + 165 + bob);
//       ctx.lineTo(cx + 25, cy + 145 + bob);
//       ctx.lineTo(cx + 55, cy + 155 + bob);
//       ctx.quadraticCurveTo(cx + 100, cy + 190 + bob, cx + 90, cy + 260 + bob);
//       ctx.closePath();
//       ctx.fill();

//       // Shirt / tie
//       ctx.fillStyle = "#f0eeff";
//       ctx.beginPath();
//       ctx.moveTo(cx - 20, cy + 150 + bob);
//       ctx.lineTo(cx + 20, cy + 150 + bob);
//       ctx.lineTo(cx + 14, cy + 210 + bob);
//       ctx.lineTo(cx - 14, cy + 210 + bob);
//       ctx.closePath();
//       ctx.fill();

//       ctx.fillStyle = "#7F77DD";
//       ctx.beginPath();
//       ctx.moveTo(cx - 7, cy + 152 + bob);
//       ctx.lineTo(cx + 7, cy + 152 + bob);
//       ctx.lineTo(cx + 4, cy + 205 + bob);
//       ctx.lineTo(cx - 4, cy + 205 + bob);
//       ctx.closePath();
//       ctx.fill();

//       // Tie knot
//       ctx.fillStyle = "#534AB7";
//       ctx.beginPath();
//       ctx.ellipse(cx, cy + 156 + bob, 8, 6, 0, 0, Math.PI * 2);
//       ctx.fill();

//       // ── Neck ──────────────────────────────────────────────
//       ctx.fillStyle = "#c8956e";
//       ctx.beginPath();
//       ctx.ellipse(cx, cy + 132 + bob, 22, 24, 0, 0, Math.PI * 2);
//       ctx.fill();

//       // ── Head ──────────────────────────────────────────────
//       const headY = cy + bob;
//       // Shadow under head
//       ctx.fillStyle = "rgba(0,0,0,0.25)";
//       ctx.beginPath();
//       ctx.ellipse(cx + 4, headY + 6, 76, 82, 0, 0, Math.PI * 2);
//       ctx.fill();

//       // Skin
//       const skinG = ctx.createRadialGradient(cx - 15, headY - 20, 10, cx, headY, 80);
//       skinG.addColorStop(0, "#e8b898");
//       skinG.addColorStop(0.5, "#d4956a");
//       skinG.addColorStop(1, "#b87a4a");
//       ctx.fillStyle = skinG;
//       ctx.beginPath();
//       ctx.ellipse(cx, headY, 74, 84, 0, 0, Math.PI * 2);
//       ctx.fill();

//       // Ears
//       ctx.fillStyle = "#c8854a";
//       ctx.beginPath(); ctx.ellipse(cx - 74, headY + 10, 10, 14, 0, 0, Math.PI * 2); ctx.fill();
//       ctx.beginPath(); ctx.ellipse(cx + 74, headY + 10, 10, 14, 0, 0, Math.PI * 2); ctx.fill();
//       ctx.strokeStyle = "#a86838"; ctx.lineWidth = 1;
//       ctx.beginPath(); ctx.ellipse(cx - 74, headY + 10, 5, 8, 0, 0, Math.PI * 2); ctx.stroke();
//       ctx.beginPath(); ctx.ellipse(cx + 74, headY + 10, 5, 8, 0, 0, Math.PI * 2); ctx.stroke();

//       // Hair
//       ctx.fillStyle = "#1a1020";
//       ctx.beginPath();
//       ctx.ellipse(cx, headY - 52, 74, 44, 0, Math.PI, Math.PI * 2);
//       ctx.fill();
//       ctx.beginPath();
//       ctx.ellipse(cx, headY - 30, 78, 30, 0, Math.PI, Math.PI * 2);
//       ctx.fill();
//       // Side hair fade
//       ctx.fillStyle = "#251830";
//       ctx.beginPath(); ctx.ellipse(cx - 68, headY - 10, 12, 30, -0.2, 0, Math.PI * 2); ctx.fill();
//       ctx.beginPath(); ctx.ellipse(cx + 68, headY - 10, 12, 30, 0.2, 0, Math.PI * 2); ctx.fill();

//       // ── Eyebrows ─────────────────────────────────────────
//       const browRaise = isThinkingRef.current ? -4 : 0;
//       ctx.strokeStyle = "#3a2010";
//       ctx.lineWidth = 4;
//       ctx.lineCap = "round";
//       ctx.beginPath();
//       ctx.moveTo(cx - 48, headY - 32 + browRaise);
//       ctx.quadraticCurveTo(cx - 30, headY - 40 + browRaise, cx - 14, headY - 34 + browRaise);
//       ctx.stroke();
//       ctx.beginPath();
//       ctx.moveTo(cx + 48, headY - 32 + browRaise);
//       ctx.quadraticCurveTo(cx + 30, headY - 40 + browRaise, cx + 14, headY - 34 + browRaise);
//       ctx.stroke();

//       // ── Eyes ─────────────────────────────────────────────
//       const eyeY = headY - 16;
//       const eyeOffsets = [-30, 30];

//       eyeOffsets.forEach((ex) => {
//         // White
//         ctx.fillStyle = "#ffffff";
//         ctx.beginPath();
//         ctx.ellipse(cx + ex, eyeY, 14, blinkRef.current ? 1 : 12, 0, 0, Math.PI * 2);
//         ctx.fill();

//         if (!blinkRef.current) {
//           // Iris
//           const irisG = ctx.createRadialGradient(cx + ex - 2, eyeY - 2, 1, cx + ex, eyeY, 9);
//           irisG.addColorStop(0, "#6b4c2a");
//           irisG.addColorStop(0.5, "#3d2a10");
//           irisG.addColorStop(1, "#1a0e05");
//           ctx.fillStyle = irisG;
//           ctx.beginPath();
//           ctx.ellipse(cx + ex, eyeY, 9, 9, 0, 0, Math.PI * 2);
//           ctx.fill();

//           // Pupil
//           ctx.fillStyle = "#050200";
//           ctx.beginPath();
//           ctx.ellipse(cx + ex, eyeY, 5, 5, 0, 0, Math.PI * 2);
//           ctx.fill();

//           // Highlight
//           ctx.fillStyle = "rgba(255,255,255,0.9)";
//           ctx.beginPath();
//           ctx.ellipse(cx + ex + 4, eyeY - 4, 2.5, 2, 0, 0, Math.PI * 2);
//           ctx.fill();
//           ctx.fillStyle = "rgba(255,255,255,0.4)";
//           ctx.beginPath();
//           ctx.ellipse(cx + ex - 3, eyeY + 3, 1.2, 1, 0, 0, Math.PI * 2);
//           ctx.fill();
//         }
//       });

//       // ── Glasses ──────────────────────────────────────────
//       ctx.strokeStyle = "#7F77DD";
//       ctx.lineWidth = 2;
//       // Left frame
//       ctx.beginPath();
//       ctx.roundRect(cx - 52, eyeY - 16, 40, 28, 7);
//       ctx.stroke();
//       // Right frame
//       ctx.beginPath();
//       ctx.roundRect(cx + 12, eyeY - 16, 40, 28, 7);
//       ctx.stroke();
//       // Bridge
//       ctx.beginPath();
//       ctx.moveTo(cx - 12, eyeY - 4);
//       ctx.lineTo(cx + 12, eyeY - 4);
//       ctx.stroke();
//       // Temples
//       ctx.beginPath();
//       ctx.moveTo(cx - 52, eyeY - 4);
//       ctx.lineTo(cx - 68, eyeY);
//       ctx.stroke();
//       ctx.beginPath();
//       ctx.moveTo(cx + 52, eyeY - 4);
//       ctx.lineTo(cx + 68, eyeY);
//       ctx.stroke();
//       // Lens tint
//       ctx.fillStyle = "rgba(127,119,221,0.07)";
//       ctx.beginPath(); ctx.roundRect(cx - 51, eyeY - 15, 38, 26, 6); ctx.fill();
//       ctx.beginPath(); ctx.roundRect(cx + 13, eyeY - 15, 38, 26, 6); ctx.fill();

//       // ── Nose ─────────────────────────────────────────────
//       ctx.strokeStyle = "#a06840";
//       ctx.lineWidth = 1.5;
//       ctx.fillStyle = "rgba(0,0,0,0)";
//       ctx.beginPath();
//       ctx.moveTo(cx, headY - 5);
//       ctx.quadraticCurveTo(cx + 12, headY + 10, cx + 8, headY + 18);
//       ctx.quadraticCurveTo(cx, headY + 20, cx - 8, headY + 18);
//       ctx.quadraticCurveTo(cx - 12, headY + 10, cx, headY - 5);
//       ctx.stroke();
//       // Nostrils
//       ctx.fillStyle = "#8a5030";
//       ctx.beginPath(); ctx.ellipse(cx - 10, headY + 20, 5, 3, -0.3, 0, Math.PI * 2); ctx.fill();
//       ctx.beginPath(); ctx.ellipse(cx + 10, headY + 20, 5, 3, 0.3, 0, Math.PI * 2); ctx.fill();

//       // ── Mouth ─────────────────────────────────────────────
//       const mo = mouthOpenRef.current;
//       const mouthY = headY + 35;

//       // Lips outline
//       ctx.fillStyle = "#c06050";
//       ctx.beginPath();
//       ctx.ellipse(cx, mouthY, 26 + mo * 2, 8 + mo * 6, 0, 0, Math.PI * 2);
//       ctx.fill();

//       // Inner mouth / teeth when open
//       if (mo > 0.15) {
//         ctx.fillStyle = "#2a0a0a";
//         ctx.beginPath();
//         ctx.ellipse(cx, mouthY + 2, 20 + mo * 2, 4 + mo * 8, 0, 0, Math.PI * 2);
//         ctx.fill();

//         // Teeth
//         if (mo > 0.3) {
//           ctx.fillStyle = "#f5f0e8";
//           ctx.beginPath();
//           ctx.ellipse(cx, mouthY - 1, 16 + mo, 3 + mo * 2, 0, 0, Math.PI);
//           ctx.fill();
//         }
//       }

//       // Upper lip highlight
//       ctx.fillStyle = "rgba(255,255,255,0.15)";
//       ctx.beginPath();
//       ctx.ellipse(cx, mouthY - 3, 18, 3, 0, 0, Math.PI * 2);
//       ctx.fill();

//       // ── Thinking dots ─────────────────────────────────────
//       if (isThinkingRef.current) {
//         for (let d = 0; d < 3; d++) {
//           const dotPhase = Math.sin(t * 4 + d * 1.2);
//           const dotY = headY - 100 + dotPhase * 5;
//           const alpha = 0.4 + dotPhase * 0.3;
//           ctx.fillStyle = `rgba(127,119,221,${alpha})`;
//           ctx.beginPath();
//           ctx.arc(cx - 16 + d * 16, dotY, 5, 0, Math.PI * 2);
//           ctx.fill();
//         }
//       }

//       animFrameRef.current = requestAnimationFrame(draw);
//     };

//     animFrameRef.current = requestAnimationFrame(draw);
//     return () => cancelAnimationFrame(animFrameRef.current);
//   }, []);

//   // ── speakText ───────────────────────────────────────────────
//   const speakText = useCallback((text, onEnd) => {
//     if (isMuted) { onEnd?.(); return; }
//     if (!text) { onEnd?.(); return; }

//     synthRef.current.cancel();
//     clearInterval(speakIntervalRef.current);
//     isThinkingRef.current = false;
//     setStatusLabel("Speaking");
//     setShowWave(true);

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     // Pick a good voice — wait for voices to load
//     const assignVoice = () => {
//       const voices = synthRef.current.getVoices();
//       const v =
//         voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en-US")) ||
//         voices.find((v) => v.lang.startsWith("en-US")) ||
//         voices[0];
//       if (v) utterance.voice = v;
//     };

//     if (synthRef.current.getVoices().length > 0) {
//       assignVoice();
//     } else {
//       synthRef.current.addEventListener("voiceschanged", assignVoice, { once: true });
//     }

//     utterance.onstart = () => {
//       // Animate mouth while speaking
//       speakIntervalRef.current = setInterval(() => {
//         // Natural speech pattern — syllable bursts
//         const burst = Math.random();
//         mouthOpenRef.current = burst > 0.3
//           ? 0.3 + Math.random() * 0.7
//           : Math.random() * 0.2;
//       }, 70);
//     };

//     utterance.onend = () => {
//       clearInterval(speakIntervalRef.current);
//       mouthOpenRef.current = 0;
//       setStatusLabel("Ready");
//       setShowWave(false);
//       onEnd?.();
//     };

//     utterance.onerror = () => {
//       clearInterval(speakIntervalRef.current);
//       mouthOpenRef.current = 0;
//       setStatusLabel("Ready");
//       setShowWave(false);
//       onEnd?.();
//     };

//     synthRef.current.speak(utterance);
//   }, [isMuted]);

//   const stopSpeaking = useCallback(() => {
//     synthRef.current.cancel();
//     clearInterval(speakIntervalRef.current);
//     mouthOpenRef.current = 0;
//     isThinkingRef.current = false;
//     setStatusLabel("Ready");
//     setShowWave(false);
//   }, []);

//   const setThinking = useCallback((thinking) => {
//     isThinkingRef.current = thinking;
//     if (thinking) {
//       synthRef.current.cancel();
//       clearInterval(speakIntervalRef.current);
//       mouthOpenRef.current = 0;
//       setStatusLabel("Thinking...");
//       setShowWave(false);
//     } else {
//       setStatusLabel("Ready");
//     }
//   }, []);

//   useEffect(() => {
//     return () => {
//       synthRef.current.cancel();
//       clearInterval(speakIntervalRef.current);
//       cancelAnimationFrame(animFrameRef.current);
//       clearTimeout(blinkTimerRef.current);
//     };
//   }, []);

//   useImperativeHandle(ref, () => ({ speakText, stopSpeaking, setThinking }), [speakText, stopSpeaking, setThinking]);

//   return (
//     <div className="w-full h-full relative flex flex-col" style={{ background: "#0b0b0f" }}>
//       {/* Top bar */}
//       <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4">
//         <div className="flex items-center gap-2">
//           <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
//             isSpeaking ? "bg-purple-400 animate-pulse" : "bg-emerald-500"
//           }`} />
//           <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
//             {statusLabel}
//           </span>
//         </div>
//         <button
//           onClick={onToggleMute}
//           className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:bg-white/10 transition"
//         >
//           {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
//         </button>
//       </div>

//       {/* Canvas */}
//       <canvas
//         ref={canvasRef}
//         width={520}
//         height={560}
//         style={{ width: "100%", height: "100%", objectFit: "contain" }}
//       />

//       {/* Speaking waveform */}
//       <div
//         className="absolute left-1/2 -translate-x-1/2 flex items-end gap-1 transition-opacity duration-300"
//         style={{ bottom: 72, opacity: showWave ? 1 : 0 }}
//       >
//         {[4, 7, 12, 17, 12, 7, 4].map((h, i) => (
//           <div
//             key={i}
//             style={{
//               width: 3,
//               height: h,
//               background: "#a78bfa",
//               borderRadius: 2,
//               animation: showWave
//                 ? `tav-wave 0.6s ease-in-out ${i * 0.07}s infinite alternate`
//                 : "none",
//             }}
//           />
//         ))}
//       </div>

//       {/* Name plate */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
//         <div
//           className="flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-center"
//           style={{
//             background: "rgba(0,0,0,0.6)",
//             backdropFilter: "blur(12px)",
//             border: "0.5px solid rgba(255,255,255,0.08)",
//           }}
//         >
//           <p className="text-white/80 text-xs font-bold tracking-wider">{userName}</p>
//           <p className="text-white/30 text-[10px]">{userTitle}</p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes tav-wave {
//           from { transform: scaleY(0.3); }
//           to   { transform: scaleY(1.4); }
//         }
//       `}</style>
//     </div>
//   );
// });

// export default TalkingAvatar;


// components/avatar/TalkingAvatar.jsx
import {
  useRef, useState, useEffect, useCallback,
  forwardRef, useImperativeHandle,
} from "react";
import Lottie from "lottie-react";
import { Volume2, VolumeX } from "lucide-react";

// ── Import your two Lottie files ──────────────────────────────
// Adjust these paths to wherever you place the JSON files in your project.
// e.g. if they live in src/assets/avatars/ :
import idleAnimation   from "../../../assets/avatars/maya avatar.json";
import talkingAnimation from "../../../assets/avatars/Talking_maya avatar.json";

// ─────────────────────────────────────────────────────────────
const TalkingAvatar = forwardRef(function TalkingAvatar(
  {
    isSpeaking,
    isMuted,
    onToggleMute,
    userName  = "Maya",
    userTitle = "AI Interviewer",
  },
  ref
) {
  // Which Lottie to show
  const [mode, setMode]             = useState("idle");   // "idle" | "talking" | "thinking"
  const [statusLabel, setStatusLabel] = useState("Ready");
  const [showWave, setShowWave]     = useState(false);

  const synthRef          = useRef(window.speechSynthesis);
  const speakIntervalRef  = useRef(null);
  const isThinkingRef     = useRef(false);

  // ── speakText (called by parent via ref) ───────────────────
  const speakText = useCallback((text, onEnd) => {
    if (isMuted || !text) { onEnd?.(); return; }

    synthRef.current.cancel();
    clearInterval(speakIntervalRef.current);
    isThinkingRef.current = false;

    setMode("talking");
    setStatusLabel("Speaking");
    setShowWave(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate   = 0.9;
    utterance.pitch  = 1.0;
    utterance.volume = 1.0;

    const assignVoice = () => {
      const voices = synthRef.current.getVoices();
      const v =
        voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en-US")) ||
        voices.find((v) => v.lang.startsWith("en-US")) ||
        voices[0];
      if (v) utterance.voice = v;
    };
    if (synthRef.current.getVoices().length > 0) assignVoice();
    else synthRef.current.addEventListener("voiceschanged", assignVoice, { once: true });

    utterance.onend = () => {
      clearInterval(speakIntervalRef.current);
      setMode("idle");
      setStatusLabel("Ready");
      setShowWave(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      clearInterval(speakIntervalRef.current);
      setMode("idle");
      setStatusLabel("Ready");
      setShowWave(false);
      onEnd?.();
    };

    synthRef.current.speak(utterance);
  }, [isMuted]);

  // ── stopSpeaking ───────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    clearInterval(speakIntervalRef.current);
    isThinkingRef.current = false;
    setMode("idle");
    setStatusLabel("Ready");
    setShowWave(false);
  }, []);

  // ── setThinking ────────────────────────────────────────────
  const setThinking = useCallback((thinking) => {
    isThinkingRef.current = thinking;
    if (thinking) {
      synthRef.current.cancel();
      clearInterval(speakIntervalRef.current);
      setMode("thinking");
      setStatusLabel("Thinking...");
      setShowWave(false);
    } else {
      setMode("idle");
      setStatusLabel("Ready");
    }
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => {
      synthRef.current.cancel();
      clearInterval(speakIntervalRef.current);
    };
  }, []);

  // ── Expose imperative API ──────────────────────────────────
  useImperativeHandle(ref, () => ({ speakText, stopSpeaking, setThinking }), [
    speakText, stopSpeaking, setThinking,
  ]);

  // Which animation data to hand to Lottie
  const animationData = mode === "talking" ? talkingAnimation : idleAnimation;

  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center"
      style={{ background: "#0b0b0f" }}
    >
      {/* ── Top status bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
              mode === "talking"  ? "bg-purple-400 animate-pulse"
              : mode === "thinking" ? "bg-amber-400 animate-pulse"
              : "bg-emerald-500"
            }`}
          />
          <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
            {statusLabel}
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:bg-white/10 transition"
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>

      {/* ── Lottie avatar ── */}
      <div className="w-full h-full flex items-center justify-center">
        <Lottie
          key={mode === "talking" ? "talking" : "idle"}   // remount when switching
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* ── Thinking dots overlay ── */}
      {mode === "thinking" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex gap-2 mb-[30%]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 10, height: 10,
                  borderRadius: "50%",
                  background: "#7F77DD",
                  animation: `thinking-bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Speaking waveform ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-end gap-1 transition-opacity duration-300"
        style={{ bottom: 72, opacity: showWave ? 1 : 0 }}
      >
        {[4, 7, 12, 17, 12, 7, 4].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3, height: h,
              background: "#a78bfa",
              borderRadius: 2,
              animation: showWave
                ? `tav-wave 0.6s ease-in-out ${i * 0.07}s infinite alternate`
                : "none",
            }}
          />
        ))}
      </div>

      {/* ── Name plate ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div
          className="flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-center"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            border: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-white/80 text-xs font-bold tracking-wider">{userName}</p>
          <p className="text-white/30 text-[10px]">{userTitle}</p>
        </div>
      </div>

      <style>{`
        @keyframes tav-wave {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1.4); }
        }
        @keyframes thinking-bounce {
          from { transform: translateY(0); opacity: 0.4; }
          to   { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
});

export default TalkingAvatar;
