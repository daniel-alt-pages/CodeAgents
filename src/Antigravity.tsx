import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Antigravity particle effect — replicates the Google Antigravity auth page:
 *   • Small capsule/dash shapes with random rotation
 *   • Color gradient by horizontal position: blue → purple → red
 *   • Gentle ambient floating (no aggressive magnetic ring)
 *   • Subtle mouse repulsion for interactivity
 */

interface AntigravityProps {
  count?: number;
  driftAmount?: number;
  driftSpeed?: number;
  particleSize?: number;
  mouseRadius?: number;
  mouseStrength?: number;
  colorLeft?: string;
  colorCenter?: string;
  colorRight?: string;
}

const AntigravityInner: React.FC<AntigravityProps> = ({
  count = 350,
  driftAmount = 2,
  driftSpeed = 0.3,
  particleSize = 0.08,
  mouseRadius = 4,
  mouseStrength = 2,
  colorLeft = '#4285F4',
  colorCenter = '#7B61FF',
  colorRight = '#EA4335',
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const virtualMouse = useRef({ x: 9999, y: 9999 });
  const colorsApplied = useRef(false);

  const cLeft = useMemo(() => new THREE.Color(colorLeft), [colorLeft]);
  const cCenter = useMemo(() => new THREE.Color(colorCenter), [colorCenter]);
  const cRight = useMemo(() => new THREE.Color(colorRight), [colorRight]);

  const particles = useMemo(() => {
    const temp = [];
    const w = viewport.width || 40;
    const h = viewport.height || 30;

    for (let i = 0; i < count; i++) {
      const homeX = (Math.random() - 0.5) * w * 1.15;
      const homeY = (Math.random() - 0.5) * h * 1.15;
      const homeZ = (Math.random() - 0.5) * 6;

      const phaseX = Math.random() * Math.PI * 2;
      const phaseY = Math.random() * Math.PI * 2;
      const speedMult = 0.5 + Math.random() * 1.0;

      const rotZ = Math.random() * Math.PI * 2;
      const rotX = (Math.random() - 0.5) * 0.6;
      const scale = 0.5 + Math.random() * 1.0;

      temp.push({
        homeX, homeY, homeZ,
        phaseX, phaseY, speedMult,
        rotZ, rotX, scale,
        cx: homeX, cy: homeY, cz: homeZ,
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Apply colors once after mesh is ready
    if (!colorsApplied.current) {
      const w = viewport.width || 40;
      const tmpColor = new THREE.Color();

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        let t = (p.homeX / (w * 0.55)) + 0.5;
        t = Math.max(0, Math.min(1, t));

        if (t < 0.5) {
          tmpColor.copy(cLeft).lerp(cCenter, t / 0.5);
        } else {
          tmpColor.copy(cCenter).lerp(cRight, (t - 0.5) / 0.5);
        }

        mesh.setColorAt(i, tmpColor);
      }

      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
      colorsApplied.current = true;
    }

    const { viewport: v, pointer: m } = state;
    const time = state.clock.getElapsedTime();

    const mouseWorldX = (m.x * v.width) / 2;
    const mouseWorldY = (m.y * v.height) / 2;

    virtualMouse.current.x += (mouseWorldX - virtualMouse.current.x) * 0.08;
    virtualMouse.current.y += (mouseWorldY - virtualMouse.current.y) * 0.08;

    const mx = virtualMouse.current.x;
    const my = virtualMouse.current.y;

    particles.forEach((p, i) => {
      const driftX = Math.sin(time * driftSpeed * p.speedMult + p.phaseX) * driftAmount;
      const driftY = Math.cos(time * driftSpeed * 0.7 * p.speedMult + p.phaseY) * driftAmount;
      const driftZ = Math.sin(time * driftSpeed * 0.3 + p.phaseX + p.phaseY) * (driftAmount * 0.3);

      let targetX = p.homeX + driftX;
      let targetY = p.homeY + driftY;
      let targetZ = p.homeZ + driftZ;

      const dx = targetX - mx;
      const dy = targetY - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius && dist > 0.01) {
        const force = (1 - dist / mouseRadius) * mouseStrength;
        const angle = Math.atan2(dy, dx);
        targetX += Math.cos(angle) * force;
        targetY += Math.sin(angle) * force;
      }

      p.cx += (targetX - p.cx) * 0.04;
      p.cy += (targetY - p.cy) * 0.04;
      p.cz += (targetZ - p.cz) * 0.04;

      dummy.position.set(p.cx, p.cy, p.cz);
      dummy.rotation.set(p.rotX, 0, p.rotZ);

      const s = p.scale * particleSize;
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[0.3, 1.2, 2, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

const Antigravity: React.FC<AntigravityProps> = (props) => {
  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
      <AntigravityInner {...props} />
    </Canvas>
  );
};

export default Antigravity;
