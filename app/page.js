"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
// ========== MSR Food Alternatives — قاعدة البيانات ==========
// مولّدة من قاعدة MSR Nutrition Planner (FOOD_DATABASE) — لا تعدّلها يدويًا؛ أعد التوليد بـ: node gen-foods.js
// كل القيم لكل 100 جرام. التبديل يتم داخل نفس الفئة فقط.
// cal/p/c/f = سعرات/بروتين/كارب/دهون لكل 100 جم
const DB = {
  "🍚 نشويات": [
    {"id":301,"en":"White Rice","ar":"أرز أبيض","state":"مطبوخ","unit":"g","cal":130,"p":2.7,"c":28,"f":0.3},
    {"id":302,"en":"Brown Rice","ar":"أرز بني","state":"مطبوخ","unit":"g","cal":112,"p":2.6,"c":23,"f":0.9},
    {"id":303,"en":"Oats","ar":"شوفان","state":"جاف","unit":"g","cal":389,"p":17,"c":66,"f":7},
    {"id":304,"en":"Whole Wheat Bread","ar":"خبز قمح كامل","state":"عادي","unit":"g","cal":247,"p":9,"c":43,"f":3.4},
    {"id":305,"en":"White Bread","ar":"خبز أبيض","state":"عادي","unit":"g","cal":265,"p":9,"c":49,"f":3.2},
    {"id":306,"en":"Pasta","ar":"مكرونة","state":"مطبوخ","unit":"g","cal":131,"p":5,"c":25,"f":0.9},
    {"id":307,"en":"Whole Wheat Pasta","ar":"مكرونة قمح كامل","state":"مطبوخ","unit":"g","cal":124,"p":5.5,"c":23,"f":0.8},
    {"id":308,"en":"Sweet Potato","ar":"بطاطا حلوة","state":"عادي","unit":"g","cal":86,"p":1.6,"c":20,"f":0.1},
    {"id":309,"en":"White Potato","ar":"بطاطس","state":"عادي","unit":"g","cal":77,"p":2,"c":17,"f":0.1},
    {"id":310,"en":"Bread (Baladi)","ar":"خبز بلدي","state":"عادي","unit":"g","cal":253,"p":8,"c":52,"f":1.5},
    {"id":311,"en":"Quinoa","ar":"كينوا","state":"مطبوخ","unit":"g","cal":120,"p":4,"c":22,"f":1.9},
    {"id":312,"en":"Lentils (cooked)","ar":"عدس","state":"عادي","unit":"g","cal":116,"p":9,"c":20,"f":0.4},
    {"id":313,"en":"Chickpeas (cooked)","ar":"حمص","state":"عادي","unit":"g","cal":164,"p":9,"c":27,"f":2.6},
    {"id":314,"en":"Fava Beans (Ful)","ar":"فول مدمس","state":"عادي","unit":"g","cal":110,"p":8,"c":26,"f":0.5},
    {"id":315,"en":"Corn","ar":"ذرة","state":"عادي","unit":"g","cal":96,"p":3.2,"c":19,"f":1.2},
    {"id":316,"en":"Sweet Potato (boiled)","ar":"بطاطا مسلوقة","state":"عادي","unit":"g","cal":76,"p":1.4,"c":17.7,"f":0.1},
    {"id":317,"en":"Pasta with Tomato Sauce (boiled)","ar":"مكرونة بصلصة الطماطم","state":"مطبوخ","unit":"g","cal":130,"p":4.7,"c":24,"f":1.5},
    {"id":318,"en":"Tortilla Bread (wheat)","ar":"خبز تورتيلا","state":"عادي","unit":"g","cal":306,"p":8.5,"c":50,"f":8},
    {"id":1004,"en":"Raw White Rice (dry)","ar":"أرز أبيض جاف","state":"جاف","unit":"g","cal":350,"p":6.5,"c":78,"f":0.5},
    {"id":1005,"en":"Raw Brown Rice (dry)","ar":"أرز بني جاف","state":"جاف","unit":"g","cal":370,"p":7.5,"c":76,"f":2.5},
    {"id":1006,"en":"Raw Oats (dry)","ar":"شوفان جاف","state":"جاف","unit":"g","cal":389,"p":17,"c":66,"f":7},
    {"id":1007,"en":"Raw Potato (uncooked)","ar":"بطاطس نية","state":"نيء","unit":"g","cal":77,"p":2,"c":17,"f":0.1},
    {"id":1008,"en":"Raw Sweet Potato","ar":"بطاطا حلوة نية","state":"نيء","unit":"g","cal":86,"p":1.6,"c":20,"f":0.1},
    {"id":1009,"en":"Raw Pasta (dry)","ar":"مكرونة جافة","state":"جاف","unit":"g","cal":357,"p":13,"c":74,"f":1.5},
    {"id":1010,"en":"Raw Lentils (dry)","ar":"عدس جاف","state":"جاف","unit":"g","cal":353,"p":26,"c":63,"f":1},
    {"id":1102,"en":"Baked Falafel","ar":"فلافل بالفرن","state":"جاهز","unit":"g","cal":160,"p":8.3,"c":20,"f":5},
    {"id":1103,"en":"Ful Medames","ar":"فول مدمس","state":"عادي","unit":"g","cal":110,"p":8,"c":26,"f":0.5},
    {"id":1104,"en":"Koshari","ar":"كشري","state":"عادي","unit":"g","cal":126,"p":4,"c":23,"f":2},
    {"id":1109,"en":"Baladi Bread (Large)","ar":"عيش بلدي كبير","state":"جاهز","unit":"g","cal":253.3,"p":8.3,"c":51.7,"f":1.5},
    {"id":1110,"en":"Rusks / Biscotti","ar":"بقسماط","state":"عادي","unit":"g","cal":380,"p":8,"c":75,"f":5},
    {"id":1111,"en":"Taamiya (falafel) fried","ar":"طعمية مقلية","state":"جاهز","unit":"g","cal":315,"p":10,"c":35,"f":15},
  ],
  "🍗 بروتين": [
    {"id":101,"en":"Chicken Breast","ar":"صدر دجاج","state":"عادي","unit":"g","cal":165,"p":31,"c":0,"f":3.6},
    {"id":102,"en":"Chicken Thigh","ar":"فخذ دجاج","state":"عادي","unit":"g","cal":209,"p":26,"c":0,"f":10.9},
    {"id":103,"en":"Ground Beef (lean)","ar":"لحم مفروم","state":"عادي","unit":"g","cal":172,"p":26,"c":0,"f":7},
    {"id":104,"en":"Beef Steak","ar":"ستيك لحم","state":"عادي","unit":"g","cal":180,"p":27,"c":0,"f":8},
    {"id":105,"en":"Lamb","ar":"لحم ضاني","state":"عادي","unit":"g","cal":218,"p":25,"c":0,"f":14},
    {"id":106,"en":"Tuna (canned in water)","ar":"تونة","state":"عادي","unit":"g","cal":116,"p":25,"c":0,"f":1},
    {"id":107,"en":"Salmon","ar":"سلمون","state":"عادي","unit":"g","cal":208,"p":20,"c":0,"f":13},
    {"id":108,"en":"Tilapia","ar":"بلطي","state":"عادي","unit":"g","cal":128,"p":26,"c":0,"f":2.7},
    {"id":109,"en":"Shrimp","ar":"جمبري","state":"عادي","unit":"g","cal":99,"p":24,"c":0.9,"f":0.3},
    {"id":110,"en":"Turkey Breast","ar":"ديك رومي","state":"عادي","unit":"g","cal":135,"p":29,"c":0,"f":1},
    {"id":111,"en":"Sardines","ar":"سردين","state":"عادي","unit":"g","cal":185,"p":21,"c":0,"f":11},
    {"id":112,"en":"Mullet (Boori)","ar":"بوري","state":"مطبوخ","unit":"g","cal":150,"p":25.6,"c":0,"f":4.9},
    {"id":113,"en":"Mackerel","ar":"ماكريل","state":"مطبوخ","unit":"g","cal":260,"p":24,"c":0,"f":18},
    {"id":120,"en":"Whole Egg","ar":"بيضة كاملة","state":"عادي","unit":"g","cal":143,"p":13,"c":1.1,"f":10},
    {"id":121,"en":"Egg White","ar":"بياض البيض","state":"عادي","unit":"g","cal":52,"p":11,"c":0.7,"f":0.2},
    {"id":122,"en":"Egg Yolk","ar":"صفار البيض","state":"عادي","unit":"g","cal":322,"p":16,"c":3.6,"f":27},
    {"id":1001,"en":"Raw Chicken Breast (uncooked)","ar":"صدر دجاج نيء","state":"نيء","unit":"g","cal":120,"p":23,"c":0,"f":2.6},
    {"id":1002,"en":"Raw Chicken Thigh (uncooked)","ar":"فخذ دجاج نيء","state":"نيء","unit":"g","cal":153,"p":19,"c":0,"f":8},
    {"id":1003,"en":"Raw Ground Beef (uncooked)","ar":"لحم مفروم نيء","state":"نيء","unit":"g","cal":176,"p":20,"c":0,"f":10},
    {"id":1105,"en":"Hawawshi (lean)","ar":"حواوشي هش","state":"عادي","unit":"g","cal":200,"p":14,"c":18,"f":8},
    {"id":1107,"en":"Grilled Kofta","ar":"كفتة مشوية","state":"عادي","unit":"g","cal":164,"p":18,"c":5,"f":8},
  ],
  "🥛 ألبان وأجبان": [
    {"id":201,"en":"Low-Fat Yogurt","ar":"زبادي قليل الدسم","state":"عادي","unit":"g","cal":61,"p":5,"c":7,"f":1.5},
    {"id":202,"en":"Full-Fat Yogurt","ar":"زبادي كامل الدسم","state":"عادي","unit":"g","cal":61,"p":3.5,"c":4.7,"f":3.3},
    {"id":203,"en":"Cottage Cheese","ar":"جبن قريش","state":"عادي","unit":"g","cal":98,"p":11,"c":3.4,"f":4},
    {"id":204,"en":"Feta Cheese","ar":"جبن فيتا","state":"عادي","unit":"g","cal":264,"p":14,"c":4,"f":21},
    {"id":205,"en":"Cheddar Cheese","ar":"جبن شيدر","state":"عادي","unit":"g","cal":402,"p":25,"c":1.3,"f":33},
    {"id":206,"en":"Mozzarella","ar":"موزاريلا","state":"عادي","unit":"g","cal":254,"p":22,"c":2.2,"f":17},
    {"id":207,"en":"Cream Cheese","ar":"كريم تشيز","state":"عادي","unit":"g","cal":350,"p":6.2,"c":4.1,"f":34},
    {"id":208,"en":"Butter","ar":"زبدة","state":"عادي","unit":"g","cal":717,"p":0.9,"c":0.1,"f":80},
    {"id":209,"en":"Labneh","ar":"لبنة","state":"عادي","unit":"g","cal":89,"p":7,"c":4,"f":5},
    {"id":210,"en":"Whipping Cream","ar":"كريمة خفق","state":"عادي","unit":"g","cal":340,"p":2.5,"c":3.6,"f":36},
    {"id":211,"en":"Greek Yogurt (low-fat)","ar":"زبادي يوناني","state":"عادي","unit":"g","cal":59,"p":10,"c":4,"f":0.7},
    {"id":212,"en":"Greek Yogurt (full-fat)","ar":"زبادي يوناني كامل","state":"عادي","unit":"g","cal":97,"p":9,"c":3.6,"f":5},
    {"id":213,"en":"Rayeb Yogurt","ar":"رايب","state":"عادي","unit":"g","cal":60,"p":3.5,"c":5,"f":3},
    {"id":214,"en":"Light Cream Cheese","ar":"كريم تشيز لايت","state":"عادي","unit":"g","cal":125,"p":9,"c":5,"f":8},
    {"id":215,"en":"Low-Salt White Cheese (low-fat)","ar":"جبنة بيضاء قليلة الملح قليلة الدسم","state":"عادي","unit":"g","cal":170,"p":17,"c":3,"f":9},
    {"id":216,"en":"Low-Salt White Cheese (full-fat)","ar":"جبنة بيضاء قليلة الملح","state":"عادي","unit":"g","cal":248,"p":14,"c":3,"f":20},
    {"id":412,"en":"Whole Milk","ar":"حليب كامل الدسم","state":"سائل","unit":"g","cal":61,"p":3.2,"c":4.7,"f":3.6},
    {"id":413,"en":"Skim Milk","ar":"حليب خالي الدسم","state":"سائل","unit":"g","cal":36,"p":3.5,"c":5,"f":0.2},
    {"id":414,"en":"Semi-Skim Milk","ar":"حليب نصف دسم","state":"سائل","unit":"g","cal":47,"p":3.3,"c":4.8,"f":1.8},
    {"id":415,"en":"Almarai Protein Milk","ar":"حليب ألمراي بروتين","state":"سائل","unit":"g","cal":42,"p":5,"c":5,"f":0.2},
    {"id":416,"en":"Oat Milk","ar":"حليب الشوفان","state":"سائل","unit":"g","cal":45,"p":1,"c":7,"f":1.5},
    {"id":417,"en":"Almond Milk (unsweetened)","ar":"حليب اللوز","state":"سائل","unit":"g","cal":20,"p":0.4,"c":1.2,"f":1.5},
  ],
  "🥦 خضروات": [
    {"id":501,"en":"Broccoli","ar":"بروكلي","state":"عادي","unit":"g","cal":34,"p":2.8,"c":7,"f":0.4},
    {"id":502,"en":"Spinach","ar":"سبانخ","state":"عادي","unit":"g","cal":23,"p":2.9,"c":3.6,"f":0.4},
    {"id":503,"en":"Cucumber","ar":"خيار","state":"عادي","unit":"g","cal":16,"p":0.7,"c":3.6,"f":0.1},
    {"id":504,"en":"Tomato","ar":"طماطم","state":"عادي","unit":"g","cal":18,"p":0.9,"c":3.9,"f":0.2},
    {"id":505,"en":"Lettuce","ar":"خس","state":"عادي","unit":"g","cal":15,"p":1.4,"c":2.9,"f":0.2},
    {"id":506,"en":"Bell Pepper","ar":"فلفل رومي","state":"عادي","unit":"g","cal":31,"p":1,"c":6,"f":0.3},
    {"id":507,"en":"Cauliflower","ar":"قرنبيط","state":"عادي","unit":"g","cal":25,"p":1.9,"c":5,"f":0.3},
    {"id":508,"en":"Green Beans","ar":"فاصوليا خضراء","state":"عادي","unit":"g","cal":31,"p":1.8,"c":7,"f":0.1},
    {"id":509,"en":"Zucchini","ar":"كوسة","state":"عادي","unit":"g","cal":17,"p":1.2,"c":3.1,"f":0.3},
    {"id":510,"en":"Eggplant","ar":"باذنجان","state":"عادي","unit":"g","cal":25,"p":1,"c":5.9,"f":0.2},
    {"id":511,"en":"Carrots","ar":"جزر","state":"عادي","unit":"g","cal":41,"p":0.9,"c":10,"f":0.2},
    {"id":512,"en":"Onion","ar":"بصل","state":"عادي","unit":"g","cal":40,"p":1.1,"c":9.3,"f":0.1},
    {"id":513,"en":"Garlic","ar":"ثوم","state":"عادي","unit":"g","cal":149,"p":6.4,"c":33,"f":0.5},
    {"id":514,"en":"Mushrooms","ar":"فطر","state":"عادي","unit":"g","cal":22,"p":3.1,"c":3.3,"f":0.3},
    {"id":515,"en":"Peas","ar":"بازلاء","state":"عادي","unit":"g","cal":81,"p":5.4,"c":14,"f":0.4},
    {"id":516,"en":"Molokhia","ar":"ملوخية","state":"عادي","unit":"g","cal":43,"p":4.5,"c":7,"f":0.7},
    {"id":517,"en":"Arugula (Rocket)","ar":"جرجير","state":"عادي","unit":"g","cal":25,"p":2.6,"c":3.7,"f":0.7},
    {"id":518,"en":"Parsley","ar":"بقدونس","state":"عادي","unit":"g","cal":36,"p":3,"c":6.3,"f":0.8},
    {"id":519,"en":"Green Pepper","ar":"فلفل أخضر","state":"عادي","unit":"g","cal":20,"p":0.9,"c":4.6,"f":0.2},
    {"id":520,"en":"Cabbage","ar":"كرنب","state":"عادي","unit":"g","cal":25,"p":1.3,"c":5.8,"f":0.1},
    {"id":521,"en":"Okra","ar":"بامية","state":"عادي","unit":"g","cal":33,"p":1.9,"c":7.5,"f":0.2},
    {"id":522,"en":"Radish","ar":"فجل","state":"عادي","unit":"g","cal":16,"p":0.7,"c":3.4,"f":0.1},
    {"id":523,"en":"Beetroot (boiled)","ar":"بنجر مسلوق","state":"عادي","unit":"g","cal":44,"p":1.7,"c":10,"f":0.2},
    {"id":524,"en":"Pumpkin","ar":"قرع عسلي","state":"عادي","unit":"g","cal":26,"p":1,"c":6.5,"f":0.1},
    {"id":525,"en":"Mixed Vegetables (boiled)","ar":"خضار مسلوقة متنوعة","state":"عادي","unit":"g","cal":35,"p":2,"c":7,"f":0.3},
    {"id":526,"en":"Green Salad (no dressing)","ar":"سلطة خضراء","state":"عادي","unit":"g","cal":16,"p":1.2,"c":3,"f":0.2},
    {"id":527,"en":"Mixed Salad: Tomato, Cucumber, Green Pepper","ar":"سلطة طماطم وخيار وفلفل أخضر","state":"عادي","unit":"g","cal":18,"p":0.8,"c":4,"f":0.2},
    {"id":1101,"en":"Egyptian Lentil Soup","ar":"شوربة عدس مصرية","state":"عادي","unit":"g","cal":76,"p":4,"c":11,"f":1.5},
    {"id":1106,"en":"Molokhia with Chicken","ar":"ملوخية بالدجاج","state":"عادي","unit":"g","cal":75,"p":8,"c":4,"f":3},
    {"id":1108,"en":"Mahshi Kousa","ar":"محشي كوسة","state":"عادي","unit":"g","cal":103,"p":5,"c":14,"f":3},
  ],
  "🍎 فواكه": [
    {"id":701,"en":"Banana","ar":"موز","state":"عادي","unit":"g","cal":89,"p":1.1,"c":23,"f":0.3},
    {"id":702,"en":"Apple","ar":"تفاح","state":"عادي","unit":"g","cal":52,"p":0.3,"c":14,"f":0.2},
    {"id":703,"en":"Orange","ar":"برتقال","state":"عادي","unit":"g","cal":47,"p":0.9,"c":12,"f":0.1},
    {"id":704,"en":"Mango","ar":"مانجو","state":"عادي","unit":"g","cal":60,"p":0.8,"c":15,"f":0.4},
    {"id":705,"en":"Strawberry","ar":"فراولة","state":"عادي","unit":"g","cal":32,"p":0.7,"c":8,"f":0.3},
    {"id":706,"en":"Watermelon","ar":"بطيخ","state":"عادي","unit":"g","cal":30,"p":0.6,"c":8,"f":0.2},
    {"id":707,"en":"Grapes","ar":"عنب","state":"عادي","unit":"g","cal":69,"p":0.7,"c":18,"f":0.2},
    {"id":708,"en":"Dates","ar":"تمر","state":"عادي","unit":"g","cal":282,"p":1.8,"c":75,"f":0.2},
    {"id":709,"en":"Figs","ar":"تين","state":"عادي","unit":"g","cal":74,"p":0.7,"c":19,"f":0.3},
    {"id":710,"en":"Pomegranate","ar":"رمان","state":"عادي","unit":"g","cal":83,"p":1.7,"c":19,"f":1.2},
    {"id":711,"en":"Lemon","ar":"ليمون","state":"عادي","unit":"g","cal":29,"p":1.1,"c":9,"f":0.3},
    {"id":712,"en":"Pineapple","ar":"أناناس","state":"عادي","unit":"g","cal":50,"p":0.5,"c":13,"f":0.1},
    {"id":713,"en":"Peach","ar":"خوخ","state":"عادي","unit":"g","cal":39,"p":0.9,"c":10,"f":0.3},
    {"id":714,"en":"Pear","ar":"كمثرى","state":"عادي","unit":"g","cal":57,"p":0.4,"c":15,"f":0.1},
  ],
  "🧈 دهون ومكسرات": [
    {"id":601,"en":"Olive Oil","ar":"زيت زيتون","state":"عادي","unit":"g","cal":884,"p":0,"c":0,"f":100},
    {"id":602,"en":"Coconut Oil","ar":"زيت جوز الهند","state":"عادي","unit":"g","cal":892,"p":0,"c":0,"f":100},
    {"id":603,"en":"Avocado","ar":"أفوكادو","state":"عادي","unit":"g","cal":160,"p":2,"c":9,"f":15},
    {"id":604,"en":"Almonds","ar":"لوز","state":"عادي","unit":"g","cal":579,"p":21,"c":22,"f":50},
    {"id":605,"en":"Walnuts","ar":"جوز","state":"عادي","unit":"g","cal":654,"p":15,"c":14,"f":65},
    {"id":606,"en":"Cashews","ar":"كاجو","state":"عادي","unit":"g","cal":553,"p":18,"c":30,"f":44},
    {"id":607,"en":"Peanut Butter","ar":"زبدة الفول السوداني","state":"عادي","unit":"g","cal":588,"p":25,"c":20,"f":50},
    {"id":608,"en":"Peanuts","ar":"فول سوداني","state":"عادي","unit":"g","cal":567,"p":26,"c":16,"f":49},
    {"id":609,"en":"Sunflower Seeds","ar":"بذور عباد الشمس","state":"عادي","unit":"g","cal":584,"p":21,"c":20,"f":51},
    {"id":610,"en":"Tahini","ar":"طحينة","state":"عادي","unit":"g","cal":595,"p":17,"c":21,"f":54},
    {"id":611,"en":"Flaxseeds","ar":"بذور الكتان","state":"عادي","unit":"g","cal":534,"p":18,"c":29,"f":42},
    {"id":612,"en":"Chia Seeds","ar":"بذور الشيا","state":"عادي","unit":"g","cal":486,"p":17,"c":42,"f":31},
    {"id":613,"en":"Ghee","ar":"سمن بلدي","state":"عادي","unit":"g","cal":900,"p":0,"c":0,"f":99.8},
    {"id":614,"en":"Sunflower Oil","ar":"زيت عباد الشمس","state":"عادي","unit":"g","cal":884,"p":0,"c":0,"f":100},
    {"id":615,"en":"Corn Oil","ar":"زيت الذرة","state":"عادي","unit":"g","cal":884,"p":0,"c":0,"f":100},
    {"id":616,"en":"Avocado Oil","ar":"زيت الأفوكادو","state":"عادي","unit":"g","cal":884,"p":0,"c":0,"f":100},
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
