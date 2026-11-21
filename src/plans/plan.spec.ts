import { toPlan } from './plan';

describe('toPlan', () => {
  it('convierte el precio de texto a número', () => {
    const plan = toPlan({ id: 1, name: 'Básico', monthly_price: '29.90' });

    expect(plan.monthlyPrice).toBe(29.9);
  });
});
