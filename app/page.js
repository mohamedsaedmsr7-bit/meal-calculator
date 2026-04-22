"use client";
import { useState, useMemo, useRef } from "react";

// ========== قاعدة البيانات الشاملة ==========
const DB = {
  "🍚 نشويات": [
    { en: "Cooked White Rice",        ar: "أرز أبيض مطبوخ",         state: "مطبوخ",  cal: 130 },
    { en: "Raw White Rice",           ar: "أرز أبيض (نيء)",          state: "نيء",    cal: 360 },
    { en: "Cooked Brown Rice",        ar: "أرز بني مطبوخ",           state: "مطبوخ",  cal: 112 },
    { en: "Raw Brown Rice",           ar: "أرز بني (نيء)",           state: "نيء",    cal: 370 },
    { en: "Boiled White Pasta",       ar: "مكرونة بيضاء مسلوقة",     state: "مسلوق",  cal: 130 },
    { en: "Raw White Pasta",          ar: "مكرونة بيضاء (نيئة)",     state: "نيء",    cal: 370 },
    { en: "Bechamel Macaroni",        ar: "مكرونة بالبشاميل",        state: "مطبوخ",  cal: 180 },
    { en: "Baladi Bread",             ar: "خبز بلدي",                state: "جاهز",   cal: 280 },
    { en: "Shami Bread",              ar: "خبز شامي",                state: "جاهز",   cal: 275 },
    { en: "Oat Bread",                ar: "خبز شوفان",               state: "جاهز",   cal: 240 },
    { en: "White Toast",              ar: "توست أبيض",               state: "جاهز",   cal: 265 },
    { en: "Brown Toast",              ar: "توست بني",                state: "جاهز",   cal: 250 },
    { en: "Raw Oats",                 ar: "شوفان (خام)",             state: "نيء",    cal: 389 },
    { en: "Cooked Oats",              ar: "شوفان مطبوخ",             state: "مطبوخ",  cal: 70  },
    { en: "Boiled Corn",              ar: "ذرة مسلوقة",              state: "مسلوق",  cal: 96  },
    { en: "Raw Corn",                 ar: "ذرة (نيئة)",              state: "نيء",    cal: 96  },
    { en: "Boiled Potatoes",          ar: "بطاطس مسلوقة",            state: "مسلوق",  cal: 87  },
    { en: "Raw Potatoes",             ar: "بطاطس (نيئة)",            state: "نيء",    cal: 77  },
    { en: "Baked Sweet Potato",       ar: "بطاطا حلوة مشوية",        state: "مشوي",   cal: 105 },
    { en: "Raw Sweet Potato",         ar: "بطاطا حلوة (نيئة)",       state: "نيء",    cal: 86  },
  ],
  "🍗 بروتين": [
    { en: "Grilled Chicken Breast",   ar: "صدور دجاج مشوية",         state: "مشوي",   cal: 165 },
    { en: "Raw Chicken Breast",       ar: "صدور دجاج (نيئة)",        state: "نيء",    cal: 120 },
    { en: "Fried Chicken Breast",     ar: "صدور دجاج مقلية",         state: "مقلي",   cal: 250 },
    { en: "Cooked Chicken Thigh",     ar: "أوراك دجاج مطبوخة",       state: "مطبوخ",  cal: 209 },
    { en: "Raw Chicken Thigh",        ar: "أوراك دجاج (نيئة)",       state: "نيء",    cal: 180 },
    { en: "Cooked Chicken Liver",     ar: "كبدة دجاج مطبوخة",        state: "مطبوخ",  cal: 165 },
    { en: "Raw Chicken Liver",        ar: "كبدة دجاج (نيئة)",        state: "نيء",    cal: 120 },
    { en: "Cooked Lean Beef",         ar: "لحم بقري صافي مطبوخ",     state: "مطبوخ",  cal: 250 },
    { en: "Raw Lean Beef",            ar: "لحم بقري صافي (نيء)",     state: "نيء",    cal: 150 },
    { en: "Cooked Fatty Beef",        ar: "لحم بقري سمين مطبوخ",     state: "مطبوخ",  cal: 300 },
    { en: "Grilled Kofta",            ar: "كفتة مشوية",              state: "مشوي",   cal: 300 },
    { en: "Cooked Beef Liver",        ar: "كبدة بقري مطبوخة",        state: "مطبوخ",  cal: 175 },
    { en: "Raw Beef Liver",           ar: "كبدة بقري (نيئة)",        state: "نيء",    cal: 135 },
    { en: "Cooked Kidney",            ar: "كلاوي مطبوخة",            state: "مطبوخ",  cal: 160 },
    { en: "Boiled Eggs",              ar: "بيض مسلوق",               state: "مسلوق",  cal: 155 },
    { en: "Egg Whites",               ar: "بياض بيض",                state: "نيء",    cal: 52  },
    { en: "Canned Tuna (Water)",      ar: "تونة معلبة (ماء)",        state: "معلب",   cal: 116 },
    { en: "Canned Tuna (Oil)",        ar: "تونة معلبة (زيت)",        state: "معلب",   cal: 200 },
    { en: "Canned Sardines",          ar: "سردين معلب",              state: "معلب",   cal: 208 },
  ],
  "🫘 بقوليات": [
    { en: "Cooked Fava Beans",        ar: "فول مدمس",                state: "مطبوخ",  cal: 110 },
    { en: "Dry Fava Beans",           ar: "فول تدميس (جاف)",         state: "جاف",    cal: 341 },
    { en: "Cooked Lentils",           ar: "عدس مطبوخ",               state: "مطبوخ",  cal: 116 },
    { en: "Dry Lentils",              ar: "عدس أصفر (جاف)",          state: "جاف",    cal: 350 },
    { en: "Cooked Chickpeas",         ar: "حمص مسلوق",               state: "مطبوخ",  cal: 164 },
    { en: "Dry Chickpeas",            ar: "حمص (جاف)",               state: "جاف",    cal: 364 },
    { en: "Cooked Kidney Beans",      ar: "فاصوليا حمراء مطبوخة",    state: "مطبوخ",  cal: 127 },
    { en: "Cooked White Beans",       ar: "فاصوليا بيضاء مطبوخة",    state: "مطبوخ",  cal: 139 },
    { en: "Cooked Lupini Beans",      ar: "ترمس مسلوق",              state: "مطبوخ",  cal: 119 },
    { en: "Cooked Green Peas",        ar: "بسلة خضراء مطبوخة",       state: "مطبوخ",  cal: 81  },
  ],
  "🥛 ألبان وأجبان": [
    { en: "Cottage Cheese",           ar: "جبنة قريش",               state: "قليل الدسم", cal: 98  },
    { en: "Full Fat Milk",            ar: "حليب كامل الدسم",         state: "سائل",   cal: 61  },
    { en: "Low Fat Milk",             ar: "حليب قليل الدسم",         state: "سائل",   cal: 42  },
    { en: "Regular Yogurt",           ar: "زبادي عادي",              state: "عادي",   cal: 60  },
    { en: "Greek Yogurt",             ar: "زبادي يوناني",            state: "عادي",   cal: 97  },
    { en: "Feta Cheese",              ar: "جبنة فيتا",               state: "عادي",   cal: 264 },
    { en: "Roumy Cheese",             ar: "جبنة رومي",               state: "عادي",   cal: 350 },
    { en: "Cheddar Cheese",           ar: "جبنة شيدر",               state: "عادي",   cal: 400 },
    { en: "Mozzarella Cheese",        ar: "جبنة موتزاريلّا",          state: "عادي",   cal: 280 },
    { en: "Light Mozzarella",         ar: "موتزاريلّا لايت",          state: "لايت",   cal: 160 },
    { en: "Light Creamy Cheese",      ar: "جبنة كريمي لايت",         state: "لايت",   cal: 150 },
  ],
  "🍎 فواكه": [
    { en: "Apple",                    ar: "تفاح",                    state: "طازج",   cal: 52  },
    { en: "Banana",                   ar: "موز",                     state: "طازج",   cal: 96  },
    { en: "Orange",                   ar: "برتقال",                  state: "طازج",   cal: 47  },
    { en: "Mandarin",                 ar: "يوسفي",                   state: "طازج",   cal: 53  },
    { en: "Grapes",                   ar: "عنب",                     state: "طازج",   cal: 69  },
    { en: "Mango",                    ar: "مانجو",                   state: "طازج",   cal: 60  },
    { en: "Guava",                    ar: "جوافة",                   state: "طازج",   cal: 68  },
    { en: "Watermelon",               ar: "بطيخ",                    state: "طازج",   cal: 30  },
    { en: "Cantaloupe",               ar: "كانتلوب",                 state: "طازج",   cal: 34  },
    { en: "Strawberries",             ar: "فراولة",                  state: "طازج",   cal: 32  },
    { en: "Pomegranate",              ar: "رمان",                    state: "طازج",   cal: 83  },
    { en: "Peach",                    ar: "خوخ",                     state: "طازج",   cal: 39  },
    { en: "Pear",                     ar: "كمثرى",                   state: "طازج",   cal: 57  },
    { en: "Apricot",                  ar: "مشمش",                    state: "طازج",   cal: 48  },
    { en: "Kiwi",                     ar: "كيوي",                    state: "طازج",   cal: 61  },
    { en: "Pineapple",                ar: "أناناس",                  state: "طازج",   cal: 50  },
    { en: "Dates",                    ar: "تمر (طازج)",              state: "طازج",   cal: 280 },
    { en: "Avocado",                  ar: "أفوكادو",                 state: "طازج",   cal: 160 },
    { en: "Fresh Orange Juice",       ar: "عصير برتقال طازج",        state: "عصير",   cal: 45  },
    { en: "Fresh Mango Juice",        ar: "عصير مانجو طازج",         state: "عصير",   cal: 60  },
    { en: "Fresh Apple Juice",        ar: "عصير تفاح طازج",          state: "عصير",   cal: 46  },
  ],
  "🧈 دهون وزيوت": [
    { en: "Olive Oil",                ar: "زيت زيتون",               state: "خام",    cal: 884 },
    { en: "Corn/Sunflower Oil",       ar: "زيت ذرة/عباد الشمس",      state: "خام",    cal: 884 },
    { en: "Butter",                   ar: "زبدة",                    state: "خام",    cal: 717 },
    { en: "Ghee (Samna)",             ar: "سمن بلدي",                state: "خام",    cal: 900 },
    { en: "Margarine",                ar: "سمن صناعي",               state: "خام",    cal: 717 },
    { en: "Mayonnaise",               ar: "مايونيز",                  state: "جاهز",   cal: 680 },
    { en: "Tahini",                   ar: "طحينة",                   state: "خام",    cal: 595 },
  ],
  "🥜 مكسرات وبذور": [
    { en: "Almonds",                  ar: "لوز",                     state: "خام",    cal: 579 },
    { en: "Peanuts",                  ar: "سوداني",                  state: "خام",    cal: 567 },
    { en: "Cashews",                  ar: "كاجو",                    state: "خام",    cal: 553 },
    { en: "Walnuts",                  ar: "عين جمل",                 state: "خام",    cal: 654 },
    { en: "Hazelnuts",                ar: "بندق",                    state: "خام",    cal: 628 },
    { en: "Pistachios",               ar: "فستق",                    state: "خام",    cal: 562 },
    { en: "Peanut Butter",            ar: "زبدة فول سوداني",         state: "خام",    cal: 588 },
    { en: "Sunflower Seeds",          ar: "لب عباد شمس",             state: "خام",    cal: 584 },
    { en: "Pumpkin Seeds",            ar: "لب قرع",                  state: "خام",    cal: 559 },
    { en: "Sesame Seeds",             ar: "سمسم",                    state: "خام",    cal: 573 },
    { en: "Chia Seeds",               ar: "بذور شيا",                state: "خام",    cal: 486 },
    { en: "Flax Seeds",               ar: "بذور كتان",               state: "خام",    cal: 534 },
  ],
  "🥦 خضار": [
    { en: "Raw Cauliflower",          ar: "قرنبيط نيء",              state: "نيء",    cal: 25  },
    { en: "Cooked Cauliflower",       ar: "قرنبيط مطبوخ",            state: "مطبوخ",  cal: 23  },
    { en: "Raw Broccoli",             ar: "بروكلي نيء",              state: "نيء",    cal: 34  },
    { en: "Cooked Broccoli",          ar: "بروكلي مطبوخ",            state: "مطبوخ",  cal: 35  },
    { en: "Cooked Green Beans",       ar: "فاصوليا خضراء مطبوخة",    state: "مطبوخ",  cal: 35  },
    { en: "Cooked Cabbage",           ar: "كرنب مطبوخ",              state: "مطبوخ",  cal: 25  },
    { en: "Raw Mushrooms",            ar: "عيش غراب نيء",            state: "نيء",    cal: 22  },
    { en: "Cooked Mushrooms",         ar: "عيش غراب مطبوخ",          state: "مطبوخ",  cal: 28  },
    { en: "Lettuce",                  ar: "خس",                      state: "نيء",    cal: 15  },
    { en: "Arugula",                  ar: "جرجير",                   state: "نيء",    cal: 25  },
    { en: "Raw Spinach",              ar: "سبانخ نيئة",              state: "نيء",    cal: 23  },
    { en: "Tomato",                   ar: "طماطم",                   state: "نيء",    cal: 18  },
    { en: "Cucumber",                 ar: "خيار",                    state: "نيء",    cal: 15  },
    { en: "Zucchini",                 ar: "كوسة",                    state: "نيء",    cal: 17  },
    { en: "Eggplant",                 ar: "باذنجان",                 state: "نيء",    cal: 25  },
    { en: "Carrots",                  ar: "جزر",                     state: "نيء",    cal: 41  },
    { en: "Bell Pepper",              ar: "فلفل ألوان",              state: "نيء",    cal: 31  },
    { en: "Onion",                    ar: "بصل",                     state: "نيء",    cal: 40  },
  ],
};

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
  width: "100%", padding: "10px 14px",
  background: "#ffffff07", border: `1px solid #1e1e35`,
  borderRadius: 10, color: "#e8e8f0",
  fontSize: "0.88rem", fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", direction: "rtl",
};

