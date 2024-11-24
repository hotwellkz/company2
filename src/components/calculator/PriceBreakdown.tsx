import React from 'react';
import { Building2, Package, Wrench } from 'lucide-react';
import { CostBreakdown } from '../../types/calculator';

interface PriceBreakdownProps {
  pricePerSqm: number;
  totalPrice: number;
  costBreakdown: CostBreakdown;
}

const formatPrice = (price: number) => {
  return price.toLocaleString() + ' тг';
};

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  pricePerSqm,
  totalPrice,
  costBreakdown
}) => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Стоимость за м²:</span>
          <span className="font-medium">{formatPrice(pricePerSqm)}</span>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-500" />
              <span>Стоимость фундамента:</span>
            </div>
            <span>{formatPrice(costBreakdown.foundation)}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-500" />
              <span>Стоимость домокомплекта:</span>
            </div>
            <span>{formatPrice(costBreakdown.houseKit)}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-emerald-500" />
              <span>Стоимость монтажа:</span>
            </div>
            <span>{formatPrice(costBreakdown.assembly)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-medium text-gray-900">Итого:</span>
          <span className="text-lg font-medium text-emerald-500">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};