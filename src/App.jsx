// ============================================================
//  NestMatch — Complete App with Real Supabase Authentication
//  Single file — this IS your entire app
// ============================================================
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
)

const T = {
  bg:'#F9F7F4',white:'#FFFFFF',border:'#EAE6E1',
  text:'#18150F',sub:'#635D56',muted:'#A09890',
  accent:'#D64E2A',accentHover:'#B83E1E',accentLight:'#FDF0EC',
  green:'#1E6B3E',greenLight:'#E8F5EE',
  gold:'#B86E0A',goldLight:'#FEF3E2',
  blue:'#1A5296',blueLight:'#E8F0FB',
  red:'#C0392B',redLight:'#FDECEC',
  shadow:'0 2px 16px rgba(0,0,0,0.07)',r:'14px',rsm:'9px',rlg:'20px',
}

const GS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${T.bg};color:${T.text};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
.au{animation:fadeUp .4s ease forwards;}
.s1{animation-delay:.06s;opacity:0;}.s2{animation-delay:.12s;opacity:0;}
`

const AuthCtx = createContext(null)

function AuthProvider({children}){
  const[user,setUser]=useState(null)
  const[profile,setProfile]=useState(null)
  const[loading,setLoading]=useState(true)
  const[busy,setBusy]=useState(false)
  const[error,setError]=useState(null)

  const fetchProfile=useCallback(async(uid)=>{
    if(!uid)return null
    const{data}=await supabase.from('profiles').select('*').eq('id',uid).single()
    return data
  },[])

  useEffect(()=>{
    let live=true
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!live)return
      if(session?.user){setUser(session.user);setProfile(await fetchProfile(session.user.id))}
      setLoading(false)
    })
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{
      if(!live)return
      if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'){setUser(session.user);setProfile(await fetchProfile(session.user.id))}
      if(event==='SIGNED_OUT'){setUser(null);setProfile(null)}
    })
    return()=>{live=false;subscription.unsubscribe()}
  },[fetchProfile])

  const signUp=async({email,password,fullName,role})=>{
    setBusy(true);setError(null)
    try{
      const{data,error:err}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:fullName?.trim(),role:role||'renter'}}})
      if(err)throw err
      if(data.user)await supabase.from('profiles').upsert({id:data.user.id,full_name:fullName?.trim(),role:role||'renter'})
      return{success:true,needsConfirmation:!data.session}
    }catch(e){const m=fe(e.message);setError(m);return{success:false,error:m}}
    finally{setBusy(false)}
  }

  const signIn=async({email,password})=>{
    setBusy(true);setError(null)
    try{
      const{error:err}=await supabase.auth.signInWithPassword({email:email.trim(),password})
      if(err)throw err
      return{success:true}
    }catch(e){const m=fe(e.message);setError(m);return{success:false,error:m}}
    finally{setBusy(false)}
  }

  const signOut=async()=>{setBusy(true);await supabase.auth.signOut();setUser(null);setProfile(null);setBusy(false)}

  const sendReset=async(email)=>{
    setBusy(true);setError(null)
    try{
      const{error:err}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/auth/reset`})
      if(err)throw err
      return{success:true}
    }catch(e){const m=fe(e.message);setError(m);return{success:false,error:m}}
    finally{setBusy(false)}
  }

  const updateProfile=async(updates)=>{
    if(!user)return
    const{data}=await supabase.from('profiles').update({...updates,updated_at:new Date().toISOString()}).eq('id',user.id).select().single()
    if(data)setProfile(data)
    return data
  }

  const completeOnboarding=async(data)=>{
    return await updateProfile({...data,onboarding_complete:true})
  }

  return(
    <AuthCtx.Provider value={{
      user,profile,loading,busy,error,
      isAuth:!!user,
      isLandlord:profile?.role==='landlord',
      incomeVerified:profile?.income_verified==='verified',
      onboardingDone:profile?.onboarding_complete===true,
      signUp,signIn,signOut,sendReset,updateProfile,completeOnboarding,
      clearError:()=>setError(null),
    }}>
      {children}
    </AuthCtx.Provider>
  )
}

