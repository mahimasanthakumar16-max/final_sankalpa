import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn, isPlaceholder } from '../env'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
})

// Safe fetch that skips if using placeholder ID to prevent hangs
export const safeFetch = async (query: string, params = {}) => {
    if (isPlaceholder) return null;
    return client.fetch(query, params);
};



