# 📊 COMPREHENSIVE GOOGLE SHEETS STRUCTURE

## 🏗️ **HIERARCHICAL DATA ORGANIZATION**

Based on detailed analysis of the `src/notes` folder, here's the complete structure needed for the Google Sheets:

### 📁 **FOLDER HIERARCHY**
```
notes/
├── data.tsx (Main data aggregator)
├── pyq.tsx (Previous Year Questions)
├── fy/ (First Year)
│   └── comps/ (Computer Engineering)
│       ├── oddSem/
│       └── evenSem/
├── sy/ (Second Year)
│   ├── comps/ (Computer Engineering)
│   ├── it/ (Information Technology)
│   ├── aids/ (AI & Data Science)
│   ├── excp/ (Electronics & Computer Engineering)
│   ├── extc/ (Electronics & Telecommunication)
│   ├── mech/ (Mechanical Engineering)
│   └── rai/ (Robotics & AI)
├── ty/ (Third Year)
│   ├── comps/
│   ├── it/
│   ├── excp/
│   └── mech/
└── ly/ (Last Year - mostly empty placeholders)
    ├── comps/
    ├── it/
    └── excp/
```

## 🗃️ **GOOGLE SHEETS STRUCTURE**

### **SHEET 1: MAIN_DATA**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J | Column K | Column L |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| **Year** | **Branch** | **Semester** | **Subject_Key** | **Subject_Name** | **Subject_Icon** | **Subject_Color** | **Module_Number** | **Notes_Title** | **Notes_URL** | **Topic_Title** | **Topic_Description** |

### **SHEET 2: VIDEOS_DATA**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|----------|----------|----------|----------|----------|----------|----------|----------|
| **Year** | **Branch** | **Semester** | **Subject_Key** | **Module_Number** | **Topic_Title** | **Video_Title** | **Video_URL** |

