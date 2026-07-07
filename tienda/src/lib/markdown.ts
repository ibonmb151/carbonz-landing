/**
 * Simple markdown-to-HTML converter for blog content.
 * Converts basic markdown syntax to HTML without external dependencies.
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown

  // Remove the first H1 line (it's rendered separately as the title)
  html = html.replace(/^#\s+.+\n+/, '')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-white/10" />')

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-bold text-white mt-8 mb-3">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold text-white mt-10 mb-4">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-12 mb-5">$1</h2>')

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-white/5 px-1.5 py-0.5 rounded text-green-400 text-sm">$1</code>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-green-400 hover:underline">$1</a>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-6" />')

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    return `<tr>${match
      .split('|')
      .filter((cell) => cell.trim())
      .map((cell) => `<td class="px-4 py-2 border-b border-white/5">${cell.trim()}</td>`)
      .join('')}</tr>`
  })

  // Wrap table rows in table
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) => {
    // Check if it's a header row (contains ---)
    if (match.includes('---')) return match
    return `<div class="overflow-x-auto my-6"><table class="w-full text-sm">${match}</table></div>`
  })

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-2 border-green-400 pl-4 italic text-gray-400 my-4">$1</blockquote>')

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="list-disc text-gray-300 my-4">$1</ul>')

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>')

  // Paragraphs: wrap lines that aren't already wrapped in block elements
  const lines = html.split('\n')
  const result: string[] = []
  let inParagraph = false

  for (const line of lines) {
    const trimmed = line.trim()
    const isBlockElement =
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<table') ||
      trimmed.startsWith('<div') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<li') ||
      trimmed.startsWith('<tr') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('</') ||
      trimmed === ''

    if (trimmed === '') {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      result.push('')
    } else if (isBlockElement) {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      result.push(line)
    } else {
      if (!inParagraph) {
        result.push('<p class="text-gray-300 leading-relaxed mb-4">')
        inParagraph = true
      }
      result.push(line)
    }
  }

  if (inParagraph) {
    result.push('</p>')
  }

  return result.join('\n')
}
