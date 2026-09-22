import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';



import { AdminArticleService } from '../../../../core/services/admin-article.service';
import { Article, CreateArticleRequest, UpdateArticleRequest } from '../../../../core/models/article.model';
import { Icon, IconName } from '../../../../shared/icon/icon';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    Icon,
    QuillModule
  ],
  templateUrl: './article-editor.html',
  styleUrl: './article-editor.scss'
})
export class ArticleEditor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly articleService = inject(AdminArticleService);

  readonly isEditMode = signal(false);
  readonly articleId = signal<number | null>(null);

  readonly loadingArticle = signal(false);
  readonly error = signal<string | null>(null);

  readonly saving = signal(false);
  readonly saveSuccess = signal<string | null>(null);

  readonly currentArticleIsPublished = signal(false);

  readonly availableIcons: IconName[] = [
    'heart',
    'baby',
    'calendar',
    'screening',
    'ultrasound',
    'fertility',
    'wellness',
    'shield',
    'spark'
  ];

  readonly articleForm = this.fb.nonNullable.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(200)
    ]],

    slug: ['', [
      Validators.required,
      Validators.maxLength(220)
    ]],

    category: ['', [
      Validators.maxLength(100)
    ]],

    author: ['', [
      Validators.maxLength(150)
    ]],

    excerpt: ['', [
      Validators.maxLength(500)
    ]],

    content: ['', [
      Validators.required
    ]],

    featuredMediaType: ['icon' as 'icon' | 'image'],

    featuredImage: [''],

    featuredIcon: ['wellness' as IconName]
  });

  readonly quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],

      [
        { header: 1 },
        { header: 2 },
        { header: 3 }
      ],

      [
        { list: 'ordered' },
        { list: 'bullet' }
      ],

      [
        { align: [] }
      ],

      ['blockquote', 'link'],

      ['clean']
    ]
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      this.error.set('Invalid article ID.');
      return;
    }

    this.isEditMode.set(true);
    this.articleId.set(parsedId);

    this.loadArticle(parsedId);
  }

  private loadArticle(id: number): void {
    this.loadingArticle.set(true);
    this.error.set(null);

    this.articleService.getArticle(id).subscribe({
      next: (article) => {
        this.populateForm(article);
        this.loadingArticle.set(false);
      },

      error: (error) => {
        console.error('Failed to load article:', error);

        this.error.set(
          'Unable to load this article. Please try again.'
        );

        this.loadingArticle.set(false);
      }
    });
  }

  private populateForm(article: Article): void {
    this.currentArticleIsPublished.set(article.isPublished);

    const mediaType =
      article.featuredMediaType === 'image'
        ? 'image'
        : 'icon';

    const selectedIcon =
      this.availableIcons.includes(article.featuredIcon as IconName)
        ? article.featuredIcon as IconName
        : 'wellness';

    this.articleForm.patchValue({
      title: article.title,
      slug: article.slug,
      category: article.category ?? '',
      author: article.author ?? '',
      excerpt: article.excerpt ?? '',
      content: article.content ?? '',
      featuredMediaType: mediaType,
      featuredImage: article.featuredImage ?? '',
      featuredIcon: selectedIcon
    });
  }

  get pageTitle(): string {
    return this.isEditMode()
      ? 'Edit Article'
      : 'New Article';
  }

  get pageDescription(): string {
    return this.isEditMode()
      ? 'Update and manage this women’s health resource.'
      : 'Create a new women’s health resource for the clinic website.';
  }

  generateSlug(): void {
    const title = this.articleForm.controls.title.value;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    this.articleForm.controls.slug.setValue(slug);
  }

  setFeaturedMediaType(type: 'icon' | 'image'): void {
    this.articleForm.controls.featuredMediaType.setValue(type);
  }

  selectFeaturedIcon(icon: IconName): void {
    this.articleForm.controls.featuredIcon.setValue(icon);
  }

  cancel(): void {
    this.router.navigate(['/admin/articles']);
  }

  saveArticle(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      this.error.set('Please complete all required fields before saving.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.saveSuccess.set(null);

    const formValue = this.articleForm.getRawValue();

    const request: CreateArticleRequest | UpdateArticleRequest = {
      title: formValue.title.trim(),
      slug: formValue.slug.trim(),
      category: formValue.category.trim() || null,
      excerpt: formValue.excerpt.trim() || null,
      content: formValue.content,
      featuredMediaType: formValue.featuredMediaType,
      featuredImage:
        formValue.featuredMediaType === 'image'
          ? formValue.featuredImage.trim() || null
          : null,
      featuredIcon:
        formValue.featuredMediaType === 'icon'
          ? formValue.featuredIcon
          : null,
      author: formValue.author.trim() || null,
      isPublished: this.isEditMode()
        ? this.currentArticleIsPublished()
        : false
    };

    if (this.isEditMode() && this.articleId()) {
      this.articleService
        .updateArticle(this.articleId()!, request as UpdateArticleRequest)
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.saveSuccess.set('Article updated successfully.');

            setTimeout(() => {
              this.router.navigate(['/admin/articles']);
            }, 800);
          },
          error: (error) => {
            console.error('Failed to update article:', error);

            this.saving.set(false);
            this.error.set(
              error?.error?.message ||
              'Unable to update the article. Please try again.'
            );
          }
        });

      return;
    }

    this.articleService
      .createArticle(request as CreateArticleRequest)
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.saveSuccess.set('Article created successfully.');

          setTimeout(() => {
            this.router.navigate(['/admin/articles']);
          }, 800);
        },
        error: (error) => {
          console.error('Failed to create article:', error);

          this.saving.set(false);
          this.error.set(
            error?.error?.message ||
            'Unable to create the article. Please try again.'
          );
        }
      });
  }

  publishOrUnpublish(): void {
    const id = this.articleId();

    if (!id) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.saveSuccess.set(null);

    const request$ = this.currentArticleIsPublished()
      ? this.articleService.unpublishArticle(id)
      : this.articleService.publishArticle(id);

    request$.subscribe({
      next: () => {
        const newStatus = !this.currentArticleIsPublished();

        this.currentArticleIsPublished.set(newStatus);
        this.saving.set(false);

        this.saveSuccess.set(
          newStatus
            ? 'Article published successfully.'
            : 'Article unpublished successfully.'
        );
      },
      error: (error) => {
        console.error('Failed to change publication status:', error);

        this.saving.set(false);

        this.error.set(
          error?.error?.message ||
          'Unable to change the publication status. Please try again.'
        );
      }
    });
  }
}