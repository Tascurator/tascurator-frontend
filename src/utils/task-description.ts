export function removeHtmlTags(html: string): string {
  // Remove HTML tags using regex
  const withoutTags = html.replace(/<\/?[^>]+(>|$)/g, '');

  // Replace multiple whitespace characters (including newlines) with a single space
  const singleSpaced = withoutTags.replace(/\s+/g, ' ');

  // Trim leading and trailing whitespace and return
  return singleSpaced.trim();
}
