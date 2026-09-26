import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    private readonly title = inject(Title);
    private readonly meta = inject(Meta);

    updateSeo(
        title: string,
        description: string,
        url: string,
        image?: string,
        type: string = 'website'
    ): void {

        this.title.setTitle(title);

        this.meta.updateTag({
            name: 'description',
            content: description
        });

        this.meta.updateTag({
            name: 'robots',
            content: 'index, follow'
        });

        // Open Graph
        this.meta.updateTag({
            property: 'og:title',
            content: title
        });

        this.meta.updateTag({
            property: 'og:description',
            content: description
        });

        this.meta.updateTag({
            property: 'og:url',
            content: url
        });

        this.meta.updateTag({
            property: 'og:type',
            content: type
        });

        this.meta.updateTag({
            property: 'og:site_name',
            content: 'Dr. Ofori Gyne Clinic'
        });

        if (image) {
            this.meta.updateTag({
                property: 'og:image',
                content: image
            });
        }

        // Twitter / X
        this.meta.updateTag({
            name: 'twitter:title',
            content: title
        });

        this.meta.updateTag({
            name: 'twitter:description',
            content: description
        });

        this.meta.updateTag({
            name: 'twitter:card',
            content: image ? 'summary_large_image' : 'summary'
        });

        if (image) {
            this.meta.updateTag({
                name: 'twitter:image',
                content: image
            });
        }
    }
}