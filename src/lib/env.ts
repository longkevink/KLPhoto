const REQUIRED_SERVER_ENV = ['CLOUDINARY_URL', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const;
const REQUIRED_PUBLIC_ENV = ['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] as const;

function getMissingEnv(keys: readonly string[]) {
    return keys.filter((key) => !process.env[key]);
}

export function validateEnv() {
    const missingServer = getMissingEnv(REQUIRED_SERVER_ENV);
    const missingPublic = getMissingEnv(REQUIRED_PUBLIC_ENV);

    if (missingServer.length === 0 && missingPublic.length === 0) return;

    const parts: string[] = [];
    if (missingPublic.length > 0) {
        parts.push(`missing public env: ${missingPublic.join(', ')}`);
    }
    if (missingServer.length > 0) {
        parts.push(`missing server env: ${missingServer.join(', ')}`);
    }

    console.warn(`[env] ${parts.join(' | ')}. The app will use safe fallbacks where possible.`);
}
