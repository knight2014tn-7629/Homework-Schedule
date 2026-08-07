import React, { useState } from 'react';
import { SchoolConfig } from '../types';
import { Settings, Save, RotateCcw, Download, Upload, Check, X, ShieldAlert } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolConfig: SchoolConfig;
  onSaveConfig: (newConfig: SchoolConfig) => void;
  onResetData: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  schoolConfig,
  onSaveConfig,
  onResetData,
  onExportJson,
  onImportJson,
}) => {
  const [config, setConfig] = useState<SchoolConfig>(schoolConfig);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">全校課表與系統設定</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* School Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">學校名稱：</label>
            <input
              type="text"
              value={config.schoolName}
              onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Academic Semester Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">學期名稱 / 標題：</label>
            <input
              type="text"
              value={config.academicYear}
              onChange={(e) => setConfig({ ...config, academicYear: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">課表頁尾注意事項與說明：</label>
            <textarea
              rows={3}
              value={config.notes}
              onChange={(e) => setConfig({ ...config, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Display Options */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-700">課表顯示設定：</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showTimeInHeader}
                  onChange={(e) => setConfig({ ...config, showTimeInHeader: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>顯示每節上課時間區段</span>
              </label>

              <label className="inline-flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.colorCodeEnabled}
                  onChange={(e) => setConfig({ ...config, colorCodeEnabled: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>開啟科目色彩分類標記</span>
              </label>
            </div>
          </div>

          {/* Backup & Restore Data */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-700">資料備份與還原：</label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onExportJson}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-300"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                備份 JSON 課表
              </button>

              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-300 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                匯入 JSON 課表
                <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
              </label>
            </div>

            {/* Reset to Mock Preset */}
            <div className="pt-2">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 重設為全校 48 班預設示範資料
                </button>
              ) : (
                <div className="p-3 bg-rose-100 border border-rose-300 rounded space-y-2">
                  <div className="text-xs text-rose-900 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-rose-600" /> 確定重設全校所有課表？
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetData();
                        setConfirmReset(false);
                        onClose();
                      }}
                      className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs"
                    >
                      確認重設
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1"
            >
              <Save className="w-4 h-4" /> 儲存設定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
