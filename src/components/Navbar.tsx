import React from 'react';
import { ViewMode, SchoolConfig } from '../types';
import { Download, Edit3, School, UserCheck, LayoutGrid, RotateCcw, Settings, Check, Users, BookOpen } from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  schoolConfig: SchoolConfig;
  onPrint: () => void;
  onExportPdf: () => void;
  onOpenSettings: () => void;
  onOpenEditTeachers: () => void;
  onOpenEditSubjects: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  isEditMode,
  setIsEditMode,
  schoolConfig,
  onPrint,
  onExportPdf,
  onOpenSettings,
  onOpenEditTeachers,
  onOpenEditSubjects,
  onResetData,
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-sm border-b border-slate-800 print:hidden sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & School Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                {schoolConfig.schoolName}
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-medium border border-blue-500/30 whitespace-nowrap">
                {schoolConfig.academicYear}
              </span>
            </div>
          </div>

          {/* View Switchers */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700/80 shrink-0">
            <button
              onClick={() => setViewMode('class')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                viewMode === 'class'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>班級課表</span>
            </button>

            <button
              onClick={() => setViewMode('teacher')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                viewMode === 'teacher'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>教師課表</span>
            </button>

            <button
              onClick={() => setViewMode('master')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                viewMode === 'master'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>年級總對照</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-1.5 flex-nowrap overflow-x-auto scrollbar-none py-0.5">
            {/* Edit Teachers Button */}
            <button
              onClick={onOpenEditTeachers}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all whitespace-nowrap shrink-0"
              title="新增、刪除或修改教師資料"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>編輯教師</span>
            </button>

            {/* Edit Subjects Button */}
            <button
              onClick={onOpenEditSubjects}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all whitespace-nowrap shrink-0"
              title="新增、刪除或修改科目資料"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>編輯科目</span>
            </button>

            {/* Edit Mode Toggle */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all border whitespace-nowrap shrink-0 ${
                isEditMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="點擊切換點選課表進行修改"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? '結束編輯' : '編輯課表'}</span>
              {isEditMode && <Check className="w-3 h-3 text-amber-400" />}
            </button>

            {/* Export PDF Button */}
            <button
              onClick={onExportPdf}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all whitespace-nowrap shrink-0"
              title="下載成 PDF 檔案"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出 PDF</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all shrink-0"
              title="學校設定 / 重設資料"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
