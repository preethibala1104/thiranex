import React, { useState } from 'react';
import { BookOpen, Key, Clock, HelpCircle, Code, Server, ArrowUpRight } from 'lucide-react';
import { VivaQuestion, FunctionDetail } from '../types';

export default function DocViewer() {
  const [activeTab, setActiveTab] = useState<'viva' | 'file_handling' | 'functions' | 'complexity'>('viva');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  const vivaQuestions: VivaQuestion[] = [
    {
      question: "Why do we use fixed-size char arrays (e.g., char name[50]) instead of std::string inside a class meant for binary file storage?",
      answer: "A std::string object does not store characters inline. Instead, it holds a pointer to dynamically allocated memory on the heap where the actual string characters are kept. When we perform a raw memory dump using file.write(reinterpret_cast<char*>(&student), sizeof(student)), we end up writing the pointer address to the disk instead of the text content. When read back in another execution, that pointer is invalid, causing a runtime segmentation fault. Using raw fixed-size char arrays guarantees that all string data resides directly within the contiguous bytes of the Student object, making it 100% serializable.",
      category: "Memory & Pointers"
    },
    {
      question: "What is the purpose of reinterpret_cast<char*> inside the stream read/write methods?",
      answer: "The read() and write() member functions of std::fstream are designed to read/write arrays of raw bytes. Hence, they strictly accept a parameter of type char* (or const char*). To pass a custom user-defined object (like our Student class) to these functions, we must cast its memory address (&student) to a byte pointer. reinterpret_cast tells the compiler to treat the object's raw contiguous memory buffer as a sequence of character bytes without doing any type-conversion checks.",
      category: "File Handling"
    },
    {
      question: "How does the 'Update Record' function modify a student in-place without corrupting other records?",
      answer: "It uses stream pointer seek functions. When we search for a matching roll number, we read records sequentially using file.read(). After finding a match, the file read pointer has already advanced past the matched record. To overwrite this exact block, we step back the write pointer using file.seekp(-1 * static_cast<int>(sizeof(Student)), ios::cur). This positions the write head at the starting byte of the current record. Then, we write the updated Student object, effectively overwriting it in-place.",
      category: "File Handling"
    },
    {
      question: "What is the significance of the 'ios::binary' flag?",
      answer: "By default, files are opened in text mode. In text mode, operating systems perform implicit conversions on newline characters (e.g., on Windows, translating \\n to \\r\\n on write, and back on read). If a binary integer, floating-point number, or offset inside our Student object happens to contain a byte value of 10 (the ASCII value of \\n), the text stream will implicitly modify it, corrupting our binary record structure. The ios::binary flag disables these conversions, ensuring bytes are read and written strictly as-is.",
      category: "File Handling"
    },
    {
      question: "Explain the difference between seekg() and seekp().",
      answer: "In C++ fstream, there are two distinct stream pointer heads maintained: seekg() ('Seek Get') is used to reposition the read cursor head in an input stream (ifstream/fstream), while seekp() ('Seek Put') is used to reposition the write cursor head in an output stream (ofstream/fstream). Both accept an offset and a seek direction (ios::beg, ios::cur, ios::end).",
      category: "File Handling"
    },
    {
      question: "What is the design pattern used to delete a record in a binary file?",
      answer: "Since we cannot 'shrink' a file in-place, the standard pattern is to use a temporary helper file. We open the original file (students.dat) in read mode and a new temporary file (temp.dat) in write mode. We read records sequentially from students.dat. If the roll number matches the one to delete, we simply skip writing it. All other records are copied to temp.dat. Finally, we close both streams, call remove(\"students.dat\") to delete the old file, and rename(\"temp.dat\", \"students.dat\") to promote the temporary database.",
      category: "OOP"
    },
    {
      question: "Why do we check if (!inFile) right after opening a stream?",
      answer: "This is a stream state check. C++ streams overload the logical negation operator (!). If a file open operation fails (due to file not existing, read-only permissions, or hardware lockouts), the stream state enters an fail/error mode. Checking !inFile prevents reading from or writing to an invalid stream, avoiding undefined behavior and runtime crashes.",
      category: "C++ Basics"
    }
  ];

  const functionsList: FunctionDetail[] = [
    {
      name: "addStudent",
      signature: "void addStudent()",
      description: "Appends a new student record to students.dat. It checks for duplicate roll numbers by reading the file before writing the new record.",
      returnType: "void"
    },
    {
      name: "displayAll",
      signature: "void displayAll()",
      description: "Opens students.dat in binary input mode, loops sequentially through the file reading sizeof(Student) blocks, and prints them in an elegant formatted tabular matrix.",
      returnType: "void"
    },
    {
      name: "searchStudent",
      signature: "void searchStudent(int roll)",
      description: "Performs an O(N) sequential scan through students.dat. Prints details of the student matching the search roll number. Alerts if not found.",
      returnType: "void"
    },
    {
      name: "updateStudent",
      signature: "void updateStudent(int roll)",
      description: "Opens students.dat in read-write binary mode (ios::in | ios::out), searches for the roll number, prompts for modified fields, seeks back by sizeof(Student) bytes, and writes the updated object in-place.",
      returnType: "void"
    },
    {
      name: "deleteStudent",
      signature: "void deleteStudent(int roll)",
      description: "Filters records by roll number. Writes all non-matching records from students.dat into a temporary file temp.dat. Replaces the original database file by calling remove() and rename().",
      returnType: "void"
    },
    {
      name: "checkDuplicateRoll",
      signature: "bool checkDuplicateRoll(int roll)",
      description: "Helper function that opens students.dat and returns true if the specified roll number is already present in the file. Helps maintain primary-key unique integrity.",
      returnType: "bool"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl h-full flex flex-col overflow-hidden" id="doc-viewer-container">
      {/* Tab bar header */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 px-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center space-x-1.5 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'viva'
              ? 'border-indigo-600 text-indigo-600 bg-white/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          <span>Viva Q&A</span>
        </button>
        <button
          onClick={() => setActiveTab('file_handling')}
          className={`flex items-center space-x-1.5 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'file_handling'
              ? 'border-indigo-600 text-indigo-600 bg-white/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>File Handling Mechanics</span>
        </button>
        <button
          onClick={() => setActiveTab('functions')}
          className={`flex items-center space-x-1.5 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'functions'
              ? 'border-indigo-600 text-indigo-600 bg-white/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-indigo-500" />
          <span>Function Catalog</span>
        </button>
        <button
          onClick={() => setActiveTab('complexity')}
          className={`flex items-center space-x-1.5 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'complexity'
              ? 'border-indigo-600 text-indigo-600 bg-white/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Complexity & Specs</span>
        </button>
      </div>

      {/* Tab content area */}
      <div className="flex-1 p-5 overflow-y-auto select-text scrollbar-thin scrollbar-thumb-slate-200">
        {activeTab === 'viva' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <h3 className="text-emerald-800 font-bold text-sm flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Mini Project Viva Preparation Guide</span>
              </h3>
              <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                These are highly expected questions frequently asked by external examiners during practical evaluations of C++ binary file projects. Click any question to reveal the rigorous academic answer.
              </p>
            </div>

            <div className="space-y-2.5">
              {vivaQuestions.map((item, idx) => (
                <div 
                  key={idx} 
                  className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:border-slate-300 transition-all"
                >
                  <button
                    onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
                    className="w-full flex items-start justify-between p-4 text-left cursor-pointer transition-all bg-white hover:bg-slate-50"
                  >
                    <div className="flex space-x-2">
                      <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded h-fit font-bold whitespace-nowrap mt-0.5">
                        {item.category}
                      </span>
                      <span className="text-slate-800 font-semibold text-sm leading-snug">{item.question}</span>
                    </div>
                    <span className="text-slate-400 font-bold text-lg leading-none ml-2">{expandedQuestion === idx ? '−' : '+'}</span>
                  </button>

                  {expandedQuestion === idx && (
                    <div className="p-4 bg-indigo-50/30 border-t border-slate-200/60 text-slate-700 text-xs leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'file_handling' && (
          <div className="space-y-5">
            <h3 className="text-slate-800 font-bold text-base flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>How Binary File Handling Works</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">1. Physical Serialization</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Unlike text mode where everything is converted to human-readable strings, binary serialization copies the exact byte layout representing variables in CPU memory directly onto the persistent storage sector. This is highly efficient since no string parsing is required.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">2. Stream Pointer Movement</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  A binary database is treated as an array of structured blocks. By computing <code>sizeof(Student)</code>, we can locate any individual record by shifting the read head <code>seekg()</code> or write head <code>seekp()</code> directly to any record's byte index offset.
                </p>
              </div>
            </div>

            {/* Structure layout illustration */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
              <div className="text-emerald-400 font-semibold mb-3 flex items-center justify-between">
                <span>Memory Allocation Layout of Student Class:</span>
                <span className="text-[10px] text-slate-400">Total size: ~120 Bytes</span>
              </div>
              <div className="flex border border-slate-700 rounded overflow-hidden text-center text-[10px] h-10 items-center">
                <div className="bg-slate-800 w-[10%] border-r border-slate-700 h-full flex flex-col justify-center text-sky-400">
                  <span>rollNo</span>
                  <span className="text-[8px] text-slate-400">4 Bytes</span>
                </div>
                <div className="bg-slate-900 w-[35%] border-r border-slate-700 h-full flex flex-col justify-center text-emerald-400">
                  <span>name[50]</span>
                  <span className="text-[8px] text-slate-400">50 Bytes</span>
                </div>
                <div className="bg-slate-800 w-[35%] border-r border-slate-700 h-full flex flex-col justify-center text-purple-400">
                  <span>department[50]</span>
                  <span className="text-[8px] text-slate-400">50 Bytes</span>
                </div>
                <div className="bg-slate-900 w-[10%] border-r border-slate-700 h-full flex flex-col justify-center text-amber-400">
                  <span>age</span>
                  <span className="text-[8px] text-slate-400">4 Bytes</span>
                </div>
                <div className="bg-slate-800 w-[10%] h-full flex flex-col justify-center text-pink-400">
                  <span>marks</span>
                  <span className="text-[8px] text-slate-400">8 Bytes</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-400 font-sans leading-relaxed">
                Because there are no pointer fields in the class, writing <code>reinterpret_cast&lt;char*&gt;(&amp;s)</code> writes exactly 120 contiguous bytes of database values directly to <code>students.dat</code>.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'functions' && (
          <div className="space-y-4">
            <h3 className="text-slate-800 font-bold text-base flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Program Function Catalog</span>
            </h3>

            <div className="space-y-3">
              {functionsList.map((f, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-600 font-mono text-xs font-bold">{f.signature}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded font-mono font-bold">
                      {f.returnType}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'complexity' && (
          <div className="space-y-5">
            <h3 className="text-slate-800 font-bold text-base flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Time and Space Complexity Analysis</span>
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/85 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Operation</th>
                    <th className="p-3">Time Complexity</th>
                    <th className="p-3">Space Complexity</th>
                    <th className="p-3">Disk operations (I/O)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 bg-white">
                  <tr>
                    <td className="p-3 font-semibold text-slate-850">Add Student</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(N)</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(1)</td>
                    <td className="p-3 text-slate-500">N reads (duplicate check) + 1 write</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850">Display All</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(N)</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(1)</td>
                    <td className="p-3 text-slate-500">N sequential reads</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850">Search Student</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(N)</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(1)</td>
                    <td className="p-3 text-slate-500">Average N/2 sequential reads</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850">Update Student</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(N)</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(1)</td>
                    <td className="p-3 text-slate-500">Sequential scan + 1 Seek + 1 write</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850">Delete Student</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(N)</td>
                    <td className="p-3 font-mono text-indigo-600 font-bold">O(N)</td>
                    <td className="p-3 text-slate-500">N reads + N writes to temporary file</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <h4 className="text-slate-800 font-bold">Key Constraints:</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                <li>Database uses linear disk structure (flat binary).</li>
                <li>No indexing in-memory mechanism is used to keep the C++ code simple and straightforward for examiners.</li>
                <li>Perfect for high school or early college-level grading rubrics.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
