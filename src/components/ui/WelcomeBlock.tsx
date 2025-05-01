'use client';

import WelcomeIcon from '@/icons/WelcomeIcon/WelcomeIcon';

const WelcomeBlock = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-6">
      <div className="mb-6">
        <WelcomeIcon />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to YurBot!</h1>
      <p className="text-gray-500 text-sm">
        Start exploring conversations once you create your first chat!
      </p>
    </div>
  );
};

export default WelcomeBlock;
