import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

const TalkingAvatar = forwardRef(function TalkingAvatar({ isSpeaking }, ref) {
  const containerRef = useRef(null);
  const headRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useImperativeHandle(ref, () => ({
    speakText: (text) => {
      if (headRef.current && loaded) {
        try {
          headRef.current.speakText(text, null, null, null, {
            avatarMood: "neutral"
          });
        } catch (e) {
          console.warn("TalkingHead speakText failed:", e);
        }
      }
    },
    stopSpeaking: () => {
      if (headRef.current) {
        try { headRef.current.stopSpeaking(); } catch (e) {}
      }
    }
  }));

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        if (!containerRef.current) return;

        // Dynamically import TalkingHead from CDN
        const module = await import(
          /* @vite-ignore */
          "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.3/modules/talkinghead.mjs"
        );
        const { TalkingHead } = module;

        if (cancelled) return;

        const nodeAvatar = document.createElement("div");
        nodeAvatar.style.width = "100%";
        nodeAvatar.style.height = "100%";
        containerRef.current.appendChild(nodeAvatar);

        const head = new TalkingHead(nodeAvatar, {
          ttsEndpoint: null,
          cameraView: "upper",
          cameraRotateEnable: false,
          cameraX: 0,
          cameraY: 0.3,
          cameraDistance: 1.6,
        });

        await head.showAvatar({
          url: "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb",
          body: "F",
          avatarMood: "neutral",
          ttsLang: "en-US",
        });

        if (cancelled) return;

        headRef.current = head;
        setLoaded(true);
      } catch (err) {
        console.error("TalkingHead init failed:", err);
        if (!cancelled) setLoadError(true);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (headRef.current) {
        try { headRef.current.stopSpeaking(); } catch (e) {}
      }
    };
  }, []);

  if (loadError) {
    // Fallback: simple animated avatar placeholder
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem]">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/60 to-primary/20 flex items-center justify-center text-5xl select-none">
            🤖
          </div>
          {isSpeaking && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white animate-ping" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4">AI Interviewer</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-[2rem] overflow-hidden bg-gray-900">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
          <p className="text-xs text-gray-400">Loading avatar...</p>
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: loaded ? "block" : "none",
        }}
      />
    </div>
  );
});

export default TalkingAvatar;