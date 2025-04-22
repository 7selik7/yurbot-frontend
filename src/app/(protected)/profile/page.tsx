'use client';

import { useAppSelector } from '@/store/hook';

export default function Profile() {
  const { user } = useAppSelector((state) => state.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-lg">
        Пользователь не найден
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-md p-8 text-gray-800">
      <div className="flex items-center gap-6">
        {/* Аватар или заглушка */}
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500">
            {user.email.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold">
            {user.firstName || 'Имя не указано'} {user.lastName || ''}
          </h2>
          <p className="text-gray-600">{user.email}</p>
          <p
            className={`text-sm font-medium ${
              user.isConfirmed ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {user.isConfirmed ? 'Подтвержденный аккаунт' : 'Аккаунт не подтвержден'}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">UUID:</span>
          <div className="font-mono text-sm">{user.uuid}</div>
        </div>
        <div>
          <span className="text-gray-500">Первый вход:</span>
          <div>{user.isFirstLogin ? 'Да' : 'Нет'}</div>
        </div>
        <div>
          <span className="text-gray-500">Создан:</span>
          <div>{new Date(user.createdAt).toLocaleString()}</div>
        </div>
        <div>
          <span className="text-gray-500">Обновлен:</span>
          <div>{new Date(user.updatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
