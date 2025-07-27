
import React from 'react';

const API = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <iframe
        src="https://artifactvirtual.com/api-docs"
        title="API Documentation"
        className="w-full h-screen border-0 rounded-lg shadow-lg"
        style={{ minHeight: '80vh', background: 'white' }}
      />
    </div>
  );
};

export default API;