const useAuth=()=>useContext(AuthCtx)

function Spin({c='#fff'}){return <span style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${c}33`,borderTopColor:c,animation:'spin .7s linear infinite',display:'inline-block'}}/>}

function PBtn({ch,onClick,loading,type='button',disabled,style={}}){
  return <button type={type} onClick={onClick} disabled={loading||disabled} style={{width:'100%',padding:'13px',borderRadius:T.rsm,background:T.accent,color:'#fff',border:'none',fontWeight:700,fontSize:14,cursor:(loading||disabled)?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .18s',opacity:(loading||disabled)?.65:1,fontFamily:"'DM Sans',sans-serif",...style}} onMouseEnter={e=>{if(!loading&&!disabled)e.currentTarget.style.background=T.accentHover}} onMouseLeave={e=>{e.currentTarget.style.background=T.accent}}>{loading?<Spin/>:ch}</button>
}

function SBtn({ch,onClick,style={}}){
  return <button onClick={onClick} style={{width:'100%',padding:'12px',borderRadius:T.rsm,background:T.white,color:T.text,border:`1.5px solid ${T.border}`,fontWeight:600,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:"'DM Sans',sans-serif",...style}} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background=T.white}>{ch}</button>
}

function Inp({label,type='text',value,onChange,placeholder,error,icon,autoComplete}){
  const[f,setF]=useState(false)
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:'block',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:error?T.red:T.muted,marginBottom:5}}>{label}</label>}
      <div style={{position:'relative'}}>
        {icon&&<span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:15,color:T.muted,pointerEvents:'none'}}>{icon}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{width:'100%',padding:icon?'12px 14px 12px 40px':'12px 14px',borderRadius:T.rsm,fontSize:14,color:T.text,background:T.bg,border:`1.5px solid ${error?T.red:f?T.accent:T.border}`,outline:'none',transition:'border-color .18s',fontFamily:"'DM Sans',sans-serif"}}/>
      </div>
      {error&&<p style={{color:T.red,fontSize:11,marginTop:4}}>⚠️ {error}</p>}
    </div>
  )
}

function PwdInp({label,value,onChange,error,autoComplete,placeholder}){
  const[show,setShow]=useState(false)
  const[f,setF]=useState(false)
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:'block',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:error?T.red:T.muted,marginBottom:5}}>{label}</label>}
      <div style={{position:'relative'}}>
        <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:15,color:T.muted,pointerEvents:'none'}}>🔒</span>
        <input type={show?'text':'password'} value={value} onChange={onChange} placeholder={placeholder||'••••••••'} autoComplete={autoComplete} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{width:'100%',padding:'12px 44px 12px 40px',borderRadius:T.rsm,fontSize:14,color:T.text,background:T.bg,border:`1.5px solid ${error?T.red:f?T.accent:T.border}`,outline:'none',fontFamily:"'DM Sans',sans-serif"}}/>
        <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:15,color:T.muted}}>{show?'🙈':'👁️'}</button>
      </div>
      {error&&<p style={{color:T.red,fontSize:11,marginTop:4}}>⚠️ {error}</p>}
    </div>
  )
}

function ErrBox({msg,onX}){
  if(!msg)return null
  return <div style={{background:T.redLight,border:`1px solid ${T.red}33`,borderRadius:T.rsm,padding:'10px 13px',display:'flex',gap:8,alignItems:'flex-start',marginBottom:14}}><span>⚠️</span><p style={{color:T.red,fontSize:13,flex:1}}>{msg}</p>{onX&&<button onClick={onX} style={{background:'none',border:'none',color:T.muted,cursor:'pointer',fontSize:13}}>✕</button>}</div>
}

function Divider({text}){
  return <div style={{display:'flex',alignItems:'center',gap:12,margin:'16px 0'}}><div style={{flex:1,height:1,background:T.border}}/><span style={{color:T.muted,fontSize:12}}>{text}</span><div style={{flex:1,height:1,background:T.border}}/></div>
}

function Wrap({children}){
  return(
    <div style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px'}}>
      <style>{GS}</style>
      <div style={{width:'100%',maxWidth:420}}>
        <div className="au" style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:54,height:54,borderRadius:14,background:T.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,margin:'0 auto 12px',boxShadow:`0 4px 20px ${T.accent}44`}}>🏠</div>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:T.text}}>NestMatch</span>
        </div>
        <div style={{background:T.white,borderRadius:T.rlg,padding:28,boxShadow:T.shadow}}>{children}</div>
      </div>
    </div>
  )
}

function SignIn({onSwitch}){
  const{signIn,busy,error,clearError}=useAuth()
  const[email,setEmail]=useState('')
  const[pwd,setPwd]=useState('')
  const[errs,setErrs]=useState({})

  async function submit(e){
    e.preventDefault()
    const er={}
    if(!email.trim())er.email='Required'
    else if(!/\S+@\S+\.\S+/.test(email))er.email='Invalid email'
    if(!pwd)er.pwd='Required'
    setErrs(er)
    if(Object.keys(er).length)return
    clearError()
    await signIn({email,password:pwd})
  }

  return(
    <Wrap>
      <div className="au">
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:24,marginBottom:4}}>Welcome back</h2>
        <p style={{color:T.muted,fontSize:13,marginBottom:20}}>Sign in to your NestMatch account</p>
        <ErrBox msg={error} onX={clearError}/>
        <form onSubmit={submit}>
          <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" icon="📧" error={errs.email}/>
          <PwdInp label="Password" value={pwd} onChange={e=>setPwd(e.target.value)} autoComplete="current-password" error={errs.pwd}/>
          <div style={{textAlign:'right',marginBottom:16}}>
            <button type="button" onClick={()=>onSwitch('forgot')} style={{background:'none',border:'none',color:T.accent,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Forgot password?</button>
          </div>
          <PBtn ch="Sign In →" type="submit" loading={busy}/>
        </form>
        <Divider text="or"/>
        <SBtn ch="🔗 Continue with Google" onClick={()=>supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${window.location.origin}/auth/callback`}})}/>
        <p style={{textAlign:'center',fontSize:13,color:T.muted,marginTop:18}}>
          No account?{' '}
          <button onClick={()=>onSwitch('signup')} style={{background:'none',border:'none',color:T.accent,fontWeight:700,cursor:'pointer',fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Sign up free</button>
        </p>
      </div>
    </Wrap>
  )
}

