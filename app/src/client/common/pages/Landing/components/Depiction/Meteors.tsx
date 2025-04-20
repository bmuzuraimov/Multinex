import * as THREE from 'three';
import { gsap } from 'gsap';
import {
  SHARED_METEOR_MATERIALS,
  SHARED_TRAIL_MATERIALS,
  SHARED_SPHERE_GEOMETRY,
  SHARED_CUBE_GEOMETRY,
  SHARED_TRIANGLE_GEOMETRY,
  SHARED_FLASH_GEOMETRY,
  METEOR_CONFIGS,
  BASE_DELAY,
  TEMP_VERTEX,
  TEMP_NORMAL,
} from '../../../../../../shared/constants/animation';
import { MeteorsReturn, MeteorConfig } from '../../../../../../shared/types/animation';

gsap.registerPlugin();

export const createMeteors = (scene: THREE.Scene): Promise<MeteorsReturn> => {
  const impact_points: THREE.Vector3[] = [];

  return new Promise((resolve) => {
    const meteors: { meteor: THREE.Mesh; config: MeteorConfig }[] = [];

    METEOR_CONFIGS.forEach((config) => {
      const instance_count = Math.max(1, Math.round(config.frequency * 3));

      for (let i = 0; i < instance_count; i++) {
        let meteor_material = SHARED_METEOR_MATERIALS.get(config.color);
        if (!meteor_material) {
          meteor_material = new THREE.MeshPhysicalMaterial({
            color: config.color,
            emissive: config.color,
            emissiveIntensity: 1,
            metalness: config.metalness,
            roughness: config.roughness,
            clearcoat: 1.0,
          });
          SHARED_METEOR_MATERIALS.set(config.color, meteor_material);
        }

        let geometry;
        switch (config.name) {
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

        const meteor = new THREE.Mesh(geometry, meteor_material);
        meteor.scale.setScalar(config.size);

        meteor.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

        const trail_length = Math.floor(40 + config.impact * 40);
        const trail_geometry = new THREE.BufferGeometry();

        let trail_material = SHARED_TRAIL_MATERIALS.get(config.color);
        if (!trail_material) {
          trail_material = new THREE.LineBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: config.trail_opacity,
            blending: THREE.AdditiveBlending,
            linewidth: 2,
          });
          SHARED_TRAIL_MATERIALS.set(config.color, trail_material);
        }

        const trail_points = new Float32Array(trail_length * 3);
        trail_geometry.setAttribute('position', new THREE.BufferAttribute(trail_points, 3));
        const trail = new THREE.Line(trail_geometry, trail_material);
        scene.add(trail);

        (meteor as any).trail = trail;

        const angle_range = config.angle_range.max - config.angle_range.min;
        const angle = (config.angle_range.min + Math.random() * angle_range) * (Math.PI / 180);
        const distance = 25 + Math.random() * 10;

        meteor.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, (Math.random() - 0.5) * 10);

        const direction = new THREE.Vector3(0, 0, 0).sub(meteor.position).normalize();
        (meteor as any).direction = direction;

        meteor.lookAt(0, 0, 0);

        scene.add(meteor);
        meteors.push({ meteor, config });
      }
    });

    resolve({ meteors, impact_points });
  });
};

