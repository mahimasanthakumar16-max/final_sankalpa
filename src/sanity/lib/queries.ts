import { groq } from 'next-sanity'

export const homePageQuery = groq`*[_type == "homepage"][0]{
  heroTitlePrefix,
  heroTitleHighlight,
  heroTitleSuffix,
  heroSubtitle,
  "heroImage": heroImage.asset->url,
  ctaText,
  secondaryCtaText,
  introTitle,
  introText,
  showcaseTitle,
  seo
}`

export const servicesQuery = groq`*[_type == "service"]{
  _id,
  title,
  slug,
  icon,
  shortDescription,
  concerns,
  "featuredImage": featuredImage.asset->url,
  outcomes,
  ctaText
}`

export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  title,
  biography,
  credentials,
  philosophy,
  "aboutImage": aboutImage.asset->url,
  seo
}`

export const feesPageQuery = groq`*[_type == "feesPage"][0]{
  title,
  feeStructures,
  cancellationPolicy,
  paymentMethods,
  seo
}`

export const contactPageQuery = groq`*[_type == "contactPage"][0]{
  address,
  email,
  phone,
  officeHours,
  mapsUrl
}`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  description,
  "logo": logo.asset->url,
  navLinks,
  footerText,
  socialLinks,
  seo
}`

export const faqsQuery = groq`*[_type == "faq"]{
  _id,
  question,
  answer,
  category
}`

export const blogPostsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  publishedAt,
  readingTime,
  featured,
  "mainImage": mainImage.asset->url,
  "categories": categories[]->title
}`

export const blogPostBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  publishedAt,
  readingTime,
  featured,
  "mainImage": mainImage.asset->url,
  "categories": categories[]->title,
  body,
  seo
}`





