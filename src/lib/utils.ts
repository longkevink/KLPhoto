import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isAdminMode() {
    return process.env.NEXT_PUBLIC_ADMIN_MODE === 'true';
}
