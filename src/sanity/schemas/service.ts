export default {
    name: 'service',
    title: 'Services',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Service Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'icon',
            title: 'Icon Name (Lucide Icon Name)',
            type: 'string',
            description: 'e.g., Heart, Users, Sparkles',
        },
        {
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
            rows: 3,
        },
        {
            name: 'concerns',
            title: 'Ideal For / Concerns',
            type: 'text',
            description: 'e.g., Anxiety, depression, life transitions.',
        },
        {
            name: 'description',
            title: 'Full Description',
            type: 'blockContent',
        },
        {
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'outcomes',
            title: 'Therapy Outcomes',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'ctaText',
            title: 'CTA Text',
            type: 'string',
        },
        {
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            fields: [
                { name: 'metaTitle', title: 'Meta Title', type: 'string' },
                { name: 'metaDescription', title: 'Meta Description', type: 'text' },
            ],
        },
    ],
}
