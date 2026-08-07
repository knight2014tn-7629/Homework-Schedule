import React from 'react';
import { DayOfWeek, LessonSlot, SchoolConfig, SubjectInfo, TeacherInfo, TimePeriod } from '../types';
import { DAYS_OF_WEEK, TIME_PERIODS, BREAK_TIMES } from '../data/mockData';
import { Edit2, MapPin, User, Clock, AlertCircle } from 'lucide-react';

interface ClassScheduleViewProps {
  grade: number;
  classNum: number;
  lessons: LessonSlot[];
  teachers: TeacherInfo[];
  subjects: SubjectInfo[];
  schoolConfig: SchoolConfig;
  isEditMode: boolean;
  onSelectTeacher: (teacherId: string) => void;
  onEditSlot: (day: DayOfWeek, period: number) => void;
  onQuickGradeClassChange: (grade: number, classNum: number) => void;
}

export const ClassScheduleView: React.FC<ClassScheduleViewProps> = ({
  grade,
  classNum,
  lessons,
  teachers,
  subjects,
  schoolConfig,
  isEditMode,
  onSelectTeacher,
  onEditSlot,
  onQuickGradeClassChange,
}) => {
  const classCode = `${grade}0${classNum}`; // e.g. 302
  const homeroomTeacher = teachers.find((t) => t.id === `t_hr_${grade}_${classNum}`) || teachers[0];

  // Helper to get lesson for a specific day and period
  const getLesson = (day: DayOfWeek, period: number) => {
    return lessons.find(
      (l) => l.grade === grade && l.classNum === classNum && l.day === day && l.period === period
    );
  };

  // Helper to get subject info
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

  // Helper to get teacher info
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
      {/* Main Print/Export Container */}
      <div
        id="timetable-print-area"
        data-pdf-target
        className="bg-white rounded-lg shadow-xs border border-slate-200 p-4 sm:p-6 lg:p-8 transition-all print:shadow-none print:border-none print:p-0 print:m-0"
      >
        {isEditMode && (
          <div className="mb-4 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center justify-center gap-1.5 font-medium print:hidden">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>編輯模式已開啟：點擊下方課表任意時段格可修改科目與授課教師</span>
          </div>
        )}
        {/* Printable Official Header */}
        <div className="text-center mb-6 border-b border-slate-200 pb-5">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {schoolConfig.schoolName}
            </h2>
          </div>
          <p className="text-sm font-bold text-blue-900 tracking-wide uppercase">
            {schoolConfig.academicYear} 班級功課表
          </p>

          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 bg-slate-50 border border-slate-200 px-5 py-2 rounded-lg print:bg-transparent print:border-slate-400">
            <span className="text-base font-bold text-slate-900">
              班級：<span className="text-blue-700">{grade} 年 {classNum} 班 ({classCode})</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-medium text-slate-800 flex items-center gap-1">
              <User className="w-4 h-4 text-slate-500 inline" /> 導師：
              <button
                onClick={() => onSelectTeacher(homeroomTeacher.id)}
                className="font-bold text-slate-900 hover:text-blue-700 hover:underline transition-all"
                title="查看導師個人課表"
              >
                {homeroomTeacher.name} 老師
              </button>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-600">
              教室：<span className="font-semibold text-slate-800">{classCode} 教室</span>
            </span>
          </div>
        </div>

        {/* Timetable Grid Table */}
        <div className="overflow-x-auto rounded border border-slate-300 shadow-xs">
          <table className="w-full text-center border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs sm:text-sm font-bold">
                <th className="py-3 px-2 border-r border-slate-700 w-24">節次 / 時間</th>
                {DAYS_OF_WEEK.map((day) => (
                  <th key={day.key} className="py-3 px-2 border-r border-slate-700 last:border-r-0 w-1/5">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 text-xs sm:text-sm">
              {/* Early Morning / Flag Raising */}
              <tr className="bg-slate-50/80 text-slate-600 text-xs print:bg-slate-100">
                <td className="py-1.5 px-2 font-medium border-r border-slate-200 bg-slate-100/90 print:bg-slate-200">
                  <div className="font-bold text-slate-900">早自習</div>
                  <div className="text-[10px] text-slate-500">08:00 - 08:40</div>
                </td>
                <td colSpan={5} className="py-1.5 px-3 font-medium text-slate-700 text-center tracking-wider">
                  晨光活動 / 朝會 / 導師時間 / 自由閱讀
                </td>
              </tr>

              {/* Morning Periods 1 ~ 4 */}
              {TIME_PERIODS.filter((p) => p.isMorning).map((p) => (
                <tr key={p.period} className="hover:bg-slate-50/80 transition-colors">
                  {/* Period Name & Time */}
                  <td className="py-2.5 px-2 font-semibold bg-slate-100/80 border-r border-slate-300 text-slate-700">
                    <div className="text-sm font-bold text-slate-900">{p.name}</div>
                    {schoolConfig.showTimeInHeader && (
                      <div className="text-[11px] text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {p.startTime}-{p.endTime}
                      </div>
                    )}
                  </td>

                  {/* Days Mon ~ Fri */}
                  {DAYS_OF_WEEK.map((day) => {
                    const lesson = getLesson(day.key, p.period);
                    const subject = lesson ? getSubject(lesson.subjectId) : null;
                    const teacher = lesson ? getTeacher(lesson.teacherId) : null;

                    return (
                      <td
                        key={day.key}
                        onClick={() => isEditMode && onEditSlot(day.key, p.period)}
                        className={`p-2 border-r border-slate-200 last:border-r-0 relative group transition-all align-top ${
                          isEditMode ? 'cursor-pointer hover:bg-amber-100/50' : ''
                        }`}
                      >
                        {lesson && subject ? (
                          <div className="flex flex-col items-center justify-between h-full min-h-[64px] space-y-1">
                            {/* Subject Card */}
                            <div
                              className={`w-full py-1.5 px-2 font-bold text-xs sm:text-sm tracking-wide shadow-2xs ${subject.color}`}
                            >
                              {subject.name}
                            </div>

                            {/* Teacher Info */}
                            {teacher && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (teacher.id) onSelectTeacher(teacher.id);
                                }}
                                className="text-xs font-semibold text-slate-700 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5 transition-all"
                                title="點擊切換至該教師課表"
                              >
                                {teacher.name}
                              </button>
                            )}

                            {/* Classroom Tag if specified */}
                            {lesson.classroom && (
                              <div className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                {lesson.classroom}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-full min-h-[64px] flex items-center justify-center text-slate-300 text-xs">
                            —
                          </div>
                        )}

                        {/* Edit Mode Hover Badge */}
                        {isEditMode && (
                          <div className="absolute inset-0 bg-amber-500/10 border-2 border-amber-400 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 font-bold">
                              <Edit2 className="w-3 h-3" /> 編輯
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Lunch Break Banner */}
              <tr className="bg-blue-50/50 text-slate-700 text-xs print:bg-slate-100">
                <td className="py-1.5 px-2 font-medium border-r border-slate-200 bg-blue-100/60 text-blue-950 print:bg-slate-200">
                  <div className="font-bold">午休</div>
                  <div className="text-[10px] text-blue-800">12:00 - 13:30</div>
                </td>
                <td colSpan={5} className="py-1.5 px-3 font-semibold text-blue-900 text-center tracking-wider">
                  午餐時間 / 潔牙與餐後整理 / 午休靜養
                </td>
              </tr>

              {/* Afternoon Periods 5 ~ 7 */}
              {TIME_PERIODS.filter((p) => !p.isMorning).map((p) => (
                <tr key={p.period} className="hover:bg-slate-50/80 transition-colors">
                  {/* Period Name & Time */}
                  <td className="py-2.5 px-2 font-semibold bg-slate-100/80 border-r border-slate-300 text-slate-700">
                    <div className="text-sm font-bold text-slate-900">{p.name}</div>
                    {schoolConfig.showTimeInHeader && (
                      <div className="text-[11px] text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {p.startTime}-{p.endTime}
                      </div>
                    )}
                  </td>

                  {/* Days Mon ~ Fri */}
                  {DAYS_OF_WEEK.map((day) => {
                    const lesson = getLesson(day.key, p.period);
                    const subject = lesson ? getSubject(lesson.subjectId) : null;
                    const teacher = lesson ? getTeacher(lesson.teacherId) : null;

                    return (
                      <td
                        key={day.key}
                        onClick={() => isEditMode && onEditSlot(day.key, p.period)}
                        className={`p-2 border-r border-slate-200 last:border-r-0 relative group transition-all align-top ${
                          isEditMode ? 'cursor-pointer hover:bg-amber-100/50' : ''
                        }`}
                      >
                        {lesson && subject ? (
                          <div className="flex flex-col items-center justify-between h-full min-h-[64px] space-y-1">
                            {/* Subject Card */}
                            <div
                              className={`w-full py-1.5 px-2 font-bold text-xs sm:text-sm tracking-wide shadow-2xs ${subject.color}`}
                            >
                              {subject.name}
                            </div>

                            {/* Teacher Info */}
                            {teacher && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (teacher.id) onSelectTeacher(teacher.id);
                                }}
                                className="text-xs font-semibold text-slate-700 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5 transition-all"
                                title="點擊切換至該教師課表"
                              >
                                {teacher.name}
                              </button>
                            )}

                            {/* Classroom Tag if specified */}
                            {lesson.classroom && (
                              <div className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                {lesson.classroom}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-full min-h-[64px] flex items-center justify-center text-slate-300 text-xs">
                            —
                          </div>
                        )}

                        {/* Edit Mode Hover Badge */}
                        {isEditMode && (
                          <div className="absolute inset-0 bg-amber-500/10 border-2 border-amber-400 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 font-bold">
                              <Edit2 className="w-3 h-3" /> 編輯
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes & Color Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
          {/* Notes */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800">【注意事項】</span>
            <p className="mt-0.5 leading-relaxed">{schoolConfig.notes}</p>
          </div>

          {/* Subject Color Legend */}
          {schoolConfig.colorCodeEnabled && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500">科目色彩圖例：</span>
              {subjects.slice(0, 10).map((s) => (
                <span
                  key={s.id}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${s.color}`}
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {/* Official Signature Line for Print Copy */}
          <div className="pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4 print:flex">
            <div className="flex items-center space-x-8">
              <div>教務處核章：______________________</div>
              <div>班級導師簽章：______________________</div>
            </div>
            <div className="text-[11px] text-slate-400">
              列印日期：{new Date().toLocaleDateString('zh-TW')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
