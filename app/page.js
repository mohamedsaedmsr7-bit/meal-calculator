"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// ========== قاعدة البيانات الكاملة ==========
const DB = {
  "🍚 نشويات": [
    { en: "Cooked White Rice",    ar: "أرز أبيض مطبوخ",       state: "مطبوخ",    cal: 130 },
    { en: "Raw White Rice",       ar: "أرز أبيض (نيء)",        state: "نيء",      cal: 360 },
    { en: "Cooked Brown Rice",    ar: "أرز بني مطبوخ",         state: "مطبوخ",    cal: 112 },
    { en: "Raw Brown Rice",       ar: "أرز بني (نيء)",         state: "نيء",      cal: 360 },
    { en: "Boiled Pasta",         ar: "مكرونة مسلوقة",         state: "مسلوق",    cal: 130 },
    { en: "Raw Pasta",            ar: "مكرونة (نيئة)",         state: "نيء",      cal: 350 },
    { en: "Cooked Oats",          ar: "شوفان مطبوخ",           state: "مطبوخ",    cal: 70  },
    { en: "Raw Oats",             ar: "شوفان (خام)",           state: "نيء",      cal: 380 },
    { en: "Boiled Potatoes",      ar: "بطاطس مسلوقة",          state: "مسلوق",    cal: 87  },
    { en: "Raw Potatoes",         ar: "بطاطس (نيئة)",          state: "نيء",      cal: 77  },
    { en: "Baked Sweet Potato",   ar: "بطاطا حلوة مشوية",      state: "مشوي",     cal: 105 },
    { en: "Raw Sweet Potato",     ar: "بطاطا حلوة (نيئة)",     state: "نيء",      cal: 86  },
  ],
  "🍗 بروتين": [
    { en: "Grilled Chicken",      ar: "صدور دجاج مشوية",       state: "مشوي",     cal: 165 },
    { en: "Raw Chicken",          ar: "صدور دجاج (نيئة)",      state: "نيء",      cal: 120 },
    { en: "Cooked Lean Beef",     ar: "لحم بقري مطبوخ",        state: "مطبوخ",    cal: 250 },
    { en: "Raw Lean Beef",        ar: "لحم بقري (نيء)",        state: "نيء",      cal: 150 },
    { en: "Cooked Liver",         ar: "كبدة مطبوخة",           state: "مطبوخ",    cal: 175 },
    { en: "Raw Liver",            ar: "كبدة (نيئة)",           state: "نيء",      cal: 135 },
    { en: "Canned Tuna",          ar: "تونة معلبة (ماء)",      state: "معلب",     cal: 116 },
  ],
  "🫘 بقوليات": [
    { en: "Cooked Fava Beans",    ar: "فول مدمس",              state: "مطبوخ",    cal: 110 },
    { en: "Dry Fava Beans",       ar: "فول تدميس (جاف)",       state: "جاف",      cal: 340 },
    { en: "Cooked Lentils",       ar: "عدس مطبوخ",             state: "مطبوخ",    cal: 116 },
    { en: "Dry Lentils",          ar: "عدس أصفر (جاف)",        state: "جاف",      cal: 350 },
    { en: "Cooked Chickpeas",     ar: "حمص مطبوخ",             state: "مطبوخ",    cal: 164 },
    { en: "Dry Chickpeas",        ar: "حمص (جاف)",             state: "جاف",      cal: 364 },
    { en: "Cooked Kidney Beans",  ar: "فاصوليا حمراء مطبوخة",  state: "مطبوخ",    cal: 127 },
    { en: "Dry Kidney Beans",     ar: "فاصوليا حمراء (جافة)",  state: "جاف",      cal: 333 },
    { en: "Cooked White Beans",   ar: "فاصوليا بيضاء مطبوخة",  state: "مطبوخ",    cal: 139 },
    { en: "Dry White Beans",      ar: "فاصوليا بيضاء (جافة)",  state: "جاف",      cal: 340 },
  ],
  "🥛 ألبان": [
    { en: "Cottage Cheese",       ar: "جبنة قريش",             state: "قليل الدسم", cal: 98  },
    { en: "Full Fat Milk",        ar: "حليب كامل الدسم",       state: "سائل",     cal: 61  },
    { en: "Regular Yogurt",       ar: "زبادي عادي",            state: "عادي",     cal: 60  },
    { en: "Roumy Cheese",         ar: "جبنة رومي",             state: "عادي",     cal: 350 },
    { en: "Cheddar Cheese",       ar: "جبنة شيدر",             state: "عادي",     cal: 400 },
    { en: "Light Creamy Cheese",  ar: "جبنة كريمي لايت",       state: "لايت",     cal: 150 },
    { en: "Mozzarella",           ar: "جبنة موتزاريلّا",        state: "عادي",     cal: 280 },
    { en: "Light Mozzarella",     ar: "موتزاريلّا لايت",        state: "لايت",     cal: 160 },
  ],
  "🍎 فواكه": [
    { en: "Apple",                ar: "تفاح",                  state: "طازج",     cal: 52  },
    { en: "Banana",               ar: "موز",                   state: "طازج",     cal: 96  },
    { en: "Orange",               ar: "برتقال",                state: "طازج",     cal: 47  },
    { en: "Mango",                ar: "مانجو",                 state: "طازج",     cal: 60  },
    { en: "Guava",                ar: "جوافة",                 state: "طازج",     cal: 68  },
    { en: "Strawberries",         ar: "فراولة",                state: "طازج",     cal: 32  },
    { en: "Dates",                ar: "تمر (طازج)",            state: "طازج",     cal: 280 },
  ],
  "🧈 دهون": [
    { en: "Olive Oil",            ar: "زيت زيتون",             state: "خام",      cal: 884 },
    { en: "Tahini",               ar: "طحينة",                 state: "خام",      cal: 595 },
    { en: "Almonds",              ar: "لوز",                   state: "خام",      cal: 579 },
    { en: "Peanuts",              ar: "سوداني",                state: "خام",      cal: 567 },
    { en: "Avocado",              ar: "أفوكادو",               state: "طازج",     cal: 160 },
  ],
};

