import * as THREE from 'three';
import { MeteorConfig } from '../types/animation';
// index
export const MOBILE_BREAKPOINT = 768;
export const SECTION_CHECK_INTERVAL = 100;
export const SECTION_THRESHOLD = 0.6;
export const SECTION_ROOT_MARGIN = '-10% 0px';
export const OBSERVER_THRESHOLD = 0.1;

// BrainSphere
export const SPHERE_GEOMETRY = new THREE.IcosahedronGeometry(5, 4); // Reduced detail level
export const SYNAPSE_GEOMETRY = new THREE.BufferGeometry();
export const SYNAPSE_MATERIAL = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  linewidth: 1
});

export const TEMP_VERTEX = new THREE.Vector3();
export const TEMP_COLOR = new THREE.Color();

export const SYNAPSE_COUNT = 100;
export const SPHERE_RADIUS = 5;
export const NOISE_FACTOR = 0.4;
export const WAVE_FACTOR = 0.2;
export const SYNAPSE_BRANCH_OFFSET = 3;


export const ROTATION_SPEED_X = 0.0008;
export const ROTATION_SPEED_Y = 0.0012;
export const SYNAPSE_SPEED_Y = 0.0003;
export const SYNAPSE_SPEED_Z = 0.0002;
export const BREATHE_AMPLITUDE = 0.03;
export const BREATHE_FREQUENCY = 1.5;
export const EMISSIVE_BASE = 0.7;
export const EMISSIVE_AMPLITUDE = 0.3;
export const OPACITY_BASE = 0.95;
export const OPACITY_AMPLITUDE = 0.05;


// Meteors
// Reuse geometries and materials across meteors
export const SHARED_SPHERE_GEOMETRY = new THREE.SphereGeometry(0.5, 32, 32);
export const SHARED_CUBE_GEOMETRY = new THREE.BoxGeometry(0.8, 0.8, 0.8);
export const SHARED_TRIANGLE_GEOMETRY = new THREE.ConeGeometry(0.5, 1, 3);
export const SHARED_FLASH_GEOMETRY = new THREE.SphereGeometry(1, 16, 16);

// Reusable materials
export const SHARED_METEOR_MATERIALS = new Map<number, THREE.MeshPhysicalMaterial>();
export const SHARED_TRAIL_MATERIALS = new Map<number, THREE.LineBasicMaterial>();



export const METEOR_CONFIGS: MeteorConfig[] = [
  { 
    color: 0x134fff,
    speed: 4.0,
    impact: 0.2,
    name: 'sphere',
    penetration_depth: 3.5,
    size: 0.4,
    trail_opacity: 0.8,
    metalness: 0.7,
    roughness: 0.3,
    fade_out_duration: 0.4,
    frequency: 3.0,
    angle_range: { min: -30, max: 30 }
  },
  { 
    color: 0x05c49b,
    speed: 2.8,
    impact: 0.5,
    name: 'cube',
    penetration_depth: 1.5,
    size: 0.7,
    trail_opacity: 0.9,
    metalness: 0.85,
    roughness: 0.15,
    fade_out_duration: 0.8,
    frequency: 1.5,
    angle_range: { min: 30, max: 150 }
  },
  { 
    color: 0xD34053,
    speed: 1.8,
    impact: 1.0,
    name: 'triangle',
    penetration_depth: 0,
    size: 1.0,
    trail_opacity: 1.0,
    metalness: 1.0,
    roughness: 0.1,
    fade_out_duration: 1.2,
    frequency: 0.8,
    angle_range: { min: 150, max: 270 }
  },
];

export const BASE_DELAY = 4.0;
export const TEMP_NORMAL = new THREE.Vector3();