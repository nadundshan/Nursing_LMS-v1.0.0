import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Hand, Heart
  // Check, 
  // X, 
  // Timer,
  // Info,
  // Award,
  // Target
} from 'lucide-react';
import { User, SimulationResult } from '../../types';

interface PulseCheckingSimulationProps {
  user: User;
  onComplete: (result: SimulationResult) => void;
  onBack: () => void;
}

export const PulseCheckSimulation: React.FC<PulseCheckingSimulationProps> = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [timeHeld, setTimeHeld] = useState(0);
  const [pulseCount, setPulseCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Create heartbeat audio context
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      // Using a simple beep sound simulation - in production, you'd use actual heartbeat audio
      const createHeartbeatSound = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      };

      if (isHolding) {
        const playHeartbeat = () => {
          try {
            createHeartbeatSound();
          } catch (error) {
            console.log('Audio not supported');
          }
        };

        playHeartbeat();
        const heartbeatInterval = setInterval(playHeartbeat, 800);
        return () => clearInterval(heartbeatInterval);
      }
    }
  }, [isHolding]);

  useEffect(() => {
    if (isHolding) {
      intervalRef.current = setInterval(() => {
        setTimeHeld(prev => {
          const newTime = prev + 0.1;
          if (newTime >= 15) {
            setIsHolding(false);
            setPulseCount(prev => prev + 1);
            setIsCompleted(true);
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHolding]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsHolding(true);
    setShowWarning(false);
    setIsCompleted(false);
  };

  const handleMouseUp = () => {
    if (timeHeld < 15 && timeHeld > 0) {
      setShowWarning(true);
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
    setIsHolding(false);
    setTimeHeld(0);
  };

  const handleMouseLeave = () => {
    handleMouseUp();
  };

  const resetSimulation = () => {
    setIsHolding(false);
    setTimeHeld(0);
    setPulseCount(0);
    setShowWarning(false);
    setIsCompleted(false);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Pulse Check Simulation</h1>
            </div>
            <button
              onClick={resetSimulation}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Objective:</h3>
              <p className="text-gray-600 text-sm">
                Learn to check a patient's pulse using proper finger placement and timing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Steps:</h3>
              <ol className="text-gray-600 text-sm space-y-1">
                <li>1. Place your fingers on the pulse zone</li>
                <li>2. Hold still for exactly 15 seconds</li>
                <li>3. Listen for the heartbeat sounds</li>
                <li>4. Complete the measurement</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Simulation Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-red-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pulse Check Station</h3>
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  Timer: <span className="font-mono">{timeHeld.toFixed(1)}s / 15.0s</span>
                </div>
                <div className="text-sm">
                  Pulse Count: <span className="font-bold">{pulseCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-96 bg-gradient-to-b from-red-100 to-red-50 flex items-center justify-center">
            {/* Hand/Wrist Visual */}
            <div className="relative">
              <div className="w-32 h-48 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full rotate-12 relative">
                {/* Pulse Zone */}
                <div 
                  className={`absolute top-16 left-8 w-16 h-12 rounded-full border-4 border-dashed transition-all duration-300 cursor-pointer select-none ${
                    isHolding 
                      ? 'border-green-500 bg-green-100' 
                      : 'border-red-400 bg-red-100 hover:border-red-500 hover:bg-red-200'
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center justify-center h-full">
                    {isHolding ? (
                      <Heart className={`w-6 h-6 text-red-500 ${isHolding ? 'animate-pulse' : ''}`} />
                    ) : (
                      <Hand className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                </div>
                
                {/* Fingers Indicator */}
                <div className="absolute top-12 left-6 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
                  Pulse Zone
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isHolding && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-full p-2 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Hold Progress</span>
                  <span className="text-sm text-gray-500">{((timeHeld / 15) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-100"
                    style={{ width: `${(timeHeld / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
        {showWarning && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <p className="font-medium text-yellow-800">Hold your fingers still!</p>
                <p className="text-yellow-700 text-sm">You need to maintain contact for the full 15 seconds to get an accurate pulse reading.</p>
              </div>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Excellent! Pulse check completed successfully.</p>
                <p className="text-green-700 text-sm">
                  You've successfully measured the patient's pulse. Pulse rate: 75 BPM (Normal range).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {pulseCount > 0 && (
          <div className="mt-6 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Session Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pulseCount}</div>
                <div className="text-sm text-blue-800">Successful Checks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">75</div>
                <div className="text-sm text-blue-800">Average BPM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Normal</div>
                <div className="text-sm text-blue-800">Range Assessment</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// export const PulseCheckingSimulation: React.FC<PulseCheckingSimulationProps> = ({
//   user,
//   onComplete,
//   onBack
// }) => {
//   const [stage, setStage] = useState<'intro' | 'practice' | 'measuring' | 'input' | 'result'>('intro');
//   const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [isInPulseZone, setIsInPulseZone] = useState(false);
//   const [isHolding, setIsHolding] = useState(false);
//   const [countdown, setCountdown] = useState(15);
//   const [pulseCount, setPulseCount] = useState(0);
//   const [userInput, setUserInput] = useState('');
//   const [actualPulseRate, setActualPulseRate] = useState(0);
//   const [score, setScore] = useState(0);
//   const [feedback, setFeedback] = useState('');
//   const [attempts, setAttempts] = useState(0);
  
//   const handRef = useRef<HTMLDivElement>(null);
//   const pulseZoneRef = useRef<HTMLDivElement>(null);
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval>>();

//   // Generate random pulse rate (60-100 BPM)
//   useEffect(() => {
//     if (stage === 'practice') {
//       const rate = Math.floor(Math.random() * 41) + 60; // 60-100 BPM
//       setActualPulseRate(rate);
//       setPulseCount(Math.floor(rate / 4)); // 15 seconds = 1/4 minute
//     }
//   }, [stage, attempts]);

//   const startSimulation = () => {
//     setStage('practice');
//     setAttempts(prev => prev + 1);
//     setUserInput('');
//     setScore(0);
//     setFeedback('');
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (stage !== 'practice') return;
    
//     setIsDragging(true);
//     const rect = e.currentTarget.getBoundingClientRect();
//     setHandPosition({
//       x: e.clientX - rect.left - 20,
//       y: e.clientY - rect.top - 20
//     });
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || stage !== 'practice') return;
    
//     const rect = e.currentTarget.getBoundingClientRect();
//     const newX = e.clientX - rect.left - 20;
//     const newY = e.clientY - rect.top - 20;
    
//     setHandPosition({ x: newX, y: newY });
    
//     // Check if in pulse zone
//     if (pulseZoneRef.current) {
//       const pulseRect = pulseZoneRef.current.getBoundingClientRect();
//       const containerRect = e.currentTarget.getBoundingClientRect();
      
//       const pulseZoneX = pulseRect.left - containerRect.left;
//       const pulseZoneY = pulseRect.top - containerRect.top;
      
//       const isInZone = newX >= pulseZoneX - 20 && 
//                       newX <= pulseZoneX + pulseRect.width - 20 &&
//                       newY >= pulseZoneY - 20 && 
//                       newY <= pulseZoneY + pulseRect.height - 20;
      
//       setIsInPulseZone(isInZone);
//     }
//   };

//   const handleMouseUp = () => {
//     if (isDragging && isInPulseZone && stage === 'practice') {
//       startMeasurement();
//     }
//     setIsDragging(false);
//   };

//   const startMeasurement = () => {
//     setStage('measuring');
//     setIsHolding(true);
//     setCountdown(15);
    
//     // Start countdown
//     const countdownInterval = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(countdownInterval);
//           setStage('input');
//           setIsHolding(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Simulate pulse sounds
//     const pulseInterval = setInterval(() => {
//       // Play pulse sound (in real app, this would be an actual audio file)
//       console.log('Pulse beat');
//     }, (60 / actualPulseRate) * 1000);

//     setTimeout(() => {
//       clearInterval(pulseInterval);
//     }, 15000);
//   };

//   const submitAnswer = () => {
//     const userRate = parseInt(userInput) * 4; // Convert 15-second count to BPM
//     const difference = Math.abs(userRate - actualPulseRate);
    
//     let calculatedScore = 0;
//     let feedbackText = '';
    
//     if (difference === 0) {
//       calculatedScore = 100;
//       feedbackText = 'Perfect! You counted the pulse exactly right.';
//     } else if (difference <= 4) {
//       calculatedScore = 90;
//       feedbackText = 'Excellent! Your count is very close to the actual pulse rate.';
//     } else if (difference <= 8) {
//       calculatedScore = 80;
//       feedbackText = 'Good job! Your count is reasonably accurate.';
//     } else if (difference <= 12) {
//       calculatedScore = 70;
//       feedbackText = 'Fair attempt. Try to focus more on the rhythm.';
//     } else {
//       calculatedScore = 50;
//       feedbackText = 'Keep practicing. Remember to count carefully for the full 15 seconds.';
//     }
    
//     setScore(calculatedScore);
//     setFeedback(feedbackText);
//     setStage('result');
    
//     // Create simulation result
//     const result: SimulationResult = {
//       id: Date.now().toString(),
//       simulationType: 'pulse-checking',
//       studentId: user.id,
//       score: calculatedScore,
//       details: {
//         actualPulseRate,
//         userCount: parseInt(userInput),
//         userRate: userRate,
//         difference,
//         attempts
//       },
//       completedAt: new Date()
//     };
    
//     onComplete(result);
//   };

//   const resetSimulation = () => {
//     setStage('intro');
//     setHandPosition({ x: 0, y: 0 });
//     setIsInPulseZone(false);
//     setIsHolding(false);
//     setCountdown(15);
//     setPulseCount(0);
//     setUserInput('');
//     setScore(0);
//     setFeedback('');
//   };

//   const renderIntro = () => (
//     <div className="text-center max-w-2xl mx-auto">
//       <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//         <Timer className="w-10 h-10 text-red-600" />
//       </div>
//       <h2 className="text-2xl font-bold text-gray-900 mb-4">Pulse Checking Simulation</h2>
//       <p className="text-gray-600 mb-8">
//         In this simulation, you'll practice taking a patient's pulse. You'll need to place your fingers 
//         on the pulse point, hold steady for 15 seconds, count the beats, and calculate the heart rate.
//       </p>
      
//       <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
//         <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//           <Info className="w-5 h-5" />
//           Instructions:
//         </h3>
//         <ol className="text-blue-800 space-y-2 text-sm">
//           <li>1. Drag the two-finger hand icon to the pulse zone on the wrist</li>
//           <li>2. Hold your mouse button down for the full 15 seconds</li>
//           <li>3. Count the pulse beats you hear during this time</li>
//           <li>4. Enter your count when prompted</li>
//           <li>5. The system will calculate your accuracy</li>
//         </ol>
//       </div>
      
//       <button
//         onClick={startSimulation}
//         className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
//       >
//         Start Practice
//       </button>
//     </div>
//   );

//   const renderPractice = () => (
//     <div className="max-w-4xl mx-auto">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Find the Pulse Point</h2>
//         <p className="text-gray-600">Drag the hand icon to the highlighted pulse zone on the wrist</p>
//       </div>
      
//       <div 
//         className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 mx-auto"
//         style={{ width: '600px', height: '400px' }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={() => setIsDragging(false)}
//       >
//         {/* Virtual Hand/Wrist */}
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//           <div className="relative">
//             {/* Wrist */}
//             <div className="w-32 h-48 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full relative">
//               {/* Pulse Zone */}
//               <div 
//                 ref={pulseZoneRef}
//                 className={`absolute w-8 h-8 rounded-full border-2 border-dashed transition-all ${
//                   isInPulseZone ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'
//                 }`}
//                 style={{ top: '60px', left: '20px' }}
//               >
//                 <div className="absolute inset-0 rounded-full animate-pulse bg-red-300 opacity-50"></div>
//               </div>
              
//               {/* Wrist Label */}
//               <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
//                 <p className="text-sm font-medium text-gray-700">Patient's Wrist</p>
//                 <p className="text-xs text-gray-500">Find the radial pulse</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Draggable Hand Icon */}
//         <div
//           ref={handRef}
//           className={`absolute w-10 h-10 bg-white rounded-full shadow-lg border-2 cursor-move transition-all z-10 ${
//             isDragging ? 'scale-110 border-blue-500' : 'border-gray-300'
//           } ${isInPulseZone ? 'border-green-500' : ''}`}
//           style={{ 
//             left: `${handPosition.x}px`, 
//             top: `${handPosition.y}px`,
//             transform: 'translate(-50%, -50%)'
//           }}
//         >
//           <div className="w-full h-full flex items-center justify-center">
//             <div className="text-xs">✌️</div>
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
//           <p className="text-sm text-gray-600">
//             {isInPulseZone 
//               ? "Perfect! Now hold your mouse button down for 15 seconds" 
//               : "Drag the hand icon to the red pulse zone"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderMeasuring = () => (
//     <div className="text-center max-w-2xl mx-auto">
//       <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
//         <Timer className="w-12 h-12 text-green-600" />
//         <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse"></div>
//       </div>
      
//       <h2 className="text-3xl font-bold text-gray-900 mb-4">Measuring Pulse</h2>
//       <p className="text-gray-600 mb-8">Hold steady and count the beats you hear</p>
      
//       <div className="bg-green-50 rounded-2xl p-8 mb-8">
//         <div className="text-6xl font-bold text-green-600 mb-4">{countdown}</div>
//         <p className="text-green-800 font-medium">seconds remaining</p>
        
//         {/* Visual pulse indicator */}
//         <div className="mt-6 flex justify-center">
//           <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
//         </div>
//         <p className="text-sm text-green-700 mt-2">🔊 Listen for the pulse sounds</p>
//       </div>
      
//       <p className="text-sm text-gray-500">
//         Keep your fingers steady on the pulse point. Count each beat you hear.
//       </p>
//     </div>
//   );

//   const renderInput = () => (
//     <div className="text-center max-w-2xl mx-auto">
//       <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//         <Target className="w-10 h-10 text-blue-600" />
//       </div>
      
//       <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Your Count</h2>
//       <p className="text-gray-600 mb-8">
//         How many pulse beats did you count during the 15-second period?
//       </p>
      
//       <div className="bg-gray-50 rounded-xl p-8 mb-8">
//         <label className="block text-sm font-medium text-gray-700 mb-4">
//           Number of beats counted in 15 seconds:
//         </label>
//         <input
//           type="number"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           className="w-32 text-2xl font-bold text-center p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="0"
//           min="0"
//           max="50"
//         />
//         <p className="text-sm text-gray-500 mt-4">
//           This will be multiplied by 4 to get the heart rate per minute
//         </p>
//       </div>
      
//       <button
//         onClick={submitAnswer}
//         disabled={!userInput}
//         className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
//       >
//         Submit Answer
//       </button>
//     </div>
//   );

//   const renderResult = () => (
//     <div className="text-center max-w-2xl mx-auto">
//       <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
//         score >= 80 ? 'bg-green-100' : score >= 70 ? 'bg-yellow-100' : 'bg-red-100'
//       }`}>
//         {score >= 80 ? (
//           <Check className="w-10 h-10 text-green-600" />
//         ) : score >= 70 ? (
//           <Award className="w-10 h-10 text-yellow-600" />
//         ) : (
//           <X className="w-10 h-10 text-red-600" />
//         )}
//       </div>
      
//       <h2 className="text-2xl font-bold text-gray-900 mb-4">Simulation Complete!</h2>
//       <p className="text-gray-600 mb-8">{feedback}</p>
      
//       <div className="bg-gray-50 rounded-xl p-8 mb-8">
//         <h3 className="font-semibold text-gray-900 mb-4">Results Summary</h3>
//         <div className="grid grid-cols-2 gap-6 text-center">
//           <div>
//             <p className="text-2xl font-bold text-blue-600">{score}%</p>
//             <p className="text-sm text-gray-600">Your Score</p>
//           </div>
//           <div>
//             <p className="text-2xl font-bold text-gray-900">{actualPulseRate}</p>
//             <p className="text-sm text-gray-600">Actual BPM</p>
//           </div>
//           <div>
//             <p className="text-2xl font-bold text-gray-900">{parseInt(userInput) || 0}</p>
//             <p className="text-sm text-gray-600">Your Count (15s)</p>
//           </div>
//           <div>
//             <p className="text-2xl font-bold text-gray-900">{parseInt(userInput) * 4 || 0}</p>
//             <p className="text-sm text-gray-600">Your BPM</p>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex gap-4 justify-center">
//         <button
//           onClick={startSimulation}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//         >
//           <RotateCcw className="w-4 h-4" />
//           Practice Again
//         </button>
//         <button
//           onClick={onBack}
//           className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
//         >
//           Back to Simulations
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <button
//             onClick={onBack}
//             className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Pulse Checking Simulation</h1>
//             <p className="text-gray-600">Practice proper pulse assessment technique</p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//           {stage === 'intro' && renderIntro()}
//           {stage === 'practice' && renderPractice()}
//           {stage === 'measuring' && renderMeasuring()}
//           {stage === 'input' && renderInput()}
//           {stage === 'result' && renderResult()}
//         </div>
//       </div>
//     </div>
//   );
// };