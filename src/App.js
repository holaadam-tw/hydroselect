import { useState } from "react";

// ═══════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════
const STD_BORES = [32,40,50,63,80,100,125,160,200,250];
const STD_DISP  = [2.5,4,6,10,14,16,25,32,40,50,63,80,100];
const STD_KW    = [0.75,1.1,1.5,2.2,3,4,5.5,7.5,11,15,18.5,22,30,37,45,55];
const STD_VFLOW = [10,20,40,60,80,120,160,250];

const APPS = [
  { id:"blowing",  label:"吹瓶機",  icon:"🫧",
    vals:{ force_kN:15, pressure_MPa:16, speed_mmps:80, stroke_mm:300, bore_mm:0, positioning_mm:0.5, duty:"servo", load_s:2, rest_s:1, torque_Nm:0, power_kW:0, motor_type:"servo" }},
  { id:"cutting",  label:"裁斷機",  icon:"✂️",
    vals:{ force_kN:30, pressure_MPa:20, speed_mmps:50, stroke_mm:200, bore_mm:0, positioning_mm:5, duty:"constant", load_s:3, rest_s:5, torque_Nm:0, power_kW:0, motor_type:"async" }},
  { id:"bending",  label:"彎管機",  icon:"〰️",
    vals:{ force_kN:50, pressure_MPa:18, speed_mmps:30, stroke_mm:500, bore_mm:0, positioning_mm:0.3, duty:"servo", load_s:5, rest_s:3, torque_Nm:0, power_kW:0, motor_type:"servo" }},
  { id:"custom",   label:"自定義",  icon:"⚙️",
    vals:{ force_kN:"", pressure_MPa:14, speed_mmps:"", stroke_mm:"", bore_mm:0, positioning_mm:5, duty:"constant", load_s:"", rest_s:"", torque_Nm:"", power_kW:"", motor_type:"async" }},
];

const BRANDS = {
  cyl:[
    {name:"SHAKO 鑫祿",  origin:"🇹🇼 台灣", series:"MOB/MFC",    grade:"economy",  note:"交期短，CP值高"},
    {name:"Mindman 金器", origin:"🇹🇼 台灣", series:"MCMI/MCK2",  grade:"standard", note:"ISO認證，品質穩定"},
    {name:"Yuken 油研",   origin:"🇯🇵 日本", series:"CH/CHS",     grade:"premium",  note:"高壓高精度，壽命長"},
    {name:"Parker",       origin:"🇺🇸 美國", series:"2H/Series2", grade:"premium",  note:"NFPA標準，全球備件"},
    {name:"華德 Huade",   origin:"🇨🇳 中國", series:"MOB/HOB",    grade:"economy",  note:"低成本，供貨穩定"},
  ],
  pump:[
    {name:"Anson 安頌",   origin:"🇹🇼 台灣", series:"PVF 葉片泵",    grade:"standard", note:"台灣葉片泵龍頭"},
    {name:"Chaite 柴特",  origin:"🇹🇼 台灣", series:"CVP/IPV",       grade:"standard", note:"結構簡單維護便利"},
    {name:"Yuken 油研",   origin:"🇯🇵 日本", series:"PV2R/A柱塞泵",  grade:"premium",  note:"靜音低脈動，業界標竿"},
    {name:"Parker",       origin:"🇺🇸 美國", series:"PV/PGP",        grade:"premium",  note:"高壓精密系統最佳"},
    {name:"華德 Huade",   origin:"🇨🇳 中國", series:"A10V/CBQ齒輪泵",grade:"economy",  note:"仿力士樂規格"},
  ],
  motor:[
    {name:"東元 TECO",    origin:"🇹🇼 台灣", series:"AEEF IE3",    grade:"standard", note:"台灣電機龍頭，IE3節能", servo:false},
    {name:"台達 Delta",   origin:"🇹🇼 台灣", series:"ASDA-B3",     grade:"standard", note:"台灣伺服，CP值高",     servo:true},
    {name:"安川 Yaskawa", origin:"🇯🇵 日本", series:"Σ-7",         grade:"premium",  note:"頂級伺服，閉環首選",   servo:true},
    {name:"Parker",       origin:"🇺🇸 美國", series:"GVM/MPP",     grade:"premium",  note:"歐美高端，精密液壓",   servo:true},
    {name:"正泰 CHINT",   origin:"🇨🇳 中國", series:"YE3",         grade:"economy",  note:"大陸主流，低成本",     servo:false},
  ],
  valve:[
    {name:"北部精機 Northman",origin:"🇹🇼 台灣",series:"SWH/SRCG",   grade:"standard",note:"台灣閥件龍頭"},
    {name:"全懋 CML",         origin:"🇹🇼 台灣",series:"WH/FR",      grade:"standard",note:"交期快，通用性強"},
    {name:"Yuken 油研",       origin:"🇯🇵 日本",series:"DSG/BSG",    grade:"premium", note:"低洩漏，高重複精度"},
    {name:"Parker",           origin:"🇺🇸 美國",series:"D1VW/D3W",   grade:"premium", note:"壽命極長，嚴苛環境"},
    {name:"華德 Huade",       origin:"🇨🇳 中國",series:"4WE/DBW",    grade:"economy", note:"仿力士樂，大陸主流"},
  ],
};

