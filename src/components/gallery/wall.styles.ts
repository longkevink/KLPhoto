import { CSSProperties } from 'react';
import { FrameStyle, LayoutTemplate } from '@/content/types';

export type GridConfig = {
    container: string;
    item: string;
};

export function getFrameStyles(style: FrameStyle, performanceMode: boolean): CSSProperties {
    if (performanceMode) {
        switch (style) {
            case 'thin-black':
                return { border: '10px solid #1a1a1a', backgroundColor: '#1a1a1a' };
            case 'thin-white':
                return { border: '10px solid #f5f5f5', backgroundColor: '#f5f5f5' };
            case 'natural-wood':
                return { border: '12px solid #8B5E3C', backgroundColor: '#8B5E3C' };
            default:
                return { border: '10px solid #1a1a1a', backgroundColor: '#1a1a1a' };
        }
    }

    const baseShadow = '0 10px 20px -5px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.3)';

    switch (style) {
        case 'thin-black':
            return {
                border: '12px solid #1a1a1a',
                boxShadow: `inset 0 0 2px rgba(255,255,255,0.1), ${baseShadow}`,
                backgroundColor: '#1a1a1a',
            };
        case 'thin-white':
            return {
                border: '12px solid #f5f5f5',
                boxShadow: `inset 0 0 2px rgba(0,0,0,0.05), ${baseShadow}`,
                backgroundColor: '#f5f5f5',
            };
        case 'natural-wood':
            return {
                border: '14px solid #8B5E3C',
                backgroundImage:
                    'linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent), linear-gradient(0deg, #8B5E3C, #A06F4B)',
                backgroundSize: '4px 4px, 100% 100%',
                boxShadow: `inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.2), ${baseShadow}`,
            };
        default:
            return { border: '10px solid black' };
    }
}

export function getGridConfig(template: LayoutTemplate): GridConfig {
    switch (template) {
        case 'single':
            return {
                container: 'flex items-center justify-center w-full h-full p-4',
                item: 'relative w-auto h-auto max-h-[90%] max-w-[90%] flex items-center justify-center',
            };
        case 'gallery-6':
            return {
                container: 'grid grid-cols-3 grid-rows-2 gap-6 w-full h-full items-center content-center px-4',
                item: 'w-full h-full flex items-center justify-center',
            };
        case 'collage-5':
            return {
                container: 'grid grid-cols-6 gap-3 w-full h-full items-center content-center px-4',
                item: 'w-full flex items-center justify-center',
            };
        case 'collage-7':
            return {
                container: 'grid grid-cols-4 gap-3 w-full h-full items-center content-center px-4',
                item: 'w-full flex items-center justify-center',
            };
        case 'collage-9':
            return {
                container: 'grid grid-cols-3 gap-3 w-full h-full items-center content-center px-4',
                item: 'w-full aspect-square flex items-center justify-center',
            };
        default:
            return { container: '', item: '' };
    }
}
