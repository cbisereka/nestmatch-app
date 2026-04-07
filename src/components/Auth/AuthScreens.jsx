// ============================================================
//  src/components/Auth/AuthScreens.jsx
//  All auth screens with NestMatch branding
// ============================================================
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const T = {
  bg:'#F9F7F4', white:'#FFFFFF', border:'#EAE6E1',
  text:'#18150F', sub:'#635D56', muted:'#A09890',
  accent:'#D64E2A', accentHover:'#B83E1E', accentLight:'#FDF0EC',
  green:'#1E6B3E', greenLight:'#E8F5EE',
  blue:'#1A5296', blueLight:'#E8F0FB',
  red:'#C0392B', redLight:'#FDECEC',
  gold:'#B86E0A', goldLight:'#FEF3E2',
  shadow:'0 2px 16px rgba(0,0,0,0.07)',
  shadowLg:'0 8px 40px rgba(0,0,0,0.13)',
  r:'14px', rsm:'9px', rlg:'20px',
}

const GS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${T.bg};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
.au{animation:fadeUp .4s ease forwards;}
.ai{animation:fadeIn .25s ease forwards;}
.s1{animation-delay:.06s;opacity:0;}.s2{animation-delay:.12s;opacity:0;}
.s3{animation-delay:.18s;opacity:0;}
`

// ── Primitives ─────────────────────────────────────────────
function Spinner({ color = '#fff' }) {
  return <span style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${color}33`, borderTopColor:color, animation:'spin .7s linear infinite', display:'inline-block' }} />
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:error?T.red:T.muted, marginBottom:5 }}>{label}</label>}
      {children}
      {error && <p style={{ color:T.red, fontSize:11, marginTop:4 }}>⚠️ {error}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type='text', autoComplete, icon, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position:'relative' }}>
      {icon && <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:15, color:T.muted, pointerEvents:'none' }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{ width:'100%', padding: icon?'12px 14px 12px 40px':'12px 14px', borderRadius:T.rsm, fontSize:14, color:T.text, background:T.bg, border:`1.5px solid ${error?T.red:focused?T.accent:T.border}`, outline:'none', transition:'border-color .18s', fontFamily:"'DM Sans',sans-serif" }} />
    </div>
  )
}

function PasswordField({ label, value, onChange, error, autoComplete, placeholder }) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)
  return (
    <Field label={label} error={error}>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:15, color:T.muted, pointerEvents:'none' }}>🔒</span>
        <input type={show?'text':'password'} value={value} onChange={onChange}
          placeholder={placeholder||'••••••••'} autoComplete={autoComplete}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{ width:'100%', padding:'12px 44px 12px 40px', borderRadius:T.rsm, fontSize:14, color:T.text, background:T.bg, border:`1.5px solid ${error?T.red:focused?T.accent:T.border}`, outline:'none', fontFamily:"'DM Sans',sans-serif" }} />
        <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:15, color:T.muted }}>{show?'🙈':'👁️'}</button>
      </div>
    </Field>
  )
}

function PrimaryBtn({ children, onClick, loading, type='button', disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={loading||disabled}
      style={{ width:'100%', padding:'13px', borderRadius:T.rsm, background:T.accent, color:'#fff', border:'none', fontWeight:700, fontSize:14, cursor:(loading||disabled)?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .18s', opacity:(loading||disabled)?.65:1, fontFamily:"'DM Sans',sans-serif", boxShadow:`0 2px 10px ${T.accent}44` }}
      onMouseEnter={e=>{ if(!loading&&!disabled) e.currentTarget.style.background=T.accentHover }}
      onMouseLeave={e=>{ e.currentTarget.style.background=T.accent }}>
      {loading ? <Spinner /> : children}
    </button>
  )
}

function GoogleBtn({ onClick, loading }) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      style={{ width:'100%', padding:'12px', borderRadius:T.rsm, background:T.white, color:T.text, border:`1.5px solid ${T.border}`, fontWeight:600, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all .18s', fontFamily:"'DM Sans',sans-serif" }}
      onMouseEnter={e=>e.currentTarget.style.background=T.bg}
      onMouseLeave={e=>e.currentTarget.style.background=T.white}>
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  )
}

function Divider({ text }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'16px 0' }}>
      <div style={{ flex:1, height:1, background:T.border }} />
      <span style={{ color:T.muted, fontSize:12 }}>{text}</span>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  )
}

