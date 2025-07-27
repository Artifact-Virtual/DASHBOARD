import React from 'react';


const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-precision">
      <iframe
        src="http://localhost:3000"
        width="100%"
        height="900"
        style={{ border: 'none' }}
        title="Dashboard"
      />
    </div>
  );
};

export default Dashboard;
