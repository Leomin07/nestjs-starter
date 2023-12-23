export function substrContent(content: string, index: number) {
  return content.length > index ? content.substring(0, index) + '...' : content;
}
