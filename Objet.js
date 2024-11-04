
// Objet.js
import React from 'react';

function Objet({ obj, texture }) {
  const getGeometry = () => {
    switch (obj.type) {
      case 'box':
        return <boxGeometry args={obj.size} />;
      case 'sphere':
        return <sphereGeometry args={[obj.radius, 32, 32]} />;
      case 'cone':
        return <coneGeometry args={[obj.size[0] / 2, obj.size[1], 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[obj.radiusTop, obj.radiusBottom, obj.height, 32]} />;
      case 'plane':
        return <planeGeometry args={obj.size} />;
      case 'torus':
        return <torusGeometry args={[obj.radius, obj.tube, 16, 100]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[obj.radius, obj.tube, 100, 16]} />;
      default:
        return null;
    }
  };

  return (
    <mesh position={obj.position} rotation={obj.rotation}>
      {getGeometry()}
      <meshStandardMaterial map={texture} color={obj.color} />
    </mesh>
  );
}

export default Objet;
