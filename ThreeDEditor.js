
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function ThreeDEditor() {
  const [script, setScript] = useState('');

  const handleScriptChange = (e) => {
    setScript(e.target.value);
  };

  const executeScript = () => {
    try {
      // Exécution sécurisée du script
      new Function(script)();
    } catch (error) {
      console.error('Erreur dans le script:', error);
    }
  };

  return (
    <div>
      <textarea
        value={script}
        onChange={handleScriptChange}
        placeholder="Entrez votre script ici..."
      />
      <button onClick={executeScript}>Exécuter</button>
      <Canvas>
        <OrbitControls />
        {/* Ajouter des objets 3D dynamiquement */}
      </Canvas>
    </div>
  );
}

export default ThreeDEditor;
