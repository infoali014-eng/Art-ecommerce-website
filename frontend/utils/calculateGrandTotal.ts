export function calculateGrandTotal(subtotal: number, shipping: number, tax: number): number {
  return subtotal + shipping + tax;
}
export default calculateGrandTotal;
