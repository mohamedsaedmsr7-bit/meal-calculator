"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { DB } from "./foods";

// ========== ثوابت التصميم ==========
const C = {
  bg: "#0a0a12", card: "#11111e", cardBorder: "#1e1e35",
  neon: "#c8f135", teal: "#35f1c8", red: "#ff6b6b",
  orange: "#ffaa44", muted: "#4a4a6a", text: "#e8e8f0", subtext: "#7070a0",
};
const stateTag = (s) => {
  const map = {
    مطبوخ: C.neon, مسلوق: C.neon, مشوي: C.neon,
    نيء: C.red, جاف: C.red, خام: C.red, مقلي: C.red,
    معلب: C.teal, سائل: C.teal, عصير: C.teal,
    طازج: C.orange, جاهز: C.orange,
    عادي: C.subtext, "قليل الدسم": C.teal, لايت: C.teal,
  };
  return map[s] || C.subtext;
};
const INPUT_STYLE = {
  width: "100%", padding: "12px 14px",
  background: "#ffffff07", border: `1px solid #1e1e35`,
  borderRadius: 12, color: "#e8e8f0",
  fontSize: "0.95rem", fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", direction: "rtl",
};

// ========== أدوات مساعدة ==========
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
// ---- الوحدات: g (لكل 100جم) | ml (لكل 100مل) | piece (لكل حبة/وحدة) ----
const isPiece = (f) => f.unit === "piece";
const unitAr = (f) => (f.unit === "ml" ? "مل" : isPiece(f) ? "حبة" : "جم");
const unitEn = (f) => (f.unit === "ml" ? "ml" : isPiece(f) ? "pc" : "g");
const perText = (f) => `${f.cal} kcal/${isPiece(f) ? "حبة" : f.unit === "ml" ? "100ml" : "100g"}`;
const caloriesOf = (f, qty) => (isPiece(f) ? f.cal * qty : (f.cal * qty) / 100);
const calcQty = (totalCals, f, round5) => {
  if (isPiece(f)) {
    const raw = totalCals / f.cal;
    return round5 ? Math.max(0.5, Math.round(raw * 2) / 2) : Math.round(raw * 10) / 10;
  }
  const raw = (totalCals / f.cal) * 100;
  return round5 ? Math.max(5, Math.round(raw / 5) * 5) : Math.round(raw);
};
const macrosAt = (f, qty) => {
  const k = isPiece(f) ? qty : qty / 100;
  return { p: Math.round((f.p || 0) * k * 10) / 10, c: Math.round((f.c || 0) * k * 10) / 10, f: Math.round((f.f || 0) * k * 10) / 10 };
};
const fmtQty = (f, qty) => `${qty} ${unitAr(f)}`;
const buildCopyText = (food, qty, items) =>
  `بدائل ${food.ar} (${fmtQty(food, qty)}):\n` + items.map((a) => `- ${a.ar}: ${fmtQty(a, a.needed)}`).join("\n");

// ========== المكونات الفرعية ==========
function CopyButton({ getText, label = "نسخ", small = false, color }) {
  const [state, setState] = useState("idle"); // idle | ok | fail
  const col = color || C.teal;
  const onClick = async (e) => {
    e.stopPropagation();
    const ok = await copyText(getText());
    setState(ok ? "ok" : "fail");
    setTimeout(() => setState("idle"), 1600);
  };
  const text = state === "ok" ? "تم النسخ ✓" : state === "fail" ? "فشل النسخ" : label;
  const c = state === "ok" ? C.neon : state === "fail" ? C.red : col;
  return (
    <button onClick={onClick} style={{
      background: `${c}14`, border: `1px solid ${c}55`, color: c,
      borderRadius: 10, padding: small ? "3px 9px" : "9px 16px",
      fontSize: small ? "0.68rem" : "0.82rem", fontWeight: 700,
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap",
    }}>{small && state === "idle" ? "📋" : ""} {text}</button>
  );
}

function StepLabel({ num, text, color }) {
  const col = color || C.neon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{
        background: `${col}20`, color: col, width: 22, height: 22, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.7rem", fontWeight: 800, flexShrink: 0,
      }}>{num}</span>
      <span style={{ color: C.subtext, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {text}
      </span>
    </div>
  );
}

