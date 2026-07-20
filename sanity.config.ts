import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { projectId, dataset } from './src/sanity/env'
import blockContent from './src/sanity/schemas/blockContent'
import service from './src/sanity/schemas/service'
import homepage from './src/sanity/schemas/homepage'
import aboutPage from './src/sanity/schemas/aboutPage'
import feesPage from './src/sanity/schemas/feesPage'
import faq from './src/sanity/schemas/faq'
import post from './src/sanity/schemas/post'
import category from './src/sanity/schemas/category'
import contactPage from './src/sanity/schemas/contactPage'
import testimonial from './src/sanity/schemas/testimonial'
import siteSettings from './src/sanity/schemas/siteSettings'

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema: {
        types: [
            homepage,
            aboutPage,
            feesPage,
            service,
            faq,
            post,
            category,
            contactPage,
            testimonial,
            siteSettings,
            blockContent
        ],
    },
    plugins: [
        structureTool(),
        visionTool(),
        codeInput(),
    ],
})
