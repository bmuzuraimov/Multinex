import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import TextContent from './TextContent';
import { createMeteors, animateMeteors } from './Meteors';
import { createBrainSphere, animateBrainSphere } from './BrainSphere';

const Depiction: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with fog for depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.01);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Create brain sphere
    const { sphere, sphereMaterial, synapses } = createBrainSphere(scene);

    // Replace the meteors creation and animation code with:
    createMeteors(scene).then(({ meteors, impactPoints }) => {
      animateMeteors(meteors, scene, sphere, impactPoints, activeIndex);
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
      camera.aspect = window.innerWidth / 2 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight);
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
  }, []);

  // Add new useEffect for text animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev >= 2 ? 0 : prev + 1));
    }, activeIndex === 1 ? 8000 : 6000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="relative w-full h-full flex items-center">
      <div className="w-1/2 h-full">
        <TextContent activeIndex={activeIndex} />
      </div>
      <div className="w-1/2 h-full">
        <div ref={mountRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default Depiction;