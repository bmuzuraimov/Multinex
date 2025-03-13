import * as THREE from 'three';

export interface MeteorConfig {
  color: number;
  speed: number;
  impact: number;
  name: string;
  penetration_depth: number;
  size: number;
  trail_opacity: number;
  metalness: number;
  roughness: number;
  fade_out_duration: number;
  frequency: number;
  angle_range: { min: number; max: number };
}

export interface MeteorsReturn {
  meteors: { meteor: THREE.Mesh; config: MeteorConfig }[];
  impact_points: THREE.Vector3[];
}
