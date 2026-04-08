/* =====================================================
   OHMDAIL — script.js
   ===================================================== */

/* ══════════════════════════════════════════════════
   💡 CONFIGURACIÓN PRINCIPAL — edita aquí
   ══════════════════════════════════════════════════ */
const CONFIG = {
  serverIP:   "ohmdail.playit.pub",  // IP del servidor
  serverPort: 5439,               // Puerto Bedrock
  discordURL: "https://discord.com/invite/pWygcbbZGe",  // 💡 Cambia tu link de Discord
};

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

// 💡 NOTICIAS — edita aquí cada semana
const NEWS = [
  {
    date:  "15 Dic 2026",
    tag:   "Evento",
    color: "gold",
    title: "Torneo de PvP Navideño 🎄",
    desc:  "Este sábado a las 7pm hora México. Premio: 5,000 monedas y rango VIP por un mes. ¡Inscríbete en Discord!",
  },
  {
    date:  "8 Abril 2026",
    tag:   "Actualización",
    color: "emerald",
    title: "Nueva zona de farms desbloqueada",
    desc:  "El área al norte del spawn ya está disponible. Incluye granja de hierro, trigo y una raid farm comunitaria.",
  },
  {
    date:  "3 Dic 2025",
    tag:   "Info",
    color: "sky",
    title: "Servidor migrado a nuevo hosting",
    desc:  "Mejoramos el servidor a uno con 8GB RAM y SSD NVMe. La latencia bajó de 80ms a menos de 20ms.",
  },
];

function renderNews() {
  const CAT_COLORS = {
    gold:    { bg: "rgba(251,191,36,0.08)",  text: "#fbbf24", border: "rgba(251,191,36,0.2)"  },
    emerald: { bg: "rgba(52,211,153,0.08)",  text: "#34d399", border: "rgba(52,211,153,0.2)"  },
    sky:     { bg: "rgba(56,189,248,0.08)",  text: "#38bdf8", border: "rgba(56,189,248,0.2)"  },
  };

  const container = document.getElementById("newsContainer");
  container.innerHTML = NEWS.map(n => {
    const col = CAT_COLORS[n.color] || CAT_COLORS.emerald;
    return `
      <div class="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
        <div class="flex items-center justify-between mb-3">
          <span class="cmd-category text-xs font-bold px-3 py-1 rounded-full border"
                style="background:${col.bg};color:${col.text};border-color:${col.border}">
            ${n.tag}
          </span>
          <span class="text-xs text-gray-600 font-mono">${n.date}</span>
        </div>
        <h3 class="text-white font-black text-lg mb-2">${n.title}</h3>
        <p class="text-gray-500 text-sm leading-relaxed">${n.desc}</p>
      </div>`;
  }).join("");
}

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
  renderNews(); // ← Noticias semanales
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
   💡 PARA CONECTAR TU API:
      Reemplaza el bloque de ejemplo con tu llamada real.
      Ejemplo con mcsrvstat.us (Bedrock):
      const res  = await fetch(`https://api.mcsrvstat.us/bedrock/3/${CONFIG.serverIP}`);
      const data = await res.json();
      setStatus(data.online, data.players?.online, data.players?.max);
   ══════════════════════════════════════════════════ */
async function fetchServerStatus() {
  try {
    /* ── Descomenta las siguientes líneas cuando tengas API ── */
    const res  = await fetch(`https://api.mcsrvstat.us/bedrock/3/${CONFIG.serverIP}`);
    const data = await res.json();
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
