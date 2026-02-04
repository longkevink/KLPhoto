'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useAdaptiveMotion() {
    const prefersReducedMotion = useReducedMotion();

    const isConstrainedDevice = useMemo(() => {
        if (typeof navigator === 'undefined') return false;
        return navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
    }, []);

    return prefersReducedMotion || isConstrainedDevice;
}
