import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Compass, Sparkles, Rotate3d, Layers } from 'lucide-react';

interface SpecialtyTrack {
  id: string;
  title: string;
  specialty: 'Neurosurgery' | 'Neurology' | 'Heritage';
  desc: string;
  focusAngle: { x: number; y: number };
  accentColor: string;
}

const specialtyTracks: SpecialtyTrack[] = [
  {
    id: 'skullbase',
    title: 'Skull Base & Cranial Corridors',
    specialty: 'Neurosurgery',
    desc: 'Complex endoscopic transsphenoidal corridors, microvascular decompression, and acoustic neuroma microsurgery.',
    focusAngle: { x: 0.2, y: -0.6 },
    accentColor: '#D49B00'
  },
  {
    id: 'stroke',
    title: 'Hyperacute Stroke & Thrombectomy',
    specialty: 'Neurology',
    desc: 'Mechanical thrombectomy windows, telestroke network protocols, and neuro-critical hyperacute pathways.',
    focusAngle: { x: -0.1, y: 0.8 },
    accentColor: '#003399'
  },
  {
    id: 'spine',
    title: 'Complex Spine & Robotic Navigation',
    specialty: 'Neurosurgery',
    desc: 'Minimally invasive spinal stabilization, navigation-guided pedicle screw fixation, and cervical deformity correction.',
    focusAngle: { x: 0.5, y: 0.0 },
    accentColor: '#D49B00'
  },
  {
    id: 'epilepsy',
    title: 'Epilepsy & Stereo-EEG Electrophysiology',
    specialty: 'Neurology',
    desc: 'Advanced robotic stereo-EEG trajectories, radiofrequency ablation, and responsive neuromodulation (RNS).',
    focusAngle: { x: -0.3, y: -0.4 },
    accentColor: '#003399'
  },
  {
    id: 'begumpet',
    title: 'Begumpet Airport Conclave Hub',
    specialty: 'Heritage',
    desc: 'Historic aviation terminal venue convergence at Rajeev Gandhi Terminal, Hyderabad.',
    focusAngle: { x: 0.0, y: 0.0 },
    accentColor: '#D49B00'
  }
];

