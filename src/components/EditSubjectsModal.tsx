import React, { useState } from 'react';
import { SubjectInfo } from '../types';
import { BookOpen, Plus, Search, Edit2, Trash2, Save, X, Check, Palette } from 'lucide-react';

interface EditSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectInfo[];
  onAddSubject: (newSubject: SubjectInfo) => void;
  onUpdateSubject: (updatedSubject: SubjectInfo) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const COLOR_PRESETS = [
  {
    name: '橘色',
    color: 'bg-orange-50 border-l-4 border-l-orange-500 border-y border-r border-orange-200 text-orange-950',
    textColor: 'text-orange-900',
    sampleBg: 'bg-orange-500',
  },
  {
    name: '藍色',
    color: 'bg-blue-50 border-l-4 border-l-blue-500 border-y border-r border-blue-200 text-blue-950',
    textColor: 'text-blue-900',
    sampleBg: 'bg-blue-500',
  },
  {
    name: '紫色',
    color: 'bg-purple-50 border-l-4 border-l-purple-500 border-y border-r border-purple-200 text-purple-950',
    textColor: 'text-purple-900',
    sampleBg: 'bg-purple-500',
  },
  {
    name: '翠綠',
    color: 'bg-emerald-50 border-l-4 border-l-emerald-500 border-y border-r border-emerald-200 text-emerald-950',
    textColor: 'text-emerald-900',
    sampleBg: 'bg-emerald-500',
  },
  {
    name: '琥珀',
    color: 'bg-amber-50 border-l-4 border-l-amber-500 border-y border-r border-amber-200 text-amber-950',
    textColor: 'text-amber-900',
    sampleBg: 'bg-amber-500',
  },
  {
    name: '黃色',
    color: 'bg-yellow-50 border-l-4 border-l-yellow-500 border-y border-r border-yellow-200 text-yellow-950',
    textColor: 'text-yellow-900',
    sampleBg: 'bg-yellow-500',
  },
  {
    name: '紫羅蘭',
    color: 'bg-violet-50 border-l-4 border-l-violet-500 border-y border-r border-violet-200 text-violet-950',
    textColor: 'text-violet-900',
    sampleBg: 'bg-violet-500',
  },
  {
    name: '粉紅',
    color: 'bg-pink-50 border-l-4 border-l-pink-500 border-y border-r border-pink-200 text-pink-950',
    textColor: 'text-pink-900',
    sampleBg: 'bg-pink-500',
  },
  {
    name: '天藍',
    color: 'bg-sky-50 border-l-4 border-l-sky-500 border-y border-r border-sky-200 text-sky-950',
    textColor: 'text-sky-900',
    sampleBg: 'bg-sky-500',
  },
  {
    name: '藍綠',
    color: 'bg-teal-50 border-l-4 border-l-teal-500 border-y border-r border-teal-200 text-teal-950',
    textColor: 'text-teal-900',
    sampleBg: 'bg-teal-500',
  },
  {
    name: '綠色',
    color: 'bg-green-50 border-l-4 border-l-green-500 border-y border-r border-green-200 text-green-950',
    textColor: 'text-green-900',
    sampleBg: 'bg-green-500',
  },
  {
    name: '萊姆',
    color: 'bg-lime-50 border-l-4 border-l-lime-500 border-y border-r border-lime-200 text-lime-950',
    textColor: 'text-lime-900',
    sampleBg: 'bg-lime-500',
  },
  {
    name: '灰色',
    color: 'bg-slate-50 border-l-4 border-l-slate-400 border-y border-r border-slate-200 text-slate-800',
    textColor: 'text-slate-700',
    sampleBg: 'bg-slate-500',
  },
  {
    name: '洋紅',
    color: 'bg-fuchsia-50 border-l-4 border-l-fuchsia-500 border-y border-r border-fuchsia-200 text-fuchsia-950',
    textColor: 'text-fuchsia-900',
    sampleBg: 'bg-fuchsia-500',
  },
  {
    name: '靛藍',
    color: 'bg-indigo-50 border-l-4 border-l-indigo-500 border-y border-r border-indigo-200 text-indigo-950',
    textColor: 'text-indigo-900',
    sampleBg: 'bg-indigo-500',
  },
  {
    name: '玫瑰紅',
    color: 'bg-rose-50 border-l-4 border-l-rose-500 border-y border-r border-rose-200 text-rose-950',
    textColor: 'text-rose-900',
    sampleBg: 'bg-rose-500',
  },
  {
    name: '青色',
    color: 'bg-cyan-50 border-l-4 border-l-cyan-500 border-y border-r border-cyan-200 text-cyan-950',
    textColor: 'text-cyan-900',
    sampleBg: 'bg-cyan-500',
  },
];

const CATEGORIES: ('語文' | '數學' | '自然' | '社會' | '藝能' | '健體' | '綜合' | '彈性/其他')[] = [
  '語文',
  '數學',
  '自然',
  '社會',
  '藝能',
  '健體',
  '綜合',
  '彈性/其他',
];

