export interface SimulatedStudent {
  rollNo: number;
  name: string;
  department: string;
  age: number;
  marks: number;
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'header';
}

export interface VivaQuestion {
  question: string;
  answer: string;
  category: 'File Handling' | 'OOP' | 'C++ Basics' | 'Memory & Pointers';
}

export interface FunctionDetail {
  name: string;
  signature: string;
  description: string;
  returnType: string;
}
