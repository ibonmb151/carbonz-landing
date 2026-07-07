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
    <main className="min-h-screen bg-[#111] text-white">
      {/* Article header */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8"
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
            <path
              d="M13 7H1M6 2L1 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver al blog
        </Link>

        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-block bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/20">
            {post.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
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
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <article
          className="prose prose-invert prose-lg max-w-none
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-5
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4
            [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-white [&_h4]:mt-8 [&_h4]:mb-3
            [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-4
            [&_strong]:text-white [&_strong]:font-semibold
            [&_a]:text-green-400 [&_a]:hover:underline
            [&_hr]:border-white/10 [&_hr]:my-8
            [&_ul]:list-disc [&_ul]:text-gray-300 [&_ul]:my-4 [&_ul]:ml-6
            [&_ol]:list-decimal [&_ol]:text-gray-300 [&_ol]:my-4 [&_ol]:ml-6
            [&_li]:mb-1
            [&_blockquote]:border-l-2 [&_blockquote]:border-green-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_blockquote]:my-4
            [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-green-400 [&_code]:text-sm
            [&_table]:w-full [&_table]:text-sm [&_table]:my-6
            [&_th]:px-4 [&_th]:py-2 [&_th]:border-b [&_th]:border-white/10 [&_th]:text-left [&_th]:text-white [&_th]:font-semibold
            [&_td]:px-4 [&_td]:py-2 [&_td]:border-b [&_td]:border-white/5 [&_td]:text-gray-300
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            ¿Listo para equipar tu Z900?
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Nuestras cúpulas de carbono forjado están diseñadas específicamente para la Kawasaki Z900 con encaje perfecto Plug &amp; Play.
          </p>
          <Link
            href="/comprar"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-8 py-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            Ver cúpulas disponibles
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
              <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
                className="group block bg-[#1a1a1a] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
              >
                <span className="text-xs text-green-400 font-semibold">
                  {related.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-2 mb-1 group-hover:text-green-400 transition-colors leading-snug">
                  {related.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
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
