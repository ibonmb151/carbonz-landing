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
      {/* Nav pill — same style as landing */}
      <nav className="nav-pill visible">
        <Link href="/#producto">Producto</Link>
        <Link href="/#detalles">Detalles</Link>
        <Link href="/blog" className="pill-cta">
          Blog
        </Link>
        <Link href="/#comprar" className="pill-cta">
          Visitar tienda
        </Link>
      </nav>

      {/* Article header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-white transition-colors mb-10"
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
              <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver al blog
          </Link>

          {/* Category badge */}
          <div className="mb-6">
            <span className="inline-block bg-[#30d158]/10 text-[#30d158] text-xs font-semibold px-3 py-1 rounded-full border border-[#30d158]/20">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
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
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </section>

      {/* Article content */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <article
          className="prose prose-invert prose-lg max-w-none
            [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-20 [&_h2]:mb-8 [&_h2]:leading-tight
            [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-14 [&_h3]:mb-6
            [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-white [&_h4]:mt-10 [&_h4]:mb-4
            [&_p]:text-gray-400 [&_p]:text-lg [&_p]:leading-[1.9] [&_p]:mb-8
            [&_strong]:text-white [&_strong]:font-semibold
            [&_a]:text-[#30d158] [&_a]:hover:underline
            [&_hr]:border-white/10 [&_hr]:my-16
            [&_ul]:list-disc [&_ul]:text-gray-400 [&_ul]:my-8 [&_ul]:ml-8
            [&_ol]:list-decimal [&_ol]:text-gray-400 [&_ol]:my-8 [&_ol]:ml-8
            [&_li]:mb-4 [&_li]:leading-relaxed [&_li]:text-lg
            [&_blockquote]:border-l-2 [&_blockquote]:border-[#30d158] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-10 [&_blockquote]:bg-white/[0.02] [&_blockquote]:py-6 [&_blockquote]:pr-6 [&_blockquote]:rounded-r-xl
            [&_code]:bg-white/5 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-[#30d158] [&_code]:text-base
            [&_table]:w-full [&_table]:text-base [&_table]:my-10 [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-white/5
            [&_th]:px-6 [&_th]:py-4 [&_th]:bg-white/[0.03] [&_th]:text-left [&_th]:text-white [&_th]:font-semibold [&_th]:border-b [&_th]:border-white/5
            [&_td]:px-6 [&_td]:py-4 [&_td]:border-b [&_td]:border-white/5 [&_td]:text-gray-400
            [&_tr]:last-child [&_td]:border-b-0
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-[#111] border border-white/5 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para equipar tu Z900?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Nuestras cúpulas de carbono forjado están diseñadas específicamente para la Kawasaki Z900 con encaje perfecto Plug &amp; Play.
          </p>
          <Link
            href="/#comprar"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-10 py-4 rounded-full hover:bg-gray-200 transition-colors"
          >
            Visitar tienda
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Related articles */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        <h3 className="text-xl font-bold text-white mb-8">Artículos relacionados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogPosts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 4)
            .map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group block bg-[#111] border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-all duration-300"
              >
                <span className="text-xs text-[#30d158] font-semibold">
                  {related.category}
                </span>
                <h4 className="text-base font-bold text-white mt-3 mb-3 group-hover:text-[#30d158] transition-colors leading-snug">
                  {related.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {related.excerpt}
                </p>
              </Link>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-gray-700">&copy; 2026 CarbonZ</span>
          <div className="flex gap-8">
            <Link href="/" className="text-xs text-gray-600 hover:text-white transition-colors">Tienda</Link>
            <Link href="/blog" className="text-xs text-gray-600 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
