import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AnimatedObject = ({ element }) => {
  const mesh = useRef();
  const [actionIndex, setActionIndex] = useState(0);
  const [shape, setShape] = useState(element.type);
  const [color, setColor] = useState(element.color);
  const [position, setPosition] = useState([element.position.x, element.position.y, element.position.z]);

  useEffect(() => {
    const action = element.actions[actionIndex];

    if (!action) return;

    if (action.type === "transform") {
      setTimeout(() => {
        setShape(action.shape);
        setActionIndex((prevIndex) => (prevIndex + 1) % element.actions.length);
      }, action.duration * 1000);
    } else if (action.type === "move") {
      setTimeout(() => {
        setPosition([action.position.x, action.position.y, action.position.z]);
        setActionIndex((prevIndex) => (prevIndex + 1) % element.actions.length);
      }, action.duration * 1000);
    } else if (action.type === "colorChange") {
      setTimeout(() => {
        setColor(action.color);
        setActionIndex((prevIndex) => (prevIndex + 1) % element.actions.length);
      }, action.duration * 1000);
    }
  }, [actionIndex, element.actions]);

  return (
    <mesh ref={mesh} position={position}>
      {shape === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
      {shape === "cube" && <boxGeometry args={[1, 1, 1]} />}
      {shape === "cone" && <coneGeometry args={[1, 2, 32]} />}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const AnimationScene = ({ parsedScript }) => {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {parsedScript.elements.map((element, index) => (
        <AnimatedObject key={index} element={element} />
      ))}
    </Canvas>
  );
};

const Animation3DComponent = () => {
  const [jsonScript, setJsonScript] = useState('');
  const [parsedScript, setParsedScript] = useState(null);

  const handleInputChange = (e) => setJsonScript(e.target.value);

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
      {parsedScript && <AnimationScene parsedScript={parsedScript} />}
    </div>
  );
};

export default Animation3DComponent;
