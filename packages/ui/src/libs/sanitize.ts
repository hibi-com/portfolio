import DOMPurify from "isomorphic-dompurify";

const SANITIZE_CONFIG = {
    ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "blockquote",
        "code",
        "pre",
        "span",
        "div",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
    ALLOW_DATA_ATTR: false,
};

/**
 * HTMLコンテンツをサニタイズする
 * サーバーサイドとクライアントサイドの両方でサニタイズを実行し、XSSを防止する
 * @param html - サニタイズするHTML文字列
 * @returns サニタイズされたHTML文字列
 */
export const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, SANITIZE_CONFIG);
};