export const NeuralAtlasVisual: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeTrack, setActiveTrack] = useState<SpecialtyTrack>(specialtyTracks[0]);
  const [isInteracting, setIsInteracting] = useState(false);
  const activeTrackRef = useRef(activeTrack);

  useEffect(() => {
    activeTrackRef.current = activeTrack;
  }, [activeTrack]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene Setup
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF8FAFC, 0.002);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 55);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // Master Group for 3D Brain Model
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // -------------------------------------------------------------
    // GENERATE ANATOMICAL 3D NEURAL CORTEX POINT CLOUD
    // Two hemispheres + cerebellum + golden brainstem matching logo
    // -------------------------------------------------------------
    const pointCount = 1800;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const sizes = new Float32Array(pointCount);

    const royalBlue = new THREE.Color(0x002496);
    const cobaltBlue = new THREE.Color(0x123EBF);
    const deepBlue = new THREE.Color(0x04123E);
    const goldColor = new THREE.Color(0xE5A108);
    const brightGold = new THREE.Color(0xF5B800);

    let idx = 0;

    for (let i = 0; i < pointCount; i++) {
      let x = 0, y = 0, z = 0;
      let isBrainstem = false;
      let isCerebellum = false;

      const sectionRand = Math.random();

      if (sectionRand < 0.15) {
        // Brainstem (golden core matching the logo's glowing brainstem)
        isBrainstem = true;
        const t = Math.random();
        const angle = Math.random() * Math.PI * 2;
        const radius = (1.2 + Math.random() * 1.8) * (1 - t * 0.4);
        x = Math.cos(angle) * radius;
        y = -4 - t * 14;
        z = Math.sin(angle) * radius - 1;
      } else if (sectionRand < 0.28) {
        // Cerebellum (posterior lower lobes)
        isCerebellum = true;
        const u = Math.random() * Math.PI * 2;
        const v = (Math.random() - 0.5) * Math.PI * 0.8;
        const r = 7 + Math.random() * 3.5;
        const hemisphere = Math.random() > 0.5 ? 1 : -1;
        x = (Math.cos(u) * Math.cos(v) * r * 0.7) + (hemisphere * 4.2);
        y = (Math.sin(v) * r * 0.6) - 5;
        z = (Math.sin(u) * Math.cos(v) * r * 0.7) - 6;
      } else {
        // Cerebral Hemispheres (Left & Right Cortex with sulci indentations)
        const hemisphere = Math.random() > 0.5 ? 1 : -1;
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * Math.PI * 2;

        // Ellipsoidal cerebral dimensions
        const rx = 13.5;
        const ry = 11.5;
        const rz = 16.0;

        // Sulcal folding modulation function
        const sulci = Math.sin(theta * 8) * Math.cos(phi * 7) * 1.1;

        x = (Math.sin(theta) * Math.cos(phi) * (rx + sulci) * 0.85) + (hemisphere * 2.8);
        y = Math.cos(theta) * (ry + sulci) + 3;
        z = Math.sin(theta) * Math.sin(phi) * (rz + sulci) * 0.88 + 1;
      }

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      // Color assignment from Logo Palette
      if (isBrainstem) {
        // Vibrant gold core
        const chosen = Math.random() > 0.3 ? goldColor : brightGold;
        colors[idx * 3] = chosen.r;
        colors[idx * 3 + 1] = chosen.g;
        colors[idx * 3 + 2] = chosen.b;
        sizes[idx] = 2.4 + Math.random() * 2.2;
      } else if (isCerebellum) {
        const chosen = Math.random() > 0.6 ? cobaltBlue : royalBlue;
        colors[idx * 3] = chosen.r;
        colors[idx * 3 + 1] = chosen.g;
        colors[idx * 3 + 2] = chosen.b;
        sizes[idx] = 1.6 + Math.random() * 1.5;
      } else {
        // Cortex: gradient between royal cobalt blue and gold sparks
        if (Math.random() < 0.12) {
          colors[idx * 3] = goldColor.r;
          colors[idx * 3 + 1] = goldColor.g;
          colors[idx * 3 + 2] = goldColor.b;
          sizes[idx] = 2.2 + Math.random() * 1.8;
        } else {
          const chosen = Math.random() > 0.4 ? royalBlue : cobaltBlue;
          colors[idx * 3] = chosen.r;
          colors[idx * 3 + 1] = chosen.g;
          colors[idx * 3 + 2] = chosen.b;
          sizes[idx] = 1.4 + Math.random() * 1.4;
        }
      }

      idx++;
    }

    const brainGeometry = new THREE.BufferGeometry();
    brainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    brainGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular sprite texture for sharp, glowing nodes
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(229, 161, 8, 0.9)');
    gradient.addColorStop(0.6, 'rgba(0, 36, 150, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 36, 150, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    const nodeTexture = new THREE.CanvasTexture(canvas);

    const brainMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: nodeTexture,
      transparent: true,
      opacity: 0.92,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const brainPoints = new THREE.Points(brainGeometry, brainMaterial);
    brainGroup.add(brainPoints);

    // -------------------------------------------------------------
    // SYNAPTIC AXON PATHWAYS (Dynamic Line Connections)
    // -------------------------------------------------------------
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDistance = 3.6;

    for (let i = 0; i < 400; i++) {
      const p1 = Math.floor(Math.random() * pointCount);
      const x1 = positions[p1 * 3];
      const y1 = positions[p1 * 3 + 1];
      const z1 = positions[p1 * 3 + 2];

      for (let j = 0; j < 6; j++) {
        const p2 = Math.floor(Math.random() * pointCount);
        if (p1 === p2) continue;
        const x2 = positions[p2 * 3];
        const y2 = positions[p2 * 3 + 1];
        const z2 = positions[p2 * 3 + 2];

        const dist = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
        if (dist < maxDistance) {
          linePositions.push(x1, y1, z1, x2, y2, z2);
          const isGoldLine = Math.random() < 0.25;
          const col = isGoldLine ? goldColor : cobaltBlue;
          lineColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.NormalBlending
    });

    const axonLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    brainGroup.add(axonLines);

    // -------------------------------------------------------------
    // ACTION POTENTIAL FIRING SPARK (Animated traveling synapse pulse)
    // -------------------------------------------------------------
    const sparkCount = 28;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkIndices = new Int32Array(sparkCount);

    for (let k = 0; k < sparkCount; k++) {
      sparkIndices[k] = Math.floor(Math.random() * pointCount);
      sparkPos[k * 3] = positions[sparkIndices[k] * 3];
      sparkPos[k * 3 + 1] = positions[sparkIndices[k] * 3 + 1];
      sparkPos[k * 3 + 2] = positions[sparkIndices[k] * 3 + 2];
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 4.2,
      color: 0xE5A108,
      map: nodeTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    brainGroup.add(sparks);

    // -------------------------------------------------------------
    // INTERACTIVE ROTATION & MOUSE DRAGGING
    // -------------------------------------------------------------
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    // Touch support for mobile/tablet
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsInteracting(true);
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // -------------------------------------------------------------
    // ANIMATION LOOP WITH AUTO-ROTATION & FOCUS DRIFT
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when user is not actively dragging
      if (!isDragging) {
        targetRotationY += 0.004;
        // Subtle vertical floating oscillation
        brainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.8;
      }

      // Smooth interpolation to target rotation
      brainGroup.rotation.y += (targetRotationY - brainGroup.rotation.y) * 0.08;
      brainGroup.rotation.x += (targetRotationX - brainGroup.rotation.x) * 0.08;

      // Pulse synaptic sparks along random axons
      if (Math.random() < 0.2) {
        const randomSpark = Math.floor(Math.random() * sparkCount);
        const randomNode = Math.floor(Math.random() * pointCount);
        sparkPos[randomSpark * 3] = positions[randomNode * 3];
        sparkPos[randomSpark * 3 + 1] = positions[randomNode * 3 + 1];
        sparkPos[randomSpark * 3 + 2] = positions[randomNode * 3 + 2];
        sparkGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', handleResize);

      brainGeometry.dispose();
      brainMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      nodeTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      
      {/* 3D Brain & Neural Cortex Canvas Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-white via-[#FAF5ED] to-[#EBF1FA] border border-[#E5DCCB] shadow-md p-4 sm:p-5 overflow-hidden transition-all hover:border-[#003399]/40">
        
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#003399_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top 3D Control & Coordinate Bar */}
        <div className="relative z-10 flex items-center justify-between pb-3 mb-2 border-b border-[#E5DCCB] text-xs">
          <div className="flex items-center gap-2 text-[#003399] font-medium tracking-wider uppercase text-[11px]">
            <Rotate3d className="w-3.5 h-3.5 text-[#D49B00]" />
            <span className="font-bold">3D Neural Cortex Simulation</span>
          </div>
          <span className="text-[#003399] font-manrope font-semibold text-[11px] tracking-wider px-2 py-0.5 rounded bg-white border border-[#E5DCCB] shadow-xs">
            Interactive 360° • Drag to Orbit
          </span>
        </div>

        {/* Interactive 3D WebGL Canvas Viewport */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-radial from-white via-[#FAF5ED] to-[#EBF1FA] border border-[#E5DCCB]">
          
          <div ref={mountRef} className="w-full h-full" />

          {/* Interactive Specialty Selector Pills (Overlaying the 3D space) */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-20 pointer-events-auto">
            {specialtyTracks.slice(0, 4).map((track) => {
              const isSelected = activeTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setActiveTrack(track)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#003399] text-white shadow-xs'
                      : 'bg-white/80 hover:bg-white text-[#556070] hover:text-[#003399] border border-[#E5DCCB] backdrop-blur-xs'
                  }`}
                >
                  {track.title.split('&')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Dynamic Action Potential Detail Card */}
          <AnimatePresence mode="wait">
            {activeTrack && (
              <motion.div
                key={activeTrack.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md border border-[#E5DCCB] rounded-xl p-3 sm:p-3.5 text-left z-30 shadow-md"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        activeTrack.specialty === 'Neurosurgery'
                          ? 'bg-[#D49B00] text-white'
                          : activeTrack.specialty === 'Neurology'
                          ? 'bg-[#003399] text-white'
                          : 'bg-[#001A4D] text-white'
                      }`}
                    >
                      {activeTrack.specialty}
                    </span>
                    <h5 className="font-serif-display text-[#003399] font-bold text-sm sm:text-base leading-tight">
                      {activeTrack.title}
                    </h5>
                  </div>
                  <span className="text-[10px] text-[#D49B00] font-manrope font-semibold whitespace-nowrap">
                    Live 3D Track
                  </span>
                </div>
                <p className="text-xs text-[#182230]/90 leading-relaxed">
                  {activeTrack.desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint Overlay (Fades out when interacting) */}
          {!isInteracting && (
            <div className="absolute top-12 right-3 pointer-events-none text-[10px] text-[#556070] bg-white/80 px-2 py-0.5 rounded-full border border-[#E5DCCB] backdrop-blur-xs animate-pulse">
              Drag to explore 3D
            </div>
          )}

        </div>

        {/* Live EEG Pulse Waveform (Matching Logo Waveform) */}
        <div className="mt-3 pt-2.5 border-t border-[#E5DCCB] flex items-center justify-between text-[11px] text-[#556070]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D49B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#003399]" />
            </span>
            <span className="font-semibold text-[#003399]">Synaptic EEG Signal</span>
          </div>

          {/* SVG Animated Pulse Line matching Logo */}
          <div className="w-36 h-5 overflow-hidden flex items-center">
            <svg viewBox="0 0 140 20" className="w-full h-full text-[#003399]" fill="none">
              <path
                d="M0,10 L30,10 L38,3 L46,17 L54,5 L62,10 L80,10 L88,2 L96,18 L104,7 L112,10 L140,10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[dash_3s_linear_infinite]"
              />
            </svg>
          </div>

          <span className="font-manrope font-bold text-[#D49B00] text-[11px]">
            IST • HYD
          </span>
        </div>

      </div>
    </div>
  );
};