function ErrorBox({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="ai" style={{ background:T.redLight, border:`1px solid ${T.red}33`, borderRadius:T.rsm, padding:'11px 14px', display:'flex', gap:8, alignItems:'flex-start', marginBottom:16 }}>
      <span style={{ flexShrink:0 }}>⚠️</span>
      <p style={{ color:T.red, fontSize:13, flex:1, lineHeight:1.5 }}>{message}</p>
      {onDismiss && <button onClick={onDismiss} style={{ background:'none', border:'none', color:T.muted, cursor:'pointer', fontSize:14 }}>✕</button>}
    </div>
  )
}

function SuccessBox({ message }) {
  if (!message) return null
  return (
    <div className="ai" style={{ background:T.greenLight, border:`1px solid ${T.green}33`, borderRadius:T.rsm, padding:'11px 14px', display:'flex', gap:8, marginBottom:16 }}>
      <span>✅</span>
      <p style={{ color:T.green, fontSize:13, lineHeight:1.5 }}>{message}</p>
    </div>
  )
}

function AuthWrap({ children }) {
  return (
    <div style={{ minHeight:'100vh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px' }}>
      <style>{GS}</style>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div className="au" style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:54, height:54, borderRadius:14, background:T.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 12px', boxShadow:`0 4px 20px ${T.accent}44` }}>🏠</div>
          <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, color:T.text }}>NestMatch</span>
        </div>
        <div style={{ background:T.white, borderRadius:T.rlg, padding:28, boxShadow:`0 2px 16px rgba(0,0,0,0.07)` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label:'8+ characters',    pass:password.length>=8 },
    { label:'Uppercase',        pass:/[A-Z]/.test(password) },
    { label:'Number',           pass:/[0-9]/.test(password) },
    { label:'Special char',     pass:/[^A-Za-z0-9]/.test(password) },
  ]
  const passed = checks.filter(c=>c.pass).length
  const color  = passed<=1?T.red:passed===2?T.gold:passed===3?T.blue:T.green
  const label  = ['','Weak','Fair','Good','Strong'][passed]
  return (
    <div style={{ background:T.bg, borderRadius:T.rsm, padding:'10px 12px', marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:11, color:T.muted }}>Password strength</span>
        <span style={{ fontSize:11, fontWeight:700, color }}>{label}</span>
      </div>
      <div style={{ display:'flex', gap:4, marginBottom:7 }}>
        {[1,2,3,4].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=passed?color:T.border, transition:'background .2s' }}/>)}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {checks.map(c=><span key={c.label} style={{ fontSize:10, fontWeight:600, color:c.pass?T.green:T.muted }}>{c.pass?'✓':'○'} {c.label}</span>)}
      </div>
    </div>
  )
}

