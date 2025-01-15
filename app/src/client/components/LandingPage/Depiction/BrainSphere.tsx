import * as THREE from 'three';

// Reusable geometries and materials
const SPHERE_GEOMETRY = new THREE.IcosahedronGeometry(5, 4); // Reduced detail level
const SYNAPSE_GEOMETRY = new THREE.BufferGeometry();
const SYNAPSE_MATERIAL = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  linewidth: 1
});

// Reusable vectors for calculations
const tempVertex = new THREE.Vector3();
const tempColor = new THREE.Color();

export const createBrainSphere = (scene: THREE.Scene) => {
  // Modify geometry once during creation
  const positionAttribute = SPHERE_GEOMETRY.getAttribute('position');
  const positions = positionAttribute.array;
  for (let i = 0; i < positions.length; i += 3) {
    tempVertex.set(positions[i], positions[i + 1], positions[i + 2]);
    const noise = (Math.random() - 0.5) * 0.4;
    const wave = Math.sin(tempVertex.x * 2) * Math.cos(tempVertex.y * 2) * 0.2;
    tempVertex.normalize().multiplyScalar(5 + noise + wave);
    positions[i] = tempVertex.x;
    positions[i + 1] = tempVertex.y;
    positions[i + 2] = tempVertex.z;
  }
  positionAttribute.needsUpdate = true;

  const sphereMaterial = new THREE.MeshPhysicalMaterial({
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
    side: THREE.DoubleSide
  });
  
  const sphere = new THREE.Mesh(SPHERE_GEOMETRY, sphereMaterial);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  // Optimize synapse creation
  const synapseCount = 100; // Reduced count
  const synapseVertices = new Float32Array(synapseCount * 6); // Pre-allocate arrays
  const synapseColors = new Float32Array(synapseCount * 6);
  
  for (let i = 0, offset = 0; i < synapseCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 5 + (Math.random() - 0.5) * 0.5;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    // Single branch per synapse
    const offset2 = new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3
    );

    synapseVertices[offset] = x;
    synapseVertices[offset + 1] = y;
    synapseVertices[offset + 2] = z;
    synapseVertices[offset + 3] = x + offset2.x;
    synapseVertices[offset + 4] = y + offset2.y;
    synapseVertices[offset + 5] = z + offset2.z;

    tempColor.setHSL(0.9, 0.8, 0.6);
    synapseColors[offset] = tempColor.r;
    synapseColors[offset + 1] = tempColor.g;
    synapseColors[offset + 2] = tempColor.b;
    synapseColors[offset + 3] = tempColor.r;
    synapseColors[offset + 4] = tempColor.g;
    synapseColors[offset + 5] = tempColor.b;

    offset += 6;
  }
  
  SYNAPSE_GEOMETRY.setAttribute('position', new THREE.BufferAttribute(synapseVertices, 3));
  SYNAPSE_GEOMETRY.setAttribute('color', new THREE.BufferAttribute(synapseColors, 3));
  
  const synapses = new THREE.LineSegments(SYNAPSE_GEOMETRY, SYNAPSE_MATERIAL);
  sphere.add(synapses);

  return { sphere, sphereMaterial, synapses };
};

// Cache time multipliers
const ROTATION_X = 0.0008;
const ROTATION_Y = 0.0012;
const SYNAPSE_Y = 0.0003;
const SYNAPSE_Z = 0.0002;

export const animateBrainSphere = (
  sphere: THREE.Mesh,
  sphereMaterial: THREE.MeshPhysicalMaterial,
  synapses: THREE.LineSegments
) => {
  const time = Date.now() * 0.001;
  
  sphere.rotation.x += ROTATION_X;
  sphere.rotation.y += ROTATION_Y;
  
  const breathe = 1 + Math.sin(time * 1.5) * 0.03;
  sphere.scale.setScalar(breathe);
  
  synapses.rotation.y += SYNAPSE_Y * Math.sin(time * 0.5);
  synapses.rotation.z += SYNAPSE_Z * Math.cos(time * 0.3);
  
  sphereMaterial.emissiveIntensity = 0.7 + Math.sin(time * 2.5) * 0.3;
  sphereMaterial.opacity = 0.95 + Math.sin(time * 2) * 0.05;
};