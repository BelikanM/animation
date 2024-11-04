
import React, { useRef, useState } from 'react';

const VideoRecorder = ({ canvasRef, videoFormat, setRecordingURL }) => {
  const [recorder, setRecorder] = useState(null);

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
    <div className="flex flex-col items-center mb-4">
      <button
        onClick={handleStartCapture}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-2 hover:bg-green-600"
      >
        Démarrer l'enregistrement
      </button>
      <button
        onClick={handleStopCapture}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Arrêter l'enregistrement
      </button>
    </div>
  );
};

export default VideoRecorder;
