import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckSquare } from 'lucide-react';

export default function CodeViewer() {
  const [copied, setCopied] = useState(false);

  const cppCode = `#include <iostream>
#include <fstream>
#include <cstdio>
#include <cstring>
#include <iomanip>

using namespace std;

// Student Class Definition
class Student {
private:
    int rollNo;
    char name[50];
    char department[50];
    int age;
    double marks;

public:
    // Default constructor
    Student() {
        rollNo = 0;
        age = 0;
        marks = 0.0;
        strcpy(name, "");
        strcpy(department, "");
    }

    // Function to input student details with validation
    void getData() {
        cout << "\\nEnter Roll Number: ";
        while (!(cin >> rollNo) || rollNo <= 0) {
            cout << "Invalid input! Please enter a positive integer: ";
            cin.clear();
            cin.ignore(10000, '\\n');
        }
        cin.ignore(10000, '\\n'); // clear buffer

        cout << "Enter Student Name: ";
        cin.getline(name, 50);
        while (strlen(name) == 0) {
            cout << "Name cannot be empty! Enter Name: ";
            cin.getline(name, 50);
        }

        cout << "Enter Department: ";
        cin.getline(department, 50);
        while (strlen(department) == 0) {
            cout << "Department cannot be empty! Enter Department: ";
            cin.getline(department, 50);
        }

        cout << "Enter Age: ";
        while (!(cin >> age) || age <= 0 || age > 120) {
            cout << "Invalid input! Please enter a valid age (1-120): ";
            cin.clear();
            cin.ignore(10000, '\\n');
        }

        cout << "Enter Marks: ";
        while (!(cin >> marks) || marks < 0.0 || marks > 100.0) {
            cout << "Invalid input! Please enter marks between 0.0 and 100.0: ";
            cin.clear();
            cin.ignore(10000, '\\n');
        }
        cin.ignore(10000, '\\n'); // clear buffer
    }

    // Function to display student details in tabular format
    void showData() const {
        cout << left << setw(12) << rollNo 
             << setw(20) << name 
             << setw(20) << department 
             << setw(10) << age 
             << setw(10) << fixed << setprecision(2) << marks << endl;
    }

    // Accessor for Roll Number
    int getRollNo() const {
        return rollNo;
    }

    // Function to modify specific details
    void modifyData() {
        char tempName[50], tempDept[50];
        int tempAge;
        double tempMarks;

        cout << "\\nUpdating details for Student with Roll Number " << rollNo << endl;
        cout << "Enter New Name (or press enter to keep '" << name << "'): ";
        cin.getline(tempName, 50);
        if (strlen(tempName) > 0) {
            strcpy(name, tempName);
        }

        cout << "Enter New Department (or press enter to keep '" << department << "'): ";
        cin.getline(tempDept, 50);
        if (strlen(tempDept) > 0) {
            strcpy(department, tempDept);
        }

        cout << "Enter New Age (or enter 0 to keep '" << age << "'): ";
        while (true) {
            if (cin >> tempAge) {
                if (tempAge == 0) {
                    break; // keep existing
                } else if (tempAge > 0 && tempAge <= 120) {
                    age = tempAge;
                    break;
                }
            }
            cout << "Invalid age! Enter a valid age (1-120) or 0 to keep current: ";
            cin.clear();
            cin.ignore(10000, '\\n');
        }
        cin.ignore(10000, '\\n'); // clear buffer

        cout << "Enter New Marks (or enter -1 to keep '" << marks << "'): ";
        while (true) {
            if (cin >> tempMarks) {
                if (tempMarks == -1) {
                    break; // keep existing
                } else if (tempMarks >= 0.0 && tempMarks <= 100.0) {
                    marks = tempMarks;
                    break;
                }
            }
            cout << "Invalid marks! Enter marks (0.0 to 100.0) or -1 to keep current: ";
            cin.clear();
            cin.ignore(10000, '\\n');
        }
        cin.ignore(10000, '\\n'); // clear buffer
    }
};

// Function prototypes for operations
void addStudent();
void displayAll();
void searchStudent(int roll);
void updateStudent(int roll);
void deleteStudent(int roll);
bool checkDuplicateRoll(int roll);

// Main function containing the menu-driven system
int main() {
    int choice;
    int roll;

    do {
        cout << "\\n=============================================" << endl;
        cout << "       STUDENT MANAGEMENT SYSTEM (C++)" << endl;
        cout << "=============================================" << endl;
        cout << "1. Add Student" << endl;
        cout << "2. Display All Students" << endl;
        cout << "3. Search Student by Roll Number" << endl;
        cout << "4. Update Student Details" << endl;
        cout << "5. Delete Student Record" << endl;
        cout << "6. Exit" << endl;
        cout << "=============================================" << endl;
        cout << "Enter your choice (1-6): ";
        
        while (!(cin >> choice) || choice < 1 || choice > 6) {
            cout << "Invalid choice! Please enter a number between 1 and 6: ";
            cin.clear();
            cin.ignore(10000, '\\n');
        }
        cin.ignore(10000, '\\n'); // clear buffer

        switch (choice) {
            case 1:
                addStudent();
                break;
            case 2:
                displayAll();
                break;
            case 3:
                cout << "\\nEnter Roll Number to search: ";
                while (!(cin >> roll) || roll <= 0) {
                    cout << "Invalid Roll Number! Enter a positive integer: ";
                    cin.clear();
                    cin.ignore(10000, '\\n');
                }
                searchStudent(roll);
                break;
            case 4:
                cout << "\\nEnter Roll Number to update: ";
                while (!(cin >> roll) || roll <= 0) {
                    cout << "Invalid Roll Number! Enter a positive integer: ";
                    cin.clear();
                    cin.ignore(10000, '\\n');
                }
                updateStudent(roll);
                break;
            case 5:
                cout << "\\nEnter Roll Number to delete: ";
                while (!(cin >> roll) || roll <= 0) {
                    cout << "Invalid Roll Number! Enter a positive integer: ";
                    cin.clear();
                    cin.ignore(10000, '\\n');
                }
                deleteStudent(roll);
                break;
            case 6:
                cout << "\\nThank you for using Student Management System! Goodbye." << endl;
                break;
        }
    } while (choice != 6);

    return 0;
}

// Function to check if roll number already exists in students.dat
bool checkDuplicateRoll(int roll) {
    ifstream inFile("students.dat", ios::binary);
    if (!inFile) {
        return false; // File doesn't exist yet, so no duplicate possible
    }
    Student s;
    while (inFile.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        if (s.getRollNo() == roll) {
            inFile.close();
            return true;
        }
    }
    inFile.close();
    return false;
}

// Function to add a student to the binary file
void addStudent() {
    ofstream outFile("students.dat", ios::binary | ios::app);
    if (!outFile) {
        cout << "\\nError: Could not open/create database file 'students.dat'!" << endl;
        return;
    }

    Student s;
    cout << "\\n--- Enter Student Details ---";
    s.getData();

    // Check for duplicate roll number before writing
    if (checkDuplicateRoll(s.getRollNo())) {
        cout << "\\nError: Roll Number " << s.getRollNo() << " already exists in the database!" << endl;
        outFile.close();
        return;
    }

    outFile.write(reinterpret_cast<char*>(&s), sizeof(Student));
    outFile.close();

    cout << "\\nSuccess: Student record added successfully!" << endl;
}

// Function to display all student records from binary file
void displayAll() {
    ifstream inFile("students.dat", ios::binary);
    if (!inFile) {
        cout << "\\nError: No records found. Database file 'students.dat' does not exist." << endl;
        return;
    }

    Student s;
    bool found = false;

    // Read first record to verify file contains entries
    if (inFile.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        found = true;
        cout << "\\n========================================================================" << endl;
        cout << left << setw(12) << "Roll No" 
             << setw(20) << "Name" 
             << setw(20) << "Department" 
             << setw(10) << "Age" 
             << setw(10) << "Marks" << endl;
        cout << "========================================================================" << endl;
        
        s.showData();

        while (inFile.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
            s.showData();
        }
        cout << "========================================================================" << endl;
    }

    inFile.close();

    if (!found) {
        cout << "\\nDatabase file is empty. Please add students first." << endl;
    }
}

// Function to search for student record by roll number
void searchStudent(int roll) {
    ifstream inFile("students.dat", ios::binary);
    if (!inFile) {
        cout << "\\nError: Database file not found." << endl;
        return;
    }

    Student s;
    bool found = false;

    while (inFile.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        if (s.getRollNo() == roll) {
            cout << "\\n--- Student Record Found ---" << endl;
            cout << "------------------------------------------------------------------------" << endl;
            cout << left << setw(12) << "Roll No" 
                 << setw(20) << "Name" 
                 << setw(20) << "Department" 
                 << setw(10) << "Age" 
                 << setw(10) << "Marks" << endl;
            cout << "------------------------------------------------------------------------" << endl;
            s.showData();
            cout << "------------------------------------------------------------------------" << endl;
            found = true;
            break;
        }
    }

    inFile.close();

    if (!found) {
        cout << "\\nError: Student with Roll Number " << roll << " not found!" << endl;
    }
}

// Function to update student details in binary file (in-place modification)
void updateStudent(int roll) {
    fstream file("students.dat", ios::binary | ios::in | ios::out);
    if (!file) {
        cout << "\\nError: Database file not found." << endl;
        return;
    }

    Student s;
    bool found = false;

    while (file.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        if (s.getRollNo() == roll) {
            cout << "\\n--- Existing Details ---" << endl;
            cout << left << setw(12) << "Roll No" 
                 << setw(20) << "Name" 
                 << setw(20) << "Department" 
                 << setw(10) << "Age" 
                 << setw(10) << "Marks" << endl;
            s.showData();

            s.modifyData();

            // Seek backward by the size of one student record
            int pos = -1 * static_cast<int>(sizeof(Student));
            file.seekp(pos, ios::cur);

            // Write the updated object
            file.write(reinterpret_cast<char*>(&s), sizeof(Student));
            
            cout << "\\nSuccess: Student record updated successfully!" << endl;
            found = true;
            break;
        }
    }

    file.close();

    if (!found) {
        cout << "\\nError: Student with Roll Number " << roll << " not found!" << endl;
    }
}

// Function to delete student record from binary file (temp file pattern)
void deleteStudent(int roll) {
    ifstream inFile("students.dat", ios::binary);
    if (!inFile) {
        cout << "\\nError: Database file not found." << endl;
        return;
    }

    ofstream outFile("temp.dat", ios::binary);
    if (!outFile) {
        cout << "\\nError: Could not create temporary file." << endl;
        inFile.close();
        return;
    }

    Student s;
    bool found = false;

    while (inFile.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        if (s.getRollNo() == roll) {
            found = true; // Skip writing this record to temp file
        } else {
            outFile.write(reinterpret_cast<char*>(&s), sizeof(Student));
        }
    }

    inFile.close();
    outFile.close();

    // Delete the original file and rename the temp file
    if (found) {
        remove("students.dat");
        rename("temp.dat", "students.dat");
        cout << "\\nSuccess: Student with Roll Number " << roll << " deleted successfully!" << endl;
    } else {
        remove("temp.dat"); // clean up temporary file
        cout << "\\nError: Student with Roll Number " << roll << " not found!" << endl;
    }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([cppCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "students_system.cpp";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl h-full flex flex-col overflow-hidden" id="code-viewer-container">
      {/* File Header Tab */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <FileCode className="w-5 h-5 text-indigo-600" />
          <div>
            <span className="text-slate-800 text-sm font-bold block">students_system.cpp</span>
            <span className="text-[11px] text-slate-500 block font-medium">Single-file compilable C++ college project source code</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-end">
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer font-bold shadow-2xs"
          >
            {copied ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100/60 transition-all cursor-pointer font-bold shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .cpp</span>
          </button>
        </div>
      </div>
 
      {/* Code Display */}
      <div className="flex-1 overflow-auto bg-slate-950 p-5 font-mono text-xs text-slate-300 select-text leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        <pre className="whitespace-pre">
          {cppCode.split('\n').map((line, idx) => {
            // Very basic decorative syntax highlights for standard readability
            let lineElem = <span>{line}</span>;
            if (line.startsWith('#include') || line.startsWith('using namespace')) {
              lineElem = <span className="text-pink-400">{line}</span>;
            } else if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().endsWith('*/')) {
              lineElem = <span className="text-slate-500 italic">{line}</span>;
            } else if (line.includes('class ') || line.includes('private:') || line.includes('public:')) {
              lineElem = <span className="text-amber-400 font-semibold">{line}</span>;
            } else if (line.includes('int ') || line.includes('double ') || line.includes('void ') || line.includes('char ') || line.includes('bool ')) {
              lineElem = <span className="text-sky-400">{line}</span>;
            }
            return (
              <div key={idx} className="table-row">
                <span className="table-cell text-slate-600 text-right pr-4 select-none w-8 text-[10px]">{idx + 1}</span>
                <span className="table-cell">{lineElem}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
