/* ============================================================
   ROHITH PALIKA PORTFOLIO — script.js
   ============================================================ */

// ── Theme Switcher (Monochrome Noir ↔ Cream Light Mode) ───────
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-toggle-icon');
const themeText   = document.getElementById('theme-toggle-text');

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('theme-light');
    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeText) themeText.textContent = 'Noir';
  } else {
    document.body.classList.remove('theme-light');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = 'Light';
  }
}

// Load saved preference or default to Dark Noir
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('theme-light');
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

// ── Navbar scroll state ───────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightActiveNav();
});

// ── Mobile nav toggle ─────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(6.5px) rotate(45deg)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'translateY(-6.5px) rotate(-45deg)' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  });
});

// ── Active nav link highlight on scroll ───────────────────────
const sections = document.querySelectorAll('section[id]');
function highlightActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ── Smooth scroll for ALL anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Scroll reveal animations (Continuous Bidirectional) ───────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      // Re-trigger animation when scrolled out and back in
      const rect = entry.target.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        entry.target.classList.remove('visible');
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Copy email to clipboard ───────────────────────────────────
const copyBtn = document.getElementById('copy-email-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('rohithpalika01@gmail.com').then(() => {
      const original = copyBtn.innerHTML;
      copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      copyBtn.style.color = '#4ade80';
      copyBtn.style.borderColor = '#4ade80';
      setTimeout(() => {
        copyBtn.innerHTML = original;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2000);
    });
  });
}

// ── Contact form submit ───────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'transparent';
    btn.style.color = '#4ade80';
    btn.style.borderColor = '#4ade80';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      contactForm.reset();
    }, 3000);
  });
}

// ── Init on load ──────────────────────────────────────────────
window.addEventListener('load', () => {
  highlightActiveNav();
  init3DNeuralMesh();
  initPortraitDepthParallax();
});

// ── 2.5D Portrait Depth Parallax (Subtle, Organic & Stable) ────
function initPortraitDepthParallax() {
  const heroCard = document.querySelector('.hero-canvas');
  const portraitImg = document.getElementById('hero-portrait-img');
  if (!heroCard || !portraitImg) return;

  let currentX = 0, currentY = 0, currentScale = 1;
  let targetX = 0, targetY = 0, targetScale = 1;
  let isHovered = false;
  let animId = null;

  function update() {
    // Smooth lerp (0.075) for fluid physics
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;
    currentScale += (targetScale - currentScale) * 0.075;

    portraitImg.style.transform = `scale(${currentScale.toFixed(4)}) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

    if (
      isHovered ||
      Math.abs(targetX - currentX) > 0.05 ||
      Math.abs(targetY - currentY) > 0.05 ||
      Math.abs(targetScale - currentScale) > 0.001
    ) {
      animId = requestAnimationFrame(update);
    } else {
      portraitImg.style.transform = 'scale(1) translate3d(0, 0, 0)';
      animId = null;
    }
  }

  heroCard.addEventListener('pointerenter', () => {
    isHovered = true;
    targetScale = 1.025; // Subtle luxury foreground lift
    if (!animId) animId = requestAnimationFrame(update);
  });

  heroCard.addEventListener('pointermove', e => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Organic 2.5D parallax response (±12px X, ±8px Y)
    targetX = ((x - centerX) / centerX) * 12;
    targetY = ((y - centerY) / centerY) * 8;

    if (!animId) animId = requestAnimationFrame(update);
  });

  heroCard.addEventListener('pointerleave', () => {
    isHovered = false;
    targetX = 0;
    targetY = 0;
    targetScale = 1;
    if (!animId) animId = requestAnimationFrame(update);
  });
}

// ── 3D Rotating Neural Lattice Wireframe (Vibrant & Crisp) ─────
function init3DNeuralMesh() {
  const canvas = document.getElementById('neural-3d-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  // 3D Nodes on a sphere
  const numNodes = 75;
  const radius = Math.min(width, height) * 0.44;
  const nodes = [];
  
  for (let i = 0; i < numNodes; i++) {
    const phi = Math.acos(-1 + (2 * i) / numNodes);
    const theta = Math.sqrt(numNodes * Math.PI) * phi;
    nodes.push({
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi)
    });
  }
  
  let angleX = 0.2;
  let angleY = 0;
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  
  const heroCanvas = canvas.parentElement;
  heroCanvas.addEventListener('pointermove', e => {
    const rect = heroCanvas.getBoundingClientRect();
    mouseTargetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.2;
    mouseTargetY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.2;
  });
  
  function render() {
    ctx.clearRect(0, 0, width, height);
    
    // Auto rotation with dynamic mouse response
    angleY += 0.005 + (mouseTargetX - angleY) * 0.04;
    angleX += 0.003 + (mouseTargetY - angleX) * 0.04;
    
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    
    // Center at 38% width: ~70% spans across title & copy, ~30-35% spans under the photo
    const cx = width * 0.38;
    const cy = height * 0.5;
    
    const projected = [];
    
    // Rotate and project 3D points
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      // Rotate Y
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.z * cosY + node.x * sinY;
      // Rotate X
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = z1 * cosX + node.y * sinX;
      
      const scale = 520 / (520 + z2);
      const px = x1 * scale + cx;
      const py = y2 * scale + cy;
      
      projected.push({ x: px, y: py, z: z2, scale: scale });
    }
    
    const isLight = document.body.classList.contains('theme-light');
    const nodeColor = isLight ? 'rgba(20, 20, 20, ' : 'rgba(255, 255, 255, ';
    const lineColor = isLight ? 'rgba(40, 40, 40, ' : 'rgba(255, 255, 255, ';
    
    // Draw wireframe connecting lines between nearby nodes
    ctx.lineWidth = 1.1;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const depthNorm = Math.min(projected[i].scale, projected[j].scale);
          const alpha = (1 - dist / 120) * (isLight ? 0.38 : 0.58) * depthNorm;
          ctx.strokeStyle = lineColor + Math.max(0.04, alpha).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        }
      }
    }
    
    // Draw glowing nodes with halo
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const depthFactor = (p.z + radius) / (2 * radius);
      const alpha = Math.max(0.25, depthFactor) * (isLight ? 0.65 : 0.85);
      const dotSize = Math.max(1.8, 3.2 * p.scale);
      
      // Node center
      ctx.fillStyle = nodeColor + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow outer halo for closest front nodes
      if (depthFactor > 0.6) {
        ctx.fillStyle = nodeColor + (alpha * 0.22).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    requestAnimationFrame(render);
  }
  
  render();
}
