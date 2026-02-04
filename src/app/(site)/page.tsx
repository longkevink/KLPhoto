import { getHomeGalleryPhotoCards, getHeroPhoto } from '@/lib/photos';
import Hero from '@/components/home/Hero';
import MasonryGallery from '@/components/home/MasonryGallery';
import { CustomLink } from '@/components/ui/Button';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kevin Long Photography',
    description:
        'Boutique photography gallery featuring travel, moments, and street prints available for purchase.',
};

export default function HomePage() {
    const featuredPhotos = getHomeGalleryPhotoCards(18);
    const heroPhoto = getHeroPhoto();

    return (
        <main className="min-h-screen-safe bg-background">
            {/* Hero Section */}
            <Hero photo={heroPhoto || undefined} />

            {/* Selected Works - Masonry gallery */}
            <section className="py-20 md:py-32 px-4 md:px-8 max-w-[1600px] mx-auto" aria-label="Selected Works">
                <div className="mb-10 md:mb-24 text-center">
                    <h2 className="font-serif text-lg md:text-2xl lg:text-3xl font-light tracking-wide text-foreground mb-3 md:mb-4">
                        Selected Works
                    </h2>
                    <div className="h-px w-16 bg-border mx-auto" />
                </div>

                <MasonryGallery photos={featuredPhotos} />
            </section>

            {/* Primary Pathways */}
            <section className="py-20 md:py-40 px-4 md:px-8 text-center" aria-label="Navigation">
                <div className="flex flex-col md:flex-row gap-4 md:gap-12 justify-center items-center">
                    <CustomLink
                        href="/exhibit"
                        variant="outline"
                        size="lg"
                        className="min-w-[220px] md:min-w-[240px] tracking-premium-wide uppercase text-xs tap-target"
                    >
                        Explore Exhibit
                    </CustomLink>
                    <CustomLink
                        href="/gallery"
                        variant="outline"
                        size="lg"
                        className="min-w-[220px] md:min-w-[240px] tracking-premium-wide uppercase text-xs tap-target"
                    >
                        Browse Gallery
                    </CustomLink>
                </div>
            </section>
        </main>
    );
}
