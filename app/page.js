"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";

// ========== Types ==========
interface FoodItem {
  en: string;
  ar: string;
  state: string;
  cal: number;
}

interface DBType {
  [key: string]: FoodItem[];
}

// ========== قاعدة البيانات الشاملة (مصر والخليج) ==========
const DB: DBType = {
  "🍚 نشويات": [
    { en: "Cooked White Rice",        ar: "أرز أبيض مطبوخ",         state: "مطبوخ",  cal: 130 },
    { en: "Basmati Rice (Long Grain)", ar: "أرز بسمتي مطبوخ",       state: "مطبوخ",  cal: 120 },
    { en: "Rice with Vermicelli",     ar: "أرز بالشعيرية",          state: "مطبوخ",  cal: 150 },
    { en: "Raw White Rice",           ar: "أرز أبيض (نيء)",          state: "نيء",    cal: 360 },
    { en: "Cooked Brown Rice",        ar: "أرز بني مطبوخ",           state: "مطبوخ",  cal: 112 },
    { en: "Boiled White Pasta",       ar: "مكرونة بيضاء مسلوقة",     state: "مسلوق",  cal: 130 },
    { en: "Bechamel Macaroni",        ar: "مكرونة بالبشاميل",        state: "مطبوخ",  cal: 180 },
    { en: "Baladi Bread (Egypt)",     ar: "خبز بلدي (ردة)",          state: "جاهز",   cal: 280 },
    { en: "Tamees Bread",             ar: "خبز تميس",                state: "جاهز",   cal: 290 },
    { en: "Samoon Bread",             ar: "خبز صمون",                state: "جاهز",   cal: 300 },
    { en: "Saj / Marqouq Bread",      ar: "خبز صاج / مرقوق",        state: "جاهز",   cal: 270 },
    { en: "Fino Bread",               ar: "خبز فينو",                state: "جاهز",   cal: 310 },
    { en: "Oat Bread",                ar: "خبز شوفان",               state: "جاهز",   cal: 240 },
    { en: "White Toast",              ar: "توست أبيض",               state: "جاهز",   cal: 265 },
    { en: "Raw Oats",                 ar: "شوفان (خام)",             state: "نيء",    cal: 389 },
    { en: "Boiled Corn",              ar: "ذرة مسلوقة",              state: "مسلوق",  cal: 96  },
    { en: "Boiled Potatoes",          ar: "بطاطس مسلوقة",            state: "مسلوق",  cal: 87  },
    { en: "Fried Potatoes (Fries)",   ar: "بطاطس مقلية",             state: "مقلي",   cal: 312 },
    { en: "Baked Sweet Potato",       ar: "بطاطا حلوة مشوية",        state: "مشوي",   cal: 105 },
    { en: "Freekeh (Cooked)",         ar: "فريك مطبوخ",              state: "مطبوخ",  cal: 125 },
    { en: "Jareesh (Cooked)",         ar: "جريش مطبوخ",              state: "مطبوخ",  cal: 140 },
  ],
  "🍗 بروتين": [
    { en: "Grilled Chicken Breast",   ar: "صدور دجاج مشوية",         state: "مشوي",   cal: 165 },
    { en: "Fried Chicken (Pané)",     ar: "دجاج بانيه",              state: "مقلي",   cal: 280 },
    { en: "Cooked Chicken Thigh",     ar: "أوراك دجاج مطبوخة",       state: "مطبوخ",  cal: 209 },
    { en: "Cooked Lean Beef",         ar: "لحم بقري صافي",           state: "مطبوخ",  cal: 250 },
    { en: "Hashi Meat (Camel)",       ar: "لحم حاشي (جمل)",          state: "مطبوخ",  cal: 190 },
    { en: "Grilled Kofta",            ar: "كفتة مشوية",              state: "مشوي",   cal: 300 },
    { en: "Cooked Beef Liver",        ar: "كبدة بقري",               state: "مطبوخ",  cal: 175 },
    { en: "Boiled Eggs",              ar: "بيض مسلوق",               state: "مسلوق",  cal: 155 },
    { en: "Fried Eggs (Butter)",      ar: "بيض عيون (بالزبدة)",      state: "مقلي",   cal: 196 },
    { en: "Canned Tuna (Water)",      ar: "تونة معلبة (ماء)",        state: "معلب",   cal: 116 },
    { en: "Grilled Tilapia Fish",     ar: "سمك بلطي مشوي",           state: "مشوي",   cal: 128 },
    { en: "Grilled Hamour Fish",      ar: "سمك هامور مشوي",          state: "مشوي",   cal: 100 },
    { en: "Fried Shrimp",             ar: "جمبري مقلي",              state: "مقلي",   cal: 250 },
  ],
  "🫘 بقوليات": [
    { en: "Cooked Fava Beans",        ar: "فول مدمس",                state: "مطبوخ",  cal: 110 },
    { en: "Foul with Oil",            ar: "فول بالزيت",              state: "مطبوخ",  cal: 160 },
    { en: "Falafel / Ta'ameya",       ar: "فلافل / طعمية",           state: "مقلي",   cal: 333 },
    { en: "Cooked Lentils",           ar: "عدس مطبوخ",               state: "مطبوخ",  cal: 116 },
    { en: "Cooked Chickpeas",         ar: "حمص مسلوق",               state: "مطبوخ",  cal: 164 },
    { en: "Hummus (Spread)",          ar: "مسبحة / حمص بطحينة",      state: "جاهز",   cal: 166 },
    { en: "Cooked Lupini Beans",      ar: "ترمس مسلوق",              state: "مطبوخ",  cal: 119 },
  ],
  "🥛 ألبان وأجبان": [
    { en: "Cottage Cheese",           ar: "جبنة قريش",               state: "قليل الدسم", cal: 98  },
    { en: "Labneh (Middle East)",     ar: "لبنة",                    state: "طازج",   cal: 150 },
    { en: "Full Fat Milk",            ar: "حليب كامل الدسم",         state: "سائل",   cal: 61  },
    { en: "Low Fat Milk",             ar: "حليب قليل الدسم",         state: "سائل",   cal: 42  },
    { en: "Rayeb Milk",               ar: "لبن رائب",                state: "سائل",   cal: 60  },
    { en: "Greek Yogurt",             ar: "زبادي يوناني",            state: "عادي",   cal: 97  },
    { en: "Feta Cheese",              ar: "جبنة فيتا",               state: "عادي",   cal: 264 },
    { en: "Roumy Cheese",             ar: "جبنة رومي",               state: "عادي",   cal: 350 },
    { en: "Cheddar Cheese",           ar: "جبنة شيدر",               state: "عادي",   cal: 400 },
    { en: "Mozzarella Cheese",        ar: "جبنة موتزاريلّا",          state: "عادي",   cal: 280 },
  ],
  "🍎 فواكه": [
    { en: "Apple",                    ar: "تفاح",                    state: "طازج",   cal: 52  },
    { en: "Banana",                   ar: "موز",                     state: "طازج",   cal: 96  },
    { en: "Dates (Khalas/Sukkari)",   ar: "تمر (خلاص/سكري)",         state: "طازج",   cal: 280 },
    { en: "Orange",                   ar: "برتقال",                  state: "طازج",   cal: 47  },
    { en: "Mango",                    ar: "مانجو",                   state: "طازج",   cal: 60  },
    { en: "Grapes",                   ar: "عنب",                     state: "طازج",   cal: 69  },
    { en: "Watermelon",               ar: "بطيخ",                    state: "طازج",   cal: 30  },
    { en: "Guava",                    ar: "جوافة",                   state: "طازج",   cal: 68  },
  ],
  "🧈 دهون وزيوت": [
    { en: "Olive Oil",                ar: "زيت زيتون",               state: "خام",    cal: 884 },
    { en: "Ghee (Samna)",             ar: "سمن بلدي",                state: "خام",    cal: 900 },
    { en: "Butter",                   ar: "زبدة",                    state: "خام",    cal: 717 },
    { en: "Tahini",                   ar: "طحينة",                   state: "خام",    cal: 595 },
  ],
};

