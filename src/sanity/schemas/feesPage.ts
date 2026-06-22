export default {
    name: 'feesPage',
    title: 'Fees Page',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'feeStructures',
            title: 'Session Fees',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'sessionTitle', title: 'Session Title', type: 'string' },
                        { name: 'duration', title: 'Duration (e.g., 50 Minutes)', type: 'string' },
                        { name: 'amount', title: 'Fee Amount (e.g., ₹2,500)', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text' },
                        { name: 'bestFor', title: 'Best For', type: 'string' },
                    ],
                },
            ],
        },
        {
            name: 'cancellationPolicy',
            title: 'Cancellation Policy',
            type: 'blockContent',
        },
        {
            name: 'paymentMethods',
            title: 'Payment Methods',
            type: 'array',
            of: [{ type: 'string' }],
        },
    ],
}
