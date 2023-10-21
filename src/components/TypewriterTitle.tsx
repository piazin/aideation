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
          .typeString('Produtividade turbinada.')
          .pauseFor(1000)
          .deleteAll()
          .typeString('Insights baseados em IA.')
          .start();
      }}
    />
  );
};
