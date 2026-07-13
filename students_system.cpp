#include <iostream>
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
        cout << "\nEnter Roll Number: ";
        while (!(cin >> rollNo) || rollNo <= 0) {
            cout << "Invalid input! Please enter a positive integer for Roll Number: ";
            cin.clear();
            cin.ignore(10000, '\n');
        }
        cin.ignore(10000, '\n'); // clear buffer

        cout << "Enter Student Name: ";
        cin.getline(name, 50);
        // Basic validation: ensure name is not empty
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
            cin.ignore(10000, '\n');
        }

        cout << "Enter Marks: ";
        while (!(cin >> marks) || marks < 0.0 || marks > 100.0) {
            cout << "Invalid input! Please enter marks between 0.0 and 100.0: ";
            cin.clear();
            cin.ignore(10000, '\n');
        }
        cin.ignore(10000, '\n'); // clear buffer
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

        cout << "\nUpdating details for Student with Roll Number " << rollNo << endl;
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
            cin.ignore(10000, '\n');
        }
        cin.ignore(10000, '\n'); // clear buffer

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
            cin.ignore(10000, '\n');
        }
        cin.ignore(10000, '\n'); // clear buffer
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
        cout << "\n=============================================" << endl;
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
            cin.ignore(10000, '\n');
        }
        cin.ignore(10000, '\n'); // clear buffer

        switch (choice) {
            case 1:
                addStudent();
                break;
            case 2:
                displayAll();
                break;
            case 3:
                cout << "\nEnter Roll Number to search: ";
                while (!(cin >> roll) || roll <= 0) {
                    cout << "Invalid Roll Number! Enter a positive integer: ";
                    cin.clear();
                    cin.ignore(10000, '\n');
                }
                searchStudent(roll);
                break;
            case 4:
                cout << "\nEnter Roll Number to update: ";
                while (!(cin >> roll) || roll <= 0) {
                    cout << "Invalid Roll Number! Enter a positive integer: ";
                    cin.clear();
                    cin.ignore(10000, '\n');
                }
                updateStudent(roll);
                break;
            case 5:
                cout << "\nEnter Roll Number to delete: ";
                while (!(cin >> roll) || roll <= 0) {
                    cout << "Invalid Roll Number! Enter a positive integer: ";
                    cin.clear();
                    cin.ignore(10000, '\n');
                }
                deleteStudent(roll);
                break;
            case 6:
                cout << "\nThank you for using Student Management System! Goodbye." << endl;
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
        cout << "\nError: Could not open/create database file 'students.dat'!" << endl;
        return;
    }

    Student s;
    cout << "\n--- Enter Student Details ---";
    s.getData();

    // Check for duplicate roll number before writing
    if (checkDuplicateRoll(s.getRollNo())) {
        cout << "\nError: Roll Number " << s.getRollNo() << " already exists in the database!" << endl;
        outFile.close();
        return;
    }

    outFile.write(reinterpret_cast<char*>(&s), sizeof(Student));
    outFile.close();

    cout << "\nSuccess: Student record added successfully!" << endl;
}

// Function to display all student records from binary file
void displayAll() {
    ifstream inFile("students.dat", ios::binary);
    if (!inFile) {
        cout << "\nError: No records found. Database file 'students.dat' does not exist." << endl;
        return;
    }

    Student s;
    bool found = false;

    // Read the first record to check if file is empty
    if (inFile.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        found = true;
        cout << "\n========================================================================" << endl;
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
        cout << "\nDatabase file is empty. Please add students first." << endl;
    }
}

// Function to search for a student record by roll number
void searchStudent(int roll) {
    ifstream inFile("students.dat", ios::binary);
    if (!inFile) {
        cout << "\nError: Database file not found." << endl;
        return;
    }

    Student s;
    bool found = false;

    while (inFile.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        if (s.getRollNo() == roll) {
            cout << "\n--- Student Record Found ---" << endl;
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
        cout << "\nError: Student with Roll Number " << roll << " not found!" << endl;
    }
}

// Function to update student details in binary file (in-place modification)
void updateStudent(int roll) {
    fstream file("students.dat", ios::binary | ios::in | ios::out);
    if (!file) {
        cout << "\nError: Database file not found." << endl;
        return;
    }

    Student s;
    bool found = false;

    while (file.read(reinterpret_cast<char*>(&s), sizeof(Student))) {
        if (s.getRollNo() == roll) {
            cout << "\n--- Existing Details ---" << endl;
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
            
            cout << "\nSuccess: Student record updated successfully!" << endl;
            found = true;
            break;
        }
    }

    file.close();

    if (!found) {
        cout << "\nError: Student with Roll Number " << roll << " not found!" << endl;
    }
}

// Function to delete student record from binary file (using temp file pattern)
void deleteStudent(int roll) {
    ifstream inFile("students.dat", ios::binary);
    if (!inFile) {
        cout << "\nError: Database file not found." << endl;
        return;
    }

    ofstream outFile("temp.dat", ios::binary);
    if (!outFile) {
        cout << "\nError: Could not create temporary file." << endl;
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
        cout << "\nSuccess: Student with Roll Number " << roll << " deleted successfully!" << endl;
    } else {
        remove("temp.dat"); // clean up temporary file
        cout << "\nError: Student with Roll Number " << roll << " not found!" << endl;
    }
}
