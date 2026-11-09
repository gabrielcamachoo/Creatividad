/**
 * Generador de confeti ligero mediante HTML5 Canvas, sin dependencias externas.
 */

export function triggerConfetti(durationMs = 2500, particleCount = 75): void {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#facc15'];

  const particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
  }> = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.4 + (Math.random() - 0.5) * 100,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15,
    });
  }

  const startTime = Date.now();

  function animate() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    if (elapsed > durationMs) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const gravity = 0.45;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.rotation += p.vRot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}
