import React from 'react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onClick?: (id: number) => void;
  disabled?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick, disabled }) => {
  return (
    <button
      onClick={() => onClick && onClick(student.id)}
      disabled={disabled}
      className={`
        relative group overflow-hidden
        flex items-center justify-center
        h-16 w-full
        border border-cyan-900/50 bg-slate-900/40 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${!disabled ? 'hover:scale-105 hover:bg-cyan-900/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] cursor-pointer' : 'cursor-default opacity-80'}
      `}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>

      {/* Name Text */}
      <span className="text-xl font-bold text-cyan-100 tracking-widest group-hover:text-cyan-300 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">
        {student.name}
      </span>
    </button>
  );
};