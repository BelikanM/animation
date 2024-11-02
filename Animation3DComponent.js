
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Animation3DComponent = () => {
  const [jsonScript, setJsonScript] = useState('');
  const [parsedScript, setParsedScript] = useState(null);

  const handleInputChange = (e) => {
    setJsonScript(e.target.value);
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonScript);
      setParsedScript(parsed);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  return (
    <div>
      <textarea
        value={jsonScript}
        onChange={handleInputChange}
        rows="10"
        cols="50"
        placeholder="Collez votre script JSON ici"
        style={{
          color: 'black',
          backgroundColor: 'white',
          borderColor: '#ccc',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}
      />
      <button onClick={handleJsonSubmit}>Générer l'animation</button>

      {parsedScript && parsedScript.frames ? (
        <Canvas>
          <OrbitControls />
          {parsedScript.frames.map((frame, index) =>
            frame.elements.map((element) => (
              <mesh
                key={`${element.id}-${index}`}
                position={[element.x, element.y, element.z || 0]}
              >
                <sphereGeometry args={[element.radius || 1, 32, 32]} />
                <meshStandardMaterial color={element.color || 'white'} />
              </mesh>
            ))
          )}
        </Canvas>
      ) : (
        parsedScript && <div>Erreur : Script JSON invalide</div>
      )}
    </div>
  );
};

export default Animation3DComponent;