function SignUp({onSwitch}){
  const{signUp,busy,error,clearError}=useAuth()
  const[step,setStep]=useState(1)
  const[role,setRole]=useState('')
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[pwd,setPwd]=useState('')
  const[conf,setConf]=useState('')
  const[errs,setErrs]=useState({})
  const[done,setDone]=useState(false)

  async function submit(e){
    e.preventDefault()
    const er={}
    if(!name.trim())er.name='Required'
    if(!email.trim())er.email='Required'
    else if(!/\S+@\S+\.\S+/.test(email))er.email='Invalid email'
    if(!pwd)er.pwd='Required'
    else if(pwd.length<8)er.pwd='At least 8 characters'
    if(pwd!==conf)er.conf='Passwords do not match'
    setErrs(er)
    if(Object.keys(er).length)return
    clearError()
    const res=await signUp({email,password:pwd,fullName:name,role})
    if(res.success&&res.needsConfirmation)setDone(true)
  }

  if(done)return(
    <Wrap>
      <div className="au" style={{textAlign:'center',padding:'10px 0'}}>
        <div style={{fontSize:52,marginBottom:14}}>📬</div>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:22,marginBottom:8}}>Check your inbox!</h2>
        <p style={{color:T.sub,fontSize:13,lineHeight:1.7,marginBottom:20}}>Confirmation link sent to <strong>{email}</strong></p>
        <button onClick={()=>onSwitch('signin')} style={{background:'none',border:'none',color:T.accent,fontWeight:700,cursor:'pointer',fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>← Back to Sign In</button>
      </div>
    </Wrap>
  )

  return(
    <Wrap>
      {step===1&&(
        <div className="au">
          <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:24,marginBottom:4}}>Create account</h2>
          <p style={{color:T.muted,fontSize:13,marginBottom:20}}>Who are you?</p>
          <div style={{display:'flex',flexDirection:'column',gap:11,marginBottom:20}}>
            {[{r:'renter',i:'🙋',t:"I'm a Renter",d:'Looking for a home or roommate'},{r:'landlord',i:'🏢',t:"I'm a Landlord",d:'I have a property to list'}].map(({r,i,t,d})=>(
              <div key={r} onClick={()=>setRole(r)} style={{cursor:'pointer',border:`2px solid ${role===r?T.accent:T.border}`,borderRadius:T.r,padding:'15px 17px',background:role===r?T.accentLight:T.white,display:'flex',alignItems:'center',gap:13,transition:'all .18s'}}>
                <span style={{fontSize:28}}>{i}</span>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{t}</div><div style={{color:T.muted,fontSize:12}}>{d}</div></div>
                <div style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${role===r?T.accent:T.border}`,background:role===r?T.accent:'transparent',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:9}}>{role===r?'✓':''}</div>
              </div>
            ))}
          </div>
          <PBtn ch="Continue →" onClick={()=>{if(role){clearError();setStep(2)}}} disabled={!role}/>
          <p style={{textAlign:'center',fontSize:13,color:T.muted,marginTop:16}}>
            Have account?{' '}
            <button onClick={()=>onSwitch('signin')} style={{background:'none',border:'none',color:T.accent,fontWeight:700,cursor:'pointer',fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Sign in</button>
          </p>
        </div>
      )}
      {step===2&&(
        <div className="au">
          <button onClick={()=>setStep(1)} style={{background:'none',border:'none',color:T.sub,cursor:'pointer',fontSize:13,fontWeight:600,marginBottom:16,padding:0,fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
          <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:22,marginBottom:4}}>{role==='landlord'?'🏢 Landlord':'🙋 Renter'} Account</h2>
          <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Create your free NestMatch account</p>
          <ErrBox msg={error} onX={clearError}/>
          <form onSubmit={submit}>
            <Inp label="Full Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Smith" autoComplete="name" icon="👤" error={errs.name}/>
            <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" icon="📧" error={errs.email}/>
            <PwdInp label="Password" value={pwd} onChange={e=>setPwd(e.target.value)} autoComplete="new-password" error={errs.pwd}/>
            <PwdInp label="Confirm Password" value={conf} onChange={e=>setConf(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" error={errs.conf}/>
            <p style={{color:T.muted,fontSize:11,lineHeight:1.6,marginBottom:14}}>By signing up you agree to our <span style={{color:T.accent}}>Terms</span> and <span style={{color:T.accent}}>Privacy Policy</span>.</p>
            <PBtn ch="Create Account 🚀" type="submit" loading={busy}/>
          </form>
        </div>
      )}
    </Wrap>
  )
}

function Forgot({onSwitch}){
  const{sendReset,busy,error,clearError}=useAuth()
  const[email,setEmail]=useState('')
  const[sent,setSent]=useState(false)

  async function submit(e){
    e.preventDefault();clearError()
    const res=await sendReset(email.trim())
    if(res.success)setSent(true)
  }

  if(sent)return(
    <Wrap>
      <div className="au" style={{textAlign:'center'}}>
        <div style={{fontSize:52,marginBottom:14}}>📬</div>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:22,marginBottom:8}}>Check your inbox</h2>
        <p style={{color:T.sub,fontSize:13,lineHeight:1.7,marginBottom:20}}>Reset link sent to <strong>{email}</strong></p>
        <button onClick={()=>onSwitch('signin')} style={{background:'none',border:'none',color:T.accent,fontWeight:700,cursor:'pointer',fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>← Back to Sign In</button>
      </div>
    </Wrap>
  )

  return(
    <Wrap>
      <div className="au">
        <button onClick={()=>onSwitch('signin')} style={{background:'none',border:'none',color:T.sub,cursor:'pointer',fontSize:13,fontWeight:600,marginBottom:16,padding:0,fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
        <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:24,marginBottom:4}}>Reset password</h2>
        <p style={{color:T.muted,fontSize:13,marginBottom:20}}>Enter your email for a reset link.</p>
        <ErrBox msg={error} onX={clearError}/>
        <form onSubmit={submit}>
          <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" icon="📧"/>
          <PBtn ch="Send Reset Link" type="submit" loading={busy}/>
        </form>
      </div>
    </Wrap>
  )
}

function Onboarding(){
  const{profile,completeOnboarding,busy}=useAuth()
  const[step,setStep]=useState(0)
  const[form,setForm]=useState({monthly_income:'',max_budget:'',occupation:'',bio:'',schedule:'flexible',cleanliness_level:4,pets_ok:false,smoking_ok:false,looking_for:'2BR'})
  const qMax=form.monthly_income?Math.floor(parseFloat(form.monthly_income)/3):null
  const isL=profile?.role==='landlord'

  async function finish(){await completeOnboarding({monthly_income:parseFloat(form.monthly_income)||null,max_budget:parseFloat(form.max_budget)||null,occupation:form.occupation||null,bio:form.bio||null,schedule:form.schedule,cleanliness_level:form.cleanliness_level,pets_ok:form.pets_ok,smoking_ok:form.smoking_ok,looking_for:form.looking_for})}

  return(
    <div style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px'}}>
      <style>{GS}</style>
      <div style={{width:'100%',maxWidth:430}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,marginBottom:26}}>
          {['Profile','Screening','Preferences'].map((s,i)=>(
            <div key={s} style={{display:'flex',alignItems:'center',gap:5}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:i<step?T.green:i===step?T.accent:T.border,color:i<=step?'#fff':T.muted,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0}}>{i<step?'✓':i+1}</div>
              <span style={{fontSize:11,color:i===step?T.accent:T.muted,fontWeight:i===step?700:400}}>{s}</span>
              {i<2&&<div style={{width:16,height:1.5,background:i<step?T.green:T.border,marginLeft:4}}/>}
            </div>
          ))}
        </div>
        <div style={{background:T.white,borderRadius:T.rlg,padding:24,boxShadow:T.shadow}}>
          {step===0&&(
            <div className="au">
              <div style={{textAlign:'center',marginBottom:18}}>
                <div style={{fontSize:36,marginBottom:8}}>🏠</div>
                <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:22,marginBottom:4}}>Welcome{profile?.full_name?`, ${profile.full_name.split(' ')[0]}`:''}!</h2>
                <p style={{color:T.sub,fontSize:13}}>Let's finish setting up your profile.</p>
              </div>
              <div style={{background:T.accentLight,border:`1px solid ${T.accent}22`,borderRadius:T.r,padding:'12px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:24}}>{isL?'🏢':'🙋'}</span>
                <div><div style={{fontWeight:700,fontSize:13}}>{isL?'Landlord':'Renter'} Account</div><div style={{color:T.sub,fontSize:11}}>{profile?.email}</div></div>
              </div>
              <Inp label="Occupation" value={form.occupation} onChange={e=>setForm({...form,occupation:e.target.value})} placeholder="e.g. Software Engineer" icon="💼"/>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:5}}>Short Bio</label>
                <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={3} placeholder="Tell others about yourself..." style={{width:'100%',padding:'11px 13px',borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:'none',fontSize:13,background:T.bg,resize:'none',fontFamily:"'DM Sans',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
              <PBtn ch="Continue →" onClick={()=>setStep(1)}/>
            </div>
          )}
          {step===1&&(
            <div className="au">
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:21,marginBottom:5}}>Income Screening</h2>
              <p style={{color:T.sub,fontSize:13,marginBottom:12}}>Private — only a verified badge is shown to others.</p>
              <div style={{background:T.bg,borderRadius:T.rsm,padding:'9px 12px',marginBottom:14,display:'flex',gap:7}}><span>🔒</span><p style={{color:T.muted,fontSize:12,lineHeight:1.55}}>We use the 3× rent rule to pre-qualify you automatically.</p></div>
              <Inp label="Monthly Gross Income (CAD)" type="number" value={form.monthly_income} onChange={e=>setForm({...form,monthly_income:e.target.value})} placeholder="e.g. 5000" icon="💰"/>
              <Inp label="Max Monthly Rent Budget" type="number" value={form.max_budget} onChange={e=>setForm({...form,max_budget:e.target.value})} placeholder="e.g. 1200" icon="🏠"/>
              {qMax&&<div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.rsm,padding:'8px 12px',marginBottom:10}}><div style={{color:T.green,fontWeight:700,fontSize:12}}>✅ Qualifies for listings up to ${qMax.toLocaleString()}/mo</div></div>}
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <SBtn ch="← Back" onClick={()=>setStep(0)} style={{flex:'0 0 80px',width:'auto'}}/>
                <PBtn ch="Continue →" style={{flex:1}} onClick={()=>setStep(2)}/>
              </div>
            </div>
          )}
          {step===2&&(
            <div className="au">
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:21,marginBottom:5}}>Preferences</h2>
              <p style={{color:T.sub,fontSize:13,marginBottom:16}}>Helps us find your best matches.</p>
              <div style={{display:'flex',flexDirection:'column',gap:13}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[['looking_for','Looking For',['Studio','1BR','2BR','3BR','Any']],['schedule','Schedule',['early_bird','night_owl','flexible']]].map(([k,lb,opts])=>(
                    <div key={k}>
                      <label style={{display:'block',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:5}}>{lb}</label>
                      <select value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={{width:'100%',padding:'9px 10px',borderRadius:T.rsm,border:`1.5px solid ${T.border}`,outline:'none',fontSize:13,background:T.white,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                        {opts.map(o=><option key={o} value={o}>{o.replace('_',' ')}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:T.muted,marginBottom:6}}>Cleanliness</label>
                  <div style={{display:'flex',gap:7}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setForm({...form,cleanliness_level:n})} style={{flex:1,padding:'8px 0',borderRadius:T.rsm,border:`2px solid ${form.cleanliness_level>=n?T.gold:T.border}`,background:form.cleanliness_level>=n?T.goldLight:T.bg,color:form.cleanliness_level>=n?T.gold:T.muted,cursor:'pointer',fontSize:16,transition:'all .18s',fontFamily:"'DM Sans',sans-serif"}}>★</button>)}</div>
                </div>
                <div style={{display:'flex',gap:9}}>
                  {[['pets_ok','🐾 Pets OK'],['smoking_ok','🚬 Smoking OK']].map(([k,lb])=>(
                    <button key={k} onClick={()=>setForm({...form,[k]:!form[k]})} style={{flex:1,padding:'10px',borderRadius:T.rsm,border:`2px solid ${form[k]?T.accent:T.border}`,background:form[k]?T.accentLight:T.bg,color:form[k]?T.accent:T.sub,cursor:'pointer',fontWeight:600,fontSize:12,transition:'all .18s',fontFamily:"'DM Sans',sans-serif"}}>{lb}</button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:18}}>
                <SBtn ch="← Back" onClick={()=>setStep(1)} style={{flex:'0 0 80px',width:'auto'}}/>
                <PBtn ch={busy?<Spin/>:"Finish Setup 🚀"} style={{flex:1}} disabled={busy} onClick={finish}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Dashboard(){
  const{profile,signOut,busy,isLandlord,incomeVerified}=useAuth()
  return(
    <div style={{minHeight:'100vh',background:T.bg}}>
      <style>{GS}</style>
      <nav style={{background:'rgba(249,247,244,.97)',backdropFilter:'blur(10px)',borderBottom:`1px solid ${T.border}`,padding:'0 16px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <div style={{width:28,height:28,borderRadius:7,background:T.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🏠</div>
          <span style={{fontFamily:"'Instrument Serif',serif",fontSize:17}}>NestMatch</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {incomeVerified&&<span style={{background:T.greenLight,color:T.green,fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:99}}>✅ Verified</span>}
          <button onClick={signOut} disabled={busy} style={{padding:'7px 14px',borderRadius:T.rsm,background:'transparent',border:`1.5px solid ${T.border}`,color:T.sub,cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{busy?'..':'Sign Out'}</button>
        </div>
      </nav>
      <div style={{maxWidth:600,margin:'32px auto',padding:'0 16px'}}>
        <div className="au" style={{background:T.white,borderRadius:T.rlg,padding:24,boxShadow:T.shadow,marginBottom:14}}>
          <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:16}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:T.accentLight,border:`3px solid ${T.accent}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>{isLandlord?'🏢':'🙋'}</div>
            <div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20}}>Welcome, {profile?.full_name?.split(' ')[0]||'there'}! 👋</div>
              <div style={{color:T.muted,fontSize:12,marginTop:2}}>{profile?.role||'Renter'} · {profile?.email}</div>
              <div style={{marginTop:6,display:'flex',gap:5,flexWrap:'wrap'}}>
                <span style={{background:T.greenLight,color:T.green,fontSize:11,fontWeight:700,padding:'3px 9px',borderRadius:99}}>✅ Signed In</span>
                <span style={{background:T.blueLight,color:T.blue,fontSize:11,fontWeight:700,padding:'3px 9px',borderRadius:99}}>🇨🇦 NestMatch</span>
              </div>
            </div>
          </div>
          <div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:T.rsm,padding:'12px 14px',marginBottom:14}}>
            <div style={{color:T.green,fontWeight:700,fontSize:13,marginBottom:3}}>✅ Authentication Working!</div>
            <p style={{color:'#2D8F52',fontSize:12,lineHeight:1.55}}>Real account · Session saved · Profile in Supabase · Ready for next steps!</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:14}}>
            {[['👤','Name',profile?.full_name||'—'],['📧','Email',profile?.email||'—'],['💼','Role',profile?.role||'—'],['🏠','Looking',profile?.looking_for||'—'],['💰','Budget',profile?.max_budget?`$${Number(profile.max_budget).toLocaleString()}/mo`:'—'],['✨','Cleanli.',profile?.cleanliness_level?`${profile.cleanliness_level}/5`:'—']].map(([ic,lb,v])=>(
              <div key={lb} style={{background:T.bg,borderRadius:T.rsm,padding:'10px 11px'}}>
                <div style={{fontSize:16,marginBottom:2}}>{ic}</div>
                <div style={{color:T.muted,fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:.5}}>{lb}</div>
                <div style={{color:T.text,fontWeight:700,fontSize:12,marginTop:2,wordBreak:'break-all'}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:T.accentLight,border:`1px solid ${T.accent}22`,borderRadius:T.rsm,padding:'12px 14px',textAlign:'center'}}>
            <div style={{color:T.accent,fontWeight:700,fontSize:13,marginBottom:3}}>🚀 Next Step</div>
            <div style={{color:T.sub,fontSize:12,lineHeight:1.6,fontStyle:'italic'}}>"Build the landlord dashboard so they can post real listings"</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthRouter(){
  const[screen,setScreen]=useState('signin')
  if(screen==='signin')return <SignIn onSwitch={setScreen}/>
  if(screen==='signup')return <SignUp onSwitch={setScreen}/>
  if(screen==='forgot')return <Forgot onSwitch={setScreen}/>
  return <SignIn onSwitch={setScreen}/>
}

function AppShell(){
  const{isAuth,loading,onboardingDone}=useAuth()
  if(loading)return(
    <div style={{minHeight:'100vh',background:T.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <style>{GS}</style>
      <div style={{width:32,height:32,borderRadius:'50%',border:`3px solid ${T.accent}22`,borderTopColor:T.accent,animation:'spin .8s linear infinite'}}/>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:T.muted}}>Loading NestMatch...</div>
    </div>
  )
  if(!isAuth)return <AuthRouter/>
  if(!onboardingDone)return <Onboarding/>
  return <Dashboard/>
}

export default function App(){
  return <AuthProvider><AppShell/></AuthProvider>
}

function fe(msg=''){
  const m={'Invalid login credentials':'Incorrect email or password.','Email not confirmed':'Please confirm your email first.','User already registered':'An account with this email already exists.','Password should be at least 6':'Password must be at least 8 characters.'}
  for(const[k,v]of Object.entries(m))if(msg.includes(k))return v
  return msg||'Something went wrong.'
}
