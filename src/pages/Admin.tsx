import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts', 'reports', 'settings'
  const [selectedAction, setSelectedAction] = useState<{ user: any, action: 'edit' | 'revoke' } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin (this is a basic frontend check, rules protect the actual data)
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const checkAdmin = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        navigate('/dashboard'); // Kick out if not admin
      }
    };
    checkAdmin();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setUsers(usersData);
    }, (error) => {
      console.error("Error fetching users. User might not be an admin: ", error);
    });

    return () => unsubscribe();
  }, [currentUser]);



  const stats = [
    { label: 'Usuarios Activos', value: '1,248', trend: '+12%', icon: 'group', color: 'var(--accent)' },
    { label: 'MRR Estimado', value: '$84,500', trend: '+5.2%', icon: 'payments', color: 'var(--g-green)' },
    { label: 'Renovaciones Próximas', value: '34', trend: '-2', icon: 'event_upcoming', color: 'var(--g-yellow)' },
    { label: 'Uso de Servidor', value: '78%', trend: '+3%', icon: 'dns', color: 'var(--g-red)' }
  ];

  const confirmAction = async () => {
    if (!selectedAction || !selectedAction.user) return;
    
    try {
      const userRef = doc(db, 'users', selectedAction.user.id);
      
      if (selectedAction.action === 'revoke') {
        await updateDoc(userRef, {
          status: 'Vencido',
          plan: null
        });
        console.log(`Acceso revocado para usuario ${selectedAction.user.email}`);
      } else if (selectedAction.action === 'edit') {
        // En una app real, acá podrías mostrar un formulario de edición.
        // Simularemos reactivar con un plan para la demostración.
        await updateDoc(userRef, {
          status: 'Activo',
          plan: 'Plan Privado',
          expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES') // 30 días más
        });
        console.log(`Suscripción actualizada para ${selectedAction.user.email}`);
      }
    } catch (error) {
      console.error("Error al modificar usuario:", error);
      alert("Hubo un error al guardar los cambios: " + (error as Error).message);
    }
    
    setSelectedAction(null);
  };

  const navItemStyle = (isActive: boolean) => ({
    padding: '12px 16px', 
    borderRadius: 12, 
    textDecoration: 'none', 
    display: 'flex', 
    alignItems: 'center', 
    gap: 12, 
    fontWeight: isActive ? 500 : 400,
    background: isActive ? 'var(--surface)' : 'transparent',
    border: isActive ? '1px solid transparent' : '1px solid transparent', // Keep border size same to avoid jumping
    borderColor: isActive ? 'var(--border)' : 'transparent',
    color: isActive ? 'var(--text)' : 'var(--text-sub)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div className="admin-layout">
      
      {/* OVERLAY FOR SIDEBAR ON MOBILE */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, animation: 'fadeIn 0.2s ease' }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 60 }}>
          <Link to="/" className="text-decoration-none" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="google-symbols" style={{ color: 'var(--accent)', fontSize: 32 }}>shield_person</span>
            <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)' }}>Admin Pro</span>
          </Link>
          <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
            <span className="google-symbols" style={{ fontSize: 24 }}>close</span>
          </button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <a onClick={() => { setActiveTab('accounts'); setIsSidebarOpen(false); }} style={navItemStyle(activeTab === 'accounts')} className="nav-btn">
            <span className="google-symbols" style={{ fontSize: 20 }}>supervised_user_circle</span>
            Manejo de Cuentas
          </a>
          <a onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }} style={navItemStyle(activeTab === 'reports')} className="nav-btn">
            <span className="google-symbols" style={{ fontSize: 20 }}>analytics</span>
            Reportes Globales
          </a>
          <a onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} style={navItemStyle(activeTab === 'settings')} className="nav-btn">
            <span className="google-symbols" style={{ fontSize: 20 }}>settings_applications</span>
            Configuración Core
          </a>
          <Link to="/dashboard" style={{ padding: '12px 16px', borderRadius: 12, textDecoration: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }} className="nav-btn">
            <span className="google-symbols" style={{ fontSize: 20 }}>arrow_back</span>
            Volver al Dashboard
          </Link>
        </nav>
      </aside>

      {/* DASHBOARD MAIN CONTENT */}
      <main className="admin-main">
        
        {/* PANEL: ACCOUNTS */}
        {activeTab === 'accounts' && (
          <div className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                  <span className="google-symbols" style={{ fontSize: 28 }}>menu</span>
                </button>
                <div>
                  <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 8px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Dashboard Administrativo</h1>
                  <p style={{ color: 'var(--text-sub)', fontSize: 16, margin: 0 }}>Control total sobre suscripciones, usuarios y métricas de rendimiento.</p>
                </div>
              </div>
              <div className="admin-header-actions" style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 99, alignItems: 'center', gap: 8 }}>
                  <span className="google-symbols" style={{ fontSize: 20, color: 'var(--text-sub)' }}>search</span>
                  <input type="text" placeholder="Buscar usuario..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14 }} />
                </div>
                <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99 }}>
                   <span className="google-symbols" style={{ fontSize: 20 }}>person_add</span> Nueva Licencia
                </button>
              </div>
            </header>

            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="google-symbols" style={{ fontSize: 24 }}>{stat.icon}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: stat.trend.includes('-') ? 'var(--g-red)' : 'var(--g-green)', background: stat.trend.includes('-') ? 'rgba(234,67,53,0.1)' : 'rgba(52,168,83,0.1)', padding: '4px 8px', borderRadius: 8 }}>
                      {stat.trend}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, color: 'var(--text-sub)', fontWeight: 500, margin: '0 0 4px 0' }}>{stat.label}</h3>
                    <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="table-container">
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 900 }}>
                 <thead>
                   <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                     <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: 13, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Usuario ID / Email</th>
                     <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: 13, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Suscripción</th>
                     <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: 13, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Consumo</th>
                     <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: 13, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estado Actual</th>
                     <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: 13, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vencimiento</th>
                     <th style={{ padding: '20px 24px', fontWeight: 600, fontSize: 13, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Acciones</th>
                   </tr>
                 </thead>
                 <tbody>
                   {users.map((u) => (
                     <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', background: u.status === 'Vencido' ? 'rgba(234,67,53,0.02)' : 'transparent' }}>
                       <td style={{ padding: '24px' }}>
                         <div style={{ fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 12 }}>
                           <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                             {u.email ? u.email[0].toUpperCase() : '?'}
                           </div>
                           {u.email || 'Email no registrado'}
                         </div>
                         <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 44 }} title={u.id}>UID: {String(u.id).substring(0, 8)}...</span>
                       </td>
                       <td style={{ padding: '24px', fontSize: 15 }}>{u.plan || 'Sin Plan'}</td>
                       <td style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 60, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                                 <div style={{ width: `${u.usage || 0}%`, height: '100%', background: (u.usage || 0) > 85 ? 'var(--g-red)' : 'var(--accent)', borderRadius: 3 }}></div>
                              </div>
                              <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>{u.usage || 0}%</span>
                          </div>
                       </td>
                       <td style={{ padding: '24px' }}>
                         <span style={{ 
                            fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20, 
                            background: u.status === 'Activo' ? 'rgba(52,168,83,0.1)' : 'rgba(234,67,53,0.1)',
                            color: u.status === 'Activo' ? 'var(--g-green)' : 'var(--g-red)'
                         }}>{u.status}</span>
                       </td>
                       <td style={{ padding: '24px', fontSize: 15, color: 'var(--text-sub)' }}>{u.expiration || '-'}</td>
                       <td style={{ padding: '24px', textAlign: 'right' }}>
                           <button onClick={() => setSelectedAction({ user: u, action: 'edit' })} style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 12, padding: 8, cursor: 'pointer', color: 'var(--text-sub)', transition: 'all 0.2s' }} title="Editar/Aprobar Suscripción" className="action-btn">
                             <span className="google-symbols" style={{ fontSize: 20 }}>edit</span>
                           </button>
                           <button onClick={() => setSelectedAction({ user: u, action: 'revoke' })} style={{ background: 'rgba(234,67,53,0.05)', border: '1px solid rgba(234,67,53,0.2)', borderRadius: 12, padding: 8, cursor: 'pointer', color: 'var(--g-red)', marginLeft: 8, transition: 'all 0.2s' }} title="Revocar Accesos" className="action-btn-danger">
                             <span className="google-symbols" style={{ fontSize: 20 }}>block</span>
                           </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {/* PANEL: REPORTS */}
        {activeTab === 'reports' && (
          <div className="fade-in">
            <header style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 40 }}>
              <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                <span className="google-symbols" style={{ fontSize: 28 }}>menu</span>
              </button>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 8px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Reportes Globales</h1>
                <p style={{ color: 'var(--text-sub)', fontSize: 16, margin: 0 }}>Analíticas detalladas de retención, ganancias y uso de IA.</p>
              </div>
            </header>

            <div className="reports-grid">
              {/* Fake Chart Area */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                   <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Tendencia de Ingresos Mensuales</h3>
                   <div style={{ display: 'flex', gap: 8 }}>
                     <button style={{ padding: '6px 16px', borderRadius: 99, border: '1px solid var(--text-muted)', background: 'transparent', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>1M</button>
                     <button style={{ padding: '6px 16px', borderRadius: 99, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, cursor: 'pointer' }}>6M</button>
                     <button style={{ padding: '6px 16px', borderRadius: 99, border: '1px solid var(--text-muted)', background: 'transparent', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>1Y</button>
                   </div>
                </div>
                {/* Visual Placeholder for a Chart */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2%', paddingBottom: 24, borderBottom: '1px dashed var(--border)' }}>
                  {[40, 55, 45, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                    <div key={i} style={{ width: '8%', height: `${h}%`, background: `linear-gradient(to top, rgba(66, 133, 244, 0.2), var(--accent))`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                       {i === 9 && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: 'var(--surface-alt)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>$84.5k</div>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, color: 'var(--text-muted)', fontSize: 13 }}>
                  <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span>
                </div>
              </div>

              {/* Side Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                 <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24 }}>
                   <h4 style={{ margin: '0 0 16px 0', fontSize: 15, color: 'var(--text-sub)', fontWeight: 500 }}>Modelos IA más usados</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                     {[{ name: 'Gemini 3 Pro', pct: 65, color: 'var(--g-blue)' }, { name: 'Veo Video', pct: 25, color: 'var(--g-red)' }, { name: 'NotebookLM', pct: 10, color: 'var(--g-yellow)' }].map(m => (
                       <div key={m.name}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, fontWeight: 500 }}>
                           <span>{m.name}</span><span>{m.pct}%</span>
                         </div>
                         <div style={{ width: '100%', height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                           <div style={{ width: `${m.pct}%`, height: '100%', background: m.color, borderRadius: 3 }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 
                 <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24, flex: 1 }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: 15, color: 'var(--text-sub)', fontWeight: 500 }}>Alertas del Sistema</h4>
                    <div style={{ padding: 16, background: 'rgba(234,67,53,0.05)', borderRadius: 12, border: '1px solid rgba(234,67,53,0.1)', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span className="google-symbols" style={{ color: 'var(--g-red)' }}>warning</span>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--text)' }}>El nodo US-East está experimentando latencia alta.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="fade-in" style={{ maxWidth: 800 }}>
            <header style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 40 }}>
              <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                <span className="google-symbols" style={{ fontSize: 28 }}>menu</span>
              </button>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 8px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Configuración Core</h1>
                <p style={{ color: 'var(--text-sub)', fontSize: 16, margin: 0 }}>Ajustes críticos del sistema y configuraciones globales.</p>
              </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Feature Toggles */}
              <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                   <span className="google-symbols" style={{ color: 'var(--accent)' }}>toggle_on</span> Funcionalidades del Sistema
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 500 }}>Modo Mantenimiento</h4>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-sub)' }}>Desactiva el acceso a todos los usuarios excepto administradores.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 500 }}>Registro de Nuevos Usuarios</h4>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-sub)' }}>Permitir que nuevos usuarios compren suscripciones automatizadas.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 500 }}>Deep Thinking (Gemini 3 Pro)</h4>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-sub)' }}>Habilita cálculos avanzados. Aumenta el costo de llamadas API.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </section>

              {/* API and Integration settings */}
              <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                   <span className="google-symbols" style={{ color: 'var(--accent)' }}>vpn_key</span> Claves y Conexiones
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-sub)' }}>API Key Primaria (Google Cloud)</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <input type="password" value="****************************************" readOnly style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
                      <button style={{ padding: '0 20px', borderRadius: 12, background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }} className="nav-btn">Renovar</button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-sub)' }}>Límite de Facturación Mensual</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)', fontSize: 16 }}>$</span>
                      <input type="number" defaultValue={5000} style={{ width: '100%', padding: '12px 16px 12px 32px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 16, outline: 'none', appearance: 'textfield' }} />
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Si se alcanza, la plataforma pasará a modo solo-lectura temporalmente.</p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                     <button className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: 99, fontWeight: 500 }}>Guardar Cambios</button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        )}

      </main>

      {/* CONFIRMATION MODAL */}
      {selectedAction && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 24, padding: 32, maxWidth: 440, width: '100%',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', gap: 24,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
              <div style={{ 
                width: 56, height: 56, borderRadius: 16, 
                background: selectedAction.action === 'revoke' ? 'rgba(234,67,53,0.1)' : 'rgba(66,133,244,0.1)', 
                color: selectedAction.action === 'revoke' ? 'var(--g-red)' : 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <span className="google-symbols" style={{ fontSize: 32 }}>
                  {selectedAction.action === 'revoke' ? 'warning' : 'verified_user'}
                </span>
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 6px 0' }}>
                  {selectedAction.action === 'revoke' ? 'Revocar Acceso' : 'Modificar Suscripción'}
                </h2>
                <p style={{ color: 'var(--text-sub)', fontSize: 14, margin: 0 }}>
                  Estás a punto de alterar el estado de este usuario.
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--surface-alt)', borderRadius: 16, padding: 16, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Usuario Seleccionado</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600 }}>
                  {selectedAction.user.email ? selectedAction.user.email[0].toUpperCase() : '?'}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600 }}>{selectedAction.user.email || 'Email no registrado'}</h3>
                  <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>UID: {String(selectedAction.user.id).substring(0, 8)}</span>
                    <span style={{ color: 'var(--border)' }}>|</span>
                    <span style={{ color: 'var(--text-sub)', fontWeight: 500 }}>{selectedAction.user.plan || 'Sin Plan'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: selectedAction.action === 'revoke' ? 'rgba(234,67,53,0.05)' : 'var(--bg)', borderRadius: 12, padding: 16, border: `1px solid ${selectedAction.action === 'revoke' ? 'rgba(234,67,53,0.2)' : 'var(--border)'}` }}>
               {selectedAction.action === 'revoke' ? (
                 <p style={{ fontSize: 14, color: selectedAction.action === 'revoke' ? 'var(--g-red)' : 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                   <strong>⚠️ Advertencia:</strong> Estás a punto de <strong>revocar todos los accesos</strong> de esta cuenta. El usuario no podrá acceder al sistema ni utilizar recursos de IA. Esta acción afectará su plan actual de forma permanente a menos que sea reinstaurado.
                 </p>
               ) : (
                 <p style={{ fontSize: 14, color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                   <strong>ℹ️ Información:</strong> Asegúrate de verificar el pago antes de activar características exclusivas o alterar la duración del acceso.
                 </p>
               )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button 
                onClick={() => setSelectedAction(null)}
                style={{ 
                  background: 'transparent', border: '1px solid var(--border)', 
                  color: 'var(--text)', padding: '10px 20px', borderRadius: 99, 
                  fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-alt)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmAction}
                style={{ 
                  background: selectedAction.action === 'revoke' ? 'var(--g-red)' : 'var(--accent)', 
                  border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 99, 
                  fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.2s',
                  boxShadow: selectedAction.action === 'revoke' ? '0 4px 12px rgba(234,67,53,0.3)' : '0 4px 12px rgba(66,133,244,0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                {selectedAction.action === 'revoke' ? 'Confirmar Revocación' : 'Aplicar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background: var(--bg); font-family: Inter; position: relative; }
        .admin-sidebar { width: 280px; border-right: 1px solid var(--border); background: var(--surface-alt); padding: 40px 24px; display: flex; flex-direction: column; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .admin-main { flex: 1; padding: 40px 60px; overflow-y: auto; overflow-x: hidden; }
        .hamburger-btn { display: none; background: transparent; border: none; color: var(--text); cursor: pointer; padding: 8px; border-radius: 8px; align-items: center; justify-content: center; }
        .hamburger-btn:hover { background: var(--surface); }
        .close-sidebar-btn { display: none; background: transparent; border: none; color: var(--text-sub); cursor: pointer; padding: 8px; border-radius: 8px; align-items: center; justify-content: center; }
        .close-sidebar-btn:hover { background: var(--surface); color: var(--text); }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 48px; }
        .table-container { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; overflow-x: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.02); }
        .reports-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

        @media (max-width: 900px) {
          .admin-sidebar { position: fixed; top: 0; bottom: 0; left: 0; z-index: 100; transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { padding: 32px 24px; }
          .hamburger-btn { display: flex; }
          .close-sidebar-btn { display: flex; }
          .reports-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr; }
          .admin-header-actions { flex-direction: column; width: 100%; gap: 16px; margin-top: 16px; }
          .admin-header-actions > div { width: 100%; }
          .admin-header-actions input { width: 100%; }
          .admin-header-actions button { width: 100%; justify-content: center; }
        }

        .action-btn:hover { background: var(--surface); color: var(--text) !important; border-color: var(--text-muted) !important; }
        .action-btn-danger:hover { background: rgba(234,67,53,0.15) !important; }
        .nav-btn:hover { background: var(--surface); border-color: var(--border) !important; color: var(--text) !important; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease; }
        
        /* Switch CSS */
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--surface-alt); transition: .2s; border: 1px solid var(--border); }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: var(--text-muted); transition: .2s; }
        input:checked + .slider { background-color: var(--accent); border-color: var(--accent); }
        input:checked + .slider:before { transform: translateX(20px); background-color: #fff; }
        .slider.round { border-radius: 24px; }
        .slider.round:before { border-radius: 50%; }

        /* Hide Number Spinners */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div>
  );
}
