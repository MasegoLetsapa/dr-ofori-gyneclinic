export interface Article {
    id: number;
    title: string;
    slug: string;
    category?: string | null;
    excerpt?: string | null;
    content: string;

    featuredMediaType: 'icon' | 'image';
    featuredImage?: string | null;
    featuredIcon?: string | null;

    author?: string | null;
    isPublished: boolean;
    publishedAt?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CreateArticleRequest {
    title: string;
    slug: string;
    category?: string | null;
    excerpt?: string | null;
    content: string;

    featuredMediaType: 'icon' | 'image';
    featuredImage?: string | null;
    featuredIcon?: string | null;

    author?: string | null;
    isPublished: boolean;
}

export interface UpdateArticleRequest {
    title: string;
    slug: string;
    category?: string | null;
    excerpt?: string | null;
    content: string;

    featuredMediaType: 'icon' | 'image';
    featuredImage?: string | null;
    featuredIcon?: string | null;

    author?: string | null;
    isPublished: boolean;
}