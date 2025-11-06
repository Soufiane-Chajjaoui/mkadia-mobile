import React from 'react';
import SectionCard from './SectionCard';
import PaymentMethodCard from './PaymentMethodCard';
import { PaymentMethod } from '../../../types/CheckoutTypes';

interface PaymentMethodSectionProps {
  methods: PaymentMethod[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  methods,
  selectedId,
  onSelect,
}) => (
  <SectionCard title="💳 Méthode de paiement">
    {methods.map((method) => (
      <PaymentMethodCard
        key={method.id}
        method={method}
        isSelected={selectedId === method.id}
        onSelect={() => onSelect(method.id)}
      />
    ))}
  </SectionCard>
);

export default PaymentMethodSection;