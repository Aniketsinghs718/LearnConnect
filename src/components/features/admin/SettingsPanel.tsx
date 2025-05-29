'use client';
import { Subjects } from '@/interfaces/Subject';
import Button from '@/components/ui/Button';

interface SettingsPanelProps {
  onClearAllData: () => void;
  onReloadData: () => void;
}

export default function SettingsPanel({ onClearAllData, onReloadData }: SettingsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Auto-save</label>
          <p className="text-sm text-gray-600">Data is automatically saved to browser local storage</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Data Location</label>
          <p className="text-sm text-gray-600">Browser localStorage: learnconnect-admin-data</p>
        </div>
        <div className="pt-4 border-t">
          <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
          <p className="text-sm text-gray-600 mb-3">
            This will permanently delete all admin data from local storage.
          </p>
          <Button
            onClick={onClearAllData}
            variant="danger"
          >
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
}
