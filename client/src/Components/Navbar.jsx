import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-blue-800 p-4 flex justify-between items-start shadow-md">
      <div className="text-white ">
        <h1 className='text-xl font-bold'>Gurukul</h1>
        <p>Digitize your School</p>
      </div>
      <div className="flex items-center">
        <span className="text-white mr-4">User Name</span>
        <button className="bg-white text-light-blue-500 px-4 py-2 rounded hover:bg-gray-200 font-semibold">
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
      <button onClick={toggleSidebar} className="text-white md:hidden ml-4">
        <i className="fas fa-bars"></i>
      </button>
    </nav>
  );
};

export default Navbar;