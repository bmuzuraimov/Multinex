import * as THREE from 'three';
import { gsap } from 'gsap';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

interface MeteorConfig {
  color: number;
  speed: number;
  impact: number;
  name: string;
  penetrationDepth: number;
  size: number;
  trailOpacity: number;
  metalness: number;
  roughness: number;
  fadeOutDuration: number;
}

// Reuse text geometries and materials across meteors
let SHARED_TEXT_GEOMETRIES: {[key: string]: THREE.BufferGeometry} = {};
const SHARED_FLASH_GEOMETRY = new THREE.SphereGeometry(1, 16, 16);

// Reusable materials
const SHARED_METEOR_MATERIALS = new Map<number, THREE.MeshPhysicalMaterial>();
const SHARED_TRAIL_MATERIALS = new Map<number, THREE.LineBasicMaterial>();

export const meteorConfigs: MeteorConfig[] = [
  { 
    color: 0xff4444,
    speed: 4.0,
    impact: 0.2,
    name: 'See & Hear',
    penetrationDepth: 3.5,
    size: 0.4,
    trailOpacity: 0.4,
    metalness: 0.7,
    roughness: 0.3,
    fadeOutDuration: 0.4
  },
  { 
    color: 0x44ff44,
    speed: 2.8,
    impact: 0.5,
    name: 'Type',
    penetrationDepth: 1.5,
    size: 0.7,
    trailOpacity: 0.6,
    metalness: 0.85,
    roughness: 0.15,
    fadeOutDuration: 0.8
  },
  { 
    color: 0x4444ff,
    speed: 1.8,
    impact: 1.0,
    name: 'Take Notes',
    penetrationDepth: 0,
    size: 1.0,
    trailOpacity: 0.8,
    metalness: 1.0,
    roughness: 0.1,
    fadeOutDuration: 1.2
  },
];

// Reusable vectors for calculations
const tempVector = new THREE.Vector3();
const tempVertex = new THREE.Vector3();
const tempNormal = new THREE.Vector3();

interface MeteorsReturn {
  meteors: { meteor: THREE.Mesh, config: MeteorConfig }[];
  impactPoints: THREE.Vector3[];
}

export const createMeteors = (scene: THREE.Scene): Promise<MeteorsReturn> => {
  const impactPoints: THREE.Vector3[] = [];
  const fontLoader = new FontLoader();

  // Load font first
  return new Promise((resolve) => {
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      meteorConfigs.forEach(config => {
        if (!SHARED_TEXT_GEOMETRIES[config.name]) {
          SHARED_TEXT_GEOMETRIES[config.name] = new TextGeometry(config.name, {
            font: font,
            size: 0.6,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 3
          });
          SHARED_TEXT_GEOMETRIES[config.name].center();
        }
      });

      const meteors = meteorConfigs.map((config, index) => {
        let meteorMaterial = SHARED_METEOR_MATERIALS.get(config.color);
        if (!meteorMaterial) {
          meteorMaterial = new THREE.MeshPhysicalMaterial({
            color: config.color,
            emissive: config.color,
            emissiveIntensity: 1,
            metalness: config.metalness,
            roughness: config.roughness,
            clearcoat: 1.0
          });
          SHARED_METEOR_MATERIALS.set(config.color, meteorMaterial);
        }

        const meteor = new THREE.Mesh(SHARED_TEXT_GEOMETRIES[config.name], meteorMaterial);
        meteor.scale.setScalar(config.size);

        const trailLength = Math.floor(20 + (config.impact * 20));
        const trailGeometry = new THREE.BufferGeometry();
        
        let trailMaterial = SHARED_TRAIL_MATERIALS.get(config.color);
        if (!trailMaterial) {
          trailMaterial = new THREE.LineBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: config.trailOpacity,
            blending: THREE.AdditiveBlending
          });
          SHARED_TRAIL_MATERIALS.set(config.color, trailMaterial);
        }

        const trailPoints = new Float32Array(trailLength * 3);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPoints, 3));
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(trail);
        
        (meteor as any).trail = trail;
        
        const angle = (index * Math.PI * 2) / meteorConfigs.length;
        meteor.position.set(
          Math.cos(angle) * 25,
          Math.sin(angle) * 25,
          (Math.random() - 0.5) * 10
        );
        scene.add(meteor);
        return { meteor, config };
      });

      resolve({ meteors, impactPoints });
    });
  });
};

