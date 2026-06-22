export default {
    name: 'contactPage',
    title: 'Contact Page',
    type: 'document',
    fields: [
        {
            name: 'address',
            title: 'Address',
            type: 'text',
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        },
        {
            name: 'officeHours',
            title: 'Office Hours',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'mapsUrl',
            title: 'Google Maps Embed URL',
            type: 'url',
        },
        {
            name: 'privacyNote',
            title: 'Privacy Note',
            type: 'text',
        },
    ],
}