// multi=true => selectedList (مصفوفة) وتعدد الاختيار
function FoodSelector({ label, stepNum, catFoods, selected, selectedList, multi, onSelect, search, onSearch, stepColor }) {
  const col = stepColor || C.neon;
  const filtered = useMemo(() => {
    if (!search.trim()) return catFoods;
    const q = search.toLowerCase();
    return catFoods.filter((f) => f.ar.includes(search) || f.en.toLowerCase().includes(q));
  }, [search, catFoods]);
  return (
    <div>
      <StepLabel num={stepNum} text={label} color={col} />
      <div style={{ position: "relative", marginBottom: 8 }}>
        <span style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", fontSize: 13, opacity: 0.35 }}>🔍</span>
        <input value={search} onChange={(e) => onSearch(e.target.value)}
          placeholder="ابحث بالعربي أو الإنجليزي..."
          style={{ ...INPUT_STYLE, paddingRight: 34 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 190, overflowY: "auto", marginBottom: "0.8rem" }}>
        {filtered.length === 0 && (
          <p style={{ color: C.muted, fontSize: "0.78rem", textAlign: "center", padding: 10 }}>لا توجد نتائج</p>
        )}
        {filtered.map((f) => {
          const active = multi ? selectedList.some((x) => x.en === f.en) : selected?.en === f.en;
          return (
            <button key={f.en} onClick={() => onSelect(f)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 12,
              border: `1px solid ${active ? col + "88" : C.cardBorder}`,
              background: active ? `${col}12` : "#ffffff04",
              cursor: "pointer", fontFamily: "inherit", textAlign: "right",
              transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {multi && (
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: `1px solid ${active ? col : C.muted}`,
                    background: active ? col : "transparent", color: C.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 900,
                  }}>{active ? "✓" : ""}</span>
                )}
                <span style={{
                  background: `${stateTag(f.state)}18`, color: stateTag(f.state),
                  padding: "2px 8px", borderRadius: 6, fontSize: "0.65rem", fontWeight: 600,
                }}>{f.state}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                <span style={{ color: active ? col : C.text, fontSize: "0.88rem", fontWeight: active ? 700 : 400 }}>{f.ar}</span>
                <span style={{ color: C.muted, fontSize: "0.65rem" }}>{f.en} · {perText(f)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AlternativeRow({ alt }) {
  const pct = Math.min(100, Math.round((alt.needed / (isPiece(alt) ? 10 : 500)) * 100));
  const m = macrosAt(alt, alt.needed);
  return (
    <div style={{ background: "#ffffff05", border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          <div>
            <span style={{ color: C.teal, fontWeight: 800, fontSize: "1.2rem" }}>{alt.needed}</span>
            <span style={{ color: C.subtext, fontSize: "0.75rem", marginRight: 3 }}>{unitEn(alt)}</span>
          </div>
          <CopyButton small getText={() => `${alt.ar}: ${fmtQty(alt, alt.needed)}`} label="نسخ" />
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.text, fontSize: "0.9rem", fontWeight: 600 }}>{alt.ar}</div>
          <span style={{
            background: `${stateTag(alt.state)}18`, color: stateTag(alt.state),
            padding: "1px 7px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 700,
            display: "inline-block", marginTop: 2,
          }}>{alt.state} · {alt.cal} kcal</span>
          {(m.p > 0 || m.c > 0 || m.f > 0) && (
            <div style={{ color: C.muted, fontSize: "0.65rem", marginTop: 4 }} dir="ltr">P {m.p} · C {m.c} · F {m.f}</div>
          )}
        </div>
      </div>
      <div style={{ height: 4, background: C.cardBorder, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.teal}, ${C.neon})`, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function MealCard({ index, onRemove, showRemove }) {
  const firstCat = Object.keys(DB)[0];
  const [mode, setMode] = useState("all");
  const [cat, setCat] = useState(firstCat);
  const [food, setFood] = useState(DB[firstCat][0]);
  const [grams, setGrams] = useState("");
  const [search, setSearch] = useState("");
  const [targets, setTargets] = useState([]); // بدائل محددة (متعددة)
  const [searchB, setSearchB] = useState("");
  const [round5, setRound5] = useState(false);
  const gramsRef = useRef(null);
  const catFoods = DB[cat];

  const handleCatChange = (c) => {
    setCat(c); setFood(DB[c][0]); setTargets([]);
    setSearch(""); setSearchB(""); setGrams("");
  };
  const toggleTarget = (f) =>
    setTargets((prev) => (prev.some((x) => x.en === f.en) ? prev.filter((x) => x.en !== f.en) : [...prev, f]));

  const totalCals = useMemo(() => {
    const g = parseFloat(grams);
    return !g || g <= 0 ? 0 : caloriesOf(food, g);
  }, [food, grams]);

  const alternatives = useMemo(() => {
    if (!totalCals) return [];
    return catFoods
      .filter((f) => f.en !== food.en)
      .map((f) => ({ ...f, needed: calcQty(totalCals, f, round5) }))
      .sort((a, b) => a.needed - b.needed);
  }, [totalCals, catFoods, food, round5]);

  const specificResults = useMemo(() => {
    if (!totalCals || !targets.length) return [];
    return targets.map((f) => ({ ...f, needed: calcQty(totalCals, f, round5) }));
  }, [totalCals, targets, round5]);

  const RoundToggle = (
    <label style={{ display: "flex", alignItems: "center", gap: 8, color: C.subtext, fontSize: "0.78rem", cursor: "pointer", marginBottom: 12 }}>
      <input type="checkbox" checked={round5} onChange={(e) => setRound5(e.target.checked)} style={{ accentColor: C.neon }} />
      تقريب الجرامات لأقرب 5 جم
    </label>
  );

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderRadius: 24, padding: "1.6rem", position: "relative",
      boxShadow: "0 10px 40px #00000060, inset 0 1px 0 #ffffff08",
    }}>
      {showRemove && (
        <button onClick={onRemove} style={{
          position: "absolute", top: 18, left: 18,
          background: "#ff6b6b18", border: `1px solid ${C.red}44`,
          color: C.red, borderRadius: 10, padding: "5px 12px",
          cursor: "pointer", fontSize: 13, fontFamily: "inherit",
        }}>✕</button>
      )}
      <div style={{
        textAlign: "center", marginBottom: "1.2rem",
        fontSize: "0.75rem", letterSpacing: "0.2em",
        color: C.neon, fontWeight: 700, opacity: 0.7, textTransform: "uppercase",
      }}>◈ وجبة {index + 1}</div>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.4rem", background: "#ffffff06", borderRadius: 14, padding: 5 }}>
        {["all", "specific"].map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "10px 8px", borderRadius: 10,
            border: `1px solid ${mode === m ? C.neon + "55" : "transparent"}`,
            background: mode === m ? `${C.neon}12` : "transparent",
            color: mode === m ? C.neon : C.subtext,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
          }}>
            <div style={{ fontSize: "0.85rem", fontWeight: mode === m ? 700 : 400 }}>
              {m === "all" ? "📋 كل البدائل" : "🎯 بدائل محددة"}
            </div>
          </button>
        ))}
      </div>

      <StepLabel num="1" text="اختر الفئة الغذائية" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.4rem" }}>
        {Object.keys(DB).map((c) => (
          <button key={c} onClick={() => handleCatChange(c)} style={{
            padding: "6px 14px", borderRadius: 50,
            border: `1px solid ${cat === c ? C.neon : C.cardBorder}`,
            background: cat === c ? `${C.neon}22` : "transparent",
            color: cat === c ? C.neon : C.subtext,
            cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit",
            fontWeight: cat === c ? 700 : 400,
          }}>{c}</button>
        ))}
      </div>

      {mode === "all" ? (
        <>
          <FoodSelector
            label="اختر الصنف الأساسي" stepNum="2" catFoods={catFoods} selected={food}
            onSelect={(f) => { setFood(f); setGrams(""); setTimeout(() => gramsRef.current?.focus(), 50); }}
            search={search} onSearch={setSearch}
          />
          <StepLabel num="3" text={`أدخل الكمية (${unitAr(food)})`} />
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input ref={gramsRef} type="number" min={0} value={grams}
              onChange={(e) => setGrams(e.target.value)} placeholder="مثال: 150" style={INPUT_STYLE} />
            <span style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", color: C.subtext, fontSize: "0.8rem" }}>{unitAr(food)}</span>
          </div>
          {totalCals > 0 && (
            <>
              <div style={{
                background: `linear-gradient(135deg, ${C.neon}14, ${C.teal}08)`,
                border: `1px solid ${C.neon}33`, borderRadius: 16, padding: "16px 20px", marginBottom: 15,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: C.subtext, fontSize: "0.7rem", marginBottom: 4 }}>إجمالي السعرات</div>
                    <div style={{ color: C.neon, fontWeight: 900, fontSize: "1.8rem", lineHeight: 1 }}>
                      {Math.round(totalCals)}<span style={{ fontSize: "0.8rem", fontWeight: 400, marginRight: 5, color: C.subtext }}>kcal</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: C.text, fontSize: "0.95rem", fontWeight: 700 }}>{food.ar}</div>
                    <div style={{ color: C.muted, fontSize: "0.75rem" }}>{grams} {unitEn(food)} × {food.cal} cal</div>
                  </div>
                </div>
              </div>
              {RoundToggle}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
                <div style={{ fontSize: "0.75rem", color: C.teal, fontWeight: 800, letterSpacing: "0.1em" }}>
                  البدائل المقترحة بنفس السعرات
                </div>
                <CopyButton label="📋 نسخ كل البدائل" getText={() => buildCopyText(food, grams, alternatives)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alternatives.map((alt) => <AlternativeRow key={alt.en} alt={alt} />)}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div style={{ background: `${C.neon}05`, border: `1px solid ${C.neon}22`, borderRadius: 16, padding: "14px", marginBottom: 12 }}>
            <div style={{ color: C.neon, fontSize: "0.75rem", fontWeight: 800, marginBottom: 10 }}>🅐 الصنف الأساسي</div>
            <FoodSelector
              label="اختر الصنف" stepNum="2" catFoods={catFoods} selected={food}
              onSelect={(f) => { setFood(f); setGrams(""); }}
              search={search} onSearch={setSearch} stepColor={C.neon}
            />
            <StepLabel num="3" text="الكمية" color={C.neon} />
            <div style={{ position: "relative" }}>
              <input ref={gramsRef} type="number" min={0} value={grams}
                onChange={(e) => setGrams(e.target.value)} placeholder="0"
                style={{ ...INPUT_STYLE, border: `1px solid ${C.neon}44` }} />
              <span style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", color: C.subtext, fontSize: "0.8rem" }}>{unitAr(food)}</span>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "10px 0", fontSize: "1.5rem", color: C.teal }}>⇅</div>

          <div style={{ background: `${C.teal}05`, border: `1px solid ${C.teal}22`, borderRadius: 16, padding: "14px", marginBottom: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ color: C.teal, fontSize: "0.75rem", fontWeight: 800 }}>
                🅑 الأصناف البديلة (اختر أكتر من صنف)
              </div>
              {targets.length > 0 && (
                <button onClick={() => setTargets([])} style={{
                  background: "transparent", border: "none", color: C.subtext,
                  fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit",
                }}>مسح ({targets.length})</button>
              )}
            </div>
            <FoodSelector
              label="اختر البدائل" stepNum="4" catFoods={catFoods}
              multi selectedList={targets} onSelect={toggleTarget}
              search={searchB} onSearch={setSearchB} stepColor={C.teal}
            />
          </div>

          {totalCals > 0 && specificResults.length > 0 && (
            <div style={{
              background: `linear-gradient(135deg, ${C.teal}20, ${C.neon}10)`,
              border: `2px solid ${C.teal}44`, borderRadius: 20, padding: "20px 16px",
            }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <div style={{ color: C.neon, fontWeight: 900, fontSize: "1.5rem" }}>{grams} {unitEn(food)}</div>
                <div style={{ color: C.subtext, fontSize: "0.8rem" }}>{food.ar} · {Math.round(totalCals)} سعرة</div>
                <div style={{ color: C.muted, fontSize: "1.4rem", margin: "6px 0" }}>=</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {specificResults.map((r) => (
                  <div key={r.en} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#00000030", border: `1px solid ${C.teal}22`, borderRadius: 12, padding: "10px 14px", gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: C.teal, fontWeight: 900, fontSize: "1.4rem" }}>{r.needed} {unitEn(r)}</span>
                      <CopyButton small getText={() => `${r.ar}: ${fmtQty(r, r.needed)}`} />
                    </div>
                    <span style={{ color: C.text, fontSize: "0.88rem", fontWeight: 600, textAlign: "right" }}>{r.ar}</span>
                  </div>
                ))}
              </div>
              {RoundToggle}
              <CopyButton label="📋 نسخ كل البدائل المختارة" getText={() => buildCopyText(food, grams, specificResults)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ========== التطبيق الرئيسي ==========
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [meals, setMeals] = useState([{ id: 1 }]);

  useEffect(() => {
    const auth = localStorage.getItem("is_auth_2025");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "2025") {
      setIsAuthenticated(true);
      localStorage.setItem("is_auth_2025", "true");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("is_auth_2025");
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: C.bg, direction: "rtl" }}>
        <div style={{ width: "100%", maxWidth: 400, padding: "2.5rem 2rem", background: C.card, borderRadius: 30, border: `1px solid ${C.cardBorder}`, boxShadow: "0 20px 50px #000000", textAlign: "center" }}>
          <div style={{ width: 70, height: 70, background: `${C.neon}12`, borderRadius: 20, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.neon}33`, color: C.neon, fontSize: 32 }}>⚡</div>
          <h2 style={{ margin: "0 0 10px", fontSize: "1.6rem", fontWeight: 900, color: C.text }}>MSR Food Alternatives</h2>
          <p style={{ color: C.subtext, fontSize: "0.9rem", marginBottom: 30 }}>أدخل كلمة المرور الموحدة</p>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" style={{ ...INPUT_STYLE, textAlign: "center", fontSize: "1.2rem", letterSpacing: 5, border: `1px solid ${error ? C.red : C.cardBorder}`, background: error ? `${C.red}05` : "#ffffff07" }} autoFocus />
            {error && <div style={{ color: C.red, fontSize: "0.8rem", marginTop: 8, fontWeight: 700 }}>كلمة المرور غير صحيحة!</div>}
            <button type="submit" style={{ width: "100%", marginTop: 24, padding: "14px", background: C.neon, color: C.bg, border: "none", borderRadius: 16, fontSize: "1rem", fontWeight: 900, cursor: "pointer", boxShadow: `0 8px 20px ${C.neon}33` }}>دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Cairo', sans-serif", direction: "rtl", color: C.text }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 60% 40% at 80% 10%, ${C.neon}05 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 10% 80%, ${C.teal}04 0%, transparent 60%)` }} />

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 16px 100px", position: "relative", zIndex: 1 }}>
        <header style={{ textAlign: "center", padding: "3rem 0 2rem", position: "relative" }}>
          <button onClick={handleLogout} style={{ position: "absolute", top: 20, left: 0, background: "transparent", border: `1px solid ${C.subtext}33`, color: C.subtext, padding: "4px 10px", borderRadius: 8, fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit" }}>خروج</button>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.neon}12`, border: `1px solid ${C.neon}33`, color: C.neon, padding: "6px 16px", borderRadius: 25, fontSize: "0.7rem", letterSpacing: "0.15em", fontWeight: 800, marginBottom: 15 }}>⚡ MSR NUTRITION</div>
          <h1 style={{ margin: "0 0 10px", fontSize: "2rem", fontWeight: 900, lineHeight: 1.2 }}>
            <span style={{ color: C.neon }}>MSR Food Alternatives</span>
            <br />بدائل الأكل
          </h1>
          <p style={{ color: C.subtext, margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>استبدل أكلاتك المفضلة بنفس السعرات بدقة متناهية</p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {meals.map((m, i) => (
            <MealCard key={m.id} index={i} showRemove={meals.length > 1} onRemove={() => setMeals((prev) => prev.filter((x) => x.id !== m.id))} />
          ))}
        </div>

        {meals.length < 5 && (
          <button onClick={() => setMeals((prev) => [...prev, { id: Date.now() }])} style={{ width: "100%", marginTop: 20, padding: "16px", background: "transparent", border: `2px dashed ${C.neon}33`, borderRadius: 20, color: C.neon, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>＋ إضافة وجبة أخرى</button>
        )}

        <footer style={{ textAlign: "center", marginTop: 40, color: C.muted, fontSize: "0.75rem", padding: "0 20px" }}>
          الحسابات مبنية على السعرات لكل 100 جرام، من قاعدة MSR Nutrition Planner<br />
          <div style={{ color: `${C.neon}66`, marginTop: 8, fontWeight: 700 }}>◈ MSR Food Alternatives ◈</div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: ${C.bg}; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input:focus { border-color: ${C.neon}88 !important; background: #ffffff0a !important; }
        button:active { transform: scale(0.98); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.neon}22; border-radius: 10px; }
      `}</style>
    </div>
  );
}
