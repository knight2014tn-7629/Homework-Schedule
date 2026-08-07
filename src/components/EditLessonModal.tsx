import React, { useState, useEffect } from 'react';
import { DayOfWeek, LessonSlot, SubjectInfo, TeacherInfo } from '../types';
import { DAYS_OF_WEEK, TIME_PERIODS } from '../data/mockData';
import { AlertTriangle, Check, Trash2, X, MapPin, User, BookOpen } from 'lucide-react';

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: number;
  classNum: number;
  day: DayOfWeek;
  period: number;
  currentLesson?: LessonSlot;
  allLessons: LessonSlot[];
  teachers: TeacherInfo[];
  subjects: SubjectInfo[];
  onSaveLesson: (updatedSlot: LessonSlot) => void;
  onDeleteLesson: (grade: number, classNum: number, day: DayOfWeek, period: number) => void;
}

export const EditLessonModal: React.FC<EditLessonModalProps> = ({
  isOpen,
  onClose,
  grade,
  classNum,
  day,
  period,
  currentLesson,
  allLessons,
  teachers,
  subjects,
  onSaveLesson,
  onDeleteLesson,
}) => {
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || 'chi');
  const [teacherId, setTeacherId] = useState<string>('');
  const [classroom, setClassroom] = useState<string>('');

  useEffect(() => {
    if (currentLesson) {
      setSubjectId(currentLesson.subjectId);
      setTeacherId(currentLesson.teacherId);
      setClassroom(currentLesson.classroom || '');
    } else {
      setSubjectId(subjects[0]?.id || 'chi');
      const hr = teachers.find((t) => t.id === `t_hr_${grade}_${classNum}`);
      setTeacherId(hr ? hr.id : teachers[0]?.id || '');
      setClassroom('');
    }
  }, [currentLesson, grade, classNum, teachers, subjects, isOpen]);

  if (!isOpen) return null;

  const dayLabel = DAYS_OF_WEEK.find((d) => d.key === day)?.label || day;
  const periodLabel = TIME_PERIODS.find((p) => p.period === period)?.name || `第${period}節`;

  // Check teacher conflict in other classes for the same day and period
  const teacherConflict = allLessons.find(
    (l) =>
      l.teacherId === teacherId &&
      l.day === day &&
      l.period === period &&
      !(l.grade === grade && l.classNum === classNum)
  );

  const selectedTeacherObj = teachers.find((t) => t.id === teacherId);
  const conflictSubjectObj = teacherConflict
    ? subjects.find((s) => s.id === teacherConflict.subjectId)
    : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherConflict) {
      const confirmSave = window.confirm(
        `【教師排課衝突警告】\n\n${selectedTeacherObj?.name || '選定'} 老師在 ${dayLabel} ${periodLabel} 已排定給 ${teacherConflict.grade}0${teacherConflict.classNum} 班${conflictSubjectObj ? ` (${conflictSubjectObj.name})` : ''} 授課！\n\n確定仍要進行重複排課嗎？`
      );
      if (!confirmSave) return;
    }
    onSaveLesson({
      grade,
      classNum,
      day,
      period,
      subjectId,
      teacherId,
      classroom: classroom.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    onDeleteLesson(grade, classNum, day, period);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">編輯課表節目</h3>
            <p className="text-xs text-slate-300">
              {grade} 年 {classNum} 班 ({grade}0{classNum}) — {dayLabel} {periodLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Subject Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-600" /> 上課科目：
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <User className="w-4 h-4 text-blue-600" /> 授課教師：
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className={`w-full px-3 py-2 bg-slate-50 border rounded text-sm font-medium focus:ring-2 focus:outline-none transition-all ${
                teacherConflict
                  ? 'border-amber-400 bg-amber-50/30 text-amber-950 focus:ring-amber-500'
                  : 'border-slate-300 text-slate-900 focus:ring-blue-500'
              }`}
            >
              {teachers.map((t) => {
                const conflict = allLessons.find(
                  (l) =>
                    l.teacherId === t.id &&
                    l.day === day &&
                    l.period === period &&
                    !(l.grade === grade && l.classNum === classNum)
                );
                return (
                  <option key={t.id} value={t.id}>
                    {t.name} 老師 ({t.title}) {conflict ? `⚠️ [時段衝突: ${conflict.grade}0${conflict.classNum} 班]` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Realtime Conflict Warning Badge */}
          {teacherConflict && (
            <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-1 text-xs text-amber-900 animate-in fade-in shadow-xs">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ 教師排課時段衝突警告</span>
              </div>
              <p className="text-amber-800 leading-relaxed pl-5.5">
                選定的【<strong className="text-amber-950 font-bold">{selectedTeacherObj?.name || '該'} 老師</strong>】在同一時段（
                <strong>{dayLabel} {periodLabel}</strong>）已排定至{' '}
                <span className="inline-block bg-amber-200/90 text-amber-950 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                  {teacherConflict.grade}0{teacherConflict.classNum} 班
                </span>
                {conflictSubjectObj ? ` (${conflictSubjectObj.name})` : ''} 授課！
              </p>
              <p className="text-amber-700 text-[11px] pl-5.5 pt-0.5">
                請確認是否為協同教學、跨班合課，或另選其他無時段衝突之授課教師。
              </p>
            </div>
          )}

          {/* Classroom Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" /> 上課地點/教室 (可留空)：
            </label>
            <input
              type="text"
              placeholder="例如：操場、音樂教室(一)、電腦教室(二)"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {currentLesson ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> 清空此節課
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1 transition-all"
              >
                <Check className="w-4 h-4" /> 儲存變更
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
