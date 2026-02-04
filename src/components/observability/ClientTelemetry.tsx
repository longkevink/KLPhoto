'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

function logClientError(type: 'error' | 'unhandledrejection', payload: unknown) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`[client-${type}]`, payload);
    }
}

export default function ClientTelemetry() {
    useReportWebVitals((metric) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('[web-vital]', metric.name, Math.round(metric.value * 100) / 100);
        }
    });

    useEffect(() => {
        const onError = (event: ErrorEvent) => {
            logClientError('error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
            });
        };

        const onUnhandledRejection = (event: PromiseRejectionEvent) => {
            logClientError('unhandledrejection', event.reason);
        };

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onUnhandledRejection);

        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onUnhandledRejection);
        };
    }, []);

    return null;
}
