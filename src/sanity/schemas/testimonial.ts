export default {
    name: 'testimonial',
    title: 'Testimonials',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Client Name',
            type: 'string',
        },
        {
            name: 'designation',
            title: 'Designation / Location',
            type: 'string',
        },
        {
            name: 'review',
            title: 'Review',
            type: 'text',
        },
        {
            name: 'rating',
            title: 'Rating (1-5)',
            type: 'number',
        },
    ],
}
