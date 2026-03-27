# Guía de Despliegue - CodeAgents

Esta guía técnica explica cómo desplegar la plataforma **CodeAgents**, la cual está dividida en dos partes:
1. **Frontend:** React + Vite (HTML/CSS/JS estático)
2. **Backend:** Express.js + Mercado Pago (Servidor API de Node.js)

Debido a que cuentas con un backend funcional (para gestionar los pagos), un servicio como **GitHub Pages no será suficiente** para que la app funcione al 100%, ya que Pages solo despliega archivos estáticos y no ejecuta el backend conectado a Mercado Pago.

---

## 🚀 Opción 1: Vercel (Frontend) + Render (Backend) -> [RECOMENDADA]

Esta arquitectura separa tu capa visual del servidor. Ambos servicios otorgan una capa gratuita bastante generosa y permanente.

### A. Desplegar el Backend en Render.com
Render ofrece un entorno gratuito y perfecto para alojar tu servidor de Express.

1. Inicia sesión en [Render](https://render.com/) con tu cuenta de GitHub.
2. Haz clic en **"New"** y selecciona **"Web Service"**.
3. Conecta el repositorio de GitHub: `daniel-alt-pages/CodeAgents`.
4. Renderizar detectará Node. Durante la configuración:
   - **Build Command:** Deja este espacio vacío (o pon `npm install` dependiendo de si tu `package.json` incluye todo). Como el tuyo está todo unificado, puede ser `npm install`.
   - **Start Command:** `node server/index.js`
5. En la sección de **Environment Variables** (Variables de Entorno), añade:
   - `MP_ACCESS_TOKEN`: (Tu Access Token de Producción).
6. Haz clic en **Create Web Service**. 
7. *Copia la URL* que te proporciona Render (Ejecutan sobre algo como `https://codeagents-api.onrender.com`).

### B. Desplegar el Frontend en Vercel.com
Vercel compilará automáticamente usando Vite y lo servirá desde una red global muy veloz.

1. Ve a `src/App.tsx` en tu entorno local.
2. Cambia todas las menciones que hacen una solicitud `fetch("http://localhost:3000/...` y fíltralas para que apunten al dominio de tu render `https://codeagents-api.onrender.com/...`.
3. Sube este cambio a GitHub (`git push`).
4. Inicia sesión en [Vercel](https://vercel.com/) vinculando GitHub.
5. Haz clic en **"Add New"** > **"Project"** e importa tu repositorio `CodeAgents`.
6. En **Environment Variables**, configura las variables propias de tu frontend (por ejemplo, si tienes alguna oculta para endpoints). Define `VITE_SITE_URL` con tu dominio futuro de Vercel.
7. Haz clic en **Deploy**. ¡Listo, en 30 segundos tu plataforma visual estará activa en Internet!

---

## ☁️ Opción 2: Render (Fullstack todo en uno) -> [MÁS SIMPLE]

Tu proyecto actual puede ejecutarse de manera simultánea en una sola máquina virtual dentro de Render. Para hacer esto debemos compilar a producción primero y servirlo desde Express.

1. Asegúrate de modificar `server/index.js` para que *sirva los archivos* creados por Vite:
   ```javascript
   // Justo debajo de tus imports al inicio del server/index.js
   const path = require('path');
   app.use(express.static(path.join(__dirname, '../dist')));
   
   // Como última ruta manejadora antes del app.listen
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist', 'index.html'));
   });
   ```
2. Modifica el comando `package.json` o sube la carpeta `dist/` compilada a Git ejecutando localmente:
   ```bash
   npm run build
   ```
3. Registra tu proyecto en **Render (Web Service)** tal como en la opción anterior (conectando el repo de GitHub).
4. Configura el servicio así:
   - **Language:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`
5. Añade las **Variables de Entorno** (`MP_ACCESS_TOKEN`, `VITE_SITE_URL` apuntado al dominio de render).
6. Haz clic en **Deploy**. 
   > De esta manera todo (Frontend React y API) estará en un mismo lugar y en una sola URL y en un solo servidor de Node. 

---

## 🛠️ Opción 3: Publicar ÚNICAMENTE el frontend (Visual) en GitHub Pages

Dado tu caso, si simplemente quieres ver la página en vivo hoy pero **sin que la pasarela de pagos funcione**:

1. En la consola (terminal), instala el auto-publicador de gh-pages:
   ```bash
   npm install gh-pages --save-dev
   ```
2. En el archivo `vite.config.ts`, añade el parámetro de Base path con el nombre de tu repositorio:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/CodeAgents/',
   })
   ```
3. En tu archivo `package.json`, agrega estos scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Solo basta correr el comando y publicará todo:
   ```bash
   npm run deploy
   ```
   *Nota:* Para restablecer esto, recuerda quitar el `base: '/CodeAgents/'` si planeas usar otro hosting más profesional a largo plazo para que Vite direccione desde el origen de tu dominio a la raíz directamente.

---

### Recordatorio Crucial (Mercado Pago)
Cualquier método que elijas, si ya estás recibiendo dinero real:
1. Revisa tu panel en **Mercado Pago > Credenciales de Producción**.
2. ¡Reemplaza los Access Token locales simulados con los de Producción reales!
3. Acuérdate de cambiar las `back_urls` a la URL final donde se publica tu web.
