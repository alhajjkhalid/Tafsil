/**
 * Mapping of Western Arabic numerals (0-9) to Arabic-Indic numerals.
 */
const arabicIndicDigits: Record<string, string> = {
  "0": "\u0660",
  "1": "\u0661",
  "2": "\u0662",
  "3": "\u0663",
  "4": "\u0664",
  "5": "\u0665",
  "6": "\u0666",
  "7": "\u0667",
  "8": "\u0668",
  "9": "\u0669",
};

/**
 * Converts a string of Western digits to Arabic-Indic digits.
 */
function toArabicIndicNumerals(str: string): string {
  return str.replace(/[0-9]/g, (digit) => arabicIndicDigits[digit] ?? digit);
}

/**
 * Formats a price in halalas to a human-readable string.
 *
 * @param halalas - Price in halalas (1 SAR = 100 halalas)
 * @param locale - 'ar' for Arabic format, 'en' for English format
 * @returns Formatted price string
 *
 * @example
 * formatPrice(15000, 'ar') // "١٥٠ ر.س"
 * formatPrice(15000, 'en') // "150 SAR"
 * formatPrice(0, 'ar')     // "٠ ر.س"
 */
export function formatPrice(halalas: number, locale: "ar" | "en"): string {
  const sar = Math.floor(halalas / 100);

  if (locale === "ar") {
    const arabicNumber = toArabicIndicNumerals(sar.toString());
    return `${arabicNumber} ر.س`;
  }

  return `${sar} SAR`;
}

/**
 * Formats a price in halalas to a number string without currency.
 *
 * @param halalas - Price in halalas
 * @param locale - 'ar' or 'en'
 * @returns Formatted number string
 */
export function formatPriceNumber(
  halalas: number,
  locale: "ar" | "en"
): string {
  const sar = Math.floor(halalas / 100);

  if (locale === "ar") {
    return toArabicIndicNumerals(sar.toString());
  }

  return sar.toString();
}
