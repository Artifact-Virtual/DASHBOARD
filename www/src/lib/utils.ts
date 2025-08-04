import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getColorClasses = (color: string) => {
  const colorMap = {
    cyan: 'w-6 h-6 text-cyan-400',
    green: 'w-6 h-6 text-green-400', 
    yellow: 'w-6 h-6 text-yellow-400',
    purple: 'w-6 h-6 text-purple-400',
    blue: 'w-6 h-6 text-blue-400',
    red: 'w-6 h-6 text-red-400',
    gray: 'w-6 h-6 text-gray-400'
  };
  
  return colorMap[color as keyof typeof colorMap] || 'w-6 h-6 text-gray-400';
};
