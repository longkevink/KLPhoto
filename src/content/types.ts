/**
 * Photo Content Types
 * Strict TypeScript definitions for the photography portfolio
 */

/** Categories for organizing photos */
export type PhotoCategory = 'street' | 'travel' | 'moments';

/** Photo orientation determines display aspect ratio */
export type PhotoOrientation = 'landscape' | 'portrait';

/**
 * Photo metadata schema
 * All fields are required except series (optional grouping)
 */
export interface Photo {
    /** Unique identifier for the photo */
    id: string;

    /** Local path under /public (e.g., "/photos/street-01.jpg") */
    src: string;

    /** Meaningful alt text for accessibility - must not be empty */
    alt: string;

    /** Editorial display title */
    title: string;

    /** Category grouping */
    category: PhotoCategory;

    /** Optional series/collection grouping */
    series?: string;

    /** Image orientation */
    orientation: PhotoOrientation;

    /** Native image width in pixels */
    width: number;

    /** Native image height in pixels */
    height: number;

    /** Featured photos appear on Home and Selected Works */
    featured: boolean;

    /** Direct link to Etsy listing for this print */
    etsyUrl: string;

    /** Optional Cloudinary public ID for cloud-hosted images */
    cloudinaryId?: string;
}

/**
 * Frame style options for Gallery wall visualization
 */
export type FrameStyle = 'thin-black' | 'thin-white' | 'natural-wood';

/**
 * Mat options for framed prints
 */
export type MatOption = 'none' | 'white';

/**
 * Gallery environment backgrounds
 */
export type GalleryEnvironment = 'home' | 'office' | 'business';

/**
 * Layout templates for Gallery wall
 */
export type LayoutTemplate =
    | 'single'      // Single photo, native aspect
    | 'gallery-6'   // 3x2 grid (6 photos)
    | 'collage-5'   // 5 photos mixed format
    | 'collage-7'   // 7 photos mixed format
    | 'collage-9';  // 9 photos mixed format
