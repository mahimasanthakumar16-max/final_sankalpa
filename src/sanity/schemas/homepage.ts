export default {
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        {
            name: 'heroTitlePrefix',
            title: 'Hero Title Prefix (e.g., Cultivate)',
            type: 'string',
        },
        {
            name: 'heroTitleHighlight',
            title: 'Hero Title Highlight (Italicized text)',
            type: 'string',
        },
        {
            name: 'heroTitleSuffix',
            title: 'Hero Title Suffix (e.g., Wellness.)',
            type: 'string',
        },
        {
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'text',
        },
        {
            name: 'heroImage',
            title: 'Hero Background Image',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'ctaText',
            title: 'CTA Button Text',
            type: 'string',
        },
        {
            name: 'secondaryCtaText',
            title: 'Secondary CTA Button Text',
            type: 'string',
        },
        {
            name: 'introTitle',
            title: 'Intro Section Title',
            type: 'string',
        },
        {
            name: 'introText',
            title: 'Intro Section Text',
            type: 'text',
        },
        {
            name: 'showcaseTitle',
            title: 'Philosophy Showcase Title',
            type: 'string',
        },
        {
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            fields: [
                { name: 'metaTitle', title: 'Meta Title', type: 'string' },
                { name: 'metaDescription', title: 'Meta Description', type: 'text' },
            ]
        }
    ],
}
