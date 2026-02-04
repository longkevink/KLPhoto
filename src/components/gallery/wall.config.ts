import { GalleryEnvironment, LayoutTemplate } from '@/content/types';

export type WallZoneDisplay = {
    top: string;
    left: string;
    width: string;
    height: string;
};

export type WallZoneOverrideKey = LayoutTemplate | 'single-portrait' | 'single-landscape';

export type WallZone = WallZoneDisplay & {
    overrides?: Partial<Record<WallZoneOverrideKey, Partial<WallZoneDisplay>>>;
};

export const ENV_BACKGROUNDS: Record<GalleryEnvironment, { id: string; fallback: string }> = {
    home: { id: 'home_ehrv5c', fallback: '/photos/travel-01.jpg' },
    office: { id: 'OFFICE_BACKGROUND_pjldjl', fallback: '/photos/moments-01.jpg' },
    business: { id: 'coffeehouse_qg2maq', fallback: '/photos/street-01.jpg' },
};

export const WALL_ZONES: Record<GalleryEnvironment, WallZone> = {
    home: {
        top: '19%',
        left: '35.25%',
        width: '29.5%',
        height: '19.6%',
        overrides: {
            'single-landscape': {
                top: '22%',
                left: '40.25%',
                width: '19.5%',
                height: '17.2%',
            },
            'single-portrait': {
                top: '8.85%',
                left: '42.08%',
                width: '15.85%',
                height: '40.01%',
            },
        },
    },
    office: {
        top: '25%',
        left: '16.25%',
        width: '47.5%',
        height: '42.75%',
        overrides: {
            'single-portrait': {
                top: '27%',
                left: '28.6%',
                width: '22.8%',
                height: '42.75%',
            },
        },
    },
    business: {
        top: '18%',
        left: '32.8%',
        width: '34.4%',
        height: '27.5%',
        overrides: {
            'single-landscape': {
                top: '20%',
                left: '33.8%',
                width: '32.4%',
                height: '28.4%',
            },
            'single-portrait': {
                top: '18%',
                left: '41.9%',
                width: '16.2%',
                height: '36.5%',
            },
        },
    },
};
