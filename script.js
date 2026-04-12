/* =====================================================
   OHMDAIL — script.js
   ===================================================== */

/* ══════════════════════════════════════════════════
   💡 CONFIGURACIÓN PRINCIPAL — edita aquí
   ══════════════════════════════════════════════════ */
const CONFIG = {
  serverIP:   "ohmdail.playit.pub",  // IP del servidor
  serverPort: 9016,               // Puerto Bedrock
  discordURL: "https://discord.gg/pWygcbbZGe",  // 💡link de Discord
};

/* ══════════════════════════════════════════════════
   💡 NOTICIAS — edita aquí cada semana
   Campos:
     date  → Fecha visible (texto libre, ej: "15 Dic 2024")
     tag   → Etiqueta corta (ej: "Evento", "Update", "Info")
     color → "emerald" | "gold" | "sky" | "purple" | "indigo"
     title → Título de la noticia
     desc  → Descripción corta
     img   → Ruta de tu imagen (ej: "imgs/evento.png") o URL externa.
             Déjalo en "" para mostrar un placeholder automático.
   ══════════════════════════════════════════════════ */
const NEWS = [
  {
    date:  "31 Abril 2026",
    tag:   "Actualización", /*aqui era Evento */
    color: "emerald",  /*gold */
    title: "Nuevas mochilas llegan!",
    desc:  "Por primera vez se a agregado un addon al servidor , gracias a la comunidad",
    img:   "https://media.forgecdn.net/attachments/1417/708/mcpedl-png.png",
    link:  "https://mcpedl.com/bony162backpacks/",  
  },
  {
    date:  "10 Dic 2024",
    tag:   "Actualización",
    color: "emerald",
    title: "Servidor de discord mejorado",
    desc:  "El servidor proximamente contara con diversas funcionalidades.",
    img:   "https://cdn2.unrealengine.com/what-is-discord-1920x1080-c3d90ca45f57.jpg",
    
  },
  {
    date:  "8 Abril 2026",
    tag:   "Info",
    color: "sky",
    title: "La comunidad tambien participa",
    desc:  "Cada cierto tiempo la comunidad tendra la opcion de votar por un addon para el servidor.",
    img:   "https://i.ytimg.com/vi/rRJ5fn1Zpao/maxresdefault.jpg",
  },
];

/* ══════════════════════════════════════════════════
   💡 COMANDOS — agrega, quita o edita aquí
   Campos: cmd (texto), desc (descripción), cat (categoría), color (estilo CSS)
   ══════════════════════════════════════════════════ */
const COMMANDS = [
  { cmd: "/spawn",      desc: "Regresa al spawn principal del servidor.",      cat: "General",  color: "emerald" },
  { cmd: "/sethome",    desc: "Establece tu punto de inicio personalizado.",   cat: "General",  color: "emerald" },
  { cmd: "/home",       desc: "Teletransporte a tu punto de inicio.",          cat: "General",  color: "emerald" },
  { cmd: "/tpa",        desc: "Solicita teletransporte a otro jugador.",       cat: "Social",   color: "sky"     },
  { cmd: "/tpahere",    desc: "Invita a otro jugador a tu ubicación.",         cat: "Social",   color: "sky"     },
  { cmd: "/pay",        desc: "Envía dinero a otro jugador.",                  cat: "Economía", color: "gold"    },
  { cmd: "/bal",        desc: "Consulta tu balance actual.",                   cat: "Economía", color: "gold"    },
  { cmd: "/shop",       desc: "Abre la tienda global del servidor.",           cat: "Economía", color: "gold"    },
  { cmd: "/claim",      desc: "Reclama el chunk en el que estás parado.",      cat: "Protección", color: "purple" },
  { cmd: "/trust",      desc: "Da acceso a tu terreno a otro jugador.",        cat: "Protección", color: "purple" },
  { cmd: "/discord",    desc: "Obtén el enlace al servidor de Discord.",       cat: "Info",     color: "indigo"  },
  { cmd: "/rules",      desc: "Muestra las reglas del servidor.",              cat: "Info",     color: "indigo"  },
];

