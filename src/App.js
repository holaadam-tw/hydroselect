import { useState } from "react";
import { matchAll } from "./utils/productMatcher";
import { generateQuotationPDF, generateSpecSheetPDF } from "./utils/pdfGenerator";

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

  const Q_pump_req = Q_cyl/eta_v;
  const disp_req   = Q_pump_req*1000/1450;
  const disp       = roundUp(STD_DISP, disp_req);
  const Q_pump     = disp*1450/1000;
  const P_hyd      = Q_pump_req*Pmpa/60;
  const P_shaft    = P_hyd/eta_p;

  let motor_kW;
  if(isServo && Number(p.power_kW)>0){
    motor_kW = roundUp(STD_KW, Number(p.power_kW));
  } else {
    motor_kW = roundUp(STD_KW, P_shaft/eta_e);
  }

  const load_s = Number(p.load_s)||0;
  const rest_s = Number(p.rest_s)||0;
  const duty_pct = (load_s+rest_s)>0 ? Math.round(load_s/(load_s+rest_s)*100) : 100;

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
//  STYLES — 淺色工業專業風
// ═══════════════════════════════════════════
const C = {
  bg:"#FFFFFF", card:"#F8F9FA", border:"#E2E8F0",
  text:"#1A1A1A", muted:"#666666", accent:"#003366",
  orange:"#FF6600", green:"#059669", red:"#DC2626",
  purple:"#6D28D9",
};

