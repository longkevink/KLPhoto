import React from 'react';
import { Briefcase, Building2, Grid3X3, Home, Layout, Square } from 'lucide-react';
import { GalleryEnvironment, LayoutTemplate, PhotoCard } from '@/content/types';

export interface WallTransform {
    x: number;
    y: number;
    scale: number;
}

export const DEFAULT_TRANSFORMS: Record<GalleryEnvironment, Record<LayoutTemplate, WallTransform>> = {
    home: {
        single: { x: 0, y: 0, scale: 1 },
        'gallery-6': { x: 0, y: 0, scale: 1 },
        'collage-5': { x: 0, y: 0, scale: 1 },
        'collage-7': { x: 0, y: 0, scale: 1 },
        'collage-9': { x: 0, y: 0, scale: 1 },
    },
    office: {
        single: { x: 0, y: 0, scale: 1 },
        'gallery-6': { x: 0, y: 0, scale: 1 },
        'collage-5': { x: 0, y: 0, scale: 1 },
        'collage-7': { x: 0, y: 0, scale: 1 },
        'collage-9': { x: 0, y: 0, scale: 1 },
    },
    business: {
        single: { x: 0, y: 0, scale: 1 },
        'gallery-6': { x: 0, y: 0, scale: 1 },
        'collage-5': { x: 0, y: 0, scale: 1 },
        'collage-7': { x: 0, y: 0, scale: 1 },
        'collage-9': { x: 0, y: 0, scale: 1 },
    },
};

export const ENVIRONMENTS: { id: GalleryEnvironment; icon: React.ElementType; label: string }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'office', icon: Building2, label: 'Office' },
    { id: 'business', icon: Briefcase, label: 'Business' },
];

export const LAYOUTS: { id: LayoutTemplate; icon: React.ElementType; label: string }[] = [
    { id: 'single', icon: Square, label: 'Single' },
    { id: 'gallery-6', icon: Grid3X3, label: 'Grid' },
    { id: 'collage-5', icon: Layout, label: 'Collage' },
];

export const EMPTY_SLOTS: (PhotoCard | null)[] = Array(9).fill(null);

export function getSlotCount(layout: LayoutTemplate) {
    switch (layout) {
        case 'single':
            return 1;
        case 'gallery-6':
            return 6;
        case 'collage-5':
            return 5;
        case 'collage-7':
            return 7;
        case 'collage-9':
            return 9;
        default:
            return 1;
    }
}