export const EditSubjectsModal: React.FC<EditSubjectsModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // New Subject Form state
  const [newName, setNewName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [newCategory, setNewCategory] = useState<'語文' | '數學' | '自然' | '社會' | '藝能' | '健體' | '綜合' | '彈性/其他'>('彈性/其他');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Edit Subject Form state
  const [editName, setEditName] = useState('');
  const [editShortName, setEditShortName] = useState('');
  const [editCategory, setEditCategory] = useState<'語文' | '數學' | '自然' | '社會' | '藝能' | '健體' | '綜合' | '彈性/其他'>('彈性/其他');
  const [editPresetIndex, setEditPresetIndex] = useState(0);

  // Delete Confirm state
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.includes(searchQuery)
  );

  const handleStartAdd = () => {
    setNewName('');
    setNewShortName('');
    setNewCategory('彈性/其他');
    setSelectedPresetIndex(0);
    setIsAdding(true);
    setEditingSubjectId(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const preset = COLOR_PRESETS[selectedPresetIndex] || COLOR_PRESETS[0];

    const created: SubjectInfo = {
      id: `subj_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: newName.trim(),
      shortName: (newShortName.trim() || newName.trim().slice(0, 2)),
      category: newCategory,
      color: preset.color,
      textColor: preset.textColor,
    };

    onAddSubject(created);
    setIsAdding(false);
    setNewName('');
    setNewShortName('');
  };

  const handleStartEdit = (s: SubjectInfo) => {
    setEditingSubjectId(s.id);
    setEditName(s.name);
    setEditShortName(s.shortName);
    setEditCategory(s.category);

    // Try to match preset
    const foundIdx = COLOR_PRESETS.findIndex((p) => p.color === s.color);
    setEditPresetIndex(foundIdx >= 0 ? foundIdx : 0);
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubjectId || !editName.trim()) return;

    const preset = COLOR_PRESETS[editPresetIndex] || COLOR_PRESETS[0];

    const updated: SubjectInfo = {
      id: editingSubjectId,
      name: editName.trim(),
      shortName: editShortName.trim() || editName.trim().slice(0, 2),
      category: editCategory,
      color: preset.color,
      textColor: preset.textColor,
    };

    onUpdateSubject(updated);
    setEditingSubjectId(null);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteSubject(id);
    setDeletingSubjectId(null);
    if (editingSubjectId === id) setEditingSubjectId(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">編輯科目類別與顏色</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
              共 {subjects.length} 個科目
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋科目全名、簡稱或領域分類..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!isAdding && (
            <button
              onClick={handleStartAdd}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>新增科目</span>
            </button>
          )}
        </div>

        {/* Add Subject Panel */}
        {isAdding && (
          <form
            onSubmit={handleSaveNew}
            className="p-4 bg-blue-50/60 border-b border-blue-200 animate-in slide-in-from-top-2 duration-150 shrink-0 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                <Plus className="w-4 h-4 text-blue-600" /> 新增科目資料
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                取消
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  科目全名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例：程式設計"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newShortName) setNewShortName(e.target.value.slice(0, 2));
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  課表簡稱 (1-2字)
                </label>
                <input
                  type="text"
                  placeholder="例：程式"
                  value={newShortName}
                  onChange={(e) => setNewShortName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  領域分類
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-blue-600" /> 選擇顏色風格：
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-white rounded border border-slate-200">
                {COLOR_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => setSelectedPresetIndex(idx)}
                    className={`flex items-center space-x-1.5 px-2 py-1 rounded text-xs font-medium transition-all ${
                      selectedPresetIndex === idx
                        ? 'ring-2 ring-blue-600 scale-105 shadow-xs font-bold'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${preset.sampleBg}`} />
                    <span className="text-slate-800">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>儲存新增科目</span>
              </button>
            </div>
          </form>
        )}

        {/* Subjects List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              未找到符合「{searchQuery}」的科目資料
            </div>
          ) : (
            filteredSubjects.map((subj) => {
              const isEditingThis = editingSubjectId === subj.id;
              const isDeletingThis = deletingSubjectId === subj.id;

              if (isEditingThis) {
                return (
                  <form
                    key={subj.id}
                    onSubmit={handleSaveEdit}
                    className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-3 animate-in fade-in"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">科目名稱</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">課表簡稱</label>
                        <input
                          type="text"
                          value={editShortName}
                          onChange={(e) => setEditShortName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">領域分類</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as any)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Color selection for edit */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        顏色風格
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1 bg-white rounded border border-slate-200">
                        {COLOR_PRESETS.map((preset, idx) => (
                          <button
                            type="button"
                            key={preset.name}
                            onClick={() => setEditPresetIndex(idx)}
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] ${
                              editPresetIndex === idx ? 'ring-2 ring-amber-600 font-bold' : 'opacity-70'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${preset.sampleBg}`} />
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingSubjectId(null)}
                        className="px-2.5 py-1 text-xs rounded border border-slate-300 text-slate-600 hover:bg-slate-100"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-xs rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>更新儲存</span>
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div
                  key={subj.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`px-2.5 py-1 rounded text-xs font-bold ${subj.color} shrink-0`}>
                      {subj.shortName}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{subj.name}</span>
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded font-medium">
                          {subj.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isDeletingThis ? (
                    <div className="flex items-center space-x-2 animate-in fade-in">
                      <span className="text-xs font-bold text-red-600">確定刪除此科目？</span>
                      <button
                        onClick={() => handleConfirmDelete(subj.id)}
                        className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded font-bold"
                      >
                        刪除
                      </button>
                      <button
                        onClick={() => setDeletingSubjectId(null)}
                        className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleStartEdit(subj)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="修改科目名稱與顏色"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingSubjectId(subj.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="刪除科目"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-6 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            完成關閉
          </button>
        </div>
      </div>
    </div>
  );
};
