const stripTagsRegex = /(<([^>]+)>)/gi

// Removes any thing that looks like an HTML tag from the supplied string
export const stripTags = (text = '') => String(text).replace(stripTagsRegex, '')

// Generate a domProps object for either innerHTML, textContent or nothing
export const htmlOrText = (
  innerHTML?: string,
  textContent?: string
): { innerHTML?: string; textContent?: string } => {
  return innerHTML ? { innerHTML } : textContent ? { textContent } : {}
}
