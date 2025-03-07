import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import TextContent from './TextContent';
import { createMeteors, animateMeteors } from './Meteors';
import { createBrainSphere, animateBrainSphere } from './BrainSphere';
import gsap from 'gsap';

const Depiction: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [sectionsReady, setSectionsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Store references to scene and meteors
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meteorsRef = useRef<{ meteors: { meteor: THREE.Mesh; config: any }[]; impactPoints: THREE.Vector3[] } | null>(
    null
  );
  const sphereRef = useRef<THREE.Mesh | null>(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update sectionsReady when sections are available
  useEffect(() => {
    const checkSectionsReady = () => {
      if (sectionsRef.current.length > 0 && sectionsRef.current.every((section) => section !== null)) {
        setSectionsReady(true);
      }
    };

    // Check initially
    checkSectionsReady();

    // Set up a small interval to check until sections are ready
    const intervalId = setInterval(() => {
      if (!sectionsReady) {
        checkSectionsReady();
      } else {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [sectionsReady]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with fog for depth
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x000000, 0.01);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (isMobile ? 1 : 2) / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth / (isMobile ? 1 : 2), window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Create brain sphere
    const { sphere, sphereMaterial, synapses } = createBrainSphere(scene);
    sphereRef.current = sphere;

    // Replace the meteors creation and animation code with:
    createMeteors(scene).then((meteorsData) => {
      // Store config on each meteor for later reference
      meteorsData.meteors.forEach(({ meteor, config }) => {
        (meteor as any).config = config;
      });

      meteorsRef.current = meteorsData;
      animateMeteors(meteorsData.meteors, scene, sphere, meteorsData.impactPoints, activeIndex);
    });

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(10, 10, 10);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Add volumetric spotlight
    const spotLight = new THREE.SpotLight(0x4a90e2, 2);
    spotLight.position.set(-15, 15, 15);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    scene.add(spotLight);

    camera.position.z = 15;

    // Enhanced animation loop with neural network effects
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Animate brain sphere
      animateBrainSphere(sphere, sphereMaterial, synapses);

      // Update meteor animations if needed
      if (meteorsRef.current) {
        // We don't need to call animateMeteors here as it's already set up with GSAP
        // Just update any per-frame logic if needed
      }

      // Dynamic light movement
      const time = Date.now() * 0.001;
      pointLight.position.x = Math.sin(time) * 15;
      pointLight.position.z = Math.cos(time) * 15;

      renderer.render(scene, camera);
    };

    // Intersection Observer to start/stop animation when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
          } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mountRef.current) {
      observer.observe(mountRef.current);
    }

    // Enhanced resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / (isMobile ? 1 : 2) / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / (isMobile ? 1 : 2), window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  // Effect to update meteor animations when activeIndex changes
  useEffect(() => {
    console.log(`Active index changed to: ${activeIndex}`);

    if (sceneRef.current && meteorsRef.current && sphereRef.current) {
      console.log(`Updating meteor animations for index ${activeIndex}`);

      // Clear any existing animations first
      meteorsRef.current.meteors.forEach(({ meteor }) => {
        gsap.killTweensOf(meteor.position);
        gsap.killTweensOf(meteor.rotation);
      });

      // Apply new animations based on activeIndex
      animateMeteors(
        meteorsRef.current.meteors,
        sceneRef.current,
        sphereRef.current,
        meteorsRef.current.impactPoints,
        activeIndex
      );
    }
  }, [activeIndex]);

  // Set up intersection observer for sections
  useEffect(() => {
    // Wait for sections to be ready
    if (!sectionsReady) return;
    // Create an observer for each section
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            console.log('Section', index, 'is now visible');
            setActiveIndex(index);
          }
        });
      },
      {
        threshold: 0.6, // Trigger when 60% of the section is visible
        rootMargin: '-10% 0px', // Adjust this to fine-tune when sections become active
      }
    );

    // Observe each section
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        sectionObserver.observe(section);
      }
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, [sectionsReady]);

  return (
    <div className='relative w-full h-full flex flex-col md:flex-row items-stretch'>
      <div className='w-full md:w-1/2 h-full min-h-[300px] md:min-h-full'>
        <TextContent activeIndex={activeIndex} setSectionsRef={sectionsRef} />
      </div>
      <div
        ref={mountRef}
        className='w-full md:w-1/2 h-full min-h-[300px] md:min-h-full sticky top-0'
      ></div>
    </div>
  );
};

export default Depiction;
