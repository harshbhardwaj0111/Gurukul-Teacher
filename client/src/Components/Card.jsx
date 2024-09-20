// src/components/Card.js
import React from 'react';

const Card = ({ title, value, iconClass }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
      <div className="bg-blue-100 p-6 rounded-full">
        <i className={`text-blue-500 text-xl ${iconClass}`}></i>
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-2xl mt-2">{value}</p>
      </div>
    </div>
  );
};

export default Card;