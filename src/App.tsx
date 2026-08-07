import React, { useState, useEffect, useMemo } from 'react';
import { ViewMode, DayOfWeek, LessonSlot, SchoolConfig, TeacherInfo, SubjectInfo } from './types';
import { generateTeachers, generateFullSchedule, DEFAULT_SCHOOL_CONFIG, SUBJECTS as INITIAL_SUBJECTS } from './data/mockData';
import { exportElementToPdf, triggerPrint } from './utils/pdfPrint';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ClassScheduleView } from './components/ClassScheduleView';
import { TeacherScheduleView } from './components/TeacherScheduleView';
import { MasterOverviewView } from './components/MasterOverviewView';
import { EditLessonModal } from './components/EditLessonModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { EditTeachersModal } from './components/EditTeachersModal';
import { EditSubjectsModal } from './components/EditSubjectsModal';

const LOCAL_STORAGE_KEY_TEACHERS = 'school_timetable_teachers_v1';
const LOCAL_STORAGE_KEY_SUBJECTS = 'school_timetable_subjects_v1';
const LOCAL_STORAGE_KEY_LESSONS = 'school_timetable_lessons_v1';
const LOCAL_STORAGE_KEY_CONFIG = 'school_timetable_config_v1';

export default function App() {
  // Navigation & View States
  const [viewMode, setViewMode] = useState<ViewMode>('class');
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [selectedClassNum, setSelectedClassNum] = useState<number>(2);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data States
  const [subjects, setSubjects] = useState<SubjectInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SUBJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUBJECTS;
  });

  const [teachers, setTeachers] = useState<TeacherInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateTeachers();
  });

  const [lessons, setLessons] = useState<LessonSlot[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LESSONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const initialTeachers = generateTeachers();
    return generateFullSchedule(initialTeachers);
  });

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        let changed = false;
        if (parsed.schoolName === '市立陽光國民小學' || !parsed.schoolName) {
          parsed.schoolName = '東光國民小學';
          changed = true;
        }
        if (parsed.academicYear && parsed.academicYear.includes('113')) {
          parsed.academicYear = parsed.academicYear.replace('113', '115');
          changed = true;
        }
        if (changed) {
          localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SCHOOL_CONFIG;
  });

  // Modal States
  const [editingSlot, setEditingSlot] = useState<{
    grade: number;
    classNum: number;
    day: DayOfWeek;
    period: number;
  } | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isEditTeachersOpen, setIsEditTeachersOpen] = useState<boolean>(false);
  const [isEditSubjectsOpen, setIsEditSubjectsOpen] = useState<boolean>(false);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LESSONS, JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(schoolConfig));
  }, [schoolConfig]);

  // Ensure selectedTeacherId is valid
  useEffect(() => {
    if (!selectedTeacherId && teachers.length > 0) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers, selectedTeacherId]);

  // Helper to switch view to Teacher View
  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setViewMode('teacher');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to switch view to Class View
  const handleSelectClass = (grade: number, classNum: number) => {
    setSelectedGrade(grade);
    setSelectedClassNum(classNum);
    setViewMode('class');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Slot Edit Handlers
  const handleEditSlot = (day: DayOfWeek, period: number) => {
    setEditingSlot({
      grade: selectedGrade,
      classNum: selectedClassNum,
      day,
      period,
    });
  };

  const handleSaveLesson = (updatedSlot: LessonSlot) => {
    setLessons((prev) => {
      // Remove existing lesson for this grade, class, day, period if exists
      const filtered = prev.filter(
        (l) =>
          !(
            l.grade === updatedSlot.grade &&
            l.classNum === updatedSlot.classNum &&
            l.day === updatedSlot.day &&
            l.period === updatedSlot.period
          )
      );
      return [...filtered, updatedSlot];
    });
  };

  const handleDeleteLesson = (grade: number, classNum: number, day: DayOfWeek, period: number) => {
    setLessons((prev) =>
      prev.filter(
        (l) =>
          !(l.grade === grade && l.classNum === classNum && l.day === day && l.period === period)
      )
    );
  };

  // Teachers CRUD Handlers
  const handleAddTeacher = (newTeacher: TeacherInfo) => {
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const handleUpdateTeacher = (updatedTeacher: TeacherInfo) => {
    setTeachers((prev) => prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)));
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    // Unassign lessons with this teacher
    setLessons((prev) => prev.filter((l) => l.teacherId !== teacherId));
  };

  // Subjects CRUD Handlers
  const handleAddSubject = (newSubject: SubjectInfo) => {
    setSubjects((prev) => [...prev, newSubject]);
  };

  const handleUpdateSubject = (updatedSubject: SubjectInfo) => {
    setSubjects((prev) => prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    // Unassign lessons with this subject
    setLessons((prev) => prev.filter((l) => l.subjectId !== subjectId));
  };

  // Reset Data to Full Preset
  const handleResetData = () => {
    const newTeachers = generateTeachers();
    const newLessons = generateFullSchedule(newTeachers);
    setSubjects(INITIAL_SUBJECTS);
    setTeachers(newTeachers);
    setLessons(newLessons);
    setSchoolConfig(DEFAULT_SCHOOL_CONFIG);
    if (newTeachers.length > 0) setSelectedTeacherId(newTeachers[0].id);
  };

  // Export JSON
  const handleExportJson = () => {
    const data = {
      teachers,
      subjects,
      lessons,
      schoolConfig,
      exportDate: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schoolConfig.schoolName}_功課表備份.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.teachers && parsed.lessons) {
          setTeachers(parsed.teachers);
          if (parsed.subjects) setSubjects(parsed.subjects);
          setLessons(parsed.lessons);
          if (parsed.schoolConfig) setSchoolConfig(parsed.schoolConfig);
          alert('成功匯入課表資料！');
          setIsSettingsOpen(false);
        } else {
          alert('檔案格式不正確，找不到課表或教師資料。');
        }
      } catch (err) {
        console.error(err);
        alert('解析 JSON 檔案失敗，請確認檔案格式。');
      }
    };
    reader.readAsText(file);
  };

  // Export PDF Handler
  const handleExportPdf = () => {
    const printArea = document.getElementById('timetable-print-area');
    if (!printArea) {
      alert('找不到課表列印區域');
      return;
    }

    let fileName = `${schoolConfig.schoolName}_課表.pdf`;
    let title = '全校課表';

    if (viewMode === 'class') {
      fileName = `${schoolConfig.schoolName}_${selectedGrade}年${selectedClassNum}班_功課表.pdf`;
      title = `${selectedGrade}年${selectedClassNum}班 功課表`;
    } else if (viewMode === 'teacher') {
      const currentTeacher = teachers.find((t) => t.id === selectedTeacherId);
      const tName = currentTeacher ? currentTeacher.name : '教師';
      fileName = `${schoolConfig.schoolName}_${tName}老師_個人課表.pdf`;
      title = `${tName} 老師個人課表`;
    } else if (viewMode === 'master') {
      fileName = `${schoolConfig.schoolName}_${selectedGrade}年級總課表.pdf`;
      title = `${selectedGrade} 年級總課表`;
    }

    exportElementToPdf(printArea, fileName, title);
  };

  // Find current active teacher object for Teacher View
  const currentTeacherObj = useMemo(() => {
    return (
      teachers.find((t) => t.id === selectedTeacherId) ||
      teachers[0] || {
        id: 'default',
        name: '老師',
        title: '',
        mainSubjectId: 'chi',
      }
    );
  }, [teachers, selectedTeacherId]);

  // Current lesson for edit modal
  const editingLessonObj = useMemo(() => {
    if (!editingSlot) return undefined;
    return lessons.find(
      (l) =>
        l.grade === editingSlot.grade &&
        l.classNum === editingSlot.classNum &&
        l.day === editingSlot.day &&
        l.period === editingSlot.period
    );
  }, [editingSlot, lessons]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-blue-200 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        schoolConfig={schoolConfig}
        onPrint={triggerPrint}
        onExportPdf={handleExportPdf}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenEditTeachers={() => setIsEditTeachersOpen(true)}
        onOpenEditSubjects={() => setIsEditSubjectsOpen(true)}
        onResetData={handleResetData}
      />

      {/* Filter Bar */}
      <FilterBar
        viewMode={viewMode}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedClassNum={selectedClassNum}
        setSelectedClassNum={setSelectedClassNum}
        selectedTeacherId={selectedTeacherId}
        setSelectedTeacherId={setSelectedTeacherId}
        teachers={teachers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectTeacherById={handleSelectTeacher}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'class' && (
          <ClassScheduleView
            grade={selectedGrade}
            classNum={selectedClassNum}
            lessons={lessons}
            teachers={teachers}
            subjects={subjects}
            schoolConfig={schoolConfig}
            isEditMode={isEditMode}
            onSelectTeacher={handleSelectTeacher}
            onEditSlot={handleEditSlot}
            onQuickGradeClassChange={(g, c) => {
              setSelectedGrade(g);
              setSelectedClassNum(c);
            }}
          />
        )}

        {viewMode === 'teacher' && (
          <TeacherScheduleView
            teacher={currentTeacherObj}
            allTeachers={teachers}
            lessons={lessons}
            subjects={subjects}
            schoolConfig={schoolConfig}
            onSelectClass={handleSelectClass}
            onSelectTeacher={(id) => setSelectedTeacherId(id)}
          />
        )}

        {viewMode === 'master' && (
          <MasterOverviewView
            grade={selectedGrade}
            lessons={lessons}
            teachers={teachers}
            subjects={subjects}
            schoolConfig={schoolConfig}
            onSelectClass={handleSelectClass}
            onSelectTeacher={handleSelectTeacher}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 text-center border-t border-slate-800 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} {schoolConfig.schoolName} 功課表與課表排課管理系統
          </div>
          <div className="text-slate-500">
            支援 1-6 年級 / 1-8 班全校課表與教師獨立課表對照、PDF 匯出與 A4 列印
          </div>
        </div>
      </footer>

      {/* Edit Lesson Modal */}
      {editingSlot && (
        <EditLessonModal
          isOpen={!!editingSlot}
          onClose={() => setEditingSlot(null)}
          grade={editingSlot.grade}
          classNum={editingSlot.classNum}
          day={editingSlot.day}
          period={editingSlot.period}
          currentLesson={editingLessonObj}
          allLessons={lessons}
          teachers={teachers}
          subjects={subjects}
          onSaveLesson={handleSaveLesson}
          onDeleteLesson={handleDeleteLesson}
        />
      )}

      {/* School Settings Modal */}
      <SchoolSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        schoolConfig={schoolConfig}
        onSaveConfig={setSchoolConfig}
        onResetData={handleResetData}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* Edit Teachers Modal */}
      <EditTeachersModal
        isOpen={isEditTeachersOpen}
        onClose={() => setIsEditTeachersOpen(false)}
        teachers={teachers}
        subjects={subjects}
        onAddTeacher={handleAddTeacher}
        onUpdateTeacher={handleUpdateTeacher}
        onDeleteTeacher={handleDeleteTeacher}
      />

      {/* Edit Subjects Modal */}
      <EditSubjectsModal
        isOpen={isEditSubjectsOpen}
        onClose={() => setIsEditSubjectsOpen(false)}
        subjects={subjects}
        onAddSubject={handleAddSubject}
        onUpdateSubject={handleUpdateSubject}
        onDeleteSubject={handleDeleteSubject}
      />
    </div>
  );
}
