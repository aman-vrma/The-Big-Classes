import { useState, useEffect } from "react";
import { Sparkles, GraduationCap } from "lucide-react";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // 2.3 seconds ke baad cinematic zoom-out fade trigger hoga
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onFinish, 550);
    }, 2300);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#030712",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        userSelect: "none",
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? "scale(1.08)" : "scale(1)",
        filter: fadingOut ? "blur(4px)" : "none",
        transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), filter 0.55s ease",
      }}
    >
      {/* Dynamic Keyframe Styles */}
      <style>{`
        @keyframes cinematicZoom {
          0% {
            opacity: 0;
            transform: scale(0.75) translateY(20px);
            filter: blur(12px);
          }
          40% {
            opacity: 1;
            transform: scale(1.03) translateY(0);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes emblemAura {
          0% {
            transform: scale(0.6) rotate(-8deg);
            opacity: 0;
            box-shadow: 0 0 0 rgba(37, 99, 235, 0);
          }
          50% {
            transform: scale(1.08) rotate(0deg);
            opacity: 1;
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.6);
          }
          100% {
            transform: scale(1) rotate(0deg);
            box-shadow: 0 0 40px rgba(37, 99, 235, 0.4);
          }
        }

        @keyframes letterReveal {
          0% {
            letter-spacing: -2px;
            opacity: 0;
            filter: blur(8px);
          }
          60% {
            letter-spacing: 7px;
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            letter-spacing: 5px;
            opacity: 1;
          }
        }

        @keyframes shimmerSweep {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          100% {
            transform: translateX(250%) skewX(-25deg);
          }
        }

        @keyframes pulseRadial {
          0% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.15);
          }
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
        }

        @keyframes beamProgress {
          0% {
            width: 0%;
            opacity: 0.4;
          }
          50% {
            width: 70%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0.9;
          }
        }
      `}</style>

      {/* Cinematic Radial Background Glow (Netflix style center spotlight) */}
      <div
        style={{
          position: "absolute",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 70%)",
          animation: "pulseRadial 3s infinite ease-in-out",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
          animation: "cinematicZoom 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Glowing 3D Emblem with Gradient & Flare */}
        <div
          style={{
            position: "relative",
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #6366f1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            border: "1.5px solid rgba(255, 255, 255, 0.25)",
            animation: "emblemAura 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            overflow: "hidden",
          }}
        >
          {/* Light Sweep over Icon */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)",
              animation: "shimmerSweep 1.8s infinite",
            }}
          />
          <GraduationCap style={{ width: "42px", height: "42px", color: "#ffffff", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }} />
        </div>

        {/* Cinematic Title with Expanding Tracking & Shimmer */}
        <div style={{ position: "relative", overflow: "hidden", padding: "4px 12px" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 6vw, 42px)",
              fontWeight: "900",
              margin: 0,
              fontFamily: "'Cinzel', 'Playfair Display', serif, system-ui",
              textTransform: "uppercase",
              background: "linear-gradient(180deg, #ffffff 20%, #cbd5e1 75%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 35px rgba(59, 130, 246, 0.5)",
              animation: "letterReveal 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            THE BIG CLASSES
          </h1>

          {/* Shimmer Light passing across title text */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)",
              animation: "shimmerSweep 2s infinite ease-in-out",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Subtitle with High-Tech Glow */}
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "3.5px",
            color: "#93c5fd",
            textTransform: "uppercase",
            fontWeight: "700",
            margin: "10px 0 28px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: 0.9,
          }}
        >
          <Sparkles style={{ width: "13px", height: "13px", color: "#60a5fa" }} />
          AI PROCTOR & LEARNING ARENA
        </p>

        {/* Sleek Laser Loading Line (Netflix red-bar inspired) */}
        <div
          style={{
            width: "200px",
            height: "3px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "9999px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 0 10px rgba(37, 99, 235, 0.3)",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #2563eb, #60a5fa, #c084fc)",
              borderRadius: "9999px",
              boxShadow: "0 0 12px #3b82f6",
              animation: "beamProgress 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          />
        </div>
      </div>
    </div>
  );
}