const GRADE_CLR = {economy:"#64748b",standard:"#f59e0b",premium:"#818cf8"};
const GRADE_LBL = {economy:"預算型",standard:"標準型",premium:"旗艦型"};
const TABS = [
  {id:"cyl",   label:"油壓缸", icon:"⬛"},
  {id:"pump",  label:"油壓泵", icon:"🔄"},
  {id:"motor", label:"電機",   icon:"⚡"},
  {id:"valve", label:"閥件",   icon:"🎛"},
  {id:"report",label:"總報告", icon:"📋"},
];

// ═══════════════════════════════════════════
//  CALC ENGINE
// ═══════════════════════════════════════════
function roundUp(arr, v){ return arr.find(x=>x>=v)??arr[arr.length-1]; }

function calcSystem(p){
  const isServo  = p.motor_type === "servo";
  const F_N      = Number(p.force_kN)*1000;
  const Pmpa     = Number(p.pressure_MPa);
  const eta_m=.95,eta_v=.92,eta_p=.88,eta_e=.93;

  // 缸
  let bore, rod;
  if(p.bore_mm && Number(p.bore_mm)>0){
    bore = Number(p.bore_mm);
  } else {
    const D_req = Math.sqrt(4*F_N/(Math.PI*Pmpa*1e6*eta_m))*1000;
    bore = roundUp(STD_BORES, D_req);
  }
  rod = Math.round(bore*0.56/5)*5;
  const A_act  = Math.PI*(bore/1000)**2/4;
  const Q_cyl  = A_act*(Number(p.speed_mmps)/1000)*60*1000;
  const P_work = F_N/(A_act*eta_m)/1e6;

  // 泵
  const Q_pump_req = Q_cyl/eta_v;
  const disp_req   = Q_pump_req*1000/1450;
  const disp       = roundUp(STD_DISP, disp_req);
  const Q_pump     = disp*1450/1000;
  const P_hyd      = Q_pump_req*Pmpa/60;
  const P_shaft    = P_hyd/eta_p;

  // 電機
  let motor_kW;
  if(isServo && Number(p.power_kW)>0){
    motor_kW = roundUp(STD_KW, Number(p.power_kW));
  } else {
    motor_kW = roundUp(STD_KW, P_shaft/eta_e);
  }

  // 負載率
  const load_s = Number(p.load_s)||0;
  const rest_s = Number(p.rest_s)||0;
  const duty_pct = (load_s+rest_s)>0 ? Math.round(load_s/(load_s+rest_s)*100) : 100;

  // 閥
  const vQ     = roundUp(STD_VFLOW, Q_pump*1.2);
  const vP     = Math.ceil(Pmpa*1.3);
  const vRelief= (Pmpa+2).toFixed(1);

  return {
    cyl:{bore,rod,stroke:Number(p.stroke_mm),Q:Q_cyl.toFixed(1),P_work:P_work.toFixed(2),util:((P_work/Pmpa)*100).toFixed(0)},
    pump:{disp,rpm:1450,Q:Q_pump.toFixed(1),power:P_shaft.toFixed(2)},
    motor:{kW:motor_kW,isServo,rpm:isServo?"變速":"1450",duty_pct,torque:Number(p.torque_Nm)||0},
    valve:{Q:vQ,P:vP,relief:vRelief,Qsys:Q_pump_req.toFixed(1)},
    meta:{pressure:Pmpa,flow:Q_pump_req.toFixed(1)},
  };
}

