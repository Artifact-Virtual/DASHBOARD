import React from 'react';

const Test = () => {
  return (
    <div className="w-screen h-screen bg-red-500 flex items-center justify-center text-white text-2xl">
      <div className="text-center">
        <h1>TEST COMPONENT WORKING</h1>
        <img 
          src="/av-black-logo.png" 
          alt="Logo Test"
          className="w-32 h-32 mx-auto mt-4 object-contain border border-white"
        />
        <p className="mt-4">Logo should appear above with correct aspect ratio</p>
      </div>
    </div>
  );
};

export default Test;
