import DOMPurify from 'dompurify'

export function sanitize(dirty: string) {
  return {
    __html: DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        'b',
        'i',
        'a',
        'span',
        'div',
        'p',
        'pre',
        'u',
        'br',
        'img',
        'code',
        'li',
        'ul',
        'table',
        'tbody',
        'thead',
        'tr',
        'td',
        'th',
        'h1',
        'h2',
        'h3',
        'h4',
      ],
      ALLOWED_ATTR: ['style', 'class', 'target', 'id', 'href', 'alt', 'src'],
    }),
  }
}
