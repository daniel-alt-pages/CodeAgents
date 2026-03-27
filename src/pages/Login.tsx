import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import '../landing.css'; 

/* ═══ BRAND LOGO ═══ */
const BrandLogo = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 64 64" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 20L32 32L16 44" stroke="url(#code-grad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36 44H50" stroke="url(#code-grad)" strokeWidth="8" strokeLinecap="round"/>
    <defs>
      <linearGradient id="code-grad" x1="16" y1="20" x2="50" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00E5FF"/><stop offset="1" stopColor="#7B61FF"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<'email' | 'password' | null>(null);
  const navigate = useNavigate();

  // Read URL params to show payment success message
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  const subscriptionStatus = urlParams.get('subscription');
  const planName = urlParams.get('plan');
  
  const hasSuccessfulPayment = paymentStatus === 'success' || subscriptionStatus === 'active';

  async function handleGoogleLogin(e: React.MouseEvent) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch(err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Error al iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa ambos campos.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // Determine role from firestore, default simply redirecting to dashboard.
      navigate('/dashboard');
    } catch (err: any) {
      // Improved error validation
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Por favor, intenta más tarde.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#040404', 
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambience */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(123,97,255,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div className="login-card" style={{
        maxWidth: 420,
        width: '100%',
        padding: '48px 40px',
        background: 'rgba(20, 20, 22, 0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        zIndex: 10,
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
            <BrandLogo size={36} />
          </div>
          <h2 style={{ fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>Bienvenido de nuevo</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 8, fontSize: 15 }}>Inicia sesión para continuar a tu panel.</p>
        </div>

        {hasSuccessfulPayment && (
          <div style={{
            padding: '16px',
            background: 'rgba(52, 168, 83, 0.15)',
            color: '#81c995',
            border: '1px solid rgba(52, 168, 83, 0.25)',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span className="google-symbols" style={{ fontSize: 24 }}>check_circle</span>
            <div>
              <strong style={{ display: 'block', fontSize: 16, marginBottom: 4 }}>¡Suscripción Confirmada!</strong>
              Tu pago del plan {planName === 'private' ? 'Privado' : 'Compartido'} fue exitoso. Inicia sesión para continuar.
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '14px 16px',
            background: 'rgba(234, 67, 53, 0.15)',
            color: '#ff8a80',
            border: '1px solid rgba(234, 67, 53, 0.25)',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label style={{ display: 'block', fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <span className="google-symbols" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: isFocused === 'email' ? '#00e5ff' : 'rgba(255,255,255,0.3)', transition: 'color 0.3s ease', fontSize: 20 }}>mail</span>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                placeholder="tu@correo.com"
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 44px', 
                  borderRadius: 12, 
                  border: isFocused === 'email' ? '1px solid rgba(0, 229, 255, 0.5)' : '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: '#fff', 
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: isFocused === 'email' ? '0 0 0 4px rgba(0, 229, 255, 0.1)' : 'none'
                }} 
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Contraseña</label>
            </div>
            <div style={{ position: 'relative' }}>
              <span className="google-symbols" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: isFocused === 'password' ? '#00e5ff' : 'rgba(255,255,255,0.3)', transition: 'color 0.3s ease', fontSize: 20 }}>lock</span>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused('password')}
                onBlur={() => setIsFocused(null)}
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 44px', 
                  borderRadius: 12, 
                  border: isFocused === 'password' ? '1px solid rgba(0, 229, 255, 0.5)' : '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: '#fff', 
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: isFocused === 'password' ? '0 0 0 4px rgba(0, 229, 255, 0.1)' : 'none'
                }} 
              />
            </div>
          </div>

          <button 
            disabled={loading} 
            className="btn btn-primary"
            style={{ 
              marginTop: 12, 
              padding: '14px', 
              width: '100%',
              borderRadius: 12,
              background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00E5FF 0%, #7B61FF 100%)',
              color: loading ? 'rgba(255,255,255,0.5)' : '#fff',
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: loading ? 'none' : '0 8px 16px rgba(123, 97, 255, 0.3)'
            }}
          >
            {loading ? (
              <>
                <span className="google-symbols" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
                Autenticando...
              </>
            ) : (
              'Ingresar a la Plataforma'
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', opacity: 0.5 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }}></div>
            <span style={{ padding: '0 12px', fontSize: 13 }}>O continúa con</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }}></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin} 
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
            Continuar con Google
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
            ¿No tienes cuenta? <Link to="/#plans" style={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 500, marginLeft: 4 }}>Suscríbete ahora</Link>
          </span>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          boxShadow: 0 12px 24px rgba(123, 97, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
