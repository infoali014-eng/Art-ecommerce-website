export function calculateShipping(subtotal: number): number {
  if (subtotal === 0) return 0;
  // Free insured courier logistics for luxury art orders over $5,000
  return subtotal >= 5000 ? 0 : 50;
}
export default calculateShipping;
