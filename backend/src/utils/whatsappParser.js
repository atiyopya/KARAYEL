/**
 * WhatsApp Order Parser (Turkish)
 * Extracts Product, Total Quantity, and Size Distribution from unstructured text.
 * Example: "Mavi Polar, 10 adet: 5 XL, 5 L" -> { product: "Mavi Polar", total: 10, sizes: { XL: 5, L: 5 } }
 */

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

export const parseWhatsAppMessage = (text) => {
  const result = {
    product: '',
    totalQuantity: 0,
    sizes: {},
    raw: text
  };

  // 1. Level: Basic Cleaning
  const cleanText = text.replace(/İ/g, 'i').toLowerCase().trim();

  // 2. Level: Try to find product name (usually at start or before 'adet/tane')
  // For now we use a simple heuristic: everything before first number or 'adet'
  const productMatch = text.split(/[0-9]|adet|tane/i)[0];
  if (productMatch) result.product = productMatch.trim().replace(/,$/, '');

  // 3. Level: Extract Total Quantity (look for 'X adet' or 'X tane')
  const totalMatch = text.match(/(\d+)\s*(adet|tane|adet:|tane:)/i);
  if (totalMatch) {
    result.totalQuantity = parseInt(totalMatch[1]);
  }

  // 4. Level: Extract Specific Sizes (Regex for "N S", "N M", "N XL" etc)
  SIZES.forEach(size => {
    // Matches patterns like "5 XL", "5XL", "2 adet L", "2 L"
    const sizeRegex = new RegExp(`(\\d+)\\s*(?:adet|tane)?\\s*\\b${size}\\b`, 'i');
    const match = text.match(sizeRegex);
    if (match) {
      result.sizes[size] = parseInt(match[1]);
    }
  });

  // 5. Fallback: If no explicit sizes found, but a total is found, mark as 'Unspecified' or similar
  const foundSizesTotal = Object.values(result.sizes).reduce((a, b) => a + b, 0);
  if (result.totalQuantity === 0 && foundSizesTotal > 0) {
    result.totalQuantity = foundSizesTotal;
  }

  return result;
};
