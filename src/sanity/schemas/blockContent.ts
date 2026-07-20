export default {
    title: 'Block Content',
    name: 'blockContent',
    type: 'array',
    of: [
        {
            title: 'Block',
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
            ],
            lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
            ],
            marks: {
                decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                    { title: 'Underline', value: 'underline' },
                    { title: 'Strike', value: 'strike-through' },
                    { title: 'Code', value: 'code' },
                ],
                annotations: [
                    {
                        title: 'URL',
                        name: 'link',
                        type: 'object',
                        fields: [
                            {
                                title: 'URL',
                                name: 'href',
                                type: 'url',
                            },
                        ],
                    },
                ],
            },
        },
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
        {
            title: 'Code Block',
            type: 'code',
            options: {
                language: 'javascript',
                languageAlternatives: [
                    { title: 'JavaScript', value: 'javascript' },
                    { title: 'TypeScript', value: 'typescript' },
                    { title: 'HTML', value: 'html' },
                    { title: 'CSS', value: 'css' },
                ],
                withFilename: false,
            },
        },
    ],
}
