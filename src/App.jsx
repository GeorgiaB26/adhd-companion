import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid } from "recharts";
import { Heart, Brain, Zap, Sun, Moon, Cloud, CloudRain, AlertTriangle, Check, Plus, X, ChevronLeft, ChevronRight, Pill, Wind, Clock, Bell, TrendingDown, TrendingUp, Activity, BookOpen, Smile, Trash2, Star, Shield, Eye, Target, Volume2, VolumeX, Feather, MoreHorizontal, Play, Pause, RotateCcw, Sparkles, Trophy, FileText, ChevronDown, ChevronUp, Bed, Droplets, Coffee, ListChecks, Rocket, Timer } from "lucide-react";

// ─── Theme ──────────────────────────────────────────────────────────
const C = {
  bg: "#FFF8F0", card: "#FFFFFF", cardAlt: "#FFF5EB",
  pri: "#E8985E", priL: "#F5C8A0", priD: "#C47A3F",
  acc: "#7EB5A6", accL: "#B5DDD1", accD: "#5A9485",
  warn: "#E8B44E", danger: "#D4736A", dangerL: "#F0B5AF",
  txt: "#4A3728", txtL: "#8B7355", txtM: "#B8A48E",
  brd: "#F0E0CC", purp: "#9B8EC4", purpL: "#C5BBE0",
  rose: "#D4736A", roseL: "#F0B5AF",
};

// ─── Constants ──────────────────────────────────────────────────────
const MOODS = [
  { emoji: "😊", label: "Great", value: 5, color: "#7EB5A6" },
  { emoji: "🙂", label: "Good", value: 4, color: "#A8D0C4" },
  { emoji: "😐", label: "Okay", value: 3, color: "#E8B44E" },
  { emoji: "😔", label: "Low", value: 2, color: "#E8985E" },
  { emoji: "😢", label: "Struggling", value: 1, color: "#D4736A" },
];
const ENERGY = [
  { label: "Hyperfocus", value: 5, color: "#E8B44E" },
  { label: "Energised", value: 4, color: "#7EB5A6" },
  { label: "Neutral", value: 3, color: "#B8A48E" },
  { label: "Foggy", value: 2, color: "#9B8EC4" },
  { label: "Drained", value: 1, color: "#D4736A" },
];
const FOCUS = [
  { label: "Laser", value: 5 }, { label: "Good", value: 4 }, { label: "Scattered", value: 3 },
  { label: "Distracted", value: 2 }, { label: "Can't focus", value: 1 },
];
const SLEEP_QUALITY = [
  { emoji: "😴", label: "Deep & restful", value: 5, color: "#7EB5A6" },
  { emoji: "🙂", label: "Pretty good", value: 4, color: "#A8D0C4" },
  { emoji: "😐", label: "So-so", value: 3, color: "#E8B44E" },
  { emoji: "😩", label: "Restless", value: 2, color: "#E8985E" },
  { emoji: "💀", label: "Terrible", value: 1, color: "#D4736A" },
];
const EMOTIONS = [
  "Overwhelmed","Restless","Frustrated","Anxious","Impulsive","Hyperfocused","Creative",
  "Scattered","Calm","Motivated","Paralysed","Irritable","Hopeful","Exhausted","Euphoric",
  "Rejected","Bored","Determined","Confused","Grateful",
];
const SIDE_EFFECTS = [
  "Dry mouth","Loss of appetite","Insomnia","Headache","Nausea","Jitteriness","Mood swings",
  "Fatigue","Irritability","Heart racing","Stomach pain","Dizziness","Brain fog clearing","Improved focus",
];
const CYCLE_PHASES = [
  { id:"menstrual", label:"Period", emoji:"🔴", color:"#D4736A", desc:"Energy often lowest. ADHD meds may feel less effective. Be extra gentle." },
  { id:"follicular", label:"Follicular", emoji:"🌱", color:"#7EB5A6", desc:"Rising oestrogen — often your best ADHD days. Ride the wave!" },
  { id:"ovulation", label:"Ovulation", emoji:"☀️", color:"#E8B44E", desc:"Peak energy & sociability. Great time for big tasks." },
  { id:"luteal_early", label:"Early Luteal", emoji:"🍂", color:"#E8985E", desc:"Progesterone rises. Focus may dip. Plan lighter tasks." },
  { id:"luteal_late", label:"Late Luteal", emoji:"🌊", color:"#9B8EC4", desc:"ADHD symptoms often spike. Emotional dysregulation is NORMAL here." },
  { id:"unsure", label:"Not sure", emoji:"❓", color:"#B8A48E", desc:"That's okay — tracking helps you learn your patterns." },
  { id:"na", label:"N/A", emoji:"➖", color:"#B8A48E", desc:"" },
];
const CYCLE_SYMPTOMS = [
  "Cramps","Bloating","Headache","Fatigue","Mood swings","Breast tenderness",
  "Back pain","Cravings","Insomnia","Brain fog","Irritability","Anxiety spike",
  "Crying easily","Low motivation","Sensory overload",
];
const JOURNAL_PROMPTS = [
  "What's taking up the most space in your head right now?",
  "What would you tell your best friend if they were feeling how you feel?",
  "Name three things that went okay today — even tiny ones.",
  "What does your body need right now that you've been ignoring?",
  "Is there something you need to let go of today?",
  "Describe how your brain feels right now — fast, slow, foggy, racing?",
  "What's one kind thing you can do for yourself in the next hour?",
  "If your emotions were weather, what's the forecast?",
  "What boundary do you need to set or reinforce right now?",
  "Write a permission slip to yourself. What do you need permission to do or feel?",
  "What pattern have you noticed about your ADHD lately?",
  "When did you last feel truly calm? What were you doing?",
  "What does 'enough' look like for you today?",
  "What surprised you about yourself this week?",
  "What's something you're proud of that you haven't given yourself credit for?",
];
const GROUNDING = [
  { title:"5-4-3-2-1 Grounding", icon: Eye, color: C.acc, desc: "Brings you back to the present when your mind is racing.",
    steps:["Name 5 things you can SEE","Name 4 things you can TOUCH","Name 3 things you can HEAR","Name 2 things you can SMELL","Name 1 thing you can TASTE"]},
  { title:"Box Breathing", icon: Wind, color: C.purp, desc: "Activates your parasympathetic nervous system.",
    steps:["Breathe IN for 4 seconds","HOLD for 4 seconds","Breathe OUT for 4 seconds","HOLD for 4 seconds","Repeat 4 times"]},
  { title:"Body Scan", icon: Activity, color: C.pri, desc: "ADHD often disconnects us from our bodies. This reconnects you.",
    steps:["Close your eyes. Start at the top of your head.","Notice tension in your face & jaw. Let it soften.","Move to shoulders & neck. Release them.","Feel your arms, hands, fingers. Unclench.","Move through chest, belly, legs, feet. Breathe into each."]},
  { title:"Thought Defusion", icon: Brain, color: C.accD, desc: "You don't have to believe every thought your brain generates.",
    steps:["Notice the thought spiralling you.","Say: 'I notice I'm having the thought that...'","Imagine it as a cloud passing by.","You are the sky — vast and unchanging.","Gently bring attention back to now."]},
];
const COACHING = {
  spiral: [
    "Hey Georgia, things have been tough lately. That's okay — ADHD brains have waves, and this is just one.",
    "You've gotten through hard patches before. This feeling is temporary, even when it doesn't feel like it.",
    "Your worth isn't measured by your productivity. You matter just as you are, right now.",
  ],
  low: [
    "Low energy days are your brain asking for rest. Can you give yourself permission?",
    "Try the 2-minute rule: just ONE tiny thing. Sometimes that's enough to shift momentum.",
    "You don't have to catch up on everything today. Pick one thing. Just one.",
  ],
  enc: [
    "Look at you showing up for yourself! Every check-in matters.",
    "Tracking is self-care. You're building something valuable.",
    "Your future self will thank you for these data points.",
  ],
};
const DEFAULT_DOPAMINE = [
  { id:"d1", text:"Walk around the block", category:"movement" },
  { id:"d2", text:"Put on a favourite song & dance", category:"movement" },
  { id:"d3", text:"Call someone you love", category:"connection" },
  { id:"d4", text:"Make a cup of tea mindfully", category:"sensory" },
  { id:"d5", text:"Watch a comfort show for 20 mins", category:"rest" },
  { id:"d6", text:"Take a shower", category:"sensory" },
  { id:"d7", text:"Doodle or colour for 10 mins", category:"creative" },
  { id:"d8", text:"Step outside & feel the sun", category:"sensory" },
  { id:"d9", text:"Tidy one small surface", category:"movement" },
  { id:"d10", text:"Write 3 things you're grateful for", category:"reflection" },
];
const DOPAMINE_CATS = { movement:"🏃", connection:"💬", sensory:"✨", rest:"🛋️", creative:"🎨", reflection:"📝", other:"💫" };

// ─── Helpers ────────────────────────────────────────────────────────
const dateKey = (d = new Date()) => d.toISOString().split("T")[0];
const timeStr = () => new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});
const dayName = s => new Date(s).toLocaleDateString("en-AU",{weekday:"short"});
const fmtDate = s => new Date(s).toLocaleDateString("en-AU",{day:"numeric",month:"short"});
const recentDays = n => { const d=[]; for(let i=n-1;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);d.push(dateKey(x))} return d; };
const pick = a => a[Math.floor(Math.random()*a.length)];

function detectSpiral(entries) {
  if(!entries||entries.length<3) return null;
  const m = entries.slice(-5).map(e=>e.mood).filter(Boolean);
  if(m.length<3) return null;
  const avg = m.reduce((a,b)=>a+b,0)/m.length;
  const dec = m.every((v,i)=>i===0||v<=m[i-1]);
  const r = m.slice(-3); const ra = r.reduce((a,b)=>a+b,0)/r.length;
  if(ra<=2&&dec) return "spiral";
  if(ra<=2) return "low";
  if(avg>=4) return "high";
  return null;
}

