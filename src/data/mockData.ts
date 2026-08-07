import { DayOfWeek, LessonSlot, SchoolConfig, SubjectInfo, TeacherInfo, TimePeriod } from '../types';

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string; shortLabel: string }[] = [
  { key: 'mon', label: '星期一', shortLabel: '一' },
  { key: 'tue', label: '星期二', shortLabel: '二' },
  { key: 'wed', label: '星期三', shortLabel: '三' },
  { key: 'thu', label: '星期四', shortLabel: '四' },
  { key: 'fri', label: '星期五', shortLabel: '五' },
];

export const TIME_PERIODS: TimePeriod[] = [
  { period: 1, name: '第一節', startTime: '08:45', endTime: '09:25', isMorning: true },
  { period: 2, name: '第二節', startTime: '09:35', endTime: '10:15', isMorning: true },
  { period: 3, name: '第三節', startTime: '10:30', endTime: '11:10', isMorning: true },
  { period: 4, name: '第四節', startTime: '11:20', endTime: '12:00', isMorning: true },
  { period: 5, name: '第五節', startTime: '13:35', endTime: '14:15', isMorning: false },
  { period: 6, name: '第六節', startTime: '14:25', endTime: '15:05', isMorning: false },
  { period: 7, name: '第七節', startTime: '15:15', endTime: '15:55', isMorning: false },
];

export const BREAK_TIMES = [
  { name: '早自習 / 朝會', startTime: '08:00', endTime: '08:40', beforePeriod: 1 },
  { name: '午餐與午休', startTime: '12:00', endTime: '13:30', beforePeriod: 5 },
  { name: '放學 / 導師時間', startTime: '15:55', endTime: '16:00', beforePeriod: 8 },
];

export const SUBJECTS: SubjectInfo[] = [
  { id: 'chi', name: '國語', shortName: '國', color: 'bg-orange-50 border-l-4 border-l-orange-500 border-y border-r border-orange-200 text-orange-950', textColor: 'text-orange-900', category: '語文' },
  { id: 'math', name: '數學', shortName: '數', color: 'bg-blue-50 border-l-4 border-l-blue-500 border-y border-r border-blue-200 text-blue-950', textColor: 'text-blue-900', category: '數學' },
  { id: 'eng', name: '英語', shortName: '英', color: 'bg-purple-50 border-l-4 border-l-purple-500 border-y border-r border-purple-200 text-purple-950', textColor: 'text-purple-900', category: '語文' },
  { id: 'sci', name: '自然與生活科技', shortName: '自然', color: 'bg-emerald-50 border-l-4 border-l-emerald-500 border-y border-r border-emerald-200 text-emerald-950', textColor: 'text-emerald-900', category: '自然' },
  { id: 'soc', name: '社會', shortName: '社', color: 'bg-amber-50 border-l-4 border-l-amber-500 border-y border-r border-amber-200 text-amber-950', textColor: 'text-amber-900', category: '社會' },
  { id: 'pe', name: '體育', shortName: '體', color: 'bg-yellow-50 border-l-4 border-l-yellow-500 border-y border-r border-yellow-200 text-yellow-950', textColor: 'text-yellow-900', category: '健體' },
  { id: 'mus', name: '音樂', shortName: '音', color: 'bg-violet-50 border-l-4 border-l-violet-500 border-y border-r border-violet-200 text-violet-950', textColor: 'text-violet-900', category: '藝能' },
  { id: 'art', name: '視覺藝術', shortName: '美', color: 'bg-pink-50 border-l-4 border-l-pink-500 border-y border-r border-pink-200 text-pink-950', textColor: 'text-pink-900', category: '藝能' },
  { id: 'comp', name: '資訊電腦', shortName: '電', color: 'bg-sky-50 border-l-4 border-l-sky-500 border-y border-r border-sky-200 text-sky-950', textColor: 'text-sky-900', category: '彈性/其他' },
  { id: 'integ', name: '綜合活動', shortName: '綜', color: 'bg-teal-50 border-l-4 border-l-teal-500 border-y border-r border-teal-200 text-teal-950', textColor: 'text-teal-900', category: '綜合' },
  { id: 'health', name: '健康教育', shortName: '健', color: 'bg-green-50 border-l-4 border-l-green-500 border-y border-r border-green-200 text-green-950', textColor: 'text-green-900', category: '健體' },
  { id: 'local', name: '本土語言', shortName: '本土', color: 'bg-lime-50 border-l-4 border-l-lime-500 border-y border-r border-lime-200 text-lime-950', textColor: 'text-lime-900', category: '語文' },
  { id: 'homeroom', name: '導師時間 / 班會', shortName: '導', color: 'bg-slate-50 border-l-4 border-l-slate-400 border-y border-r border-slate-200 text-slate-800', textColor: 'text-slate-700', category: '彈性/其他' },
  { id: 'club', name: '社團與彈性學習', shortName: '社團', color: 'bg-fuchsia-50 border-l-4 border-l-fuchsia-500 border-y border-r border-fuchsia-200 text-fuchsia-950', textColor: 'text-fuchsia-900', category: '彈性/其他' },
  { id: 'reading', name: '閱讀推廣', shortName: '閱', color: 'bg-indigo-50 border-l-4 border-l-indigo-500 border-y border-r border-indigo-200 text-indigo-950', textColor: 'text-indigo-900', category: '彈性/其他' },
];

