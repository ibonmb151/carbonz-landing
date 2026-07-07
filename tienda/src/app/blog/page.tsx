import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog — CarbonZ | Cúpulas de Carbono Forjado para Z900',
  description:
    'Artículos sobre carbono forjado, guías de instalación, comparativas y todo lo que necesitas saber sobre cúpulas de carbono para Kawasaki Z900.',
  openGraph: {
    title: 'Blog — CarbonZ',
    description:
      'Artículos sobre carbono forjado, guías de instalación, comparativas y más.',
    type: 'website',
  },
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <main className="min-h-screen bg-[#111] text-white">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8"
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            className="w-3 h-3"
          >
            <path
              d="M13 7H1M6 2L1 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver a la tienda
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Blog
        </h1>
        <p className="text-gray-500 text-lg max-w-xl">
          Guías, comparativas y todo sobre carbono forjado para tu Kawasaki Z900.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Card image placeholder — carbon fiber pattern */}
              <div className="h-48 bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#1a1a1a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[repeating-conic-gradient(#333_0%_25%,transparent_0%_50%)] bg-[size:20px_20px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-black text-white/5 select-none">
                    CZ
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/20">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
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

                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Read more arrow */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600 group-hover:text-green-400 transition-colors">
                  Leer artículo
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    className="w-3 h-3 transition-transform group-hover:translate-x-1"
                  >
                    <path
                      d="M1 7h12M8 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-gray-700">&copy; 2026 CarbonZ</span>
          <div className="flex gap-6">
            <Link href="/" className="text-xs text-gray-600 hover:text-white transition-colors">
              Tienda
            </Link>
            <a
              href="https://wa.me/34666666666"
              target="_blank"
              className="text-xs text-gray-600 hover:text-white transition-colors"
            >
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