// ─── UI Primitives ──────────────────────────────────────────────────
const Card = ({children, style, onClick}) => (
  <div onClick={onClick} style={{background:C.card,borderRadius:20,padding:20,marginBottom:16,boxShadow:"0 2px 12px rgba(74,55,40,0.06)",border:`1px solid ${C.brd}`,cursor:onClick?"pointer":"default",transition:"transform 0.2s",...style}}>
    {children}
  </div>
);
const Btn = ({children,onClick,v="pri",sz="md",style,disabled}) => {
  const vs = {pri:{bg:C.pri,c:"#fff",bd:"none"},sec:{bg:"transparent",c:C.pri,bd:`2px solid ${C.pri}`},acc:{bg:C.acc,c:"#fff",bd:"none"},danger:{bg:C.danger,c:"#fff",bd:"none"},ghost:{bg:"transparent",c:C.txtL,bd:"none"}};
  const szs = {sm:{p:"6px 14px",f:13,r:10},md:{p:"10px 22px",f:15,r:14},lg:{p:"14px 28px",f:17,r:16}};
  const vv=vs[v]||vs.pri, ss=szs[sz]||szs.md;
  return <button disabled={disabled} onClick={onClick} style={{background:disabled?C.txtM:vv.bg,color:vv.c,border:vv.bd,borderRadius:ss.r,padding:ss.p,fontSize:ss.f,fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all 0.2s",fontFamily:"inherit",opacity:disabled?0.5:1,...style}}>{children}</button>;
};
const Chips = ({options,selected,onToggle,multi}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
    {options.map(o => {
      const sel = multi ? selected?.includes(o) : selected===o;
      return <button key={o} onClick={()=>onToggle(o)} style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${sel?C.pri:C.brd}`,background:sel?C.priL+"60":C.bg,color:sel?C.priD:C.txtL,fontSize:13,fontWeight:sel?600:400,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit"}}>{o}</button>;
    })}
  </div>
);
const TabBar = ({tabs,active,onChange}) => (
  <div style={{display:"flex",background:C.card,borderTop:`1px solid ${C.brd}`,position:"fixed",bottom:0,left:0,right:0,zIndex:100,padding:"4px 0 env(safe-area-inset-bottom, 6px)",boxShadow:"0 -2px 16px rgba(74,55,40,0.08)",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)} style={{flex:"0 0 auto",minWidth:60,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 8px",background:"none",border:"none",cursor:"pointer",color:active===t.id?C.pri:C.txtM,transition:"color 0.2s",fontFamily:"inherit"}}>
        <t.icon size={20} strokeWidth={active===t.id?2.5:1.8}/>
        <span style={{fontSize:9,fontWeight:active===t.id?700:500}}>{t.label}</span>
      </button>
    ))}
  </div>
);

// ─── Breathing Circle ───────────────────────────────────────────────
const BreathCircle = ({active,phase,sec}) => {
  const s = phase==="in"||phase==="hold-in"?1.4:phase==="out"||phase==="hold-out"?0.8:1;
  const l = {"in":"Breathe In","hold-in":"Hold","out":"Breathe Out","hold-out":"Hold","ready":"Tap Start"};
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:24}}>
      <div style={{width:150,height:150,borderRadius:"50%",background:`radial-gradient(circle,${C.accL},${C.acc})`,display:"flex",alignItems:"center",justifyContent:"center",transform:`scale(${active?s:1})`,transition:"transform 4s ease-in-out",boxShadow:`0 0 ${active?40:20}px ${C.accL}`}}>
        <div style={{textAlign:"center",color:"#fff"}}>
          <div style={{fontSize:17,fontWeight:700}}>{l[phase]||"Ready"}</div>
          {active&&<div style={{fontSize:30,fontWeight:300,marginTop:4}}>{sec}</div>}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function ADHDCompanion() {
  const [tab, setTab] = useState("home");
  const [entries, setEntries] = useState([]);
  const [meds, setMeds] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [wins, setWins] = useState([]);
  const [dopamineMenu, setDopamineMenu] = useState(DEFAULT_DOPAMINE);
  const [notif, setNotif] = useState(null);

  // Check-in
  const [ci, setCi] = useState({mood:null,energy:null,focus:null,emotions:[],note:"",medTaken:{},sideEffects:[],cycle:null,cycleDay:"",cycleSymptoms:[],sleepHours:"",sleepQuality:null,sleepNotes:""});
  const updateCi = (k,v) => setCi(p=>({...p,[k]:v}));
  const resetCi = () => setCi({mood:null,energy:null,focus:null,emotions:[],note:"",medTaken:{},sideEffects:[],cycle:null,cycleDay:"",cycleSymptoms:[],sleepHours:"",sleepQuality:null,sleepNotes:""});

  // Forms
  const [showMedForm, setShowMedForm] = useState(false);
  const [showRemForm, setShowRemForm] = useState(false);
  const [medForm, setMedForm] = useState({name:"",dosage:"",time:"morning"});
  const [remForm, setRemForm] = useState({text:"",time:"09:00",type:"task"});

  // Journal
  const [journalText, setJournalText] = useState("");
  const [journalMood, setJournalMood] = useState(null);
  const [prompt, setPrompt] = useState(()=>pick(JOURNAL_PROMPTS));
  const [viewJournal, setViewJournal] = useState(null);
  const [journalTab, setJournalTab] = useState("write"); // write | wins

  // Wins
  const [winText, setWinText] = useState("");

  // Dopamine
  const [newDopamine, setNewDopamine] = useState("");
  const [newDopCat, setNewDopCat] = useState("other");

  // Toolkit
  const [toolkitSection, setToolkitSection] = useState("coach"); // coach | timer | paralysis | dopamine
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("ready");
  const [breathSec, setBreathSec] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);
  const [activeEx, setActiveEx] = useState(null);
  const [exStep, setExStep] = useState(0);

  // Focus Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSec, setTimerSec] = useState(15*60);
  const [timerWork, setTimerWork] = useState(true);
  const [timerPreset, setTimerPreset] = useState(15);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef(null);

  // Task Paralysis
  const [paraTask, setParaTask] = useState("");
  const [paraSteps, setParaSteps] = useState([]);
  const [paraStep, setParaStep] = useState(0);
  const [paraStarted, setParaStarted] = useState(false);

  // ─── Sample Data ──────────────────────────────────────────────────
  useEffect(() => {
    const sample = [];
    recentDays(14).forEach((day,i) => {
      if(Math.random()>0.2) sample.push({
        id:`s${i}`,date:day,time:"09:30",
        mood:Math.max(1,Math.min(5,Math.round(3+Math.sin(i*0.8)*2))),
        energy:Math.max(1,Math.min(5,Math.round(3+Math.cos(i*0.6)*1.5))),
        focus:Math.max(1,Math.min(5,Math.round(3+Math.sin(i*0.4)*1.5))),
        emotions:[EMOTIONS[i%EMOTIONS.length],EMOTIONS[(i+5)%EMOTIONS.length]],
        note:"",medTaken:{},sideEffects:[],cycle:CYCLE_PHASES[i%5].id,cycleDay:"",cycleSymptoms:[],
        sleepHours:String(Math.round(5+Math.random()*4)),sleepQuality:Math.max(1,Math.min(5,Math.round(3+Math.sin(i*0.5)*1.5))),sleepNotes:"",
      });
    });
    setEntries(sample);
    setMeds([{id:"m1",name:"Vyvanse",dosage:"30mg",time:"morning"},{id:"m2",name:"Melatonin",dosage:"5mg",time:"evening"}]);
    setReminders([
      {id:"r1",text:"Take morning medication",time:"07:30",type:"medication",active:true},
      {id:"r2",text:"Afternoon check-in",time:"14:00",type:"checkin",active:true},
      {id:"r3",text:"Wind down routine",time:"21:00",type:"task",active:true},
    ]);
    setWins([
      {id:"w1",text:"Replied to that email I'd been avoiding for a week",date:dateKey(),time:"10:00"},
      {id:"w2",text:"Made it to my appointment on time",date:dateKey(),time:"14:00"},
      {id:"w3",text:"Cooked a proper meal instead of skipping dinner",date:recentDays(3)[0],time:"19:00"},
    ]);
  },[]);

  // Breathing timer
  useEffect(()=>{
    if(!breathActive) return;
    const phases=["in","hold-in","out","hold-out"];
    let pi=0, s=4;
    setBreathPhase(phases[0]); setBreathSec(4);
    const iv = setInterval(()=>{
      s--;
      if(s<=0){
        pi++;
        if(pi>=phases.length){
          pi=0;
          setBreathCycles(c=>{
            if(c+1>=4){setBreathActive(false);setBreathPhase("ready");notify("4 cycles complete. How do you feel?","success");return 0;}
            return c+1;
          });
        }
        s=4; setBreathPhase(phases[pi]);
      }
      setBreathSec(s);
    },1000);
    return ()=>clearInterval(iv);
  },[breathActive]);

  // Focus timer
  useEffect(()=>{
    if(!timerRunning) return;
    timerRef.current = setInterval(()=>{
      setTimerSec(s=>{
        if(s<=1){
          setTimerRunning(false);
          if(timerWork){
            setSessionsCompleted(c=>c+1);
            notify("Focus session done! Take a 5-minute break.","success");
            setTimerWork(false);
            return 5*60;
          } else {
            notify("Break's over! Ready for another round?","info");
            setTimerWork(true);
            return timerPreset*60;
          }
        }
        return s-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[timerRunning, timerWork, timerPreset]);

  // Spiral detection
  useEffect(()=>{
    if(detectSpiral(entries)==="spiral") notify("I've noticed a downward pattern. This is a wave, not a cliff. Want to try a grounding exercise?","warn");
  },[entries]);

  const notify = (msg,type="info") => { setNotif({msg,type}); setTimeout(()=>setNotif(null),5000); };

  // ─── Actions ──────────────────────────────────────────────────────
  const submitCheckin = () => {
    if(!ci.mood){notify("Select a mood first","warn");return;}
    setEntries(p=>[...p,{id:Date.now().toString(),date:dateKey(),time:timeStr(),...ci}]);
    resetCi();
    notify(pick(COACHING.enc),"success");
    setTab("home");
  };
  const addMed = () => {
    if(!medForm.name.trim()) return;
    setMeds(p=>[...p,{id:Date.now().toString(),...medForm}]);
    setMedForm({name:"",dosage:"",time:"morning"});
    setShowMedForm(false);
    notify("Medication added!");
  };
  const addReminder = () => {
    if(!remForm.text.trim()) return;
    setReminders(p=>[...p,{id:Date.now().toString(),...remForm,active:true}]);
    setRemForm({text:"",time:"09:00",type:"task"});
    setShowRemForm(false);
    notify("Reminder set!");
  };
  const saveJournal = () => {
    if(!journalText.trim()){notify("Write something first — even one sentence counts.","warn");return;}
    setJournalEntries(p=>[...p,{id:Date.now().toString(),date:dateKey(),time:timeStr(),text:journalText.trim(),mood:journalMood,prompt,words:journalText.trim().split(/s+/).length}]);
    setJournalText(""); setJournalMood(null);
    notify("Journal entry saved. Writing is processing — well done.","success");
  };
  const addWin = () => {
    if(!winText.trim()) return;
    setWins(p=>[...p,{id:Date.now().toString(),text:winText.trim(),date:dateKey(),time:timeStr()}]);
    setWinText("");
    notify("Win recorded! You're doing better than you think.","success");
  };
  const addDopamineItem = () => {
    if(!newDopamine.trim()) return;
    setDopamineMenu(p=>[...p,{id:Date.now().toString(),text:newDopamine.trim(),category:newDopCat}]);
    setNewDopamine("");
    notify("Added to your dopamine menu!");
  };

  // Task paralysis — break task into micro-steps
  const generateMicroSteps = () => {
    if(!paraTask.trim()) return;
    const task = paraTask.trim();
    // Generate contextual micro-steps
    const steps = [
      `Take a deep breath. You're going to do "${task}" and that's brave.`,
      "Stand up or shift your position. Change your physical state.",
      `What's the absolute SMALLEST first action? Not the whole task — just the first 30 seconds. Do that now.`,
      "Good. Now what's the next tiny piece? Just one more micro-step.",
      "You're moving. Keep this pace — one micro-action at a time.",
      "Check in: how does it feel to be in motion? Notice that.",
      `You're further into "${task}" than you were 5 minutes ago. That's real progress.`,
      "Almost there. One more small push.",
      "Done? Take a moment to feel that. You broke through the wall.",
    ];
    setParaSteps(steps);
    setParaStep(0);
    setParaStarted(true);
  };

  // ─── Computed Data ────────────────────────────────────────────────
  const days14 = recentDays(14);
  const chartData = days14.map(d => {
    const de = entries.filter(e=>e.date===d);
    const avg = (k) => de.length>0 ? Math.round(de.reduce((a,e)=>a+(e[k]||0),0)/de.length*10)/10 : null;
    return {date:fmtDate(d),day:dayName(d),mood:avg("mood"),energy:avg("energy"),focus:avg("focus"),sleep:avg("sleepQuality")};
  });
  const todayE = entries.filter(e=>e.date===dateKey());
  const recent7 = entries.slice(-7).map(e=>e.mood).filter(Boolean);
  const avgMood7 = recent7.length ? (recent7.reduce((a,b)=>a+b,0)/recent7.length).toFixed(1) : "—";
  const spiral = detectSpiral(entries);
  const streak = (()=>{let c=0;for(const d of recentDays(30).reverse()){if(entries.some(e=>e.date===d))c++;else break;}return c;})();
  const emotionFreq = {};
  entries.slice(-30).forEach(e=>(e.emotions||[]).forEach(em=>{emotionFreq[em]=(emotionFreq[em]||0)+1}));
  const topEmotions = Object.entries(emotionFreq).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([n,c])=>({name:n,count:c}));
  const sleepData = days14.map(d => {
    const de = entries.filter(e=>e.date===d);
    const hrs = de.length>0 ? de.map(e=>parseFloat(e.sleepHours)||0).filter(h=>h>0) : [];
    return {date:fmtDate(d),day:dayName(d),hours:hrs.length>0?Math.round(hrs.reduce((a,b)=>a+b,0)/hrs.length*10)/10:null};
  });

  // ─── Tabs Config ──────────────────────────────────────────────────
  const tabs = [
    {id:"home",icon:Heart,label:"Home"},
    {id:"checkin",icon:Smile,label:"Check In"},
    {id:"journal",icon:Feather,label:"Journal"},
    {id:"meds",icon:Pill,label:"Meds"},
    {id:"toolkit",icon:Shield,label:"Toolkit"},
    {id:"insights",icon:Activity,label:"Insights"},
    {id:"reminders",icon:Bell,label:"Reminders"},
  ];

  // ═════════════════════════════════════════════════════════════════
  // HOME
  // ═════════════════════════════════════════════════════════════════
  const renderHome = () => (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <img src="/logo.svg" alt="Hummingbird" style={{width:38,height:38}} />
          <h1 style={{fontSize:26,fontWeight:700,color:C.txt,margin:0}}>Hummingbird</h1>
        </div>
        <p style={{color:C.txtL,marginTop:4,fontSize:15,lineHeight:1.5}}>
          {spiral==="spiral" ? "I can see things have been tough. You're not alone — want to try a grounding exercise?"
           : spiral==="low" ? "Rough stretch. Lows are temporary. Be gentle with yourself today."
           : todayE.length>0 ? "You've already checked in today. That's you showing up for yourself."
           : "How are you feeling right now? A quick check-in takes just a moment."}
        </p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
        <Card style={{textAlign:"center",padding:14,marginBottom:0}}>
          <div style={{fontSize:22,fontWeight:700,color:C.pri}}>{avgMood7}</div>
          <div style={{fontSize:10,color:C.txtM,marginTop:2}}>Avg Mood (7d)</div>
        </Card>
        <Card style={{textAlign:"center",padding:14,marginBottom:0}}>
          <div style={{fontSize:22,fontWeight:700,color:C.acc}}>{streak}</div>
          <div style={{fontSize:10,color:C.txtM,marginTop:2}}>Day Streak</div>
        </Card>
        <Card style={{textAlign:"center",padding:14,marginBottom:0}}>
          <div style={{fontSize:22,fontWeight:700,color:C.purp}}>{sessionsCompleted}</div>
          <div style={{fontSize:10,color:C.txtM,marginTop:2}}>Focus Sessions</div>
        </Card>
      </div>

      {spiral==="spiral" && (
        <Card style={{background:C.dangerL+"40",border:`2px solid ${C.danger}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <AlertTriangle size={20} color={C.danger}/>
            <span style={{fontWeight:700,color:C.danger,fontSize:15}}>Pattern Alert</span>
          </div>
          <p style={{color:C.txt,fontSize:14,lineHeight:1.6,margin:"0 0 12px"}}>
            Your mood has been trending down. This might be the start of a spiral — but recognising it is powerful.
          </p>
          <Btn v="danger" sz="sm" onClick={()=>{setTab("toolkit");setToolkitSection("coach")}}>Get Support Now</Btn>
        </Card>
      )}

      {todayE.length===0 && (
        <Card onClick={()=>setTab("checkin")} style={{background:`linear-gradient(135deg,${C.priL}40,${C.accL}40)`,cursor:"pointer",textAlign:"center",padding:28}}>
          <Smile size={36} color={C.pri}/>
          <div style={{fontSize:17,fontWeight:600,color:C.txt,marginTop:10}}>How are you right now?</div>
          <div style={{fontSize:13,color:C.txtL,marginTop:4}}>Tap to do a quick check-in</div>
        </Card>
      )}

      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 16px"}}>Your Week</h3>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={chartData.slice(-7)}>
            <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.pri} stopOpacity={0.3}/><stop offset="95%" stopColor={C.pri} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="day" tick={{fontSize:11,fill:C.txtM}} axisLine={false} tickLine={false}/>
            <YAxis domain={[0,5]} hide/>
            <Tooltip contentStyle={{borderRadius:12,border:`1px solid ${C.brd}`,fontSize:13}}/>
            <Area type="monotone" dataKey="mood" stroke={C.pri} fill="url(#mg)" strokeWidth={2.5} dot={{fill:C.pri,r:4}} connectNulls/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <Card onClick={()=>{setTab("toolkit");setToolkitSection("timer")}} style={{cursor:"pointer",padding:16,marginBottom:0,textAlign:"center"}}>
          <Timer size={24} color={C.acc}/>
          <div style={{fontSize:13,fontWeight:600,color:C.txt,marginTop:6}}>Focus Timer</div>
        </Card>
        <Card onClick={()=>{setTab("journal");setJournalTab("wins")}} style={{cursor:"pointer",padding:16,marginBottom:0,textAlign:"center"}}>
          <Trophy size={24} color={C.warn}/>
          <div style={{fontSize:13,fontWeight:600,color:C.txt,marginTop:6}}>Log a Win</div>
        </Card>
      </div>

      {/* Recent wins */}
      {wins.length>0 && (
        <Card style={{background:C.warn+"10",border:`1px solid ${C.warn}30`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <Trophy size={18} color={C.warn}/>
            <span style={{fontWeight:600,fontSize:14,color:C.txt}}>Recent Wins</span>
          </div>
          {wins.slice(-3).reverse().map(w => (
            <div key={w.id} style={{fontSize:14,color:C.txt,padding:"6px 0",borderBottom:`1px solid ${C.brd}`,lineHeight:1.4}}>
              ⭐ {w.text}
              <span style={{fontSize:11,color:C.txtM,marginLeft:8}}>{fmtDate(w.date)}</span>
            </div>
          ))}
        </Card>
      )}

      {entries.slice(-3).reverse().map(e => (
        <Card key={e.id} style={{padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><span style={{fontSize:22,marginRight:8}}>{MOODS[5-e.mood]?.emoji}</span><span style={{fontSize:14,fontWeight:600,color:C.txt}}>{MOODS[5-e.mood]?.label}</span></div>
            <div style={{fontSize:12,color:C.txtM}}>{fmtDate(e.date)} {e.time}</div>
          </div>
          {e.emotions?.length>0 && <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{e.emotions.map(em=><span key={em} style={{fontSize:11,padding:"3px 10px",borderRadius:12,background:C.priL+"40",color:C.priD}}>{em}</span>)}</div>}
        </Card>
      ))}
    </div>
  );

  // ═════════════════════════════════════════════════════════════════
  // CHECK-IN
  // ═════════════════════════════════════════════════════════════════
  const renderCheckin = () => (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,color:C.txt,margin:"0 0 4px"}}>Check In</h2>
      <p style={{color:C.txtL,fontSize:14,margin:"0 0 24px"}}>No pressure — just honest, quick snapshots of right now.</p>

      {/* Mood */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>How's your mood?</h3>
        <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
          {MOODS.map(m=>(
            <button key={m.value} onClick={()=>updateCi("mood",m.value)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"12px 2px",borderRadius:16,background:ci.mood===m.value?m.color+"25":"transparent",border:ci.mood===m.value?`2px solid ${m.color}`:"2px solid transparent",cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit"}}>
              <span style={{fontSize:28}}>{m.emoji}</span>
              <span style={{fontSize:10,color:ci.mood===m.value?m.color:C.txtM,fontWeight:ci.mood===m.value?600:400}}>{m.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Energy */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Energy level?</h3>
        <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
          {ENERGY.map(e=>(
            <button key={e.value} onClick={()=>updateCi("energy",e.value)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"10px 2px",borderRadius:16,background:ci.energy===e.value?e.color+"25":"transparent",border:ci.energy===e.value?`2px solid ${e.color}`:"2px solid transparent",cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit"}}>
              <span style={{fontSize:12,color:ci.energy===e.value?e.color:C.txtM,fontWeight:ci.energy===e.value?600:400}}>{e.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Focus */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Focus quality?</h3>
        <div style={{display:"flex",gap:6}}>
          {FOCUS.map(f=>(
            <button key={f.value} onClick={()=>updateCi("focus",f.value)} style={{flex:1,padding:"10px 2px",borderRadius:12,background:ci.focus===f.value?C.purp+"25":"transparent",border:ci.focus===f.value?`2px solid ${C.purp}`:"2px solid transparent",cursor:"pointer",fontSize:12,fontFamily:"inherit",color:ci.focus===f.value?C.purp:C.txtM,fontWeight:ci.focus===f.value?600:400,transition:"all 0.2s"}}>{f.label}</button>
          ))}
        </div>
      </Card>

      {/* Sleep */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 4px"}}>
          <Bed size={16} style={{marginRight:6,verticalAlign:"middle"}}/>How did you sleep?
        </h3>
        <p style={{fontSize:12,color:C.txtL,margin:"0 0 14px"}}>Sleep is the #1 lever for ADHD symptoms.</p>
        <div style={{display:"flex",justifyContent:"space-between",gap:6,marginBottom:12}}>
          {SLEEP_QUALITY.map(s=>(
            <button key={s.value} onClick={()=>updateCi("sleepQuality",s.value)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 2px",borderRadius:14,background:ci.sleepQuality===s.value?s.color+"25":"transparent",border:ci.sleepQuality===s.value?`2px solid ${s.color}`:"2px solid transparent",cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit"}}>
              <span style={{fontSize:22}}>{s.emoji}</span>
              <span style={{fontSize:9,color:ci.sleepQuality===s.value?s.color:C.txtM,fontWeight:ci.sleepQuality===s.value?600:400}}>{s.label}</span>
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{flex:1}}>
            <label style={{fontSize:12,color:C.txtL,display:"block",marginBottom:4}}>Hours slept</label>
            <input value={ci.sleepHours} onChange={e=>updateCi("sleepHours",e.target.value)} placeholder="e.g. 7" type="number" min="0" max="24" step="0.5"
              style={{width:"100%",padding:10,borderRadius:10,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",background:C.bg}}/>
          </div>
          <div style={{flex:2}}>
            <label style={{fontSize:12,color:C.txtL,display:"block",marginBottom:4}}>Sleep notes (optional)</label>
            <input value={ci.sleepNotes} onChange={e=>updateCi("sleepNotes",e.target.value)} placeholder="Woke at 3am, racing thoughts..."
              style={{width:"100%",padding:10,borderRadius:10,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",background:C.bg}}/>
          </div>
        </div>
      </Card>

      {/* Emotions */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>What emotions are present?</h3>
        <Chips options={EMOTIONS} selected={ci.emotions} onToggle={em=>updateCi("emotions",ci.emotions.includes(em)?ci.emotions.filter(e=>e!==em):[...ci.emotions,em])} multi/>
      </Card>

      {/* Meds */}
      {meds.length>0 && (
        <Card>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Medication today?</h3>
          {meds.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.brd}`}}>
              <div><div style={{fontWeight:600,fontSize:14,color:C.txt}}>{m.name}</div><div style={{fontSize:12,color:C.txtM}}>{m.dosage} • {m.time}</div></div>
              <button onClick={()=>updateCi("medTaken",{...ci.medTaken,[m.id]:!ci.medTaken[m.id]})} style={{width:36,height:36,borderRadius:"50%",background:ci.medTaken[m.id]?C.acc:"transparent",border:`2px solid ${ci.medTaken[m.id]?C.acc:C.brd}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                <Check size={18} color={ci.medTaken[m.id]?"#fff":C.txtM}/>
              </button>
            </div>
          ))}
        </Card>
      )}

      {Object.values(ci.medTaken).some(Boolean) && (
        <Card>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Any side effects?</h3>
          <Chips options={SIDE_EFFECTS} selected={ci.sideEffects} onToggle={s=>updateCi("sideEffects",ci.sideEffects.includes(s)?ci.sideEffects.filter(x=>x!==s):[...ci.sideEffects,s])} multi/>
        </Card>
      )}

      {/* Cycle */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 4px"}}>
          <Droplets size={16} style={{marginRight:6,verticalAlign:"middle"}}/>Cycle check-in
        </h3>
        <p style={{fontSize:12,color:C.txtL,margin:"0 0 14px"}}>Hormones hugely affect ADHD — this is powerful data.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
          {CYCLE_PHASES.map(p=>(
            <button key={p.id} onClick={()=>updateCi("cycle",p.id)} style={{padding:"7px 12px",borderRadius:16,fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,background:ci.cycle===p.id?p.color+"25":"transparent",border:ci.cycle===p.id?`2px solid ${p.color}`:`2px solid ${C.brd}`,color:ci.cycle===p.id?p.color:C.txtL,fontWeight:ci.cycle===p.id?600:400,cursor:"pointer",transition:"all 0.2s"}}>
              <span>{p.emoji}</span>{p.label}
            </button>
          ))}
        </div>
        {ci.cycle && ci.cycle!=="na" && (
          <>
            {CYCLE_PHASES.find(p=>p.id===ci.cycle)?.desc && (
              <div style={{padding:"10px 14px",borderRadius:12,marginBottom:12,background:(CYCLE_PHASES.find(p=>p.id===ci.cycle)?.color||C.brd)+"15",fontSize:13,color:C.txt,lineHeight:1.5,fontStyle:"italic"}}>
                {CYCLE_PHASES.find(p=>p.id===ci.cycle)?.desc}
              </div>
            )}
            {ci.cycle!=="unsure" && (
              <input value={ci.cycleDay} onChange={e=>updateCi("cycleDay",e.target.value)} placeholder="Approx. cycle day (e.g. Day 14)" style={{width:"100%",padding:10,borderRadius:10,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",background:C.bg,marginBottom:12}}/>
            )}
            <Chips options={CYCLE_SYMPTOMS} selected={ci.cycleSymptoms} onToggle={s=>updateCi("cycleSymptoms",ci.cycleSymptoms.includes(s)?ci.cycleSymptoms.filter(x=>x!==s):[...ci.cycleSymptoms,s])} multi/>
          </>
        )}
      </Card>

      {/* Notes */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 10px"}}>Anything else on your mind?</h3>
        <textarea value={ci.note} onChange={e=>updateCi("note",e.target.value)} placeholder="Stream of consciousness is welcome here..."
          style={{width:"100%",minHeight:80,borderRadius:12,border:`1.5px solid ${C.brd}`,padding:14,fontSize:14,fontFamily:"inherit",resize:"vertical",background:C.bg,color:C.txt,outline:"none",boxSizing:"border-box"}}/>
      </Card>

      <Btn onClick={submitCheckin} sz="lg" style={{width:"100%",marginBottom:16}}>Save Check-in</Btn>
    </div>
  );

  // ═════════════════════════════════════════════════════════════════
  // JOURNAL + WINS
  // ═════════════════════════════════════════════════════════════════
  const renderJournal = () => {
    // Viewing single entry
    if(viewJournal){
      const e = journalEntries.find(x=>x.id===viewJournal);
      if(!e){setViewJournal(null);return null;}
      return (
        <div>
          <button onClick={()=>setViewJournal(null)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:C.pri,fontWeight:600,fontSize:14,fontFamily:"inherit",padding:0,marginBottom:16}}>
            <ChevronLeft size={18}/> Back
          </button>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <span style={{fontSize:13,color:C.txtM}}>{fmtDate(e.date)} at {e.time}</span>
              {e.mood && <span style={{fontSize:22}}>{MOODS[5-e.mood]?.emoji}</span>}
            </div>
            {e.prompt && <div style={{padding:"10px 14px",borderRadius:12,background:C.purpL+"20",fontSize:13,color:C.purp,fontStyle:"italic",marginBottom:16,borderLeft:`3px solid ${C.purp}`}}>Prompt: {e.prompt}</div>}
            <p style={{fontSize:15,lineHeight:1.8,color:C.txt,margin:0,whiteSpace:"pre-wrap"}}>{e.text}</p>
            <div style={{fontSize:12,color:C.txtM,marginTop:16}}>{e.words} words</div>
          </Card>
          <Btn v="danger" sz="sm" onClick={()=>{setJournalEntries(p=>p.filter(x=>x.id!==e.id));setViewJournal(null);notify("Entry deleted.")}}>
            <Trash2 size={14} style={{marginRight:6}}/> Delete
          </Btn>
        </div>
      );
    }

    return (
      <div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.txt,margin:"0 0 16px"}}>Journal & Wins</h2>

        {/* Sub-tabs */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {[{id:"write",label:"Free Write",icon:Feather},{id:"wins",label:"Wins Jar",icon:Trophy}].map(t=>(
            <button key={t.id} onClick={()=>setJournalTab(t.id)} style={{flex:1,padding:"12px 8px",borderRadius:14,border:journalTab===t.id?`2px solid ${C.pri}`:`2px solid ${C.brd}`,background:journalTab===t.id?C.priL+"30":"transparent",color:journalTab===t.id?C.pri:C.txtL,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s"}}>
              <t.icon size={18}/>{t.label}
            </button>
          ))}
        </div>

        {journalTab==="write" ? (
          <>
            {/* Prompt */}
            <Card style={{background:C.purpL+"15",border:`1px solid ${C.purpL}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.purp,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Writing Prompt</div>
                  <p style={{fontSize:15,color:C.txt,lineHeight:1.6,margin:0,fontStyle:"italic"}}>"{prompt}"</p>
                </div>
                <button onClick={()=>{let n;do{n=pick(JOURNAL_PROMPTS)}while(n===prompt);setPrompt(n)}} style={{background:C.purp+"20",border:"none",borderRadius:10,padding:8,cursor:"pointer",marginLeft:12,flexShrink:0}}>
                  <MoreHorizontal size={18} color={C.purp}/>
                </button>
              </div>
            </Card>

            {/* Write */}
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:0}}>Free Write</h3>
                <span style={{fontSize:12,color:C.txtM}}>{journalText.trim()?`${journalText.trim().split(/s+/).length} words`:""}  </span>
              </div>
              <textarea value={journalText} onChange={e=>setJournalText(e.target.value)}
                placeholder="Start writing... no rules, no structure. Spelling doesn't matter. Just get it out of your head."
                style={{width:"100%",minHeight:200,borderRadius:14,border:`1.5px solid ${C.brd}`,padding:16,fontSize:15,fontFamily:"'Georgia',serif",resize:"vertical",background:C.bg,color:C.txt,outline:"none",lineHeight:1.8,boxSizing:"border-box"}}/>
              <div style={{marginTop:12}}>
                <div style={{fontSize:13,color:C.txtL,marginBottom:8}}>How does writing this make you feel?</div>
                <div style={{display:"flex",gap:8}}>
                  {MOODS.map(m=>(
                    <button key={m.value} onClick={()=>setJournalMood(journalMood===m.value?null:m.value)} style={{fontSize:24,padding:6,background:journalMood===m.value?m.color+"25":"transparent",border:journalMood===m.value?`2px solid ${m.color}`:"2px solid transparent",borderRadius:12,cursor:"pointer",transition:"all 0.2s"}}>{m.emoji}</button>
                  ))}
                </div>
              </div>
              <Btn onClick={saveJournal} style={{width:"100%",marginTop:16}}>Save Entry</Btn>
            </Card>

            {journalEntries.length>0 && (
              <>
                <h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:12}}>Past Entries ({journalEntries.length})</h3>
                {journalEntries.slice().reverse().map(e=>(
                  <Card key={e.id} onClick={()=>setViewJournal(e.id)} style={{cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {e.mood && <span style={{fontSize:18}}>{MOODS[5-e.mood]?.emoji}</span>}
                        <span style={{fontSize:13,color:C.txtM}}>{fmtDate(e.date)}</span>
                      </div>
                      <span style={{fontSize:11,color:C.txtM}}>{e.words} words</span>
                    </div>
                    <p style={{fontSize:14,color:C.txt,margin:0,lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{e.text}</p>
                  </Card>
                ))}
              </>
            )}
          </>
        ) : (
          /* ─── WINS JAR ─── */
          <>
            <Card style={{background:`linear-gradient(135deg,${C.warn}15,${C.pri}10)`,border:`1px solid ${C.warn}40`}}>
              <div style={{textAlign:"center",marginBottom:16}}>
                <Trophy size={36} color={C.warn}/>
                <h3 style={{fontSize:16,fontWeight:700,color:C.txt,margin:"8px 0 4px"}}>Your Wins Jar</h3>
                <p style={{fontSize:13,color:C.txtL,margin:0}}>ADHD brains forget wins almost instantly. Capture them here so you can look back on hard days.</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <input value={winText} onChange={e=>setWinText(e.target.value)} placeholder="I did the thing! (even tiny wins count)"
                  onKeyDown={e=>{if(e.key==="Enter")addWin()}}
                  style={{flex:1,padding:12,borderRadius:12,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"}}/>
                <Btn onClick={addWin} sz="md">Add</Btn>
              </div>
            </Card>

            {wins.length>0 && (
              <Card>
                <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 12px"}}>All Wins ({wins.length})</h3>
                {wins.slice().reverse().map(w=>(
                  <div key={w.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:`1px solid ${C.brd}`}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,color:C.txt,lineHeight:1.5}}>⭐ {w.text}</div>
                      <div style={{fontSize:11,color:C.txtM,marginTop:2}}>{fmtDate(w.date)} at {w.time}</div>
                    </div>
                    <button onClick={()=>setWins(p=>p.filter(x=>x.id!==w.id))} style={{background:"none",border:"none",cursor:"pointer",padding:6}}>
                      <Trash2 size={14} color={C.txtM}/>
                    </button>
                  </div>
                ))}
              </Card>
            )}

            {wins.length===0 && (
              <Card style={{textAlign:"center",padding:30}}>
                <Star size={32} color={C.txtM}/>
                <p style={{color:C.txtM,marginTop:10}}>No wins yet. Did you get out of bed today? That counts.</p>
              </Card>
            )}
          </>
        )}
      </div>
    );
  };

  // ═════════════════════════════════════════════════════════════════
  // MEDS
  // ═════════════════════════════════════════════════════════════════
  const renderMeds = () => {
    const seFreq = {};
    entries.forEach(e=>(e.sideEffects||[]).forEach(s=>{seFreq[s]=(seFreq[s]||0)+1}));
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:C.txt,margin:0}}>Medications</h2><p style={{color:C.txtL,fontSize:13,margin:"4px 0 0"}}>Track what you take & how it affects you</p></div>
          <Btn sz="sm" onClick={()=>setShowMedForm(true)}><Plus size={16} style={{marginRight:4}}/> Add</Btn>
        </div>

        {showMedForm && (
          <Card style={{border:`2px solid ${C.pri}`}}>
            <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Add Medication</h3>
            <input value={medForm.name} onChange={e=>setMedForm(p=>({...p,name:e.target.value}))} placeholder="Medication name" style={{width:"100%",padding:12,borderRadius:12,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",marginBottom:10,boxSizing:"border-box",background:C.bg}}/>
            <input value={medForm.dosage} onChange={e=>setMedForm(p=>({...p,dosage:e.target.value}))} placeholder="Dosage (e.g. 30mg)" style={{width:"100%",padding:12,borderRadius:12,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",marginBottom:10,boxSizing:"border-box",background:C.bg}}/>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {["morning","afternoon","evening","as needed"].map(t=>(
                <button key={t} onClick={()=>setMedForm(p=>({...p,time:t}))} style={{flex:1,padding:"8px 4px",borderRadius:10,fontSize:12,fontFamily:"inherit",background:medForm.time===t?C.pri:"transparent",color:medForm.time===t?"#fff":C.txtL,border:`1.5px solid ${medForm.time===t?C.pri:C.brd}`,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={addMed} style={{flex:1}}>Save</Btn>
              <Btn v="ghost" onClick={()=>setShowMedForm(false)}>Cancel</Btn>
            </div>
          </Card>
        )}

        {meds.map(m=>(
          <Card key={m.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:14,background:C.accL+"60",display:"flex",alignItems:"center",justifyContent:"center"}}><Pill size={22} color={C.accD}/></div>
                <div><div style={{fontWeight:600,fontSize:16,color:C.txt}}>{m.name}</div><div style={{fontSize:13,color:C.txtM}}>{m.dosage} • {m.time}</div></div>
              </div>
              <button onClick={()=>setMeds(p=>p.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",cursor:"pointer",padding:8}}><Trash2 size={18} color={C.txtM}/></button>
            </div>
          </Card>
        ))}

        {meds.length===0&&!showMedForm && <Card style={{textAlign:"center",padding:40}}><Pill size={36} color={C.txtM}/><p style={{color:C.txtM,marginTop:12}}>No medications added yet.</p></Card>}

        {Object.keys(seFreq).length>0 && (
          <Card>
            <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Side Effects Reported</h3>
            <p style={{fontSize:13,color:C.txtL,marginBottom:12}}>This data helps your doctor understand how meds affect you.</p>
            {Object.entries(seFreq).sort((a,b)=>b[1]-a[1]).map(([e,c])=>(
              <div key={e} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.brd}`}}>
                <span style={{fontSize:14,color:C.txt}}>{e}</span><span style={{fontSize:13,color:C.txtM,fontWeight:600}}>{c}x</span>
              </div>
            ))}
          </Card>
        )}

        <Card style={{background:C.accL+"20",border:`1px solid ${C.accL}`}}>
          <div style={{display:"flex",gap:10}}><BookOpen size={20} color={C.accD} style={{flexShrink:0,marginTop:2}}/><div><div style={{fontWeight:600,fontSize:14,color:C.accD}}>For Your Doctor</div><p style={{fontSize:13,color:C.txt,lineHeight:1.6,margin:"4px 0 0"}}>Your medication and mood data builds a picture over time. Bring this to appointments — it helps your doctor see patterns that are hard to describe from memory.</p></div></div>
        </Card>
      </div>
    );
  };

  // ═════════════════════════════════════════════════════════════════
  // TOOLKIT (Coach + Timer + Paralysis Helper + Dopamine Menu)
  // ═════════════════════════════════════════════════════════════════
  const renderToolkit = () => (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,color:C.txt,margin:"0 0 16px"}}>Your Toolkit</h2>

      {/* Sub-nav */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {[
          {id:"coach",label:"Grounding",icon:Shield,color:C.acc},
          {id:"timer",label:"Focus Timer",icon:Timer,color:C.purp},
          {id:"paralysis",label:"Task Helper",icon:Rocket,color:C.pri},
          {id:"dopamine",label:"Dopamine Menu",icon:Sparkles,color:C.warn},
        ].map(t=>(
          <button key={t.id} onClick={()=>setToolkitSection(t.id)} style={{padding:"14px 8px",borderRadius:16,border:toolkitSection===t.id?`2px solid ${t.color}`:`2px solid ${C.brd}`,background:toolkitSection===t.id?t.color+"15":"transparent",color:toolkitSection===t.id?t.color:C.txtL,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s"}}>
            <t.icon size={18}/>{t.label}
          </button>
        ))}
      </div>

      {/* ─── COACH / GROUNDING ─── */}
      {toolkitSection==="coach" && (
        <>
          {spiral && (
            <Card style={{background:spiral==="spiral"?C.dangerL+"30":C.priL+"30",border:`1px solid ${spiral==="spiral"?C.danger:C.pri}`}}>
              <p style={{fontSize:15,lineHeight:1.7,color:C.txt,margin:0,fontStyle:"italic"}}>
                "{spiral==="spiral"?pick(COACHING.spiral):spiral==="low"?pick(COACHING.low):pick(COACHING.enc)}"
              </p>
            </Card>
          )}

          <Card style={{textAlign:"center"}}>
            <h3 style={{fontSize:16,fontWeight:600,color:C.txt,margin:"0 0 4px"}}>Box Breathing</h3>
            <p style={{fontSize:13,color:C.txtL,margin:"0 0 8px"}}>4 cycles to calm your nervous system</p>
            <BreathCircle active={breathActive} phase={breathPhase} sec={breathSec}/>
            {breathActive && <div style={{fontSize:13,color:C.txtM,marginBottom:8}}>Cycle {breathCycles+1} of 4</div>}
            <Btn v={breathActive?"sec":"acc"} onClick={()=>{setBreathActive(!breathActive);if(!breathActive)setBreathCycles(0);else setBreathPhase("ready")}}>
              {breathActive?"Stop":"Start Breathing"}
            </Btn>
          </Card>

          <h3 style={{fontSize:16,fontWeight:600,color:C.txt,marginBottom:12}}>Grounding Exercises</h3>
          {GROUNDING.map((ex,i)=>(
            <Card key={i} onClick={()=>{setActiveEx(activeEx===i?null:i);setExStep(0)}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:14,background:ex.color+"20",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ex.icon size={22} color={ex.color}/></div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:15,color:C.txt}}>{ex.title}</div><div style={{fontSize:12,color:C.txtL,marginTop:2}}>{ex.desc}</div></div>
                <ChevronRight size={18} color={C.txtM} style={{transform:activeEx===i?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
              </div>
              {activeEx===i && (
                <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.brd}`}}>
                  {ex.steps.map((s,si)=>(
                    <div key={si} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",opacity:si<=exStep?1:0.35,transition:"opacity 0.3s"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:si<exStep?C.acc:si===exStep?ex.color:C.brd,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.3s"}}>
                        {si<exStep?<Check size={14} color="#fff"/>:<span style={{color:"#fff",fontSize:12,fontWeight:600}}>{si+1}</span>}
                      </div>
                      <p style={{fontSize:14,color:C.txt,lineHeight:1.5,margin:0}}>{s}</p>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <Btn sz="sm" v="sec" disabled={exStep===0} onClick={e=>{e.stopPropagation();setExStep(s=>Math.max(0,s-1))}}>Back</Btn>
                    <Btn sz="sm" onClick={e=>{e.stopPropagation();if(exStep<ex.steps.length-1)setExStep(s=>s+1);else{notify("Well done! Consider doing a check-in.","success");setActiveEx(null)}}}>
                      {exStep<ex.steps.length-1?"Next":"Complete"}
                    </Btn>
                  </div>
                </div>
              )}
            </Card>
          ))}

          <Card style={{background:C.purpL+"30",border:`1px solid ${C.purpL}`}}>
            <div style={{display:"flex",gap:10}}><Heart size={20} color={C.purp} style={{flexShrink:0,marginTop:2}}/><div><div style={{fontWeight:600,fontSize:14,color:C.purp}}>Remember</div><p style={{fontSize:13,color:C.txt,lineHeight:1.6,margin:"6px 0 0"}}>Having ADHD doesn't mean you're broken. Your brain works differently — that comes with real challenges, but also real strengths.</p></div></div>
          </Card>
        </>
      )}

      {/* ─── FOCUS TIMER ─── */}
      {toolkitSection==="timer" && (
        <>
          <Card style={{textAlign:"center"}}>
            <h3 style={{fontSize:18,fontWeight:700,color:C.txt,margin:"0 0 4px"}}>
              {timerWork?"Focus Time":"Break Time"}
            </h3>
            <p style={{fontSize:13,color:C.txtL,margin:"0 0 20px"}}>
              {timerWork?"ADHD-friendly intervals. Just this block, nothing else.":"Rest your brain. Move, stretch, stare at a wall. All good."}
            </p>

            {/* Timer Display */}
            <div style={{fontSize:64,fontWeight:200,color:timerWork?C.purp:C.acc,fontFamily:"monospace",marginBottom:8}}>
              {String(Math.floor(timerSec/60)).padStart(2,"0")}:{String(timerSec%60).padStart(2,"0")}
            </div>

            <div style={{fontSize:13,color:C.txtM,marginBottom:20}}>
              Sessions today: {sessionsCompleted}
            </div>

            {/* Preset buttons */}
            {!timerRunning && timerWork && (
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:16}}>
                {[10,15,25,45].map(m=>(
                  <button key={m} onClick={()=>{setTimerPreset(m);setTimerSec(m*60)}} style={{padding:"8px 16px",borderRadius:12,border:timerPreset===m?`2px solid ${C.purp}`:`2px solid ${C.brd}`,background:timerPreset===m?C.purp+"20":"transparent",color:timerPreset===m?C.purp:C.txtL,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{m}m</button>
                ))}
              </div>
            )}

            <div style={{display:"flex",justifyContent:"center",gap:12}}>
              <Btn v={timerRunning?"danger":"acc"} onClick={()=>setTimerRunning(!timerRunning)}>
                {timerRunning?<><Pause size={18} style={{marginRight:6}}/>Pause</>:<><Play size={18} style={{marginRight:6}}/>Start</>}
              </Btn>
              <Btn v="sec" onClick={()=>{setTimerRunning(false);setTimerWork(true);setTimerSec(timerPreset*60)}}>
                <RotateCcw size={18}/>
              </Btn>
            </div>
          </Card>

          <Card style={{background:C.purpL+"15",border:`1px solid ${C.purpL}`}}>
            <div style={{display:"flex",gap:10}}><Brain size={20} color={C.purp} style={{flexShrink:0,marginTop:2}}/><div><div style={{fontWeight:600,fontSize:14,color:C.purp}}>ADHD Timer Tips</div><p style={{fontSize:13,color:C.txt,lineHeight:1.6,margin:"6px 0 0"}}>Start with 10-15 min if 25 feels impossible. There's no "right" interval — only what works for YOUR brain. The timer is a suggestion, not a test. If you break early, that still counts as progress.</p></div></div>
          </Card>
        </>
      )}

      {/* ─── TASK PARALYSIS HELPER ─── */}
      {toolkitSection==="paralysis" && (
        <>
          <Card>
            <div style={{textAlign:"center",marginBottom:16}}>
              <Rocket size={36} color={C.pri}/>
              <h3 style={{fontSize:18,fontWeight:700,color:C.txt,margin:"10px 0 4px"}}>Task Paralysis Helper</h3>
              <p style={{fontSize:14,color:C.txtL,lineHeight:1.5}}>
                Frozen and can't start? Tell me the task and I'll walk you through it one micro-step at a time. No thinking required.
              </p>
            </div>

            {!paraStarted ? (
              <>
                <textarea value={paraTask} onChange={e=>setParaTask(e.target.value)}
                  placeholder="What task is paralysing you? (e.g. 'clean the kitchen', 'start that email', 'do my tax return')"
                  style={{width:"100%",minHeight:80,borderRadius:12,border:`1.5px solid ${C.brd}`,padding:14,fontSize:14,fontFamily:"inherit",resize:"vertical",background:C.bg,color:C.txt,outline:"none",boxSizing:"border-box"}}/>
                <Btn onClick={generateMicroSteps} style={{width:"100%",marginTop:12}}>Break It Down For Me</Btn>
              </>
            ) : (
              <>
                <div style={{padding:"12px 16px",borderRadius:14,background:C.priL+"20",marginBottom:16}}>
                  <div style={{fontSize:12,color:C.txtM,marginBottom:4}}>Your task:</div>
                  <div style={{fontSize:15,fontWeight:600,color:C.txt}}>{paraTask}</div>
                </div>

                {/* Current step - BIG and focused */}
                <div style={{textAlign:"center",padding:24,marginBottom:16}}>
                  <div style={{fontSize:13,color:C.txtM,marginBottom:8}}>Step {paraStep+1} of {paraSteps.length}</div>
                  <p style={{fontSize:18,fontWeight:600,color:C.txt,lineHeight:1.6,margin:0}}>
                    {paraSteps[paraStep]}
                  </p>
                </div>

                {/* Progress dots */}
                <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20}}>
                  {paraSteps.map((_,i)=>(
                    <div key={i} style={{width:i===paraStep?24:8,height:8,borderRadius:4,background:i<paraStep?C.acc:i===paraStep?C.pri:C.brd,transition:"all 0.3s"}}/>
                  ))}
                </div>

                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  <Btn v="sec" sz="sm" disabled={paraStep===0} onClick={()=>setParaStep(s=>s-1)}>Back</Btn>
                  <Btn sz="sm" onClick={()=>{
                    if(paraStep<paraSteps.length-1) setParaStep(s=>s+1);
                    else {
                      notify("YOU DID IT! That's a win — go log it in your Wins Jar!","success");
                      setParaStarted(false);
                      setParaTask("");
                      setParaSteps([]);
                    }
                  }}>
                    {paraStep<paraSteps.length-1?"Done — Next Step":"I Did It!"}
                  </Btn>
                </div>

                <div style={{textAlign:"center",marginTop:16}}>
                  <button onClick={()=>{setParaStarted(false);setParaTask("");setParaSteps([])}} style={{background:"none",border:"none",color:C.txtM,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                    Start over with a different task
                  </button>
                </div>
              </>
            )}
          </Card>

          <Card style={{background:C.priL+"15",border:`1px solid ${C.priL}`}}>
            <div style={{display:"flex",gap:10}}><Brain size={20} color={C.pri} style={{flexShrink:0,marginTop:2}}/><div><div style={{fontWeight:600,fontSize:14,color:C.priD}}>Why This Works</div><p style={{fontSize:13,color:C.txt,lineHeight:1.6,margin:"6px 0 0"}}>Task paralysis happens when your brain sees the WHOLE task at once and freezes. By focusing on just one tiny action, you bypass the overwhelm. Movement creates momentum — once you start, it gets easier. This isn't laziness. It's an executive function challenge, and you're working WITH your brain instead of fighting it.</p></div></div>
          </Card>
        </>
      )}

      {/* ─── DOPAMINE MENU ─── */}
      {toolkitSection==="dopamine" && (
        <>
          <Card style={{background:`linear-gradient(135deg,${C.warn}15,${C.priL}20)`,border:`1px solid ${C.warn}40`}}>
            <div style={{textAlign:"center",marginBottom:12}}>
              <Sparkles size={36} color={C.warn}/>
              <h3 style={{fontSize:18,fontWeight:700,color:C.txt,margin:"8px 0 4px"}}>Your Dopamine Menu</h3>
              <p style={{fontSize:14,color:C.txtL,lineHeight:1.5}}>
                When you're in a low and can't think of anything that would help — this list is pre-made by past-you, who knows what works.
              </p>
            </div>
          </Card>

          {/* Random suggestion */}
          {dopamineMenu.length>0 && (
            <Card style={{textAlign:"center",padding:24}}>
              <div style={{fontSize:13,color:C.txtM,marginBottom:8}}>Can't decide? Try this:</div>
              <div style={{fontSize:18,fontWeight:600,color:C.pri,marginBottom:12}}>{pick(dopamineMenu).text}</div>
              <Btn v="sec" sz="sm" onClick={()=>notify(pick(dopamineMenu).text)}>Shuffle</Btn>
            </Card>
          )}

          {/* Menu grouped by category */}
          {Object.entries(DOPAMINE_CATS).map(([cat,emoji])=>{
            const items = dopamineMenu.filter(d=>d.category===cat);
            if(items.length===0) return null;
            return (
              <Card key={cat}>
                <h3 style={{fontSize:14,fontWeight:600,color:C.txt,margin:"0 0 10px",textTransform:"capitalize"}}>{emoji} {cat}</h3>
                {items.map(d=>(
                  <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.brd}`}}>
                    <span style={{fontSize:14,color:C.txt}}>{d.text}</span>
                    <button onClick={()=>setDopamineMenu(p=>p.filter(x=>x.id!==d.id))} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><X size={14} color={C.txtM}/></button>
                  </div>
                ))}
              </Card>
            );
          })}

          {/* Add new */}
          <Card>
            <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 12px"}}>Add to your menu</h3>
            <input value={newDopamine} onChange={e=>setNewDopamine(e.target.value)} placeholder="Something that gives you a healthy boost..." onKeyDown={e=>{if(e.key==="Enter")addDopamineItem()}}
              style={{width:"100%",padding:12,borderRadius:12,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",background:C.bg,marginBottom:10}}/>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
              {Object.entries(DOPAMINE_CATS).map(([cat,emoji])=>(
                <button key={cat} onClick={()=>setNewDopCat(cat)} style={{padding:"6px 12px",borderRadius:12,border:newDopCat===cat?`2px solid ${C.warn}`:`1.5px solid ${C.brd}`,background:newDopCat===cat?C.warn+"20":"transparent",fontSize:12,cursor:"pointer",fontFamily:"inherit",color:newDopCat===cat?C.warn:C.txtL}}>
                  {emoji} {cat}
                </button>
              ))}
            </div>
            <Btn onClick={addDopamineItem} style={{width:"100%"}}>Add</Btn>
          </Card>
        </>
      )}
    </div>
  );

  // ═════════════════════════════════════════════════════════════════
  // INSIGHTS + DOCTOR EXPORT
  // ═════════════════════════════════════════════════════════════════
  const renderInsights = () => (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,color:C.txt,margin:"0 0 4px"}}>Insights</h2>
      <p style={{color:C.txtL,fontSize:14,margin:"0 0 24px"}}>Patterns & trends — your story in numbers.</p>

      {/* Mood/Energy/Focus chart */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 4px"}}>Mood, Energy & Focus (14 days)</h3>
        <p style={{fontSize:12,color:C.txtM,margin:"0 0 16px"}}>Do they move together or apart?</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.brd}/>
            <XAxis dataKey="date" tick={{fontSize:10,fill:C.txtM}} axisLine={false} tickLine={false}/>
            <YAxis domain={[0,5]} tick={{fontSize:10,fill:C.txtM}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{borderRadius:12,border:`1px solid ${C.brd}`,fontSize:13}}/>
            <Line type="monotone" dataKey="mood" stroke={C.pri} strokeWidth={2.5} dot={{r:3}} name="Mood" connectNulls/>
            <Line type="monotone" dataKey="energy" stroke={C.acc} strokeWidth={2} dot={{r:3}} name="Energy" connectNulls strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="focus" stroke={C.purp} strokeWidth={2} dot={{r:3}} name="Focus" connectNulls strokeDasharray="2 4"/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:8}}>
          <span style={{fontSize:12,color:C.pri}}>● Mood</span>
          <span style={{fontSize:12,color:C.acc}}>● Energy</span>
          <span style={{fontSize:12,color:C.purp}}>● Focus</span>
        </div>
      </Card>

      {/* Sleep chart */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 4px"}}>
          <Bed size={16} style={{marginRight:6,verticalAlign:"middle"}}/>Sleep (14 days)
        </h3>
        <p style={{fontSize:12,color:C.txtM,margin:"0 0 16px"}}>Hours per night — look for patterns with your mood.</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={sleepData}>
            <XAxis dataKey="day" tick={{fontSize:10,fill:C.txtM}} axisLine={false} tickLine={false}/>
            <YAxis domain={[0,12]} tick={{fontSize:10,fill:C.txtM}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{borderRadius:12,border:`1px solid ${C.brd}`,fontSize:13}} formatter={v=>[  `${v} hrs`,"Sleep"]}/>
            <Bar dataKey="hours" fill={C.purpL} radius={[6,6,0,0]} barSize={16}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Emotions */}
      {topEmotions.length>0 && (
        <Card>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 16px"}}>Emotional Landscape</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topEmotions} layout="vertical">
              <XAxis type="number" hide/>
              <YAxis dataKey="name" type="category" tick={{fontSize:12,fill:C.txt}} axisLine={false} tickLine={false} width={100}/>
              <Bar dataKey="count" fill={C.priL} radius={[0,8,8,0]} barSize={18}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Pattern Analysis */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Pattern Analysis</h3>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.brd}`}}>
          <div style={{width:40,height:40,borderRadius:12,background:(spiral==="spiral"||spiral==="low")?C.dangerL+"40":C.accL+"40",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {spiral==="spiral"?<TrendingDown size={20} color={C.danger}/>:spiral==="low"?<AlertTriangle size={20} color={C.pri}/>:<TrendingUp size={20} color={C.acc}/>}
          </div>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:C.txt}}>{spiral==="spiral"?"Downward Trend Detected":spiral==="low"?"Below Average Mood":"Mood Looking Stable"}</div>
            <div style={{fontSize:12,color:C.txtL,marginTop:2}}>{spiral==="spiral"?"Your mood has been declining. Consider reaching out to someone.":spiral==="low"?"Recent entries show lower mood. Be extra gentle.":"No concerning patterns. Keep tracking!"}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.brd}`}}>
          <div style={{width:40,height:40,borderRadius:12,background:C.priL+"40",display:"flex",alignItems:"center",justifyContent:"center"}}><Target size={20} color={C.pri}/></div>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:C.txt}}>Tracking Consistency</div>
            <div style={{fontSize:12,color:C.txtL,marginTop:2}}>{streak>=7?`Amazing — ${streak} day streak!`:streak>=3?`${streak} day streak — building a habit!`:"Try checking in daily for best insights."}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0"}}>
          <div style={{width:40,height:40,borderRadius:12,background:C.purpL+"40",display:"flex",alignItems:"center",justifyContent:"center"}}><Bed size={20} color={C.purp}/></div>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:C.txt}}>Sleep Impact</div>
            <div style={{fontSize:12,color:C.txtL,marginTop:2}}>
              {(()=>{
                const withSleep = entries.filter(e=>e.sleepQuality&&e.mood);
                if(withSleep.length<5) return "Keep logging sleep — patterns will emerge after a few entries.";
                const good = withSleep.filter(e=>e.sleepQuality>=4);
                const bad = withSleep.filter(e=>e.sleepQuality<=2);
                const goodMood = good.length>0?(good.reduce((a,e)=>a+e.mood,0)/good.length).toFixed(1):0;
                const badMood = bad.length>0?(bad.reduce((a,e)=>a+e.mood,0)/bad.length).toFixed(1):0;
                if(good.length>0&&bad.length>0) return `Good sleep = avg mood ${goodMood}/5. Poor sleep = avg mood ${badMood}/5. Sleep matters.`;
                return "Building sleep/mood correlation data...";
              })()}
            </div>
          </div>
        </div>
      </Card>

      {/* Cycle + Mood */}
      {entries.some(e=>e.cycle) && (
        <Card>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 4px"}}>Cycle & Mood Connection</h3>
          <p style={{fontSize:12,color:C.txtM,margin:"0 0 14px"}}>Average mood by cycle phase — powerful data for your doctor.</p>
          {CYCLE_PHASES.filter(p=>p.id!=="unsure"&&p.id!=="na").map(phase=>{
            const pe = entries.filter(e=>e.cycle===phase.id&&e.mood);
            if(!pe.length) return null;
            const avg = (pe.reduce((a,e)=>a+e.mood,0)/pe.length).toFixed(1);
            return (
              <div key={phase.id} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,color:C.txt}}>{phase.emoji} {phase.label}</span>
                  <span style={{fontSize:13,fontWeight:600,color:phase.color}}>{avg}/5</span>
                </div>
                <div style={{height:8,borderRadius:4,background:C.brd}}>
                  <div style={{height:"100%",borderRadius:4,background:phase.color,width:`${(avg/5)*100}%`,transition:"width 0.5s"}}/>
                </div>
                <div style={{fontSize:11,color:C.txtM,marginTop:2}}>{pe.length} entries</div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Mood Heatmap */}
      <Card>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>Daily Mood Map (14 Days)</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
          {days14.map(d=>{
            const de=entries.filter(e=>e.date===d);
            const am=de.length>0?Math.round(de.reduce((a,e)=>a+(e.mood||3),0)/de.length):0;
            const cols=["transparent","#D4736A","#E8985E","#E8B44E","#A8D0C4","#7EB5A6"];
            return (
              <div key={d} style={{aspectRatio:"1",borderRadius:10,background:am>0?cols[am]+"60":C.bg,border:`1.5px solid ${am>0?cols[am]:C.brd}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:10,color:C.txtM}}>
                <div style={{fontWeight:600}}>{dayName(d)}</div>
                <div>{new Date(d).getDate()}</div>
                {am>0 && <div style={{fontSize:14,marginTop:2}}>{MOODS[5-am]?.emoji}</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ─── DOCTOR EXPORT ─── */}
      <Card style={{background:`linear-gradient(135deg,${C.accL}30,${C.purpL}20)`,border:`1px solid ${C.acc}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <FileText size={24} color={C.accD}/>
          <div>
            <h3 style={{fontSize:16,fontWeight:700,color:C.txt,margin:0}}>Doctor Export</h3>
            <p style={{fontSize:12,color:C.txtL,margin:"2px 0 0"}}>Generate a summary to bring to your appointment</p>
          </div>
        </div>
        <Btn v="acc" style={{width:"100%"}} onClick={()=>{
          // Generate summary
          const last30 = entries.filter(e => {
            const d = new Date(e.date);
            const ago = new Date(); ago.setDate(ago.getDate()-30);
            return d >= ago;
          });
          const moodAvg = last30.length>0?(last30.reduce((a,e)=>a+(e.mood||0),0)/last30.length).toFixed(1):"N/A";
          const energyAvg = last30.length>0?(last30.reduce((a,e)=>a+(e.energy||0),0)/last30.length).toFixed(1):"N/A";
          const focusAvg = last30.length>0?(last30.reduce((a,e)=>a+(e.focus||0),0)/last30.length).toFixed(1):"N/A";
          const sleepAvg = last30.filter(e=>e.sleepHours).length>0?(last30.filter(e=>e.sleepHours).reduce((a,e)=>a+parseFloat(e.sleepHours||0),0)/last30.filter(e=>e.sleepHours).length).toFixed(1):"N/A";
          const sleepQAvg = last30.filter(e=>e.sleepQuality).length>0?(last30.filter(e=>e.sleepQuality).reduce((a,e)=>a+(e.sleepQuality||0),0)/last30.filter(e=>e.sleepQuality).length).toFixed(1):"N/A";

          const seFreq = {};
          last30.forEach(e=>(e.sideEffects||[]).forEach(s=>{seFreq[s]=(seFreq[s]||0)+1}));
          const topSE = Object.entries(seFreq).sort((a,b)=>b[1]-a[1]).slice(0,5);

          const emFreq = {};
          last30.forEach(e=>(e.emotions||[]).forEach(em=>{emFreq[em]=(emFreq[em]||0)+1}));
          const topEm = Object.entries(emFreq).sort((a,b)=>b[1]-a[1]).slice(0,5);

          const cycleData = {};
          last30.filter(e=>e.cycle&&e.cycle!=="na"&&e.cycle!=="unsure").forEach(e=>{
            if(!cycleData[e.cycle]) cycleData[e.cycle]={moods:[],count:0};
            cycleData[e.cycle].moods.push(e.mood||3);
            cycleData[e.cycle].count++;
          });

          const medAdherence = meds.map(m=>{
            const taken = last30.filter(e=>e.medTaken&&e.medTaken[m.id]).length;
            return `${m.name} (${m.dosage}): taken ${taken}/${last30.length} days (${last30.length>0?Math.round(taken/last30.length*100):0}%)`;
          });

          let report = `ADHD TRACKING REPORT — Last 30 Days\n`;
          report += `Generated: ${new Date().toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}\n`;
          report += `Patient: Georgia\n`;
          report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
          report += `OVERVIEW (${last30.length} check-ins)\n`;
          report += `  Avg Mood: ${moodAvg}/5  |  Avg Energy: ${energyAvg}/5  |  Avg Focus: ${focusAvg}/5\n`;
          report += `  Avg Sleep: ${sleepAvg} hrs  |  Sleep Quality: ${sleepQAvg}/5\n`;
          report += `  Trend: ${spiral==="spiral"?"DOWNWARD (concerning)":spiral==="low"?"Below average":"Stable"}\n\n`;
          report += `MEDICATIONS\n`;
          medAdherence.forEach(m=>{report+=`  ${m}\n`});
          if(topSE.length>0){report+=`\nSIDE EFFECTS REPORTED\n`;topSE.forEach(([s,c])=>{report+=`  ${s}: ${c}x\n`})}
          if(topEm.length>0){report+=`\nMOST FREQUENT EMOTIONS\n`;topEm.forEach(([e,c])=>{report+=`  ${e}: ${c}x\n`})}
          if(Object.keys(cycleData).length>0){
            report+=`\nCYCLE & MOOD CORRELATION\n`;
            Object.entries(cycleData).forEach(([phase,data])=>{
              const label = CYCLE_PHASES.find(p=>p.id===phase)?.label||phase;
              const avg = (data.moods.reduce((a,b)=>a+b,0)/data.moods.length).toFixed(1);
              report+=`  ${label}: avg mood ${avg}/5 (${data.count} entries)\n`;
            });
          }
          report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          report += `Generated by Hummingbird App\n`;

          // Copy to clipboard
          navigator.clipboard.writeText(report).then(()=>{
            notify("Report copied to clipboard! Paste it anywhere.","success");
          }).catch(()=>{
            // Fallback: show in alert
            notify("Report generated — check console for full text.","info");
            console.log(report);
          });
        }}>
          <FileText size={18} style={{marginRight:8}}/>Generate & Copy Report
        </Btn>
        <p style={{fontSize:12,color:C.txtL,marginTop:10,textAlign:"center"}}>
          Copies a clean text summary of your last 30 days to your clipboard — paste into notes, email, or hand to your doctor.
        </p>
      </Card>
    </div>
  );

  // ═════════════════════════════════════════════════════════════════
  // REMINDERS
  // ═════════════════════════════════════════════════════════════════
  const renderReminders = () => (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{fontSize:22,fontWeight:700,color:C.txt,margin:0}}>Reminders</h2><p style={{color:C.txtL,fontSize:13,margin:"4px 0 0"}}>Gentle nudges for your ADHD brain</p></div>
        <Btn sz="sm" onClick={()=>setShowRemForm(true)}><Plus size={16} style={{marginRight:4}}/> Add</Btn>
      </div>

      {showRemForm && (
        <Card style={{border:`2px solid ${C.pri}`}}>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt,margin:"0 0 14px"}}>New Reminder</h3>
          <input value={remForm.text} onChange={e=>setRemForm(p=>({...p,text:e.target.value}))} placeholder="What do you need to remember?"
            style={{width:"100%",padding:12,borderRadius:12,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",marginBottom:10,boxSizing:"border-box",background:C.bg}}/>
          <input type="time" value={remForm.time} onChange={e=>setRemForm(p=>({...p,time:e.target.value}))}
            style={{width:"100%",padding:12,borderRadius:12,border:`1.5px solid ${C.brd}`,fontSize:14,fontFamily:"inherit",marginBottom:10,boxSizing:"border-box",background:C.bg}}/>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[{v:"medication",l:"Meds",i:Pill},{v:"checkin",l:"Check-in",i:Smile},{v:"task",l:"Task",i:Target}].map(t=>(
              <button key={t.v} onClick={()=>setRemForm(p=>({...p,type:t.v}))} style={{flex:1,padding:"10px 4px",borderRadius:12,fontSize:12,fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:remForm.type===t.v?C.pri:"transparent",color:remForm.type===t.v?"#fff":C.txtL,border:`1.5px solid ${remForm.type===t.v?C.pri:C.brd}`,cursor:"pointer"}}>
                <t.i size={18}/>{t.l}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={addReminder} style={{flex:1}}>Save</Btn>
            <Btn v="ghost" onClick={()=>setShowRemForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {reminders.map(r=>(
        <Card key={r.id}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:14,flexShrink:0,background:r.type==="medication"?C.accL+"60":r.type==="checkin"?C.priL+"60":C.purpL+"60",display:"flex",alignItems:"center",justifyContent:"center",opacity:r.active?1:0.4}}>
              {r.type==="medication"?<Pill size={22} color={C.accD}/>:r.type==="checkin"?<Smile size={22} color={C.priD}/>:<Target size={22} color={C.purp}/>}
            </div>
            <div style={{flex:1,opacity:r.active?1:0.5}}>
              <div style={{fontWeight:600,fontSize:15,color:C.txt}}>{r.text}</div>
              <div style={{fontSize:13,color:C.txtM,display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                <Clock size={12}/> {r.time}
                <span style={{padding:"2px 8px",borderRadius:8,fontSize:11,background:r.type==="medication"?C.accL+"40":r.type==="checkin"?C.priL+"40":C.purpL+"40",color:r.type==="medication"?C.accD:r.type==="checkin"?C.priD:C.purp,textTransform:"capitalize"}}>{r.type}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>setReminders(p=>p.map(x=>x.id===r.id?{...x,active:!x.active}:x))} style={{background:"none",border:"none",cursor:"pointer",padding:8}}>
                {r.active?<Bell size={18} color={C.pri}/>:<VolumeX size={18} color={C.txtM}/>}
              </button>
              <button onClick={()=>setReminders(p=>p.filter(x=>x.id!==r.id))} style={{background:"none",border:"none",cursor:"pointer",padding:8}}>
                <Trash2 size={18} color={C.txtM}/>
              </button>
            </div>
          </div>
        </Card>
      ))}

      {reminders.length===0&&!showRemForm && <Card style={{textAlign:"center",padding:40}}><Bell size={36} color={C.txtM}/><p style={{color:C.txtM,marginTop:12}}>No reminders yet.</p></Card>}

      <Card style={{background:C.priL+"20",border:`1px solid ${C.priL}`}}>
        <div style={{display:"flex",gap:10}}><Star size={20} color={C.pri} style={{flexShrink:0,marginTop:2}}/><div><div style={{fontWeight:600,fontSize:14,color:C.priD}}>ADHD Reminder Tips</div><p style={{fontSize:13,color:C.txt,lineHeight:1.6,margin:"6px 0 0"}}>Set reminders for just after transitions (after waking, after lunch, before bed). ADHD brains lose things in transitions — that's normal, not a failure.</p></div></div>
      </Card>
    </div>
  );

  // ═════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═════════════════════════════════════════════════════════════════
  return (
    <div style={{fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative"}}>
      {notif && (
        <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:200,maxWidth:360,width:"90%",padding:"14px 20px",borderRadius:16,background:notif.type==="warn"?C.warn:notif.type==="success"?C.acc:C.card,color:notif.type==="warn"||notif.type==="success"?"#fff":C.txt,boxShadow:"0 8px 32px rgba(74,55,40,0.2)",fontSize:14,lineHeight:1.5,fontWeight:500,animation:"slideDown 0.3s ease-out"}}>
          {notif.msg}
        </div>
      )}

      <div style={{padding:"20px 16px 100px"}}>
        {tab==="home"&&renderHome()}
        {tab==="checkin"&&renderCheckin()}
        {tab==="journal"&&renderJournal()}
        {tab==="meds"&&renderMeds()}
        {tab==="toolkit"&&renderToolkit()}
        {tab==="insights"&&renderInsights()}
        {tab==="reminders"&&renderReminders()}
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab}/>

      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        *{-webkit-tap-highlight-color:transparent}
        input:focus,textarea:focus{border-color:${C.pri} !important;outline:none}
        ::-webkit-scrollbar{width:0}
      `}</style>
    </div>
  );
}

