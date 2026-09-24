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
        url: string
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
            content: 'website'
        });

        this.meta.updateTag({
            property: 'og:site_name',
            content: 'Dr. Ofori Gyne Clinic'
        });

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
            content: 'summary_large_image'
        });
    }
}