### **SHEET 3: IMPORTANT_LINKS**
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------| ----------|
`
Year | Branch | Semester | Subject_Key | Link_Title | Link_URL

## 📋 **DETAILED FIELD DESCRIPTIONS**

### **MAIN_DATA Sheet Fields:**

1. **Year** (Text): `fy`, `sy`, `ty`, `ly`
2. **Branch** (Text): `comps`, `it`, `aids`, `excp`, `extc`, `mech`, `rai`
3. **Semester** (Text): `odd`, `even`
4. **Subject_Key** (Text): Short identifier like `am2`, `dsip`, `coa`, `ds`
5. **Subject_Name** (Text): Full name like "Applied Mathematics 2", "Digital Systems and Image Processing"
6. **Subject_Icon** (Text): Icon name from Lucide React (e.g., `Brain`, `Signal`, `Database`)
7. **Subject_Color** (Text): Color theme like `blue`, `red`, `green`
8. **Module_Number** (Number): 1, 2, 3, 4, 5, etc.
9. **Notes_Title** (Text): Title of notes document
10. **Notes_URL** (Text): Link to notes document
11. **Topic_Title** (Text): Topic name like "1.1 Eigen values and vectors introduction"
12. **Topic_Description** (Text): Brief description of the topic

### **VIDEOS_DATA Sheet Fields:**

1. **Year** (Text): Same as above
2. **Branch** (Text): Same as above  
3. **Semester** (Text): Same as above
4. **Subject_Key** (Text): Same as above
5. **Module_Number** (Number): Module reference
6. **Topic_Title** (Text): Must match topic title from MAIN_DATA
7. **Video_Title** (Text): Individual video title
8. **Video_URL** (Text): YouTube embed URL

### **IMPORTANT_LINKS Sheet Fields:**

1. **Year** (Text): `fy`, `sy`, `ty`, `ly`
2. **Branch** (Text): `comps`, `it`, `aids`, `excp`, `extc`, `mech`, `rai`
3. **Semester** (Text): `odd`, `even`
4. **Link_Title** (Text): Title like "Syllabus", "Previous Year Papers", "Reference Books"
5. **Link_URL** (Text): Link to important resources

## 🎯 **SAMPLE DATA STRUCTURE**

### **MAIN_DATA Example:**
```
Year | Branch | Semester | Subject_Key | Subject_Name | Subject_Icon | Subject_Color | Module_Number | Notes_Title | Notes_URL | Topic_Title | Topic_Description
fy   | comps  | even     | am2        | Applied Mathematics 2 | Brain | blue | 1 | Notes | https://drive.google.com/... | 1.1 Eigen values and vectors introduction | How to find eigen values and vectors
fy   | comps  | even     | am2        | Applied Mathematics 2 | Brain | blue | 1 |       |                             | 1.2 Properties of Eigen values and vectors |
fy   | comps  | even     | am2        | Applied Mathematics 2 | Brain | blue | 2 | Notes | https://drive.google.com/... | 2.1 successive differentiation and leibnitz theorem | intro to successive differentiation
```

### **VIDEOS_DATA Example:**
```
Year | Branch | Semester | Subject_Key | Module_Number | Topic_Title | Video_Title | Video_URL
fy   | comps  | even     | am2        | 1 | 1.1 Eigen values and vectors introduction | Intro to Eigen values and vectors Pt-1 | https://www.youtube.com/embed/p4A0XDL6_XQ?si=A_9h4svJHjJVHfxK
fy   | comps  | even     | am2        | 1 | 1.1 Eigen values and vectors introduction | Intro to Eigen values and vectors Pt-2 | https://www.youtube.com/embed/b6Mab8ZIpSU?si=EyWJc_gyGvZxmtMC
```

### **IMPORTANT_LINKS Example:**
```
Year | Branch | Semester | Link_Title | Link_URL
fy   | comps  | even     | Syllabus   | https://drive.google.com/file/d/1Syb-hgjlZZcU29QMzdWf-etd76XjRE88/view?usp=sharing
fy   | comps  | even     | Previous Year Papers | https://drive.google.com/drive/folders/1oPbFkqXMBdEGfcz5FEtJMaxwHT3Ik-cE?usp=sharing
fy   | comps  | even     | Reference Books | https://drive.google.com/folder/d/books_folder
sy   | comps  | odd      | Lab Manual | https://drive.google.com/file/d/lab_manual
sy   | comps  | odd      | University Guidelines | https://university.edu/guidelines
```

## 🔄 **DATA RELATIONSHIPS**

### **Key Linking Strategy:**
1. **Primary Key**: `Year + Branch + Semester + Subject_Key + Module_Number`
2. **Foreign Key for Videos**: `Year + Branch + Semester + Subject_Key + Module_Number + Topic_Title`
3. **Important Links Linking**: `Year + Branch + Semester`

### **Data Normalization:**
- **Subjects** are identified by `Subject_Key` within each `Year + Branch + Semester`
- **Modules** are numbered 1-6 typically per subject
- **Topics** belong to specific modules and can have multiple videos
- **Notes** can be at module level or topic level

## 🎨 **SUBJECT MAPPING**

### **Common Subject Keys by Branch:**

#### **COMPS (Computer Engineering):**
- `am2` - Applied Mathematics 2
- `dsip` - Digital Systems and Image Processing  
- `ai` - Artificial Intelligence
- `cc` - Cloud Computing
- `is` - Information Security
- `coa` - Computer Organization and Architecture
- `ds` - Data Structures
- `oopm` - Object Oriented Programming Methodology

#### **IT (Information Technology):**
- `dam` - Database and Management
- `dbms` - Database Management Systems
- `dcn` - Data Communication Networks
- `digs` - Digital Graphics
- `adb` - Advanced Database
- `aoa` - Analysis of Algorithms

#### **AIDS (AI & Data Science):**
- `cldm` - Cloud and Data Management
- `fds` - Fundamentals of Data Science
- `dgs` - Data Governance and Security

## 🛠️ **IMPLEMENTATION NOTES**

### **Icon Mapping:**
- Use Lucide React icon names as strings
- Common icons: `Brain`, `Signal`, `Database`, `Server`, `Code`, `BookOpen`

### **URL Format:**
- **YouTube Videos**: Use embed format `https://www.youtube.com/embed/VIDEO_ID?si=HASH`
- **Google Drive**: Direct view/sharing links
- **SharePoint**: Direct access links

### **Module Organization:**
- Most subjects have 5-6 modules
- Each module typically has 3-8 topics
- Each topic can have 1-10 videos
- Notes links are usually at module level

This structure allows for complete replication of the existing notes system while maintaining flexibility for future additions and modifications.
