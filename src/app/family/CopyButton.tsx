"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-white/20"
      title="Copiar código"
    >
      {copied ? (
        <CheckCircle2 className="w-6 h-6 text-green-300" />
      ) : (
        <Copy className="w-6 h-6 text-white" />
      )}
    </button>
  );
}
