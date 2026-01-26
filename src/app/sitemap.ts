import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generation for SEO
 * Lists all routes for search engine discovery
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://kevinlongphotography.com'; // Replace with actual domain

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/exhibit`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/links`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
