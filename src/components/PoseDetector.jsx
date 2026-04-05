import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const PoseDetector = ({ onAlertTriggered }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // Escalation Protocol State: MONITORING -> INTERVENTION -> EMERGENCY
  const [protocolState, setProtocolState] = useState('MONITORING');
  const [interventionTimer, setInterventionTimer] = useState(0);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  const handleDevices = useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }
  }, [handleDevices]);

  // We need refs to track state synchronously inside MediaPipe's onResults callback
  const protocolStateRef = useRef('MONITORING');
  
  const setProtocol = (newState) => {
    setProtocolState(newState);
    protocolStateRef.current = newState;
  };

  const playInterventionAudio = () => {
    try {
      const utterance = new SpeechSynthesisUtterance("Are you okay? Please move slowly to acknowledge.");
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  // Heuristic for alert detection
  const detectHanging = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftAnkle = landmarks[31];
    const rightAnkle = landmarks[32];

    if (nose && leftShoulder && rightShoulder && leftAnkle && rightAnkle) {
      const isNoseHigh = nose.y < 0.5; 
      const areArmsRaised = (leftWrist && leftWrist.y < nose.y) || (rightWrist && rightWrist.y < nose.y);
      const horizontalMidpointShoulders = (leftShoulder.x + rightShoulder.x) / 2;
      const horizontalMidpointAnkles = (leftAnkle.x + rightAnkle.x) / 2;
      const isVertical = Math.abs(horizontalMidpointShoulders - horizontalMidpointAnkles) < 0.25;
      const isBodyStretched = Math.abs(nose.y - leftAnkle.y) > 0.3; 
      const isFeetOffGround = leftAnkle.y < 0.98 && rightAnkle.y < 0.98;

      if (isNoseHigh && isVertical && isBodyStretched && (isFeetOffGround || areArmsRaised)) {
        return true;
      }
    }
    return false;
  };

  const detectSafeMovement = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const nose = landmarks[0];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    
    // Simple verification: if wrists are moving below shoulder level and nose is normal
    if (nose && nose.y > 0.5) return true;
    if (leftWrist && rightWrist && nose && leftWrist.y > nose.y + 0.2 && rightWrist.y > nose.y + 0.2) return true;
    
    return false;
  };

  const drawBoundingBox = (ctx, landmarks, color, lineWidth, label) => {
    if (!landmarks || landmarks.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    landmarks.forEach(lm => {
      if (lm.x < minX) minX = lm.x;
      if (lm.y < minY) minY = lm.y;
      if (lm.x > maxX) maxX = lm.x;
      if (lm.y > maxY) maxY = lm.y;
    });

    const padding = 0.08; 
    const width = (maxX - minX + padding * 2) * ctx.canvas.width;
    const height = (maxY - minY + padding * 2) * ctx.canvas.height;
    const x = (minX - padding) * ctx.canvas.width;
    const y = (minY - padding) * ctx.canvas.height;

    // Semi-transparent fill
    ctx.fillStyle = color === '#FF0000' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)';
    ctx.fillRect(x, y, width, height);

    // Border
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
    
    // Corners
    const cornerSize = 30;
    ctx.lineWidth = lineWidth * 2;
    
    ctx.beginPath(); ctx.moveTo(x, y + cornerSize); ctx.lineTo(x, y); ctx.lineTo(x + cornerSize, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + width - cornerSize, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + cornerSize); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + height - cornerSize); ctx.lineTo(x, y + height); ctx.lineTo(x + cornerSize, y + height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + width - cornerSize, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - cornerSize); ctx.stroke();

    // Label
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(label).width;
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 36, textWidth + 20, 36);
    
    ctx.fillStyle = color === '#eab308' ? '#000' : 'white';
    ctx.fillText(label, x + 10, y - 10);
  };

  useEffect(() => {
    let consecutiveAlertFrames = 0;
    let consecutiveSafeFrames = 0;
    const RISK_THRESHOLD = 8;
    const SAFE_THRESHOLD = 10;
    
    let timerInterval = null;

    let pose = null;
    if (window.Pose) {
      pose = new window.Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults((results) => {
        if (!isModelLoaded) setIsModelLoaded(true);
        if (!canvasRef.current || !webcamRef.current?.video) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
        
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
        
        // Privacy Constraint: Only draw webcam image if NOT in Emergency Mode
        if (protocolStateRef.current !== 'EMERGENCY') {
          canvasCtx.drawImage(results.image, 0, 0, videoWidth, videoHeight);
        } else {
          // Emergency Mode: Skeleton Only. Blank dark background.
          canvasCtx.fillStyle = '#0f172a';
          canvasCtx.fillRect(0, 0, videoWidth, videoHeight);
          canvasCtx.font = 'bold 24px Inter';
          canvasCtx.fillStyle = '#ef4444';
          canvasCtx.shadowColor = '#ef4444';
          canvasCtx.shadowBlur = 10;
          canvasCtx.fillText('EMERGENCY LIVE SESSION - SKELETON ONLY', 40, 40);
          canvasCtx.shadowBlur = 0;
        }

        if (results.poseLandmarks) {
          const isDangerous = detectHanging(results.poseLandmarks);
          const isSafeAct = detectSafeMovement(results.poseLandmarks);
          
          const currentState = protocolStateRef.current;

          if (currentState === 'MONITORING') {
            if (isDangerous) {
              consecutiveAlertFrames++;
              if (consecutiveAlertFrames >= RISK_THRESHOLD) {
                setProtocol('INTERVENTION');
                setInterventionTimer(10); // 10 second countdown
                playInterventionAudio();
                
                // Clear existing interval if any
                if (timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                  setInterventionTimer((prev) => {
                    if (prev <= 1) {
                      clearInterval(timerInterval);
                      setProtocol('EMERGENCY');
                      onAlertTriggered(true); // Escalate to App levels
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            } else {
              consecutiveAlertFrames = Math.max(0, consecutiveAlertFrames - 1);
            }
          } 
          else if (currentState === 'INTERVENTION') {
            if (isSafeAct) {
              consecutiveSafeFrames++;
              if (consecutiveSafeFrames >= SAFE_THRESHOLD) {
                // False alarm or crisis averted
                setProtocol('MONITORING');
                consecutiveAlertFrames = 0;
                consecutiveSafeFrames = 0;
                if (timerInterval) clearInterval(timerInterval);
              }
            } else {
              consecutiveSafeFrames = Math.max(0, consecutiveSafeFrames - 1);
            }
            drawBoundingBox(canvasCtx, results.poseLandmarks, '#eab308', 4, 'INTERVENTION PHASE: WAITING FOR RESPONSE');
          }
          else if (currentState === 'EMERGENCY') {
            drawBoundingBox(canvasCtx, results.poseLandmarks, '#FF0000', 6, 'CRITICAL: EMERGENCY AUTHORITIES NOTIFIED');
          }

          // Always draw the skeleton map
          let landmarkColor = '#10b981'; // Green for safe
          if (currentState === 'INTERVENTION') landmarkColor = '#eab308';
          if (currentState === 'EMERGENCY') landmarkColor = '#FF0000';

          if (window.drawConnectors && window.POSE_CONNECTIONS) {
            window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS,
                            {color: landmarkColor, lineWidth: 3});
          }
          if (window.drawLandmarks) {
            window.drawLandmarks(canvasCtx, results.poseLandmarks,
                          {color: '#ffffff', lineWidth: 1, radius: 3});
          }

        } else {
            // No person detected
            if (protocolStateRef.current === 'MONITORING') {
               consecutiveAlertFrames = 0;
            }
        }
        canvasCtx.restore();
      });
    }

    if (!isCameraActive) {
      if (pose) pose.close();
      if (timerInterval) clearInterval(timerInterval);
      return;
    }

    let requestAnimationFrameId;
    const processVideo = async () => {
      if (
        pose &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        try {
          await pose.send({ image: webcamRef.current.video });
          if (!isScanning) setIsScanning(true);
        } catch (error) {
          console.error("Error processing video frame:", error);
        }
      }
      requestAnimationFrameId = requestAnimationFrame(processVideo);
    };

    if (pose && isCameraActive) {
      processVideo();
    }

    return () => {
      if (requestAnimationFrameId) cancelAnimationFrame(requestAnimationFrameId);
      if (pose) pose.close();
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [onAlertTriggered, isCameraActive]);

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
    if (isCameraActive) {
      setIsModelLoaded(false);
      setIsScanning(false);
      setProtocol('MONITORING');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 24px', 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={toggleCamera}
            style={{
              padding: '10px 24px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem', transition: 'var(--transition-smooth)',
              background: isCameraActive ? 'var(--danger)' : 'var(--primary-neon)', 
              color: 'var(--bg-color)',
              boxShadow: isCameraActive ? '0 8px 20px rgba(207, 102, 121, 0.3)' : '0 8px 20px var(--primary-glow)',
              backdropFilter: 'blur(10px)'
            }}>
            {isCameraActive ? 'STOP MONITORING' : 'START MONITORING'}
          </button>

          <select
            value={selectedDeviceId}
            onClick={() => {
              if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices.enumerateDevices().then(handleDevices);
              }
            }}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            style={{
              padding: '10px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem',
              backdropFilter: 'blur(10px)', outline: 'none', cursor: 'pointer'
            }}
          >
            {devices.map((device, key) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${key + 1}`}
              </option>
            ))}
          </select>
          
          {isCameraActive && (
            <span style={{ 
              color: isScanning ? (protocolState === 'EMERGENCY' ? '#ef4444' : '#10b981') : '#fef08a', 
              fontWeight: '600', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: isScanning ? (protocolState === 'EMERGENCY' ? '#ef4444' : '#10b981') : '#fef08a',
                animation: isScanning ? 'pulse-soft 1s infinite' : 'none'
              }}></div>
              {protocolState === 'EMERGENCY' ? 'SECURE CONNECTION: SKELETON ONLY' : 
               (isScanning ? 'AI Currently Monitoring Posture...' : 'Initializing AI Scanner...')}
            </span>
          )}
        </div>
      </div>

      {protocolState === 'INTERVENTION' && (
        <div className="overlay-alert slide-down" style={{ 
          zIndex: 40, top: '80px', background: 'rgba(234, 179, 8, 0.95)', color: '#000'
        }}>
          LOCAL INTERVENTION ACTIVE: Are you okay? <br/>
          <span style={{ fontSize: '1rem', marginTop: '8px', display: 'block', fontWeight: 'bold' }}>
            Escalating to Emergency Services in {interventionTimer}s...
          </span>
        </div>
      )}

      {protocolState === 'EMERGENCY' && (
        <div className="overlay-alert slide-down" style={{ zIndex: 40, top: '80px' }}>
          WARNING: CRITICAL MOMENT DETECTED - AUTHORITIES NOTIFIED
        </div>
      )}
      
      {isCameraActive ? (
        <>
          {/* Always render Webcam so mediapipe can get frames, but use visibility hidden during emergency to ensure it's not rendered to DOM if canvas logic isn't enough */}
          {/* Raw Webcam used for AI processing - Hidden from view in favor of Annotated Canvas */}
          <div style={{ 
            opacity: 0, 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '1px', 
            height: '1px', 
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0
          }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={true}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 },
                aspectRatio: 1.7777777778
              }}
              onUserMedia={() => {
                console.log("Webcam Stream Started Successfully");
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                  navigator.mediaDevices.enumerateDevices().then(handleDevices);
                }
              }}
              onUserMediaError={(err) => {
                console.error("Critical Webcam Error:", err);
                setIsCameraActive(false);
                alert("Could not access camera. Please check permissions.");
              }}
            />
          </div>

          <canvas
            ref={canvasRef}
            className="output-canvas"
            style={{
              position: 'absolute', marginLeft: 'auto', marginRight: 'auto',
              left: 0, right: 0, textAlign: 'center', zIndex: 10,
              width: '100%', height: '100%', objectFit: 'cover'
            }}
          />
          
          {!isModelLoaded && (
             <div className="camera-placeholder" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 15, color: '#0d9488', fontWeight: 'bold' }}>
                <p>Loading AI Pose Model & Accessing Camera...</p>
             </div>
          )}
        </>
      ) : (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 15, color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', textAlign: 'center' }}>
            <p style={{fontSize: '1.2rem', marginBottom: '8px'}}>Camera Feed Offline</p>
            <p style={{fontSize: '0.9rem', marginBottom: '16px', fontWeight: '400'}}>Click "Open Camera" to begin real-time algorithmic monitoring.</p>
            <button 
              onClick={toggleCamera}
              style={{
                background: '#14b8a6', color: 'white', border: 'none', padding: '12px 28px',
                borderRadius: '8px', fontWeight: '800', cursor: 'pointer', transition: 'var(--transition)'
              }}
            >
              Open Camera
            </button>
        </div>
      )}
    </div>
  );
};

export default PoseDetector;