// ── SIGN IN ────────────────────────────────────────────────
export function SignIn({ onSwitch }) {
  const { signIn, signInWithGoogle, authLoading, authError, clearError } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [errors,   setErrors]   = useState({})

  function validate() {
    const e = {}
    if (!email.trim())               e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password)                   e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    clearError()
    await signIn({ email, password })
  }

  return (
    <AuthWrap>
      <div className="au">
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, marginBottom:4 }}>Welcome back</h2>
        <p style={{ color:T.muted, fontSize:13, marginBottom:20 }}>Sign in to your NestMatch account</p>
        <ErrorBox message={authError} onDismiss={clearError} />
        <form onSubmit={handleSubmit}>
          <Field label="Email" error={errors.email}>
            <TextInput type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" icon="📧" error={errors.email} />
          </Field>
          <PasswordField label="Password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" error={errors.password} />
          <div style={{ textAlign:'right', marginBottom:16 }}>
            <button type="button" onClick={()=>onSwitch('forgot')} style={{ background:'none', border:'none', color:T.accent, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Forgot password?</button>
          </div>
          <PrimaryBtn type="submit" loading={authLoading}>Sign In →</PrimaryBtn>
        </form>
        <Divider text="or" />
        <GoogleBtn onClick={signInWithGoogle} loading={authLoading} />
        <p style={{ textAlign:'center', fontSize:13, color:T.muted, marginTop:18 }}>
          Don't have an account?{' '}
          <button onClick={()=>onSwitch('signup')} style={{ background:'none', border:'none', color:T.accent, fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Sign up free</button>
        </p>
      </div>
    </AuthWrap>
  )
}

// ── SIGN UP ────────────────────────────────────────────────
export function SignUp({ onSwitch }) {
  const { signUp, signInWithGoogle, authLoading, authError, clearError } = useAuth()
  const [step,     setStep]     = useState(1)
  const [role,     setRole]     = useState('')
  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [errors,   setErrors]   = useState({})
  const [success,  setSuccess]  = useState('')

  function validateStep2() {
    const e = {}
    if (!fullName.trim())               e.fullName = 'Name is required'
    if (!email.trim())                  e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password)                      e.password = 'Password is required'
    else if (password.length < 8)       e.password = 'At least 8 characters'
    if (password !== confirm)           e.confirm  = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validateStep2()) return
    clearError()
    const result = await signUp({ email, password, fullName, role })
    if (result.success && result.needsConfirmation) {
      setSuccess(`Check your inbox! We sent a confirmation link to ${email}`)
    }
  }

  if (success) return (
    <AuthWrap>
      <div className="au" style={{ textAlign:'center', padding:'10px 0' }}>
        <div style={{ fontSize:52, marginBottom:14 }}>📬</div>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, marginBottom:8 }}>Check your inbox!</h2>
        <p style={{ color:T.sub, fontSize:13, lineHeight:1.7, marginBottom:20 }}>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
        <div style={{ background:T.blueLight, border:`1px solid ${T.blue}22`, borderRadius:T.rsm, padding:'10px 13px', marginBottom:22 }}>
          <p style={{ color:T.blue, fontSize:12, lineHeight:1.6 }}>💡 Check your spam folder if you don't see it. Link expires in 24 hours.</p>
        </div>
        <button onClick={()=>onSwitch('signin')} style={{ background:'none', border:'none', color:T.accent, fontWeight:700, cursor:'pointer', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>← Back to Sign In</button>
      </div>
    </AuthWrap>
  )

  return (
    <AuthWrap>
      {step === 1 && (
        <div className="au">
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, marginBottom:4 }}>Create your account</h2>
          <p style={{ color:T.muted, fontSize:13, marginBottom:20 }}>First — who are you?</p>
          <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:20 }}>
            {[{r:'renter',icon:'🙋',t:"I'm a Renter",d:'Looking for a home and/or roommate'},{r:'landlord',icon:'🏢',t:"I'm a Landlord",d:'I have a property to list'}].map(({r,icon,t,d})=>(
              <div key={r} onClick={()=>setRole(r)} style={{ cursor:'pointer', border:`2px solid ${role===r?T.accent:T.border}`, borderRadius:T.r, padding:'15px 17px', background:role===r?T.accentLight:T.white, display:'flex', alignItems:'center', gap:13, transition:'all .18s' }}>
                <span style={{ fontSize:28 }}>{icon}</span>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>{t}</div><div style={{ color:T.muted, fontSize:12 }}>{d}</div></div>
                <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${role===r?T.accent:T.border}`, background:role===r?T.accent:'transparent', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:9, flexShrink:0 }}>{role===r?'✓':''}</div>
              </div>
            ))}
          </div>
          <PrimaryBtn onClick={()=>{ if(role) { clearError(); setStep(2) } }} disabled={!role}>Continue →</PrimaryBtn>
          <Divider text="or" />
          <GoogleBtn onClick={signInWithGoogle} loading={authLoading} />
          <p style={{ textAlign:'center', fontSize:13, color:T.muted, marginTop:16 }}>
            Already have an account?{' '}
            <button onClick={()=>onSwitch('signin')} style={{ background:'none', border:'none', color:T.accent, fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Sign in</button>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="au">
          <button onClick={()=>setStep(1)} style={{ background:'none', border:'none', color:T.sub, cursor:'pointer', fontSize:13, fontWeight:600, marginBottom:16, padding:0, display:'flex', alignItems:'center', gap:4, fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
          <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, marginBottom:4 }}>{role==='landlord'?'🏢 Landlord Account':'🙋 Renter Account'}</h2>
          <p style={{ color:T.muted, fontSize:13, marginBottom:16 }}>Create your free NestMatch account</p>
          <ErrorBox message={authError} onDismiss={clearError} />
          <PasswordStrength password={password} />
          <form onSubmit={handleSubmit}>
            <Field label="Full Name" error={errors.fullName}>
              <TextInput value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Jane Smith" autoComplete="name" icon="👤" error={errors.fullName} />
            </Field>
            <Field label="Email" error={errors.email}>
              <TextInput type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" icon="📧" error={errors.email} />
            </Field>
            <PasswordField label="Password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" error={errors.password} />
            <PasswordField label="Confirm Password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" error={errors.confirm} />
            <p style={{ color:T.muted, fontSize:11, lineHeight:1.6, marginBottom:14 }}>
              By creating an account you agree to our <span style={{ color:T.accent, cursor:'pointer' }}>Terms of Service</span> and <span style={{ color:T.accent, cursor:'pointer' }}>Privacy Policy</span>.
            </p>
            <PrimaryBtn type="submit" loading={authLoading}>Create Account 🚀</PrimaryBtn>
          </form>
        </div>
      )}
    </AuthWrap>
  )
}

// ── FORGOT PASSWORD ────────────────────────────────────────
export function ForgotPassword({ onSwitch }) {
  const { sendPasswordReset, authLoading, authError, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }
    clearError()
    const result = await sendPasswordReset(email.trim())
    if (result.success) setSent(true)
  }

  if (sent) return (
    <AuthWrap>
      <div className="au" style={{ textAlign:'center' }}>
        <div style={{ fontSize:52, marginBottom:14 }}>📬</div>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, marginBottom:8 }}>Check your inbox</h2>
        <p style={{ color:T.sub, fontSize:13, lineHeight:1.7, marginBottom:20 }}>If an account exists for <strong>{email}</strong>, we sent a reset link.</p>
        <button onClick={()=>onSwitch('signin')} style={{ background:'none', border:'none', color:T.accent, fontWeight:700, cursor:'pointer', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>← Back to Sign In</button>
      </div>
    </AuthWrap>
  )

  return (
    <AuthWrap>
      <div className="au">
        <button onClick={()=>onSwitch('signin')} style={{ background:'none', border:'none', color:T.sub, cursor:'pointer', fontSize:13, fontWeight:600, marginBottom:16, padding:0, display:'flex', alignItems:'center', gap:4, fontFamily:"'DM Sans',sans-serif" }}>← Back to Sign In</button>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, marginBottom:4 }}>Reset password</h2>
        <p style={{ color:T.muted, fontSize:13, marginBottom:20 }}>Enter your email and we'll send a reset link.</p>
        <ErrorBox message={authError||error} onDismiss={()=>{ clearError(); setError('') }} />
        <form onSubmit={handleSubmit}>
          <Field label="Email Address" error={error}>
            <TextInput type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" icon="📧" />
          </Field>
          <PrimaryBtn type="submit" loading={authLoading}>Send Reset Link</PrimaryBtn>
        </form>
      </div>
    </AuthWrap>
  )
}

// ── RESET PASSWORD ─────────────────────────────────────────
export function ResetPassword({ onDone }) {
  const { updatePassword, authLoading, authError, clearError } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [errors,   setErrors]   = useState({})
  const [success,  setSuccess]  = useState(false)

  function validate() {
    const e = {}
    if (!password)              e.password = 'Required'
    else if (password.length<8) e.password = 'At least 8 characters'
    if (password !== confirm)   e.confirm  = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    clearError()
    const result = await updatePassword(password)
    if (result.success) setSuccess(true)
  }

  if (success) return (
    <AuthWrap>
      <div className="au" style={{ textAlign:'center' }}>
        <div style={{ fontSize:52, marginBottom:14 }}>🎉</div>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, marginBottom:8 }}>Password updated!</h2>
        <p style={{ color:T.sub, fontSize:13, marginBottom:22 }}>Your password has been reset successfully.</p>
        <PrimaryBtn onClick={onDone}>Go to Dashboard →</PrimaryBtn>
      </div>
    </AuthWrap>
  )

  return (
    <AuthWrap>
      <div className="au">
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, marginBottom:4 }}>Set new password</h2>
        <p style={{ color:T.muted, fontSize:13, marginBottom:16 }}>Choose a strong password.</p>
        <ErrorBox message={authError} onDismiss={clearError} />
        <PasswordStrength password={password} />
        <form onSubmit={handleSubmit}>
          <PasswordField label="New Password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" error={errors.password} />
          <PasswordField label="Confirm New Password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" error={errors.confirm} />
          <PrimaryBtn type="submit" loading={authLoading}>Update Password ✓</PrimaryBtn>
        </form>
      </div>
    </AuthWrap>
  )
}

// ── AUTH ROUTER ────────────────────────────────────────────
export function AuthRouter({ defaultScreen = 'signin' }) {
  const [screen, setScreen] = useState(defaultScreen)
  if (screen === 'signin')  return <SignIn         onSwitch={setScreen} />
  if (screen === 'signup')  return <SignUp          onSwitch={setScreen} />
  if (screen === 'forgot')  return <ForgotPassword  onSwitch={setScreen} />
  if (screen === 'reset')   return <ResetPassword   onDone={()=>setScreen('signin')} />
  return <SignIn onSwitch={setScreen} />
}
