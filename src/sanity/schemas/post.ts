export default {
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
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
            name: 'excerpt',
            title: 'Excerpt / Summary',
            type: 'text',
            rows: 3,
            description: 'Short summary shown on blog cards and featured article.',
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Draft', value: 'draft' },
                    { title: 'Published', value: 'published' },
                    { title: 'Scheduled', value: 'scheduled' },
                ],
                layout: 'radio',
            },
            initialValue: 'draft',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'featured',
            title: 'Featured Article',
            type: 'boolean',
            description: 'Display this post as the featured article on the blog page.',
            initialValue: false,
        },
        {
            name: 'author',
            title: 'Author',
            type: 'string',
        },
        {
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                },
            ],
        },
        {
            name: 'gallery',
            title: 'Gallery Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative text',
                        },
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        },
                    ],
                },
            ],
        },
        {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'category' } }],
        },
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        },
        {
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
        },
        {
            name: 'body',
            title: 'Body',
            type: 'blockContent',
        },
        {
            name: 'readingTime',
            title: 'Reading Time (minutes)',
            type: 'number',
        },
        {
            name: 'downloads',
            title: 'Downloads',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Download',
                    fields: [
                        {
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'file',
                            title: 'File',
                            type: 'file',
                            options: {
                                accept: '.pdf,.doc,.docx,.txt,.zip',
                            },
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                            rows: 2,
                        },
                    ],
                },
            ],
        },
        {
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            fields: [
                { name: 'metaTitle', title: 'Meta Title', type: 'string' },
                { name: 'metaDescription', title: 'Meta Description', type: 'text' },
                { name: 'openGraphImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true } },
            ],
        },
    ],
    orderings: [
        {
            title: 'Published Date, Newest First',
            name: 'publishedAtDesc',
            by: [
                { field: 'publishedAt', direction: 'desc' },
            ],
        },
        {
            title: 'Published Date, Oldest First',
            name: 'publishedAtAsc',
            by: [
                { field: 'publishedAt', direction: 'asc' },
            ],
        },
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author',
            media: 'mainImage',
        },
        prepare(selection: any) {
            const { author } = selection;
            return Object.assign({}, selection, {
                subtitle: author && `by ${author}`,
            });
        },
    },
}
