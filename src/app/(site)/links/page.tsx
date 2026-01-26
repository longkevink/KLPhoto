import { Metadata } from 'next';
import LinksClient from '@/components/links/LinksClient';

export const metadata: Metadata = {
    title: 'Links',
    description: 'Connect with Kevin Long Photography on social media or visit the print shop.',
};

export default function LinksPage() {
    return <LinksClient />;
}
