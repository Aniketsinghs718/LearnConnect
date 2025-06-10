'use client';

import React from 'react';
import { X, Shield, Users, Eye, CreditCard } from 'lucide-react';

interface SafetyDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  sellerName: string;
  itemTitle: string;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({
  isOpen,
  onClose,
  onContinue,
  sellerName,
  itemTitle
}) => {
  const [acknowledged, setAcknowledged] = React.useState(false);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!acknowledged) {
      return;
    }
    onContinue();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-orange-600 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-orange-600">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-white">Safety Guidelines</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Intro */}
          <div className="text-center">
            <p className="text-orange-200 mb-2">
              You're about to contact <span className="font-semibold text-orange-400">{sellerName}</span> for:
            </p>
            <p className="text-white font-medium bg-gray-800 p-2 rounded-lg">
              "{itemTitle}"
            </p>
          </div>          {/* Safety Tips */}
          <div className="space-y-3">
            <h4 className="text-orange-400 font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Quick Safety Tips
            </h4>

            <div className="space-y-3">
              {/* Meeting in Person */}
              <div className="flex items-start space-x-3 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                <Users className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-200 font-medium">Meet in Person</p>
                  <p className="text-green-300 text-sm">
                    Always meet at your college campus or any public place
                  </p>
                </div>
              </div>

              {/* Inspect Before Payment */}
              <div className="flex items-start space-x-3 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <Eye className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-200 font-medium">Inspect First, Pay Later</p>
                  <p className="text-blue-300 text-sm">
                    Check the item thoroughly before making any payment
                  </p>
                </div>
              </div>

              {/* Payment Security */}
              <div className="flex items-start space-x-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <CreditCard className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-200 font-medium">Safe Payment</p>
                  <p className="text-yellow-300 text-sm">
                    Use cash or UPI after inspection. No advance payments!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust but Verify */}
          <div className="bg-orange-900 bg-opacity-30 border border-orange-600 rounded-lg p-3">
            <p className="text-orange-200 text-sm text-center">
              <span className="font-medium">Happy Trading!</span> Stay smart, stay safe! 🎓✨
            </p>
          </div>{/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="understand-safety"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="h-4 w-4 text-orange-600 border-gray-600 rounded focus:ring-orange-600 bg-gray-800"
            />
            <label htmlFor="understand-safety" className="text-sm text-gray-300">
              I understand these safety guidelines and will follow them
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-orange-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Not Now
          </button>          <button
            onClick={handleContinue}
            disabled={!acknowledged}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>💬</span>
            <span>Continue to WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
