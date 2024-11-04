
import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Scene({ config, textures }) {
  useFrame(() => {
    config.animations?.forEach((anim) => {
      const obj = config.objects.find((o) => o.type === anim.object);
      if (!obj) return;

      switch (anim.type) {
        case 'movement':
          obj.position[anim.axis] += anim.speed;
          if (obj.position[anim.axis] > anim.range[1] || obj.position[anim.axis] < anim.range[0]) {
            anim.speed *= -1;
          }
          break;
        case 'rotation':
          obj.rotation[anim.axis] += anim.speed;
          break;
        default:
          break;
      }
    });
  });

  return (
    <>
      {config.objects.map((obj, index) => (
        <mesh key={index} position={obj.position} rotation={obj.rotation}>
          <boxGeometry args={obj.size} />
          <meshStandardMaterial map={textures[index]} color={obj.color} />
        </mesh>
      ))}
    </>
  );
}

function JSON3DEditor() {
  const [jsonInput, setJsonInput] = useState('');
  const [config, setConfig] = useState({ objects: [], animations: [] });
  const [textures, setTextures] = useState([]);

  const handleGenerate = () => {
    try {
      const parsedConfig = JSON.parse(jsonInput);
      setConfig(parsedConfig);

      // Charger les textures
      const loader = new THREE.TextureLoader();
      const loadedTextures = parsedConfig.objects.map((obj) =>
        obj.texture ? loader.load(obj.texture) : null
      );
      setTextures(loadedTextures);
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('JSON invalide. Veuillez vérifier votre format.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        style={{ width: '100%', height: '150px' }}
        placeholder="Collez votre script JSON ici..."
      />
      <button onClick={handleGenerate}>Générer</button>
      <Canvas style={{ height: '400px' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Scene config={config} textures={textures} />
      </Canvas>
    </div>
  );
}

export default JSON3DEditor;
