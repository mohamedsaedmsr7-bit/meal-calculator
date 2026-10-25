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
    {"id":310,"en":"Bread (Baladi)","ar":"خبز بلدي","state":"عادي","unit":"g","cal":253,"p":8,"c":52,"f":1.5},
    {"id":311,"en":"Quinoa","ar":"كينوا","state":"مطبوخ","unit":"g","cal":120,"p":4,"c":22,"f":1.9},
    {"id":315,"en":"Corn","ar":"ذرة","state":"عادي","unit":"g","cal":96,"p":3.2,"c":19,"f":1.2},
    {"id":316,"en":"Sweet Potato (boiled)","ar":"بطاطا حلوة مسلوقة","state":"مسلوق","unit":"g","cal":76,"p":1.4,"c":17.7,"f":0.1},
    {"id":317,"en":"Pasta with Tomato Sauce (boiled)","ar":"مكرونة بصلصة الطماطم","state":"مطبوخ","unit":"g","cal":130,"p":4.7,"c":24,"f":1.5},
    {"id":318,"en":"Tortilla Bread (wheat)","ar":"خبز تورتيلا","state":"عادي","unit":"g","cal":306,"p":8.5,"c":50,"f":8},
    {"id":1004,"en":"Raw White Rice (dry)","ar":"أرز أبيض جاف","state":"جاف","unit":"g","cal":350,"p":6.5,"c":78,"f":0.5},
    {"id":1005,"en":"Raw Brown Rice (dry)","ar":"أرز بني جاف","state":"جاف","unit":"g","cal":370,"p":7.5,"c":76,"f":2.5},
    {"id":1006,"en":"Raw Oats (dry)","ar":"شوفان جاف","state":"جاف","unit":"g","cal":389,"p":17,"c":66,"f":7},
    {"id":1007,"en":"Raw Potato (uncooked)","ar":"بطاطس نية","state":"نيء","unit":"g","cal":77,"p":2,"c":17,"f":0.1},
    {"id":1008,"en":"Raw Sweet Potato","ar":"بطاطا حلوة نية","state":"نيء","unit":"g","cal":86,"p":1.6,"c":20,"f":0.1},
    {"id":1009,"en":"Raw Pasta (dry)","ar":"مكرونة جافة","state":"جاف","unit":"g","cal":357,"p":13,"c":74,"f":1.5},
    {"id":1104,"en":"Koshari","ar":"كشري","state":"عادي","unit":"g","cal":126,"p":4,"c":23,"f":2},
    {"id":9800,"en":"Whole Wheat Flour","ar":"دقيق قمح كامل الحبة","state":"جاف","unit":"g","cal":340,"p":13.2,"c":72,"f":2.5},
    {"id":9801,"en":"White Flour","ar":"دقيق أبيض","state":"جاف","unit":"g","cal":364,"p":10.3,"c":76.3,"f":1},
    {"id":9802,"en":"Oat Flour","ar":"دقيق الشوفان","state":"جاف","unit":"g","cal":404,"p":14.7,"c":65.7,"f":9.1},
    {"id":9400,"en":"Corn Flakes","ar":"كورن فليكس","state":"عادي","unit":"g","cal":357,"p":7.5,"c":84,"f":0.4},
    {"id":9401,"en":"Fitness Cereal","ar":"سيريال فيتنس","state":"عادي","unit":"g","cal":372,"p":8,"c":76,"f":1.6},
    {"id":9302,"en":"Cerelac Rice (dry powder)","ar":"سيريلاك أرز","state":"جاف","unit":"g","cal":400,"p":9,"c":78,"f":6},
    {"id":9300,"en":"Cerelac Wheat & Milk (dry powder)","ar":"سيريلاك قمح وحليب","state":"جاف","unit":"g","cal":420,"p":14,"c":71,"f":9},
    {"id":9301,"en":"Cerelac Wheat (dry powder)","ar":"سيريلاك قمح","state":"جاف","unit":"g","cal":395,"p":12,"c":76,"f":4.5},
    {"id":9105,"en":"Canned Sweet Corn","ar":"ذرة حلوة معلبة","state":"معلب","unit":"g","cal":85,"p":2.5,"c":17.5,"f":1.2},
    {"id":9106,"en":"Santee Granola","ar":"جرانولا سانتي","state":"عادي","unit":"g","cal":435,"p":8,"c":63,"f":16.5},
    {"id":9112,"en":"Digestive Biscuits","ar":"بسكويت دايجستف","state":"عادي","unit":"g","cal":480,"p":7,"c":65,"f":21},
    {"id":9113,"en":"Chocolate Digestive Biscuits","ar":"بسكويت دايجستف بالشوكولاتة","state":"عادي","unit":"g","cal":495,"p":6.5,"c":64,"f":24},
    {"id":9114,"en":"Rice Cakes","ar":"رايس كيك","state":"عادي","unit":"g","cal":387,"p":8,"c":82,"f":2.8},
    {"id":9115,"en":"Oat Pasta (dry)","ar":"مكرونة شوفان جافة","state":"جاف","unit":"g","cal":355,"p":12,"c":65,"f":5},
    {"id":9116,"en":"Oat Pasta (boiled)","ar":"مكرونة شوفان مسلوقة","state":"مطبوخ","unit":"g","cal":140,"p":5,"c":25,"f":2},
    {"id":9117,"en":"Oat & Barley Rye Bread","ar":"عيش ريف شوفان وشعير","state":"عادي","unit":"g","cal":245,"p":10,"c":42,"f":4},
    {"id":9118,"en":"Vermicelli (dry)","ar":"شعرية جافة","state":"جاف","unit":"g","cal":360,"p":11.5,"c":74,"f":1.5},
    {"id":9119,"en":"Vermicelli (boiled)","ar":"شعرية مسلوقة","state":"مطبوخ","unit":"g","cal":156,"p":5.8,"c":30.5,"f":0.9},
    {"id":9120,"en":"Orzo / Lisan Asfour (dry)","ar":"لسان عصفور جاف","state":"جاف","unit":"g","cal":365,"p":13,"c":75,"f":1.5},
    {"id":9121,"en":"Orzo / Lisan Asfour (boiled)","ar":"لسان عصفور مسلوق","state":"مطبوخ","unit":"g","cal":137,"p":5,"c":27.5,"f":0.8},
    {"id":9122,"en":"Cream of Rice Powder (dry)","ar":"كريم أوف رايس بودرة","state":"جاف","unit":"g","cal":366,"p":7,"c":82,"f":0.5},
    {"id":9004,"en":"Potato (boiled)","ar":"بطاطس مسلوقة","state":"مسلوق","unit":"g","cal":87,"p":1.9,"c":20.1,"f":0.1},
    {"id":9005,"en":"Potato (baked / air-fried)","ar":"بطاطس مشوية (فرن / قلاية هوائية)","state":"مشوي","unit":"g","cal":93,"p":2.5,"c":21.2,"f":0.1},
    {"id":9003,"en":"Sweet Potato (baked)","ar":"بطاطا حلوة مشوية","state":"مشوي","unit":"g","cal":90,"p":2,"c":20.7,"f":0.2},
  ],
  "🫘 بقوليات": [
    {"id":312,"en":"Lentils (cooked)","ar":"عدس","state":"عادي","unit":"g","cal":116,"p":9,"c":20,"f":0.4},
    {"id":313,"en":"Chickpeas (cooked)","ar":"حمص","state":"عادي","unit":"g","cal":164,"p":9,"c":27,"f":2.6},
    {"id":314,"en":"Fava Beans (Ful)","ar":"فول مدمس","state":"عادي","unit":"g","cal":110,"p":8,"c":26,"f":0.5},
    {"id":9900,"en":"Chickpeas (dry)","ar":"حمص جاف","state":"جاف","unit":"g","cal":378,"p":20.5,"c":63,"f":6},
    {"id":9901,"en":"Lupini Beans (dry)","ar":"ترمس جاف","state":"جاف","unit":"g","cal":371,"p":36.2,"c":40.4,"f":9.7},
    {"id":9902,"en":"Lupini Beans (boiled)","ar":"ترمس مسلوق","state":"مسلوق","unit":"g","cal":119,"p":15.6,"c":9.9,"f":2.9},
    {"id":9903,"en":"Black-Eyed Peas (dry)","ar":"لوبيا جافة","state":"جاف","unit":"g","cal":336,"p":23.5,"c":60,"f":1.3},
    {"id":9904,"en":"Black-Eyed Peas (boiled)","ar":"لوبيا مسلوقة","state":"مسلوق","unit":"g","cal":116,"p":7.7,"c":20.8,"f":0.5},
    {"id":9905,"en":"White Beans (dry)","ar":"فاصوليا بيضاء جافة","state":"جاف","unit":"g","cal":333,"p":23.4,"c":60.3,"f":0.9},
    {"id":9906,"en":"White Beans (boiled)","ar":"فاصوليا بيضاء مسلوقة","state":"مسلوق","unit":"g","cal":139,"p":9.7,"c":25.1,"f":0.4},
    {"id":9907,"en":"Red Kidney Beans (dry)","ar":"فاصوليا حمراء جافة","state":"جاف","unit":"g","cal":333,"p":23.6,"c":60,"f":0.8},
    {"id":9908,"en":"Red Kidney Beans (boiled)","ar":"فاصوليا حمراء مسلوقة","state":"مسلوق","unit":"g","cal":127,"p":8.7,"c":22.8,"f":0.5},
    {"id":9909,"en":"Black Beans (dry)","ar":"فاصوليا سوداء جافة","state":"جاف","unit":"g","cal":341,"p":21.6,"c":62.4,"f":1.4},
    {"id":9910,"en":"Black Beans (boiled)","ar":"فاصوليا سوداء مسلوقة","state":"مسلوق","unit":"g","cal":132,"p":8.9,"c":23.7,"f":0.5},
    {"id":9911,"en":"Fava Beans (dry)","ar":"فول جاف","state":"جاف","unit":"g","cal":341,"p":26.1,"c":58.3,"f":1.5},
    {"id":9912,"en":"Whole Brown Lentils (dry)","ar":"عدس بجبة جاف","state":"جاف","unit":"g","cal":352,"p":24.6,"c":63.4,"f":1.1},
    {"id":9913,"en":"Yellow Lentils (dry)","ar":"عدس أصفر جاف","state":"جاف","unit":"g","cal":353,"p":24.4,"c":63.1,"f":1.1},
    {"id":9914,"en":"Yellow Lentils (boiled)","ar":"عدس أصفر مسلوق","state":"مسلوق","unit":"g","cal":116,"p":9,"c":20.1,"f":0.4},
    {"id":9915,"en":"Dried Peas (dry)","ar":"بسلة مجففة","state":"جاف","unit":"g","cal":341,"p":24.6,"c":60.4,"f":1.2},
    {"id":9916,"en":"Dried Peas (boiled)","ar":"بسلة مسلوقة","state":"مسلوق","unit":"g","cal":118,"p":8.3,"c":21.1,"f":0.4},
    {"id":9917,"en":"Mung Beans (dry)","ar":"فاصوليا المونج جافة","state":"جاف","unit":"g","cal":347,"p":23.9,"c":62.6,"f":1.2},
    {"id":9918,"en":"Mung Beans (boiled)","ar":"فاصوليا المونج مسلوقة","state":"مسلوق","unit":"g","cal":105,"p":7,"c":19.2,"f":0.4},
    {"id":9919,"en":"Soybeans (dry)","ar":"فول صويا جاف","state":"جاف","unit":"g","cal":446,"p":36.5,"c":30.2,"f":19.9},
    {"id":9920,"en":"Soybeans (boiled)","ar":"فول صويا مسلوق","state":"مسلوق","unit":"g","cal":173,"p":16.6,"c":9.9,"f":9},
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
    {"id":111,"en":"Sardines","ar":"سردين","state":"عادي","unit":"g","cal":185,"p":21,"c":0,"f":11},
    {"id":112,"en":"Mullet (Boori)","ar":"بوري","state":"مطبوخ","unit":"g","cal":150,"p":25.6,"c":0,"f":4.9},
    {"id":113,"en":"Mackerel","ar":"ماكريل","state":"مطبوخ","unit":"g","cal":260,"p":24,"c":0,"f":18},
    {"id":1001,"en":"Raw Chicken Breast (uncooked)","ar":"صدر دجاج نيء","state":"نيء","unit":"g","cal":120,"p":23,"c":0,"f":2.6},
    {"id":1002,"en":"Raw Chicken Thigh (uncooked)","ar":"فخذ دجاج نيء","state":"نيء","unit":"g","cal":153,"p":19,"c":0,"f":8},
    {"id":1003,"en":"Raw Ground Beef (uncooked)","ar":"لحم مفروم نيء","state":"نيء","unit":"g","cal":176,"p":20,"c":0,"f":10},
    {"id":1105,"en":"Hawawshi (lean)","ar":"حواوشي هش","state":"عادي","unit":"g","cal":200,"p":14,"c":18,"f":8},
    {"id":1107,"en":"Grilled Kofta","ar":"كفتة مشوية","state":"عادي","unit":"g","cal":164,"p":18,"c":5,"f":8},
    {"id":9921,"en":"Lean Red Meat, no fat (raw)","ar":"لحمة حمراء بدون دهون (نيئة)","state":"نيء","unit":"g","cal":120,"p":22,"c":0,"f":3},
    {"id":9922,"en":"Lean Red Meat, no fat (cooked)","ar":"لحمة حمراء بدون دهون (مستوية)","state":"مستوي","unit":"g","cal":165,"p":29,"c":0,"f":4.5},
    {"id":9923,"en":"Red Meat Cubes (raw)","ar":"مكعبات لحمة حمراء (نيئة)","state":"نيء","unit":"g","cal":143,"p":21,"c":0,"f":6},
    {"id":9924,"en":"Red Meat Cubes (cooked)","ar":"مكعبات لحمة حمراء (مستوية)","state":"مستوي","unit":"g","cal":210,"p":29,"c":0,"f":10},
    {"id":9925,"en":"Beef Burger 90/10 (cooked)","ar":"برجر لحم بقري 90% / 10% دهون (مستوي)","state":"مستوي","unit":"g","cal":217,"p":26,"c":0,"f":11.8},
    {"id":9926,"en":"Ground Beef 95/5 (cooked)","ar":"لحم مفروم 95% / 5% دهون (مستوي)","state":"مستوي","unit":"g","cal":171,"p":26.8,"c":0,"f":6.3},
    {"id":9727,"en":"Lean Ground Meat (trimmed, no fat)","ar":"لحمة مفرومة متشفية من غير دهون","state":"عادي","unit":"g","cal":153,"p":26.4,"c":0,"f":4.5},
    {"id":9729,"en":"Lean Red Meat (raw)","ar":"لحمة حمراء قليلة الدسم (نيئة)","state":"نيء","unit":"g","cal":133,"p":21.5,"c":0,"f":5},
    {"id":9730,"en":"Beef Burger 90/10 (raw)","ar":"برجر لحم بقري 90% / 10% دهون (نيء)","state":"نيء","unit":"g","cal":176,"p":20,"c":0,"f":10},
    {"id":9731,"en":"Ground Beef 95/5 (raw)","ar":"لحم مفروم 95% / 5% دهون (نيء)","state":"نيء","unit":"g","cal":137,"p":21.4,"c":0,"f":5},
    {"id":9500,"en":"Turkey Meat","ar":"فصوص تركي (Turkey Meat)","state":"عادي","unit":"g","cal":170,"p":29.3,"c":2,"f":5},
    {"id":9501,"en":"Turkey Breast, Skinless (raw)","ar":"صدر ديك رومي منزوع الجلد قبل الطهي","state":"نيء","unit":"g","cal":147,"p":30.1,"c":0,"f":2.1},
    {"id":9502,"en":"Turkey Slices","ar":"شرائح الديك الرومي","state":"شرائح","unit":"g","cal":95.5,"p":16.3,"c":3.5,"f":1.8},
    {"id":9109,"en":"Light Tuna in Oil (drained)","ar":"تونة لايت في زيت (مصفاة)","state":"مصفى","unit":"g","cal":190,"p":29,"c":0,"f":8.2},
    {"id":9110,"en":"Tuna in Oil (undrained)","ar":"تونة في زيت (غير مصفاة)","state":"غير مصفى","unit":"g","cal":226,"p":24,"c":0,"f":14.5},
    {"id":9111,"en":"Tuna in Water & Salt","ar":"تونة في ماء وملح","state":"عادي","unit":"g","cal":109,"p":25,"c":0,"f":1},
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
    {"id":211,"en":"Greek Yogurt (low-fat)","ar":"زبادي يوناني","state":"عادي","unit":"g","cal":59,"p":10,"c":4,"f":0.7},
    {"id":212,"en":"Greek Yogurt (full-fat)","ar":"زبادي يوناني كامل","state":"عادي","unit":"g","cal":97,"p":9,"c":3.6,"f":5},
    {"id":213,"en":"Rayeb Yogurt","ar":"رايب","state":"عادي","unit":"g","cal":60,"p":3.5,"c":5,"f":3},
    {"id":215,"en":"Low-Salt White Cheese (low-fat)","ar":"جبنة بيضاء قليلة الملح قليلة الدسم","state":"عادي","unit":"g","cal":170,"p":17,"c":3,"f":9},
    {"id":216,"en":"Low-Salt White Cheese (full-fat)","ar":"جبنة بيضاء قليلة الملح","state":"عادي","unit":"g","cal":248,"p":14,"c":3,"f":20},
    {"id":412,"en":"Whole Milk","ar":"حليب كامل الدسم","state":"سائل","unit":"g","cal":61,"p":3.2,"c":4.7,"f":3.6},
    {"id":413,"en":"Skim Milk","ar":"حليب خالي الدسم","state":"سائل","unit":"g","cal":36,"p":3.5,"c":5,"f":0.2},
    {"id":414,"en":"Semi-Skim Milk","ar":"حليب نصف دسم","state":"سائل","unit":"g","cal":47,"p":3.3,"c":4.8,"f":1.8},
    {"id":415,"en":"Almarai Protein Milk","ar":"حليب ألمراي بروتين","state":"سائل","unit":"g","cal":42,"p":5,"c":5,"f":0.2},
    {"id":416,"en":"Oat Milk","ar":"حليب الشوفان","state":"سائل","unit":"g","cal":45,"p":1,"c":7,"f":1.5},
    {"id":417,"en":"Almond Milk (unsweetened)","ar":"حليب لوز (بدون سكر)","state":"سائل","unit":"g","cal":20,"p":0.4,"c":1.2,"f":1.5},
    {"id":9726,"en":"Greek Yogurt with Fruits","ar":"زبادي يوناني بالفواكه","state":"عادي","unit":"g","cal":106,"p":7.3,"c":12.3,"f":3},
    {"id":9600,"en":"Qishta (Clotted Cream)","ar":"قشطة","state":"عادي","unit":"g","cal":337,"p":2.5,"c":3,"f":35},
    {"id":9601,"en":"Light Cooking Cream","ar":"كريمة طبخ لايت","state":"عادي","unit":"g","cal":160,"p":2.5,"c":4,"f":15},
    {"id":9602,"en":"Oat Cream (plant-based)","ar":"كريمة شوفان نباتية","state":"سائل","unit":"g","cal":150,"p":1,"c":6,"f":13},
    {"id":9603,"en":"Whipping Cream","ar":"كريمة خفق","state":"عادي","unit":"g","cal":340,"p":2.8,"c":2.7,"f":36},
    {"id":9604,"en":"Fat-Free Cream Cheese","ar":"جبنة كريمي منزوعة الدسم","state":"عادي","unit":"g","cal":105,"p":15.7,"c":7.7,"f":1},
    {"id":9605,"en":"Kiri Labneh Cream Cheese","ar":"لبنة كريمي (كيري)","state":"عادي","unit":"g","cal":230,"p":5.5,"c":3,"f":22},
    {"id":9606,"en":"Light Cream Cheese","ar":"جبنة كريمي لايت","state":"عادي","unit":"g","cal":208,"p":7.8,"c":8.1,"f":15.3},
    {"id":9607,"en":"Low-Fat Cream Cheese","ar":"جبنة كريمي، قليلة الدسم","state":"عادي","unit":"g","cal":208,"p":7.8,"c":6.7,"f":16.7},
    {"id":9107,"en":"Greek Yogurt (fat-free)","ar":"زبادي يوناني خالي الدسم","state":"عادي","unit":"g","cal":56,"p":10,"c":3.6,"f":0.2},
    {"id":9108,"en":"Greek Yogurt (2%)","ar":"زبادي يوناني عادي (2%)","state":"عادي","unit":"g","cal":73,"p":9.9,"c":3.9,"f":2},
    {"id":9007,"en":"Lactose-Free Milk (full fat)","ar":"حليب خالي اللاكتوز (كامل الدسم)","state":"سائل","unit":"g","cal":61,"p":3.3,"c":4.7,"f":3.5},
    {"id":9008,"en":"Lactose-Free Milk (semi-skim)","ar":"حليب خالي اللاكتوز (نصف دسم)","state":"سائل","unit":"g","cal":47,"p":3.4,"c":4.8,"f":1.6},
    {"id":9009,"en":"Lactose-Free Milk (skim)","ar":"حليب خالي اللاكتوز (خالي الدسم)","state":"سائل","unit":"g","cal":35,"p":3.5,"c":5,"f":0.1},
    {"id":9001,"en":"Roumy Cheese","ar":"جبنة رومي","state":"عادي","unit":"g","cal":350,"p":25,"c":2,"f":27},
    {"id":9002,"en":"Feta Cheese (Light)","ar":"جبنة فيتا لايت","state":"لايت","unit":"g","cal":170,"p":18,"c":4,"f":9.5},
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
    {"id":9728,"en":"Minced Molokhia","ar":"ملوخية مفرومة","state":"عادي","unit":"g","cal":68,"p":4,"c":11,"f":0.8},
    {"id":9123,"en":"Homemade Fresh Tomato Sauce","ar":"صلصة طماطم طازجة منزلية","state":"عادي","unit":"g","cal":47,"p":1.5,"c":7,"f":1.5},
  ],
  "🍎 فواكه": [
    {"id":701,"en":"Banana","ar":"موز","state":"عادي","unit":"g","cal":89,"p":1.1,"c":23,"f":0.3},
    {"id":702,"en":"Apple","ar":"تفاح","state":"عادي","unit":"g","cal":52,"p":0.3,"c":14,"f":0.2},
    {"id":703,"en":"Orange","ar":"برتقال","state":"عادي","unit":"g","cal":47,"p":0.9,"c":12,"f":0.1},
    {"id":704,"en":"Mango","ar":"مانجو","state":"عادي","unit":"g","cal":60,"p":0.8,"c":15,"f":0.4},
    {"id":705,"en":"Strawberry","ar":"فراولة","state":"عادي","unit":"g","cal":32,"p":0.7,"c":8,"f":0.3},
    {"id":706,"en":"Watermelon","ar":"بطيخ","state":"عادي","unit":"g","cal":30,"p":0.6,"c":8,"f":0.2},
    {"id":707,"en":"Grapes","ar":"عنب","state":"عادي","unit":"g","cal":69,"p":0.7,"c":18,"f":0.2},
    {"id":709,"en":"Figs","ar":"تين","state":"عادي","unit":"g","cal":74,"p":0.7,"c":19,"f":0.3},
    {"id":710,"en":"Pomegranate","ar":"رمان","state":"عادي","unit":"g","cal":83,"p":1.7,"c":19,"f":1.2},
    {"id":711,"en":"Lemon","ar":"ليمون","state":"عادي","unit":"g","cal":29,"p":1.1,"c":9,"f":0.3},
    {"id":712,"en":"Pineapple","ar":"أناناس","state":"عادي","unit":"g","cal":50,"p":0.5,"c":13,"f":0.1},
    {"id":713,"en":"Peach","ar":"خوخ","state":"عادي","unit":"g","cal":39,"p":0.9,"c":10,"f":0.3},
    {"id":714,"en":"Pear","ar":"كمثرى","state":"عادي","unit":"g","cal":57,"p":0.4,"c":15,"f":0.1},
    {"id":9700,"en":"Abu Surra Orange (Navel)","ar":"برتقال أبو سرة","state":"عادي","unit":"g","cal":47,"p":0.9,"c":11.8,"f":0.1},
    {"id":9701,"en":"Valencia Orange","ar":"برتقال فالنسيا","state":"عادي","unit":"g","cal":48,"p":1,"c":11.7,"f":0.2},
    {"id":9702,"en":"Mandarin (Yousef Effendi)","ar":"يوسفي","state":"عادي","unit":"g","cal":53,"p":0.8,"c":13.3,"f":0.3},
    {"id":9703,"en":"Lime (Green Lemon)","ar":"ليمون أخضر","state":"عادي","unit":"g","cal":30,"p":0.7,"c":10.5,"f":0.2},
    {"id":9704,"en":"Semi-Dry Dates (Balah)","ar":"بلح نصف جاف","state":"عادي","unit":"g","cal":255,"p":2,"c":62,"f":0.2},
    {"id":9705,"en":"Dried Dates","ar":"تمر جاف","state":"عادي","unit":"g","cal":282,"p":2.5,"c":75,"f":0.4},
    {"id":9706,"en":"Imported Apple","ar":"تفاح مستورد","state":"عادي","unit":"g","cal":52,"p":0.3,"c":13.8,"f":0.2},
    {"id":9707,"en":"Baladi Apple","ar":"تفاح بلدي","state":"عادي","unit":"g","cal":50,"p":0.3,"c":13,"f":0.2},
    {"id":9708,"en":"Mango (Fas)","ar":"مانجو فص","state":"عادي","unit":"g","cal":65,"p":0.8,"c":16.3,"f":0.3},
    {"id":9709,"en":"Mango (Awais)","ar":"مانجو عويس","state":"عادي","unit":"g","cal":70,"p":0.8,"c":17.5,"f":0.3},
    {"id":9710,"en":"Mango (Zibda)","ar":"مانجو زبدة","state":"عادي","unit":"g","cal":72,"p":0.8,"c":18,"f":0.3},
    {"id":9711,"en":"Mango (Owais)","ar":"مانجو أويس","state":"عادي","unit":"g","cal":68,"p":0.8,"c":17,"f":0.3},
    {"id":9712,"en":"Mango (Keitt)","ar":"مانجو كيت","state":"عادي","unit":"g","cal":60,"p":0.8,"c":15,"f":0.3},
    {"id":9713,"en":"Mango (Sukkari)","ar":"مانجو سكري","state":"عادي","unit":"g","cal":75,"p":0.8,"c":18.8,"f":0.3},
    {"id":9714,"en":"Cantaloupe","ar":"كانتالوب","state":"عادي","unit":"g","cal":34,"p":0.8,"c":8.2,"f":0.2},
    {"id":9715,"en":"Honeydew / Egyptian Melon (Shammam)","ar":"شمام","state":"عادي","unit":"g","cal":36,"p":0.5,"c":9,"f":0.1},
    {"id":9716,"en":"Red Grapes","ar":"عنب أحمر","state":"عادي","unit":"g","cal":69,"p":0.7,"c":18.1,"f":0.2},
    {"id":9717,"en":"Black Grapes","ar":"عنب أسود","state":"عادي","unit":"g","cal":70,"p":0.7,"c":18.2,"f":0.2},
    {"id":9718,"en":"Green Seedless Grapes","ar":"عنب أخضر بدون بذر","state":"عادي","unit":"g","cal":67,"p":0.7,"c":17.2,"f":0.2},
    {"id":9719,"en":"Plum","ar":"برقوق","state":"عادي","unit":"g","cal":46,"p":0.7,"c":11.4,"f":0.3},
    {"id":9720,"en":"Apricot","ar":"مشمش","state":"عادي","unit":"g","cal":48,"p":1.4,"c":11.1,"f":0.4},
    {"id":9721,"en":"Guava","ar":"جوافة","state":"عادي","unit":"g","cal":68,"p":2.6,"c":14.3,"f":1},
    {"id":9722,"en":"Persimmon (Kaki)","ar":"كاكا","state":"عادي","unit":"g","cal":70,"p":0.6,"c":18.6,"f":0.2},
    {"id":9723,"en":"Blueberries","ar":"توت أزرق","state":"عادي","unit":"g","cal":57,"p":0.7,"c":14.5,"f":0.3},
    {"id":9724,"en":"Loquat (Eskidenia)","ar":"اسكدنيا","state":"عادي","unit":"g","cal":47,"p":0.4,"c":12.1,"f":0.2},
    {"id":9200,"en":"Yellow Dates (Balah)","ar":"بلح أصفر","state":"عادي","unit":"g","cal":105,"p":1,"c":25,"f":0.2},
    {"id":9201,"en":"Red Dates (Balah)","ar":"بلح أحمر","state":"عادي","unit":"g","cal":127,"p":1.2,"c":30,"f":0.2},
    {"id":9202,"en":"Brown Dates (Balah)","ar":"بلح أسمر","state":"عادي","unit":"g","cal":175,"p":1.5,"c":42,"f":0.2},
    {"id":9203,"en":"Fresh Dates (Rutab)","ar":"تمر رطب","state":"عادي","unit":"g","cal":225,"p":1.8,"c":54,"f":0.2},
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
    {"id":9725,"en":"Peanut Butter Powder","ar":"مسحوق زبدة الفول السوداني","state":"جاف","unit":"g","cal":475,"p":48,"c":40,"f":13},
    {"id":9100,"en":"Pecans","ar":"بيكان","state":"عادي","unit":"g","cal":691,"p":9.2,"c":13.9,"f":72},
    {"id":9101,"en":"Pistachios","ar":"فستق","state":"عادي","unit":"g","cal":560,"p":20.2,"c":27.2,"f":45.3},
    {"id":9102,"en":"Hazelnuts","ar":"بندق","state":"عادي","unit":"g","cal":628,"p":15,"c":16.7,"f":60.8},
    {"id":9103,"en":"Sesame Seeds (hulled, dried)","ar":"سمسم مقشر مجفف","state":"عادي","unit":"g","cal":580,"p":17.7,"c":23.5,"f":49.7},
    {"id":9104,"en":"Sesame Oil","ar":"زيت سمسم","state":"عادي","unit":"g","cal":884,"p":0,"c":0,"f":100},
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
const nameOf = (f, withEn) => (withEn ? `${f.ar} (${f.en})` : f.ar);
const buildCopyText = (food, qty, items, withEn) =>
  `بدائل ${nameOf(food, withEn)} (${fmtQty(food, qty)}):\n` + items.map((a) => `- ${nameOf(a, withEn)}: ${fmtQty(a, a.needed)}`).join("\n");

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

function AlternativeRow({ alt, checked, onToggle, withEn }) {
  const pct = Math.min(100, Math.round((alt.needed / (isPiece(alt) ? 10 : 500)) * 100));
  const m = macrosAt(alt, alt.needed);
  return (
    <div style={{
      background: checked ? `${C.teal}10` : "#ffffff05",
      border: `1px solid ${checked ? C.teal + "88" : C.cardBorder}`,
      borderRadius: 14, padding: "12px 16px", transition: "all 0.15s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          <div>
            <span style={{ color: C.teal, fontWeight: 800, fontSize: "1.2rem" }}>{alt.needed}</span>
            <span style={{ color: C.subtext, fontSize: "0.75rem", marginRight: 3 }}>{unitEn(alt)}</span>
          </div>
          <CopyButton small getText={() => `${nameOf(alt, withEn)}: ${fmtQty(alt, alt.needed)}`} label="نسخ" />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flexDirection: "row-reverse" }}>
        <button onClick={onToggle} aria-label="تحديد البديل" style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2, cursor: "pointer", padding: 0,
          border: `1px solid ${checked ? C.teal : C.muted}`,
          background: checked ? C.teal : "transparent", color: C.bg,
          fontSize: 14, fontWeight: 900, fontFamily: "inherit",
        }}>{checked ? "✓" : ""}</button>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.text, fontSize: "0.9rem", fontWeight: 600 }}>{alt.ar}</div>
          <div style={{ color: C.muted, fontSize: "0.68rem" }} dir="ltr">{alt.en}</div>
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
  const [withEn, setWithEn] = useState(true); // إضافة الاسم الإنجليزي عند النسخ
  const [picked, setPicked] = useState([]); // بدائل محددة بالـ checkbox للنسخ
  const gramsRef = useRef(null);
  const catFoods = DB[cat];

  const handleCatChange = (c) => {
    setCat(c); setFood(DB[c][0]); setTargets([]); setPicked([]);
    setSearch(""); setSearchB(""); setGrams("");
  };
  const togglePicked = (en) =>
    setPicked((prev) => (prev.includes(en) ? prev.filter((x) => x !== en) : [...prev, en]));
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

  const pickedAlts = useMemo(() => alternatives.filter((a) => picked.includes(a.en)), [alternatives, picked]);

  const specificResults = useMemo(() => {
    if (!totalCals || !targets.length) return [];
    return targets.map((f) => ({ ...f, needed: calcQty(totalCals, f, round5) }));
  }, [totalCals, targets, round5]);

  const RoundToggle = (
    <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, color: C.subtext, fontSize: "0.78rem", cursor: "pointer" }}>
        <input type="checkbox" checked={round5} onChange={(e) => setRound5(e.target.checked)} style={{ accentColor: C.neon }} />
        تقريب الجرامات لأقرب 5 جم
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8, color: C.subtext, fontSize: "0.78rem", cursor: "pointer" }}>
        <input type="checkbox" checked={withEn} onChange={(e) => setWithEn(e.target.checked)} style={{ accentColor: C.neon }} />
        إضافة الاسم بالإنجليزي عند النسخ
      </label>
    </div>
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
            onSelect={(f) => { setFood(f); setGrams(""); setPicked([]); setTimeout(() => gramsRef.current?.focus(), 50); }}
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
                <CopyButton label="📋 نسخ كل البدائل" getText={() => buildCopyText(food, grams, alternatives, withEn)} />
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                background: "#ffffff06", border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "8px 12px", marginBottom: 10,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button onClick={() => setPicked(alternatives.map((a) => a.en))} style={{
                    background: "transparent", border: "none", color: C.teal, fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  }}>تحديد الكل</button>
                  {picked.length > 0 && (
                    <button onClick={() => setPicked([])} style={{
                      background: "transparent", border: "none", color: C.subtext, fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit",
                    }}>مسح التحديد</button>
                  )}
                </div>
                {pickedAlts.length > 0 ? (
                  <CopyButton label={`📋 نسخ المحدد (${pickedAlts.length})`} color={C.neon}
                    getText={() => buildCopyText(food, grams, pickedAlts, withEn)} />
                ) : (
                  <span style={{ color: C.muted, fontSize: "0.7rem" }}>حدد أكتر من بديل لنسخهم مرة واحدة</span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alternatives.map((alt) => (
                  <AlternativeRow key={alt.en} alt={alt} checked={picked.includes(alt.en)} onToggle={() => togglePicked(alt.en)} withEn={withEn} />
                ))}
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
                      <CopyButton small getText={() => `${nameOf(r, withEn)}: ${fmtQty(r, r.needed)}`} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: C.text, fontSize: "0.88rem", fontWeight: 600 }}>{r.ar}</div>
                      <div style={{ color: C.muted, fontSize: "0.68rem" }} dir="ltr">{r.en}</div>
                    </div>
                  </div>
                ))}
              </div>
              {RoundToggle}
              <CopyButton label="📋 نسخ كل البدائل المختارة" getText={() => buildCopyText(food, grams, specificResults, withEn)} />
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
