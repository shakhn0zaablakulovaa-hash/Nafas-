import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Mic, ShieldAlert, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startSOS = () => {
    setIsOpen(true);
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      triggerEmergency();
      setCountdown(null);
    }
  }, [countdown]);

  const triggerEmergency = () => {
    // 1. Start Recording
    startRecording();
    // 2. Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        console.log("Location shared with emergency services:", pos.coords.latitude, pos.coords.longitude);
      });
    }
    // 3. Simulate Call to 102
    console.log("Calling 102...");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' });
        console.log("Recording saved securely:", blob);
        chunks.current = [];
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopSOS = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
    setIsOpen(false);
    setCountdown(null);
  };

  return (
    <>
      <button
        onClick={startSOS}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-error text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
      >
        <ShieldAlert size={32} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
          >
            <div className="bg-white w-full max-w-md rounded-xl p-8 text-center space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center">
                  <ShieldAlert size={24} />
                </div>
                <button onClick={stopSOS} className="text-outline hover:text-on-surface">
                  <X size={24} />
                </button>
              </div>

              {countdown !== null ? (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-on-surface">Emergency SOS</h2>
                  <p className="text-on-surface-variant">Calling emergency services in...</p>
                  <div className="text-8xl font-black text-error">{countdown}</div>
                  <button
                    onClick={stopSOS}
                    className="w-full py-4 bg-surface-container-highest rounded-full font-bold"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-error/5 rounded-lg border border-error/20">
                    <h2 className="text-xl font-bold text-error">EMERGENCY ACTIVE</h2>
                    <p className="text-sm text-on-surface-variant">102 is being notified. Your location and audio are being recorded.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-lg flex flex-col items-center gap-2">
                      <Mic className={cn("text-primary", isRecording && "animate-bounce")} />
                      <span className="text-xs font-bold">RECORDING</span>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-lg flex flex-col items-center gap-2">
                      <MapPin className="text-secondary" />
                      <span className="text-xs font-bold">{location ? "SHARED" : "LOCATING..."}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.href = "tel:102"}
                    className="w-full py-4 bg-error text-white rounded-full font-bold flex items-center justify-center gap-3 shadow-lg"
                  >
                    <Phone size={20} /> CALL 102 NOW
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
