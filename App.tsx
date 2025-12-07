import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { StudentCard } from './components/StudentCard';
import { CLASS_NAME, SCHOOL_NAME, INITIAL_STUDENTS } from './constants';
import { Student, AppState } from './types';
import { Clock, Users, UserCheck, UserX, Power, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
  const [appState, setAppState] = useState<AppState>('idle');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleStartCheckIn = () => {
    setAppState('active');
    // Reset attendace when starting new session? 
    // Or keep previous? Let's reset for a clean session based on requirements.
    setStudents(INITIAL_STUDENTS.map(s => ({ ...s, status: 'absent', checkInTime: undefined })));
  };

  const handleEndCheckIn = () => {
    setAppState('summary');
  };

  const handleStudentClick = (id: number) => {
    if (appState !== 'active') return;

    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        return {
          ...student,
          status: 'present',
          checkInTime: new Date().toLocaleTimeString('zh-CN', { hour12: false })
        };
      }
      return student;
    }));
  };

  const handleReset = () => {
    setAppState('idle');
    setStudents(INITIAL_STUDENTS);
  };

  // Derived State
  const absentStudents = useMemo(() => students.filter(s => s.status === 'absent'), [students]);
  const presentStudents = useMemo(() => students.filter(s => s.status === 'present'), [students]);

  // Sort present students by check-in time (descending or ascending)
  const sortedPresentStudents = useMemo(() => {
    return [...presentStudents].sort((a, b) => {
        if (!a.checkInTime || !b.checkInTime) return 0;
        return b.checkInTime.localeCompare(a.checkInTime); // Newest first
    });
  }, [presentStudents]);

  return (
    <Layout>
      {/* --- TOP HEADER --- */}
      <header className="flex justify-between items-start mb-8 z-10 border-b border-cyan-500/30 pb-4 relative">
        {/* Decorative elements under header */}
        <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
        <div className="absolute bottom-0 right-0 w-32 h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>

        {/* Left: Time */}
        <div className="flex items-center space-x-3 w-1/4">
          <Clock className="w-8 h-8 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-xs text-cyan-600 font-scifi uppercase tracking-widest">系统时间</span>
            <span className="text-3xl font-tech text-cyan-100 tabular-nums drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Center: School Name */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative p-4 border-x border-cyan-500/20 bg-black/40 backdrop-blur-md clip-path-polygon">
             <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] text-center">
              {SCHOOL_NAME}
            </h1>
            <div className="text-center text-cyan-700 text-xs tracking-[0.8em] mt-1 font-scifi">智慧校园考勤系统</div>
          </div>
        </div>

        {/* Right: Class Info */}
        <div className="flex flex-col items-end w-1/4">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-tech text-cyan-100 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">{CLASS_NAME}</span>
            <Users className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-xs text-cyan-600 font-scifi uppercase tracking-widest mt-1">考勤监控</span>
        </div>
      </header>


      {/* --- CENTRAL CONTENT --- */}
      <main className="flex-1 relative z-10 flex flex-col min-h-0">
        
        {/* VIEW: IDLE & ACTIVE (Grid of Names) */}
        {appState !== 'summary' && (
          <div className="flex-1 overflow-y-auto pr-2 relative">
             {/* Info Banner */}
             <div className="mb-6 flex justify-between items-center bg-cyan-900/10 border-l-4 border-cyan-500 p-3">
               <div className="flex items-center text-cyan-300">
                  <div className={`w-3 h-3 rounded-full mr-3 ${appState === 'active' ? 'bg-red-500 animate-ping' : 'bg-yellow-500'}`}></div>
                  <span className="font-scifi tracking-wider uppercase text-sm">
                    {appState === 'idle' ? '系统待机 - 等待启动' : '系统运行中 - 点击姓名签到'}
                  </span>
               </div>
               <div className="font-tech text-cyan-500 text-xl">
                 待签人数: {absentStudents.length} / {students.length}
               </div>
             </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-20">
              {/* If idle, show all. If active, show only absent (to simulate "disappearing" on check-in) */}
              {appState === 'idle' 
                ? students.map(student => (
                    <StudentCard 
                      key={student.id} 
                      student={student} 
                      disabled={true} 
                    />
                  ))
                : absentStudents.map(student => (
                    <StudentCard 
                      key={student.id} 
                      student={student} 
                      onClick={handleStudentClick}
                    />
                  ))
              }
            </div>

            {/* Empty state when all checked in */}
            {appState === 'active' && absentStudents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center flex-col animate-pulse">
                <UserCheck className="w-32 h-32 text-green-400 mb-4" />
                <h2 className="text-4xl font-bold text-green-300 tracking-widest uppercase">全员到齐</h2>
              </div>
            )}
          </div>
        )}

        {/* VIEW: SUMMARY (Two Columns) */}
        {appState === 'summary' && (
          <div className="flex-1 grid grid-cols-2 gap-8 h-full min-h-0 pb-20">
            
            {/* Left: Present Students */}
            <div className="flex flex-col h-full border border-green-900/50 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <div className="bg-green-900/30 p-4 border-b border-green-700/50 flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-bold text-green-300 flex items-center">
                  <UserCheck className="mr-3 w-6 h-6" /> 已到学生
                </h3>
                <span className="font-tech text-4xl text-green-400">{presentStudents.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                  {sortedPresentStudents.map(student => (
                    <div key={student.id} className="flex justify-between items-center p-3 bg-green-950/30 border border-green-800/30 rounded hover:bg-green-900/40 transition-colors">
                      <span className="text-xl text-green-100 truncate mr-2">{student.name}</span>
                      <span className="font-tech text-sm text-green-400 whitespace-nowrap">{student.checkInTime}</span>
                    </div>
                  ))}
                </div>
                {presentStudents.length === 0 && (
                   <div className="text-center text-gray-500 mt-10">暂无学生签到</div>
                )}
              </div>
            </div>

            {/* Right: Absent Students */}
            <div className="flex flex-col h-full border border-red-900/50 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <div className="bg-red-900/30 p-4 border-b border-red-700/50 flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-bold text-red-300 flex items-center">
                  <UserX className="mr-3 w-6 h-6" /> 未到学生
                </h3>
                <span className="font-tech text-4xl text-red-400">{absentStudents.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                  {absentStudents.map(student => (
                    <div key={student.id} className="flex justify-between items-center p-3 bg-red-950/30 border border-red-800/30 rounded hover:bg-red-900/40 transition-colors">
                      <span className="text-xl text-red-100 truncate">{student.name}</span>
                    </div>
                  ))}
                </div>
                {absentStudents.length === 0 && (
                   <div className="text-center text-gray-500 mt-10">无缺勤记录</div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>


      {/* --- FOOTER CONTROLS --- */}
      <footer className="fixed bottom-0 right-0 p-6 z-50 flex justify-end pointer-events-none">
        <div className="pointer-events-auto flex gap-4">
          
          {appState === 'idle' && (
            <button
              onClick={handleStartCheckIn}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-12 rounded-sm clip-path-button text-xl tracking-[0.2em] shadow-[0_0_20px_rgba(8,145,178,0.6)] hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] transition-all duration-300 border-2 border-cyan-300 flex items-center group"
            >
              <Power className="mr-3 group-hover:rotate-180 transition-transform duration-700" />
              开始签到
            </button>
          )}

          {appState === 'active' && (
            <button
              onClick={handleEndCheckIn}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-12 rounded-sm clip-path-button text-xl tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:shadow-[0_0_40px_rgba(248,113,113,0.8)] transition-all duration-300 border-2 border-red-300 flex items-center"
            >
              <Power className="mr-3" />
              结束签到
            </button>
          )}

          {appState === 'summary' && (
            <button
              onClick={handleReset}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-4 px-12 rounded-sm clip-path-button text-xl tracking-[0.2em] shadow-lg transition-all duration-300 border-2 border-slate-500 flex items-center"
            >
              <RotateCcw className="mr-3" />
              重置系统
            </button>
          )}
        </div>
      </footer>
      
      {/* CSS for custom shapes not handled by Tailwind utilities easily */}
      <style>{`
        .clip-path-polygon {
          clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%);
        }
        .clip-path-button {
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
      `}</style>
    </Layout>
  );
};

export default App;