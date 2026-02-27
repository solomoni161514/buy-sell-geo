import React, { useEffect } from "react";
import ReactDOM from "react-dom";

type Props = {
  open: boolean;
  message?: string;
  duration?: number; // ms
  onClose?: () => void;
};

const SuccessAlert: React.FC<Props> = ({ open, message = "Success", duration = 1600, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const t = window.setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(t);
    };
  }, [open, duration, onClose]);

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-hidden />
      <div className="relative z-10 pointer-events-auto mx-4 w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 dark:bg-gray-900/95 border border-border p-6 text-center shadow-2xl">
          <div
            className="flex items-center justify-center rounded-full w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg relative"
            role="img"
            aria-hidden="true"
            style={{ transformOrigin: "center" }}
          >
            <span className="text-white text-6xl leading-none animate-pop">{"✅"}</span>
          </div>

          <h3 className="text-lg font-semibold text-foreground">{message}</h3>
          <p className="text-sm text-muted-foreground">You're all set.</p>
        </div>
      </div>

      <style>{`
        .animate-pop {
          animation: pop 420ms cubic-bezier(.22,1,.36,1) both;
          transform-origin: center;
        }
        @keyframes pop {
          0% { transform: scale(.6) translateY(6px); opacity: 0; }
          60% { transform: scale(1.08) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        /* Slight pulse on the circle background after pop */
        .w-28.h-28 { will-change: transform; position: relative; }
        .w-28.h-28:after {
          content: "";
          position: absolute;
          width: 140%;
          height: 140%;
          border-radius: 9999px;
          background: radial-gradient(circle at center, rgba(16,185,129,0.14), transparent 40%);
          top: -20%;
          left: -20%;
          transform: scale(0.95);
          animation: glow 900ms ease-out 260ms forwards;
          pointer-events: none;
        }
        @keyframes glow {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default SuccessAlert;
