import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useAppStore } from '../store';

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setExpansion, setIsHandTracking, setHandCoords } = useAppStore();
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
                
                let distance = 0;
                let leftHand = null;
                let rightHand = null;
                
                // Extract Hand Coordinates for HUD
                // Note: MediaPipe x is normalized [0,1]. x=0 is left. 
                // We usually mirror video, so x becomes 1-x for display if we mirror CSS.
                // Here we assume standard orientation, we handle mirroring in HUD logic.
                
                if (results.landmarks.length === 1) {
                    const lm = results.landmarks[0];
                    const thumb = lm[4];
                    const index = lm[8];
                    
                    // Center of palm roughly
                    const cx = lm[9].x; 
                    const cy = lm[9].y;

                    rightHand = { x: cx, y: cy };

                    distance = Math.sqrt(
                        Math.pow(thumb.x - index.x, 2) + 
                        Math.pow(thumb.y - index.y, 2)
                    );
                    distance = Math.max(0, Math.min(1, (distance - 0.05) * 4));
                } else if (results.landmarks.length === 2) {
                     const h1 = results.landmarks[0][8]; // Index tip
                     const h2 = results.landmarks[1][8]; // Index tip
                     
                     // Roughly assign left/right based on x
                     if (results.landmarks[0][9].x < results.landmarks[1][9].x) {
                        rightHand = results.landmarks[0][9]; // Mirrored view logic
                        leftHand = results.landmarks[1][9];
                     } else {
                        leftHand = results.landmarks[0][9];
                        rightHand = results.landmarks[1][9];
                     }

                     distance = Math.sqrt(
                        Math.pow(h1.x - h2.x, 2) + 
                        Math.pow(h1.y - h2.y, 2)
                    );
                    distance = Math.max(0, Math.min(2, (distance - 0.1) * 2.5));
                }

                setHandCoords({ 
                    left: leftHand ? { x: leftHand.x, y: leftHand.y } : null,
                    right: rightHand ? { x: rightHand.x, y: rightHand.y } : null
                });

                setExpansion(distance);
            } else {
                setIsHandTracking(false);
                setHandCoords({ left: null, right: null });
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
  }, [setExpansion, setIsHandTracking, setHandCoords]);

  return (
    <div className="fixed top-4 right-4 z-50 opacity-0 pointer-events-none">
       {/* Hidden video element for processing */}
      <video ref={videoRef} autoPlay playsInline style={{ width: '320px', height: '240px', transform: 'scaleX(-1)' }}></video>
    </div>
  );
};

export default HandTracker;