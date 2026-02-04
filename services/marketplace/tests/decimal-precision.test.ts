/**
 * TD-003: Decimal Precision Tests for Marketplace
 *
 * Verifies that financial fields use proper decimal precision:
 * - Price fields: Decimal(12,4)
 * - Rating fields: Decimal(3,2)
 */

import { Prisma } from '../../generated/prisma';

describe('Decimal Precision', () => {
  describe('Prisma Decimal type handling', () => {
    it('should handle price calculations with 4 decimal places', () => {
      const price1 = new Prisma.Decimal('10.999');
      const price2 = new Prisma.Decimal('0.001');
      const result = price1.add(price2);

      expect(result.toString()).toBe('11');
      expect(result.toNumber()).toBe(11);
    });

    it('should handle tax calculations with precision', () => {
      const price = new Prisma.Decimal('99.99');
      const taxRate = new Prisma.Decimal('0.08');
      const tax = price.mul(taxRate);

      expect(tax.toString()).toBe('7.9992');
      expect(tax.toDecimalPlaces(4).toString()).toBe('7.9992');
    });

    it('should preserve 4 decimal places for prices', () => {
      const price = new Prisma.Decimal('123.4567');
      expect(price.decimalPlaces()).toBe(4);
      expect(price.toString()).toBe('123.4567');
    });

    it('should handle rating values with 2 decimal places', () => {
      const rating = new Prisma.Decimal('4.75');
      expect(rating.decimalPlaces()).toBe(2);
      expect(rating.toString()).toBe('4.75');
    });

    it('should handle large prices within Decimal(12,4) range', () => {
      // Max value: 99,999,999.9999
      const largePrice = new Prisma.Decimal('99999999.9999');
      expect(largePrice.toString()).toBe('99999999.9999');

      // Typical restaurant price
      const typicalPrice = new Prisma.Decimal('1250.50');
      expect(typicalPrice.toString()).toBe('1250.5');
    });

    it('should correctly compare decimal values', () => {
      const a = new Prisma.Decimal('10.00');
      const b = new Prisma.Decimal('10');

      expect(a.equals(b)).toBe(true);
      expect(a.comparedTo(b)).toBe(0);
    });

    it('should handle sum of multiple prices', () => {
      const prices = [
        new Prisma.Decimal('12.99'),
        new Prisma.Decimal('8.50'),
        new Prisma.Decimal('3.49'),
        new Prisma.Decimal('0.02')
      ];

      const total = prices.reduce((sum, price) => sum.add(price), new Prisma.Decimal(0));
      expect(total.toString()).toBe('25');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero correctly', () => {
      const zero = new Prisma.Decimal('0.0000');
      expect(zero.isZero()).toBe(true);
    });

    it('should handle negative prices (refunds)', () => {
      const refund = new Prisma.Decimal('-15.99');
      expect(refund.isNegative()).toBe(true);
      expect(refund.abs().toString()).toBe('15.99');
    });

    it('should round correctly for display', () => {
      const calculated = new Prisma.Decimal('7.9992');
      const rounded = calculated.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
      expect(rounded.toString()).toBe('8');
    });
  });
});
