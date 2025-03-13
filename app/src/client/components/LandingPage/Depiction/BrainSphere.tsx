import * as THREE from 'three';
import {
  SPHERE_GEOMETRY,
  SYNAPSE_GEOMETRY,
  SYNAPSE_MATERIAL,
  NOISE_FACTOR,
  SPHERE_RADIUS,
  SYNAPSE_COUNT,
  SYNAPSE_BRANCH_OFFSET,
  WAVE_FACTOR,
  ROTATION_SPEED_X,
  ROTATION_SPEED_Y,
  SYNAPSE_SPEED_Y,
  SYNAPSE_SPEED_Z,
  BREATHE_AMPLITUDE,
  BREATHE_FREQUENCY,
  EMISSIVE_BASE,
  OPACITY_BASE,
  OPACITY_AMPLITUDE,
  EMISSIVE_AMPLITUDE,
  TEMP_VERTEX,
  TEMP_COLOR
} from '../../../../shared/constants/animation';


export const createBrainSphere = (scene: THREE.Scene) => {
  const position_attribute = SPHERE_GEOMETRY.getAttribute('position');
  const positions = position_attribute.array;
  for (let i = 0; i < positions.length; i += 3) {
    TEMP_VERTEX.set(positions[i], positions[i + 1], positions[i + 2]);
    const noise = (Math.random() - 0.5) * NOISE_FACTOR;
    const wave = Math.sin(TEMP_VERTEX.x * 2) * Math.cos(TEMP_VERTEX.y * 2) * WAVE_FACTOR;
    TEMP_VERTEX.normalize().multiplyScalar(SPHERE_RADIUS + noise + wave);
    positions[i] = TEMP_VERTEX.x;
    positions[i + 1] = TEMP_VERTEX.y;
    positions[i + 2] = TEMP_VERTEX.z;
  }
  position_attribute.needsUpdate = true;

  const sphere_material = new THREE.MeshPhysicalMaterial({
    color: 0xff69b4,
    wireframe: true,
    emissive: 0xff1493,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.95,
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    wireframeLinewidth: 1.5,
    side: THREE.DoubleSide,
  });

  const sphere = new THREE.Mesh(SPHERE_GEOMETRY, sphere_material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  // Optimize synapse creation
  const synapse_vertices = new Float32Array(SYNAPSE_COUNT * 6); // Pre-allocate arrays
  const synapse_colors = new Float32Array(SYNAPSE_COUNT * 6);

  for (let i = 0, offset = 0; i < SYNAPSE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = SPHERE_RADIUS + (Math.random() - 0.5) * 0.5;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    // Single branch per synapse
    const offset2 = new THREE.Vector3(
      (Math.random() - 0.5) * SYNAPSE_BRANCH_OFFSET,
      (Math.random() - 0.5) * SYNAPSE_BRANCH_OFFSET,
      (Math.random() - 0.5) * SYNAPSE_BRANCH_OFFSET
    );

    synapse_vertices[offset] = x;
    synapse_vertices[offset + 1] = y;
    synapse_vertices[offset + 2] = z;
    synapse_vertices[offset + 3] = x + offset2.x;
    synapse_vertices[offset + 4] = y + offset2.y;
    synapse_vertices[offset + 5] = z + offset2.z;

    TEMP_COLOR.setHSL(0.9, 0.8, 0.6);
    synapse_colors[offset] = TEMP_COLOR.r;
    synapse_colors[offset + 1] = TEMP_COLOR.g;
    synapse_colors[offset + 2] = TEMP_COLOR.b;
    synapse_colors[offset + 3] = TEMP_COLOR.r;
    synapse_colors[offset + 4] = TEMP_COLOR.g;
    synapse_colors[offset + 5] = TEMP_COLOR.b;

    offset += 6;
  }

  SYNAPSE_GEOMETRY.setAttribute('position', new THREE.BufferAttribute(synapse_vertices, 3));
  SYNAPSE_GEOMETRY.setAttribute('color', new THREE.BufferAttribute(synapse_colors, 3));

  const synapses = new THREE.LineSegments(SYNAPSE_GEOMETRY, SYNAPSE_MATERIAL);
  sphere.add(synapses);

  return { sphere, sphere_material, synapses };
};

export const animateBrainSphere = (
  sphere: THREE.Mesh,
  sphere_material: THREE.MeshPhysicalMaterial,
  synapses: THREE.LineSegments
) => {
  const time = Date.now() * 0.001;

  sphere.rotation.x += ROTATION_SPEED_X;
  sphere.rotation.y += ROTATION_SPEED_Y;

  const breathe = 1 + Math.sin(time * BREATHE_FREQUENCY) * BREATHE_AMPLITUDE;
  sphere.scale.setScalar(breathe);

  synapses.rotation.y += SYNAPSE_SPEED_Y * Math.sin(time * 0.5);
  synapses.rotation.z += SYNAPSE_SPEED_Z * Math.cos(time * 0.3);

  sphere_material.emissiveIntensity = EMISSIVE_BASE + Math.sin(time * 2.5) * EMISSIVE_AMPLITUDE;
  sphere_material.opacity = OPACITY_BASE + Math.sin(time * 2) * OPACITY_AMPLITUDE;
};
