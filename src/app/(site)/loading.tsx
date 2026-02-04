export default function SiteLoading() {
    return (
        <div className="min-h-screen pt-28 px-6">
            <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
                <div className="h-10 w-72 bg-neutral-100 rounded" />
                <div className="h-4 w-96 bg-neutral-100 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="aspect-[3/2] bg-neutral-100 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );
}
