import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type] || 'bg-gray-500';

  return (
    <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-pulse`}>
      {message}
    </div>
  );
};

export default Toast;
