import React from 'react';
import { CalculatorState } from '../../types/calculator';

interface CalculatorFormProps {
  formData: CalculatorState;
  onChange: (data: CalculatorState) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  formData,
  onChange
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Площадь застройки (10-1500 м²) *
        </label>
        <input
          type="number"
          name="area"
          value={formData.area}
          onChange={handleInputChange}
          min="10"
          max="1500"
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Количество этажей
        </label>
        <select
          name="floors"
          value={formData.floors}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="1 этаж">1 этаж</option>
          <option value="2 этажа">2 этажа</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Высота первого этажа
        </label>
        <select
          name="firstFloorHeight"
          value={formData.firstFloorHeight}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="2,5 метра">2,5 метра</option>
          <option value="2,8 метра">2,8 метра</option>
          <option value="3 метра">3 метра</option>
        </select>
      </div>

      {formData.floors === '2 этажа' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Высота второго этажа
          </label>
          <select
            name="secondFloorHeight"
            value={formData.secondFloorHeight}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="2,5 метра">2,5 метра</option>
            <option value="2,8 метра">2,8 метра</option>
            <option value="3 метра">3 метра</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Тип крыши
        </label>
        <select
          name="roofType"
          value={formData.roofType}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="1-скатная">1-скатная</option>
          <option value="2-скатная">2-скатная</option>
          <option value="4-скатная">4-скатная</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Форма дома
        </label>
        <select
          name="houseShape"
          value={formData.houseShape}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="Простая форма">Простая форма</option>
          <option value="Сложная форма">Сложная форма</option>
        </select>
      </div>
    </div>
  );
};