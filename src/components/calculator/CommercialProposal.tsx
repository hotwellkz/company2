import React from 'react';
import { X, Share2, Download, Edit2 } from 'lucide-react';
import { CalculatorState, CostBreakdown } from '../../types/calculator';
import { shareContent } from '../../utils/shareUtils';
import { generatePDFFromElement } from '../../utils/documentUtils';

interface CommercialProposalProps {
  formData: CalculatorState;
  pricePerSqm: number;
  totalPrice: number;
  costBreakdown: CostBreakdown;
  onClose: () => void;
}

const formatPrice = (price: number) => {
  return price.toLocaleString() + ' тг';
};

export const CommercialProposal: React.FC<CommercialProposalProps> = ({
  formData,
  pricePerSqm,
  totalPrice,
  costBreakdown,
  onClose
}) => {
  const handleShare = async () => {
    const content = `
Коммерческое предложение HotWell.KZ

Параметры дома:
Площадь: ${formData.area} м²
Этажность: ${formData.floors}
Высота 1-го этажа: ${formData.firstFloorHeight}
${formData.floors === '2 этажа' ? `Высота 2-го этажа: ${formData.secondFloorHeight}\n` : ''}
Тип крыши: ${formData.roofType}
Форма дома: ${formData.houseShape}

Стоимость:
За м²: ${formatPrice(pricePerSqm)}
Фундамент: ${formatPrice(costBreakdown.foundation)}
Домокомплект: ${formatPrice(costBreakdown.houseKit)}
Монтаж: ${formatPrice(costBreakdown.assembly)}
Итого: ${formatPrice(totalPrice)}

Контакты:
Тел: +7 747 743 4343
WhatsApp: +7 747 743 4343
Email: HotWell.KZ@gmail.com
Адрес: г.Алматы, пос. Бесагаш, ул. Алтай 12
    `;

    await shareContent('Коммерческое предложение HotWell.KZ', content);
  };

  const handleDownloadPDF = async () => {
    await generatePDFFromElement('commercial-proposal', 'Коммерческое_предложение_HotWell.pdf');
  };

  const handleEdit = () => {
    // Функционал редактирования будет добавлен позже
    console.log('Edit functionality to be implemented');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl">
        {/* Шапка */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Коммерческое предложение</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              title="Поделиться"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              title="Скачать PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              title="Редактировать"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Содержимое */}
        <div id="commercial-proposal" className="p-6 space-y-6 pdf-export">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Коммерческое предложение</h1>
            <p className="text-gray-600">ТОО "HotWell.KZ"</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Параметры дома:</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Площадь:</p>
                  <p className="font-medium">{formData.area} м²</p>
                </div>
                <div>
                  <p className="text-gray-600">Этажность:</p>
                  <p className="font-medium">{formData.floors}</p>
                </div>
                <div>
                  <p className="text-gray-600">Высота 1-го этажа:</p>
                  <p className="font-medium">{formData.firstFloorHeight}</p>
                </div>
                {formData.floors === '2 этажа' && (
                  <div>
                    <p className="text-gray-600">Высота 2-го этажа:</p>
                    <p className="font-medium">{formData.secondFloorHeight}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Тип крыши:</p>
                  <p className="font-medium">{formData.roofType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Форма дома:</p>
                  <p className="font-medium">{formData.houseShape}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Стоимость:</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Стоимость за м²:</span>
                  <span className="font-medium">{formatPrice(pricePerSqm)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Стоимость фундамента:</span>
                  <span className="font-medium">{formatPrice(costBreakdown.foundation)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Стоимость домокомплекта:</span>
                  <span className="font-medium">{formatPrice(costBreakdown.houseKit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Стоимость монтажа:</span>
                  <span className="font-medium">{formatPrice(costBreakdown.assembly)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-semibold">Итого:</span>
                  <span className="font-semibold text-emerald-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Контактная информация:</h2>
              <div className="space-y-2">
                <p>Тел: +7 747 743 4343</p>
                <p>WhatsApp: +7 747 743 4343</p>
                <p>Email: HotWell.KZ@gmail.com</p>
                <p>Адрес: г.Алматы, пос. Бесагаш, ул. Алтай 12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};