// ═══════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════
const C = {
  bg:"#080b0e", panel:"#0d1117", border:"#1c2127",
  text:"#cbd5e1", muted:"#475569", accent:"#f59e0b",
  blue:"#38bdf8", purple:"#818cf8", red:"#f87171", green:"#34d399",
};
const S = {
  root:    {fontFamily:"'Noto Sans TC','PingFang TC',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",flexDirection:"column"},
  header:  {background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  logo:    {fontSize:18,fontWeight:800,color:C.accent,letterSpacing:".04em"},
  sub:     {fontSize:10,color:C.muted,letterSpacing:".12em",textTransform:"uppercase",marginTop:2},
  body:    {maxWidth:1000,margin:"0 auto",width:"100%",padding:"0 20px 60px"},

  // App selector
  appRow:  {display:"flex",gap:10,margin:"24px 0 20px"},
  appBtn:  (active)=>({flex:1,padding:"14px 8px",background:active?`${C.accent}18`:C.panel,border:`1px solid ${active?C.accent:C.border}`,borderRadius:10,cursor:"pointer",color:active?C.accent:C.muted,fontWeight:active?800:400,fontSize:13,transition:"all .18s",textAlign:"center"}),
  appIcon: {fontSize:24,display:"block",marginBottom:6},

  // Section
  section: {background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px",marginBottom:16},
  secTitle:{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:C.accent,marginBottom:18,display:"flex",alignItems:"center",gap:8},
  grid2:   {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px 24px"},
  grid3:   {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"14px 24px"},
  grid4:   {display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"14px 24px"},

  // Field
  field:   {display:"flex",flexDirection:"column",gap:6},
  label:   {fontSize:11,color:C.muted,letterSpacing:".06em",display:"flex",alignItems:"center",gap:4},
  req:     {color:C.accent,fontSize:13},
  inp:     {background:"#0a0d10",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:14,outline:"none",width:"100%",fontVariantNumeric:"tabular-nums"},
  unit:    {fontSize:11,color:C.muted,marginTop:2},
  segRow:  {display:"flex",gap:0,borderRadius:8,overflow:"hidden",border:`1px solid ${C.border}`},
  segBtn:  (active,clr)=>({flex:1,padding:"9px 0",background:active?`${clr||C.accent}22`:"transparent",border:"none",color:active?(clr||C.accent):C.muted,fontWeight:active?700:400,fontSize:13,cursor:"pointer",transition:"all .15s"}),
  divider: {borderLeft:`1px solid ${C.border}`},
  hint:    {fontSize:11,color:C.muted,fontStyle:"italic"},

  // CTA
  cta:     {display:"flex",justifyContent:"flex-end",marginTop:8},
  calcBtn: (ok)=>({background:ok?C.accent:"#1c2127",color:ok?"#000":C.muted,border:"none",borderRadius:10,padding:"13px 36px",fontSize:15,fontWeight:800,cursor:ok?"pointer":"not-allowed",letterSpacing:".03em",transition:"all .2s"}),

  // Result
  sysBar:  {display:"flex",gap:0,background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,margin:"20px 0",overflow:"hidden",flexWrap:"wrap"},
  sysItem: {flex:1,minWidth:120,padding:"16px 20px",borderRight:`1px solid ${C.border}`},
  sysVal:  {fontSize:22,fontWeight:800,color:C.accent,fontVariantNumeric:"tabular-nums"},
  sysKey:  {fontSize:10,color:C.muted,letterSpacing:".08em",textTransform:"uppercase",marginTop:3},
  tabRow:  {display:"flex",gap:4,borderBottom:`1px solid ${C.border}`,marginBottom:20},
  tabBtn:  (a)=>({background:"transparent",border:"none",borderBottom:`2px solid ${a?C.accent:"transparent"}`,padding:"10px 16px",color:a?C.accent:C.muted,fontWeight:a?700:400,fontSize:13,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}),
  specCard:{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px",marginBottom:14},
  specGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:18},
  specItem:{display:"flex",flexDirection:"column",gap:4},
  specVal: {fontSize:26,fontWeight:800,color:C.text,fontVariantNumeric:"tabular-nums"},
  specUnit:{fontSize:11,color:C.accent},
  specKey: {fontSize:11,color:C.muted},
  alertBox:(c)=>({background:`${c}14`,border:`1px solid ${c}44`,borderRadius:8,padding:"10px 14px",fontSize:13,color:c,marginBottom:12}),
  gradeRow:{display:"flex",gap:8,marginBottom:14,alignItems:"center"},
  gradeBtn:(a,c)=>({background:a?`${c}22`:"transparent",border:`1px solid ${a?c:C.border}`,borderRadius:8,padding:"5px 14px",color:a?c:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}),
  table:   {width:"100%",borderCollapse:"collapse",fontSize:13},
  th:      {textAlign:"left",padding:"9px 12px",color:C.muted,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`},
  td:      {padding:"11px 12px",borderBottom:`1px solid ${C.border}`,verticalAlign:"middle"},
  tag:     (g)=>({display:"inline-block",padding:"2px 8px",borderRadius:4,background:`${GRADE_CLR[g]}18`,color:GRADE_CLR[g],fontSize:11,fontWeight:700}),
  backBtn: {background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"7px 16px",fontSize:12,cursor:"pointer"},
  flowStep:{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10,padding:"12px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`},
  stepNum: {background:C.accent,color:"#000",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0},
};

// ═══════════════════════════════════════════
//  RESULT COMPONENTS
// ═══════════════════════════════════════════
function BrandTable({type,filterServo,grade}){
  const list = BRANDS[type].filter(b=>{
    if(b.grade!==grade) return false;
    if(filterServo!==undefined) return b.servo===filterServo;
    return true;
  });
  if(!list.length) return <div style={{color:C.muted,fontSize:13,padding:12}}>此等級無對應品牌，請選擇其他等級。</div>;
  return(
    <table style={S.table}>
      <thead><tr><th style={S.th}>品牌</th><th style={S.th}>原產地</th><th style={S.th}>系列</th><th style={S.th}>等級</th><th style={S.th}>特點</th></tr></thead>
      <tbody>
        {list.map((b,i)=>(
          <tr key={i} style={{background:i%2?"#0a0d10":"transparent"}}>
            <td style={{...S.td,fontWeight:700,color:"#e2e8f0"}}>{b.name}</td>
            <td style={{...S.td,color:"#94a3b8"}}>{b.origin}</td>
            <td style={{...S.td,color:C.muted,fontSize:12}}>{b.series}</td>
            <td style={S.td}><span style={S.tag(b.grade)}>{GRADE_LBL[b.grade]}</span></td>
            <td style={{...S.td,color:"#94a3b8",fontSize:12}}>{b.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ═══════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════
export default function App(){
  const [phase, setPhase]  = useState("form");
  const [appId, setAppId]  = useState("custom");
  const [grade, setGrade]  = useState("standard");
  const [tab,   setTab]    = useState("cyl");
  const [res,   setRes]    = useState(null);
  const [params,setParams] = useState(null);

  // Form state
  const defApp = APPS.find(a=>a.id==="custom").vals;
  const [f, setF] = useState({...defApp});

  const applyApp = (id)=>{
    setAppId(id);
    const app = APPS.find(a=>a.id===id);
    setF({...app.vals});
  };

  const setVal = (k,v)=>setF(prev=>({...prev,[k]:v}));

  const canCalc = f.force_kN!==""&&f.pressure_MPa!==""&&f.speed_mmps!==""&&f.stroke_mm!=="";

  const doCalc = ()=>{
    if(!canCalc) return;
    const r = calcSystem(f);
    setParams(f);
    setRes(r);
    setPhase("result");
    setTab("cyl");
  };

  // ── FORM ──
  if(phase==="form") return(
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus{border-color:${C.accent}!important;outline:none}
        input[type=number]::-webkit-inner-spin-button{opacity:.4}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1c2127;border-radius:2px}
      `}</style>
      <div style={S.header}>
        <div>
          <div style={S.logo}>⚙ HydroSelect</div>
          <div style={S.sub}>液壓系統智能選型平台</div>
        </div>
      </div>

      <div style={S.body}>

        {/* App Presets */}
        <div style={{marginTop:24,marginBottom:4}}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>應用場景快速套入</div>
          <div style={S.appRow}>
            {APPS.map(a=>(
              <button key={a.id} style={S.appBtn(appId===a.id)} onClick={()=>applyApp(a.id)}>
                <span style={S.appIcon}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: 油壓缸 */}
        <div style={S.section}>
          <div style={S.secTitle}><span>⬛</span> 油壓缸參數</div>
          <div style={S.grid4}>
            <div style={S.field}>
              <label style={S.label}>推力 <span style={S.req}>*</span></label>
              <input style={S.inp} type="number" placeholder="例：30" value={f.force_kN} onChange={e=>setVal("force_kN",e.target.value)} />
              <span style={S.unit}>kN（1噸 ≈ 9.8 kN）</span>
            </div>
            <div style={S.field}>
              <label style={S.label}>工作壓力 <span style={S.req}>*</span></label>
              <input style={S.inp} type="number" placeholder="例：14" value={f.pressure_MPa} onChange={e=>setVal("pressure_MPa",e.target.value)} />
              <span style={S.unit}>MPa（常用 10~21 MPa）</span>
            </div>
            <div style={S.field}>
              <label style={S.label}>活塞速度 <span style={S.req}>*</span></label>
              <input style={S.inp} type="number" placeholder="例：50" value={f.speed_mmps} onChange={e=>setVal("speed_mmps",e.target.value)} />
              <span style={S.unit}>mm/s</span>
            </div>
            <div style={S.field}>
              <label style={S.label}>行程 <span style={S.req}>*</span></label>
              <input style={S.inp} type="number" placeholder="例：300" value={f.stroke_mm} onChange={e=>setVal("stroke_mm",e.target.value)} />
              <span style={S.unit}>mm</span>
            </div>
            <div style={S.field}>
              <label style={S.label}>內缸徑（選填）</label>
              <input style={S.inp} type="number" placeholder="自動計算" value={f.bore_mm||""} onChange={e=>setVal("bore_mm",e.target.value)} />
              <span style={S.unit}>mm（留空則自動選標準缸徑）</span>
            </div>
            <div style={S.field}>
              <label style={S.label}>定位精度</label>
              <input style={S.inp} type="number" placeholder="例：5" value={f.positioning_mm} onChange={e=>setVal("positioning_mm",e.target.value)} />
              <span style={S.unit}>mm（精密定位填 0.1~0.5）</span>
            </div>
          </div>
        </div>

        {/* Section 2: 電機 */}
        <div style={S.section}>
          <div style={S.secTitle}><span>⚡</span> 電機類型</div>

          {/* Motor type toggle */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:8}}>電機類型選擇</div>
            <div style={S.segRow}>
              <button style={S.segBtn(f.motor_type==="async")} onClick={()=>setVal("motor_type","async")}>
                異步電機（感應）
              </button>
              <div style={S.divider}/>
              <button style={S.segBtn(f.motor_type==="servo",C.purple)} onClick={()=>setVal("motor_type","servo")}>
                ⭐ 伺服電機
              </button>
            </div>
          </div>

          {/* Servo fields */}
          {f.motor_type==="servo"&&(
            <>
              <div style={{fontSize:11,color:C.purple,letterSpacing:".06em",marginBottom:12}}>▸ 伺服電機參數（選填，填寫後更精確）</div>
              <div style={S.grid4}>
                <div style={S.field}>
                  <label style={S.label}>負載時間</label>
                  <input style={{...S.inp,borderColor:C.purple+"44"}} type="number" placeholder="例：3" value={f.load_s} onChange={e=>setVal("load_s",e.target.value)} />
                  <span style={S.unit}>秒（每循環做功時間）</span>
                </div>
                <div style={S.field}>
                  <label style={S.label}>休息時間</label>
                  <input style={{...S.inp,borderColor:C.purple+"44"}} type="number" placeholder="例：2" value={f.rest_s} onChange={e=>setVal("rest_s",e.target.value)} />
                  <span style={S.unit}>秒（每循環停止時間）</span>
                </div>
                <div style={S.field}>
                  <label style={S.label}>扭矩需求</label>
                  <input style={{...S.inp,borderColor:C.purple+"44"}} type="number" placeholder="例：50" value={f.torque_Nm} onChange={e=>setVal("torque_Nm",e.target.value)} />
                  <span style={S.unit}>N·m（不確定可留空）</span>
                </div>
                <div style={S.field}>
                  <label style={S.label}>功率需求</label>
                  <input style={{...S.inp,borderColor:C.purple+"44"}} type="number" placeholder="例：7.5" value={f.power_kW} onChange={e=>setVal("power_kW",e.target.value)} />
                  <span style={S.unit}>kW（不確定可留空，自動計算）</span>
                </div>
              </div>
            </>
          )}

          {/* Async field */}
          {f.motor_type==="async"&&(
            <div style={{...S.alertBox(C.blue),marginBottom:0}}>
              💡 異步感應電機適合連續恆速工況，搭配變頻器（VFD）可實現軟啟動與節能。電機功率將依液壓系統需求自動計算。
            </div>
          )}
        </div>

        {/* Section 3: 工況 */}
        <div style={S.section}>
          <div style={S.secTitle}><span>📊</span> 工況設定</div>
          <div style={S.grid3}>
            <div style={S.field}>
              <label style={S.label}>工作模式</label>
              <div style={S.segRow}>
                <button style={S.segBtn(f.duty==="constant")} onClick={()=>setVal("duty","constant")}>定速連續</button>
                <div style={S.divider}/>
                <button style={S.segBtn(f.duty==="variable",C.green)} onClick={()=>setVal("duty","variable")}>變速節能</button>
              </div>
              <span style={S.hint}>{f.duty==="variable"?"變速：節能30~60%，需伺服或VFD":"定速：固定轉速，電機起停控制"}</span>
            </div>
            <div style={{...S.field,gridColumn:"span 2"}}>
              <label style={S.label}>備註 / 特殊要求（選填）</label>
              <input style={S.inp} placeholder="例：戶外防水、高溫環境、食品級液壓油..." />
              <span style={S.hint}>影響材質與密封件建議</span>
            </div>
          </div>
        </div>

        {/* Required hint */}
        {!canCalc&&(
          <div style={{fontSize:12,color:C.muted,marginBottom:12,textAlign:"right"}}>
            ＊ 請填寫帶 <span style={{color:C.accent}}>*</span> 的必填欄位才可計算
          </div>
        )}

        {/* CTA */}
        <div style={S.cta}>
          <button style={S.calcBtn(canCalc)} onClick={doCalc} disabled={!canCalc}>
            🔧 開始全套選型計算 →
          </button>
        </div>
      </div>
    </div>
  );

  // ── RESULT ──
  if(!res) return null;
  const {cyl,pump,motor,valve,meta} = res;

  const tabContent = {
    cyl:(
      <>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16}}>📐 油壓缸計算結果</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{cyl.bore}</span><span style={S.specUnit}>mm — 內缸徑</span><span style={S.specKey}>標準缸徑</span></div>
            <div style={S.specItem}><span style={S.specVal}>{cyl.rod}</span><span style={S.specUnit}>mm — 桿徑</span><span style={S.specKey}>Rod Diameter</span></div>
            <div style={S.specItem}><span style={S.specVal}>{cyl.stroke}</span><span style={S.specUnit}>mm — 行程</span><span style={S.specKey}>Stroke</span></div>
            <div style={S.specItem}><span style={S.specVal}>{cyl.Q}</span><span style={S.specUnit}>L/min — 需求流量</span><span style={S.specKey}>Flow Required</span></div>
            <div style={S.specItem}><span style={{...S.specVal,color:Number(cyl.util)>90?C.red:C.green}}>{cyl.P_work}</span><span style={S.specUnit}>MPa — 工作壓力</span><span style={S.specKey}>利用率 {cyl.util}%</span></div>
          </div>
        </div>
        {Number(cyl.util)>90&&<div style={S.alertBox(C.red)}>⚠️ 壓力利用率過高（{cyl.util}%），建議升大一個缸徑規格或提高系統壓力設定。</div>}
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>🏷 品牌推薦</div>
          <div style={S.gradeRow}>
            <span style={{fontSize:12,color:C.muted,marginRight:4}}>等級：</span>
            {Object.entries(GRADE_LBL).map(([k,v])=>(
              <button key={k} style={S.gradeBtn(grade===k,GRADE_CLR[k])} onClick={()=>setGrade(k)}>{v}</button>
            ))}
          </div>
          <BrandTable type="cyl" grade={grade}/>
        </div>
      </>
    ),
    pump:(
      <>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16}}>🔄 油壓泵計算結果</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{pump.disp}</span><span style={S.specUnit}>cc/rev — 排量</span><span style={S.specKey}>Displacement</span></div>
            <div style={S.specItem}><span style={S.specVal}>{pump.rpm}</span><span style={S.specUnit}>rpm — 轉速</span><span style={S.specKey}>Speed</span></div>
            <div style={S.specItem}><span style={S.specVal}>{pump.Q}</span><span style={S.specUnit}>L/min — 輸出流量</span><span style={S.specKey}>Output Flow</span></div>
            <div style={S.specItem}><span style={S.specVal}>{pump.power}</span><span style={S.specUnit}>kW — 軸功率</span><span style={S.specKey}>Shaft Power</span></div>
          </div>
        </div>
        <div style={S.alertBox(C.blue)}>💡 推薦葉片泵（PV2R）用於靜音低脈動場合；柱塞泵（A系列）用於高壓精密場合。</div>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>🏷 品牌推薦</div>
          <div style={S.gradeRow}>{Object.entries(GRADE_LBL).map(([k,v])=><button key={k} style={S.gradeBtn(grade===k,GRADE_CLR[k])} onClick={()=>setGrade(k)}>{v}</button>)}</div>
          <BrandTable type="pump" grade={grade}/>
        </div>
      </>
    ),
    motor:(
      <>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16}}>⚡ 電機計算結果</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{motor.kW}</span><span style={S.specUnit}>kW — 額定功率</span><span style={S.specKey}>標準功率規格</span></div>
            <div style={S.specItem}><span style={S.specVal}>{motor.rpm}</span><span style={S.specUnit}>rpm — 轉速</span><span style={S.specKey}>Speed</span></div>
            <div style={S.specItem}><span style={{...S.specVal,color:motor.isServo?C.purple:C.accent}}>{motor.isServo?"伺服電機":"感應電機"}</span><span style={S.specUnit}>推薦類型</span><span style={S.specKey}>Motor Type</span></div>
            {motor.duty_pct<100&&<div style={S.specItem}><span style={{...S.specVal,color:C.green}}>{motor.duty_pct}%</span><span style={S.specUnit}>負載率</span><span style={S.specKey}>Duty Cycle</span></div>}
          </div>
        </div>
        <div style={S.alertBox(motor.isServo?C.purple:C.green)}>
          {motor.isServo?"🎯 伺服液壓系統：伺服電機+定量泵，可實現壓力/流量閉環控制，節能30~60%，響應速度快。":"✅ 感應電機：建議搭配變頻器（VFD）軟啟動，減少啟動電流衝擊，維護成本低。"}
        </div>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>🏷 品牌推薦</div>
          <div style={S.gradeRow}>{Object.entries(GRADE_LBL).map(([k,v])=><button key={k} style={S.gradeBtn(grade===k,GRADE_CLR[k])} onClick={()=>setGrade(k)}>{v}</button>)}</div>
          <BrandTable type="motor" filterServo={motor.isServo} grade={grade}/>
        </div>
      </>
    ),
    valve:(
      <>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16}}>🎛 閥件規格</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{valve.Q}</span><span style={S.specUnit}>L/min — 方向閥流量</span><span style={S.specKey}>Directional Valve</span></div>
            <div style={S.specItem}><span style={S.specVal}>{valve.P}</span><span style={S.specUnit}>MPa — 額定壓力</span><span style={S.specKey}>Pressure Rating</span></div>
            <div style={S.specItem}><span style={S.specVal}>{valve.relief}</span><span style={S.specUnit}>MPa — 溢流閥設定</span><span style={S.specKey}>Relief Setting</span></div>
          </div>
        </div>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>📋 標準閥組清單</div>
          <table style={S.table}>
            <thead><tr><th style={S.th}>閥件</th><th style={S.th}>功能</th><th style={S.th}>規格要求</th></tr></thead>
            <tbody>
              {[
                ["電磁方向閥","控制進出油方向",`≥${valve.Q}L/min，${valve.P}MPa，4/3中位機能`],
                ["溢流閥","最高壓力保護",`設定壓${valve.relief}MPa`],
                ["單向閥","防止回流衝擊",`≥${valve.Q}L/min，開啟壓0.05MPa`],
                ["流量控制閥","速度調節",`0~${valve.Q}L/min可調`],
                ["壓力錶+截止閥","壓力監測",`量程≥${Math.ceil(meta.pressure*1.5)}MPa`],
              ].map(([a,b,c],i)=>(
                <tr key={i} style={{background:i%2?"#0a0d10":"transparent"}}>
                  <td style={{...S.td,fontWeight:700,color:"#e2e8f0"}}>{a}</td>
                  <td style={{...S.td,color:"#94a3b8"}}>{b}</td>
                  <td style={{...S.td,color:C.muted,fontSize:12}}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={S.specCard}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>🏷 品牌推薦</div>
          <div style={S.gradeRow}>{Object.entries(GRADE_LBL).map(([k,v])=><button key={k} style={S.gradeBtn(grade===k,GRADE_CLR[k])} onClick={()=>setGrade(k)}>{v}</button>)}</div>
          <BrandTable type="valve" grade={grade}/>
        </div>
      </>
    ),
    report:(
      <>
        <div style={{...S.specCard}}>
          <div style={{fontSize:13,fontWeight:800,color:C.accent,marginBottom:14,borderBottom:`1px solid ${C.border}`,paddingBottom:10}}>⛓ 系統串聯設計流程</div>
          {[
            ["確認需求",`推力 ${params.force_kN} kN · 速度 ${params.speed_mmps} mm/s · 行程 ${params.stroke_mm} mm · 壓力 ${params.pressure_MPa} MPa`],
            ["油壓缸",`缸徑 ⌀${cyl.bore}mm × 桿徑 ⌀${cyl.rod}mm × 行程 ${cyl.stroke}mm，需求流量 ${cyl.Q} L/min`],
            ["油壓泵",`排量 ${pump.disp} cc/rev，輸出流量 ${pump.Q} L/min，軸功率 ${pump.power} kW`],
            ["電機",`額定功率 ${motor.kW} kW，${motor.isServo?"伺服電機（閉環控制）":"三相感應電機+VFD"}`],
            ["閥件",`方向閥 ${valve.Q}L/min / ${valve.P}MPa，溢流閥設定 ${valve.relief}MPa`],
          ].map(([t,d],i)=>(
            <div key={i} style={S.flowStep}>
              <div style={S.stepNum}>{i+1}</div>
              <div><div style={{fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{t}</div><div style={{fontSize:12,color:C.muted}}>{d}</div></div>
            </div>
          ))}
        </div>
        <div style={S.specCard}>
          <div style={{fontSize:13,fontWeight:800,color:C.accent,marginBottom:14,borderBottom:`1px solid ${C.border}`,paddingBottom:10}}>📊 元件匯總</div>
          <table style={S.table}>
            <thead><tr><th style={S.th}>模組</th><th style={S.th}>關鍵規格</th><th style={S.th}>標準型推薦</th><th style={S.th}>旗艦型推薦</th></tr></thead>
            <tbody>
              {[
                ["油壓缸",`⌀${cyl.bore}×⌀${cyl.rod}×${cyl.stroke}mm`,"Mindman 金器","Yuken 油研"],
                ["油壓泵",`${pump.disp}cc/rev, ${pump.Q}L/min`,"Anson 安頌","Yuken 油研"],
                ["電機",`${motor.kW}kW`,motor.isServo?"台達 Delta":"東元 TECO",motor.isServo?"安川 Yaskawa":"Parker"],
                ["閥件",`${valve.Q}L/min, ${valve.P}MPa`,"北部精機 Northman","Yuken 油研"],
              ].map(([m,s,st,pr],i)=>(
                <tr key={i} style={{background:i%2?"#0a0d10":"transparent"}}>
                  <td style={{...S.td,fontWeight:700,color:C.accent}}>{m}</td>
                  <td style={{...S.td,fontSize:12,color:"#94a3b8"}}>{s}</td>
                  <td style={{...S.td,fontSize:12,color:"#e2e8f0"}}>{st}</td>
                  <td style={{...S.td,fontSize:12,color:C.purple}}>{pr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={S.specCard}>
          <div style={{fontSize:13,fontWeight:800,color:C.accent,marginBottom:14,borderBottom:`1px solid ${C.border}`,paddingBottom:10}}>⚠️ 工程注意事項</div>
          {[
            "本選型基於理論計算，實際應用需考慮安裝方式（拉力/推力）、導向及環境溫度對液壓油黏度的影響。",
            "元件額定壓力建議 ≥ 系統最高壓力 × 1.3（安全係數）。",
            `油箱容積建議 ${(Number(pump.Q)*3).toFixed(0)}~${(Number(pump.Q)*5).toFixed(0)} 公升（泵流量3~5倍）。`,
            motor.isServo?"伺服液壓建議加裝壓力/流量感測器實現閉環控制，節能30~60%。":"感應電機建議搭配VFD軟啟動，減少電流衝擊並延長壽命。",
          ].map((n,i)=>(
            <div key={i} style={{fontSize:13,color:"#94a3b8",padding:"7px 0",borderBottom:i<3?`1px dashed ${C.border}`:"none",lineHeight:1.65}}>
              {i+1}. {n}
            </div>
          ))}
        </div>
      </>
    )
  };

  return(
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1c2127;border-radius:2px}
      `}</style>
      <div style={S.header}>
        <div><div style={S.logo}>⚙ HydroSelect</div><div style={S.sub}>液壓系統智能選型平台</div></div>
        <button style={S.backBtn} onClick={()=>setPhase("form")}>← 返回修改</button>
      </div>
      <div style={S.body}>
        {/* System bar */}
        <div style={S.sysBar}>
          {[
            [cyl.bore+"mm","缸徑"],[pump.disp+"cc","泵排量"],
            [motor.kW+"kW","電機功率"],[valve.Q+"L","閥件流量"],
            [meta.pressure+"MPa","系統壓力"],[motor.isServo?"伺服":"感應","電機類型"],
          ].map(([v,k],i)=>(
            <div key={i} style={S.sysItem}>
              <div style={{...S.sysVal,color:k==="電機類型"&&motor.isServo?C.purple:C.accent}}>{v}</div>
              <div style={S.sysKey}>{k}</div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={S.tabRow}>
          {TABS.map(t=><button key={t.id} style={S.tabBtn(tab===t.id)} onClick={()=>setTab(t.id)}>{t.icon} {t.label}</button>)}
        </div>
        <div style={{paddingBottom:40}}>{tabContent[tab]}</div>
      </div>
    </div>
  );
}
