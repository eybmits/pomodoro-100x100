import DOMPurify from "dompurify";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true
});

export function renderMarkdown(input: string): string {
  const rawHtml = marked.parse(input, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true }
  });
}