function StepLabel({ num, text, color }) {
  const col = color || C.neon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{
        background: `${col}20`, color: col, width: 20, height: 20, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.65rem", fontWeight: 800, flexShrink: 0,
      }}>{num}</span>
      <span style={{ color: C.subtext, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {text}
      </span>
    </div>
  );
}

function FoodSelector({ label, stepNum, catFoods, selected, onSelect, search, onSearch, stepColor }) {
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
              padding: "8px 12px", borderRadius: 10,
              border: `1px solid ${active ? col + "88" : C.cardBorder}`,
              background: active ? `${col}12` : "#ffffff04",
              cursor: "pointer", fontFamily: "inherit", textAlign: "right",
              transition: "all 0.15s",
            }}>
              <span style={{
                background: `${stateTag(f.state)}18`, color: stateTag(f.state),
                padding: "1px 7px", borderRadius: 5, fontSize: "0.62rem", fontWeight: 600,
              }}>{f.state}</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                <span style={{ color: active ? col : C.text, fontSize: "0.83rem", fontWeight: active ? 700 : 400 }}>{f.ar}</span>
                <span style={{ color: C.muted, fontSize: "0.62rem" }}>{f.en} · {f.cal} kcal/100g</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AlternativeRow({ alt }) {
  const pct = Math.min(100, Math.round((alt.needed / 500) * 100));
  return (
    <div style={{ background: "#ffffff05", border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "10px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
        <div>
          <span style={{ color: C.teal, fontWeight: 800, fontSize: "1.1rem" }}>{alt.needed}</span>
          <span style={{ color: C.subtext, fontSize: "0.7rem", marginRight: 2 }}>g</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.text, fontSize: "0.83rem", fontWeight: 600 }}>{alt.ar}</div>
          <div style={{ color: C.muted, fontSize: "0.6rem" }}>{alt.en}</div>
          <span style={{
            background: `${stateTag(alt.state)}18`, color: stateTag(alt.state),
            padding: "1px 7px", borderRadius: 5, fontSize: "0.6rem", fontWeight: 700,
            display: "inline-block", marginTop: 2,
          }}>{alt.state} · {alt.cal} kcal/100g</span>
        </div>
      </div>
      <div style={{ height: 3, background: C.cardBorder, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.teal}, ${C.neon})`, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function MealCard({ index, onRemove, showRemove }) {
  const [mode, setMode]         = useState("all");
  const [cat, setCat]           = useState(Object.keys(DB)[0]);
  const [food, setFood]         = useState(DB[Object.keys(DB)[0]][0]);
  const [grams, setGrams]       = useState("");
  const [search, setSearch]     = useState("");
  const [targetFood, setTargetFood] = useState(null);
  const [searchB, setSearchB]   = useState("");
  const gramsRef = useRef(null);

  const catFoods = DB[cat];

  const handleCatChange = (c) => {
    setCat(c); setFood(DB[c][0]); setTargetFood(null);
    setSearch(""); setSearchB(""); setGrams("");
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
        textAlign: "center", marginBottom: "1rem",
        fontSize: "0.72rem", letterSpacing: "0.18em",
        color: C.neon, fontWeight: 700, opacity: 0.6, textTransform: "uppercase",
      }}>◈ وجبة {index + 1}</div>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.2rem", background: "#ffffff06", borderRadius: 12, padding: 4 }}>
        {[
          { key: "all",      icon: "📋", label: "كل البدائل",  desc: "عرض كل الأصناف بنفس السعرات" },
          { key: "specific", icon: "🎯", label: "بديل محدد",   desc: "حوّل صنف لصنف معين" },
        ].map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} style={{
            flex: 1, padding: "9px 8px", borderRadius: 10,
            border: `1px solid ${mode === m.key ? C.neon + "55" : "transparent"}`,
            background: mode === m.key ? `${C.neon}12` : "transparent",
            color: mode === m.key ? C.neon : C.subtext,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
          }}>
            <div style={{ fontSize: "0.82rem", fontWeight: mode === m.key ? 700 : 400 }}>{m.icon} {m.label}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.65, marginTop: 2 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Category */}
      <StepLabel num="1" text="اختر الفئة الغذائية" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.2rem" }}>
        {Object.keys(DB).map(c => (
          <button key={c} onClick={() => handleCatChange(c)} style={{
            padding: "5px 11px", borderRadius: 50,
            border: `1px solid ${cat === c ? C.neon : C.cardBorder}`,
            background: cat === c ? `${C.neon}18` : "transparent",
            color: cat === c ? C.neon : C.subtext,
            cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit",
            fontWeight: cat === c ? 700 : 400,
          }}>{c}</button>
        ))}
      </div>

      {/* ── وضع كل البدائل ── */}
      {mode === "all" && (
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
            <span style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", color: C.subtext, fontSize: "0.75rem" }}>جرام</span>
          </div>

          {totalCals > 0 && (
            <>
              <div style={{
                background: `linear-gradient(135deg, ${C.neon}14, ${C.teal}08)`,
                border: `1px solid ${C.neon}33`, borderRadius: 14, padding: "14px 16px", marginBottom: 12,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: C.subtext, fontSize: "0.68rem", marginBottom: 2 }}>إجمالي السعرات</div>
                    <div style={{ color: C.neon, fontWeight: 800, fontSize: "1.5rem", lineHeight: 1 }}>
                      {Math.round(totalCals)}<span style={{ fontSize: "0.72rem", fontWeight: 400, marginRight: 4, color: C.subtext }}>kcal</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: C.text, fontSize: "0.82rem", fontWeight: 600 }}>{food.ar}</div>
                    <div style={{ color: C.muted, fontSize: "0.68rem" }}>{grams}g × {food.cal} kcal/100g</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "0.68rem", color: C.teal, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 7, textTransform: "uppercase" }}>
                البدائل بنفس السعرات ({alternatives.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {alternatives.map(alt => <AlternativeRow key={alt.en} alt={alt} />)}
              </div>
            </>
          )}
          {!grams && (
            <div style={{ textAlign: "center", color: C.muted, fontSize: "0.75rem", padding: "6px 0" }}>
              اختر الصنف ← أدخل الكمية → سيظهر الحساب تلقائياً ✨
            </div>
          )}
        </>
      )}

      {/* ── وضع البديل المحدد ── */}
      {mode === "specific" && (
        <>
          {/* Food A */}
          <div style={{ background: `${C.neon}07`, border: `1px solid ${C.neon}22`, borderRadius: 14, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ color: C.neon, fontSize: "0.7rem", fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>
              🅐 الصنف الأساسي — اللي في نظامك
            </div>
            <FoodSelector
              label="اختر الصنف"
              stepNum="2" catFoods={catFoods} selected={food}
              onSelect={(f) => { setFood(f); setGrams(""); }}
              search={search} onSearch={setSearch} stepColor={C.neon}
            />
            <StepLabel num="3" text="الكمية بالجرام" color={C.neon} />
            <div style={{ position: "relative" }}>
              <input ref={gramsRef} type="number" min={0} value={grams}
                onChange={e => setGrams(e.target.value)} placeholder="مثال: 150"
                style={{ ...INPUT_STYLE, border: `1px solid ${C.neon}44` }} />
              <span style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", color: C.subtext, fontSize: "0.75rem" }}>جرام</span>
            </div>
          </div>

          {/* Exchange Arrow */}
          <div style={{ textAlign: "center", margin: "6px 0", fontSize: "1.4rem", color: C.teal }}>⇅</div>

          {/* Food B */}
          <div style={{ background: `${C.teal}07`, border: `1px solid ${C.teal}22`, borderRadius: 14, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ color: C.teal, fontSize: "0.7rem", fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>
              🅑 الصنف البديل — اللي تحوله
            </div>
            <FoodSelector
              label="اختر البديل"
              stepNum="4" catFoods={catFoods} selected={targetFood}
              onSelect={setTargetFood}
              search={searchB} onSearch={setSearchB} stepColor={C.teal}
            />
          </div>

          {/* Result */}
          {totalCals > 0 && targetFood && specificResult !== null && (
            <div style={{
              background: `linear-gradient(135deg, ${C.teal}15, ${C.neon}08)`,
              border: `2px solid ${C.teal}44`, borderRadius: 16,
              padding: "20px 16px", textAlign: "center",
            }}>
              <div style={{ color: C.subtext, fontSize: "0.68rem", marginBottom: 10, letterSpacing: "0.1em" }}>
                ══ النتيجة ══
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                {/* A */}
                <div style={{ background: `${C.neon}10`, border: `1px solid ${C.neon}33`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ color: C.neon, fontWeight: 800, fontSize: "1.4rem", lineHeight: 1 }}>{grams}g</div>
                  <div style={{ color: C.subtext, fontSize: "0.7rem", marginTop: 3 }}>{food.ar}</div>
                  <div style={{ color: C.muted, fontSize: "0.6rem" }}>{food.en}</div>
                </div>
                {/* Arrow */}
                <div style={{ color: C.muted, fontSize: "1.6rem" }}>→</div>
                {/* B */}
                <div style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}44`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ color: C.teal, fontWeight: 900, fontSize: "1.8rem", lineHeight: 1 }}>{specificResult}g</div>
                  <div style={{ color: C.subtext, fontSize: "0.7rem", marginTop: 3 }}>{targetFood.ar}</div>
                  <div style={{ color: C.muted, fontSize: "0.6rem" }}>{targetFood.en}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, color: C.subtext, fontSize: "0.72rem" }}>
                كلاهما يساوي <span style={{ color: C.neon, fontWeight: 800 }}>{Math.round(totalCals)} kcal</span>
              </div>
            </div>
          )}

          {(!grams || !targetFood) && (
            <div style={{ textAlign: "center", color: C.muted, fontSize: "0.75rem", padding: "8px 0" }}>
              {!food || !grams ? "اختر الصنف الأساسي وأدخل الكمية" : "اختر الصنف البديل"} 🎯
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  const [meals, setMeals] = useState([{ id: 1 }]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Cairo', 'Tajawal', sans-serif", direction: "rtl", color: C.text }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 60% 40% at 80% 10%, ${C.neon}07 0%, transparent 60%),
                     radial-gradient(ellipse 50% 50% at 10% 80%, ${C.teal}06 0%, transparent 60%)`,
      }} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 14px 80px", position: "relative", zIndex: 1 }}>

        <header style={{ textAlign: "center", padding: "2.2rem 0 1.5rem" }}>
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
            كل البدائل المتاحة · أو حوّل صنف لصنف محدد بنفس السعرات 🔥
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {meals.map((m, i) => (
            <MealCard key={m.id} index={i}
              showRemove={meals.length > 1}
              onRemove={() => setMeals(prev => prev.filter(x => x.id !== m.id))}
            />
          ))}
        </div>

        {meals.length < 4 && (
          <button onClick={() => setMeals(prev => [...prev, { id: Date.now() }])} style={{
            width: "100%", marginTop: 14, padding: "13px",
            background: "transparent", border: `1px dashed ${C.neon}44`,
            borderRadius: 16, color: C.neon, cursor: "pointer",
            fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>＋ إضافة وجبة للمقارنة</button>
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
        input[type=number] { -moz-appearance: textfield; }
        input:focus { border-color: ${C.neon}66 !important; box-shadow: 0 0 0 3px ${C.neon}12; }
        button:hover { opacity: 0.82; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${C.neon}33; border-radius: 3px; }
      `}</style>
    </div>
  );
}