const S = {
  root:    {fontFamily:"'Noto Sans TC','PingFang TC',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",flexDirection:"column"},
  header:  {background:"#FFFFFF",borderBottom:`2px solid ${C.border}`,padding:"0",display:"flex",alignItems:"center",justifyContent:"space-between"},
  logoBg:  {background:C.accent,padding:"14px 24px",display:"flex",alignItems:"center",gap:10},
  logoMark:{width:8,height:28,background:C.orange,borderRadius:2},
  logoText:{fontSize:18,fontWeight:800,color:"#FFFFFF",letterSpacing:".04em"},
  headerRight:{padding:"0 24px",display:"flex",alignItems:"center",gap:16},
  sub:     {fontSize:11,color:C.muted,letterSpacing:".06em"},
  body:    {maxWidth:1000,margin:"0 auto",width:"100%",padding:"0 20px 60px"},

  appRow:  {display:"flex",gap:10,margin:"24px 0 20px",flexWrap:"wrap"},
  appBtn:  (active)=>({flex:"1 1 120px",padding:"14px 8px",background:active?"#FFF5EB":C.card,border:`2px solid ${active?C.orange:C.border}`,borderRadius:8,cursor:"pointer",color:active?C.orange:C.muted,fontWeight:active?800:400,fontSize:13,transition:"all .18s",textAlign:"center"}),
  appIcon: {fontSize:24,display:"block",marginBottom:6},

  section: {background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"20px 24px",marginBottom:16},
  secTitle:{fontSize:12,fontWeight:700,letterSpacing:".06em",color:C.accent,marginBottom:18,display:"flex",alignItems:"center",gap:8,borderBottom:`2px solid ${C.accent}`,paddingBottom:10},
  grid2:   {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px 24px"},
  grid3:   {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"14px 24px"},
  grid4:   {display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"14px 24px"},

  field:   {display:"flex",flexDirection:"column",gap:6},
  label:   {fontSize:12,color:C.muted,letterSpacing:".04em",display:"flex",alignItems:"center",gap:4,fontWeight:600},
  req:     {color:C.orange,fontSize:13},
  inp:     {background:"#FFFFFF",border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px",color:C.text,fontSize:14,outline:"none",width:"100%",fontVariantNumeric:"tabular-nums"},
  unit:    {fontSize:11,color:C.muted,marginTop:2},
  segRow:  {display:"flex",gap:0,borderRadius:6,overflow:"hidden",border:`1px solid ${C.border}`},
  segBtn:  (active,clr)=>({flex:1,padding:"9px 0",background:active?`${clr||C.orange}15`:"#FFFFFF",border:"none",color:active?(clr||C.orange):C.muted,fontWeight:active?700:400,fontSize:13,cursor:"pointer",transition:"all .15s"}),
  divider: {borderLeft:`1px solid ${C.border}`},
  hint:    {fontSize:11,color:C.muted,fontStyle:"italic"},

  cta:     {display:"flex",justifyContent:"flex-end",marginTop:8},
  calcBtn: (ok)=>({background:ok?C.orange:"#E2E8F0",color:ok?"#FFFFFF":C.muted,border:"none",borderRadius:8,padding:"13px 36px",fontSize:15,fontWeight:800,cursor:ok?"pointer":"not-allowed",letterSpacing:".03em",transition:"all .2s",boxShadow:ok?"0 2px 8px rgba(255,102,0,0.3)":"none"}),

  sysBar:  {display:"flex",gap:0,background:"#FFFFFF",border:`1px solid ${C.border}`,borderRadius:8,margin:"20px 0",overflow:"hidden",flexWrap:"wrap"},
  sysItem: {flex:1,minWidth:120,padding:"16px 20px",borderRight:`1px solid ${C.border}`,borderLeft:`3px solid ${C.accent}`},
  sysVal:  {fontSize:24,fontWeight:800,color:C.accent,fontVariantNumeric:"tabular-nums"},
  sysKey:  {fontSize:10,color:C.muted,letterSpacing:".08em",textTransform:"uppercase",marginTop:3},
  tabRow:  {display:"flex",gap:4,borderBottom:`2px solid ${C.border}`,marginBottom:20,flexWrap:"wrap"},
  tabBtn:  (a)=>({background:"transparent",border:"none",borderBottom:`3px solid ${a?C.orange:"transparent"}`,padding:"10px 16px",color:a?C.accent:C.muted,fontWeight:a?700:400,fontSize:13,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}),
  specCard:{background:"#FFFFFF",border:`1px solid ${C.border}`,borderRadius:8,padding:"20px 24px",marginBottom:14},
  specGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:18},
  specItem:{display:"flex",flexDirection:"column",gap:4,borderLeft:`3px solid ${C.accent}`,paddingLeft:12},
  specVal: {fontSize:26,fontWeight:800,color:C.text,fontVariantNumeric:"tabular-nums"},
  specUnit:{fontSize:11,color:C.orange,fontWeight:600},
  specKey: {fontSize:11,color:C.muted},
  alertBox:(c)=>({background:`${c}08`,border:`1px solid ${c}33`,borderRadius:6,padding:"10px 14px",fontSize:13,color:c==='#DC2626'?C.red:C.text,marginBottom:12}),

  table:   {width:"100%",borderCollapse:"collapse",fontSize:13},
  th:      {textAlign:"left",padding:"10px 12px",background:C.accent,color:"#FFFFFF",fontSize:11,fontWeight:700,letterSpacing:".06em"},
  td:      {padding:"11px 12px",borderBottom:`1px solid ${C.border}`,verticalAlign:"middle"},
  trAlt:   (i)=>({background:i%2?C.card:"#FFFFFF"}),

  backBtn: {background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"7px 16px",fontSize:12,cursor:"pointer",fontWeight:600},
  flowStep:{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10,padding:"12px",background:C.card,borderRadius:6,border:`1px solid ${C.border}`},
  stepNum: {background:C.accent,color:"#FFFFFF",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0},

  // Product match card
  matchCard:{background:"#FFFFFF",border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 20px",marginBottom:12},
  matchBrand:{fontSize:14,fontWeight:700,color:C.accent},
  matchOrigin:{fontSize:12,color:C.muted,marginLeft:8},
  matchModel:{fontSize:16,fontWeight:800,color:C.text,marginTop:6,fontFamily:"monospace"},
  matchSpec:{fontSize:12,color:C.muted,marginTop:4},
  matchNoMatch:{fontSize:13,color:C.red,fontStyle:"italic",marginTop:6},

  // Buttons
  quotationBtn:{background:C.orange,color:"#FFFFFF",border:"none",borderRadius:6,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 2px 6px rgba(255,102,0,0.3)",transition:"all .2s",minHeight:44},
  specSheetBtn:{background:"transparent",color:C.accent,border:`2px solid ${C.accent}`,borderRadius:6,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s",minHeight:44},

  // Modal
  overlay: {position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000},
  modal:   {background:"#FFFFFF",borderRadius:12,padding:"32px",width:"90%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"},
};

// ═══════════════════════════════════════════
//  MATCH RESULT COMPONENTS
// ═══════════════════════════════════════════
function MatchResultCard({ brandKey, data, matchResults, isPropiston }) {
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");

  if (!data) return null;

  const handleQuotation = () => {
    if (isPropiston) {
      setShowModal(true);
    }
  };

  const handleGeneratePDF = () => {
    generateQuotationPDF(matchResults, customerName);
    setShowModal(false);
    setCustomerName("");
  };

  const handleSpecSheet = () => {
    generateSpecSheetPDF(matchResults, brandKey, data.brand);
  };

  return (
    <div style={S.matchCard}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
        <div>
          <span style={S.matchBrand}>{data.brand}</span>
          <span style={S.matchOrigin}>{data.origin}</span>
        </div>
        {isPropiston ? (
          <button style={S.quotationBtn} onClick={handleQuotation}>
            📄 生成報價單
          </button>
        ) : (
          <button style={S.specSheetBtn} onClick={handleSpecSheet}>
            📋 匯出建議規格
          </button>
        )}
      </div>
      {data.noMatch ? (
        <div style={S.matchNoMatch}>超出該品牌產品範圍，請洽業務</div>
      ) : (
        data.matches.map((m, i) => (
          <div key={i} style={{marginTop:10,paddingTop:i>0?10:0,borderTop:i>0?`1px dashed ${C.border}`:"none"}}>
            <div style={{fontSize:11,color:C.muted}}>{m.series}</div>
            <div style={S.matchModel}>{m.matched.displayModel || m.matched.model}</div>
            <div style={S.matchSpec}>
              {m.matched.displacement && `排量 ${m.matched.displacement} cc/rev`}
              {m.matched.maxFlow && `流量 ${m.matched.maxFlow} L/min`}
              {m.matched.bore && `缸徑 ${m.matched.bore} mm`}
              {m.matched.power_kW && `功率 ${m.matched.power_kW} kW`}
              {m.matched.maxPressure && ` / 最大壓力 ${m.matched.maxPressure} MPa`}
              {m.matched.ratedTorque_Nm && ` / 扭矩 ${m.matched.ratedTorque_Nm} N·m`}
              {m.matched.ratedRpm && ` / ${m.matched.ratedRpm} rpm`}
              {m.matched.servoDriver && (
                <span style={{display:"block",marginTop:2,color:C.purple}}>
                  驅動器：{m.matched.servoDriver}
                </span>
              )}
            </div>
            {isPropiston && m.matched.price > 0 && (
              <div style={{fontSize:13,fontWeight:700,color:C.orange,marginTop:4}}>
                NT$ {m.matched.price.toLocaleString()}
              </div>
            )}
          </div>
        ))
      )}

      {/* Customer name modal for quotation */}
      {showModal && (
        <div style={S.overlay} onClick={()=>setShowModal(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:18,fontWeight:800,color:C.accent,marginBottom:16}}>生成報價單</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:12}}>請輸入客戶名稱（選填）</div>
            <input
              style={{...S.inp,marginBottom:16}}
              placeholder="例：XX 工業有限公司"
              value={customerName}
              onChange={e=>setCustomerName(e.target.value)}
              autoFocus
            />
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button style={S.backBtn} onClick={()=>setShowModal(false)}>取消</button>
              <button style={S.quotationBtn} onClick={handleGeneratePDF}>
                確認生成 PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchSection({ title, matchData, matchResults, category }) {
  if (!matchData) return null;
  const entries = Object.entries(matchData);
  return (
    <div style={S.specCard}>
      <div style={{fontSize:12,color:C.muted,letterSpacing:".06em",fontWeight:700,marginBottom:12}}>{title}</div>
      {entries.map(([key, data]) => (
        <MatchResultCard
          key={key}
          brandKey={key}
          data={data}
          matchResults={matchResults}
          isPropiston={key === "propiston"}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════
export default function App(){
  const [phase, setPhase]  = useState("form");
  const [appId, setAppId]  = useState("custom");
  const [tab,   setTab]    = useState("cyl");
  const [res,   setRes]    = useState(null);
  const [params,setParams] = useState(null);
  const [matchResults, setMatchResults] = useState(null);

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
    setMatchResults(matchAll(r));
    setPhase("result");
    setTab("cyl");
  };

  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    input:focus{border-color:${C.orange}!important;outline:none;box-shadow:0 0 0 3px rgba(255,102,0,0.1)}
    input[type=number]::-webkit-inner-spin-button{opacity:.4}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
    @media(max-width:768px){
      .grid-responsive{grid-template-columns:1fr!important}
    }
  `;

  // ── FORM ──
  if(phase==="form") return(
    <div style={S.root}>
      <style>{globalCSS}</style>
      <div style={S.header}>
        <div style={S.logoBg}>
          <div style={S.logoMark}/>
          <div>
            <div style={S.logoText}>PROPISTON HydroSelect</div>
          </div>
        </div>
        <div style={S.headerRight}>
          <div style={S.sub}>液壓系統智能選型平台</div>
        </div>
      </div>

      <div style={S.body}>

        {/* App Presets */}
        <div style={{marginTop:24,marginBottom:4}}>
          <div style={{fontSize:12,color:C.muted,letterSpacing:".06em",fontWeight:600,marginBottom:10}}>應用場景快速套入</div>
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
          <div style={S.grid4} className="grid-responsive">
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

          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8}}>電機類型選擇</div>
            <div style={S.segRow}>
              <button style={S.segBtn(f.motor_type==="async")} onClick={()=>setVal("motor_type","async")}>
                異步電機（感應）
              </button>
              <div style={S.divider}/>
              <button style={S.segBtn(f.motor_type==="servo",C.purple)} onClick={()=>setVal("motor_type","servo")}>
                伺服電機
              </button>
            </div>
          </div>

          {f.motor_type==="servo"&&(
            <>
              <div style={{fontSize:12,color:C.purple,letterSpacing:".04em",fontWeight:600,marginBottom:12}}>▸ 伺服電機參數（選填，填寫後更精確）</div>
              <div style={S.grid4} className="grid-responsive">
                <div style={S.field}>
                  <label style={S.label}>負載時間</label>
                  <input style={{...S.inp,borderColor:`${C.purple}44`}} type="number" placeholder="例：3" value={f.load_s} onChange={e=>setVal("load_s",e.target.value)} />
                  <span style={S.unit}>秒（每循環做功時間）</span>
                </div>
                <div style={S.field}>
                  <label style={S.label}>休息時間</label>
                  <input style={{...S.inp,borderColor:`${C.purple}44`}} type="number" placeholder="例：2" value={f.rest_s} onChange={e=>setVal("rest_s",e.target.value)} />
                  <span style={S.unit}>秒（每循環停止時間）</span>
                </div>
                <div style={S.field}>
                  <label style={S.label}>扭矩需求</label>
                  <input style={{...S.inp,borderColor:`${C.purple}44`}} type="number" placeholder="例：50" value={f.torque_Nm} onChange={e=>setVal("torque_Nm",e.target.value)} />
                  <span style={S.unit}>N·m（不確定可留空）</span>
                </div>
                <div style={S.field}>
                  <label style={S.label}>功率需求</label>
                  <input style={{...S.inp,borderColor:`${C.purple}44`}} type="number" placeholder="例：7.5" value={f.power_kW} onChange={e=>setVal("power_kW",e.target.value)} />
                  <span style={S.unit}>kW（不確定可���空，自動計算）</span>
                </div>
              </div>
            </>
          )}

          {f.motor_type==="async"&&(
            <div style={S.alertBox(C.accent)}>
              異步感應電機適合連續恆速工況，搭配變頻器（VFD）可實現軟啟動與節能。電機功率將依液壓系統需求自動計算。
            </div>
          )}
        </div>

        {/* Section 3: 工況 */}
        <div style={S.section}>
          <div style={S.secTitle}><span>📊</span> 工況設定</div>
          <div style={S.grid3} className="grid-responsive">
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

        {!canCalc&&(
          <div style={{fontSize:12,color:C.muted,marginBottom:12,textAlign:"right"}}>
            * 請填寫帶 <span style={{color:C.orange}}>*</span> 的必填欄位才可計算
          </div>
        )}

        <div style={S.cta}>
          <button style={S.calcBtn(canCalc)} onClick={doCalc} disabled={!canCalc}>
            開始全套選型計算 →
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
          <div style={{...S.secTitle,borderBottom:"none",paddingBottom:0,marginBottom:16}}>📐 油壓缸計算結果</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{cyl.bore}</span><span style={S.specUnit}>mm — 內缸徑</span><span style={S.specKey}>標準缸徑</span></div>
            <div style={S.specItem}><span style={S.specVal}>{cyl.rod}</span><span style={S.specUnit}>mm — 桿徑</span><span style={S.specKey}>Rod Diameter</span></div>
            <div style={S.specItem}><span style={S.specVal}>{cyl.stroke}</span><span style={S.specUnit}>mm — 行程</span><span style={S.specKey}>Stroke</span></div>
            <div style={S.specItem}><span style={S.specVal}>{cyl.Q}</span><span style={S.specUnit}>L/min — 需求流量</span><span style={S.specKey}>Flow Required</span></div>
            <div style={S.specItem}><span style={{...S.specVal,color:Number(cyl.util)>90?C.red:C.green}}>{cyl.P_work}</span><span style={S.specUnit}>MPa — 工作壓力</span><span style={S.specKey}>利用率 {cyl.util}%</span></div>
          </div>
        </div>
        {Number(cyl.util)>90&&<div style={S.alertBox(C.red)}>��️ 壓力利用率過高（{cyl.util}%），建議升大一個缸徑規格或提高系統壓力設定。</div>}
        {matchResults && (
          <MatchSection title="🏭 油壓缸品牌型號匹配" matchData={matchResults.cylinders} matchResults={matchResults} category="cylinder" />
        )}
      </>
    ),
    pump:(
      <>
        <div style={S.specCard}>
          <div style={{...S.secTitle,borderBottom:"none",paddingBottom:0,marginBottom:16}}>🔄 油壓泵計算結果</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{pump.disp}</span><span style={S.specUnit}>cc/rev — 排量</span><span style={S.specKey}>Displacement</span></div>
            <div style={S.specItem}><span style={S.specVal}>{pump.rpm}</span><span style={S.specUnit}>rpm — 轉速</span><span style={S.specKey}>Speed</span></div>
            <div style={S.specItem}><span style={S.specVal}>{pump.Q}</span><span style={S.specUnit}>L/min — 輸出流量</span><span style={S.specKey}>Output Flow</span></div>
            <div style={S.specItem}><span style={S.specVal}>{pump.power}</span><span style={S.specUnit}>kW — 軸功率</span><span style={S.specKey}>Shaft Power</span></div>
          </div>
        </div>
        <div style={S.alertBox(C.accent)}>推薦葉片泵（PV2R）用於靜音低脈動場合；柱塞泵（A系列）用於高壓精密場合。</div>
        {matchResults && (
          <MatchSection title="🏭 油壓泵品牌型號匹配" matchData={matchResults.pumps} matchResults={matchResults} category="pump" />
        )}
      </>
    ),
    motor:(
      <>
        <div style={S.specCard}>
          <div style={{...S.secTitle,borderBottom:"none",paddingBottom:0,marginBottom:16}}>⚡ 電機計算結果</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{motor.kW}</span><span style={S.specUnit}>kW — 額定功率</span><span style={S.specKey}>標準功率規格</span></div>
            <div style={S.specItem}><span style={S.specVal}>{motor.rpm}</span><span style={S.specUnit}>rpm — 轉速</span><span style={S.specKey}>Speed</span></div>
            <div style={S.specItem}><span style={{...S.specVal,color:motor.isServo?C.purple:C.accent}}>{motor.isServo?"伺服電機":"感應電機"}</span><span style={S.specUnit}>推薦類型</span><span style={S.specKey}>Motor Type</span></div>
            {motor.duty_pct<100&&<div style={S.specItem}><span style={{...S.specVal,color:C.green}}>{motor.duty_pct}%</span><span style={S.specUnit}>負載率</span><span style={S.specKey}>Duty Cycle</span></div>}
          </div>
        </div>
        <div style={S.alertBox(motor.isServo?C.purple:C.green)}>
          {motor.isServo?"伺服液壓系統：伺服電機+定量泵，可實現壓力/流量閉環控制，節能30~60%，響應速度快。":"感應電機：建議搭配變頻器（VFD）軟啟動，減少啟動電流衝擊，維護成本低。"}
        </div>
        {matchResults && (
          <MatchSection title="🏭 電機品牌型號匹配" matchData={matchResults.motors} matchResults={matchResults} category="motor" />
        )}
      </>
    ),
    valve:(
      <>
        <div style={S.specCard}>
          <div style={{...S.secTitle,borderBottom:"none",paddingBottom:0,marginBottom:16}}>🎛 閥件規格</div>
          <div style={S.specGrid}>
            <div style={S.specItem}><span style={S.specVal}>{valve.Q}</span><span style={S.specUnit}>L/min — 方向閥流量</span><span style={S.specKey}>Directional Valve</span></div>
            <div style={S.specItem}><span style={S.specVal}>{valve.P}</span><span style={S.specUnit}>MPa — 額定壓力</span><span style={S.specKey}>Pressure Rating</span></div>
            <div style={S.specItem}><span style={S.specVal}>{valve.relief}</span><span style={S.specUnit}>MPa — 溢流閥設定</span><span style={S.specKey}>Relief Setting</span></div>
          </div>
        </div>
        <div style={S.specCard}>
          <div style={{fontSize:12,color:C.muted,letterSpacing:".06em",fontWeight:700,marginBottom:14}}>📋 標準閥組清單</div>
          <div style={{overflowX:"auto"}}>
            <table style={S.table}>
              <thead><tr><th style={S.th}>閥件</th><th style={S.th}>功能</th><th style={S.th}>規格要求</th></tr></thead>
              <tbody>
                {[
                  ["電磁方向閥","控制進出油方向",`≥${valve.Q}L/min，${valve.P}MPa，4/3中位機能`],
                  ["���流閥","最高壓力保護",`設定壓${valve.relief}MPa`],
                  ["單向閥","防止回流衝擊",`≥${valve.Q}L/min，開啟壓0.05MPa`],
                  ["流量控制閥","速度調節",`0~${valve.Q}L/min可調`],
                  ["壓力錶+截止閥","壓力監測",`量程≥${Math.ceil(meta.pressure*1.5)}MPa`],
                ].map(([a,b,c],i)=>(
                  <tr key={i} style={S.trAlt(i)}>
                    <td style={{...S.td,fontWeight:700}}>{a}</td>
                    <td style={{...S.td,color:C.muted}}>{b}</td>
                    <td style={{...S.td,color:C.muted,fontSize:12}}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {matchResults && (
          <>
            <MatchSection title="🏭 方向閥品牌型號匹配" matchData={matchResults.directionalValves} matchResults={matchResults} category="directionalValve" />
            <MatchSection title="🏭 溢流閥品牌型號匹配" matchData={matchResults.reliefValves} matchResults={matchResults} category="reliefValve" />
          </>
        )}
      </>
    ),
    report:(
      <>
        <div style={S.specCard}>
          <div style={{fontSize:14,fontWeight:800,color:C.accent,marginBottom:14,borderBottom:`2px solid ${C.accent}`,paddingBottom:10}}>系統串聯設計流程</div>
          {[
            ["確認需求",`推力 ${params.force_kN} kN · 速度 ${params.speed_mmps} mm/s · 行程 ${params.stroke_mm} mm · 壓力 ${params.pressure_MPa} MPa`],
            ["油壓缸",`缸徑 ⌀${cyl.bore}mm × 桿徑 ⌀${cyl.rod}mm × 行程 ${cyl.stroke}mm，需求流量 ${cyl.Q} L/min`],
            ["油壓泵",`排量 ${pump.disp} cc/rev，輸出流量 ${pump.Q} L/min，軸功率 ${pump.power} kW`],
            ["電機",`額定功率 ${motor.kW} kW，${motor.isServo?"伺服電機（閉環控制）":"三相感應電機+VFD"}`],
            ["閥件",`方向閥 ${valve.Q}L/min / ${valve.P}MPa，溢流閥設定 ${valve.relief}MPa`],
          ].map(([t,d],i)=>(
            <div key={i} style={S.flowStep}>
              <div style={S.stepNum}>{i+1}</div>
              <div><div style={{fontWeight:700,color:C.text,marginBottom:4}}>{t}</div><div style={{fontSize:12,color:C.muted}}>{d}</div></div>
            </div>
          ))}
        </div>

        {/* 各品牌完整選型方案 */}
        {matchResults && (
          <div style={S.specCard}>
            <div style={{fontSize:14,fontWeight:800,color:C.accent,marginBottom:14,borderBottom:`2px solid ${C.accent}`,paddingBottom:10}}>各品牌完整選型方案</div>
            {(() => {
              const allBrands = new Map();
              const categories = [
                { key: 'pumps', label: '泵' },
                { key: 'directionalValves', label: '方向閥' },
                { key: 'reliefValves', label: '溢流閥' },
                { key: 'cylinders', label: '���壓缸' },
                { key: 'motors', label: '電機' },
              ];
              for (const cat of categories) {
                const catData = matchResults[cat.key];
                if (!catData) continue;
                for (const [brandKey, data] of Object.entries(catData)) {
                  if (!allBrands.has(brandKey)) {
                    allBrands.set(brandKey, { brand: data.brand, origin: data.origin, items: [] });
                  }
                  if (!data.noMatch) {
                    for (const m of data.matches) {
                      allBrands.get(brandKey).items.push({
                        category: cat.label,
                        model: m.matched.displayModel || m.matched.model,
                        series: m.series,
                      });
                    }
                  }
                }
              }
              return Array.from(allBrands.entries()).map(([brandKey, brandInfo]) => (
                <div key={brandKey} style={{...S.matchCard, borderLeft: brandKey==='propiston'?`4px solid ${C.orange}`:`4px solid ${C.accent}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:8}}>
                    <div>
                      <span style={{...S.matchBrand,color:brandKey==='propiston'?C.orange:C.accent}}>{brandInfo.brand}</span>
                      <span style={S.matchOrigin}>{brandInfo.origin}</span>
                    </div>
                    {brandKey==='propiston' ? (
                      <button style={S.quotationBtn} onClick={()=>{
                        const name = prompt("請輸入客戶名稱（選填）：") || "";
                        generateQuotationPDF(matchResults, name);
                      }}>
                        📄 生成報價單
                      </button>
                    ) : (
                      <button style={S.specSheetBtn} onClick={()=>generateSpecSheetPDF(matchResults, brandKey, brandInfo.brand)}>
                        📋 匯出建議規格
                      </button>
                    )}
                  </div>
                  {brandInfo.items.length > 0 ? (
                    <div style={{overflowX:"auto"}}>
                      <table style={{...S.table,fontSize:12}}>
                        <thead><tr><th style={{...S.th,fontSize:10}}>元件</th><th style={{...S.th,fontSize:10}}>系列</th><th style={{...S.th,fontSize:10}}>匹配型號</th></tr></thead>
                        <tbody>
                          {brandInfo.items.map((item,i)=>(
                            <tr key={i} style={S.trAlt(i)}>
                              <td style={{...S.td,fontWeight:600,color:C.accent}}>{item.category}</td>
                              <td style={{...S.td,color:C.muted}}>{item.series}</td>
                              <td style={{...S.td,fontWeight:700,fontFamily:"monospace"}}>{item.model}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{color:C.muted,fontSize:12,fontStyle:"italic"}}>此品牌無完整匹配方案</div>
                  )}
                </div>
              ));
            })()}
          </div>
        )}

        <div style={S.specCard}>
          <div style={{fontSize:14,fontWeight:800,color:C.accent,marginBottom:14,borderBottom:`2px solid ${C.accent}`,paddingBottom:10}}>⚠ 工程注意事項</div>
          {[
            "本選型基於理論計算，實際應用需考慮安裝方式（拉力/推力）、導向及環境溫度對液壓油黏度的影響。",
            "元件額定壓力建議 ≥ 系統最高壓力 × 1.3（安全係數）。",
            `油箱容積建議 ${(Number(pump.Q)*3).toFixed(0)}~${(Number(pump.Q)*5).toFixed(0)} 公升（泵流量3~5倍）。`,
            motor.isServo?"伺服液壓建議加裝壓力/流量感測器實現閉環控制，節能30~60%��":"感應電機建議搭配VFD軟啟動，減少電流衝擊並延長壽命。",
          ].map((n,i)=>(
            <div key={i} style={{fontSize:13,color:C.muted,padding:"7px 0",borderBottom:i<3?`1px dashed ${C.border}`:"none",lineHeight:1.65}}>
              {i+1}. {n}
            </div>
          ))}
        </div>
      </>
    )
  };

  return(
    <div style={S.root}>
      <style>{globalCSS}</style>
      <div style={S.header}>
        <div style={S.logoBg}>
          <div style={S.logoMark}/>
          <div><div style={S.logoText}>PROPISTON HydroSelect</div></div>
        </div>
        <div style={S.headerRight}>
          <button style={S.backBtn} onClick={()=>setPhase("form")}>�� 返回修改</button>
        </div>
      </div>
      <div style={S.body}>
        {/* System bar */}
        <div style={S.sysBar}>
          {[
            [cyl.bore+"mm","缸徑"],[pump.disp+"cc","泵排量"],
            [motor.kW+"kW","電機功率"],[valve.Q+"L","閥件流量"],
            [meta.pressure+"MPa","系統壓力"],[motor.isServo?"伺服":"感應","電機類型"],
          ].map(([v,k],i)=>(
            <div key={i} style={{...S.sysItem,borderLeft:k==="電機類型"&&motor.isServo?`3px solid ${C.purple}`:`3px solid ${C.accent}`}}>
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
