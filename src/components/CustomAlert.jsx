import React, { useEffect, useState } from 'react';

function CustomAlert({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-1/2 justify-items-center transform -translate-x-1/2 mt-4
        px-6 py-3 rounded-md text-white shadow-lg z-50 transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
      `}
    >
      {message}
    </div>
  );
}

export default CustomAlert;
