export function removeHtmlTags(html: string): string {
  // Remove everything that starts with < and ends with >, including any unusual attributes inside
  const withoutTags = html.replace(/<[^>]*>/g, '');

  // Specifically target and remove 'p]:inline">' patterns
  const cleaned = withoutTags.replace(/p\]:inline">/g, '');

  // Replace multiple whitespace characters (including newlines) with a single space
  const singleSpaced = cleaned.replace(/\s+/g, ' ');

  // Trim leading and trailing whitespace and return
  return singleSpaced.trim();
}