export const DEFAULT_SCHOOL_CONFIG: SchoolConfig = {
  schoolName: '東光國民小學',
  academicYear: '115 學年度 第一學期',
  notes: '說明：1. 體育課請著運動服裝；2. 資訊課請至電腦教室(二)上課；3. 星期二全校下午統一性研習。',
  showTimeInHeader: true,
  colorCodeEnabled: true,
};

// Generate list of Teachers
export function generateTeachers(): TeacherInfo[] {
  const teachers: TeacherInfo[] = [];

  // Homeroom Teachers for 6 grades x 8 classes = 48 homeroom teachers
  const surnames = ['張', '陳', '林', '黃', '李', '王', '吳', '劉', '蔡', '楊', '許', '鄭', '謝', '郭', '洪', '曾', '廖', '賴', '徐', '周', '葉', '蘇', '莊', '江', '何', '蕭', '羅', '高', '簡', '朱'];
  const names = ['雅婷', '冠宇', '怡君', '家豪', '詩涵', '建宏', '佩珊', '志明', '佳玲', '俊傑', '雅琪', '宗翰', '淑芬', '承翰', '惠婷', '智偉', '美玲', '威宇', '心怡', '宇軒', '靜宜', '文彬', '欣怡', '柏翰', '幼婷', '冠廷', '巧薇', '哲瑋', '靜雯', '彥廷', '修齊', '韻如', '敏雄', '思嘉', '國華', '夢筑'];

  let nameIdx = 0;
  for (let g = 1; g <= 6; g++) {
    for (let c = 1; c <= 8; c++) {
      const surname = surnames[(g * 8 + c) % surnames.length];
      const given = names[nameIdx % names.length];
      nameIdx++;
      teachers.push({
        id: `t_hr_${g}_${c}`,
        name: `${surname}${given}`,
        title: `${g}0${c} 導師`,
        mainSubjectId: 'chi',
      });
    }
  }

  // Subject Specialist Teachers (體育, 音樂, 視覺藝術, 英語, 自然, 資訊, 本土)
  const subjectSpecs = [
    { prefix: 'pe', subjectId: 'pe', subjectName: '體育', count: 6 },
    { prefix: 'mus', subjectId: 'mus', subjectName: '音樂', count: 4 },
    { prefix: 'art', subjectId: 'art', subjectName: '視覺藝術', count: 4 },
    { prefix: 'eng', subjectId: 'eng', subjectName: '英語', count: 6 },
    { prefix: 'sci', subjectId: 'sci', subjectName: '自然', count: 5 },
    { prefix: 'comp', subjectId: 'comp', subjectName: '資訊電腦', count: 3 },
    { prefix: 'local', subjectId: 'local', subjectName: '本土語', count: 3 },
  ];

  subjectSpecs.forEach((spec) => {
    for (let i = 1; i <= spec.count; i++) {
      const surname = surnames[(spec.count * 11 + i * 7) % surnames.length];
      const given = names[(nameIdx + i * 3) % names.length];
      teachers.push({
        id: `t_spec_${spec.prefix}_${i}`,
        name: `${surname}${given}`,
        title: `${spec.subjectName}專任 (${i})`,
        mainSubjectId: spec.subjectId,
      });
    }
  });

  return teachers;
}

