import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import TextContent from './TextContent';
import { createMeteors, animateMeteors } from './Meteors';
import { createBrainSphere, animateBrainSphere } from './BrainSphere';
import gsap from 'gsap';
import { MOBILE_BREAKPOINT, SECTION_CHECK_INTERVAL, SECTION_THRESHOLD, SECTION_ROOT_MARGIN, OBSERVER_THRESHOLD } from '../../../../shared/constants/animation';
// Register GSAP plugins
gsap.registerPlugin();



const Depiction: React.FC = () => {
  const mount_ref = useRef<HTMLDivElement>(null);
  const animation_ref = useRef<number>();
  const [active_index, setActiveIndex] = useState(0);
  const sections_ref = useRef<(HTMLElement | null)[]>([]);
  const [sections_ready, setSectionsReady] = useState(false);
  const [is_mobile, setIsMobile] = useState(false);

  // Store references to scene and meteors
  const scene_ref = useRef<THREE.Scene | null>(null);
  const meteors_ref = useRef<{ meteors: { meteor: THREE.Mesh; config: any }[]; impact_points: THREE.Vector3[] } | null>(
    null
  );
  const sphere_ref = useRef<THREE.Mesh | null>(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobileStatus = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    checkMobileStatus();
    window.addEventListener('resize', checkMobileStatus);
    return () => window.removeEventListener('resize', checkMobileStatus);
  }, []);

  // Update sections_ready when sections are available
  useEffect(() => {
    const checkSectionsStatus = () => {
      if (sections_ref.current.length > 0 && sections_ref.current.every((section) => section !== null)) {
        setSectionsReady(true);
      }
    };

    checkSectionsStatus();

    const interval_id = setInterval(() => {
      if (!sections_ready) {
        checkSectionsStatus();
      } else {
        clearInterval(interval_id);
      }
    }, SECTION_CHECK_INTERVAL);

    return () => clearInterval(interval_id);
  }, [sections_ready]);

  useEffect(() => {
    if (!mount_ref.current) return;

    // Scene setup with fog for depth
    const scene = new THREE.Scene();
    scene_ref.current = scene;
    scene.fog = new THREE.FogExp2(0x000000, 0.01);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (is_mobile ? 1 : 2) / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth / (is_mobile ? 1 : 2), window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mount_ref.current.appendChild(renderer.domElement);

    // Create brain sphere
    const { sphere, sphere_material, synapses } = createBrainSphere(scene);
    sphere_ref.current = sphere;

    // Replace the meteors creation and animation code with:
    createMeteors(scene).then((meteors_data) => {
      meteors_data.meteors.forEach(({ meteor, config }) => {
        (meteor as any).config = config;
      });

      meteors_ref.current = meteors_data;
      animateMeteors(meteors_data.meteors, scene, sphere, meteors_data.impact_points, active_index);
    });

    // Enhanced lighting setup
    const ambient_light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient_light);

    const point_light = new THREE.PointLight(0xffffff, 2);
    point_light.position.set(10, 10, 10);
    point_light.castShadow = true;
    scene.add(point_light);

    // Add volumetric spotlight
    const spot_light = new THREE.SpotLight(0x4a90e2, 2);
    spot_light.position.set(-15, 15, 15);
    spot_light.angle = Math.PI / 4;
    spot_light.penumbra = 0.1;
    spot_light.decay = 2;
    spot_light.distance = 200;
    spot_light.castShadow = true;
    scene.add(spot_light);

    camera.position.z = 15;

    // Enhanced animation loop with neural network effects
    const animateScene = () => {
      animation_ref.current = requestAnimationFrame(animateScene);

      // Animate brain sphere
      animateBrainSphere(sphere, sphere_material, synapses);

      // Update meteor animations if needed
      if (meteors_ref.current) {
        // We don't need to call animateMeteors here as it's already set up with GSAP
        // Just update any per-frame logic if needed
      }

      // Dynamic light movement
      const time = Date.now() * 0.001;
      point_light.position.x = Math.sin(time) * 15;
      point_light.position.z = Math.cos(time) * 15;

      renderer.render(scene, camera);
    };

    // Intersection Observer to start/stop animation when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateScene();
          } else if (animation_ref.current) {
            cancelAnimationFrame(animation_ref.current);
          }
        });
      },
      { threshold: OBSERVER_THRESHOLD }
    );

    if (mount_ref.current) {
      observer.observe(mount_ref.current);
    }

    // Enhanced resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / (is_mobile ? 1 : 2) / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / (is_mobile ? 1 : 2), window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animation_ref.current) {
        cancelAnimationFrame(animation_ref.current);
      }
      observer.disconnect();
      mount_ref.current?.removeChild(renderer.domElement);
    };
  }, [is_mobile]);

  // Effect to update meteor animations when active_index changes
  useEffect(() => {
    if (scene_ref.current && meteors_ref.current && sphere_ref.current) {
      // Clear any existing animations first
      meteors_ref.current.meteors.forEach(({ meteor }) => {
        gsap.killTweensOf(meteor.position);
        gsap.killTweensOf(meteor.rotation);
      });

      // Apply new animations based on active_index
      animateMeteors(
        meteors_ref.current.meteors,
        scene_ref.current,
        sphere_ref.current,
        meteors_ref.current.impact_points,
        active_index
      );
    }
  }, [active_index]);

  // Set up intersection observer for sections
  useEffect(() => {
    // Wait for sections to be ready
    if (!sections_ready) return;
    
    // Create an observer for each section
    const section_observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
          }
        });
      },
      {
        threshold: SECTION_THRESHOLD,
        rootMargin: SECTION_ROOT_MARGIN,
      }
    );

    // Observe each section
    sections_ref.current.forEach((section) => {
      if (section) {
        section_observer.observe(section);
      }
    });

    return () => {
      section_observer.disconnect();
    };
  }, [sections_ready]);

  return (
    <div className='relative w-full h-full flex flex-col md:flex-row items-stretch'>
      <div className='w-full md:w-1/2 h-full min-h-[300px] md:min-h-full'>
        <TextContent activeIndex={active_index} setSectionsRef={sections_ref} />
      </div>
      <div
        ref={mount_ref}
        className='w-full md:w-1/2 h-full min-h-[300px] md:min-h-full sticky top-0'
      ></div>
    </div>
  );
};

export default Depiction;
