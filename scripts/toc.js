// 案件名（h4）まで載せると目次が長くなりすぎるので、章（h2）と会社名（h3）までにする
export function renderToc(headings) {
  const sections = [];
  for (const { id, depth, html } of headings) {
    if (depth === 2) sections.push({ id, html, children: [] });
    if (depth === 3) sections.at(-1)?.children.push({ id, html });
  }

  const link = ({ id, html }) => `<a href="#${id}">${html}</a>`;
  const items = sections.map((section) => {
    const children = section.children.length
      ? `<ul>${section.children.map((child) => `<li>${link(child)}</li>`).join("")}</ul>`
      : "";
    return `<li>${link(section)}${children}</li>`;
  });

  return `<nav class="toc" aria-label="目次"><p class="toc-title">目次</p><ul>${items.join("")}</ul></nav>`;
}
