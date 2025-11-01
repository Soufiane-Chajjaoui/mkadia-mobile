import React from 'react';
import SectionCard from './SectionCard';
import DeliveryMethodCard from './DeliveryMethodCard';
import { DeliveryMethod } from '../../../types/CheckoutTypes';

interface DeliveryMethodSectionProps {
  methods: DeliveryMethod[];
  selectedId: string;
  onSelect: (id: string) => void;
  currency?: string;
}

const DeliveryMethodSection: React.FC<DeliveryMethodSectionProps> = ({
  methods,
  selectedId,
  onSelect,
  currency = '€',
}) => (
  <SectionCard title="🚚 Mode de livraison">
    {methods.map((method) => (
      <DeliveryMethodCard
        key={method.id}
        method={method}
        isSelected={selectedId === method.id}
        onSelect={() => onSelect(method.id)}
        currency={currency}
      />
    ))}
  </SectionCard>
);

export default DeliveryMethodSection;