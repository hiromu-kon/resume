const BIRTH_DATE_WITH_AGE = /(\d{4})年(\d{2})月(\d{2})日（\d+歳）/;

export function ageOn(birth, today) {
  const hadBirthday =
    today.month > birth.month ||
    (today.month === birth.month && today.day >= birth.day);
  return today.year - birth.year - (hadBirthday ? 0 : 1);
}

// ビルドする CI は UTC で動くので、日本時間の日付で年齢を数える
export function todayInJapan(now = new Date()) {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
  })
    .format(now)
    .split("-")
    .map(Number);
  return { year, month, day };
}

export function updateAge(markdown, today) {
  return markdown.replace(BIRTH_DATE_WITH_AGE, (_, year, month, day) => {
    const age = ageOn(
      { year: Number(year), month: Number(month), day: Number(day) },
      today,
    );
    return `${year}年${month}月${day}日（${age}歳）`;
  });
}
