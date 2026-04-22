"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  bg: "#0a0a12", card: "#11111e", cardBorder: "#1e1e35",
  neon: "#c8f135", subtext: "#7070a0", text: "#e8e8f0",
};

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("❌ كلمة السر غلط، حاول تاني");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse 60% 50% at 60% 20%, #c8f13507, transparent 60%), #0a0a12`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Cairo', sans-serif", direction: "rtl",
    }}>
      <div style={{
        width: "90%", maxWidth: 380,
        background: C.card, border: `1px solid ${C.cardBorder}`,
        borderRadius: 24, padding: "2.5rem 2rem",
        boxShadow: "0 0 60px #00000060, inset 0 1px 0 #ffffff08",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>⚡</div>
          <h1 style={{ margin: 0, color: C.text, fontSize: "1.3rem", fontWeight: 800 }}>
            حاسبة بدائل الوجبات
          </h1>
          <p style={{ color: C.subtext, margin: "6px 0 0", fontSize: "0.8rem" }}>
            أدخل كلمة السر للدخول
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="كلمة السر..."
          style={{
            width: "100%", padding: "12px 16px",
            background: "#ffffff08",
            border: `1px solid ${error ? "#ff6b6b44" : C.cardBorder}`,
            borderRadius: 12, color: C.text, fontSize: "1rem",
            fontFamily: "inherit", outline: "none",
            boxSizing: "border-box", direction: "rtl",
            marginBottom: 10,
          }}
        />

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "0.8rem", margin: "0 0 10px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || !password.trim()}
          style={{
            width: "100%", padding: "13px",
            background: "#c8f13522", border: "1px solid #c8f13555",
            borderRadius: 12, color: C.neon,
            fontFamily: "inherit", fontSize: "0.95rem",
            fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.05em",
          }}
        >
          {loading ? "جاري التحقق..." : "دخول ⚡"}
        </button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
    </div>
  );
}