export const animateMeteors = (
  meteors: { meteor: THREE.Mesh, config: MeteorConfig }[], 
  scene: THREE.Scene,
  sphere: THREE.Mesh,
  impactPoints: THREE.Vector3[]
) => {
  const flashMaterials = new Map<number, THREE.MeshBasicMaterial>();
  const flashMesh = new THREE.Mesh(SHARED_FLASH_GEOMETRY);

  meteors.forEach(({ meteor, config }, index) => {
    const trail = (meteor as any).trail;
    const originalPosition = meteor.position.clone();
    
    gsap.to(meteor.position, {
      x: config.penetrationDepth * Math.sign(meteor.position.x),
      y: config.penetrationDepth * Math.sign(meteor.position.y),
      z: config.penetrationDepth * Math.sign(meteor.position.z),
      duration: config.speed,
      delay: index * 1.2,
      repeat: -1,
      repeatDelay: 4,
      ease: "power2.in",
      onUpdate: () => {
        const positions = trail.geometry.attributes.position.array;
        positions.copyWithin(3, 0, positions.length - 3);
        positions[0] = meteor.position.x;
        positions[1] = meteor.position.y;
        positions[2] = meteor.position.z;
        trail.geometry.attributes.position.needsUpdate = true;

        const distance = meteor.position.length();
        if (distance <= 5.5 && distance > config.penetrationDepth) {
          impactPoints.push(meteor.position.clone().normalize().multiplyScalar(5));
          
          let flashMaterial = flashMaterials.get(config.color);
          if (!flashMaterial) {
            flashMaterial = new THREE.MeshBasicMaterial({
              color: config.color,
              transparent: true,
              opacity: 1,
              blending: THREE.AdditiveBlending
            });
            flashMaterials.set(config.color, flashMaterial);
          }

          flashMesh.material = flashMaterial;
          flashMesh.position.copy(meteor.position);
          flashMesh.scale.set(1, 1, 1);
          scene.add(flashMesh);
          
          gsap.to(flashMesh.scale, {
            x: 5 * config.impact,
            y: 5 * config.impact,
            z: 5 * config.impact,
            duration: config.fadeOutDuration,
            ease: "expo.out",
            onComplete: () => {
              scene.remove(flashMesh);
            },
          });
          gsap.to(flashMaterial, {
            opacity: 0,
            duration: config.fadeOutDuration,
            onComplete: () => {
              flashMaterial!.opacity = 1;
            }
          });
          
          const positionAttribute = sphere.geometry.getAttribute('position');
          const positions = positionAttribute.array;
          tempNormal.copy(meteor.position).normalize();
          
          for (let i = 0; i < positions.length; i += 9) {
            for (let j = 0; j < 9; j += 3) {
              tempVertex.set(positions[i + j], positions[i + j + 1], positions[i + j + 2]);
              const vertexNormal = tempVertex.clone().normalize();
              const angleDiff = tempNormal.angleTo(vertexNormal);
              
              if (angleDiff < Math.PI / 3) {
                const scale = 1 + (Math.PI / 3 - angleDiff) * 0.5 * config.impact;
                tempVertex.multiplyScalar(scale);
                positions[i + j] = tempVertex.x;
                positions[i + j + 1] = tempVertex.y;
                positions[i + j + 2] = tempVertex.z;
              }
            }
          }
          positionAttribute.needsUpdate = true;
        }
      },
      onComplete: () => {
        meteor.position.copy(originalPosition);
      }
    });
  });
};