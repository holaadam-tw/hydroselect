// ═══════════════════════════════════════════
//  產品型錄資料庫
//  按品牌 × 元件類型組織，供型號匹配引擎查詢
// ═══════════════════════════════════════════

export const PRODUCT_CATALOG = {
  // ─── 泵 ───────────────────────────────────
  pump: {
    propiston: {
      brand: "Propiston 大正", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "P 系列柱塞泵", type: "piston", models: [
          { model: "P08V-RS-11-CC-10-J", displacement: 8,   maxPressure: 35, price: 12800 },
          { model: "P16V-RS-11-CC-10-J", displacement: 16,  maxPressure: 35, price: 16500 },
          { model: "P22V-RS-11-CC-10-J", displacement: 22,  maxPressure: 35, price: 19200 },
          { model: "P36V-RS-11-CC-10-J", displacement: 36,  maxPressure: 35, price: 24800 },
          { model: "P46V-RS-11-CC-10-J", displacement: 46,  maxPressure: 35, price: 29500 },
          { model: "P70V-RS-11-CC-10-J", displacement: 70,  maxPressure: 35, price: 38000 },
          { model: "P100V-RS-11-CC-10-J",displacement: 100, maxPressure: 35, price: 52000 },
        ]},
      ],
    },
    yuken: {
      brand: "Yuken 油研", origin: "🇯🇵 日本", grade: "premium",
      series: [
        { name: "PV2R 葉片泵", type: "vane", models: [
          { model: "PV2R1-6",   displacement: 6,   maxPressure: 21, price: null },
          { model: "PV2R1-10",  displacement: 10,  maxPressure: 21, price: null },
          { model: "PV2R1-14",  displacement: 14,  maxPressure: 21, price: null },
          { model: "PV2R1-19",  displacement: 19,  maxPressure: 21, price: null },
          { model: "PV2R1-25",  displacement: 25,  maxPressure: 21, price: null },
          { model: "PV2R2-41",  displacement: 41,  maxPressure: 21, price: null },
          { model: "PV2R2-53",  displacement: 53,  maxPressure: 21, price: null },
          { model: "PV2R3-66",  displacement: 66,  maxPressure: 21, price: null },
          { model: "PV2R3-94",  displacement: 94,  maxPressure: 21, price: null },
        ]},
        { name: "A 系列柱塞泵", type: "piston", models: [
          { model: "A10-FR01H-12",  displacement: 10,  maxPressure: 35, price: null },
          { model: "A16-FR01H-12",  displacement: 16,  maxPressure: 35, price: null },
          { model: "A22-FR01H-12",  displacement: 22,  maxPressure: 35, price: null },
          { model: "A37-FR01H-12",  displacement: 37,  maxPressure: 35, price: null },
          { model: "A56-FR01H-12",  displacement: 56,  maxPressure: 35, price: null },
          { model: "A70-FR01H-12",  displacement: 70,  maxPressure: 35, price: null },
          { model: "A90-FR01H-12",  displacement: 90,  maxPressure: 35, price: null },
          { model: "A145-FR01H-12", displacement: 145, maxPressure: 35, price: null },
        ]},
      ],
    },
    rexroth: {
      brand: "Rexroth 力士樂", origin: "🇩🇪 德國", grade: "premium",
      series: [
        { name: "A10VSO 柱塞泵", type: "piston", models: [
          { model: "A10VSO18DFR1/31R", displacement: 18,  maxPressure: 35, price: null },
          { model: "A10VSO28DFR1/31R", displacement: 28,  maxPressure: 35, price: null },
          { model: "A10VSO45DFR1/31R", displacement: 45,  maxPressure: 35, price: null },
          { model: "A10VSO71DFR1/31R", displacement: 71,  maxPressure: 35, price: null },
          { model: "A10VSO100DFR1/31R",displacement: 100, maxPressure: 35, price: null },
          { model: "A10VSO140DFR1/31R",displacement: 140, maxPressure: 35, price: null },
        ]},
      ],
    },
    parker: {
      brand: "Parker", origin: "🇺🇸 美國", grade: "premium",
      series: [
        { name: "PV 系列柱塞泵", type: "piston", models: [
          { model: "PV016R1K1T1N",  displacement: 16,  maxPressure: 35, price: null },
          { model: "PV023R1K1T1N",  displacement: 23,  maxPressure: 35, price: null },
          { model: "PV032R1K1T1N",  displacement: 32,  maxPressure: 35, price: null },
          { model: "PV046R1K1T1N",  displacement: 46,  maxPressure: 35, price: null },
          { model: "PV063R1K1T1N",  displacement: 63,  maxPressure: 35, price: null },
          { model: "PV092R1K1T1N",  displacement: 92,  maxPressure: 35, price: null },
          { model: "PV140R1K1T1N",  displacement: 140, maxPressure: 35, price: null },
          { model: "PV180R1K1T1N",  displacement: 180, maxPressure: 35, price: null },
        ]},
      ],
    },
  },

  // ─── 方向閥 ───────────────────────────────
  directionalValve: {
    propiston: {
      brand: "Propiston 大正", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "DSG 方向閥", models: [
          { model: "DSG-01-3C2-D24",  maxFlow: 40,  maxPressure: 31.5, size: "01", price: 2800 },
          { model: "DSG-01-3C4-D24",  maxFlow: 40,  maxPressure: 31.5, size: "01", price: 2800 },
          { model: "DSG-03-3C2-D24",  maxFlow: 80,  maxPressure: 31.5, size: "03", price: 4200 },
          { model: "DSG-03-3C4-D24",  maxFlow: 80,  maxPressure: 31.5, size: "03", price: 4200 },
          { model: "DSG-03-3C60-D24", maxFlow: 120, maxPressure: 31.5, size: "03", price: 5600 },
        ]},
      ],
    },
    yuken: {
      brand: "Yuken 油研", origin: "🇯🇵 日本", grade: "premium",
      series: [
        { name: "DSG 方向閥", models: [
          { model: "DSG-01-3C2-D24-N1-50", maxFlow: 40,  maxPressure: 31.5, size: "01", price: null },
          { model: "DSG-01-3C4-D24-N1-50", maxFlow: 40,  maxPressure: 31.5, size: "01", price: null },
          { model: "DSG-03-3C2-D24-N1-50", maxFlow: 80,  maxPressure: 31.5, size: "03", price: null },
          { model: "DSG-03-3C4-D24-N1-50", maxFlow: 80,  maxPressure: 31.5, size: "03", price: null },
          { model: "DSG-03-3C60-D24-50",   maxFlow: 120, maxPressure: 31.5, size: "03", price: null },
        ]},
      ],
    },
    rexroth: {
      brand: "Rexroth 力士樂", origin: "🇩🇪 德國", grade: "premium",
      series: [
        { name: "4WE 方向閥", models: [
          { model: "4WE6D6X/EG24N9K4",   maxFlow: 40,  maxPressure: 35, size: "6",  price: null },
          { model: "4WE6E6X/EG24N9K4",   maxFlow: 40,  maxPressure: 35, size: "6",  price: null },
          { model: "4WE10D3X/CG24N9K4",  maxFlow: 80,  maxPressure: 35, size: "10", price: null },
          { model: "4WE10E3X/CG24N9K4",  maxFlow: 80,  maxPressure: 35, size: "10", price: null },
          { model: "4WE10J3X/CG24N9K4",  maxFlow: 120, maxPressure: 35, size: "10", price: null },
          { model: "4WEH16J7X/6EG24N9K4",maxFlow: 250, maxPressure: 35, size: "16", price: null },
        ]},
      ],
    },
    parker: {
      brand: "Parker", origin: "🇺🇸 美國", grade: "premium",
      series: [
        { name: "D1VW 方向閥", models: [
          { model: "D1VW001CNJW",  maxFlow: 40,  maxPressure: 35, size: "D1", price: null },
          { model: "D1VW004CNJW",  maxFlow: 40,  maxPressure: 35, size: "D1", price: null },
          { model: "D1VW020BNJW",  maxFlow: 80,  maxPressure: 35, size: "D1", price: null },
          { model: "D3W001CNJW",   maxFlow: 120, maxPressure: 35, size: "D3", price: null },
          { model: "D3W004CNJW",   maxFlow: 160, maxPressure: 35, size: "D3", price: null },
          { model: "D41FHE01C1NE00",maxFlow: 250,maxPressure: 35, size: "D4", price: null },
        ]},
      ],
    },
    northman: {
      brand: "北部精機 Northman", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "SWH 方向閥", models: [
          { model: "SWH-G02-C2-D24-10", maxFlow: 40,  maxPressure: 31.5, size: "G02", price: null },
          { model: "SWH-G02-C4-D24-10", maxFlow: 40,  maxPressure: 31.5, size: "G02", price: null },
          { model: "SWH-G03-C2-D24-10", maxFlow: 80,  maxPressure: 31.5, size: "G03", price: null },
          { model: "SWH-G03-C4-D24-10", maxFlow: 80,  maxPressure: 31.5, size: "G03", price: null },
          { model: "SWH-G03-C6-D24-10", maxFlow: 120, maxPressure: 31.5, size: "G03", price: null },
        ]},
      ],
    },
  },

  // ─── 溢流閥 ───────────────────────────────
  reliefValve: {
    propiston: {
      brand: "Propiston 大正", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "BG 溢流閥", models: [
          { model: "BG-03-32",  maxFlow: 40,  maxPressure: 25, size: "03", price: 1800 },
          { model: "BG-06-32",  maxFlow: 80,  maxPressure: 25, size: "06", price: 2600 },
          { model: "BG-10-32",  maxFlow: 120, maxPressure: 25, size: "10", price: 3800 },
        ]},
      ],
    },
    yuken: {
      brand: "Yuken 油研", origin: "🇯🇵 日本", grade: "premium",
      series: [
        { name: "BSG 溢流閥", models: [
          { model: "BSG-03-2B3B-D24-48",  maxFlow: 40,  maxPressure: 25, size: "03", price: null },
          { model: "BSG-06-2B3B-D24-48",  maxFlow: 80,  maxPressure: 25, size: "06", price: null },
          { model: "BSG-10-2B3B-D24-48",  maxFlow: 120, maxPressure: 25, size: "10", price: null },
        ]},
      ],
    },
    rexroth: {
      brand: "Rexroth 力士樂", origin: "🇩🇪 德國", grade: "premium",
      series: [
        { name: "DBW 溢流閥", models: [
          { model: "DBW10B2-5X/200-6EG24N9K4",  maxFlow: 80,  maxPressure: 31.5, size: "10", price: null },
          { model: "DBW20B2-5X/200-6EG24N9K4",  maxFlow: 160, maxPressure: 31.5, size: "20", price: null },
          { model: "DBW30B2-5X/200-6EG24N9K4",  maxFlow: 250, maxPressure: 31.5, size: "30", price: null },
        ]},
      ],
    },
    northman: {
      brand: "北部精機 Northman", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "SRCG 溢流閥", models: [
          { model: "SRCG-03-A-50", maxFlow: 40,  maxPressure: 25, size: "03", price: null },
          { model: "SRCG-06-A-50", maxFlow: 80,  maxPressure: 25, size: "06", price: null },
          { model: "SRCG-10-A-50", maxFlow: 120, maxPressure: 25, size: "10", price: null },
        ]},
      ],
    },
  },

  // ─── 油壓缸 ───────────────────────────────
  cylinder: {
    propiston: {
      brand: "Propiston 大正", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "MOB 標準缸", models: [
          { model: "MOB-40-25-200",  bore: 40,  rod: 25, maxStroke: 1000, maxPressure: 16, price: 3200 },
          { model: "MOB-50-30-200",  bore: 50,  rod: 30, maxStroke: 1000, maxPressure: 16, price: 3800 },
          { model: "MOB-63-35-200",  bore: 63,  rod: 35, maxStroke: 1200, maxPressure: 16, price: 4500 },
          { model: "MOB-80-45-200",  bore: 80,  rod: 45, maxStroke: 1500, maxPressure: 16, price: 5800 },
          { model: "MOB-100-55-200", bore: 100, rod: 55, maxStroke: 2000, maxPressure: 16, price: 7500 },
          { model: "MOB-125-70-200", bore: 125, rod: 70, maxStroke: 2000, maxPressure: 16, price: 9800 },
          { model: "MOB-160-90-200", bore: 160, rod: 90, maxStroke: 2500, maxPressure: 16, price: 14500 },
          { model: "MOB-200-110-200",bore: 200, rod: 110,maxStroke: 3000, maxPressure: 16, price: 21000 },
          { model: "MOB-250-140-200",bore: 250, rod: 140,maxStroke: 3000, maxPressure: 16, price: 32000 },
        ]},
        { name: "HOB 高壓缸", models: [
          { model: "HOB-40-25-200",  bore: 40,  rod: 25, maxStroke: 1000, maxPressure: 25, price: 4800 },
          { model: "HOB-50-30-200",  bore: 50,  rod: 30, maxStroke: 1000, maxPressure: 25, price: 5600 },
          { model: "HOB-63-35-200",  bore: 63,  rod: 35, maxStroke: 1200, maxPressure: 25, price: 6800 },
          { model: "HOB-80-45-200",  bore: 80,  rod: 45, maxStroke: 1500, maxPressure: 25, price: 8500 },
          { model: "HOB-100-55-200", bore: 100, rod: 55, maxStroke: 2000, maxPressure: 25, price: 11000 },
          { model: "HOB-125-70-200", bore: 125, rod: 70, maxStroke: 2000, maxPressure: 25, price: 14800 },
          { model: "HOB-160-90-200", bore: 160, rod: 90, maxStroke: 2500, maxPressure: 25, price: 22000 },
          { model: "HOB-200-110-200",bore: 200, rod: 110,maxStroke: 3000, maxPressure: 25, price: 32000 },
          { model: "HOB-250-140-200",bore: 250, rod: 140,maxStroke: 3000, maxPressure: 25, price: 48000 },
        ]},
      ],
    },
    yuken: {
      brand: "Yuken 油研", origin: "🇯🇵 日本", grade: "premium",
      series: [
        { name: "CHS 高精度缸", models: [
          { model: "CHS-40-25-200-CB", bore: 40,  rod: 25, maxStroke: 1000, maxPressure: 21, price: null },
          { model: "CHS-50-30-200-CB", bore: 50,  rod: 30, maxStroke: 1000, maxPressure: 21, price: null },
          { model: "CHS-63-35-200-CB", bore: 63,  rod: 35, maxStroke: 1200, maxPressure: 21, price: null },
          { model: "CHS-80-45-200-CB", bore: 80,  rod: 45, maxStroke: 1500, maxPressure: 21, price: null },
          { model: "CHS-100-55-200-CB",bore: 100, rod: 55, maxStroke: 2000, maxPressure: 21, price: null },
          { model: "CHS-125-70-200-CB",bore: 125, rod: 70, maxStroke: 2000, maxPressure: 21, price: null },
          { model: "CHS-160-90-200-CB",bore: 160, rod: 90, maxStroke: 2500, maxPressure: 21, price: null },
          { model: "CHS-200-110-200-CB",bore: 200,rod: 110,maxStroke: 3000, maxPressure: 21, price: null },
        ]},
      ],
    },
    parker: {
      brand: "Parker", origin: "🇺🇸 美國", grade: "premium",
      series: [
        { name: "2H 系列缸", models: [
          { model: "2H-40-25-200-NFPA",  bore: 40,  rod: 25, maxStroke: 1000, maxPressure: 25, price: null },
          { model: "2H-50-30-200-NFPA",  bore: 50,  rod: 30, maxStroke: 1500, maxPressure: 25, price: null },
          { model: "2H-63-35-200-NFPA",  bore: 63,  rod: 35, maxStroke: 1500, maxPressure: 25, price: null },
          { model: "2H-80-45-200-NFPA",  bore: 80,  rod: 45, maxStroke: 2000, maxPressure: 25, price: null },
          { model: "2H-100-55-200-NFPA", bore: 100, rod: 55, maxStroke: 2500, maxPressure: 25, price: null },
          { model: "2H-125-70-200-NFPA", bore: 125, rod: 70, maxStroke: 3000, maxPressure: 25, price: null },
          { model: "2H-160-90-200-NFPA", bore: 160, rod: 90, maxStroke: 3000, maxPressure: 25, price: null },
          { model: "2H-200-110-200-NFPA",bore: 200, rod: 110,maxStroke: 3500, maxPressure: 25, price: null },
        ]},
      ],
    },
  },

  // ─── 電機 ───────────────────────────────
  motor: {
    inovance: {
      brand: "匯川 Inovance", origin: "🇨🇳 中國", grade: "standard",
      series: [
        { name: "MS1 伺服電機 + IS620P 驅動", isServo: true, models: [
          { model: "MS1H1-05B30CB",  power_kW: 0.5,  ratedTorque_Nm: 1.59,  ratedRpm: 3000, servoDriver: "IS620PT0R4I", price: null },
          { model: "MS1H1-10B30CB",  power_kW: 1.0,  ratedTorque_Nm: 3.18,  ratedRpm: 3000, servoDriver: "IS620PT1R0I", price: null },
          { model: "MS1H1-20B30CB",  power_kW: 2.0,  ratedTorque_Nm: 6.37,  ratedRpm: 3000, servoDriver: "IS620PT2R0I", price: null },
          { model: "MS1H3-30B30CB",  power_kW: 3.0,  ratedTorque_Nm: 9.55,  ratedRpm: 3000, servoDriver: "IS620PT3R0I", price: null },
          { model: "MS1H3-55B30CB",  power_kW: 5.5,  ratedTorque_Nm: 17.5,  ratedRpm: 3000, servoDriver: "IS620PT5R5I", price: null },
          { model: "MS1H3-75B30CB",  power_kW: 7.5,  ratedTorque_Nm: 23.9,  ratedRpm: 3000, servoDriver: "IS620PT7R5I", price: null },
          { model: "MS1H4-11B20CB",  power_kW: 11,   ratedTorque_Nm: 52.5,  ratedRpm: 2000, servoDriver: "IS820N011I",  price: null },
          { model: "MS1H4-15B20CB",  power_kW: 15,   ratedTorque_Nm: 71.6,  ratedRpm: 2000, servoDriver: "IS820N015I",  price: null },
          { model: "MS1H4-22B20CB",  power_kW: 22,   ratedTorque_Nm: 105,   ratedRpm: 2000, servoDriver: "IS820N022I",  price: null },
          { model: "MS1H4-30B15CB",  power_kW: 30,   ratedTorque_Nm: 143,   ratedRpm: 2000, servoDriver: "IS820N030I",  price: null },
          { model: "MS1H4-37B15CB",  power_kW: 37,   ratedTorque_Nm: 176,   ratedRpm: 2000, servoDriver: "IS820N037I",  price: null },
          { model: "MS1H4-45B15CB",  power_kW: 45,   ratedTorque_Nm: 215,   ratedRpm: 2000, servoDriver: "IS820N045I",  price: null },
          { model: "MS1H4-55B15CB",  power_kW: 55,   ratedTorque_Nm: 263,   ratedRpm: 2000, servoDriver: "IS820N055I",  price: null },
        ]},
      ],
    },
    delta: {
      brand: "台達 Delta", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "ASDA-B3 伺服", isServo: true, models: [
          { model: "ECMA-C30401ES", power_kW: 0.4,  ratedTorque_Nm: 1.27,  ratedRpm: 3000, servoDriver: "ASD-B3-0421-E", price: null },
          { model: "ECMA-C30602ES", power_kW: 0.6,  ratedTorque_Nm: 1.91,  ratedRpm: 3000, servoDriver: "ASD-B3-0721-E", price: null },
          { model: "ECMA-C31010ES", power_kW: 1.0,  ratedTorque_Nm: 3.18,  ratedRpm: 3000, servoDriver: "ASD-B3-1021-E", price: null },
          { model: "ECMA-C31020ES", power_kW: 2.0,  ratedTorque_Nm: 6.37,  ratedRpm: 3000, servoDriver: "ASD-B3-2021-E", price: null },
          { model: "ECMA-L31830ES", power_kW: 3.0,  ratedTorque_Nm: 14.3,  ratedRpm: 2000, servoDriver: "ASD-B3-3023-E", price: null },
          { model: "ECMA-L31855ES", power_kW: 5.5,  ratedTorque_Nm: 26.3,  ratedRpm: 2000, servoDriver: "ASD-B3-5523-E", price: null },
          { model: "ECMA-L31875ES", power_kW: 7.5,  ratedTorque_Nm: 35.8,  ratedRpm: 2000, servoDriver: "ASD-B3-7523-E", price: null },
        ]},
      ],
    },
    yaskawa: {
      brand: "安川 Yaskawa", origin: "🇯🇵 日本", grade: "premium",
      series: [
        { name: "SGM7G 伺服", isServo: true, models: [
          { model: "SGM7G-04A",  power_kW: 0.4,  ratedTorque_Nm: 1.27,  ratedRpm: 3000, servoDriver: "SGD7S-R70A",  price: null },
          { model: "SGM7G-09A",  power_kW: 0.85, ratedTorque_Nm: 2.7,   ratedRpm: 3000, servoDriver: "SGD7S-R90A",  price: null },
          { model: "SGM7G-20A",  power_kW: 2.0,  ratedTorque_Nm: 6.37,  ratedRpm: 3000, servoDriver: "SGD7S-200A",  price: null },
          { model: "SGM7G-44A",  power_kW: 4.4,  ratedTorque_Nm: 14.0,  ratedRpm: 3000, servoDriver: "SGD7S-470A",  price: null },
          { model: "SGM7G-75A",  power_kW: 7.5,  ratedTorque_Nm: 23.9,  ratedRpm: 3000, servoDriver: "SGD7S-750A",  price: null },
          { model: "SGM7G-13A",  power_kW: 11,   ratedTorque_Nm: 52.5,  ratedRpm: 2000, servoDriver: "SGD7S-120A0A",price: null },
          { model: "SGM7G-20A0A",power_kW: 15,   ratedTorque_Nm: 71.6,  ratedRpm: 2000, servoDriver: "SGD7S-180A0A",price: null },
          { model: "SGM7G-30A0A",power_kW: 22,   ratedTorque_Nm: 105,   ratedRpm: 2000, servoDriver: "SGD7S-230A0A",price: null },
          { model: "SGM7G-44A0A",power_kW: 37,   ratedTorque_Nm: 176,   ratedRpm: 2000, servoDriver: "SGD7S-400A0A",price: null },
          { model: "SGM7G-55A0A",power_kW: 55,   ratedTorque_Nm: 263,   ratedRpm: 2000, servoDriver: "SGD7S-550A0A",price: null },
        ]},
      ],
    },
    parker_motor: {
      brand: "Parker", origin: "🇺🇸 美國", grade: "premium",
      series: [
        { name: "GVM 伺服電機", isServo: true, models: [
          { model: "GVM070-050A",  power_kW: 0.5,  ratedTorque_Nm: 1.6,   ratedRpm: 3000, servoDriver: "AC890-Series", price: null },
          { model: "GVM070-100A",  power_kW: 1.0,  ratedTorque_Nm: 3.2,   ratedRpm: 3000, servoDriver: "AC890-Series", price: null },
          { model: "GVM142-030A",  power_kW: 3.0,  ratedTorque_Nm: 9.6,   ratedRpm: 3000, servoDriver: "AC890-Series", price: null },
          { model: "GVM142-055A",  power_kW: 5.5,  ratedTorque_Nm: 17.5,  ratedRpm: 3000, servoDriver: "AC890-Series", price: null },
          { model: "GVM210-075A",  power_kW: 7.5,  ratedTorque_Nm: 35.8,  ratedRpm: 2000, servoDriver: "AC890-Series", price: null },
          { model: "GVM210-110A",  power_kW: 11,   ratedTorque_Nm: 52.5,  ratedRpm: 2000, servoDriver: "AC890-Series", price: null },
          { model: "GVM210-150A",  power_kW: 15,   ratedTorque_Nm: 71.6,  ratedRpm: 2000, servoDriver: "AC890-Series", price: null },
          { model: "GVM310-220A",  power_kW: 22,   ratedTorque_Nm: 105,   ratedRpm: 2000, servoDriver: "AC890-Series", price: null },
          { model: "GVM310-370A",  power_kW: 37,   ratedTorque_Nm: 176,   ratedRpm: 2000, servoDriver: "AC890-Series", price: null },
        ]},
      ],
    },
    teco: {
      brand: "東元 TECO", origin: "🇹🇼 台灣", grade: "standard",
      series: [
        { name: "AEEF IE3 感應電機", isServo: false, models: [
          { model: "AEEF-0.75-4P",  power_kW: 0.75, ratedTorque_Nm: 4.9,   ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-1.1-4P",   power_kW: 1.1,  ratedTorque_Nm: 7.2,   ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-1.5-4P",   power_kW: 1.5,  ratedTorque_Nm: 9.9,   ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-2.2-4P",   power_kW: 2.2,  ratedTorque_Nm: 14.5,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-3.7-4P",   power_kW: 3.7,  ratedTorque_Nm: 24.4,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-5.5-4P",   power_kW: 5.5,  ratedTorque_Nm: 36.2,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-7.5-4P",   power_kW: 7.5,  ratedTorque_Nm: 49.4,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-11-4P",    power_kW: 11,   ratedTorque_Nm: 72.4,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-15-4P",    power_kW: 15,   ratedTorque_Nm: 98.7,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-18.5-4P",  power_kW: 18.5, ratedTorque_Nm: 121.8, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-22-4P",    power_kW: 22,   ratedTorque_Nm: 144.8, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-30-4P",    power_kW: 30,   ratedTorque_Nm: 197.4, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-37-4P",    power_kW: 37,   ratedTorque_Nm: 243.6, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-45-4P",    power_kW: 45,   ratedTorque_Nm: 296.1, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "AEEF-55-4P",    power_kW: 55,   ratedTorque_Nm: 361.9, ratedRpm: 1450, servoDriver: null, price: null },
        ]},
      ],
    },
    chint: {
      brand: "正泰 CHINT", origin: "🇨🇳 中國", grade: "economy",
      series: [
        { name: "YE3 感應電機", isServo: false, models: [
          { model: "YE3-80M1-4",   power_kW: 0.55, ratedTorque_Nm: 3.6,   ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-80M2-4",   power_kW: 0.75, ratedTorque_Nm: 4.9,   ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-90S-4",    power_kW: 1.1,  ratedTorque_Nm: 7.2,   ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-90L-4",    power_kW: 1.5,  ratedTorque_Nm: 9.9,   ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-100L1-4",  power_kW: 2.2,  ratedTorque_Nm: 14.5,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-112M-4",   power_kW: 4.0,  ratedTorque_Nm: 26.3,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-132S-4",   power_kW: 5.5,  ratedTorque_Nm: 36.2,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-132M-4",   power_kW: 7.5,  ratedTorque_Nm: 49.4,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-160M-4",   power_kW: 11,   ratedTorque_Nm: 72.4,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-160L-4",   power_kW: 15,   ratedTorque_Nm: 98.7,  ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-180M-4",   power_kW: 18.5, ratedTorque_Nm: 121.8, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-180L-4",   power_kW: 22,   ratedTorque_Nm: 144.8, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-200L-4",   power_kW: 30,   ratedTorque_Nm: 197.4, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-225S-4",   power_kW: 37,   ratedTorque_Nm: 243.6, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-225M-4",   power_kW: 45,   ratedTorque_Nm: 296.1, ratedRpm: 1450, servoDriver: null, price: null },
          { model: "YE3-250M-4",   power_kW: 55,   ratedTorque_Nm: 361.9, ratedRpm: 1450, servoDriver: null, price: null },
        ]},
      ],
    },
  },
};
