import React, { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, Send, Play, Trash2, Database, HelpCircle } from 'lucide-react';
import { SimulatedStudent, TerminalLine } from '../types';

export default function ConsoleTerminal() {
  const [students, setStudents] = useState<SimulatedStudent[]>(() => {
    const saved = localStorage.getItem('simulated_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Default initial students for demonstration
    return [
      { rollNo: 101, name: "Arun Sharma", department: "Computer Science", age: 20, marks: 88.5 },
      { rollNo: 102, name: "Sneha Patel", department: "Information Tech", age: 21, marks: 92.0 },
      { rollNo: 103, name: "Rahul Verma", department: "Electronics", age: 20, marks: 76.4 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('simulated_students', JSON.stringify(students));
  }, [students]);

  const [terminalLog, setTerminalLog] = useState<TerminalLine[]>([
    { text: "=============================================", type: "header" },
    { text: "       STUDENT MANAGEMENT SYSTEM (C++)", type: "header" },
    { text: "=============================================", type: "header" },
    { text: "System Initialized. Binary simulation active for 'students.dat'.", type: "success" },
    { text: "1. Add Student", type: "output" },
    { text: "2. Display All Students", type: "output" },
    { text: "3. Search Student by Roll Number", type: "output" },
    { text: "4. Update Student Details", type: "output" },
    { text: "5. Delete Student Record", type: "output" },
    { text: "6. Exit", type: "output" },
    { text: "=============================================", type: "header" },
    { text: "Enter your choice (1-6): ", type: "output" }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [currentStep, setCurrentStep] = useState<'MENU' | 'ADD_ROLL' | 'ADD_NAME' | 'ADD_DEPT' | 'ADD_AGE' | 'ADD_MARKS' | 'SEARCH_ROLL' | 'UPDATE_ROLL' | 'UPDATE_NAME' | 'UPDATE_DEPT' | 'UPDATE_AGE' | 'UPDATE_MARKS' | 'DELETE_ROLL'>('MENU');
  
  // Storing temporary inputs for Student objects during stepwise operations
  const [tempStudent, setTempStudent] = useState<Partial<SimulatedStudent>>({});
  const [targetRoll, setTargetRoll] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLog]);

  const appendLines = (lines: { text: string; type: TerminalLine['type'] }[]) => {
    setTerminalLog(prev => [...prev, ...lines]);
  };

  const handleMenuChoice = (choice: string) => {
    appendLines([{ text: choice, type: 'input' }]);

    switch (choice.trim()) {
      case '1':
        appendLines([
          { text: "\n--- Enter Student Details ---", type: 'header' },
          { text: "Enter Roll Number: ", type: 'output' }
        ]);
        setCurrentStep('ADD_ROLL');
        break;
      case '2':
        handleDisplayAll();
        break;
      case '3':
        appendLines([
          { text: "\nEnter Roll Number to search: ", type: 'output' }
        ]);
        setCurrentStep('SEARCH_ROLL');
        break;
      case '4':
        appendLines([
          { text: "\nEnter Roll Number to update: ", type: 'output' }
        ]);
        setCurrentStep('UPDATE_ROLL');
        break;
      case '5':
        appendLines([
          { text: "\nEnter Roll Number to delete: ", type: 'output' }
        ]);
        setCurrentStep('DELETE_ROLL');
        break;
      case '6':
        appendLines([
          { text: "\nThank you for using Student Management System! Goodbye.", type: 'success' },
          { text: "\n[System execution terminated. Click 'Reset Terminal' to restart]", type: 'header' }
        ]);
        break;
      default:
        appendLines([
          { text: "Invalid choice! Please enter a number between 1 and 6.", type: 'error' },
          { text: "Enter your choice (1-6): ", type: 'output' }
        ]);
    }
  };

  const handleDisplayAll = () => {
    if (students.length === 0) {
      appendLines([
        { text: "\nError: No records found. Database file 'students.dat' is empty.", type: 'error' },
        { text: "=============================================", type: "header" },
        { text: "Enter your choice (1-6): ", type: 'output' }
      ]);
      return;
    }

    const headerLine = "========================================================================";
    const columnsLine = "Roll No     Name                 Department           Age       Marks     ";
    const subHeader = "------------------------------------------------------------------------";

    const tableRows = students.map(s => {
      const rollStr = String(s.rollNo).padEnd(12);
      const nameStr = s.name.substring(0, 19).padEnd(21);
      const deptStr = s.department.substring(0, 19).padEnd(21);
      const ageStr = String(s.age).padEnd(10);
      const marksStr = Number(s.marks).toFixed(2).padEnd(10);
      return { text: `${rollStr}${nameStr}${deptStr}${ageStr}${marksStr}`, type: 'output' as const };
    });

    appendLines([
      { text: "\n" + headerLine, type: 'header' },
      { text: columnsLine, type: 'header' },
      { text: subHeader, type: 'header' },
      ...tableRows,
      { text: headerLine, type: 'header' },
      { text: "Enter your choice (1-6): ", type: 'output' }
    ]);
  };

  const processInput = (val: string) => {
    const trimmed = val.trim();

    if (currentStep === 'MENU') {
      handleMenuChoice(trimmed);
      return;
    }

    appendLines([{ text: val, type: 'input' }]);

    if (currentStep === 'ADD_ROLL') {
      const roll = parseInt(trimmed);
      if (isNaN(roll) || roll <= 0) {
        appendLines([
          { text: "Invalid input! Please enter a positive integer for Roll Number: ", type: 'error' }
        ]);
        return;
      }
      // Check duplicate
      const exists = students.some(s => s.rollNo === roll);
      if (exists) {
        appendLines([
          { text: `Error: Roll Number ${roll} already exists in the database!`, type: 'error' },
          { text: "=============================================", type: "header" },
          { text: "Enter your choice (1-6): ", type: 'output' }
        ]);
        setCurrentStep('MENU');
        return;
      }
      setTempStudent({ rollNo: roll });
      appendLines([{ text: "Enter Student Name: ", type: 'output' }]);
      setCurrentStep('ADD_NAME');
    }

    else if (currentStep === 'ADD_NAME') {
      if (trimmed.length === 0) {
        appendLines([{ text: "Name cannot be empty! Enter Name: ", type: 'error' }]);
        return;
      }
      setTempStudent(prev => ({ ...prev, name: trimmed }));
      appendLines([{ text: "Enter Department: ", type: 'output' }]);
      setCurrentStep('ADD_DEPT');
    }

    else if (currentStep === 'ADD_DEPT') {
      if (trimmed.length === 0) {
        appendLines([{ text: "Department cannot be empty! Enter Department: ", type: 'error' }]);
        return;
      }
      setTempStudent(prev => ({ ...prev, department: trimmed }));
      appendLines([{ text: "Enter Age: ", type: 'output' }]);
      setCurrentStep('ADD_AGE');
    }

    else if (currentStep === 'ADD_AGE') {
      const age = parseInt(trimmed);
      if (isNaN(age) || age <= 0 || age > 120) {
        appendLines([{ text: "Invalid input! Please enter a valid age (1-120): ", type: 'error' }]);
        return;
      }
      setTempStudent(prev => ({ ...prev, age }));
      appendLines([{ text: "Enter Marks: ", type: 'output' }]);
      setCurrentStep('ADD_MARKS');
    }

    else if (currentStep === 'ADD_MARKS') {
      const marks = parseFloat(trimmed);
      if (isNaN(marks) || marks < 0 || marks > 100) {
        appendLines([{ text: "Invalid input! Please enter marks between 0.0 and 100.0: ", type: 'error' }]);
        return;
      }
      
      const newStudent: SimulatedStudent = {
        rollNo: tempStudent.rollNo!,
        name: tempStudent.name!,
        department: tempStudent.department!,
        age: tempStudent.age!,
        marks: marks
      };

      setStudents(prev => [...prev, newStudent]);
      appendLines([
        { text: "\nSuccess: Student record added successfully!", type: 'success' },
        { text: "=============================================", type: "header" },
        { text: "Enter your choice (1-6): ", type: 'output' }
      ]);
      setTempStudent({});
      setCurrentStep('MENU');
    }

    else if (currentStep === 'SEARCH_ROLL') {
      const roll = parseInt(trimmed);
      if (isNaN(roll) || roll <= 0) {
        appendLines([{ text: "Invalid Roll Number! Enter a positive integer: ", type: 'error' }]);
        return;
      }
      
      const found = students.find(s => s.rollNo === roll);
      if (found) {
        const rollStr = String(found.rollNo).padEnd(12);
        const nameStr = found.name.padEnd(20);
        const deptStr = found.department.padEnd(20);
        const ageStr = String(found.age).padEnd(10);
        const marksStr = Number(found.marks).toFixed(2).padEnd(10);

        appendLines([
          { text: "\n--- Student Record Found ---", type: 'success' },
          { text: "------------------------------------------------------------------------", type: 'header' },
          { text: "Roll No     Name                 Department           Age       Marks     ", type: 'header' },
          { text: "------------------------------------------------------------------------", type: 'header' },
          { text: `${rollStr}${nameStr}${deptStr}${ageStr}${marksStr}`, type: 'output' },
          { text: "------------------------------------------------------------------------", type: 'header' },
          { text: "Enter your choice (1-6): ", type: 'output' }
        ]);
      } else {
        appendLines([
          { text: `\nError: Student with Roll Number ${roll} not found!`, type: 'error' },
          { text: "=============================================", type: "header" },
          { text: "Enter your choice (1-6): ", type: 'output' }
        ]);
      }
      setCurrentStep('MENU');
    }

    else if (currentStep === 'UPDATE_ROLL') {
      const roll = parseInt(trimmed);
      if (isNaN(roll) || roll <= 0) {
        appendLines([{ text: "Invalid Roll Number! Enter a positive integer: ", type: 'error' }]);
        return;
      }

      const match = students.find(s => s.rollNo === roll);
      if (!match) {
        appendLines([
          { text: `\nError: Student with Roll Number ${roll} not found!`, type: 'error' },
          { text: "=============================================", type: "header" },
          { text: "Enter your choice (1-6): ", type: 'output' }
        ]);
        setCurrentStep('MENU');
        return;
      }

      setTargetRoll(roll);
      setTempStudent({ ...match });

      appendLines([
        { text: "\n--- Existing Details ---", type: 'header' },
        { text: `Roll No: ${match.rollNo} | Name: ${match.name} | Dept: ${match.department} | Age: ${match.age} | Marks: ${match.marks}`, type: 'output' },
        { text: `\nEnter New Name (or press enter to keep '${match.name}'): `, type: 'output' }
      ]);
      setCurrentStep('UPDATE_NAME');
    }

    else if (currentStep === 'UPDATE_NAME') {
      const name = trimmed.length > 0 ? trimmed : tempStudent.name!;
      setTempStudent(prev => ({ ...prev, name }));
      appendLines([{ text: `Enter New Department (or press enter to keep '${tempStudent.department}'): `, type: 'output' }]);
      setCurrentStep('UPDATE_DEPT');
    }

    else if (currentStep === 'UPDATE_DEPT') {
      const dept = trimmed.length > 0 ? trimmed : tempStudent.department!;
      setTempStudent(prev => ({ ...prev, department: dept }));
      appendLines([{ text: `Enter New Age (or enter 0 to keep '${tempStudent.age}'): `, type: 'output' }]);
      setCurrentStep('UPDATE_AGE');
    }

    else if (currentStep === 'UPDATE_AGE') {
      let age = tempStudent.age!;
      if (trimmed !== '0' && trimmed.length > 0) {
        const parsedAge = parseInt(trimmed);
        if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
          appendLines([{ text: "Invalid age! Enter a valid age (1-120) or 0 to keep current: ", type: 'error' }]);
          return;
        }
        age = parsedAge;
      }
      setTempStudent(prev => ({ ...prev, age }));
      appendLines([{ text: `Enter New Marks (or enter -1 to keep '${tempStudent.marks}'): `, type: 'output' }]);
      setCurrentStep('UPDATE_MARKS');
    }

    else if (currentStep === 'UPDATE_MARKS') {
      let marks = tempStudent.marks!;
      if (trimmed !== '-1' && trimmed.length > 0) {
        const parsedMarks = parseFloat(trimmed);
        if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
          appendLines([{ text: "Invalid marks! Enter marks (0.0 to 100.0) or -1 to keep current: ", type: 'error' }]);
          return;
        }
        marks = parsedMarks;
      }

      const updatedStudent: SimulatedStudent = {
        rollNo: targetRoll!,
        name: tempStudent.name!,
        department: tempStudent.department!,
        age: tempStudent.age!,
        marks: marks
      };

      setStudents(prev => prev.map(s => s.rollNo === targetRoll ? updatedStudent : s));
      appendLines([
        { text: "\nSuccess: Student record updated successfully in 'students.dat' simulation!", type: 'success' },
        { text: "=============================================", type: "header" },
        { text: "Enter your choice (1-6): ", type: 'output' }
      ]);
      setTempStudent({});
      setTargetRoll(null);
      setCurrentStep('MENU');
    }

    else if (currentStep === 'DELETE_ROLL') {
      const roll = parseInt(trimmed);
      if (isNaN(roll) || roll <= 0) {
        appendLines([{ text: "Invalid Roll Number! Enter a positive integer: ", type: 'error' }]);
        return;
      }

      const exists = students.some(s => s.rollNo === roll);
      if (exists) {
        setStudents(prev => prev.filter(s => s.rollNo !== roll));
        appendLines([
          { text: `\nSuccess: Student with Roll Number ${roll} deleted successfully from 'students.dat'!`, type: 'success' },
          { text: "=============================================", type: "header" },
          { text: "Enter your choice (1-6): ", type: 'output' }
        ]);
      } else {
        appendLines([
          { text: `\nError: Student with Roll Number ${roll} not found!`, type: 'error' },
          { text: "=============================================", type: "header" },
          { text: "Enter your choice (1-6): ", type: 'output' }
        ]);
      }
      setCurrentStep('MENU');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processInput(inputVal);
    setInputVal('');
  };

  const handleReset = () => {
    setTerminalLog([
      { text: "=============================================", type: "header" },
      { text: "       STUDENT MANAGEMENT SYSTEM (C++)", type: "header" },
      { text: "=============================================", type: "header" },
      { text: "students.dat stream reset. Local binary database synchronized.", type: "success" },
      { text: "1. Add Student", type: "output" },
      { text: "2. Display All Students", type: "output" },
      { text: "3. Search Student by Roll Number", type: "output" },
      { text: "4. Update Student Details", type: "output" },
      { text: "5. Delete Student Record", type: "output" },
      { text: "6. Exit", type: "output" },
      { text: "=============================================", type: "header" },
      { text: "Enter your choice (1-6): ", type: "output" }
    ]);
    setCurrentStep('MENU');
    setTempStudent({});
    setTargetRoll(null);
    setInputVal('');
  };

  const handleWipeDatabase = () => {
    setStudents([]);
    appendLines([
      { text: "\n[!] students.dat wiped successfully. Database is now empty.", type: 'error' },
      { text: "Enter your choice (1-6): ", type: 'output' }
    ]);
  };

  const triggerOption = (opt: string) => {
    if (currentStep !== 'MENU') return;
    setInputVal('');
    handleMenuChoice(opt);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono" id="terminal-container">
      {/* Top bar of terminal */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-slate-400 font-medium ml-2 flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>students_system.exe (Dev C++ Terminal Emulator)</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            title="Reset simulation stream"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restart Stream</span>
          </button>
          <button 
            onClick={handleWipeDatabase}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded bg-red-950/40 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-all cursor-pointer border border-red-900/20"
            title="Clear saved students.dat records"
          >
            <Trash2 className="w-3 h-3" />
            <span>Wipe .dat</span>
          </button>
        </div>
      </div>

      {/* Database Quick Stats */}
      <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800/40 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>Active Records inside <strong className="text-slate-300">students.dat</strong>: <strong className="text-emerald-400">{students.length}</strong></span>
        </div>
        <div className="text-[11px] text-slate-500 flex items-center space-x-1">
          <HelpCircle className="w-3 h-3" />
          <span>Simulates `sizeof(Student) = {sizeofStudentSimulator()} bytes` struct binary stream</span>
        </div>
      </div>

      {/* Terminal Screen log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1 text-sm scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent select-text">
        {terminalLog.map((line, idx) => {
          let style = "text-slate-300";
          if (line.type === 'input') {
            style = "text-yellow-400 font-semibold before:content-['>_'] before:text-slate-500";
          } else if (line.type === 'error') {
            style = "text-rose-400 font-medium";
          } else if (line.type === 'success') {
            style = "text-emerald-400 font-medium";
          } else if (line.type === 'header') {
            style = "text-sky-400 font-semibold";
          }
          return (
            <div key={idx} className={`whitespace-pre-wrap ${style}`}>
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Menu Guidance Controls */}
      {currentStep === 'MENU' && (
        <div className="p-3 bg-slate-900/60 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button 
            onClick={() => triggerOption('1')} 
            className="flex items-center justify-center space-x-1 text-xs py-2 px-3 rounded-lg bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 hover:bg-emerald-900/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3" />
            <span>1. Add Record</span>
          </button>
          <button 
            onClick={() => triggerOption('2')} 
            className="flex items-center justify-center space-x-1 text-xs py-2 px-3 rounded-lg bg-blue-950/30 text-blue-400 border border-blue-900/40 hover:bg-blue-900/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3" />
            <span>2. Display All</span>
          </button>
          <button 
            onClick={() => triggerOption('3')} 
            className="flex items-center justify-center space-x-1 text-xs py-2 px-3 rounded-lg bg-amber-950/30 text-amber-400 border border-amber-900/40 hover:bg-amber-900/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3" />
            <span>3. Search Roll</span>
          </button>
          <button 
            onClick={() => triggerOption('4')} 
            className="flex items-center justify-center space-x-1 text-xs py-2 px-3 rounded-lg bg-cyan-950/30 text-cyan-400 border border-cyan-900/40 hover:bg-cyan-900/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3" />
            <span>4. Update Details</span>
          </button>
          <button 
            onClick={() => triggerOption('5')} 
            className="flex items-center justify-center space-x-1 text-xs py-2 px-3 rounded-lg bg-rose-950/30 text-rose-400 border border-rose-900/40 hover:bg-rose-900/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3" />
            <span>5. Delete Record</span>
          </button>
          <button 
            onClick={() => triggerOption('6')} 
            className="flex items-center justify-center space-x-1 text-xs py-2 px-3 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700/40 hover:bg-slate-700/50 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3" />
            <span>6. Exit Program</span>
          </button>
        </div>
      )}

      {/* Active Form Inputs Context helper (Very clear UI help) */}
      {currentStep !== 'MENU' && (
        <div className="px-4 py-2 bg-indigo-950/20 border-t border-indigo-950/50 text-xs text-indigo-300 flex items-center justify-between">
          <span>Active context: <strong className="text-white underline">{currentStep}</strong> mode</span>
          <button 
            onClick={() => {
              appendLines([{ text: "\nOperation cancelled. Returning to main menu.", type: 'error' }, { text: "Enter your choice (1-6): ", type: 'output' }]);
              setCurrentStep('MENU');
              setTempStudent({});
            }}
            className="text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
          >
            Cancel [Escape]
          </button>
        </div>
      )}

      {/* Terminal Input field form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
        <span className="text-emerald-500 text-lg font-bold select-none">&gt;_</span>
        <input 
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            currentStep === 'MENU' 
              ? "Type menu option (1-6) or click quick action buttons above..." 
              : `Enter value for ${currentStep.replace('ADD_', '').replace('UPDATE_', '')}...`
          }
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-sm"
          autoFocus
        />
        <button 
          type="submit"
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 p-1.5 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

function sizeofStudentSimulator() {
  // Simulator size: int rollNo(4) + name[50](50) + dept[50](50) + age(4) + marks(8) = 116 bytes (plus alignment packing, usually 120 bytes)
  return 120;
}
