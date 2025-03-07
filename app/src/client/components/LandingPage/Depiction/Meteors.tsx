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
  frequency: number;
  angleRange: { min: number, max: number };
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
    color: 0x134fff,
    speed: 4.0,
    impact: 0.2,
    name: 'sphere',
    penetrationDepth: 3.5,
    size: 0.4,
    trailOpacity: 0.8,
    metalness: 0.7,
    roughness: 0.3,
    fadeOutDuration: 0.4,
    frequency: 3.0,
    angleRange: { min: -30, max: 30 }
  },
  { 
    color: 0x05c49b,
    speed: 2.8,
    impact: 0.5,
    name: 'cube',
    penetrationDepth: 1.5,
    size: 0.7,
    trailOpacity: 0.9,
    metalness: 0.85,
    roughness: 0.15,
    fadeOutDuration: 0.8,
    frequency: 1.5,
    angleRange: { min: 30, max: 150 }
  },
  { 
    color: 0xD34053,
    speed: 1.8,
    impact: 1.0,
    name: 'triangle',
    penetrationDepth: 0,
    size: 1.0,
    trailOpacity: 1.0,
    metalness: 1.0,
    roughness: 0.1,
    fadeOutDuration: 1.2,
    frequency: 0.8,
    angleRange: { min: 150, max: 270 }
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
    // Create multiple instances of each meteor type based on frequency
    const meteors: { meteor: THREE.Mesh, config: MeteorConfig }[] = [];
    
    meteorConfigs.forEach((config) => {
      // Number of meteor instances based on frequency
      const instanceCount = Math.max(1, Math.round(config.frequency * 3));
      
      for (let i = 0; i < instanceCount; i++) {
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
        
        // Add random rotation to make each meteor unique
        meteor.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

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
        
        // Position meteor based on its angle range
        const angleRange = config.angleRange.max - config.angleRange.min;
        const angle = (config.angleRange.min + (Math.random() * angleRange)) * (Math.PI / 180);
        const distance = 25 + (Math.random() * 10); // Vary the starting distance
        
        meteor.position.set(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance,
          (Math.random() - 0.5) * 10
        );
        
        // Store the direction vector for animation
        const direction = new THREE.Vector3(0, 0, 0).sub(meteor.position).normalize();
        (meteor as any).direction = direction;
        
        // Rotate the meteor to face the center
        meteor.lookAt(0, 0, 0);
        
        scene.add(meteor);
        meteors.push({ meteor, config });
      }
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
  console.log(`Animating meteors for active index: ${activeIndex}`);
  
  const flashMaterials = new Map<number, THREE.MeshBasicMaterial>();
  const flashMesh = new THREE.Mesh(SHARED_FLASH_GEOMETRY);

  // Clear any existing animations
  meteors.forEach(({ meteor }) => {
    gsap.killTweensOf(meteor.position);
    gsap.killTweensOf(meteor.rotation);
    const trail = (meteor as any).trail;
    if (trail) {
      // Reset trail
      const positions = trail.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = 0;
      }
      trail.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Filter meteors based on activeIndex
  const filteredMeteors = meteors.filter(({ config }) => {
    if (activeIndex === 0) return config.name === 'triangle';
    if (activeIndex === 1) return config.name === 'cube';
    if (activeIndex === 2) return config.name === 'sphere';
    return true; // Show all if activeIndex is out of range
  });
  
  console.log(`Showing ${filteredMeteors.length} meteors of type: ${filteredMeteors.map(m => m.config.name).join(', ')}`);

  // Hide all meteors first with a fade out effect
  meteors.forEach(({ meteor }) => {
    const trail = (meteor as any).trail;
    
    // If this meteor should be hidden
    if (!filteredMeteors.some(m => m.meteor === meteor)) {
      // Fade out meteor that shouldn't be visible
      gsap.to(meteor, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          meteor.visible = false;
        }
      });
      
      // Fade out trail
      if (trail) {
        gsap.to(trail.material, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            trail.visible = false;
          }
        });
      }
    } else {
      // Ensure meteor is visible and reset position
      meteor.visible = true;
      
      // Position meteor based on its angle range
      const config = (meteor as any).config;
      const angleRange = config.angleRange.max - config.angleRange.min;
      const angle = (config.angleRange.min + (Math.random() * angleRange)) * (Math.PI / 180);
      const distance = 25 + (Math.random() * 10); // Vary the starting distance
      
      meteor.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        (Math.random() - 0.5) * 10
      );
      
      // Update direction vector
      const direction = new THREE.Vector3(0, 0, 0).sub(meteor.position).normalize();
      (meteor as any).direction = direction;
      
      // Rotate the meteor to face the center
      meteor.lookAt(0, 0, 0);
      
      // Add random rotation to make each meteor unique
      meteor.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Reset opacity
      gsap.to(meteor, {
        opacity: 1,
        duration: 0.5
      });
      
      if (trail) {
        trail.visible = true;
        gsap.to(trail.material, {
          opacity: (meteor as any).config?.trailOpacity || 0.8,
          duration: 0.5
        });
      }
    }
  });

  // Show and animate only the filtered meteors
  filteredMeteors.forEach(({ meteor, config }, index) => {
    const trail = (meteor as any).trail;
    const originalPosition = meteor.position.clone();
    const direction = (meteor as any).direction || new THREE.Vector3(0, 0, 0).sub(meteor.position).normalize();
    
    // Calculate delay based on frequency (higher frequency = shorter delays)
    // Use a base delay and divide by frequency to get shorter delays for higher frequency
    const baseDelay = 4.0;
    const frequencyFactor = config.frequency;
    const randomOffset = Math.random() * (baseDelay / frequencyFactor); // Add some randomness
    
    // Stagger the animations based on index and frequency
    const staggerDelay = (index % Math.ceil(frequencyFactor)) * (baseDelay / frequencyFactor) + randomOffset;
    
    // Animate rotation
    gsap.to(meteor.rotation, {
      x: Math.random() * Math.PI * 4,
      y: Math.random() * Math.PI * 4,
      z: Math.random() * Math.PI * 4,
      duration: config.speed * 1.5,
      delay: staggerDelay,
      repeat: -1,
      ease: "none"
    });
    
    // Animate position
    gsap.to(meteor.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: config.speed,
      delay: staggerDelay,
      repeat: -1,
      repeatDelay: baseDelay / frequencyFactor, // Shorter repeat delay for higher frequency
      ease: "power2.in",
      onUpdate: () => {
        if (!trail) return;
        
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
        // Reset position based on angle range
        const angleRange = config.angleRange.max - config.angleRange.min;
        const angle = (config.angleRange.min + (Math.random() * angleRange)) * (Math.PI / 180);
        const distance = 25 + (Math.random() * 10);
        
        meteor.position.set(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance,
          (Math.random() - 0.5) * 10
        );
        
        // Update direction vector
        const direction = new THREE.Vector3(0, 0, 0).sub(meteor.position).normalize();
        (meteor as any).direction = direction;
        
        // Rotate the meteor to face the center
        meteor.lookAt(0, 0, 0);
        
        // Add random rotation
        meteor.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
      }
    });
  });
};