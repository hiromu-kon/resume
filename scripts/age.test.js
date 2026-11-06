import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ageOn, todayInJapan, updateAge } from "./age.js";

const birth = { year: 1998, month: 4, day: 5 };

describe("ageOn", () => {
  it("誕生日の前日はまだ年齢が上がらない", () => {
    assert.equal(ageOn(birth, { year: 2026, month: 4, day: 4 }), 27);
  });

  it("誕生日の当日に年齢が上がる", () => {
    assert.equal(ageOn(birth, { year: 2026, month: 4, day: 5 }), 28);
  });

  it("誕生月より前の月はまだ年齢が上がらない", () => {
    assert.equal(ageOn(birth, { year: 2026, month: 3, day: 31 }), 27);
  });
});

describe("todayInJapan", () => {
  it("UTC ではまだ前日でも、日本時間の日付を返す", () => {
    assert.deepEqual(todayInJapan(new Date("2026-04-04T15:00:00Z")), {
      year: 2026,
      month: 4,
      day: 5,
    });
  });
});

describe("updateAge", () => {
  it("生年月日の後ろの年齢を、指定した日の年齢に書き換える", () => {
    const markdown = "| 生年月日 | 1998年04月05日（27歳） |";
    assert.equal(
      updateAge(markdown, { year: 2026, month: 11, day: 6 }),
      "| 生年月日 | 1998年04月05日（28歳） |",
    );
  });

  it("年齢付きの生年月日がなければ何も変えない", () => {
    const markdown = "| 生年月日 | 1998年04月05日 |";
    assert.equal(updateAge(markdown, { year: 2026, month: 11, day: 6 }), markdown);
  });
});