// Generate complete timetable for 6 grades x 8 classes = 48 classes (35 periods each)
export function generateFullSchedule(teachers: TeacherInfo[]): LessonSlot[] {
  const slots: LessonSlot[] = [];
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

  // Map to keep track of teacher busy slots to avoid teacher double booking in initial gen!
  const teacherBusy: Record<string, Set<string>> = {};

  const isTeacherAvailable = (teacherId: string, day: DayOfWeek, period: number) => {
    const key = `${teacherId}_${day}_${period}`;
    return !teacherBusy[key];
  };

  const markTeacherBusy = (teacherId: string, day: DayOfWeek, period: number) => {
    const key = `${teacherId}_${day}_${period}`;
    if (!teacherBusy[key]) teacherBusy[key] = new Set();
    teacherBusy[key].add('busy');
  };

  // Helper map for specialized teachers
  const specTeachersBySubject: Record<string, TeacherInfo[]> = {};
  teachers.forEach((t) => {
    if (t.id.startsWith('t_spec_')) {
      if (!specTeachersBySubject[t.mainSubjectId]) {
        specTeachersBySubject[t.mainSubjectId] = [];
      }
      specTeachersBySubject[t.mainSubjectId].push(t);
    }
  });

  for (let grade = 1; grade <= 6; grade++) {
    for (let classNum = 1; classNum <= 8; classNum++) {
      const homeroomTeacher = teachers.find((t) => t.id === `t_hr_${grade}_${classNum}`) || teachers[0];

      // Build a balanced set of 35 subject slots for a week
      // High grade vs Low grade subject distribution
      let subjectPool: string[] = [];

      if (grade <= 2) {
        // Low grade (1-2)
        subjectPool = [
          'chi', 'chi', 'chi', 'chi', 'chi', 'chi', 'chi', 'chi',
          'math', 'math', 'math', 'math',
          'eng', 'eng',
          'pe', 'pe',
          'mus', 'art',
          'health', 'health',
          'integ', 'integ', 'integ',
          'local',
          'homeroom', 'homeroom', 'homeroom',
          'reading', 'reading', 'reading',
          'club', 'club', 'club', 'club'
        ];
      } else if (grade <= 4) {
        // Mid grade (3-4)
        subjectPool = [
          'chi', 'chi', 'chi', 'chi', 'chi', 'chi', 'chi',
          'math', 'math', 'math', 'math',
          'eng', 'eng', 'eng',
          'sci', 'sci', 'sci',
          'soc', 'soc', 'soc',
          'pe', 'pe',
          'mus', 'art', 'comp',
          'health', 'integ', 'integ',
          'local', 'homeroom', 'club', 'club', 'reading', 'reading', 'chi'
        ];
      } else {
        // High grade (5-6)
        subjectPool = [
          'chi', 'chi', 'chi', 'chi', 'chi', 'chi',
          'math', 'math', 'math', 'math', 'math',
          'eng', 'eng', 'eng',
          'sci', 'sci', 'sci', 'sci',
          'soc', 'soc', 'soc',
          'pe', 'pe', 'pe',
          'mus', 'art', 'comp', 'comp',
          'health', 'integ', 'integ',
          'local', 'homeroom', 'club', 'reading'
        ];
      }

      // Ensure exact 35 items
      while (subjectPool.length < 35) {
        subjectPool.push('homeroom');
      }
      subjectPool = subjectPool.slice(0, 35);

      let poolIdx = 0;

      for (let d = 0; d < days.length; d++) {
        const day = days[d];
        for (let p = 1; p <= 7; p++) {
          const subjectId = subjectPool[poolIdx % subjectPool.length];
          poolIdx++;

          let assignedTeacher = homeroomTeacher;

          // Check if subject is handled by spec teacher
          const specs = specTeachersBySubject[subjectId];
          if (specs && specs.length > 0) {
            // Find an available spec teacher for this slot
            const availSpec = specs.find((st) => isTeacherAvailable(st.id, day, p));
            if (availSpec) {
              assignedTeacher = availSpec;
            } else {
              // Fallback to homeroom if all specs busy
              assignedTeacher = homeroomTeacher;
            }
          }

          // Mark teacher busy
          markTeacherBusy(assignedTeacher.id, day, p);

          let classroom = undefined;
          if (subjectId === 'pe') classroom = '操場 / 體育館';
          if (subjectId === 'mus') classroom = '音樂教室(一)';
          if (subjectId === 'art') classroom = '美勞教室(二)';
          if (subjectId === 'sci') classroom = '自然實驗室';
          if (subjectId === 'comp') classroom = '電腦教室(二)';

          slots.push({
            grade,
            classNum,
            day,
            period: p,
            subjectId,
            teacherId: assignedTeacher.id,
            classroom,
          });
        }
      }
    }
  }

  return slots;
}
