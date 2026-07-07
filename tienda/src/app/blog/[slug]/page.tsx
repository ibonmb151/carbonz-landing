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
    <main
      style={{
        minHeight: '100vh',
        background: '#111',
        color: 'var(--white)',
        fontFamily: 'var(--font)',
      }}
    >
      {/* Nav pill */}
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
      <section
        style={{
          padding: '140px 48px 48px',
          maxWidth: 740,
          margin: '0 auto',
        }}
      >
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.8rem',
            color: 'var(--gray-600)',
            marginBottom: 48,
          }}
        >
          <svg viewBox="0 0 14 14" fill="none" style={{ width: 12, height: 12 }}>
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

        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(48,209,88,0.1)',
              color: 'var(--green)',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '5px 14px',
              borderRadius: 980,
              border: '1px solid rgba(48,209,88,0.2)',
            }}
          >
            {post.category}
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: 28,
          }}
        >
          {post.title}
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: '0.85rem',
            color: 'var(--gray-500)',
            marginBottom: 32,
          }}
        >
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

        <div
          style={{
            height: 1,
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
          }}
        />
      </section>

      {/* Article content */}
      <section style={{ maxWidth: 740, margin: '0 auto', padding: '64px 48px' }}>
        <article
          className="prose prose-invert prose-lg max-w-none
            [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-20 [&_h2]:mb-8 [&_h2]:leading-tight [&_h2]:tracking-tight
            [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-14 [&_h3]:mb-6
            [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-white [&_h4]:mt-10 [&_h4]:mb-4
            [&_p]:text-[#8e8e93] [&_p]:text-lg [&_p]:leading-[1.9] [&_p]:mb-8
            [&_strong]:text-white [&_strong]:font-semibold
            [&_a]:text-[#30d158] [&_a]:hover:underline
            [&_hr]:border-white/10 [&_hr]:my-16
            [&_ul]:list-disc [&_ul]:text-[#8e8e93] [&_ul]:my-8 [&_ul]:ml-8
            [&_ol]:list-decimal [&_ol]:text-[#8e8e93] [&_ol]:my-8 [&_ol]:ml-8
            [&_li]:mb-4 [&_li]:leading-relaxed [&_li]:text-lg
            [&_blockquote]:border-l-2 [&_blockquote]:border-[#30d158] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-[#636366] [&_blockquote]:my-10 [&_blockquote]:bg-white/[0.02] [&_blockquote]:py-6 [&_blockquote]:pr-6 [&_blockquote]:rounded-r-xl
            [&_code]:bg-white/5 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-[#30d158] [&_code]:text-base
            [&_table]:w-full [&_table]:text-base [&_table]:my-10 [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-white/5
            [&_th]:px-6 [&_th]:py-4 [&_th]:bg-white/[0.03] [&_th]:text-left [&_th]:text-white [&_th]:font-semibold [&_th]:border-b [&_th]:border-white/5
            [&_td]:px-6 [&_td]:py-4 [&_td]:border-b [&_td]:border-white/5 [&_td]:text-[#8e8e93]
            [&_tr]:last-child [&_td]:border-b-0
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 740, margin: '0 auto', padding: '0 48px 80px' }}>
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 24,
            padding: '56px 48px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: '-0.03em',
            }}
          >
            ¿Listo para equipar tu Z900?
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--gray-500)',
              marginBottom: 32,
              maxWidth: 440,
              margin: '0 auto 32px',
              lineHeight: 1.7,
            }}
          >
            Nuestras cúpulas de carbono forjado están diseñadas específicamente
            para la Kawasaki Z900 con encaje perfecto Plug &amp; Play.
          </p>
          <Link
            href="/#comprar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--white)',
              color: 'var(--black)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '14px 36px',
              borderRadius: 980,
              transition: 'background 0.2s',
            }}
          >
            Visitar tienda
            <svg viewBox="0 0 14 14" fill="none" style={{ width: 12, height: 12 }}>
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
      </section>

      {/* Related articles */}
      <section style={{ maxWidth: 740, margin: '0 auto', padding: '0 48px 128px' }}>
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          Artículos relacionados
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {blogPosts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 4)
            .map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                style={{
                  display: 'block',
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 16,
                  padding: 24,
                  transition: 'border-color 0.3s',
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--green)',
                    fontWeight: 600,
                  }}
                >
                  {related.category}
                </span>
                <h4
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginTop: 10,
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  {related.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--gray-600)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {related.excerpt}
                </p>
              </Link>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 48px',
        }}
      >
        <div
          style={{
            maxWidth: 740,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--gray-700)' }}>
            © 2026 CarbonZ
          </span>
          <div style={{ display: 'flex', gap: 32 }}>
            <Link
              href="/"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Tienda
            </Link>
            <Link
              href="/blog"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
