import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════════════════════════ */
const T = {
  bg: "#F9F7F4", white: "#FFFFFF", card: "#FFFFFF",
  border: "#EAE6E1", borderDark: "#D4CEC7",
  text: "#18150F", sub: "#635D56", muted: "#A09890",
  accent: "#D64E2A", accentHover: "#B83E1E", accentLight: "#FDF0EC",
  green: "#1E6B3E", greenLight: "#E8F5EE", greenMid: "#2D8F52",
  gold: "#B86E0A", goldLight: "#FEF3E2",
  blue: "#1A5296", blueLight: "#E8F0FB",
  red: "#C0392B", redLight: "#FDECEC",
  purple: "#5B2D8E", purpleLight: "#F0E8FB",
  shadow: "0 1px 12px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 24px rgba(0,0,0,0.09)",
  shadowLg: "0 8px 40px rgba(0,0,0,0.13)",
  r: "14px", rsm: "9px", rlg: "20px",
};

const GS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${T.bg};color:${T.text};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:${T.borderDark};border-radius:99px;}
::-webkit-scrollbar-track{background:transparent;}
button,input,select,textarea{font-family:'DM Sans',sans-serif;}
@keyframes up{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes in{from{opacity:0;}to{opacity:1;}}
@keyframes slideUp{from{opacity:0;transform:translateY(48px);}to{opacity:1;transform:translateY(0);}}
@keyframes pop{from{opacity:0;transform:scale(.93);}to{opacity:1;transform:scale(1);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes shimmer{0%{opacity:.5;}50%{opacity:1;}100%{opacity:.5;}}
.au{animation:up .45s ease forwards;}
.ai{animation:in .3s ease forwards;}
.su{animation:slideUp .4s cubic-bezier(.16,1,.3,1) forwards;}
.pop{animation:pop .25s ease forwards;}
.s1{animation-delay:.06s;opacity:0;}.s2{animation-delay:.12s;opacity:0;}
.s3{animation-delay:.18s;opacity:0;}.s4{animation-delay:.24s;opacity:0;}.s5{animation-delay:.3s;opacity:0;}
.lift{transition:transform .2s,box-shadow .2s;cursor:pointer;}
.lift:hover{transform:translateY(-3px);box-shadow:${T.shadowLg};}
`;

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const PROBLEMS = [
  { icon:"🚨", title:"Rental Scams", stat:"$2.3M lost in 2025", desc:"Fake landlords on Facebook groups steal deposits from unsuspecting renters.", fix:"Every NestMatch landlord is ID-verified and cross-checked before listing." },
  { icon:"💸", title:"Don't Know If You Qualify", stat:"16% rent-to-income ratio", desc:"Renters waste weeks applying to places they can't afford, facing repeated rejection.", fix:"Income screening upfront — you only see listings you actually qualify for." },
  { icon:"🏚️", title:"Listings Lie", stat:"50–60 listings before finding one", desc:"Units advertised as private arrive as shared rooms. Photos hide mould and damage.", fix:"Listing accuracy is a required review category. Dishonest landlords get flagged." },
  { icon:"👥", title:"Unsafe Roommate Search", stat:"Zero vetting on Facebook", desc:"People post in groups with no ID, no income check, and no screening whatsoever.", fix:"Every renter has a verified income badge, ID check, and compatibility score." },
  { icon:"📋", title:"Surprise Rent Hikes", stat:"44% gap in Toronto 2024", desc:"Corporate landlords raise rents above guideline while ignoring broken units.", fix:"Public review trail creates permanent accountability for every landlord." },
  { icon:"📦", title:"Tiny Overpriced Units", stat:"267 sq ft 'apartments'", desc:"Developers shrink units to maximize profit while renters pay top dollar for shoe boxes.", fix:"Square footage per person is required. Filter by minimum size and rent control." },
];

const LISTINGS = [
  { id:1, title:"2BR Lake View Condo", address:"1204 Lakeshore Blvd W", city:"Toronto, ON", price:1050, total:2100, beds:2, baths:2, sqft:940, sqftPP:470, spots:1, minIncome:3150, match:97, verified:true, topLandlord:true, rating:4.96, reviews:118, rentControlled:true, tags:["Lake View","Gym","In-unit Laundry","Pet Friendly"], gradient:"linear-gradient(140deg,#1a3a5c,#2d6a9f)", isNew:true, scamRisk:"none", landlordId:1 },
  { id:2, title:"3BR Townhouse near UBC", address:"892 West 10th Ave", city:"Vancouver, BC", price:960, total:2880, beds:3, baths:2, sqft:1460, sqftPP:487, spots:2, minIncome:2880, match:93, verified:true, topLandlord:true, rating:4.94, reviews:203, rentControlled:true, tags:["Backyard","Parking","Near Transit","Quiet"], gradient:"linear-gradient(140deg,#0f4c35,#1a8a5a)", isNew:false, scamRisk:"none", landlordId:2 },
  { id:3, title:"Modern 2BR Downtown Loft", address:"312 King St W", city:"Toronto, ON", price:1320, total:2640, beds:2, baths:2, sqft:1080, sqftPP:540, spots:1, minIncome:3960, match:81, verified:true, topLandlord:false, rating:4.78, reviews:67, rentControlled:false, tags:["Rooftop","Concierge","City Views"], gradient:"linear-gradient(140deg,#3d1a5c,#7c3abf)", isNew:false, scamRisk:"none", landlordId:3 },
  { id:4, title:"Cozy 1BR in Plateau", address:"444 Rue Saint-Denis", city:"Montréal, QC", price:790, total:790, beds:1, baths:1, sqft:610, sqftPP:610, spots:1, minIncome:2370, match:88, verified:true, topLandlord:false, rating:4.72, reviews:44, rentControlled:true, tags:["Furnished","Balcony","Arts District"], gradient:"linear-gradient(140deg,#5c3a0a,#c47a1a)", isNew:true, scamRisk:"none", landlordId:4 },
  { id:5, title:"4BR Family Home", address:"200 Oak Park Ave", city:"Calgary, AB", price:840, total:3360, beds:4, baths:3, sqft:2200, sqftPP:550, spots:3, minIncome:2520, match:91, verified:true, topLandlord:true, rating:4.89, reviews:156, rentControlled:false, tags:["Garage","Large Yard","Quiet Street","Schools Nearby"], gradient:"linear-gradient(140deg,#1a3d1a,#2d7a2d)", isNew:false, scamRisk:"none", landlordId:5 },
  { id:6, title:"1BR near Parliament Hill", address:"88 Sparks St", city:"Ottawa, ON", price:1180, total:1180, beds:1, baths:1, sqft:680, sqftPP:680, spots:1, minIncome:3540, match:72, verified:true, topLandlord:false, rating:4.61, reviews:38, rentControlled:true, tags:["Doorman","Gym","Steps to Transit"], gradient:"linear-gradient(140deg,#1a1a4a,#2a2a8a)", isNew:false, scamRisk:"none", landlordId:6 },
];

const ROOMMATES = [
  { id:1, name:"Jordan T.", age:27, job:"Software Engineer", co:"Shopify", income:6800, verified:true, idVerified:true, schedule:"Night Owl", clean:4, pets:false, smoke:false, bio:"Remote worker at Shopify. Tidy, quiet, love cooking. Looking for chill roommates in a 2BR.", emoji:"👨‍💻", match:95, budget:1100, looking:"2BR", city:"Toronto", langs:["English","French"], reviews:4.9, reviewCount:3, backgroundCheck:true },
  { id:2, name:"Priya M.", age:24, job:"Registered Nurse", co:"Toronto General", income:4900, verified:true, idVerified:true, schedule:"Early Bird", clean:5, pets:true, smoke:false, bio:"Shift worker, very tidy. Have one small cat (Mochi 🐱). Looking to share a 2BR.", emoji:"👩‍⚕️", match:92, budget:950, looking:"2BR", city:"Toronto", langs:["English","Hindi"], reviews:5.0, reviewCount:2, backgroundCheck:true },
  { id:3, name:"Sofia L.", age:25, job:"High School Teacher", co:"TDSB", income:4200, verified:true, idVerified:true, schedule:"Early Bird", clean:5, pets:false, smoke:false, bio:"Teacher, very organized, love hiking on weekends. Quiet evenings preferred.", emoji:"👩‍🏫", match:90, budget:900, looking:"3BR", city:"Toronto", langs:["English","Spanish"], reviews:4.8, reviewCount:4, backgroundCheck:true },
  { id:4, name:"Aiden K.", age:28, job:"Finance Analyst", co:"RBC", income:7900, verified:true, idVerified:true, schedule:"Early Bird", clean:4, pets:false, smoke:false, bio:"Work hard, keep the place spotless. Big Leafs fan 🏒 Prefer quiet weeknights.", emoji:"📊", match:87, budget:1400, looking:"2BR", city:"Toronto", langs:["English"], reviews:4.7, reviewCount:2, backgroundCheck:true },
  { id:5, name:"Leila N.", age:23, job:"UX Designer", co:"Wealthsimple", income:5700, verified:true, idVerified:false, schedule:"Flexible", clean:4, pets:true, smoke:false, bio:"Plant mom ☘️ coffee lover. Social on weekends, quiet on weekdays. Have a small dog.", emoji:"✏️", match:83, budget:1050, looking:"3BR", city:"Toronto", langs:["English","Farsi"], reviews:4.6, reviewCount:1, backgroundCheck:false },
  { id:6, name:"Marcus R.", age:30, job:"Graphic Designer", co:"Freelance", income:5300, verified:false, idVerified:false, schedule:"Flexible", clean:3, pets:false, smoke:false, bio:"Creative freelancer. Headphones always on. Chill, easygoing, very respectful of shared space.", emoji:"🎨", match:76, budget:1200, looking:"Any", city:"Vancouver", langs:["English"], reviews:0, reviewCount:0, backgroundCheck:false },
];

const LANDLORD_REVIEWS = {
  1:[
    {id:1,author:"Sarah K.",av:"👩",date:"March 2025",ratings:{responsive:5,accurate:5,fair:5,professional:5},overall:5,text:"Absolute gem of a landlord. Responded to every maintenance request within hours. Unit was exactly as shown — no hidden surprises.",wouldAgain:true,verified:true},
    {id:2,author:"Daniel M.",av:"👨",date:"Jan 2025",ratings:{responsive:4,accurate:5,fair:5,professional:5},overall:5,text:"Returned full deposit within 5 days of moving out. Transparent about everything from day one.",wouldAgain:true,verified:true},
    {id:3,author:"Aisha T.",av:"👩‍🦱",date:"Nov 2024",ratings:{responsive:4,accurate:4,fair:4,professional:4},overall:4,text:"Good landlord overall. Occasionally slow to respond but always resolved issues. Neighbours were amazing.",wouldAgain:true,verified:false},
  ],
  2:[
    {id:4,author:"James W.",av:"👨‍🎓",date:"April 2025",ratings:{responsive:5,accurate:5,fair:5,professional:5},overall:5,text:"Best rental experience of my life. Proactive about repairs, fair on rent, and incredibly respectful. The backyard sold it.",wouldAgain:true,verified:true},
    {id:5,author:"Fatima R.",av:"👩‍💻",date:"March 2025",ratings:{responsive:5,accurate:5,fair:4,professional:5},overall:5,text:"My two roommates and I all agree: we'd move back in a heartbeat. Unit was immaculate on move-in day.",wouldAgain:true,verified:true},
  ],
  3:[
    {id:6,author:"Marcus L.",av:"👨‍💼",date:"Feb 2025",ratings:{responsive:5,accurate:3,fair:4,professional:4},overall:4,text:"Great communication, but the unit was about 15% smaller than photos implied. Be aware of that. Otherwise a good experience.",wouldAgain:true,verified:true},
    {id:7,author:"Priya N.",av:"👩‍🔬",date:"Oct 2024",ratings:{responsive:2,accurate:3,fair:3,professional:3},overall:3,text:"Maintenance took weeks to respond. Listing photos were clearly from a different unit. Be cautious.",wouldAgain:false,verified:true},
  ],
};

const TENANT_REVIEWS = {
  1:[
    {id:1,author:"Lakeshore Properties",av:"🏢",date:"March 2025",ratings:{payment:5,cleanliness:5,communication:5,respectful:5},overall:5,text:"Jordan was the ideal tenant — paid 3 days early every month, kept the unit spotless, and gave 60 days notice. Would rent to him again immediately.",wouldAgain:true,verified:true},
    {id:2,author:"King West Rentals",av:"🏗️",date:"Nov 2024",ratings:{payment:5,cleanliness:4,communication:5,respectful:5},overall:5,text:"Responsible, communicative, and respectful of neighbours. One of our best tenants.",wouldAgain:true,verified:true},
  ],
  2:[{id:3,author:"St. Clair Properties",av:"🏙️",date:"Jan 2025",ratings:{payment:5,cleanliness:5,communication:5,respectful:5},overall:5,text:"Priya was perfect. Left the unit cleaner than she found it. Would rent to her again without hesitation.",wouldAgain:true,verified:true}],
  3:[
    {id:4,author:"West End Properties",av:"🏡",date:"April 2025",ratings:{payment:5,cleanliness:5,communication:5,respectful:5},overall:5,text:"Sofia is an exceptional tenant. Organized, pays early, and always reports issues promptly.",wouldAgain:true,verified:true},
    {id:5,author:"Vancouver Homes Inc.",av:"🏘️",date:"Feb 2025",ratings:{payment:5,cleanliness:5,communication:4,respectful:5},overall:5,text:"Left the property in better condition than she found it. Highly recommend.",wouldAgain:true,verified:true},
  ],
};

const SCAM_ALERTS = [
  { id:1, type:"Scam Detected", severity:"high", title:"Fake listing: 400 Front St W #2301", desc:"This listing was reported by 3 users. The phone number matches a known scam profile. Landlord could not verify property ownership.", date:"2 hours ago" },
  { id:2, type:"Suspicious Activity", severity:"med", title:"Price too good to be true: $650 1BR Downtown Toronto", desc:"Average 1BR in this neighbourhood is $2,100. Listings more than 40% below market average are flagged automatically.", date:"6 hours ago" },
  { id:3, type:"Profile Cloned", severity:"high", title:"Impersonation: 'Mark Chen Rentals'", desc:"A scammer has cloned the profile of a verified NestMatch landlord. The real Mark Chen's account is verified — this is a fake.", date:"1 day ago" },
];

const CITIES = ["All Cities","Toronto, ON","Vancouver, BC","Montréal, QC","Calgary, AB","Ottawa, ON"];

/* ═══════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════ */
function avgR(reviews){ if(!reviews?.length) return 0; return (reviews.reduce((s,r)=>s+r.overall,0)/reviews.length).toFixed(1); }
function catAvg(reviews,cat){ if(!reviews?.length) return 0; const v=reviews.map(r=>r.ratings[cat]).filter(Boolean); return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):0; }
function qualMax(income){ return income?Math.floor(income/3):0; }

/* ═══════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════ */
function Btn({ch,variant="primary",size="md",onClick,style={},disabled=false,full=false}){
  const sz={sm:{p:"7px 15px",fs:12},md:{p:"11px 22px",fs:14},lg:{p:"14px 28px",fs:15}};
  const vr={
    primary:{background:T.accent,color:"#fff",border:"none",boxShadow:`0 2px 10px ${T.accent}44`},
    secondary:{background:T.white,color:T.text,border:`1.5px solid ${T.border}`},
    ghost:{background:"transparent",color:T.sub,border:`1.5px solid ${T.border}`},
    success:{background:T.greenLight,color:T.green,border:`1.5px solid ${T.green}33`},
    danger:{background:T.redLight,color:T.red,border:`1.5px solid ${T.red}33`},
    dark:{background:T.text,color:"#fff",border:"none"},
  };
  return <button disabled={disabled} onClick={onClick} style={{borderRadius:T.rsm,fontWeight:600,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .18s",opacity:disabled?.5:1,width:full?"100%":"auto",padding:sz[size].p,fontSize:sz[size].fs,...vr[variant],...style}} onMouseEnter={e=>{if(!disabled){if(variant==="primary")e.currentTarget.style.background=T.accentHover;if(variant==="dark")e.currentTarget.style.background="#333";}}} onMouseLeave={e=>{if(variant==="primary")e.currentTarget.style.background=T.accent;if(variant==="dark")e.currentTarget.style.background=T.text;}}>{ch}</button>;
}
function Chip({label,color=T.accent,bg=T.accentLight,icon=""}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:700,color,background:bg,letterSpacing:.2,whiteSpace:"nowrap"}}>{icon}{label}</span>;}
function Divider({m="14px 0"}){return <div style={{height:1,background:T.border,margin:m}}/>;}
function StarRow({n,size=12,showN=false}){const r=parseFloat(n)||0;return <span style={{display:"inline-flex",alignItems:"center",gap:3}}>{[1,2,3,4,5].map(i=><span key={i} style={{fontSize:size,color:i<=Math.round(r)?T.gold:T.border,lineHeight:1}}>★</span>)}{showN&&<span style={{fontSize:size-1,fontWeight:700,color:T.text,marginLeft:2}}>{parseFloat(r).toFixed(1)}</span>}</span>;}
function ScoreCircle({score,sz=60}){const c=score>=4.5?T.green:score>=3.5?T.gold:T.accent;return <div style={{width:sz,height:sz,borderRadius:"50%",background:c+"18",border:`3px solid ${c}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:sz*.27,fontWeight:700,color:c,lineHeight:1,fontFamily:"'Instrument Serif',serif"}}>{parseFloat(score).toFixed(1)}</span><span style={{fontSize:sz*.11,color:c,fontWeight:600}}>/5</span></div>;}
function RatingBar({label,score,color=T.accent}){return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}><span style={{fontSize:12,color:T.sub,width:116,flexShrink:0}}>{label}</span><div style={{flex:1,height:5,background:T.border,borderRadius:99,overflow:"hidden"}}><div style={{width:`${(score/5)*100}%`,height:"100%",background:color,borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:T.text,width:26,textAlign:"right"}}>{parseFloat(score).toFixed(1)}</span></div>;}
function VerifiedBadge({label="✓ Verified",color=T.green,bg=T.greenLight}){return <Chip label={label} color={color} bg={bg}/>;}
function Spinner(){return <span style={{width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin .7s linear infinite",display:"inline-block"}}/>;}
function Toast({msg,type="ok",onDone}){useEffect(()=>{const t=setTimeout(onDone,2800);return()=>clearTimeout(t);},[]);const c=type==="ok"?T.green:T.red;return <div className="au" style={{position:"fixed",bottom:88,left:"50%",transform:"translateX(-50%)",background:T.text,color:"#fff",borderRadius:99,padding:"11px 20px",fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap",boxShadow:T.shadowLg,display:"flex",alignItems:"center",gap:8,maxWidth:"90vw"}}><span style={{color:c}}>{type==="ok"?"✅":"⚠️"}</span>{msg}</div>;}

/* ═══════════════════════════════════════════════════════════
   SCAM SHIELD BANNER
═══════════════════════════════════════════════════════════ */
function ScamShieldBanner(){
  const[open,setOpen]=useState(false);
  return(
    <div style={{background:"linear-gradient(135deg,#1a0f0a,#3d1810)",borderRadius:T.r,padding:"16px 18px",marginBottom:16,border:`1px solid ${T.accent}44`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:`${T.accent}22`,border:`2px solid ${T.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🛡️</div>
          <div>
            <div style={{color:"#fff",fontWeight:700,fontSize:14}}>NestMatch Scam Shield™</div>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>3 alerts in your area today</div>
          </div>
        </div>
        <button onClick={()=>setOpen(!open)} style={{background:`${T.accent}22`,border:`1px solid ${T.accent}44`,color:T.accent,borderRadius:T.rsm,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>{open?"Hide":"View Alerts"}</button>
      </div>
      {open&&(
        <div className="ai" style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
          {SCAM_ALERTS.map(a=>(
            <div key={a.id} style={{background:"rgba(255,255,255,.06)",borderRadius:T.rsm,padding:"12px 14px",border:`1px solid ${a.severity==="high"?"#c0392b33":"#e67e2233"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <span style={{fontSize:14}}>{a.severity==="high"?"🚨":"⚠️"}</span>
                <span style={{color:a.severity==="high"?"#ff6b6b":"#f39c12",fontWeight:700,fontSize:12}}>{a.type}</span>
                <span style={{color:"rgba(255,255,255,.4)",fontSize:11,marginLeft:"auto"}}>{a.date}</span>
              </div>
              <div style={{color:"rgba(255,255,255,.9)",fontWeight:600,fontSize:13,marginBottom:4}}>{a.title}</div>
              <div style={{color:"rgba(255,255,255,.55)",fontSize:12,lineHeight:1.5}}>{a.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEW CARD
═══════════════════════════════════════════════════════════ */
function ReviewCard({review,type}){
  const catL=type==="landlord"?{responsive:"Responsiveness",accurate:"Listing Accuracy",fair:"Fairness",professional:"Professionalism"}:{payment:"On-Time Payment",cleanliness:"Cleanliness",communication:"Communication",respectful:"Respectfulness"};
  return(
    <div style={{background:T.bg,borderRadius:T.r,padding:16,border:`1px solid ${T.border}`}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:T.accentLight,border:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{review.av}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
            <div><span style={{fontWeight:700,fontSize:13}}>{review.author}</span>{review.verified&&<span style={{marginLeft:5,fontSize:10,color:T.green,fontWeight:700}}>✓</span>}</div>
            <span style={{color:T.muted,fontSize:11,flexShrink:0}}>{review.date}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3,flexWrap:"wrap"}}>
            <StarRow n={review.overall} size={12}/>
            <span style={{fontSize:12,fontWeight:700}}>{review.overall}.0</span>
            {review.wouldAgain&&<Chip label={type==="landlord"?"🔄 Would rent again":"🔄 Would rent to again"} color={T.green} bg={T.greenLight}/>}
          </div>
        </div>
      </div>
      <p style={{color:T.sub,fontSize:13,lineHeight:1.65,marginBottom:10,fontStyle:"italic"}}>"{review.text}"</p>
      <Divider m="8px 0"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
        {Object.entries(catL).map(([k,lb])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{fontSize:11,color:T.muted,flex:1}}>{lb}</span>
            <StarRow n={review.ratings[k]} size={9}/>
            <span style={{fontSize:10,fontWeight:700,color:T.text,minWidth:12}}>{review.ratings[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WRITE REVIEW MODAL
═══════════════════════════════════════════════════════════ */
function WriteReviewModal({target,type,onClose,onSubmit}){
  const isL=type==="landlord";
  const cats=isL?{responsive:"Responsiveness",accurate:"Listing Accuracy",fair:"Fairness",professional:"Professionalism"}:{payment:"On-Time Payment",cleanliness:"Cleanliness",communication:"Communication",respectful:"Respectfulness"};
  const icons=isL?{responsive:"📞",accurate:"🏠",fair:"⚖️",professional:"👔"}:{payment:"💰",cleanliness:"✨",communication:"💬",respectful:"🤝"};
  const[step,setStep]=useState(1);
  const[overall,setOverall]=useState(0);
  const[hover,setHover]=useState(0);
  const[ratings,setRatings]=useState(Object.fromEntries(Object.keys(cats).map(k=>[k,0])));
  const[text,setText]=useState("");
  const[wouldAgain,setWouldAgain]=useState(null);
  const[submitting,setSubmitting]=useState(false);
  const allRated=Object.values(ratings).every(v=>v>0)&&overall>0;
  const canSubmit=allRated&&text.length>=20&&wouldAgain!==null;
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow=""};},[]);
  function submit(){setSubmitting(true);setTimeout(()=>{setStep(3);onSubmit();},900);}
  const starLabels=["","Poor","Fair","Good","Very Good","Excellent"];
  const starColors=["",T.red,"#E67E22",T.gold,T.blue,T.green];
  return(
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(5px)"}} onClick={onClose}/>
      <div className="pop" style={{position:"relative",background:T.white,borderRadius:T.rlg,width:"100%",maxWidth:460,maxHeight:"88vh",overflowY:"auto",zIndex:1,boxShadow:T.shadowLg}}>
        <div style={{padding:"18px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20}}>{step===3?"Submitted! 🎉":isL?"Rate Your Landlord":"Rate This Tenant"}</div>
            {step<3&&<div style={{color:T.muted,fontSize:11,marginTop:2}}>Step {step}/2 · {target.title||target.name}</div>}
          </div>
          <button onClick={onClose} style={{background:T.bg,border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",color:T.sub}}>✕</button>
        </div>
        <div style={{padding:"0 20px 20px"}}>
          {step===1&&(
            <div className="ai">
              <div style={{background:T.blueLight,border:`1px solid ${T.blue}22`,borderRadius:T.rsm,padding:"10px 13px",marginBottom:16,display:"flex",gap:8}}>
                <span style={{flexShrink:0}}>🔒</span>
                <p style={{color:T.blue,fontSize:12,lineHeight:1.55}}><strong>Blind review system</strong> — your review stays hidden until the other party also submits, preventing retaliation.</p>
              </div>
              {/* Overall */}
              <div style={{textAlign:"center",marginBottom:18,padding:"14px 0",background:T.bg,borderRadius:T.r}}>
                <div style={{color:T.muted,fontSize:12,marginBottom:10}}>Overall experience</div>
                <div style={{display:"flex",justifyContent:"center",gap:6}}>
                  {[1,2,3,4,5].map(i=><span key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)} onClick={()=>setOverall(i)} style={{fontSize:32,cursor:"pointer",color:i<=(hover||overall)?T.gold:T.border,transition:"color .1s",lineHeight:1}}>★</span>)}
                </div>
                {overall>0&&<div className="ai" style={{marginTop:7,fontSize:13,fontWeight:700,color:starColors[overall]}}>{starLabels[overall]}</div>}
              </div>
              {/* Category ratings */}
              <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
                {Object.entries(cats).map(([k,lb])=>{
                  const[h,setH]=useState(0);
                  return(
                    <div key={k} style={{display:"flex",alignItems:"center",gap:10,background:T.bg,borderRadius:T.rsm,padding:"10px 13px"}}>
                      <span style={{fontSize:18,flexShrink:0}}>{icons[k]}</span>
                      <span style={{flex:1,fontSize:13,fontWeight:600}}>{lb}</span>
                      <div style={{display:"flex",gap:3}}>
                        {[1,2,3,4,5].map(i=><span key={i} onMouseEnter={()=>setH(i)} onMouseLeave={()=>setH(0)} onClick={()=>setRatings({...ratings,[k]:i})} style={{fontSize:20,cursor:"pointer",color:i<=(h||ratings[k])?T.gold:T.border,transition:"color .1s",lineHeight:1}}>★</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Would again */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{isL?"Would you rent from this landlord again?":"Would you rent to this tenant again?"}</div>
                <div style={{display:"flex",gap:9}}>
                  {[true,false].map(v=><button key={String(v)} onClick={()=>setWouldAgain(v)} style={{flex:1,padding:"10px",borderRadius:T.rsm,border:`2px solid ${wouldAgain===v?(v?T.green:T.red):T.border}`,background:wouldAgain===v?(v?T.greenLight:T.redLight):T.bg,color:wouldAgain===v?(v?T.green:T.red):T.sub,cursor:"pointer",fontWeight:700,fontSize:13,transition:"all .18s",fontFamily:"'DM Sans',sans-serif"}}>{v?"👍 Yes, definitely":"👎 No"}</button>)}
                </div>
              </div>
              <Btn ch="Continue →" full disabled={!allRated||wouldAgain===null} onClick={()=>setStep(2)}/>
            </div>
          )}
          {step===2&&(
            <div className="ai">
              <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Written review <span style={{color:T.muted,fontWeight:400}}>(min. 20 chars)</span></div>
              <textarea value={text} onChange={e=>setText(e.target.value)} rows={5} placeholder={isL?"Describe your experience: Was the property as described? How was communication and maintenance?":"Describe your experience: Were they reliable, clean, and respectful of the space?"} style={{width:"100%",padding:"12px",borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:"none",fontSize:13,lineHeight:1.65,resize:"vertical",color:T.text,background:T.bg,marginBottom:5,transition:"border-color .18s"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
              <div style={{textAlign:"right",fontSize:11,color:text.length>=20?T.green:T.muted,marginBottom:12}}>{text.length} chars {text.length>=20?"✓":""}</div>
              <div style={{background:T.bg,borderRadius:T.rsm,padding:"9px 12px",marginBottom:14,display:"flex",gap:7}}>
                <span>⚖️</span><p style={{color:T.muted,fontSize:11,lineHeight:1.55}}>Do not include discriminatory language, personal contact details, or protected characteristics. Moderated under the Canadian Human Rights Act.</p>
              </div>
              <div style={{display:"flex",gap:9}}>
                <Btn ch="← Back" variant="ghost" size="sm" style={{width:80}} onClick={()=>setStep(1)}/>
                <Btn ch={submitting?<Spinner/>:"Submit Review ✓"} full disabled={!canSubmit||submitting} onClick={submit} style={{flex:1}}/>
              </div>
            </div>
          )}
          {step===3&&(
            <div className="ai" style={{textAlign:"center",padding:"8px 0"}}>
              <div style={{fontSize:52,marginBottom:13}}>🎉</div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,marginBottom:8}}>Review Submitted!</div>
              <p style={{color:T.sub,fontSize:13,lineHeight:1.65,marginBottom:14}}>Safely stored. It publishes the moment the other party submits theirs — keeping the process completely fair.</p>
              <div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.r,padding:"11px 14px",marginBottom:20,display:"flex",gap:8,alignItems:"center"}}>
                <span>🔒</span><span style={{color:T.green,fontSize:12,fontWeight:600}}>Both reviews publish together — no retaliation possible.</span>
              </div>
              <Btn ch="Done" full onClick={onClose}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEWS SECTION
═══════════════════════════════════════════════════════════ */
function ReviewsSection({id,type,onWriteReview}){
  const reviews=(type==="landlord"?LANDLORD_REVIEWS:TENANT_REVIEWS)[id]||[];
  const[showAll,setShowAll]=useState(false);
  const visible=showAll?reviews:reviews.slice(0,2);
  const avg=avgR(reviews);
  const cats=type==="landlord"?{responsive:"Responsiveness",accurate:"Listing Accuracy",fair:"Fairness",professional:"Professionalism"}:{payment:"On-Time Payment",cleanliness:"Cleanliness",communication:"Communication",respectful:"Respectfulness"};
  if(!reviews.length) return(
    <div style={{background:T.bg,borderRadius:T.r,padding:24,textAlign:"center",border:`1px solid ${T.border}`}}>
      <div style={{fontSize:32,marginBottom:9}}>⭐</div>
      <div style={{fontWeight:700,marginBottom:5}}>No reviews yet</div>
      <p style={{color:T.muted,fontSize:13,marginBottom:14}}>Be the first to review.</p>
      <Btn ch="✏️ Write Review" size="sm" onClick={onWriteReview}/>
    </div>
  );
  return(
    <div>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",background:T.bg,borderRadius:T.r,padding:16,border:`1px solid ${T.border}`,marginBottom:12}}>
        <ScoreCircle score={avg} sz={64}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{avg>=4.5?"Excellent":avg>=4?"Very Good":avg>=3?"Good":"Mixed"} · {reviews.length} review{reviews.length!==1?"s":""}</div>
          <div style={{color:T.muted,fontSize:11,marginBottom:10}}>{reviews.filter(r=>r.wouldAgain).length}/{reviews.length} would {type==="landlord"?"rent here":"rent to them"} again</div>
          {Object.keys(cats).map(k=><RatingBar key={k} label={cats[k]} score={catAvg(reviews,k)} color={parseFloat(catAvg(reviews,k))>=4?T.green:T.gold}/>)}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:10}}>
        {visible.map(r=><ReviewCard key={r.id} review={r} type={type}/>)}
      </div>
      <div style={{display:"flex",gap:9}}>
        {reviews.length>2&&<Btn ch={showAll?"Show less ↑":`See all ${reviews.length} ↓`} variant="secondary" size="sm" style={{flex:1}} onClick={()=>setShowAll(!showAll)}/>}
        <Btn ch="✏️ Write Review" size="sm" style={{flex:1}} onClick={onWriteReview}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LISTING CARD
═══════════════════════════════════════════════════════════ */
function ListingCard({l,saved,onSave,onClick}){
  const reviews=LANDLORD_REVIEWS[l.id]||[];
  const avg=avgR(reviews);
  const isSaved=saved.includes(l.id);
  return(
    <div className="lift" onClick={onClick} style={{background:T.white,borderRadius:T.rlg,overflow:"hidden",border:`1px solid ${T.border}`}}>
      {/* Image */}
      <div style={{position:"relative",height:185,background:l.gradient,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 35%,rgba(0,0,0,.45))"}}/> 
        <div style={{position:"absolute",top:11,left:11,display:"flex",gap:5,flexWrap:"wrap"}}>
          {l.isNew&&<span style={{background:"#fff",color:T.text,fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99}}>✨ New</span>}
          {l.topLandlord&&<span style={{background:T.accent,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99}}>⭐ Top Landlord</span>}
          {l.rentControlled&&<span style={{background:T.green,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99}}>🔒 Rent Controlled</span>}
        </div>
        <button onClick={e=>{e.stopPropagation();onSave(l.id);}} style={{position:"absolute",top:10,right:10,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>{isSaved?"❤️":"🤍"}</button>
        <div style={{position:"absolute",bottom:10,left:13}}>
          <div style={{color:"#fff",fontSize:11,opacity:.85}}>📍 {l.address}</div>
        </div>
        {reviews.length>0&&<div style={{position:"absolute",bottom:9,right:10,background:"rgba(255,255,255,.9)",borderRadius:99,padding:"2px 9px",display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:700}}><span style={{color:T.gold}}>★</span>{avg}<span style={{color:T.muted,fontWeight:400}}>({reviews.length})</span></div>}
      </div>
      {/* Info */}
      <div style={{padding:"13px 15px 15px"}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:1,lineHeight:1.3}}>{l.title}</div>
        <div style={{color:T.muted,fontSize:12,marginBottom:8}}>{l.city}</div>
        <div style={{display:"flex",gap:10,fontSize:11,color:T.sub,marginBottom:8,flexWrap:"wrap"}}>
          <span>🛏 {l.beds}bd</span><span>🚿 {l.baths}ba</span>
          <span>📐 {l.sqftPP} ft²/person</span><span>👥 {l.spots} spot{l.spots>1?"s":""}</span>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
          {l.tags.slice(0,3).map(t=><span key={t} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 8px",fontSize:10,color:T.sub}}>{t}</span>)}
        </div>
        <Divider m="0 0 10px"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><span style={{fontSize:18,fontWeight:800}}>${l.price.toLocaleString()}</span><span style={{color:T.muted,fontSize:11}}>/person/mo</span></div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>{l.verified&&<VerifiedBadge/>}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOMMATE CARD
═══════════════════════════════════════════════════════════ */
function RoommateCard({r,saved,onSave,onClick,contacted,onContact}){
  const isSaved=saved.includes(r.id);
  const isContacted=contacted.includes(r.id);
  const reviews=TENANT_REVIEWS[r.id]||[];
  const avg=avgR(reviews);
  return(
    <div className="lift" onClick={onClick} style={{background:T.white,borderRadius:T.rlg,border:`1px solid ${T.border}`,padding:16}}>
      <div style={{display:"flex",gap:12,marginBottom:11}}>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:T.accentLight,border:`2px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{r.emoji}</div>
          {r.idVerified&&<div style={{position:"absolute",bottom:-1,right:-1,width:16,height:16,borderRadius:"50%",background:T.green,border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"white"}}>✓</div>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><span style={{fontWeight:700,fontSize:14}}>{r.name}</span><span style={{color:T.muted,fontSize:12,marginLeft:5}}>· {r.age}</span></div>
            <button onClick={e=>{e.stopPropagation();onSave(r.id);}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",flexShrink:0}}>{isSaved?"❤️":"🤍"}</button>
          </div>
          <div style={{color:T.sub,fontSize:12,marginTop:1}}>{r.job} · {r.co}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
            {r.verified&&<VerifiedBadge label="✓ Income"/>}
            {r.backgroundCheck&&<Chip label="🔍 Background Check" color={T.blue} bg={T.blueLight}/>}
            {reviews.length>0&&<span style={{fontSize:11,color:T.gold}}>★ {avg} ({reviews.length})</span>}
          </div>
        </div>
      </div>
      <p style={{color:T.sub,fontSize:12,lineHeight:1.6,marginBottom:10,fontStyle:"italic",borderLeft:`3px solid ${T.border}`,paddingLeft:9}}>"{r.bio}"</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:10}}>
        {[["💰",`$${r.budget}/mo`],["📅",r.schedule],["🏠",r.looking]].map(([ic,v])=>(
          <div key={v} style={{background:T.bg,borderRadius:T.rsm,padding:"7px 8px",textAlign:"center"}}>
            <div style={{fontSize:14}}>{ic}</div><div style={{fontSize:10,fontWeight:700,color:T.sub,marginTop:2}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn ch={isSaved?"❤️":"🤍"} variant="secondary" size="sm" style={{flex:1}} onClick={e=>{e.stopPropagation();onSave(r.id);}}/>
        <Btn ch={isContacted?"✅ Sent":"👋 Connect"} size="sm" style={{flex:2}} onClick={e=>{e.stopPropagation();onContact(r.id);}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DETAIL SHEETS
═══════════════════════════════════════════════════════════ */
function ListingSheet({l,onClose,saved,onSave,contacted,onContact,onWriteReview}){
  const[sec,setSec]=useState("details");
  const reviews=LANDLORD_REVIEWS[l.id]||[];
  const avg=avgR(reviews);
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div className="su" style={{position:"relative",background:T.white,borderRadius:`${T.rlg} ${T.rlg} 0 0`,marginTop:"auto",maxHeight:"92vh",overflowY:"auto",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"center",padding:"11px 0 0"}}><div style={{width:34,height:4,borderRadius:2,background:T.border}}/></div>
        {/* Hero */}
        <div style={{height:192,background:l.gradient,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",fontSize:72}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 45%,rgba(0,0,0,.5))"}}/> 
          <button onClick={onClose} style={{position:"absolute",top:11,left:11,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <button onClick={()=>onSave(l.id)} style={{position:"absolute",top:11,right:11,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",fontSize:16}}>{saved.includes(l.id)?"❤️":"🤍"}</button>
          <div style={{position:"absolute",bottom:12,left:16}}>
            <div style={{color:"#fff",fontFamily:"'Instrument Serif',serif",fontSize:19}}>{l.title}</div>
            <div style={{color:"rgba(255,255,255,.75)",fontSize:12}}>📍 {l.address}, {l.city}</div>
          </div>
        </div>
        {/* Subtabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,padding:"0 16px"}}>
          {["details","reviews"].map(s=>(
            <button key={s} onClick={()=>setSec(s)} style={{padding:"12px 14px",border:"none",background:"transparent",cursor:"pointer",fontWeight:600,fontSize:13,color:sec===s?T.accent:T.muted,borderBottom:`2px solid ${sec===s?T.accent:"transparent"}`,transition:"all .18s",fontFamily:"'DM Sans',sans-serif"}}>
              {s==="details"?"🏠 Details":`⭐ Reviews${reviews.length>0?` (${reviews.length})`:""}`}
            </button>
          ))}
        </div>
        <div style={{padding:"16px 16px 92px"}}>
          {sec==="details"&&(
            <div className="ai">
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {l.verified&&<VerifiedBadge label="✓ Landlord Verified"/>}
                {l.topLandlord&&<Chip label="⭐ Top Landlord" color={T.accent} bg={T.accentLight}/>}
                {l.rentControlled&&<Chip label="🔒 Rent Controlled" color={T.green} bg={T.greenLight}/>}
                {reviews.length>0&&<Chip label={`★ ${avg} (${reviews.length})`} color={T.gold} bg={T.goldLight}/>}
              </div>
              {/* Scam protection note */}
              <div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.rsm,padding:"10px 13px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
                <span>🛡️</span><p style={{color:T.green,fontSize:12,lineHeight:1.5}}><strong>Scam Shield verified.</strong> Landlord identity confirmed, property ownership cross-checked, listing photos verified against building records.</p>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div><span style={{fontFamily:"'Instrument Serif',serif",fontSize:28}}>${l.price.toLocaleString()}</span><span style={{color:T.muted,fontSize:13}}> /person/mo</span><div style={{color:T.muted,fontSize:11,marginTop:2}}>Total ${l.total.toLocaleString()}/mo · {l.sqftPP} ft²/person</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:12,color:T.muted}}>Spots left</div><div style={{fontWeight:800,fontSize:20,color:l.spots===1?T.accent:T.green}}>{l.spots}</div></div>
              </div>
              <Divider/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,margin:"14px 0"}}>
                {[["🛏️","Beds",l.beds],["🚿","Baths",l.baths],["📐","Sq Ft",l.sqft],["📐","Per Person",`${l.sqftPP} ft²`],["💰","Min Income",`$${l.minIncome.toLocaleString()}`],["🔒","Rent Control",l.rentControlled?"Yes ✓":"No"]].map(([ic,lb,v])=>(
                  <div key={lb} style={{background:T.bg,borderRadius:T.rsm,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontSize:18,marginBottom:2}}>{ic}</div>
                    <div style={{color:T.muted,fontSize:8,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{lb}</div>
                    <div style={{color:T.text,fontWeight:700,fontSize:11,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
              <Divider/>
              <div style={{margin:"12px 0"}}><div style={{fontWeight:700,fontSize:13,marginBottom:8}}>Amenities</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{l.tags.map(t=><Chip key={t} label={t} color={T.blue} bg={T.blueLight}/>)}</div></div>
              <div style={{background:T.accentLight,border:`1px solid ${T.accent}22`,borderRadius:T.rsm,padding:"11px 13px",marginTop:4}}>
                <div style={{fontWeight:700,color:T.accent,fontSize:12,marginBottom:3}}>💡 Income Check (3× Rent Rule)</div>
                <p style={{color:T.sub,fontSize:12,lineHeight:1.55}}>This listing requires ${l.minIncome.toLocaleString()}/mo household income. Each roommate needs ~${Math.ceil(l.price*3).toLocaleString()}/mo to qualify.</p>
              </div>
            </div>
          )}
          {sec==="reviews"&&(
            <div className="ai">
              <div style={{marginBottom:12}}><div style={{fontFamily:"'Instrument Serif',serif",fontSize:18,marginBottom:3}}>Landlord Reviews</div><p style={{color:T.muted,fontSize:12}}>What verified tenants say about living here.</p></div>
              <ReviewsSection id={l.id} type="landlord" onWriteReview={()=>onWriteReview({...l,reviewType:"landlord"})}/>
            </div>
          )}
        </div>
        <div style={{position:"sticky",bottom:0,background:T.white,borderTop:`1px solid ${T.border}`,padding:"11px 16px",display:"flex",gap:9}}>
          <Btn ch={saved.includes(l.id)?"❤️":"🤍"} variant="secondary" style={{width:44,padding:0}} onClick={()=>onSave(l.id)}/>
          <Btn ch={contacted.includes(l.id)?"✅ Request Sent":"📩 Contact Landlord"} full onClick={()=>onContact(l.id)} style={{flex:1,fontSize:13,padding:"13px 0"}}/>
        </div>
      </div>
    </div>
  );
}

function RoommateSheet({r,onClose,saved,onSave,contacted,onContact,onWriteReview}){
  const[sec,setSec]=useState("profile");
  const reviews=TENANT_REVIEWS[r.id]||[];
  const avg=avgR(reviews);
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div className="su" style={{position:"relative",background:T.white,borderRadius:`${T.rlg} ${T.rlg} 0 0`,marginTop:"auto",maxHeight:"92vh",overflowY:"auto",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"center",padding:"11px 0 0"}}><div style={{width:34,height:4,borderRadius:2,background:T.border}}/></div>
        <div style={{padding:"12px 16px 0",display:"flex",justifyContent:"space-between"}}>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontWeight:600,fontSize:13}}>← Back</button>
          <button onClick={()=>onSave(r.id)} style={{background:"none",border:"none",fontSize:19,cursor:"pointer"}}>{saved.includes(r.id)?"❤️":"🤍"}</button>
        </div>
        <div style={{padding:"12px 16px 0",display:"flex",gap:14,alignItems:"center"}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:68,height:68,borderRadius:"50%",background:T.accentLight,border:`3px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{r.emoji}</div>
            {r.idVerified&&<div style={{position:"absolute",bottom:0,right:0,width:20,height:20,borderRadius:"50%",background:T.green,border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"white"}}>✓</div>}
          </div>
          <div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:21}}>{r.name}</div>
            <div style={{color:T.sub,fontSize:13}}>{r.job} · {r.co}</div>
            <div style={{color:T.muted,fontSize:12,marginTop:1}}>📍 {r.city}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:7}}>
              {r.verified&&<VerifiedBadge label="✓ Income Verified"/>}
              {r.idVerified&&<VerifiedBadge label="✓ ID Verified"/>}
              {r.backgroundCheck&&<Chip label="🔍 Background Check" color={T.blue} bg={T.blueLight}/>}
              {reviews.length>0&&<Chip label={`★ ${avg}`} color={T.gold} bg={T.goldLight}/>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,padding:"0 16px",marginTop:12}}>
          {["profile","reviews"].map(s=>(
            <button key={s} onClick={()=>setSec(s)} style={{padding:"12px 14px",border:"none",background:"transparent",cursor:"pointer",fontWeight:600,fontSize:13,color:sec===s?T.accent:T.muted,borderBottom:`2px solid ${sec===s?T.accent:"transparent"}`,transition:"all .18s",fontFamily:"'DM Sans',sans-serif"}}>
              {s==="profile"?"👤 Profile":`⭐ Reviews${reviews.length>0?` (${reviews.length})`:""}`}
            </button>
          ))}
        </div>
        <div style={{padding:"16px 16px 92px"}}>
          {sec==="profile"&&(
            <div className="ai">
              <div style={{background:T.bg,borderRadius:T.r,padding:13,marginBottom:16,borderLeft:`4px solid ${T.accent}`}}><p style={{color:T.sub,fontSize:13,lineHeight:1.65,fontStyle:"italic"}}>"{r.bio}"</p></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
                {[["💰","Budget",`$${r.budget}/mo`],["📅","Schedule",r.schedule],["🏠","Looking For",r.looking],["✨","Cleanliness",`${r.clean}/5`],["🐾","Pets",r.pets?"Has pets":"No pets"],["🚬","Smoking",r.smoke?"Smokes":"Non-smoker"]].map(([ic,lb,v])=>(
                  <div key={lb} style={{background:T.bg,borderRadius:T.rsm,padding:"10px 12px"}}>
                    <div style={{fontSize:17,marginBottom:3}}>{ic}</div>
                    <div style={{color:T.muted,fontSize:8,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{lb}</div>
                    <div style={{color:T.text,fontWeight:700,fontSize:12,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
              <div><div style={{fontWeight:700,fontSize:13,marginBottom:7}}>Languages</div><div style={{display:"flex",gap:6}}>{r.langs.map(l=><Chip key={l} label={l} color={T.blue} bg={T.blueLight}/>)}</div></div>
            </div>
          )}
          {sec==="reviews"&&(
            <div className="ai">
              <div style={{marginBottom:12}}><div style={{fontFamily:"'Instrument Serif',serif",fontSize:18,marginBottom:3}}>Tenant Reviews</div><p style={{color:T.muted,fontSize:12}}>What landlords say about {r.name.split(" ")[0]}.</p></div>
              <ReviewsSection id={r.id} type="tenant" onWriteReview={()=>onWriteReview({...r,reviewType:"tenant"})}/>
            </div>
          )}
        </div>
        <div style={{position:"sticky",bottom:0,background:T.white,borderTop:`1px solid ${T.border}`,padding:"11px 16px",display:"flex",gap:9}}>
          <Btn ch={saved.includes(r.id)?"❤️":"🤍"} variant="secondary" style={{width:44,padding:0}} onClick={()=>onSave(r.id)}/>
          <Btn ch={contacted.includes(r.id)?"✅ Request Sent":"👋 Send Request"} full onClick={()=>onContact(r.id)} style={{flex:1,fontSize:13,padding:"13px 0"}}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MY REVIEWS TAB
═══════════════════════════════════════════════════════════ */
function MyReviewsTab({onWriteReview}){
  const pending=[{id:"p1",name:"Jordan T.",emoji:"👨‍💻",reviewType:"tenant",due:"Apr 15"},{id:"p2",name:"Lakeshore Condo",emoji:"🌆",reviewType:"landlord",due:"Apr 22"}];
  const received=TENANT_REVIEWS[3]||[];
  const written=[{target:"Lakeshore Condo",date:"March 2025",overall:5,text:"Great landlord, very responsive.",published:true},{target:"Jordan T.",date:"April 2025",overall:4,text:"Good roommate, respectful of shared space.",published:false}];
  return(
    <div className="ai" style={{paddingTop:18}}>
      <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20,marginBottom:4}}>My Reviews</div>
      <p style={{color:T.muted,fontSize:13,marginBottom:18}}>Pending, received, and reviews you've written.</p>
      {/* Pending */}
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:11}}><div style={{width:7,height:7,borderRadius:"50%",background:T.accent}}/><span style={{fontWeight:700,fontSize:13}}>Pending Reviews</span><Chip label={`${pending.length} due`} color={T.accent} bg={T.accentLight}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {pending.map(p=>(
            <div key={p.id} style={{background:T.white,border:`1.5px solid ${T.accent}33`,borderRadius:T.r,padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{p.emoji}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{p.name}</div><div style={{color:T.muted,fontSize:11,marginTop:2}}>Due {p.due} · {p.reviewType==="landlord"?"Landlord review":"Tenant review"}</div></div>
              <Btn ch="Write →" size="sm" onClick={()=>onWriteReview(p)}/>
            </div>
          ))}
        </div>
      </div>
      <Divider/>
      {/* Received */}
      <div style={{marginBottom:20,marginTop:16}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:11}}>Reviews About You</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {received.map((r,i)=>(
            <div key={i} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:T.r,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{r.av}</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{r.author}</div><div style={{color:T.muted,fontSize:11}}>{r.date}</div></div>
                <StarRow n={r.overall} size={12} showN/>
              </div>
              <p style={{color:T.sub,fontSize:12,lineHeight:1.6,fontStyle:"italic"}}>"{r.text}"</p>
              {r.wouldAgain&&<div style={{marginTop:7}}><Chip label="🔄 Would rent to again" color={T.green} bg={T.greenLight}/></div>}
            </div>
          ))}
        </div>
      </div>
      {/* Written */}
      <div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:11}}>Reviews You've Written</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {written.map((r,i)=>(
            <div key={i} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:T.r,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:T.bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>🏠</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{r.target}</div><div style={{color:T.muted,fontSize:11}}>{r.date}</div></div>
                <Chip label={r.published?"✓ Published":"⏳ Pending"} color={r.published?T.green:T.gold} bg={r.published?T.greenLight:T.goldLight}/>
              </div>
              <StarRow n={r.overall} size={12} showN/>
              <p style={{color:T.sub,fontSize:12,lineHeight:1.6,fontStyle:"italic",marginTop:7}}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════ */
function Landing({onStart}){
  const[activeP,setActiveP]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:T.bg}}>
      {/* Nav */}
      <nav style={{background:"rgba(249,247,244,.95)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.border}`,padding:"0 20px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏠</div>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:19}}>NestMatch</span>
          <Chip label="🇨🇦 Canada" color={T.blue} bg={T.blueLight}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn ch="List Your Place" variant="ghost" size="sm"/>
          <Btn ch="Sign Up Free" size="sm" onClick={onStart}/>
        </div>
      </nav>

      {/* Hero */}
      <div style={{background:"linear-gradient(160deg,#fff 0%,#FDF0EC 60%,#FFF8F5 100%)",padding:"60px 20px 70px",textAlign:"center"}}>
        <div className="au" style={{marginBottom:14}}><Chip label="✦ Solving Canada's rental crisis · Toronto · Vancouver · Montréal · Calgary"/></div>
        <h1 className="au s1" style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(34px,7vw,58px)",lineHeight:1.1,maxWidth:660,margin:"0 auto 16px",color:T.text}}>
          Safe Rentals.<br/><span style={{color:T.accent,fontStyle:"italic"}}>Real Roommates.</span><br/>Zero Scams.
        </h1>
        <p className="au s2" style={{color:T.sub,fontSize:15,lineHeight:1.8,maxWidth:500,margin:"0 auto 30px"}}>
          NestMatch screens income, verifies identities, matches compatible roommates, and shields you from the scams flooding Facebook groups and Kijiji.
        </p>
        <div className="au s3" style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
          <Btn ch="Get Started Free →" size="lg" onClick={onStart}/>
          <Btn ch="Browse Listings" variant="secondary" size="lg"/>
        </div>
        <div className="au s4" style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
          {["🛡️ Scam Shield™","✅ Income Screening","🔍 ID Verification","⭐ Blind Reviews","📏 Real Square Footage","🔒 Rent Control Filter"].map(f=><span key={f} style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:99,padding:"6px 13px",fontSize:11,color:T.sub,fontWeight:500}}>{f}</span>)}
        </div>
        <div className="au s5" style={{display:"flex",gap:32,justifyContent:"center",flexWrap:"wrap"}}>
          {[["$2.3M","Lost to scams NestMatch stops"],["1,240+","Verified Canadians"],["4.9★","Average review score"],["48hrs","Avg. time to match"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,color:T.accent}}>{n}</div><div style={{color:T.muted,fontSize:11}}>{l}</div></div>
          ))}
        </div>
      </div>

      {/* Problems we solve */}
      <div style={{background:T.white,padding:"50px 20px",borderTop:`1px solid ${T.border}`}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <Chip label="🚨 The Problems" color={T.red} bg={T.redLight}/>
            <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(24px,5vw,36px)",margin:"12px 0 10px"}}>What people post about<br/>in Canadian rental groups</h2>
            <p style={{color:T.muted,fontSize:14,lineHeight:1.7}}>These are real, documented problems renters and landlords face every day in Toronto, Vancouver, and across Canada.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
            {PROBLEMS.map((p,i)=>(
              <div key={i} onClick={()=>setActiveP(activeP===i?null:i)} style={{background:activeP===i?T.accentLight:T.bg,border:`1.5px solid ${activeP===i?T.accent:T.border}`,borderRadius:T.r,padding:18,cursor:"pointer",transition:"all .2s"}}>
                <div style={{fontSize:28,marginBottom:9}}>{p.icon}</div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{p.title}</div>
                <div style={{background:activeP===i?T.accent:T.red,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:99,display:"inline-block",marginBottom:8}}>{p.stat}</div>
                <p style={{color:T.sub,fontSize:12,lineHeight:1.55,marginBottom:8}}>{p.desc}</p>
                {activeP===i&&(
                  <div className="ai" style={{background:"#fff",borderRadius:T.rsm,padding:"10px 12px",border:`1px solid ${T.accent}33`}}>
                    <div style={{color:T.accent,fontSize:11,fontWeight:700,marginBottom:3}}>✅ NestMatch Solution</div>
                    <p style={{color:T.sub,fontSize:11,lineHeight:1.55}}>{p.fix}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust section */}
      <div style={{background:T.bg,padding:"48px 20px",borderTop:`1px solid ${T.border}`}}>
        <div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}>
          <Chip label="⭐ Trust by Design"/>
          <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(22px,4vw,32px)",margin:"12px 0 10px"}}>Every Protection You Need</h2>
          <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:36}}>We built NestMatch specifically for the problems Canadian renters face — not a US platform retrofitted for Canada.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16}}>
            {[["🛡️","Scam Shield™","AI + human review of every listing before it goes live."],["🔒","Blind Reviews","Neither party sees the other's review until both submit."],["💰","Income Screening","3× rent rule applied automatically to listings you qualify for."],["🔍","ID Verification","Government ID checked for every renter and landlord."],["⚖️","Human Rights Safe","Moderated under the Canadian Human Rights Act."],["📐","Real Dimensions","Square footage per person required — no more shoe boxes."]].map(([ic,t,d])=>(
              <div key={t} style={{textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 10px",border:`1.5px solid ${T.border}`}}>{ic}</div>
                <div style={{fontWeight:700,fontSize:12,marginBottom:3}}>{t}</div>
                <div style={{color:T.muted,fontSize:11,lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{background:`linear-gradient(135deg,${T.accent},${T.accentHover})`,padding:"48px 20px",textAlign:"center"}}>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(24px,5vw,36px)",color:"#fff",marginBottom:10}}>Ready to find your nest?</h2>
        <p style={{color:"rgba(255,255,255,.8)",fontSize:14,marginBottom:24,lineHeight:1.7}}>Join 1,200+ Canadians who chose safe, verified, scam-free renting.</p>
        <Btn ch="Get Started — It's Free 🏠" variant="secondary" size="lg" style={{background:"#fff",color:T.accent}} onClick={onStart}/>
      </div>
      <footer style={{background:T.text,color:"rgba(255,255,255,.4)",padding:"24px 20px",textAlign:"center",fontSize:11}}>
        <div style={{fontFamily:"'Instrument Serif',serif",color:"#fff",fontSize:16,marginBottom:5}}>NestMatch 🏠</div>
        <div>© 2025 NestMatch Inc. · Toronto, Canada · Privacy Policy · Terms of Service · Scam Reporting</div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════════ */
function Onboarding({onDone}){
  const[step,setStep]=useState(0);
  const[role,setRole]=useState(null);
  const[form,setForm]=useState({name:"",income:"",budget:"",pets:false,smoke:false,schedule:"Flexible",clean:4,looking:"2BR"});
  const qMax=form.income?Math.floor(parseFloat(form.income)/3):null;
  function inp(k){return{value:form[k],onChange:e=>setForm({...form,[k]:e.target.value})};}
  const steps=["Role","Screening","Preferences"];
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
      <style>{GS}</style>
      <div style={{width:"100%",maxWidth:430}}>
        {/* Progress */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:26}}>
          {steps.map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:i<step?T.green:i===step?T.accent:T.border,color:i<=step?"#fff":T.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,transition:"all .3s",flexShrink:0}}>{i<step?"✓":i+1}</div>
              <span style={{fontSize:11,color:i===step?T.accent:T.muted,fontWeight:i===step?700:400}}>{s}</span>
              {i<2&&<div style={{width:16,height:1.5,background:i<step?T.green:T.border,marginLeft:4}}/>}
            </div>
          ))}
        </div>
        <div style={{background:T.white,borderRadius:T.rlg,padding:24,boxShadow:T.shadow}}>
          {step===0&&(
            <div className="au">
              <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:36,marginBottom:9}}>🏠</div><h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:23,marginBottom:5}}>Welcome to NestMatch</h2><p style={{color:T.sub,fontSize:13,lineHeight:1.6}}>Canada's safest rental & roommate platform.</p></div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
                {[{r:"renter",icon:"🙋",t:"I'm a Renter",d:"Looking for a home and/or roommate"},{r:"landlord",icon:"🏢",t:"I'm a Landlord",d:"I have a property to list"}].map(({r,icon,t,d})=>(
                  <div key={r} onClick={()=>setRole(r)} style={{cursor:"pointer",border:`2px solid ${role===r?T.accent:T.border}`,borderRadius:T.r,padding:"14px 16px",background:role===r?T.accentLight:T.white,display:"flex",alignItems:"center",gap:12,transition:"all .18s"}}>
                    <span style={{fontSize:28}}>{icon}</span>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{t}</div><div style={{color:T.muted,fontSize:12}}>{d}</div></div>
                    <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${role===r?T.accent:T.border}`,background:role===r?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,flexShrink:0}}>{role===r?"✓":""}</div>
                  </div>
                ))}
              </div>
              <Btn ch="Continue →" full disabled={!role} onClick={()=>setStep(1)}/>
            </div>
          )}
          {step===1&&(
            <div className="au">
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:21,marginBottom:5}}>Income Screening</h2>
              <p style={{color:T.sub,fontSize:13,marginBottom:14}}>Private & secure — only a verified badge is shown to others.</p>
              <div style={{background:T.bg,borderRadius:T.rsm,padding:"9px 12px",marginBottom:14,display:"flex",gap:7}}><span>🔒</span><p style={{color:T.muted,fontSize:12,lineHeight:1.55}}>We use the 3× rent rule to pre-qualify you for listings automatically. Your exact income is never shared.</p></div>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                {[["name","Full Name","Jane Smith","text"],["income","Monthly Income (CAD)","e.g. 5,000","number"],["budget","Max Monthly Budget","e.g. 1,200","number"]].map(([k,lb,ph,tp])=>(
                  <div key={k}>
                    <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.muted,marginBottom:4}}>{lb}</label>
                    <input type={tp} placeholder={ph} {...inp(k)} style={{width:"100%",padding:"10px 12px",borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:"none",fontSize:13,background:T.bg,transition:"border-color .18s"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                  </div>
                ))}
              </div>
              {qMax&&<div className="ai" style={{marginTop:10,background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.rsm,padding:"8px 12px"}}><div style={{color:T.green,fontWeight:700,fontSize:12}}>✅ You qualify for listings up to ${qMax.toLocaleString()}/mo</div></div>}
              <div style={{display:"flex",gap:8,marginTop:16}}>
                <Btn ch="← Back" variant="ghost" style={{width:72}} onClick={()=>setStep(0)}/>
                <Btn ch="Continue →" style={{flex:1}} onClick={()=>setStep(2)}/>
              </div>
            </div>
          )}
          {step===2&&(
            <div className="au">
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:21,marginBottom:5}}>Your Preferences</h2>
              <p style={{color:T.sub,fontSize:13,marginBottom:18}}>Helps us match you with the most compatible roommates.</p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["looking","Looking For",["Studio","1BR","2BR","3BR","Any"]],["schedule","Schedule",["Early Bird","Night Owl","Flexible"]]].map(([k,lb,opts])=>(
                    <div key={k}>
                      <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.muted,marginBottom:4}}>{lb}</label>
                      <select {...inp(k)} style={{width:"100%",padding:"9px 10px",borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:"none",fontSize:13,background:T.white,cursor:"pointer"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.muted,marginBottom:6}}>Cleanliness Level</label>
                  <div style={{display:"flex",gap:7}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setForm({...form,clean:n})} style={{flex:1,padding:"8px 0",borderRadius:T.rsm,border:`2px solid ${form.clean>=n?T.gold:T.border}`,background:form.clean>=n?T.goldLight:T.bg,color:form.clean>=n?T.gold:T.muted,cursor:"pointer",fontSize:16,transition:"all .18s",fontFamily:"'DM Sans',sans-serif"}}>★</button>)}</div>
                </div>
                <div style={{display:"flex",gap:9}}>
                  {[["pets","🐾 Pets OK"],["smoke","🚬 Smoking OK"]].map(([k,lb])=>(
                    <button key={k} onClick={()=>setForm({...form,[k]:!form[k]})} style={{flex:1,padding:"10px",borderRadius:T.rsm,border:`2px solid ${form[k]?T.accent:T.border}`,background:form[k]?T.accentLight:T.bg,color:form[k]?T.accent:T.sub,cursor:"pointer",fontWeight:600,fontSize:12,transition:"all .18s",fontFamily:"'DM Sans',sans-serif"}}>{lb}</button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:20}}>
                <Btn ch="← Back" variant="ghost" style={{width:72}} onClick={()=>setStep(1)}/>
                <Btn ch="Find My Matches 🚀" style={{flex:1}} onClick={()=>onDone(form,role)}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
function Dashboard({user,role}){
  const[tab,setTab]=useState("explore");
  const[saved,setSaved]=useState([]);
  const[contacted,setContacted]=useState([]);
  const[detail,setDetail]=useState(null);
  const[toast,setToast]=useState(null);
  const[city,setCity]=useState("All Cities");
  const[writeReview,setWriteReview]=useState(null);
  const income=parseFloat(user.income)||0;
  const qMax=qualMax(income);
  function save(id){const s=!saved.includes(id);setSaved(sv=>sv.includes(id)?sv.filter(x=>x!==id):[...sv,id]);setToast(s?"Saved ❤️":"Removed from saved");}
  function contact(id){setContacted(c=>[...new Set([...c,id])]);setToast("Request sent! They'll be notified.");setDetail(null);}
  const filtered=LISTINGS.filter(l=>city==="All Cities"||l.city===city);
  const tabs=[{id:"explore",icon:"🔍",label:"Explore"},{id:"roommates",icon:"🤝",label:"Roommates"},{id:"reviews",icon:"⭐",label:"Reviews"},{id:"saved",icon:"❤️",label:"Saved"},{id:"profile",icon:"👤",label:"Profile"}];
  const userReviews={received:TENANT_REVIEWS[3]||[],written:[{target:"Lakeshore Condo",date:"March 2025",overall:5,text:"Excellent landlord — very responsive.",published:true},{target:"Jordan T.",date:"April 2025",overall:4,text:"Great roommate, kept things tidy.",published:false}]};
  return(
    <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
      {writeReview&&<WriteReviewModal target={writeReview} type={writeReview.reviewType||"landlord"} onClose={()=>setWriteReview(null)} onSubmit={()=>{setToast("Review submitted! Publishes when both parties have reviewed. 🎉");setWriteReview(null);}}/>}
      {detail?.type==="listing"&&<ListingSheet l={detail.item} onClose={()=>setDetail(null)} saved={saved} onSave={save} contacted={contacted} onContact={contact} onWriteReview={t=>{setDetail(null);setWriteReview(t);}}/>}
      {detail?.type==="roommate"&&<RoommateSheet r={detail.item} onClose={()=>setDetail(null)} saved={saved} onSave={save} contacted={contacted} onContact={contact} onWriteReview={t=>{setDetail(null);setWriteReview(t);}}/>}

      {/* Nav */}
      <nav style={{background:"rgba(249,247,244,.97)",backdropFilter:"blur(10px)",borderBottom:`1px solid ${T.border}`,padding:"0 16px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:28,height:28,borderRadius:7,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🏠</div>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:17}}>NestMatch</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {income>0&&<Chip label="✅ Verified" color={T.green} bg={T.greenLight}/>}
          <div style={{width:32,height:32,borderRadius:"50%",background:T.accentLight,border:`2px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{role==="landlord"?"🏢":"🙋"}</div>
        </div>
      </nav>

      <div style={{maxWidth:840,margin:"0 auto",padding:"0 13px"}}>
        {/* EXPLORE */}
        {tab==="explore"&&(
          <div className="ai">
            <div style={{padding:"14px 0 12px"}}>
              <div style={{background:T.white,borderRadius:99,border:`1.5px solid ${T.border}`,boxShadow:T.shadow,display:"flex",alignItems:"center",overflow:"hidden"}}>
                <div style={{flex:1,padding:"10px 14px",display:"flex",alignItems:"center",gap:7}}><span style={{color:T.muted}}>🔍</span><input placeholder="City, neighbourhood, or address..." style={{border:"none",outline:"none",fontSize:13,color:T.text,background:"transparent",width:"100%"}}/></div>
                <div style={{padding:"6px 6px 6px 0"}}><button style={{background:T.accent,color:"#fff",border:"none",borderRadius:99,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Search</button></div>
              </div>
            </div>
            {/* Scam shield */}
            <ScamShieldBanner/>
            {/* City filter */}
            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
              {CITIES.map(c=><button key={c} onClick={()=>setCity(c)} style={{whiteSpace:"nowrap",padding:"7px 13px",borderRadius:99,border:`1.5px solid ${city===c?T.accent:T.border}`,background:city===c?T.accentLight:T.white,color:city===c?T.accent:T.sub,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .18s",flexShrink:0,fontFamily:"'DM Sans',sans-serif"}}>{c}</button>)}
            </div>
            {income>0&&<div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.r,padding:"10px 13px",marginBottom:14,display:"flex",gap:7,alignItems:"center"}}><span>💡</span><span style={{color:T.green,fontSize:12,fontWeight:500}}>You qualify for listings up to <strong>${qMax.toLocaleString()}/mo</strong>. <span style={{color:T.greenMid}}>Listings below are pre-filtered to your income.</span></span></div>}
            {/* Filters row */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:19}}>{filtered.length} listing{filtered.length!==1?"s":""}</h2>
              <div style={{display:"flex",gap:7}}>
                <Btn ch="🔒 Rent Control" variant="ghost" size="sm"/>
                <Btn ch="⚙️ Filters" variant="ghost" size="sm"/>
                <Btn ch="🗺️ Map" variant="ghost" size="sm"/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:16}}>
              {filtered.map((l,i)=><div key={l.id} className={`au s${Math.min(i+1,5)}`}><ListingCard l={l} saved={saved} onSave={save} onClick={()=>setDetail({type:"listing",item:l})}/></div>)}
            </div>
          </div>
        )}

        {/* ROOMMATES */}
        {tab==="roommates"&&(
          <div className="ai" style={{paddingTop:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div><div style={{fontFamily:"'Instrument Serif',serif",fontSize:20}}>Roommate Matches</div><p style={{color:T.muted,fontSize:12,marginTop:2}}>Verified · Income-screened · Sorted by compatibility</p></div>
              <Chip label={`${ROOMMATES.length} profiles`} color={T.blue} bg={T.blueLight}/>
            </div>
            {/* Safety notice */}
            <div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.r,padding:"11px 14px",marginBottom:16,display:"flex",gap:9,alignItems:"flex-start"}}>
              <span style={{fontSize:16,flexShrink:0}}>🛡️</span>
              <div>
                <div style={{color:T.green,fontWeight:700,fontSize:12,marginBottom:2}}>All roommates are screened</div>
                <p style={{color:T.greenMid,fontSize:11,lineHeight:1.55}}>Every profile shows income verification status, ID verification, background check, and landlord review scores. Unlike Facebook groups — no anonymous strangers.</p>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              {[...ROOMMATES].sort((a,b)=>b.match-a.match).map((r,i)=><div key={r.id} className={`au s${Math.min(i+1,5)}`}><RoommateCard r={r} saved={saved} onSave={save} onClick={()=>setDetail({type:"roommate",item:r})} contacted={contacted} onContact={contact}/></div>)}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {tab==="reviews"&&<MyReviewsTab onWriteReview={t=>setWriteReview(t)}/>}

        {/* SAVED */}
        {tab==="saved"&&(
          <div className="ai" style={{paddingTop:18}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20,marginBottom:16}}>Saved</div>
            {saved.length===0?(
              <div style={{textAlign:"center",padding:"52px 18px"}}>
                <div style={{fontSize:44,marginBottom:12}}>🤍</div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:5}}>Nothing saved yet</div>
                <div style={{color:T.muted,fontSize:13,marginBottom:20}}>Tap the heart on any listing or roommate to save it here.</div>
                <Btn ch="Browse Listings →" onClick={()=>setTab("explore")}/>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:16}}>
                {LISTINGS.filter(l=>saved.includes(l.id)).map(l=><ListingCard key={l.id} l={l} saved={saved} onSave={save} onClick={()=>setDetail({type:"listing",item:l})}/>)}
                {ROOMMATES.filter(r=>saved.includes(r.id)).map(r=><RoommateCard key={r.id} r={r} saved={saved} onSave={save} onClick={()=>setDetail({type:"roommate",item:r})} contacted={contacted} onContact={contact}/>)}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {tab==="profile"&&(
          <div className="ai" style={{paddingTop:18}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20,marginBottom:16}}>Your Profile</div>
            <div style={{background:T.white,borderRadius:T.rlg,padding:20,border:`1px solid ${T.border}`,marginBottom:12}}>
              <div style={{display:"flex",gap:13,alignItems:"center",marginBottom:16}}>
                <div style={{width:60,height:60,borderRadius:"50%",background:T.accentLight,border:`3px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{role==="landlord"?"🏢":"🙋"}</div>
                <div>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:19}}>{user.name||"Your Profile"}</div>
                  <div style={{color:T.muted,fontSize:12}}>{role==="landlord"?"Landlord":"Renter"} · NestMatch</div>
                  <div style={{marginTop:6,display:"flex",gap:5,flexWrap:"wrap"}}>
                    {income>0&&<VerifiedBadge label="✅ Income Verified"/>}
                    <Chip label="🇨🇦 Canada" color={T.blue} bg={T.blueLight}/>
                  </div>
                </div>
              </div>
              <Divider m="0 0 12px"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                {[["💰","Income",income>0?`$${income.toLocaleString()}`:"-"],["🏠","Budget",user.budget?`$${parseFloat(user.budget).toLocaleString()}/mo`:"-"],["📅","Schedule",user.schedule||"-"],["✨","Cleanliness",user.clean?`${user.clean}/5`:"-"]].map(([ic,lb,v])=>(
                  <div key={lb} style={{background:T.bg,borderRadius:T.rsm,padding:"10px 11px"}}>
                    <div style={{fontSize:17,marginBottom:3}}>{ic}</div>
                    <div style={{color:T.muted,fontSize:8,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{lb}</div>
                    <div style={{color:T.text,fontWeight:700,fontSize:12,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Tenant score */}
            <div style={{background:T.white,borderRadius:T.rlg,padding:20,border:`1px solid ${T.border}`,marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:11}}>Your Tenant Review Score</div>
              <div style={{display:"flex",gap:13,alignItems:"center"}}>
                <ScoreCircle score={4.9} sz={56}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>Excellent Tenant</div>
                  <div style={{color:T.muted,fontSize:11,marginBottom:8}}>Based on {userReviews.received.length} landlord reviews</div>
                  {[["Payment","5.0"],["Cleanliness","4.8"],["Communication","4.9"]].map(([l,s])=><RatingBar key={l} label={l} score={s} color={T.green}/>)}
                </div>
              </div>
              <Divider m="12px 0"/>
              <Btn ch="View All Reviews →" full onClick={()=>setTab("reviews")}/>
            </div>
            {/* Activity */}
            <div style={{background:T.white,borderRadius:T.rlg,padding:20,border:`1px solid ${T.border}`}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:11}}>Activity</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
                {[["❤️","Saved",saved.length],["💬","Contacts",contacted.length],["⭐","Reviews",userReviews.written.length]].map(([ic,lb,v])=>(
                  <div key={lb} style={{textAlign:"center",background:T.bg,borderRadius:T.rsm,padding:"13px 7px"}}><div style={{fontSize:18}}>{ic}</div><div style={{fontWeight:800,fontSize:19,color:T.accent}}>{v}</div><div style={{color:T.muted,fontSize:10}}>{lb}</div></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(249,247,244,.97)",backdropFilter:"blur(10px)",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:50}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",color:tab===t.id?T.accent:T.muted,transition:"color .18s",minWidth:46,position:"relative",fontFamily:"'DM Sans',sans-serif"}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:tab===t.id?700:500}}>{t.label}</span>
            {tab===t.id&&<div style={{position:"absolute",bottom:-1,width:16,height:3,borderRadius:2,background:T.accent}}/>}
            {t.id==="reviews"&&tab!=="reviews"&&<div style={{position:"absolute",top:0,right:8,width:7,height:7,borderRadius:"50%",background:T.accent}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function App(){
  const[screen,setScreen]=useState("landing");
  const[user,setUser]=useState({});
  const[role,setRole]=useState("renter");
  return(
    <>
      <style>{GS}</style>
      {screen==="landing"&&<Landing onStart={()=>setScreen("onboard")}/>}
      {screen==="onboard"&&<Onboarding onDone={(f,r)=>{setUser(f);setRole(r||"renter");setScreen("dashboard");}}/>}
      {screen==="dashboard"&&<Dashboard user={user} role={role}/>}
    </>
  );
}