export const animateMeteors = (
  meteors: { meteor: THREE.Mesh; config: MeteorConfig }[],
  scene: THREE.Scene,
  sphere: THREE.Mesh,
  impact_points: THREE.Vector3[],
  active_index: number
) => {
  const flash_materials = new Map<number, THREE.MeshBasicMaterial>();
  const flash_mesh = new THREE.Mesh(SHARED_FLASH_GEOMETRY);

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

  // Filter meteors based on active_index
  const filtered_meteors = meteors.filter(({ config }) => {
    if (active_index === 0) return config.name === 'triangle';
    if (active_index === 1) return config.name === 'cube';
    if (active_index === 2) return config.name === 'sphere';
    return true; // Show all if active_index is out of range
  });

  // Hide all meteors first with a fade out effect
  meteors.forEach(({ meteor }) => {
    const trail = (meteor as any).trail;

    // If this meteor should be hidden
    if (!filtered_meteors.some((m) => m.meteor === meteor)) {
      // Fade out meteor that shouldn't be visible
      gsap.to(meteor, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          meteor.visible = false;
        },
      });

      // Fade out trail
      if (trail) {
        gsap.to(trail.material, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            trail.visible = false;
          },
        });
      }
    } else {
      // Ensure meteor is visible and reset position
      meteor.visible = true;

      // Position meteor based on its angle range
      const config = (meteor as any).config;
      const angle_range = config.angle_range.max - config.angle_range.min;
      const angle = (config.angle_range.min + Math.random() * angle_range) * (Math.PI / 180);
      const distance = 25 + Math.random() * 10; // Vary the starting distance

      meteor.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, (Math.random() - 0.5) * 10);

      // Update direction vector
      const direction = new THREE.Vector3(0, 0, 0).sub(meteor.position).normalize();
      (meteor as any).direction = direction;

      // Rotate the meteor to face the center
      meteor.lookAt(0, 0, 0);

      // Add random rotation to make each meteor unique
      meteor.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

      // Reset opacity
      gsap.to(meteor, {
        opacity: 1,
        duration: 0.5,
      });

      if (trail) {
        trail.visible = true;
        gsap.to(trail.material, {
          opacity: (meteor as any).config?.trail_opacity || 0.8,
          duration: 0.5,
        });
      }
    }
  });

  // Show and animate only the filtered meteors
  filtered_meteors.forEach(({ meteor, config }, index) => {
    const trail = (meteor as any).trail;
    
    const frequency_factor = config.frequency;
    const random_offset = Math.random() * (BASE_DELAY / frequency_factor);
    
    const stagger_delay = (index % Math.ceil(frequency_factor)) * (BASE_DELAY / frequency_factor) + random_offset;

    // Animate rotation
    gsap.to(meteor.rotation, {
      x: Math.random() * Math.PI * 4,
      y: Math.random() * Math.PI * 4,
      z: Math.random() * Math.PI * 4,
      duration: config.speed * 1.5,
      delay: stagger_delay,
      repeat: -1,
      ease: 'none',
    });

    // Animate position
    gsap.to(meteor.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: config.speed,
      delay: stagger_delay,
      repeat: -1,
      repeatDelay: BASE_DELAY / frequency_factor, // Shorter repeat delay for higher frequency
      ease: 'power2.in',
      onUpdate: () => {
        if (!trail) return;

        const positions = trail.geometry.attributes.position.array;
        positions.copyWithin(3, 0, positions.length - 3);
        positions[0] = meteor.position.x;
        positions[1] = meteor.position.y;
        positions[2] = meteor.position.z;
        trail.geometry.attributes.position.needsUpdate = true;

        const distance = meteor.position.length();
        if (distance <= 5.5 && distance > config.penetration_depth) {
          impact_points.push(meteor.position.clone().normalize().multiplyScalar(5));

          let flash_material = flash_materials.get(config.color);
          if (!flash_material) {
            flash_material = new THREE.MeshBasicMaterial({
              color: config.color,
              transparent: true,
              opacity: 1,
              blending: THREE.AdditiveBlending,
            });
            flash_materials.set(config.color, flash_material);
          }

          flash_mesh.material = flash_material;
          flash_mesh.position.copy(meteor.position);
          flash_mesh.scale.set(1, 1, 1);
          scene.add(flash_mesh);

          gsap.to(flash_mesh.scale, {
            x: 5 * config.impact,
            y: 5 * config.impact,
            z: 5 * config.impact,
            duration: config.fade_out_duration,
            ease: 'expo.out',
            onComplete: () => {
              scene.remove(flash_mesh);
            },
          });
          gsap.to(flash_material, {
            opacity: 0,
            duration: config.fade_out_duration,
            onComplete: () => {
              flash_material!.opacity = 1;
            },
          });

          const position_attribute = sphere.geometry.getAttribute('position');
          const positions = position_attribute.array;
          TEMP_NORMAL.copy(meteor.position).normalize();

          for (let i = 0; i < positions.length; i += 9) {
            for (let j = 0; j < 9; j += 3) {
              TEMP_VERTEX.set(positions[i + j], positions[i + j + 1], positions[i + j + 2]);
              const vertex_normal = TEMP_VERTEX.clone().normalize();
              const angle_diff = TEMP_NORMAL.angleTo(vertex_normal);

              if (angle_diff < Math.PI / 6) {
                const scale = 1 + (Math.PI / 6 - angle_diff) * 0.1 * config.impact;
                TEMP_VERTEX.multiplyScalar(scale);
                positions[i + j] = TEMP_VERTEX.x;
                positions[i + j + 1] = TEMP_VERTEX.y;
                positions[i + j + 2] = TEMP_VERTEX.z;
              }
            }
          }
          position_attribute.needsUpdate = true;
        }
      },
      onComplete: () => {
        // Reset position based on angle range
        const angle_range = config.angle_range.max - config.angle_range.min;
        const angle = (config.angle_range.min + Math.random() * angle_range) * (Math.PI / 180);
        const distance = 25 + Math.random() * 10;

        meteor.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, (Math.random() - 0.5) * 10);

        // Update direction vector
        const direction = new THREE.Vector3(0, 0, 0).sub(meteor.position).normalize();
        (meteor as any).direction = direction;

        // Rotate the meteor to face the center
        meteor.lookAt(0, 0, 0);

        // Add random rotation
        meteor.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      },
    });
  });
};
