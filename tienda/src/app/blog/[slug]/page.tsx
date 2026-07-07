import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getBlogPost, getAllSlugs } from '@/lib/blog-data'
import { markdownToHtml } from '@/lib/markdown'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  return {
    title: `${post.title} | CarbonZ`,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const htmlContent = markdownToHtml(post.content)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Carbon<span className="text-[#30d158]">Z</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-white">
              Blog
            </Link>
            <Link
              href="/#comprar"
              className="text-sm font-medium bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Visitar tienda
            </Link>
          </div>
        </div>
      </nav>

      {/* Article header */}
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-white transition-colors mb-8"
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
              <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver al blog
          </Link>

          {/* Category badge */}
          <div className="mb-4">
            <span className="inline-block bg-[#30d158]/10 text-[#30d158] text-xs font-semibold px-3 py-1 rounded-full border border-[#30d158]/20">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readTime} de lectura</span>
          </div>

          {/* Divider */}
          <div className="mt-8 mb-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <article
          className="prose prose-invert prose-lg max-w-none
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:leading-tight
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4
            [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-white [&_h4]:mt-8 [&_h4]:mb-3
            [&_p]:text-gray-400 [&_p]:leading-[1.8] [&_p]:mb-5
            [&_strong]:text-white [&_strong]:font-semibold
            [&_a]:text-[#30d158] [&_a]:hover:underline
            [&_hr]:border-white/10 [&_hr]:my-10
            [&_ul]:list-disc [&_ul]:text-gray-400 [&_ul]:my-5 [&_ul]:ml-6
            [&_ol]:list-decimal [&_ol]:text-gray-400 [&_ol]:my-5 [&_ol]:ml-6
            [&_li]:mb-2 [&_li]:leading-relaxed
            [&_blockquote]:border-l-2 [&_blockquote]:border-[#30d158] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-6 [&_blockquote]:bg-white/[0.02] [&_blockquote]:py-4 [&_blockquote]:pr-5 [&_blockquote]:rounded-r-lg
            [&_code]:bg-white/5 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#30d158] [&_code]:text-sm
            [&_table]:w-full [&_table]:text-sm [&_table]:my-8 [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-white/5
            [&_th]:px-5 [&_th]:py-3 [&_th]:bg-white/[0.03] [&_th]:text-left [&_th]:text-white [&_th]:font-semibold [&_th]:border-b [&_th]:border-white/5
            [&_td]:px-5 [&_td]:py-3 [&_td]:border-b [&_td]:border-white/5 [&_td]:text-gray-400
            [&_tr]:last-child [&_td]:border-b-0
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-[#111] border border-white/5 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Listo para equipar tu Z900?
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Nuestras cúpulas de carbono forjado están diseñadas específicamente para la Kawasaki Z900 con encaje perfecto Plug &amp; Play.
          </p>
          <Link
            href="/#comprar"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            Visitar tienda
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Related articles */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <h3 className="text-lg font-bold text-white mb-6">Artículos relacionados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blogPosts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 4)
            .map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group block bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300"
              >
                <span className="text-xs text-[#30d158] font-semibold">
                  {related.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-2 mb-2 group-hover:text-[#30d158] transition-colors leading-snug">
                  {related.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {related.excerpt}
                </p>
              </Link>
            ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-gray-700">&copy; 2026 CarbonZ</span>
          <div className="flex gap-6">
            <Link href="/" className="text-xs text-gray-600 hover:text-white transition-colors">
              Tienda
            </Link>
            <Link href="/blog" className="text-xs text-gray-600 hover:text-white transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
