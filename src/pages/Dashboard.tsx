import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [daysLeft, setDaysLeft] = useState(30);
  const [renewalDate, setRenewalDate] = useState('');
  const [progressPercent, setProgressPercent] = useState(100);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Calcular una fecha estimada de cobro (30 días después de crear la cuenta o último pago)
        // Como no hay backend de subs aún, asumimos 30 días desde la creación para mostrar data conectada al usuario.
        if (user.metadata.creationTime) {
          const creationDate = new Date(user.metadata.creationTime);
          const nextMonth = new Date(creationDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          const today = new Date();
          const diffTime = Math.abs(nextMonth.getTime() - today.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          setDaysLeft(diffDays > 0 ? diffDays : 0);
          
          const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
          setRenewalDate(nextMonth.toLocaleDateString('es-ES', options));
          
          const totalDaysInMonth = 30;
          const pct = Math.max(0, Math.min(100, (diffDays / totalDaysInMonth) * 100));
          setProgressPercent(pct);
        } else {
          setRenewalDate('Próximo ciclo');
        }

      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut(auth);
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Inter' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: 280, borderRight: '1px solid var(--border)', background: 'var(--surface-alt)', padding: '40px 24px', display: 'flex', flexDirection: 'column' }}>
        <Link to="/" className="text-decoration-none" style={{ textDecoration: 'none', marginBottom: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="google-symbols" style={{ color: 'var(--accent)', fontSize: 32 }}>magic_button</span>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)' }}>CodeAgents</span>
        </Link>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <Link to="/dashboard" style={{ padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>dashboard</span>
            Mi Panel
          </Link>
          <Link to="/credits" style={{ padding: '12px 16px', borderRadius: 12, textDecoration: 'none', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s' }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>token</span>
            Créditos y Consumo
          </Link>
          <Link to="/billing" style={{ padding: '12px 16px', borderRadius: 12, textDecoration: 'none', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s' }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>receipt_long</span>
            Facturación
          </Link>
          <Link to="/a8f9-dashboard-x2" style={{ padding: '12px 16px', borderRadius: 12, textDecoration: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>shield</span>
            Ajustes Seguros
          </Link>
          <a href="#" onClick={handleLogout} style={{ padding: '12px 16px', borderRadius: 12, textDecoration: 'none', color: 'var(--g-red)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>logout</span>
            Cerrar Sesión
          </a>
        </nav>
      </aside>

      {/* DASHBOARD MAIN CONTENT */}
      <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.02em' }}>Mi Cuenta</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: 16 }}>Revisa el estado de tu licencia y los accesos oficiales.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 99, fontWeight: 500 }}>
              {currentUser?.email || 'Cargando usuario...'}
            </span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: 32, marginBottom: 48 }}>
          
          {/* Card Mi Plan (Glassmorphism + Real data approximation) */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 32, padding: 40, boxShadow: '0 24px 48px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'var(--accent)', opacity: 0.05, filter: 'blur(40px)', borderRadius: '50%' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
               <div>
                 <span style={{ fontSize: 13, background: 'rgba(52, 168, 83, 0.1)', color: 'var(--g-green)', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>Estado: Activo</span>
                 <h2 style={{ fontSize: 28, fontWeight: 500, marginTop: 24, letterSpacing: '-0.01em', margin: 0 }}>Plan Vinculado</h2>
               </div>
               <span className="google-symbols" style={{ fontSize: 48, color: 'var(--accent)' }}>workspace_premium</span>
            </div>
            
            <div style={{ marginBottom: 40, flex: 1 }}>
              <p style={{ color: 'var(--text-sub)', fontSize: 15, marginBottom: 8 }}>Vencimiento de Suscripción (Est.):</p>
              <p style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', textTransform: 'capitalize' }}>
                {renewalDate || '—'}
              </p>
              
              <div style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', height: 8, borderRadius: 4, marginTop: 20, overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--g-green), #3ab562)', height: '100%', borderRadius: 4, transition: 'width 1s ease-in-out' }}></div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', marginTop: 12 }}>Aprox. {daysLeft} días restantes en tu ciclo actual.</p>
            </div>

            <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
              <a href="https://www.mercadopago.com.co/subscriptions" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '16px', borderRadius: 16, width: '100%', fontSize: 16, textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #00E5FF 0%, #7B61FF 100%)', color: '#fff', fontWeight: 600, border: 'none' }}>
                Gestionar Suscripción
              </a>
            </div>
          </div>

          {/* Account Details & Quick Start */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
               <div style={{ width: 64, height: 64, background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span className="google-symbols" style={{ fontSize: 32 }}>person</span>
               </div>
               <div>
                 <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px 0' }}>Cuenta Asignada</h3>
                 <p style={{ fontSize: 15, color: 'var(--text-sub)', margin: 0 }}>Debes usar exactamente esta cuenta asociada para iniciar sesión en todas las plataformas proporcionadas por CodeAgents:</p>
                 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 12, marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>{currentUser?.email || 'N/A'}</span>
                    <span className="google-symbols" style={{ fontSize: 18, color: 'var(--g-green)' }}>check_circle</span>
                 </div>
               </div>
            </div>

            <div style={{ background: 'rgba(234, 67, 53, 0.05)', border: '1px solid rgba(234, 67, 53, 0.2)', borderRadius: 24, padding: 32 }}>
               <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px 0', color: 'var(--text)' }}>Información de Consumo</h3>
               <p style={{ fontSize: 15, color: 'var(--text-sub)', margin: 0, lineHeight: 1.6 }}>
                 Actualmente los límites de consumo para modelos experimentales y almacenamiento dependen de las políticas de Google en tiempo real. Obtienes los cupos máximos permitidos en cada plataforma oficial a nivel Pro o Experimental. Para soporte o errores de cuota, usa el enlace de Soporte Técnico.
               </p>
            </div>
          </div>

        </div>

        {/* Quick Access Grid - REAL TOOLS */}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24, letterSpacing: '-0.01em' }}>Acceso Oficial a Plataformas</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            
            <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, textDecoration: 'none', color: 'var(--text)', transition: 'transform 0.2s, box-shadow 0.2s' }} className="hover-lift">
              <div style={{ width: 56, height: 56, background: 'rgba(161,66,244,0.1)', color: '#A142F4', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="google-symbols" style={{ fontSize: 28 }}>auto_awesome</span>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, margin: '0 0 8px 0', fontSize: 18 }}>Gemini 3.1 Pro</h4>
                <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5, display: 'block' }}>El modelo más avanzado para razonamiento lógico y código.</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
                Abrir Plataforma <span className="google-symbols" style={{ fontSize: 16 }}>open_in_new</span>
              </div>
            </a>
            
            <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, textDecoration: 'none', color: 'var(--text)', transition: 'transform 0.2s, box-shadow 0.2s' }} className="hover-lift">
              <div style={{ width: 56, height: 56, background: '#fce8e6', color: 'var(--g-red)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="google-symbols" style={{ fontSize: 28 }}>video_library</span>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, margin: '0 0 8px 0', fontSize: 18 }}>Google Veo 3.1 / IA Studio</h4>
                <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5, display: 'block' }}>Renders ultrarrealistas, generación de video y experimentación.</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
                Abrir Estudio <span className="google-symbols" style={{ fontSize: 16 }}>open_in_new</span>
              </div>
            </a>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, color: 'var(--text)', position: 'relative' }}>
              <div style={{ width: 56, height: 56, background: 'rgba(242,153,0,0.1)', color: 'var(--g-yellow)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="google-symbols" style={{ fontSize: 28 }}>bolt</span>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, margin: '0 0 8px 0', fontSize: 18 }}>Nano Banana Pro</h4>
                <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5, display: 'block' }}>Modelo de ejecución rápida y optimizada de Antigravity.</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)', fontSize: 14, fontWeight: 500 }}>
                Acceso Integrado <span className="google-symbols" style={{ fontSize: 16 }}>lock_open</span>
              </div>
            </div>

            <a href="https://labs.google.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, textDecoration: 'none', color: 'var(--text)', transition: 'transform 0.2s, box-shadow 0.2s' }} className="hover-lift">
              <div style={{ width: 56, height: 56, background: 'rgba(0,188,212,0.1)', color: '#00BCD4', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="google-symbols" style={{ fontSize: 28 }}>science</span>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, margin: '0 0 8px 0', fontSize: 18 }}>Google Whisk / Labs</h4>
                <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5, display: 'block' }}>Características experimentales en etapa de desarrollo activo.</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
                Abrir Labs <span className="google-symbols" style={{ fontSize: 16 }}>open_in_new</span>
              </div>
            </a>

            <a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 24, textDecoration: 'none', color: 'var(--text)', transition: 'transform 0.2s, box-shadow 0.2s' }} className="hover-lift">
              <div style={{ width: 56, height: 56, background: 'var(--bg)', color: 'var(--text)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="google-symbols" style={{ fontSize: 28 }}>contact_mail</span>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, margin: '0 0 8px 0', fontSize: 18 }}>Correo Asignado</h4>
                <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5, display: 'block' }}>Bandeja de entrada de tu cuenta vinculada.</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>
                Abrir Gmail <span className="google-symbols" style={{ fontSize: 16 }}>open_in_new</span>
              </div>
            </a>

          </div>
        </div>
      </main>
      
      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
          border-color: var(--accent) !important;
        }
      `}</style>
    </div>
  );
}

