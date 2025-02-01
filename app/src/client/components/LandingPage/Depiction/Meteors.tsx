import * as THREE from 'three';
import { gsap } from 'gsap';

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

// Reuse geometries and materials across meteors
const SHARED_SPHERE_GEOMETRY = new THREE.SphereGeometry(0.5, 32, 32);
const SHARED_CUBE_GEOMETRY = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const SHARED_TRIANGLE_GEOMETRY = new THREE.ConeGeometry(0.5, 1, 3);
const SHARED_FLASH_GEOMETRY = new THREE.SphereGeometry(1, 16, 16);

// Reusable materials
const SHARED_METEOR_MATERIALS = new Map<number, THREE.MeshPhysicalMaterial>();
const SHARED_TRAIL_MATERIALS = new Map<number, THREE.LineBasicMaterial>();

export const meteorConfigs: MeteorConfig[] = [
  { 
    color: 0xff4444,
    speed: 4.0,
    impact: 0.2,
    name: 'sphere',
    penetrationDepth: 3.5,
    size: 0.4,
    trailOpacity: 0.8,
    metalness: 0.7,
    roughness: 0.3,
    fadeOutDuration: 0.4
  },
  { 
    color: 0x44ff44,
    speed: 2.8,
    impact: 0.5,
    name: 'cube',
    penetrationDepth: 1.5,
    size: 0.7,
    trailOpacity: 0.9,
    metalness: 0.85,
    roughness: 0.15,
    fadeOutDuration: 0.8
  },
  { 
    color: 0x4444ff,
    speed: 1.8,
    impact: 1.0,
    name: 'triangle',
    penetrationDepth: 0,
    size: 1.0,
    trailOpacity: 1.0,
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

  return new Promise((resolve) => {
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

      let geometry;
      switch(config.name) {
        case 'sphere':
          geometry = SHARED_SPHERE_GEOMETRY;
          break;
        case 'cube':
          geometry = SHARED_CUBE_GEOMETRY;
          break;
        case 'triangle':
          geometry = SHARED_TRIANGLE_GEOMETRY;
          break;
        default:
          geometry = SHARED_SPHERE_GEOMETRY;
      }

      const meteor = new THREE.Mesh(geometry, meteorMaterial);
      meteor.scale.setScalar(config.size);

      const trailLength = Math.floor(40 + (config.impact * 40));
      const trailGeometry = new THREE.BufferGeometry();
      
      let trailMaterial = SHARED_TRAIL_MATERIALS.get(config.color);
      if (!trailMaterial) {
        trailMaterial = new THREE.LineBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: config.trailOpacity,
          blending: THREE.AdditiveBlending,
          linewidth: 2
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
};

export const animateMeteors = (
  meteors: { meteor: THREE.Mesh, config: MeteorConfig }[], 
  scene: THREE.Scene,
  sphere: THREE.Mesh,
  impactPoints: THREE.Vector3[],
  activeIndex: number
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
              
              if (angleDiff < Math.PI / 6) {
                const scale = 1 + (Math.PI / 6 - angleDiff) * 0.1 * config.impact;
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