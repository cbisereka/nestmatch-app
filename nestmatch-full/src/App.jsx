// ============================================================
//  src/App.jsx
//  Root — auth state drives which screen shows
// ============================================================
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthRouter } from './components/Auth/AuthScreens'
import { LoadingScreen } from './components/Auth/ProtectedRoute'

/* ─── Design tokens (shared) ────────────────────────────── */
const T = {
  bg:'#F9F7F4', white:'#FFFFFF', card:'#FFFFFF',
  border:'#EAE6E1', borderDark:'#D4CEC7',
  text:'#18150F', sub:'#635D56', muted:'#A09890',
  accent:'#D64E2A', accentHover:'#B83E1E', accentLight:'#FDF0EC',
  green:'#1E6B3E', greenLight:'#E8F5EE', greenMid:'#2D8F52',
  gold:'#B86E0A', goldLight:'#FEF3E2',
  blue:'#1A5296', blueLight:'#E8F0FB',
  red:'#C0392B', redLight:'#FDECEC',
  shadow:'0 1px 12px rgba(0,0,0,0.06)',
  shadowMd:'0 4px 24px rgba(0,0,0,0.09)',
  shadowLg:'0 8px 40px rgba(0,0,0,0.13)',
  r:'14px', rsm:'9px', rlg:'20px',
}

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
.au{animation:up .45s ease forwards;} .ai{animation:in .3s ease forwards;}
.su{animation:slideUp .4s cubic-bezier(.16,1,.3,1) forwards;}
.pop{animation:pop .25s ease forwards;}
.s1{animation-delay:.06s;opacity:0;}.s2{animation-delay:.12s;opacity:0;}
.s3{animation-delay:.18s;opacity:0;}.s4{animation-delay:.24s;opacity:0;}.s5{animation-delay:.3s;opacity:0;}
.lift{transition:transform .2s,box-shadow .2s;cursor:pointer;}
.lift:hover{transform:translateY(-3px);box-shadow:${T.shadowLg};}
`

/* ─── Atoms ──────────────────────────────────────────────── */
function Btn({ch,variant='primary',size='md',onClick,style={},disabled=false,full=false}){
  const sz={sm:{p:'7px 15px',fs:12},md:{p:'11px 22px',fs:14},lg:{p:'14px 28px',fs:15}}
  const vr={
    primary:{background:T.accent,color:'#fff',border:'none',boxShadow:`0 2px 10px ${T.accent}44`},
    secondary:{background:T.white,color:T.text,border:`1.5px solid ${T.border}`},
    ghost:{background:'transparent',color:T.sub,border:`1.5px solid ${T.border}`},
    success:{background:T.greenLight,color:T.green,border:`1.5px solid ${T.green}33`},
    danger:{background:T.redLight,color:T.red,border:`1.5px solid ${T.red}33`},
    dark:{background:T.text,color:'#fff',border:'none'},
  }
  return <button disabled={disabled} onClick={onClick} style={{borderRadius:T.rsm,fontWeight:600,cursor:disabled?'not-allowed':'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all .18s',opacity:disabled?.5:1,width:full?'100%':'auto',padding:sz[size].p,fontSize:sz[size].fs,...vr[variant],...style}} onMouseEnter={e=>{if(!disabled&&variant==='primary')e.currentTarget.style.background=T.accentHover}} onMouseLeave={e=>{if(variant==='primary')e.currentTarget.style.background=T.accent}}>{ch}</button>
}
function Chip({label,color=T.accent,bg=T.accentLight}){return <span style={{display:'inline-flex',alignItems:'center',gap:3,padding:'4px 10px',borderRadius:99,fontSize:11,fontWeight:700,color,background:bg,letterSpacing:.2,whiteSpace:'nowrap'}}>{label}</span>}
function Divider({m='14px 0'}){return <div style={{height:1,background:T.border,margin:m}}/>}
function Toast({msg,onDone}){useEffect(()=>{const t=setTimeout(onDone,2800);return()=>clearTimeout(t)},[]);return <div className="au" style={{position:'fixed',bottom:88,left:'50%',transform:'translateX(-50%)',background:T.text,color:'#fff',borderRadius:99,padding:'11px 20px',fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:'nowrap',boxShadow:T.shadowLg,display:'flex',alignItems:'center',gap:8,maxWidth:'90vw'}}><span style={{color:T.green}}>✅</span>{msg}</div>}

/* ─── Onboarding (saves to Supabase) ─────────────────────── */
function Onboarding({ onDone }) {
  const { completeOnboarding, profile, authLoading } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    monthly_income:'', max_budget:'', occupation:'', bio:'',
    schedule:'flexible', cleanliness_level:4,
    pets_ok:false, smoking_ok:false, looking_for:'2BR',
  })
  const [saving, setSaving] = useState(false)
  const qMax = form.monthly_income ? Math.floor(parseFloat(form.monthly_income)/3) : null

  async function finish() {
    setSaving(true)
    const result = await completeOnboarding({
      monthly_income: parseFloat(form.monthly_income)||null,
      max_budget:     parseFloat(form.max_budget)||null,
      occupation:     form.occupation||null,
      bio:            form.bio||null,
      schedule:       form.schedule,
      cleanliness_level: form.cleanliness_level,
      pets_ok:        form.pets_ok,
      smoking_ok:     form.smoking_ok,
      looking_for:    form.looking_for,
    })
    setSaving(false)
    if (result.success) onDone(result.profile)
  }

  const steps = ['Role','Screening','Preferences']
  const isLandlord = profile?.role === 'landlord'

  return (
    <div style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px'}}>
      <style>{GS}</style>
      <div style={{width:'100%',maxWidth:430}}>
        {/* Progress */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,marginBottom:26}}>
          {steps.map((s,i)=>(
            <div key={s} style={{display:'flex',alignItems:'center',gap:5}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:i<step?T.green:i===step?T.accent:T.border,color:i<=step?'#fff':T.muted,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,transition:'all .3s',flexShrink:0}}>{i<step?'✓':i+1}</div>
              <span style={{fontSize:11,color:i===step?T.accent:T.muted,fontWeight:i===step?700:400}}>{s}</span>
              {i<2&&<div style={{width:16,height:1.5,background:i<step?T.green:T.border,marginLeft:4}}/>}
            </div>
          ))}
        </div>

        <div style={{background:T.white,borderRadius:T.rlg,padding:24,boxShadow:T.shadow}}>
          {step===0&&(
            <div className="au">
              <div style={{textAlign:'center',marginBottom:20}}>
                <div style={{fontSize:36,marginBottom:9}}>🏠</div>
                <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:23,marginBottom:5}}>
                  Welcome{profile?.full_name?`, ${profile.full_name.split(' ')[0]}`:''}!
                </h2>
                <p style={{color:T.sub,fontSize:13,lineHeight:1.6}}>
                  {isLandlord?"Let's set up your landlord profile.":"Let's set up your renter profile to find the best matches."}
                </p>
              </div>
              {/* Show current role */}
              <div style={{background:T.accentLight,border:`1px solid ${T.accent}33`,borderRadius:T.r,padding:'14px 16px',marginBottom:18,display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:28}}>{isLandlord?'🏢':'🙋'}</span>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{isLandlord?'Landlord Account':'Renter Account'}</div>
                  <div style={{color:T.sub,fontSize:12}}>{profile?.email}</div>
                </div>
                <Chip label="✓ Signed In" color={T.green} bg={T.greenLight} />
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:18}}>
                <div>
                  <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:5}}>Occupation</label>
                  <input value={form.occupation} onChange={e=>setForm({...form,occupation:e.target.value})} placeholder="e.g. Software Engineer" style={{width:'100%',padding:'11px 13px',borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:'none',fontSize:13,background:T.bg}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:5}}>Short Bio</label>
                  <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={3} placeholder="Tell others a bit about yourself..." style={{width:'100%',padding:'11px 13px',borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:'none',fontSize:13,background:T.bg,resize:'none'}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
              </div>
              <Btn ch="Continue →" full onClick={()=>setStep(1)}/>
            </div>
          )}

          {step===1&&(
            <div className="au">
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:21,marginBottom:5}}>Income Screening</h2>
              <p style={{color:T.sub,fontSize:13,marginBottom:14}}>Private & secure — only a verified badge is shown to others.</p>
              <div style={{background:T.bg,borderRadius:T.rsm,padding:'9px 12px',marginBottom:14,display:'flex',gap:7}}>
                <span>🔒</span>
                <p style={{color:T.muted,fontSize:12,lineHeight:1.55}}>We use the 3× rent rule to pre-qualify you automatically. Your exact income is never shared with anyone.</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {[['monthly_income','Monthly Gross Income (CAD)','e.g. 5,000'],['max_budget','Max Monthly Rent Budget','e.g. 1,200']].map(([k,lb,ph])=>(
                  <div key={k}>
                    <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:5}}>{lb}</label>
                    <input type="number" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph} style={{width:'100%',padding:'11px 13px',borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:'none',fontSize:13,background:T.bg}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                  </div>
                ))}
              </div>
              {qMax&&<div className="ai" style={{marginTop:10,background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.rsm,padding:'8px 12px'}}><div style={{color:T.green,fontWeight:700,fontSize:12}}>✅ You qualify for listings up to ${qMax.toLocaleString()}/mo</div></div>}
              <div style={{display:'flex',gap:8,marginTop:16}}>
                <Btn ch="← Back" variant="ghost" style={{width:76}} onClick={()=>setStep(0)}/>
                <Btn ch="Continue →" style={{flex:1}} onClick={()=>setStep(2)}/>
              </div>
            </div>
          )}

          {step===2&&(
            <div className="au">
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:21,marginBottom:5}}>Your Preferences</h2>
              <p style={{color:T.sub,fontSize:13,marginBottom:18}}>Helps us find your most compatible matches.</p>
              <div style={{display:'flex',flexDirection:'column',gap:13}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[['looking_for','Looking For',['Studio','1BR','2BR','3BR','Any']],['schedule','Schedule',['early_bird','night_owl','flexible']]].map(([k,lb,opts])=>(
                    <div key={k}>
                      <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:5}}>{lb}</label>
                      <select value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={{width:'100%',padding:'9px 10px',borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:'none',fontSize:13,background:T.white,cursor:'pointer'}}>
                        {opts.map(o=><option key={o} value={o}>{o.replace('_',' ')}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{display:'block',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:6}}>Cleanliness Level</label>
                  <div style={{display:'flex',gap:7}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setForm({...form,cleanliness_level:n})} style={{flex:1,padding:'8px 0',borderRadius:T.rsm,border:`2px solid ${form.cleanliness_level>=n?T.gold:T.border}`,background:form.cleanliness_level>=n?T.goldLight:T.bg,color:form.cleanliness_level>=n?T.gold:T.muted,cursor:'pointer',fontSize:16,transition:'all .18s'}}>★</button>)}</div>
                </div>
                <div style={{display:'flex',gap:9}}>
                  {[['pets_ok','🐾 Pets OK'],['smoking_ok','🚬 Smoking OK']].map(([k,lb])=>(
                    <button key={k} onClick={()=>setForm({...form,[k]:!form[k]})} style={{flex:1,padding:'10px',borderRadius:T.rsm,border:`2px solid ${form[k]?T.accent:T.border}`,background:form[k]?T.accentLight:T.bg,color:form[k]?T.accent:T.sub,cursor:'pointer',fontWeight:600,fontSize:12,transition:'all .18s'}}>
                      {lb}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:20}}>
                <Btn ch="← Back" variant="ghost" style={{width:76}} onClick={()=>setStep(1)}/>
                <Btn ch={saving?'Saving...':'Finish Setup 🚀'} style={{flex:1}} disabled={saving} onClick={finish}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Profile Header (shown in dashboard) ─────────────────── */
function ProfileHeader({ onSignOut }) {
  const { profile, isLandlord, incomeVerified, authLoading } = useAuth()
  return (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      {incomeVerified && <Chip label="✅ Verified" color={T.green} bg={T.greenLight}/>}
      <div style={{width:34,height:34,borderRadius:'50%',background:T.accentLight,border:`2px solid ${T.accent}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,cursor:'pointer',position:'relative'}}>
        {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}}/> : (isLandlord?'🏢':'🙋')}
      </div>
    </div>
  )
}

