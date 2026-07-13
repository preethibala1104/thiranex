# Console-Based Student Management System in C++

A simple, robust, menu-driven command-line Student Management System developed in C++ for academic and mini-project purposes. It uses Object-Oriented Programming (OOP) concepts and Binary File Handling to permanently save, view, search, modify, and delete student records.

## 🎯 Objective
To demonstrate core C++ fundamentals, Object-Oriented Design (Classes, Encapsulation, State Management), and Binary File I/O operations (reading, writing, modifying stream positions, temporary-file deletion patterns) using only C++ Standard Libraries without modern container (STL) dependency.

## 🚀 Features
- **Add Student Record**: Validates inputs (Roll Number, Age, Marks) and appends a binary record into `students.dat`. Checks for duplicate Roll Numbers.
- **Display All Students**: Reads from `students.dat` sequentially and prints a clean, formatted table of active records.
- **Search Student by Roll No**: Performs an $O(N)$ linear search to find and render matching student detail records.
- **Update Student Record (In-Place)**: Uses random access seek pointers (`seekp`) to modify individual structures within `students.dat` directly without rewriting the entire file.
- **Delete Student Record**: Uses a temporary file stream pattern to strip a specific record out of the database and replaces the original.
- **Robust Input Validation**: Recovers gracefully from bad string/character entries using `cin.clear()` and stream flushing.

## 🛠️ Technologies Used
- **Language**: C++ (C++11 or higher recommended)
- **Compiler**: GNU GCC / MinGW (Standard in Dev C++ and Code::Blocks)
- **Libraries used (No STL containers like `std::vector`):**
  - `<iostream>` - Standard input/output streams
  - `<fstream>` - Binary file streams (`ifstream`, `ofstream`, `fstream`)
  - `<cstdio>` - File system utilities (`remove`, `rename`)
  - `<cstring>` - Custom string copy and length manipulations (`strcpy`, `strlen`)
  - `<iomanip>` - Stream manipulators for modular spacing (`setw`, `setprecision`, `left`)

## 💻 How to Compile

### Using Dev C++ (or standard IDE):
1. Open Dev C++.
2. Click **File -> New -> Source File** (or press `Ctrl+N`).
3. Copy and paste the contents of `students_system.cpp` into the editor.
4. Save the file as `students_system.cpp` (File -> Save As).
5. Click **Execute -> Compile & Run** (or press `F11`).

### Using standard Terminal / Command Prompt (g++ compiler):
Make sure your compiler environment variable path is set. Run:
```bash
g++ -o StudentSystem students_system.cpp
```

## 🏃 How to Run
After successful compilation, run the binary in your terminal:

**On Windows:**
```cmd
StudentSystem.exe
```

**On macOS / Linux:**
```bash
./StudentSystem
```

The database records will be saved inside the file `students.dat` in the same directory.
