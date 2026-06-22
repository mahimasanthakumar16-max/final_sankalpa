export default {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Site Title',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Site Description',
            type: 'text',
        },
        {
            name: 'logo',
            title: 'Logo',
            type: 'image',
        },
        {
            name: 'navLinks',
            title: 'Navigation Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Title', type: 'string' },
                        { name: 'url', title: 'URL', type: 'string' },
                    ],
                },
            ],
        },
        {
            name: 'footerText',
            title: 'Footer Copyright Text',
            type: 'string',
        },
        {
            name: 'socialLinks',
            title: 'Social Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'platform', title: 'Platform', type: 'string' },
                        { name: 'url', title: 'URL', type: 'string' },
                    ],
                },
            ],
        },
        {
            name: 'seo',
            title: 'Default SEO Settings',
            type: 'object',
            fields: [
                { name: 'metaTitle', title: 'Meta Title', type: 'string' },
                { name: 'metaDescription', title: 'Meta Description', type: 'text' },
                { name: 'ogImage', title: 'Open Graph Image', type: 'image' },
                { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] },
            ],
        },
    ],
}
