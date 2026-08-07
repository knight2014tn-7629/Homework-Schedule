import React, { useState } from 'react';
import { SubjectInfo, TeacherInfo } from '../types';
import { Users, UserPlus, Search, Edit2, Trash2, Save, X, Check, AlertCircle } from 'lucide-react';

interface EditTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: TeacherInfo[];
  subjects: SubjectInfo[];
  onAddTeacher: (newTeacher: TeacherInfo) => void;
  onUpdateTeacher: (updatedTeacher: TeacherInfo) => void;
  onDeleteTeacher: (teacherId: string) => void;
}

export const EditTeachersModal: React.FC<EditTeachersModalProps> = ({
  isOpen,
  onClose,
  teachers,
  subjects,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  // New Teacher Form state
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMainSubjectId, setNewMainSubjectId] = useState(subjects[0]?.id || 'chi');
  const [newContact, setNewContact] = useState('');

  // Editing Teacher Form state
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editMainSubjectId, setEditMainSubjectId] = useState('');
  const [editContact, setEditContact] = useState('');

  // Delete Confirm State
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter teachers by search query
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartAdd = () => {
    setNewName('');
    setNewTitle('');
    setNewMainSubjectId(subjects[0]?.id || 'chi');
    setNewContact('');
    setIsAdding(true);
    setEditingTeacherId(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: TeacherInfo = {
      id: `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: newName.trim(),
      title: newTitle.trim() || '專任教師',
      mainSubjectId: newMainSubjectId,
      contact: newContact.trim() || undefined,
    };

    onAddTeacher(created);
    setIsAdding(false);
    setNewName('');
    setNewTitle('');
  };

  const handleStartEdit = (t: TeacherInfo) => {
    setEditingTeacherId(t.id);
    setEditName(t.name);
    setEditTitle(t.title);
    setEditMainSubjectId(t.mainSubjectId);
    setEditContact(t.contact || '');
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacherId || !editName.trim()) return;

    const updated: TeacherInfo = {
      id: editingTeacherId,
      name: editName.trim(),
      title: editTitle.trim(),
      mainSubjectId: editMainSubjectId,
      contact: editContact.trim() || undefined,
    };

    onUpdateTeacher(updated);
    setEditingTeacherId(null);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteTeacher(id);
    setDeletingTeacherId(null);
    if (editingTeacherId === id) {
      setEditingTeacherId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">編輯教師名單</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
              共 {teachers.length} 位
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
              placeholder="搜尋教師姓名或職稱..."
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
              <UserPlus className="w-4 h-4" />
              <span>新增教師</span>
            </button>
          )}
        </div>

        {/* Add Teacher Panel */}
        {isAdding && (
          <form
            onSubmit={handleSaveNew}
            className="p-4 bg-blue-50/60 border-b border-blue-200 animate-in slide-in-from-top-2 duration-150 shrink-0"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                <UserPlus className="w-4 h-4 text-blue-600" /> 新增教師資料
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                取消
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  教師姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例：張雅婷"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  職稱 / 班級
                </label>
                <input
                  type="text"
                  placeholder="例：101 導師 / 英語專任"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  主授科目
                </label>
                <select
                  value={newMainSubjectId}
                  onChange={(e) => setNewMainSubjectId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  聯絡方式 / 備註
                </label>
                <input
                  type="text"
                  placeholder="例：分機 123"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-3">
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
                <span>儲存新增</span>
              </button>
            </div>
          </form>
        )}

        {/* Teachers List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              未找到符合「{searchQuery}」的教師資料
            </div>
          ) : (
            filteredTeachers.map((teacher) => {
              const mainSubject = subjects.find((s) => s.id === teacher.mainSubjectId);
              const isEditingThis = editingTeacherId === teacher.id;
              const isDeletingThis = deletingTeacherId === teacher.id;

              if (isEditingThis) {
                return (
                  <form
                    key={teacher.id}
                    onSubmit={handleSaveEdit}
                    className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-3 animate-in fade-in"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">姓名</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">職稱 / 班級</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">主授科目</label>
                        <select
                          value={editMainSubjectId}
                          onChange={(e) => setEditMainSubjectId(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        >
                          {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">聯絡方式</label>
                        <input
                          type="text"
                          value={editContact}
                          onChange={(e) => setEditContact(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingTeacherId(null)}
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
                  key={teacher.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{teacher.name} 老師</span>
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded font-medium">
                          {teacher.title}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span>主授：{mainSubject ? mainSubject.name : '未指定'}</span>
                        {teacher.contact && (
                          <>
                            <span>•</span>
                            <span>{teacher.contact}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isDeletingThis ? (
                    <div className="flex items-center space-x-2 animate-in fade-in">
                      <span className="text-xs font-bold text-red-600">確定刪除？</span>
                      <button
                        onClick={() => handleConfirmDelete(teacher.id)}
                        className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded font-bold"
                      >
                        刪除
                      </button>
                      <button
                        onClick={() => setDeletingTeacherId(null)}
                        className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleStartEdit(teacher)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="修改教師名稱/資料"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTeacherId(teacher.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="刪除教師"
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