/* ─── Main App Shell (authenticated) ──────────────────────── */
function AppShell() {
  const { isAuthenticated, loading, onboardingComplete, profile, signOut, authLoading } = useAuth()
  const [toast, setToast] = useState(null)
  const [tab,   setTab]   = useState('explore')
  const [saved, setSaved] = useState([])

  // If loading session
  if (loading) return <LoadingScreen />

  // If not logged in → show auth screens
  if (!isAuthenticated) return <AuthRouter defaultScreen="signin" />

  // If logged in but onboarding not done → show onboarding
  if (!onboardingComplete) return <Onboarding onDone={()=>setToast('Profile complete! Welcome to NestMatch 🎉')} />

  // ── Logged in + onboarding done → show full dashboard ──
  // We import the full NestMatch dashboard here
  // For now render a clean logged-in state
  return (
    <div style={{minHeight:'100vh',background:T.bg}}>
      <style>{GS}</style>
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}

      {/* Nav */}
      <nav style={{background:'rgba(249,247,244,.97)',backdropFilter:'blur(10px)',borderBottom:`1px solid ${T.border}`,padding:'0 16px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <div style={{width:28,height:28,borderRadius:7,background:T.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🏠</div>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:17}}>NestMatch</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <ProfileHeader onSignOut={signOut}/>
          <Btn ch={authLoading?'..':'Sign Out'} variant="ghost" size="sm" onClick={signOut}/>
        </div>
      </nav>

      {/* Welcome card */}
      <div style={{maxWidth:600,margin:'40px auto',padding:'0 16px'}}>
        <div className="au" style={{background:T.white,borderRadius:T.rlg,padding:28,boxShadow:T.shadow,marginBottom:16}}>
          <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:18}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:T.accentLight,border:`3px solid ${T.accent}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>
              {profile?.role==='landlord'?'🏢':'🙋'}
            </div>
            <div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20}}>
                Welcome back, {profile?.full_name?.split(' ')[0]||'there'}! 👋
              </div>
              <div style={{color:T.muted,fontSize:12,marginTop:2}}>
                {profile?.role==='landlord'?'Landlord':'Renter'} · {profile?.email}
              </div>
              <div style={{marginTop:6,display:'flex',gap:5,flexWrap:'wrap'}}>
                <Chip label="✅ Authenticated" color={T.green} bg={T.greenLight}/>
                {profile?.income_verified==='verified'&&<Chip label="💰 Income Verified" color={T.blue} bg={T.blueLight}/>}
                <Chip label="🇨🇦 NestMatch" color={T.accent} bg={T.accentLight}/>
              </div>
            </div>
          </div>

          <div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.rsm,padding:'12px 14px',marginBottom:16}}>
            <div style={{color:T.green,fontWeight:700,fontSize:13,marginBottom:3}}>✅ Supabase Auth is Working!</div>
            <p style={{color:T.greenMid,fontSize:12,lineHeight:1.55}}>Real account created · Session persists across refreshes · Profile saved to database</p>
          </div>

          {/* Profile details */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:16}}>
            {[
              ['👤','Name',    profile?.full_name||'—'],
              ['📧','Email',   profile?.email||'—'],
              ['💼','Role',    profile?.role||'—'],
              ['📐','Looking', profile?.looking_for||'—'],
              ['💰','Budget',  profile?.max_budget?`$${Number(profile.max_budget).toLocaleString()}/mo`:'—'],
              ['✨','Cleanli.', profile?.cleanliness_level?`${profile.cleanliness_level}/5`:'—'],
            ].map(([ic,lb,v])=>(
              <div key={lb} style={{background:T.bg,borderRadius:T.rsm,padding:'10px 12px'}}>
                <div style={{fontSize:16,marginBottom:3}}>{ic}</div>
                <div style={{color:T.muted,fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:.5}}>{lb}</div>
                <div style={{color:T.text,fontWeight:700,fontSize:12,marginTop:2,wordBreak:'break-all'}}>{v}</div>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Next steps */}
          <div style={{fontWeight:700,fontSize:13,marginBottom:11}}>🚀 Next Steps to Full App</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              ['✅','Supabase project created',true],
              ['✅','Database schema deployed',true],
              ['✅','Authentication working',true],
              ['✅','User profiles saving to DB',true],
              ['✅','Deployed to nestmatchcanada.ca',true],
              ['⬜','Real listings from landlords',false],
              ['⬜','Real-time messaging',false],
              ['⬜','Stripe payments',false],
              ['⬜','Email notifications',false],
              ['⬜','App Store submission',false],
            ].map(([icon,label,done])=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 11px',background:done?T.greenLight:T.bg,border:`1px solid ${done?T.green+'33':T.border}`,borderRadius:T.rsm}}>
                <span style={{fontSize:14}}>{icon}</span>
                <span style={{fontSize:12,fontWeight:done?600:400,color:done?T.green:T.sub}}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{marginTop:18,background:T.accentLight,border:`1px solid ${T.accent}22`,borderRadius:T.rsm,padding:'12px 14px',textAlign:'center'}}>
            <div style={{color:T.accent,fontWeight:700,fontSize:13,marginBottom:3}}>Tell Claude next:</div>
            <div style={{color:T.sub,fontSize:12,lineHeight:1.6,fontStyle:'italic'}}>"Build the landlord dashboard so they can post real listings to the database"</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Root ───────────────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