/* Colores para las categorías */
const CAT_COLORS = {
  emerald: { bg: "rgba(52,211,153,0.08)",  text: "#34d399", border: "rgba(52,211,153,0.2)"  },
  sky:     { bg: "rgba(56,189,248,0.08)",  text: "#38bdf8", border: "rgba(56,189,248,0.2)"  },
  gold:    { bg: "rgba(251,191,36,0.08)",  text: "#fbbf24", border: "rgba(251,191,36,0.2)"  },
  purple:  { bg: "rgba(168,85,247,0.08)",  text: "#c084fc", border: "rgba(168,85,247,0.2)"  },
  indigo:  { bg: "rgba(129,140,248,0.08)", text: "#818cf8", border: "rgba(129,140,248,0.2)" },
};

/* ══════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ once: true, offset: 60, duration: 700, easing: "ease-out-cubic" });
  initNavbar();
  initParticles();
  renderCommands();
  renderNews();
  fetchServerStatus();
  updateDiscordLinks();
});

/* ══════════════════════════════════════════════════
   NAVBAR scroll effect
   ══════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

/* ══════════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════════ */
document.getElementById("menuBtn").addEventListener("click", () => {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
});

function closeMobileMenu() {
  document.getElementById("mobileMenu").classList.add("hidden");
}

/* ══════════════════════════════════════════════════
   COPIAR IP
   ══════════════════════════════════════════════════ */
function copyIP() {
  const btn  = document.getElementById("copyBtn");
  const text = document.getElementById("copyBtnText");

  navigator.clipboard.writeText(CONFIG.serverIP).then(() => {
    btn.classList.add("copied");
    text.textContent = "¡Copiado! ✓";

    setTimeout(() => {
      btn.classList.remove("copied");
      text.textContent = `Copiar IP — ${CONFIG.serverIP}`;
    }, 2500);
  }).catch(() => {
    /* Fallback para navegadores sin API Clipboard */
    const el = document.createElement("textarea");
    el.value = CONFIG.serverIP;
    el.style.position = "fixed";
    el.style.opacity  = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    btn.classList.add("copied");
    text.textContent = "¡Copiado! ✓";
    setTimeout(() => {
      btn.classList.remove("copied");
      text.textContent = `Copiar IP — ${CONFIG.serverIP}`;
    }, 2500);
  });
}

/* ══════════════════════════════════════════════════
   SERVER STATUS
   💡 La API de mcsrvstat.us ya está conectada.
      Si tu servidor aún no está en línea, mostrará
      OFFLINE automáticamente — no hay que tocar nada más.
   ══════════════════════════════════════════════════ */
async function fetchServerStatus() {
  try {
    const res  = await fetch(`https://api.mcsrvstat.us/bedrock/3/${CONFIG.serverIP}`);
    const data = await res.json();
    console.log(data); // ← abre la consola del navegador (F12) y dime qué aparece
    setStatus(data.online, data.players?.online ?? 0, data.players?.max ?? 0);
  } catch (e) {
    setStatus(false, 0, 0);
  }
}

function setStatus(online, players, maxPlayers) {
  const dot  = document.getElementById("statusDot");
  const text = document.getElementById("statusText");
  const h2   = document.querySelector("#status h2");

  document.getElementById("onlinePlayers").textContent = players;
  document.getElementById("maxPlayers").textContent    = maxPlayers;

  if (online) {
    dot.className  = "w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50";
    text.className = "text-emerald-400 font-bold text-sm tracking-widest";
    text.textContent = "ONLINE";
    h2.innerHTML = 'Servidor <span class="text-emerald-400">Online</span>';
  } else {
    dot.className  = "w-3 h-3 rounded-full bg-red-500";
    text.className = "text-red-400 font-bold text-sm tracking-widest";
    text.textContent = "OFFLINE";
    h2.innerHTML = 'Servidor <span class="text-red-400">Offline</span>';
  }
}

/* ══════════════════════════════════════════════════
   RENDER NEWS
   ══════════════════════════════════════════════════ */
