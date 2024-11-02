
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AnimatedSphere = React.forwardRef(({ script, isAnimating }, ref) => {
  useFrame(() => {
    if (isAnimating) {
      try {
        eval(script); // Attention à l'utilisation de eval
      } catch (error) {
        console.error('Erreur dans le script:', error);
      }
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
});

const CartoonVideoGenerator = () => {
  const canvasRef = useRef(null);
  const sphereRef = useRef(null);
  const [script, setScript] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordingURL, setRecordingURL] = useState(null);
  const [videoFormat, setVideoFormat] = useState('video/webm');

  const handleStartAnimation = () => {
    setIsAnimating(true);
  };

  const handleExecuteScript = () => {
    handleStartAnimation();
  };

  const handleStartCapture = () => {
    const stream = canvasRef.current.captureStream(30); // Capture le stream à 30 fps
    const newRecorder = new MediaRecorder(stream, {
      mimeType: videoFormat, // Utiliser le format sélectionné
    });
    const chunks = [];

    newRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    newRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: videoFormat });
      const url = URL.createObjectURL(blob);
      setRecordingURL(url); // Mettre à jour l'URL pour le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `animation.${videoFormat === 'video/webm' ? 'webm' : 'mp4'}`;
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
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Générateur de Vidéos de Dessins Animés 3D</h2>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows="8"
        cols="50"
        className="border border-gold-500 rounded-md p-2 mb-4"
        placeholder="Collez votre script JavaScript ici..."
      />
      <div className="flex mb-4">
        <button
          onClick={handleExecuteScript}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600"
        >
          Exécuter le script et démarrer l'animation
        </button>
        <button
          onClick={handleStopCapture}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Arrêter l'enregistrement
        </button>
      </div>
      <div className="mb-4">
        <label className="mr-2">Sélectionnez le format vidéo :</label>
        <select
          value={videoFormat}
          onChange={(e) => setVideoFormat(e.target.value)}
          className="border border-gold-500 rounded-md p-2"
        >
          <option value="video/webm">WebM</option>
          <option value="video/mp4">MP4</option>
        </select>
      </div>
      <button
        onClick={handleStartCapture}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
      >
        Démarrer l'enregistrement
      </button>
      <div className="relative">
        <Canvas ref={canvasRef} style={{ height: '400px', width: '600px', border: '5px solid gold' }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {isAnimating && <AnimatedSphere ref={sphereRef} script={script} isAnimating={isAnimating} />}
        </Canvas>
      </div>
      {recordingURL && (
        <div className="mt-4">
          <h3>Télécharger l'enregistrement :</h3>
          <a href={recordingURL} download="animation.webm" className="text-blue-600 underline">Télécharger la vidéo</a>
        </div>
      )}
    </div>
  );
};

export default CartoonVideoGenerator;
