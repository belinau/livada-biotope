import React from 'react';
import Hero from './Hero';

const HomeHero = ({ title, subtitle, language = 'sl' }) => {
  return (
    <Hero title={title} subtitle={subtitle} language={language} />
  );
};

export default HomeHero;