'use client';

import { useAppSelector } from '@/store/hook';

const UserAvatar = () => {
  const { user } = useAppSelector((state) => state.user);

  if (!user) return null;

  const initial = user.firstName?.[0]?.toUpperCase() || 'Y';

  return (
    <div className="w-[30px] h-[30px] rounded-full bg-gray-500 flex items-center justify-center text-white text-[22px] flex-shrink-0 overflow-hidden">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="Profile Picture" className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};

export default UserAvatar;
