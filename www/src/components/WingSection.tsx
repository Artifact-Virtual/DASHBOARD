import React from 'react';

interface WingSectionProps {
  id: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  children?: React.ReactNode;
}

const WingSection: React.FC<WingSectionProps> = ({ id, title, description, visual, children }) => (
  <section id={id} className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center py-16 px-4 gap-10 bg-black text-white border-b border-white/10">
    <div className="flex-1 flex flex-col items-center md:items-start">
      <h2 className="text-4xl md:text-5xl font-thin mb-4 tracking-widest uppercase drop-shadow-lg">{title}</h2>
      <p className="text-lg md:text-xl text-white/80 mb-6 max-w-xl">{description}</p>
      {children}
    </div>
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      {visual}
    </div>
  </section>
);

export default WingSection;
