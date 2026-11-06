import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToc } from "./toc.js";

describe("renderToc", () => {
  it("会社名（h3）を直前の章（h2）の下に入れ子で並べる", () => {
    const toc = renderToc([
      { id: "s1", depth: 2, html: "3. 職務経歴" },
      { id: "s2", depth: 3, html: "株式会社A" },
      { id: "s3", depth: 2, html: "4. 副業" },
    ]);
    assert.match(
      toc,
      /<li><a href="#s1">3\. 職務経歴<\/a><ul><li><a href="#s2">株式会社A<\/a><\/li><\/ul><\/li><li><a href="#s3">4\. 副業<\/a><\/li>/,
    );
  });

  it("タイトル（h1）と案件名（h4）は目次に載せない", () => {
    const toc = renderToc([
      { id: "s1", depth: 1, html: "職務経歴書" },
      { id: "s2", depth: 2, html: "3. 職務経歴" },
      { id: "s3", depth: 4, html: "案件X" },
    ]);
    assert.doesNotMatch(toc, /職務経歴書|案件X/);
  });
});