const C = {
  bg: "#0a0a12", card: "#11111e", cardBorder: "#1e1e35",
  neon: "#c8f135", teal: "#35f1c8", red: "#ff6b6b",
  orange: "#ffaa44", muted: "#4a4a6a", text: "#e8e8f0", subtext: "#7070a0",
};

const stateTag = (s) => {
  const map = {
    مطبوخ: C.neon, مسلوق: C.neon, مشوي: C.neon,
    نيء: C.red, جاف: C.red, خام: C.red,
    معلب: C.teal, سائل: C.teal,
    طازج: C.orange,
    عادي: C.subtext, "قليل الدسم": C.teal, لايت: C.teal,
  };
  return map[s] || C.subtext;
};

const INPUT_STYLE = {
  width: "100%", padding: "10px 14px",
  background: "#ffffff07", border: `1px solid ${C.cardBorder}`,
  borderRadius: 10, color: C.text, fontSize: "0.88rem",
  fontFamily: "inherit", outline: "none",
  boxSizing: "border-box", direction: "rtl",
};

function StepLabel({ num, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{
        background: `${C.neon}20`, color: C.neon,
        width: 20, height: 20, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.65rem", fontWeight: 800, flexShrink: 0,
      }}>{num}</span>
      <span style={{ color: C.subtext, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {text}
      </span>
    </div>
  );
}

function AlternativeRow({ alt }) {
  const pct = Math.min(100, Math.round((alt.needed / 500) * 100));
  return (
    <div style={{
      background: "#ffffff05", border: `1px solid ${C.cardBorder}`,
      borderRadius: 12, padding: "11px 14px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <span style={{ color: C.teal, fontWeight: 800, fontSize: "1.1rem" }}>{alt.needed}</span>
          <span style={{ color: C.subtext, fontSize: "0.7rem", marginRight: 3 }}>g</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.text, fontSize: "0.84rem", fontWeight: 600 }}>{alt.ar}</div>
          <span style={{
            background: `${stateTag(alt.state)}18`, color: stateTag(alt.state),
            padding: "1px 7px", borderRadius: 5, fontSize: "0.62rem",
            fontWeight: 700, display: "inline-block", marginTop: 2,
          }}>{alt.state} · {alt.cal} kcal/100g</span>
        </div>
      </div>
      <div style={{ height: 3, background: C.cardBorder, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.teal}, ${C.neon})`,
          borderRadius: 3,
        }} />
      </div>
    </div>
  );
}

function MealCard({ index, onRemove, showRemove }) {
  const [cat, setCat]       = useState(Object.keys(DB)[0]);
  const [food, setFood]     = useState(DB[Object.keys(DB)[0]][0]);
  const [grams, setGrams]   = useState("");
  const [search, setSearch] = useState("");
  const gramsRef = useRef(null);

  const handleCatChange = (c) => { setCat(c); setFood(DB[c][0]); setSearch(""); setGrams(""); };
  const catFoods = DB[cat];

  const filtered = useMemo(() => {
    if (!search.trim()) return catFoods;
    const q = search.toLowerCase();
    return catFoods.filter(f => f.ar.includes(search) || f.en.toLowerCase().includes(q));
  }, [search, catFoods]);

  const totalCals = useMemo(() => {
    const g = parseFloat(grams);
    return (!g || g <= 0) ? 0 : (food.cal * g) / 100;
  }, [food, grams]);

  const alternatives = useMemo(() => {
    if (!totalCals) return [];
    return catFoods
      .filter(f => f.en !== food.en)
      .map(f => ({ ...f, needed: Math.round((totalCals / f.cal) * 100) }))
      .sort((a, b) => a.needed - b.needed);
  }, [totalCals, catFoods, food]);

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderRadius: 20, padding: "1.4rem", position: "relative",
      boxShadow: "0 4px 40px #00000040, inset 0 1px 0 #ffffff08",
    }}>
      {showRemove && (
        <button onClick={onRemove} style={{
          position: "absolute", top: 14, left: 14,
          background: "#ff6b6b18", border: `1px solid ${C.red}33`,
          color: C.red, borderRadius: 8, padding: "3px 10px",
          cursor: "pointer", fontSize: 12, fontFamily: "inherit", lineHeight: 1.5,
        }}>✕</button>
      )}

      <div style={{
        textAlign: "center", marginBottom: "1.2rem",
        fontSize: "0.72rem", letterSpacing: "0.18em",
        color: C.neon, fontWeight: 700, opacity: 0.6, textTransform: "uppercase",
      }}>◈ وجبة {index + 1}</div>

      <StepLabel num="1" text="اختر الفئة الغذائية" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "1.2rem" }}>
        {Object.keys(DB).map(c => (
          <button key={c} onClick={() => handleCatChange(c)} style={{
            padding: "6px 14px", borderRadius: 50,
            border: `1px solid ${cat === c ? C.neon : C.cardBorder}`,
            background: cat === c ? `${C.neon}18` : "transparent",
            color: cat === c ? C.neon : C.subtext,
            cursor: "pointer", fontSize: "0.8rem",
            fontFamily: "inherit", fontWeight: cat === c ? 700 : 400,
          }}>{c}</button>
        ))}
      </div>

      <StepLabel num="2" text="اختر الصنف الأساسي" />
      <div style={{ position: "relative", marginBottom: 10 }}>
        <span style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", fontSize: 14, opacity: 0.4 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالعربي أو الإنجليزي..."
          style={{ ...INPUT_STYLE, paddingRight: 36 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1.2rem", maxHeight: 220, overflowY: "auto" }}>
        {filtered.length === 0 && (
          <p style={{ color: C.subtext, fontSize: "0.8rem", textAlign: "center", padding: 12 }}>لا توجد نتائج 🔎</p>
        )}
        {filtered.map(f => {
          const active = food.en === f.en;
          return (
            <button key={f.en}
              onClick={() => { setFood(f); setGrams(""); setTimeout(() => gramsRef.current?.focus(), 50); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 13px", borderRadius: 11,
                border: `1px solid ${active ? C.neon + "66" : C.cardBorder}`,
                background: active ? `${C.neon}10` : "#ffffff04",
                cursor: "pointer", fontFamily: "inherit", textAlign: "right",
              }}>
              <span style={{
                background: `${stateTag(f.state)}18`, color: stateTag(f.state),
                padding: "1px 8px", borderRadius: 6, fontSize: "0.65rem", fontWeight: 600,
              }}>{f.state}</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                <span style={{ color: active ? C.neon : C.text, fontSize: "0.85rem", fontWeight: active ? 700 : 400 }}>{f.ar}</span>
                <span style={{ color: C.muted, fontSize: "0.65rem" }}>{f.cal} kcal / 100g</span>
              </div>
            </button>
          );
        })}
      </div>

      <StepLabel num="3" text="أدخل الكمية بالجرام" />
      <div style={{ position: "relative", marginBottom: "1.2rem" }}>
        <input ref={gramsRef} type="number" min={0} value={grams}
          onChange={e => setGrams(e.target.value)} placeholder="مثال: 150" style={INPUT_STYLE} />
        <span style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", color: C.subtext, fontSize: "0.75rem" }}>جرام</span>
      </div>

      {totalCals > 0 && (
        <div>
          <div style={{
            background: `linear-gradient(135deg, ${C.neon}14, ${C.teal}08)`,
            border: `1px solid ${C.neon}33`, borderRadius: 14, padding: "14px 16px", marginBottom: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: C.subtext, fontSize: "0.7rem", marginBottom: 2 }}>إجمالي السعرات</div>
                <div style={{ color: C.neon, fontWeight: 800, fontSize: "1.5rem", lineHeight: 1 }}>
                  {Math.round(totalCals)}
                  <span style={{ fontSize: "0.75rem", fontWeight: 400, marginRight: 4, color: C.subtext }}>kcal</span>
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: C.subtext, fontSize: "0.7rem", marginBottom: 2 }}>الصنف الأساسي</div>
                <div style={{ color: C.text, fontSize: "0.85rem", fontWeight: 600 }}>{food.ar}</div>
                <div style={{ color: C.muted, fontSize: "0.72rem" }}>{grams}g × {food.cal} kcal</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: "0.7rem", color: C.teal, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>
            البدائل بنفس السعرات ({alternatives.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {alternatives.map(alt => <AlternativeRow key={alt.en} alt={alt} />)}
          </div>
        </div>
      )}

      {!grams && (
        <div style={{ textAlign: "center", padding: "10px 0 2px", color: C.muted, fontSize: "0.78rem", lineHeight: 1.6 }}>
          اختر الصنف ← أدخل الكمية → سيظهر الحساب تلقائياً ✨
        </div>
      )}
    </div>
  );
}

export default function App() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [meals, setMeals] = useState([{ id: 1 }]);

  useEffect(() => {
    const hasAuth = document.cookie.split(';').some(c => c.trim().startsWith('meal_auth=ok'));
    if (!hasAuth) {
      router.push('/login');
    } else {
      setAuth(true);
    }
  }, [router]);

  if (!auth) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.neon, fontSize: "1.5rem" }}>⚡</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Cairo', 'Tajawal', sans-serif", direction: "rtl", color: C.text }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 60% 40% at 80% 10%, ${C.neon}07 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 10% 80%, ${C.teal}06 0%, transparent 60%)`,
      }} />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 14px 80px", position: "relative", zIndex: 1 }}>
        <header style={{ textAlign: "center", padding: "2.2rem 0 1.6rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${C.neon}12`, border: `1px solid ${C.neon}33`,
            color: C.neon, padding: "4px 14px", borderRadius: 20,
            fontSize: "0.65rem", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 14, textTransform: "uppercase",
          }}>⚡ Smart Nutrition Calculator</div>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(1.4rem, 5vw, 1.9rem)", fontWeight: 900, lineHeight: 1.25 }}>
            حاسبة بدائل الوجبات{" "}
            <span style={{ color: C.neon, textShadow: `0 0 24px ${C.neon}55` }}>الذكية</span>
          </h1>
          <p style={{ color: C.subtext, margin: 0, fontSize: "0.82rem", lineHeight: 1.6 }}>
            اختر أي صنف وكميته → شاهد كل البدائل بنفس السعرات 🔥
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {meals.map((m, i) => (
            <MealCard key={m.id} index={i} showRemove={meals.length > 1} onRemove={() => setMeals(prev => prev.filter(x => x.id !== m.id))} />
          ))}
        </div>

        {meals.length < 4 && (
          <button onClick={() => setMeals(prev => [...prev, { id: Date.now() }])} style={{
            width: "100%", marginTop: 14, padding: "13px",
            background: "transparent", border: `1px dashed ${C.neon}44`,
            borderRadius: 16, color: C.neon, cursor: "pointer",
            fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: "1.1rem" }}>＋</span> إضافة وجبة للمقارنة
          </button>
        )}

        <footer style={{ textAlign: "center", marginTop: 30, color: C.muted, fontSize: "0.68rem", lineHeight: 1.8 }}>
          القيم الغذائية تقريبية وقد تختلف حسب طريقة التحضير<br />
          <span style={{ color: `${C.neon}44` }}>◈ للاستخدام التوجيهي فقط</span>
        </footer>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; } body { margin: 0; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input:focus { border-color: ${C.neon}66 !important; box-shadow: 0 0 0 3px ${C.neon}12; }
        button:hover { opacity: 0.82; } ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${C.neon}33; border-radius: 3px; }
      `}</style>
    </div>
  );
}