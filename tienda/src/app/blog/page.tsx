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

      {/* Hero */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-[#30d158] text-sm font-semibold mb-4 tracking-wide uppercase">
              Blog
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Guías, comparativas
              <br />
              <span className="text-gray-500">y todo sobre carbono forjado</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
              Todo lo que necesitas saber para elegir y cuidar las piezas de carbono de tu Kawasaki Z900.
            </p>
          </div>
        </div>
      </div>

      {/* Featured article */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <Link
          href={`/blog/${sorted[0].slug}`}
          className="group block bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image side */}
            <div className="h-64 md:h-full bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0a0a0a] relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,#30d158,transparent_50%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[120px] font-black text-white/[0.02] select-none">
                  CZ
                </span>
              </div>
              <div className="absolute top-6 left-6">
                <span className="inline-block bg-[#30d158]/10 text-[#30d158] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#30d158]/20">
                  Destacado
                </span>
              </div>
            </div>

            {/* Content side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="inline-block bg-[#30d158]/10 text-[#30d158] text-xs font-semibold px-3 py-1 rounded-full border border-[#30d158]/20 w-fit mb-4">
                {sorted[0].category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#30d158] transition-colors leading-tight">
                {sorted[0].title}
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                {sorted[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <time dateTime={sorted[0].date}>
                  {new Date(sorted[0].date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{sorted[0].readTime} de lectura</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Articles grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card image */}
              <div className="h-44 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0a0a0a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,#30d158,transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-black text-white/[0.03] select-none">
                    CZ
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[#30d158]/10 text-[#30d158] text-xs font-semibold px-3 py-1 rounded-full border border-[#30d158]/20">
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

                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#30d158] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-gray-600 group-hover:text-[#30d158] transition-colors">
                  Leer artículo
                  <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 transition-transform group-hover:translate-x-1">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-[#111] border border-white/5 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para equipar tu Z900?
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Nuestras cúpulas de carbono forjado están diseñadas específicamente para la Kawasaki Z900.
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

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
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
