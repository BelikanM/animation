
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AnimatedSphere = ({ script }) => {
  const meshRef = useRef();

  useFrame(() => {
    // Exécuter le script de l'utilisateur pour manipuler l'animation
    try {
      eval(script); // Attention à l'utilisation de eval, cela peut poser des problèmes de sécurité
    } catch (error) {
      console.error('Erreur dans le script:', error);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const CartoonVideoGenerator = () => {
  const [script, setScript] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const canvasRef = useRef(null);

  const handleStartAnimation = () => {
    setIsAnimating(true);
  };

  const handleStartCapture = () => {
    const stream = canvasRef.current.captureStream(30); // Capture le stream à 30 fps
    const newRecorder = new MediaRecorder(stream);
    const chunks = [];

    newRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    newRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'animation.webm';
      a.click();
    };

    newRecorder.start();
    setRecorder(newRecorder);
  };

  const handleStopCapture = () => {
    if (recorder) {
      recorder.stop();
      setRecorder(null);
    }
  };

  return (
    <div>
      <h2>Générateur de Vidéos de Dessins Animés 3D</h2>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows="8"
        cols="50"
        placeholder="Collez votre script JavaScript ici..."
      />
      <br />
      <button onClick={handleStartAnimation}>Démarrer l'animation</button>
      <button onClick={handleStartCapture}>Démarrer l'enregistrement</button>
      <button onClick={handleStopCapture}>Arrêter l'enregistrement</button>
      <Canvas ref={canvasRef} style={{ height: '400px', width: '600px' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {isAnimating && <AnimatedSphere script={script} />}
      </Canvas>
    </div>
  );
};

export default CartoonVideoGenerator;
