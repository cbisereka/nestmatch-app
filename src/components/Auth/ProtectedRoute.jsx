// ============================================================
//  src/components/Auth/ProtectedRoute.jsx
//  Guards pages that require login
// ============================================================
import { useAuth } from '../../context/AuthContext'
import { AuthRouter } from './AuthScreens'

const T = {
  bg:'#F9F7F4', accent:'#D64E2A', text:'#18150F', muted:'#A09890',
  white:'#FFFFFF', border:'#EAE6E1', green:'#1E6B3E', greenLight:'#E8F5EE',
  redLight:'#FDECEC', red:'#C0392B',
}

// Full-screen loading spinner
export function LoadingScreen({ message = 'Loading NestMatch...' }) {
  return (
    <div style={{ minHeight:'100vh', background:T.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&family=DM+Sans:wght@400;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
      `}</style>
      <div style={{ width:32, height:32, borderRadius:'50%', border:`3px solid ${T.accent}22`, borderTopColor:T.accent, animation:'spin .8s linear infinite' }} />
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:T.muted, animation:'pulse 1.5s ease infinite' }}>{message}</div>
    </div>
  )
}

// Onboarding required screen
export function OnboardingRequired({ onStart }) {
  return (
    <div style={{ minHeight:'100vh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@600&family=DM+Sans:wght@400;600;700&display=swap');`}</style>
      <div style={{ background:T.white, borderRadius:20, padding:32, maxWidth:400, width:'100%', textAlign:'center', boxShadow:'0 2px 16px rgba(0,0,0,.07)' }}>
        <div style={{ fontSize:48, marginBottom:14 }}>🏠</div>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, marginBottom:8 }}>Complete Your Profile</h2>
        <p style={{ color:T.muted, fontSize:14, lineHeight:1.7, marginBottom:24 }}>
          You're almost there! Complete your profile so we can find the best matches for you.
        </p>
        <button onClick={onStart} style={{ width:'100%', padding:'13px', borderRadius:10, background:T.accent, color:'#fff', border:'none', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
          Complete Profile →
        </button>
      </div>
    </div>
  )
}

// Access denied screen
export function AccessDenied({ requiredRole, currentRole }) {
  return (
    <div style={{ minHeight:'100vh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ textAlign:'center', maxWidth:360 }}>
        <div style={{ fontSize:48, marginBottom:14 }}>🚫</div>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, marginBottom:8 }}>Access Denied</h2>
        <p style={{ color:T.muted, fontSize:14, lineHeight:1.6 }}>
          This page requires a <strong>{requiredRole}</strong> account.
          Your current role is <strong>{currentRole}</strong>.
        </p>
      </div>
    </div>
  )
}

// Main protected route wrapper
export function ProtectedRoute({ children, requireRole, requireOnboarding = false }) {
  const { isAuthenticated, loading, profile, isLandlord, isRenter, isAdmin, onboardingComplete } = useAuth()

  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return <AuthRouter defaultScreen="signin" />

  if (requireRole) {
    const roleMap = { renter:isRenter, landlord:isLandlord, admin:isAdmin }
    if (!roleMap[requireRole]) return <AccessDenied requiredRole={requireRole} currentRole={profile?.role||'unknown'} />
  }

  return children
}
