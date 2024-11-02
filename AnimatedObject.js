import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

const AnimatedObject = ({ element }) => {
  const mesh = useRef();
  const { nodes, materials } = useGLTF(element.url); // Chargement du modèle
  const [actionIndex, setActionIndex] = useState(0);
  const [position, setPosition] = useState([element.position.x, element.position.y, element.position.z]);
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    const action = element.actions[actionIndex];

    if (!action) return;

    if (action.type === "transform") {
      setTimeout(() => {
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
    <mesh ref={mesh} position={position} >
      <primitive object={nodes.default} scale={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default AnimatedObject;
