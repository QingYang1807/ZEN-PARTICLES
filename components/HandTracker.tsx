import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useAppStore } from '../store';

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setExpansion, setIsHandTracking } = useAppStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let handLandmarker: HandLandmarker | null = null;
    let animationFrameId: number;

    const setupMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        setLoaded(true);
        startWebcam();
      } catch (e) {
        console.error("Failed to load MediaPipe", e);
      }
    };

    const startWebcam = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
          });
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', predictWebcam);
        } catch (err) {
          console.error("Camera access denied", err);
        }
      }
    };

    const predictWebcam = () => {
        if (!handLandmarker || !videoRef.current) return;
        
        const startTimeMs = performance.now();
        if (videoRef.current.videoWidth > 0) {
            const results = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
            
            if (results.landmarks && results.landmarks.length > 0) {
                setIsHandTracking(true);
                
                // Logic: Calculate distance between thumb tip (4) and index tip (8)
                // If two hands, calculate distance between hand 1 index and hand 2 index
                
                let distance = 0;
                
                if (results.landmarks.length === 1) {
                    const lm = results.landmarks[0];
                    const thumb = lm[4];
                    const index = lm[8];
                    distance = Math.sqrt(
                        Math.pow(thumb.x - index.x, 2) + 
                        Math.pow(thumb.y - index.y, 2)
                    );
                    // Map 0.05 (closed) -> 0.3 (open) to 0 -> 1 expansion
                    distance = Math.max(0, Math.min(1, (distance - 0.05) * 4));
                } else if (results.landmarks.length === 2) {
                     const hand1 = results.landmarks[0][8];
                     const hand2 = results.landmarks[1][8];
                     distance = Math.sqrt(
                        Math.pow(hand1.x - hand2.x, 2) + 
                        Math.pow(hand1.y - hand2.y, 2)
                    );
                     // Map 0.1 -> 0.8 to 0 -> 2
                    distance = Math.max(0, Math.min(2, (distance - 0.1) * 2.5));
                }

                // Smooth dampening could be added here, but direct set is fine for responsiveness
                setExpansion(distance);
            } else {
                setIsHandTracking(false);
            }
        }
        animationFrameId = requestAnimationFrame(predictWebcam);
    };

    setupMediaPipe();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handLandmarker) handLandmarker.close();
    };
  }, [setExpansion, setIsHandTracking]);

  return (
    <div className="fixed top-4 right-4 z-50 opacity-0 pointer-events-none">
       {/* Hidden video element for processing */}
      <video ref={videoRef} autoPlay playsInline style={{ width: '320px', height: '240px' }}></video>
    </div>
  );
};

export default HandTracker;
