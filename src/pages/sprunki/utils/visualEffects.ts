
export interface VisualEffect {
  id: string;
  type: 'ripple' | 'burst' | 'spiral' | 'wave' | 'geometry';
  x: number;
  y: number;
  progress: number;
  duration: number;
  color: string;
  intensity: number;
  frequency?: number;
}

export class VisualEffectsEngine {
  private effects: VisualEffect[] = [];

  createRipple(x: number, y: number, color: string, intensity: number): string {
    const id = `ripple-${Date.now()}-${Math.random()}`;
    this.effects.push({
      id,
      type: 'ripple',
      x,
      y,
      progress: 0,
      duration: 2000,
      color,
      intensity
    });
    return id;
  }

  createBurst(x: number, y: number, color: string, intensity: number): string {
    const id = `burst-${Date.now()}-${Math.random()}`;
    this.effects.push({
      id,
      type: 'burst',
      x,
      y,
      progress: 0,
      duration: 1000,
      color,
      intensity
    });
    return id;
  }

  createGeometryMorph(x: number, y: number, color: string, frequency: number): string {
    const id = `geometry-${Date.now()}-${Math.random()}`;
    this.effects.push({
      id,
      type: 'geometry',
      x,
      y,
      progress: 0,
      duration: 1500,
      color,
      intensity: 1,
      frequency
    });
    return id;
  }

  update(deltaTime: number): VisualEffect[] {
    this.effects = this.effects.map(effect => ({
      ...effect,
      progress: effect.progress + deltaTime
    })).filter(effect => effect.progress < effect.duration);

    return this.effects;
  }

  renderEffect(ctx: CanvasRenderingContext2D, effect: VisualEffect): void {
    const progress = effect.progress / effect.duration;
    const alpha = 1 - progress;

    ctx.save();
    ctx.globalAlpha = alpha * effect.intensity;

    switch (effect.type) {
      case 'ripple':
        this.renderRipple(ctx, effect, progress);
        break;
      case 'burst':
        this.renderBurst(ctx, effect, progress);
        break;
      case 'geometry':
        this.renderGeometry(ctx, effect, progress);
        break;
    }

    ctx.restore();
  }

  private renderRipple(ctx: CanvasRenderingContext2D, effect: VisualEffect, progress: number): void {
    const radius = progress * 150 * effect.intensity;
    const lineWidth = (1 - progress) * 8;

    ctx.strokeStyle = effect.color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ripples
    for (let i = 1; i <= 3; i++) {
      const innerRadius = radius - (i * 20);
      if (innerRadius > 0) {
        ctx.globalAlpha *= 0.6;
        ctx.lineWidth = lineWidth * (1 - i * 0.2);
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, innerRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  private renderBurst(ctx: CanvasRenderingContext2D, effect: VisualEffect, progress: number): void {
    const rays = 12;
    const maxLength = 80 * effect.intensity;
    const currentLength = progress * maxLength;

    ctx.strokeStyle = effect.color;
    ctx.lineWidth = (1 - progress) * 4;

    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 * i) / rays;
      const variance = Math.sin(progress * Math.PI * 4) * 0.3;
      const length = currentLength * (1 + variance);

      ctx.beginPath();
      ctx.moveTo(effect.x, effect.y);
      ctx.lineTo(
        effect.x + Math.cos(angle) * length,
        effect.y + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  }

  private renderGeometry(ctx: CanvasRenderingContext2D, effect: VisualEffect, progress: number): void {
    const frequency = effect.frequency || 440;
    const sides = Math.floor(3 + (frequency / 200) % 5); // 3-8 sides based on frequency
    const radius = 30 + progress * 40;
    const rotation = progress * Math.PI * 2;

    ctx.fillStyle = effect.color;
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 2;

    ctx.translate(effect.x, effect.y);
    ctx.rotate(rotation);

    // Draw polygon
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Inner pattern
    const innerRadius = radius * 0.5;
    ctx.globalAlpha *= 0.7;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  clear(): void {
    this.effects = [];
  }

  getEffects(): VisualEffect[] {
    return this.effects;
  }
}

export const visualEffects = new VisualEffectsEngine();
