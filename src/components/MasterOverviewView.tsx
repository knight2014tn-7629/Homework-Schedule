import React, { useState } from 'react';
import { DayOfWeek, LessonSlot, SchoolConfig, SubjectInfo, TeacherInfo } from '../types';
import { DAYS_OF_WEEK, TIME_PERIODS } from '../data/mockData';
import { Layers, Calendar, ExternalLink } from 'lucide-react';

interface MasterOverviewViewProps {
  grade: number;
  lessons: LessonSlot[];
  teachers: TeacherInfo[];
  subjects: SubjectInfo[];
  schoolConfig: SchoolConfig;
  onSelectClass: (grade: number, classNum: number) => void;
  onSelectTeacher: (teacherId: string) => void;
}

export const MasterOverviewView: React.FC<MasterOverviewViewProps> = ({
  grade,
  lessons,
  teachers,
  subjects,
  schoolConfig,
  onSelectClass,
  onSelectTeacher,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('mon');

  // Helper to get lesson for a class, day, and period
  const getLesson = (classNum: number, day: DayOfWeek, period: number) => {
    return lessons.find(
      (l) => l.grade === grade && l.classNum === classNum && l.day === day && l.period === period
    );
  };

  const getSubject = (subjectId: string): SubjectInfo => {
    return (
      subjects.find((s) => s.id === subjectId) || {
        id: subjectId,
        name: subjectId,
        shortName: subjectId.slice(0, 2),
        color: 'bg-slate-100 text-slate-800 border-slate-300',
        textColor: 'text-slate-800',
        category: '彈性/其他',
      }
    );
  };

  const getTeacher = (teacherId: string): TeacherInfo => {
    return (
      teachers.find((t) => t.id === teacherId) || {
        id: teacherId,
        name: '未指定',
        title: '',
        mainSubjectId: '',
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Day Tabs Switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs print:hidden flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> 檢視日期：
          </span>
          <div className="inline-flex rounded bg-slate-100 p-1 border border-slate-200">
            {DAYS_OF_WEEK.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDay(d.key)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  selectedDay === d.key
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          總覽 {grade} 年級第 1 至 8 班在【{DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.label}】的所有課程安排
        </p>
      </div>

      {/* Main Print Container */}
      <div
        id="timetable-print-area"
        data-pdf-target
        className="bg-white rounded-lg shadow-xs border border-slate-200 p-4 sm:p-6 lg:p-8 transition-all print:shadow-none print:border-none print:p-0 print:m-0"
      >
        <div className="text-center mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900">
            {schoolConfig.schoolName}
          </h2>
          <p className="text-sm font-bold text-blue-900">
            {schoolConfig.academicYear} — {grade} 年級全班群總課表【{DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.label}】
          </p>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded border border-slate-300 shadow-xs">
          <table className="w-full text-center border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold">
                <th className="py-2.5 px-2 border-r border-slate-700 w-24">節次 / 時間</th>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((cNum) => (
                  <th key={cNum} className="py-2.5 px-2 border-r border-slate-700 last:border-r-0">
                    <button
                      onClick={() => onSelectClass(grade, cNum)}
                      className="hover:text-blue-300 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>{grade}0{cNum} 班</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {TIME_PERIODS.map((p) => (
                <tr key={p.period} className="hover:bg-slate-50 transition-colors">
                  {/* Period Header */}
                  <td className="py-3 px-2 font-bold bg-slate-100 border-r border-slate-300 text-slate-700">
                    <div className="text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{p.startTime}</div>
                  </td>

                  {/* 8 Classes */}
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((cNum) => {
                    const lesson = getLesson(cNum, selectedDay, p.period);
                    const subject = lesson ? getSubject(lesson.subjectId) : null;
                    const teacher = lesson ? getTeacher(lesson.teacherId) : null;

                    return (
                      <td key={cNum} className="p-1.5 border-r border-slate-200 last:border-r-0 align-top">
                        {lesson && subject ? (
                          <div className="flex flex-col items-center space-y-1 p-1 bg-slate-50/80 rounded border border-slate-200">
                            <span
                              className={`w-full py-0.5 px-1 text-[11px] font-bold ${subject.color}`}
                            >
                              {subject.name}
                            </span>
                            {teacher && (
                              <button
                                onClick={() => onSelectTeacher(teacher.id)}
                                className="text-[10px] text-slate-600 hover:text-blue-700 hover:underline"
                              >
                                {teacher.name}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
