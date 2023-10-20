'use client';
import React from 'react';
import TypewriterComponent from 'typewriter-effect';

export const TypewriterTitle = () => {
  return (
    <TypewriterComponent
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString('Supercharged Productivity.')
          .pauseFor(1000)
          .deleteAll()
          .typeString('AI-Powered Insights.')
          .start();
      }}
    />
  );
};
