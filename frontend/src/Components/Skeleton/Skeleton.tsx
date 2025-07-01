import React from 'react';
import "./Skeleton.scss";

const Skeleton: React.FC = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-item" style={{ width: '100%', height: '30px' }} />
      <div className="skeleton-item" style={{ width: '80%', height: '20px', marginTop: '15px' }} />
      <div className="skeleton-item" style={{ width: '60%', height: '20px', marginTop: '10px' }} />
      <div className="skeleton-item" style={{ width: '90%', height: '100px', marginTop: '20px' }} />
    </div>
  );
};

export default Skeleton;