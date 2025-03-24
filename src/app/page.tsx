"use client";

import React, { Suspense, useState, useEffect } from "react";
import Background from "./components/Background";
import DecryptedText from './components/DecryptedText';
import SplashCursor from './Splashcursor';
import Dock from './components/Dock';
import dynamic from 'next/dynamic';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import useRemoveWatermark from './hooks/useRemoveWatermark';
import MetallicText from './components/MetallicText';

// Dynamically import Spline with no SSR to improve initial load time
const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/50 animate-pulse"></div>
});

// Loading component for the text
const LoadingText = () => (
  <div className="flex flex-col space-y-4">
    <div className="h-16 bg-gray-700/30 rounded animate-pulse w-64"></div>
    <div className="h-14 bg-gray-700/30 rounded animate-pulse w-32"></div>
    <div className="h-16 bg-gray-700/30 rounded animate-pulse w-64"></div>
  </div>
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [loopingEnabled, setLoopingEnabled] = useState(false);
  
  // Use the custom hook to remove Spline watermark
  useRemoveWatermark();

  // Handle Spline load event
  const onSplineLoad = () => {
    setIsLoaded(true);
    // Delay showing text to further improve perceived performance
    setTimeout(() => setShowText(true), 300);
    // Enable looping animations after the initial animation completes
    setTimeout(() => setLoopingEnabled(true), 5000);
  };

  // Dock items
  const items = [
    { icon: <VscHome size={24} className="text-purple-100" />, label: 'Home', onClick: () => alert('Home!') },
    { icon: <VscArchive size={24} className="text-purple-100" />, label: 'Archive', onClick: () => alert('Archive!') },
    { icon: <VscAccount size={24} className="text-purple-100" />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <VscSettingsGear size={24} className="text-purple-100" />, label: 'Settings', onClick: () => alert('Settings!') },
  ];

  const textStyle = "metallic font-horizon font-black";
  const encryptedStyle = "text-zinc-200 font-horizon font-black opacity-70";
  const parentStyle = "tracking-wider [filter:drop-shadow(0_0_10px_rgba(200,200,220,0.4))]";

  return (
    <>
      <Background />
      <SplashCursor />
      
      {/* Spline 3D scene in the background */}
      <div className="absolute z-0 spline-container" style={{ 
        top: '0',
        left: '25%', /* Adjust this value to shift horizontally */
        width: '90%', /* Adjust width as needed */
        height: '100%'
      }}>
        <Suspense fallback={<div className="w-full h-full bg-black flex items-center justify-center">Loading 3D scene...</div>}>
          <SplineComponent 
            scene="https://prod.spline.design/zerBqjqdoGPtpC51/scene.splinecode" 
            onLoad={onSplineLoad}
          />
          {/* Blur overlay for the watermark */}
          <div className="fixed bottom-0 right-0 w-[150px] h-[50px] z-[9999] backdrop-blur-xl bg-black/30"></div>
        </Suspense>
      </div>
      
      {/* Text stacked vertically on the left side */}
      <div className="flex items-center min-h-screen relative z-10">
        <div className="absolute left-[3%] top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 pointer-events-none">
          {!showText ? (
            <LoadingText />
          ) : (
            <>
              {/* WELCOME - with looping animation */}
              <div>
                <DecryptedText
                  text="Welcome"
                  animateOn={loopingEnabled ? "loop" : "view"}
                  revealDirection="start"
                  sequential={true}
                  speed={150}
                  maxIterations={50}
                  className={textStyle}
                  encryptedClassName={encryptedStyle}
                  parentClassName={`text-4xl md:text-7xl ${parentStyle}`}
                />
              </div>
              
              {/* TO - with looping animation */}
              <div>
                <DecryptedText
                  text="To"
                  animateOn={loopingEnabled ? "loop" : "view"}
                  revealDirection="center"
                  sequential={true}
                  speed={150}
                  maxIterations={50}
                  className={textStyle}
                  encryptedClassName={encryptedStyle}
                  parentClassName={`text-4xl md:text-7xl ${parentStyle}`}
                />
              </div>
              
              {/* AI VERSE - only using MetallicText */}
              <div>
                <MetallicText 
                  text="AiVerse"
                  fontFamily="Horizon, sans-serif"
                  fontSize={275}
                  className={`${parentStyle}`}
                  params={{
                    patternScale: 2.0,
                    refraction: 0.015,
                    edge: 1.0,
                    patternBlur: 0.005,
                    liquid: 0.07,
                    speed: 0.3
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Only show dock when everything else is loaded */}
      {isLoaded && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <Dock 
            items={items}
            panelHeight={75}
            baseItemSize={55}
            magnification={80}
          />
        </div>
      )}
    </>
  );
}
