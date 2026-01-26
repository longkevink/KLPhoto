# Fine Art Portfolio: High-Resolution Hosting Strategy

This document outlines the architecture for hosting high-quality fine art photography while maintaining lightning-fast site performance.

## 1. The Core Philosophy: Decoupling Assets
Do not store high-resolution images in the GitHub repository or the `/public` folder. Instead, use a **Source vs. Delivery** model.

*   **Source:** Your master files (RAW, TIFF, or high-bitrate JPEG).
*   **Delivery:** Optimized, compressed, and responsive versions (WebP/AVIF) served via CDN.

## 2. Recommended Infrastructure

### Option A: The "All-in-One" (Cloudinary) - *Recommended*
*   **How it works:** You upload your master file to Cloudinary.
*   **Magic:** It uses "Dynamic Transformations." You request a URL like `.../w_1000,q_auto,f_auto/image.jpg`, and Cloudinary automatically resizes it, adjusts quality for the user's connection, and converts it to the best format for their browser.
*   **Pros:** Easiest to set up; excellent free tier; automatic Next.js integration.

### Option B: The Pro Setup (AWS S3 + Imgix)
*   **How it works:** Store masters in an S3 bucket. Imgix sits in front of it as an optimization layer.
*   **Pros:** Most cost-effective at very high volumes; complete control over storage.

## 3. Implementation in Next.js

### A. Configure `next.config.ts`
You must whitelist the external domain so Next.js can optimize images from it.
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // or your chosen host
      },
    ],
  },
};
```

### B. Use the Next.js `<Image />` Component
Always use the built-in component. It handles:
*   **Lazy Loading:** Images only load as they enter the viewport.
*   **Blur-up Placeholders:** Shows a tiny blurred version while the high-res file loads.
*   **Priority:** You can mark your "Hero" image to load instantly.

```tsx
import Image from 'next/image';

<Image 
  src={photo.src} 
  alt={photo.alt}
  width={photo.width}
  height={photo.height}
  placeholder="blur"
  loading="lazy"
/>
```

## 4. Next Steps
1.  **Select a Provider:** Create a free account on Cloudinary or Sanity.io (which has an integrated image CDN).
2.  **Migrate `photos.ts`:** Update the `src` paths from local strings (`/photos/...`) to remote URLs.
3.  **Implement "Blur-up":** Generate tiny (20px) base64 strings for each photo to use as placeholders for a "premium" loading feel.