function renderNews() {
  const container = document.getElementById("newsContainer");
  if (!container) return;

  container.innerHTML = NEWS.map((n, i) => {
    const col = CAT_COLORS[n.color] || CAT_COLORS.emerald;

    /* Si no hay imagen, genera un placeholder con gradiente y un ícono */
    const imgContent = n.img
      ? `<img src="${n.img}" alt="${n.title}"
              class="news-thumb-img w-full h-full object-cover" />`
      : `<div class="w-full h-full flex items-center justify-center news-thumb-placeholder"
              style="background: linear-gradient(135deg, ${col.bg}, rgba(0,0,0,0.3))">
           <svg class="w-8 h-8 opacity-40" style="color:${col.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                   d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
           </svg>
         </div>`;

    return `
      <div class="news-card glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:border-white/10"
           data-aos="fade-up" data-aos-duration="600" data-aos-delay="${i * 100}">

        <!-- Thumbnail con zoom en hover -->
        <div class="news-thumb-wrapper relative overflow-hidden"
             style="height: 140px; border-bottom: 1px solid rgba(255,255,255,0.05)">
          ${imgContent}
          <!-- Overlay con gradiente para suavizar el borde inferior -->
          <div class="absolute inset-0 news-thumb-overlay pointer-events-none"></div>
          <!-- Badge de categoría flotante sobre la imagen -->
          <span class="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-md border tracking-widest backdrop-blur-sm"
                style="background:rgba(0,0,0,0.55);color:${col.text};border-color:${col.border}">
            ${n.tag.toUpperCase()}
          </span>
        </div>

        <!-- Contenido de texto -->
        <div class="p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-gray-600 font-mono">${n.date}</span>
          </div>
          <h3 class="text-white font-black text-base mb-2 leading-snug">${n.title}</h3>
          <p class="text-gray-500 text-xs leading-relaxed">${n.desc}</p>
          ${n.link ? `<a href="${n.link}" target="_blank" rel="noopener"
          class="inline-flex items-center gap-1 mt-3 text-xs font-bold transition-colors"
          style="color:${col.text}">
          Leer más →
          </a>` : ""}
        </div>
      </div>`;
  }).join("");

  if (typeof AOS !== "undefined") AOS.refresh();
}

/* ══════════════════════════════════════════════════
   RENDER COMMANDS TABLE
   ══════════════════════════════════════════════════ */
function renderCommands() {
  const tbody = document.getElementById("commandsTable");
  tbody.innerHTML = COMMANDS.map(c => {
    const col = CAT_COLORS[c.color] || CAT_COLORS.emerald;
    return `
      <tr class="cmd-row">
        <td class="px-5 py-3 whitespace-nowrap">
          <span class="cmd-code">${c.cmd}</span>
        </td>
        <td class="px-5 py-3 text-gray-400 text-sm">${c.desc}</td>
        <td class="hidden sm:table-cell px-5 py-3">
          <span class="cmd-category"
                style="background:${col.bg};color:${col.text};border-color:${col.border}">
            ${c.cat}
          </span>
        </td>
      </tr>`;
  }).join("");
}

/* ══════════════════════════════════════════════════
   UPDATE DISCORD LINKS
   ══════════════════════════════════════════════════ */
function updateDiscordLinks() {
  document.querySelectorAll('a[href*="TU-ENLACE-AQUI"]').forEach(a => {
    a.href = CONFIG.discordURL;
  });
}

/* ══════════════════════════════════════════════════
   PARTICLES — efecto tipo Minecraft Bedrock
   ══════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  const ctx    = canvas.getContext("2d");

  /* 💡 Ajusta aquí el comportamiento de las partículas */
  const PARTICLE_COUNT = 55;   // Cantidad de partículas
  const PARTICLE_SIZE  = 3;    // Tamaño base (px)
  const SPEED          = 0.3;  // Velocidad de movimiento
  const COLORS = [             // Paleta de colores de partículas
    "rgba(52,211,153,",   // Verde esmeralda
    "rgba(251,191,36,",   // Oro
    "rgba(56,189,248,",   // Cielo
    "rgba(255,255,255,",  // Blanco
  ];

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 10;
      this.size  = PARTICLE_SIZE * (0.4 + Math.random() * 1.2);
      this.speedY = -(SPEED * (0.4 + Math.random()));
      this.speedX = (Math.random() - 0.5) * SPEED * 0.5;
      this.opacity = 0.15 + Math.random() * 0.35;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = 0.015 + Math.random() * 0.02;
      /* Partículas tipo bloque cuadrado a veces */
      this.isBlock = Math.random() < 0.35;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinkle += this.twinkleSpeed;
      this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.twinkle));
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.currentOpacity;
      ctx.fillStyle   = `${this.color}${this.currentOpacity})`;

      if (this.isBlock) {
        /* Bloque de pixel Minecraft */
        const s = this.size * 1.5;
        ctx.fillRect(this.x, this.y, s, s);
        ctx.fillStyle = `rgba(255,255,255,0.15)`;
        ctx.fillRect(this.x, this.y, s * 0.4, s * 0.4);
      } else {
        /* Partícula circular */
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => { resize(); }, { passive: true });
  init();
  animate();
}
