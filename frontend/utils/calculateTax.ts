export function calculateTax(subtotal: number): number {
  const TAX_RATE = 0.08;
  return subtotal * TAX_RATE;
}
export default calculateTax;
