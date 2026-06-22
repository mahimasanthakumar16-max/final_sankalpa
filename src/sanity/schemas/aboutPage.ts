export default {
    name: 'aboutPage',
    title: 'About Page',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'biography',
            title: 'Therapist Biography',
            type: 'blockContent',
        },
        {
            name: 'credentials',
            title: 'Credentials & Education',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'philosophy',
            title: 'Therapy Philosophy',
            type: 'blockContent',
        },
        {
            name: 'aboutImage',
            title: 'About Image',
            type: 'image',
            options: { hotspot: true },
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
