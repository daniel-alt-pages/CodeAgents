import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

export default function Billing() {
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
          <a href="#" style={{ padding: '12px 16px', borderRadius: 12, textDecoration: 'none', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s', opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}>
            <span className="google-symbols" style={{ fontSize: 20 }}>token</span>
            Créditos y Consumo
          </a>
          <Link to="/billing" style={{ padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}>
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

      {/* BILLING MAIN CONTENT */}
      <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.02em' }}>Facturación</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: 16 }}>Gestiona tus pagos e historial de transacciones.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 99, fontWeight: 500 }}>
              {currentUser?.email || 'Cargando usuario...'}
            </span>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Métodos de Pago y Suscripción</h2>
            <p style={{ color: 'var(--text-sub)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
              Todos los pagos de CodeAgents son procesados de forma segura a través de <strong>Mercado Pago</strong>. 
              Para actualizar tu método de pago, cancelar tu suscripción mensual, o ver el detalle completo de tus cobros automáticos, puedes acceder al portal de Mercado Pago con la misma cuenta con la que realizaste el pago inicial.
            </p>
            <a href="https://www.mercadopago.com.co/subscriptions" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', padding: '14px 28px', borderRadius: 12, fontSize: 16, textDecoration: 'none', background: 'linear-gradient(135deg, #00E5FF 0%, #7B61FF 100%)', color: '#fff', fontWeight: 600, border: 'none', gap: 8, alignItems: 'center' }}>
              Abrir Portal de Pagos (Mercado Pago) <span className="google-symbols" style={{ fontSize: 20 }}>open_in_new</span>
            </a>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Historial Reciente (Referencia)</h2>
            <p style={{ color: 'var(--text-sub)', fontSize: 14, marginBottom: 24 }}>
              * Esta tabla muestra un estimado basado en tu fecha de creación. El historial oficial fiscal se envía a tu correo a través de Mercado Pago.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-sub)' }}>
                    <th style={{ padding: '16px 8px', fontWeight: 500 }}>Fecha</th>
                    <th style={{ padding: '16px 8px', fontWeight: 500 }}>Concepto</th>
                    <th style={{ padding: '16px 8px', fontWeight: 500 }}>Estado</th>
                    <th style={{ padding: '16px 8px', fontWeight: 500 }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 8px' }}>
                      {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('es-ES') : '—'}
                    </td>
                    <td style={{ padding: '16px 8px' }}>Activación de Licencia</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ fontSize: 12, background: 'rgba(52, 168, 83, 0.1)', color: 'var(--g-green)', padding: '4px 10px', borderRadius: 12, fontWeight: 600 }}>Pagado</span>
                    </td>
                    <td style={{ padding: '16px 8px' }}>Confirmado por MP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
