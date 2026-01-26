import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration
 * Allows all crawlers access to all routes
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://kevinlongphotography.com'; // Replace with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
