export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export interface TimePeriod {
  period: number; // 1 to 7
  name: string; // e.g. "第一節"
  startTime: string; // e.g. "08:45"
  endTime: string; // e.g. "09:25"
  isMorning: boolean; // 1-4 true, 5-7 false
}

export interface SubjectInfo {
  id: string;
  name: string;
  shortName: string;
  color: string; // Tailwind background color / border style
  textColor: string;
  category: '語文' | '數學' | '自然' | '社會' | '藝能' | '健體' | '綜合' | '彈性/其他';
}

export interface TeacherInfo {
  id: string;
  name: string;
  title: string; // e.g. "101導師", "英語專任", "體育專任"
  mainSubjectId: string;
  contact?: string;
}

export interface LessonSlot {
  grade: number; // 1-6
  classNum: number; // 1-8
  day: DayOfWeek;
  period: number; // 1-7
  subjectId: string;
  teacherId: string;
  classroom?: string;
}

export interface ClassScheduleKey {
  grade: number;
  classNum: number;
}

export type ViewMode = 'class' | 'teacher' | 'master' | 'manage';

export interface SchoolConfig {
  schoolName: string;
  academicYear: string; // e.g. "115 學年度 第一學期"
  notes: string;
  showTimeInHeader: boolean;
  colorCodeEnabled: boolean;
}
