import React from 'react';
import { DayOfWeek, LessonSlot, SchoolConfig, SubjectInfo, TeacherInfo } from '../types';
import { DAYS_OF_WEEK, TIME_PERIODS } from '../data/mockData';
import { User, BookOpen, Clock, MapPin, School, Calendar, ChevronRight } from 'lucide-react';

interface TeacherScheduleViewProps {
  teacher: TeacherInfo;
  allTeachers: TeacherInfo[];
  lessons: LessonSlot[];
  subjects: SubjectInfo[];
  schoolConfig: SchoolConfig;
  onSelectClass: (grade: number, classNum: number) => void;
  onSelectTeacher: (teacherId: string) => void;
}

export const TeacherScheduleView: React.FC<TeacherScheduleViewProps> = ({
  teacher,
  allTeachers,
  lessons,
  subjects,
  schoolConfig,
  onSelectClass,
  onSelectTeacher,
}) => {
  // Find all lessons taught by this teacher
  const teacherLessons = lessons.filter((l) => l.teacherId === teacher.id);

  // Total weekly periods
  const totalPeriods = teacherLessons.length;

  // Distinct classes taught
  const classesTaughtMap = new Set<string>();
  teacherLessons.forEach((l) => classesTaughtMap.add(`${l.grade}0${l.classNum}`));
  const classesTaughtList = Array.from(classesTaughtMap).sort();

  // Helper to get lesson for a specific day and period for this teacher
  const getTeacherLesson = (day: DayOfWeek, period: number) => {
    return teacherLessons.find((l) => l.day === day && l.period === period);
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

  return (
    <div className="space-y-4">
      {/* Teacher Quick Switch Row */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 print:hidden flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-slate-700 whitespace-nowrap">快速切換教師：</span>
        <div className="flex items-center space-x-1.5">
          {allTeachers.slice(0, 15).map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTeacher(t.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
                t.id === teacher.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Print Container */}
      <div
        id="timetable-print-area"
        data-pdf-target
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 transition-all print:shadow-none print:border-none print:p-0 print:m-0"
      >
        {/* Printable Official Header */}
        <div className="text-center mb-6 border-b border-slate-200 pb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {schoolConfig.schoolName}
          </h2>
          <p className="text-sm font-bold text-blue-900 tracking-wide uppercase">
            {schoolConfig.academicYear} 教師個人每週課表
          </p>

          {/* Teacher Stats Card */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-4 bg-slate-50 border border-slate-200 px-6 py-3 rounded-lg print:bg-transparent print:border-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {teacher.name.slice(0, 1)}
              </div>
              <div className="text-left">
                <div className="text-base font-bold text-slate-900">{teacher.name} 老師</div>
                <div className="text-xs text-slate-500">{teacher.title}</div>
              </div>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center space-x-1.5 text-sm text-slate-800">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>授課總節數：</span>
              <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {totalPeriods} 節 / 週
              </span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center space-x-1.5 text-xs text-slate-700 max-w-md flex-wrap">
              <School className="w-4 h-4 text-slate-500 inline" />
              <span>授課班級：</span>
              <div className="flex flex-wrap gap-1">
                {classesTaughtList.map((cCode) => {
                  const g = parseInt(cCode[0], 10);
                  const c = parseInt(cCode.slice(1), 10);
                  return (
                    <button
                      key={cCode}
                      onClick={() => onSelectClass(g, c)}
                      className="px-1.5 py-0.5 bg-white border border-slate-300 text-slate-800 rounded font-bold hover:bg-blue-50 hover:border-blue-400 transition-all text-[11px]"
                      title={`進入 ${g}年${c}班 課表`}
                    >
                      {cCode}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
          <table className="w-full text-center border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-800 text-white text-xs sm:text-sm font-bold">
                <th className="py-3 px-2 border-r border-slate-700 w-24">節次 / 時間</th>
                {DAYS_OF_WEEK.map((day) => (
                  <th key={day.key} className="py-3 px-2 border-r border-slate-700 last:border-r-0 w-1/5">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 text-xs sm:text-sm">
              {/* Morning Periods 1 ~ 4 */}
              {TIME_PERIODS.filter((p) => p.isMorning).map((p) => (
                <tr key={p.period} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-2 font-semibold bg-slate-100/80 border-r border-slate-300 text-slate-700">
                    <div className="text-sm font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {p.startTime}-{p.endTime}
                    </div>
                  </td>

                  {DAYS_OF_WEEK.map((day) => {
                    const lesson = getTeacherLesson(day.key, p.period);
                    const subject = lesson ? getSubject(lesson.subjectId) : null;

                    return (
                      <td
                        key={day.key}
                        className="p-2.5 border-r border-slate-200 last:border-r-0 align-top h-20"
                      >
                        {lesson && subject ? (
                          <div className="flex flex-col items-center justify-between h-full space-y-1">
                            {/* Class Badge (Clickable to jump) */}
                            <button
                              onClick={() => onSelectClass(lesson.grade, lesson.classNum)}
                              className="px-2 py-0.5 bg-slate-900 text-white font-black text-xs rounded shadow-xs hover:bg-blue-600 transition-all flex items-center gap-1 group"
                              title="點擊查看該班級課表"
                            >
                              <span>{lesson.grade}0{lesson.classNum} 班</span>
                              <ChevronRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            {/* Subject */}
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-md border ${subject.color}`}
                            >
                              {subject.name}
                            </span>

                            {/* Classroom */}
                            {lesson.classroom && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                {lesson.classroom}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium bg-slate-50/50 rounded-lg border border-dashed border-slate-200/80">
                            空堂
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Lunch Divider */}
              <tr className="bg-slate-100 text-slate-500 text-xs">
                <td className="py-1 px-2 border-r border-slate-300 font-bold">12:00-13:30</td>
                <td colSpan={5} className="py-1 px-2 font-semibold tracking-wider text-center text-slate-600">
                  午餐 / 午休與導師備課時間
                </td>
              </tr>

              {/* Afternoon Periods 5 ~ 7 */}
              {TIME_PERIODS.filter((p) => !p.isMorning).map((p) => (
                <tr key={p.period} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-2 font-semibold bg-slate-100/80 border-r border-slate-300 text-slate-700">
                    <div className="text-sm font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {p.startTime}-{p.endTime}
                    </div>
                  </td>

                  {DAYS_OF_WEEK.map((day) => {
                    const lesson = getTeacherLesson(day.key, p.period);
                    const subject = lesson ? getSubject(lesson.subjectId) : null;

                    return (
                      <td
                        key={day.key}
                        className="p-2.5 border-r border-slate-200 last:border-r-0 align-top h-20"
                      >
                        {lesson && subject ? (
                          <div className="flex flex-col items-center justify-between h-full space-y-1">
                            {/* Class Badge */}
                            <button
                              onClick={() => onSelectClass(lesson.grade, lesson.classNum)}
                              className="px-2 py-0.5 bg-slate-900 text-white font-black text-xs rounded-md shadow-xs hover:bg-emerald-600 transition-all flex items-center gap-1 group"
                              title="點擊查看該班級課表"
                            >
                              <span>{lesson.grade}0{lesson.classNum} 班</span>
                              <ChevronRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            {/* Subject */}
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-md border ${subject.color}`}
                            >
                              {subject.name}
                            </span>

                            {/* Classroom */}
                            {lesson.classroom && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                {lesson.classroom}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium bg-slate-50/50 rounded-lg border border-dashed border-slate-200/80">
                            空堂
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

        {/* Footer Signature */}
        <div className="pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4 border-t border-slate-200 print:flex">
          <div className="flex items-center space-x-8">
            <div>教務處排課簽章：______________________</div>
            <div>教師簽章：______________________</div>
          </div>
          <div className="text-[11px] text-slate-400">
            列印日期：{new Date().toLocaleDateString('zh-TW')}
          </div>
        </div>
      </div>
    </div>
  );
};
