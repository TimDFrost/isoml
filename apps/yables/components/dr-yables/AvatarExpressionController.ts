import type { DrYablesEmotion } from "@ohya/ai";

export type FaceExpression = {
  eyeScaleY: number;
  browLift: number;
  mouthOpen: number;
  antennaGlow: number;
  bodyBounce: number;
  headTilt: number;
};

const TABLE: Record<DrYablesEmotion, FaceExpression> = {
  idle: { eyeScaleY: 1, browLift: 0, mouthOpen: 0.08, antennaGlow: 0.1, bodyBounce: 0.04, headTilt: 0.08 },
  greeting: { eyeScaleY: 1.05, browLift: 0.08, mouthOpen: 0.2, antennaGlow: 0.35, bodyBounce: 0.06, headTilt: 0.12 },
  listening: { eyeScaleY: 1.1, browLift: 0.05, mouthOpen: 0.05, antennaGlow: 0.45, bodyBounce: 0.03, headTilt: 0.18 },
  thinking: { eyeScaleY: 0.85, browLift: 0.12, mouthOpen: 0.04, antennaGlow: 0.2, bodyBounce: 0.02, headTilt: 0.22 },
  speaking: { eyeScaleY: 1, browLift: 0.04, mouthOpen: 0.35, antennaGlow: 0.55, bodyBounce: 0.05, headTilt: 0.1 },
  amused: { eyeScaleY: 0.75, browLift: -0.04, mouthOpen: 0.28, antennaGlow: 0.4, bodyBounce: 0.08, headTilt: 0.14 },
  curious: { eyeScaleY: 1.2, browLift: 0.14, mouthOpen: 0.12, antennaGlow: 0.5, bodyBounce: 0.04, headTilt: 0.2 },
  surprised: { eyeScaleY: 1.35, browLift: 0.2, mouthOpen: 0.4, antennaGlow: 0.7, bodyBounce: 0.05, headTilt: 0.05 },
  celebrating: { eyeScaleY: 1.1, browLift: 0.1, mouthOpen: 0.32, antennaGlow: 0.85, bodyBounce: 0.12, headTilt: 0.16 },
  resting: { eyeScaleY: 0.55, browLift: -0.02, mouthOpen: 0.03, antennaGlow: 0.05, bodyBounce: 0.01, headTilt: 0.04 },
  happy: { eyeScaleY: 0.9, browLift: 0.06, mouthOpen: 0.25, antennaGlow: 0.4, bodyBounce: 0.07, headTilt: 0.12 },
};

export function expressionFor(emotion: DrYablesEmotion): FaceExpression {
  return TABLE[emotion] || TABLE.idle;
}

export function blendExpressions(
  from: FaceExpression,
  to: FaceExpression,
  t: number,
): FaceExpression {
  const k = Math.min(1, Math.max(0, t));
  return {
    eyeScaleY: from.eyeScaleY + (to.eyeScaleY - from.eyeScaleY) * k,
    browLift: from.browLift + (to.browLift - from.browLift) * k,
    mouthOpen: from.mouthOpen + (to.mouthOpen - from.mouthOpen) * k,
    antennaGlow: from.antennaGlow + (to.antennaGlow - from.antennaGlow) * k,
    bodyBounce: from.bodyBounce + (to.bodyBounce - from.bodyBounce) * k,
    headTilt: from.headTilt + (to.headTilt - from.headTilt) * k,
  };
}
