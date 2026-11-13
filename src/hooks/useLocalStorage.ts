import { useEffect, useState } from 'react';

/**
 * Custom hook для синхронізації стану з localStorage.
 * Безпечно обробляє пошкоджений JSON та помилки доступу до сховища.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ігноруємо помилки квоти або приватного режиму браузера
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
