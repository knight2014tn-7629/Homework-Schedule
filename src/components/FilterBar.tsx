import React, { useState } from 'react';
import { ViewMode, TeacherInfo } from '../types';
import { Search, Filter, Users, School, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface FilterBarProps {
  viewMode: ViewMode;
  selectedGrade: number;
  setSelectedGrade: (grade: number) => void;
  selectedClassNum: number;
  setSelectedClassNum: (classNum: number) => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (teacherId: string) => void;
  teachers: TeacherInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectTeacherById: (id: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  selectedGrade,
  setSelectedGrade,
  selectedClassNum,
  setSelectedClassNum,
  selectedTeacherId,
  setSelectedTeacherId,
  teachers,
  searchQuery,
  setSearchQuery,
  onSelectTeacherById,
}) => {
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState<string>('all');

  // Filter teachers based on subject category/search query
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.includes(searchQuery) ||
      t.title.includes(searchQuery) ||
      t.mainSubjectId.includes(searchQuery);

    if (!matchesSearch) return false;

    if (teacherSubjectFilter === 'all') return true;
    if (teacherSubjectFilter === 'homeroom') return t.id.startsWith('t_hr_');
    return t.mainSubjectId === teacherSubjectFilter;
  });

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Class View Filter */}
        {viewMode === 'class' && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Grade & Class Pill Selectors */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Grade Selector */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> 年級：
                </span>
                <div className="inline-flex rounded bg-slate-100 p-1 border border-slate-200">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        selectedGrade === g
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {g} 年級
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Selector */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                  <School className="w-3.5 h-3.5 text-blue-600" /> 班級：
                </span>
                <div className="inline-flex rounded bg-slate-100 p-1 border border-slate-200">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedClassNum(c)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                        selectedClassNum === c
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {c} 班
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teacher View Filter */}
        {viewMode === 'teacher' && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Teacher Subject Categories */}
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> 教師分類：
              </span>

              <div className="flex items-center space-x-1">
                {[
                  { id: 'all', label: '全部教師' },
                  { id: 'homeroom', label: '各班導師' },
                  { id: 'pe', label: '體育科任' },
                  { id: 'eng', label: '英語科任' },
                  { id: 'mus', label: '音樂科任' },
                  { id: 'art', label: '美勞科任' },
                  { id: 'sci', label: '自然科任' },
                  { id: 'comp', label: '資訊科任' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTeacherSubjectFilter(cat.id)}
                    className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap transition-all ${
                      teacherSubjectFilter === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Teacher Dropdown & Search */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {filteredTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} 老師 ({t.title})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick search teacher input */}
              <input
                type="text"
                placeholder="快速搜尋姓名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 sm:w-40 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Master View Filter */}
        {viewMode === 'master' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> 選擇總覽年級：
              </span>
              <div className="inline-flex rounded bg-slate-100 p-1 border border-slate-200">
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      selectedGrade === g
                        ? 'bg-blue-600 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {g} 年級全區 (101-108 班)
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              顯示 <span className="font-semibold text-blue-700">{selectedGrade} 年級</span> 1 至 8 班所有班級同時間課表比較
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
