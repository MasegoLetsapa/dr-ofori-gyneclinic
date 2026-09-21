export interface Article {
    id: number;
    title: string;
    slug: string;
    category?: string | null;
    excerpt?: string | null;
    content?: string | null;

    featuredMediaType: 'icon' | 'image';
    featuredImage?: string | null;
    featuredIcon?: string | null;

    author?: string | null;
    publishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
}