// ========== ثوابت التصميم ==========
const C = {
  bg: "#0a0a12", card: "#11111e", cardBorder: "#1e1e35",
  neon: "#c8f135", teal: "#35f1c8", red: "#ff6b6b",
  orange: "#ffaa44", muted: "#4a4a6a", text: "#e8e8f0", subtext: "#7070a0",
};

const stateTag = (s: string) => {
  const map: { [key: string]: string } = {
    مطبوخ: C.neon, مسلوق: C.neon, مشوي: C.neon,
    نيء: C.red, جاف: C.red, خام: C.red, مقلي: C.red,
    معلب: C.teal, سائل: C.teal, عصير: C.teal,
    طازج: C.orange, جاهز: C.orange,
    عادي: C.subtext, "قليل الدسم": C.teal, لايت: C.teal,
  };
  return map[s] || C.subtext;
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  background: "#ffffff07", border: `1px solid #1e1e35`,
  borderRadius: 12, color: "#e8e8f0",
  fontSize: "0.95rem", fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", direction: "rtl",
};

interface StepLabelProps {
  num: string;
  text: string;
  color?: string;
}

function StepLabel({ num, text, color }: StepLabelProps) {
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

interface FoodSelectorProps {
  label: string;
  stepNum: string;
  catFoods: FoodItem[];
  selected: FoodItem | null;
  onSelect: (f: FoodItem) => void;
  search: string;
  onSearch: (s: string) => void;
  stepColor?: string;
}

function FoodSelector({ label, stepNum, catFoods, selected, onSelect, search, onSearch, stepColor }: FoodSelectorProps) {
  const col = stepColor || C.neon;
  const filtered = useMemo(() => {
    if (!search.trim()) return catFoods;
    const q = search.toLowerCase();
    return catFoods.filter(f => f.ar.includes(search) || f.en.toLowerCase().includes(q));
  }, [search, catFoods]);

  return (
    <div>
      <StepLabel num={stepNum} text={label} color={col} />
      <div style={{ position: "relative", marginBottom: 8 }}>
        <span style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", fontSize: 13, opacity: 0.35 }}>🔍</span>
        <input value={search} onChange={e => onSearch(e.target.value)}
          placeholder="ابحث بالعربي أو الإنجليزي..."
          style={{ ...INPUT_STYLE, paddingRight: 34 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 190, overflowY: "auto", marginBottom: "0.8rem" }}>
        {filtered.length === 0 && (
          <p style={{ color: C.muted, fontSize: "0.78rem", textAlign: "center", padding: 10 }}>لا توجد نتائج</p>
        )}
        {filtered.map(f => {
          const active = selected?.en === f.en;
          return (
            <button key={f.en} onClick={() => onSelect(f)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 12,
              border: `1px solid ${active ? col + "88" : C.cardBorder}`,
              background: active ? `${col}12` : "#ffffff04",
              cursor: "pointer", fontFamily: "inherit", textAlign: "right",
              transition: "all 0.15s",
            }}>
              <span style={{
                background: `${stateTag(f.state)}18`, color: stateTag(f.state),
                padding: "2px 8px", borderRadius: 6, fontSize: "0.65rem", fontWeight: 600,
              }}>{f.state}</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                <span style={{ color: active ? col : C.text, fontSize: "0.88rem", fontWeight: active ? 700 : 400 }}>{f.ar}</span>
                <span style={{ color: C.muted, fontSize: "0.65rem" }}>{f.en} · {f.cal} kcal/100g</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AlternativeFood extends FoodItem {
  needed: number;
}

function AlternativeRow({ alt }: { alt: AlternativeFood }) {
  const pct = Math.min(100, Math.round((alt.needed / 500) * 100));
  return (
    <div style={{ background: "#ffffff05", border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <span style={{ color: C.teal, fontWeight: 800, fontSize: "1.2rem" }}>{alt.needed}</span>
          <span style={{ color: C.subtext, fontSize: "0.75rem", marginRight: 3 }}>g</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.text, fontSize: "0.9rem", fontWeight: 600 }}>{alt.ar}</div>
          <span style={{
            background: `${stateTag(alt.state)}18`, color: stateTag(alt.state),
            padding: "1px 7px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 700,
            display: "inline-block", marginTop: 2,
          }}>{alt.state} · {alt.cal} kcal</span>
        </div>
      </div>
      <div style={{ height: 4, background: C.cardBorder, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.teal}, ${C.neon})`, borderRadius: 3 }} />
      </div>
    </div>
  );
}

interface MealCardProps {
  index: number;
  onRemove: () => void;
  showRemove: boolean;
}

function MealCard({ index, onRemove, showRemove }: MealCardProps) {
  const [mode, setMode]         = useState<"all" | "specific">("all");
  const [cat, setCat]           = useState(Object.keys(DB)[0]);
  const [food, setFood]         = useState<FoodItem>(DB[Object.keys(DB)[0]][0]);
  const [grams, setGrams]       = useState("");
  const [search, setSearch]     = useState("");
  const [targetFood, setTargetFood] = useState<FoodItem | null>(null);
  const [searchB, setSearchB]   = useState("");
  const gramsRef = useRef<HTMLInputElement>(null);

  const catFoods = DB[cat];

  const handleCatChange = (c: string) => {
    setCat(c); 
    setFood(DB[c][0]); 
    setTargetFood(null);
    setSearch(""); 
    setSearchB(""); 
    setGrams("");
  };

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

  const specificResult = useMemo(() => {
    if (!totalCals || !targetFood) return null;
    return Math.round((totalCals / targetFood.cal) * 100);
  }, [totalCals, targetFood]);

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
        {[
          { key: "all",      icon: "📋", label: "كل البدائل" },
          { key: "specific", icon: "🎯", label: "بديل محدد" },
        ].map(m => (
          <button key={m.key} onClick={() => setMode(m.key as "all" | "specific")} style={{
            flex: 1, padding: "10px 8px", borderRadius: 10,
            border: `1px solid ${mode === m.key ? C.neon + "55" : "transparent"}`,
            background: mode === m.key ? `${C.neon}12` : "transparent",
            color: mode === m.key ? C.neon : C.subtext,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
          }}>
            <div style={{ fontSize: "0.85rem", fontWeight: mode === m.key ? 700 : 400 }}>{m.icon} {m.label}</div>
          </button>
        ))}
      </div>

      <StepLabel num="1" text="اختر الفئة الغذائية" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.4rem" }}>
        {Object.keys(DB).map(c => (
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
            label="اختر الصنف الأساسي"
            stepNum="2" catFoods={catFoods} selected={food}
            onSelect={(f) => { setFood(f); setGrams(""); setTimeout(() => gramsRef.current?.focus(), 50); }}
            search={search} onSearch={setSearch}
          />
          <StepLabel num="3" text="أدخل الكمية بالجرام" />
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input ref={gramsRef} type="number" min={0} value={grams}
              onChange={e => setGrams(e.target.value)} placeholder="مثال: 150" style={INPUT_STYLE} />
            <span style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", color: C.subtext, fontSize: "0.8rem" }}>جرام</span>
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
                    <div style={{ color: C.muted, fontSize: "0.75rem" }}>{grams}g × {food.cal} cal</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "0.75rem", color: C.teal, fontWeight: 800, letterSpacing: "0.15em", marginBottom: 10, textTransform: "uppercase" }}>
                البدائل المقترحة بنفس السعرات
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alternatives.map(alt => <AlternativeRow key={alt.en} alt={alt} />)}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div style={{ background: `${C.neon}05`, border: `1px solid ${C.neon}22`, borderRadius: 16, padding: "14px", marginBottom: 12 }}>
            <div style={{ color: C.neon, fontSize: "0.75rem", fontWeight: 800, marginBottom: 10 }}>🅐 الصنف الأساسي</div>
            <FoodSelector
              label="اختر الصنف"
              stepNum="2" catFoods={catFoods} selected={food}
              onSelect={(f) => { setFood(f); setGrams(""); }}
              search={search} onSearch={setSearch} stepColor={C.neon}
            />
            <StepLabel num="3" text="الكمية" color={C.neon} />
            <div style={{ position: "relative" }}>
              <input ref={gramsRef} type="number" min={0} value={grams}
                onChange={e => setGrams(e.target.value)} placeholder="0"
                style={{ ...INPUT_STYLE, border: `1px solid ${C.neon}44` }} />
              <span style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", color: C.subtext, fontSize: "0.8rem" }}>جرام</span>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "10px 0", fontSize: "1.5rem", color: C.teal }}>⇅</div>

          <div style={{ background: `${C.teal}05`, border: `1px solid ${C.teal}22`, borderRadius: 16, padding: "14px", marginBottom: 15 }}>
            <div style={{ color: C.teal, fontSize: "0.75rem", fontWeight: 800, marginBottom: 10 }}>🅑 الصنف البديل</div>
            <FoodSelector
              label="اختر البديل"
              stepNum="4" catFoods={catFoods} selected={targetFood}
              onSelect={setTargetFood}
              search={searchB} onSearch={setSearchB} stepColor={C.teal}
            />
          </div>

          {totalCals > 0 && targetFood && (
            <div style={{
              background: `linear-gradient(135deg, ${C.teal}20, ${C.neon}10)`,
              border: `2px solid ${C.teal}44`, borderRadius: 20,
              padding: "24px 20px", textAlign: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 15, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.neon, fontWeight: 900, fontSize: "1.6rem" }}>{grams}g</div>
                  <div style={{ color: C.subtext, fontSize: "0.75rem" }}>{food.ar}</div>
                </div>
                <div style={{ color: C.muted, fontSize: "2rem", opacity: 0.5 }}>=</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.teal, fontWeight: 900, fontSize: "2.2rem", lineHeight: 1 }}>{specificResult}g</div>
                  <div style={{ color: C.subtext, fontSize: "0.8rem", marginTop: 5 }}>{targetFood.ar}</div>
                </div>
              </div>
              <div style={{ marginTop: 15, color: C.subtext, fontSize: "0.8rem" }}>
                القيمة الحرارية: <span style={{ color: C.neon, fontWeight: 800 }}>{Math.round(totalCals)} سعرة</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ========== شاشة تسجيل الدخول ==========
interface LoginScreenProps {
  onLogin: () => void;
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2025") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, background: C.bg, direction: "rtl",
    }}>
      <div style={{
        width: "100%", maxWidth: 400, padding: "2.5rem 2rem",
        background: C.card, borderRadius: 30, border: `1px solid ${C.cardBorder}`,
        boxShadow: "0 20px 50px #000000", textAlign: "center",
      }}>
        <div style={{
          width: 70, height: 70, background: `${C.neon}12`, borderRadius: 20,
          margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${C.neon}33`, color: C.neon, fontSize: 32,
        }}>⚡</div>
        <h2 style={{ margin: "0 0 10px", fontSize: "1.6rem", fontWeight: 900 }}>تسجيل الدخول</h2>
        <p style={{ color: C.subtext, fontSize: "0.9rem", marginBottom: 30 }}>يرجى إدخال كلمة المرور الموحدة للدخول</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            style={{
              ...INPUT_STYLE, textAlign: "center", fontSize: "1.2rem", letterSpacing: 5,
              border: `1px solid ${error ? C.red : C.cardBorder}`,
              background: error ? `${C.red}05` : "#ffffff07",
            }}
            autoFocus
          />
          {error && <div style={{ color: C.red, fontSize: "0.8rem", marginTop: 8, fontWeight: 700 }}>كلمة المرور غير صحيحة!</div>}
          <button type="submit" style={{
            width: "100%", marginTop: 24, padding: "14px",
            background: C.neon, color: C.bg, border: "none",
            borderRadius: 16, fontSize: "1rem", fontWeight: 900,
            cursor: "pointer", boxShadow: `0 8px 20px ${C.neon}33`,
            transition: "all 0.2s",
          }}>دخول</button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [meals, setMeals] = useState([{ id: 1 }]);

  useEffect(() => {
    const auth = localStorage.getItem("is_auth_2025");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("is_auth_2025", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("is_auth_2025");
  };

  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Cairo', sans-serif", direction: "rtl", color: C.text }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 60% 40% at 80% 10%, ${C.neon}05 0%, transparent 60%),
                     radial-gradient(ellipse 50% 50% at 10% 80%, ${C.teal}04 0%, transparent 60%)`,
      }} />
      
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 16px 100px", position: "relative", zIndex: 1 }}>

        <header style={{ textAlign: "center", padding: "3rem 0 2rem", position: "relative" }}>
          <button onClick={handleLogout} style={{
            position: "absolute", top: 20, left: 0, background: "transparent",
            border: `1px solid ${C.subtext}33`, color: C.subtext, padding: "4px 10px",
            borderRadius: 8, fontSize: "0.7rem", cursor: "pointer",
          }}>تسجيل خروج</button>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${C.neon}12`, border: `1px solid ${C.neon}33`,
            color: C.neon, padding: "6px 16px", borderRadius: 25,
            fontSize: "0.7rem", letterSpacing: "0.15em", fontWeight: 800, marginBottom: 15,
          }}>⚡ SMART NUTRITION V2.5</div>
          <h1 style={{ margin: "0 0 10px", fontSize: "2.2rem", fontWeight: 900, lineHeight: 1.1 }}>
            حاسبة البدائل <span style={{ color: C.neon }}>الذكية</span>
          </h1>
          <p style={{ color: C.subtext, margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
            استبدل أكلاتك المفضلة بنفس السعرات بدقة متناهية
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {meals.map((m, i) => (
            <MealCard key={m.id} index={i}
              showRemove={meals.length > 1}
              onRemove={() => setMeals(prev => prev.filter(x => x.id !== m.id))}
            />
          ))}
        </div>

        {meals.length < 5 && (
          <button onClick={() => setMeals(prev => [...prev, { id: Date.now() }])} style={{
            width: "100%", marginTop: 20, padding: "16px",
            background: "transparent", border: `2px dashed ${C.neon}33`,
            borderRadius: 20, color: C.neon, cursor: "pointer",
            fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>＋ إضافة وجبة أخرى</button>
        )}

        <footer style={{ textAlign: "center", marginTop: 40, color: C.muted, fontSize: "0.75rem", padding: "0 20px" }}>
          الحسابات مبنية على متوسط السعرات الحرارية لكل 100 جرام<br />
          <div style={{ color: `${C.neon}66`, marginTop: 8, fontWeight: 700 }}>◈ 2025 Smart Calculator ◈</div>
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
