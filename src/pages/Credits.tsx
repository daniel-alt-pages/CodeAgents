import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

export default function Credits() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
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
          <Link to="/dashboard" style={{ padding: '12px 16px', borderRadius: 12, textDecoration: 'none', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s' }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>dashboard</span>
            Mi Panel
          </Link>
          <Link to="/credits" style={{ padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}>
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

      {/* CREDITS MAIN CONTENT */}
      <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.02em' }}>Créditos y Consumo</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: 16 }}>Revisa los límites y el acceso de tu suscripción actual.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 99, fontWeight: 500 }}>
              {currentUser?.email || 'Cargando usuario...'}
            </span>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span className="google-symbols" style={{ fontSize: 32, color: 'var(--accent)' }}>info</span>
              <h2 style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>Política de Uso y Consumo</h2>
            </div>
            
            <p style={{ color: 'var(--text)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
              Actualmente tienes acceso completo a las herramientas incluidas en tu plan. El consumo de tokens para los modelos como <strong>Gemini 3.1 Pro</strong> y generación en <strong>Veo 3.1</strong> e <strong>IA Studio</strong> es administrado centralmente mediante cuotas periódicas y no se deduce desde un sistema de créditos prepago individual.
            </p>
            <p style={{ color: 'var(--text-sub)', fontSize: 15, lineHeight: 1.6 }}>
              <strong>Nota importante:</strong> Es virtualmente imposible calcular métricas de consumo en tiempo real para todos los servicios de Google dentro de esta interfaz. Tu uso exacto está sujeto a la Política de Uso Razonable compartida en los Términos y Condiciones.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {/* Limit Card 1 */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24 }}>
              <span className="google-symbols" style={{ fontSize: 32, color: 'var(--text)', opacity: 0.5, marginBottom: 16 }}>all_inclusive</span>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Uso de Gemini 3.1 Pro</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: 14 }}>Ilimitado bajo Política de Uso Razonable y cuotas máximas tolerables por hora según tu plan.</p>
            </div>
            {/* Limit Card 2 */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24 }}>
              <span className="google-symbols" style={{ fontSize: 32, color: 'var(--text)', opacity: 0.5, marginBottom: 16 }}>movie</span>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>CodeAgents Video (Veo)</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: 14 }}>Generaciones sujetas a los cupos diarios del plan asignado en la infraestructura.</p>
            </div>
             {/* Limit Card 3 */}
             <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24 }}>
              <span className="google-symbols" style={{ fontSize: 32, color: 'var(--text)', opacity: 0.5, marginBottom: 16 }}>cloud</span>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Almacenamiento (30TB)</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: 14 }}>Activado según nivel de facturación; monitoreado independientemente si tienes un plan Privado.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
