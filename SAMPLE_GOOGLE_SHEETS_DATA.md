# Sample Data for New Google Sheets Format

Copy this data into your Google Sheets with the exact sheet names: **MAIN_DATA**, **VIDEOS_DATA**, **PYQ_DATA**

## MAIN_DATA Sheet

Copy this data into a sheet named **MAIN_DATA**:

| Year | Branch | Semester | Subject_Key | Subject_Name | Subject_Icon | Subject_Color | Module_Number | Notes_Title | Notes_URL | Topic_Title | Topic_Description |
|------|--------|----------|-------------|--------------|--------------|---------------|---------------|-------------|-----------|-------------|-------------------|
| fy | comps | even | am2 | Applied Mathematics 2 | Brain | blue | 1 | Module 1 Notes | https://drive.google.com/file/d/example1 | 1.1 Eigen values and vectors introduction | How to find eigen values and vectors |
| fy | comps | even | am2 | Applied Mathematics 2 | Brain | blue | 1 |  |  | 1.2 Properties of Eigen values and vectors | Properties and applications |
| fy | comps | even | am2 | Applied Mathematics 2 | Brain | blue | 2 | Module 2 Notes | https://drive.google.com/file/d/example2 | 2.1 successive differentiation and leibnitz theorem | intro to successive differentiation |
| fy | comps | even | am2 | Applied Mathematics 2 | Brain | blue | 2 |  |  | 2.2 Taylor and Maclaurin series | Series expansion methods |
| fy | comps | even | ds | Data Structures | Database | green | 1 | DS Module 1 | https://drive.google.com/file/d/example3 | 1.1 Introduction to Data Structures | Basic concepts and types |
| fy | comps | even | ds | Data Structures | Database | green | 1 |  |  | 1.2 Arrays and Linked Lists | Linear data structures |
| sy | comps | even | coa | Computer Organization | Cpu | red | 1 | COA Notes | https://drive.google.com/file/d/example4 | 1.1 Introduction to Computer Organization | Computer system overview |
| sy | comps | even | coa | Computer Organization | Cpu | red | 2 | COA Module 2 | https://drive.google.com/file/d/example5 | 2.1 Memory Organization | Memory hierarchy and types |

## VIDEOS_DATA Sheet

Copy this data into a sheet named **VIDEOS_DATA**:

| Year | Branch | Semester | Subject_Key | Module_Number | Topic_Title | Video_Title | Video_URL |
|------|--------|----------|-------------|---------------|-------------|-------------|-----------|
| fy | comps | even | am2 | 1 | 1.1 Eigen values and vectors introduction | Intro to Eigen values and vectors Pt-1 | https://www.youtube.com/embed/p4A0XDL6_XQ?si=A_9h4svJHjJVHfxK |
| fy | comps | even | am2 | 1 | 1.1 Eigen values and vectors introduction | Intro to Eigen values and vectors Pt-2 | https://www.youtube.com/embed/b6Mab8ZIpSU?si=EyWJc_gyGvZxmtMC |
| fy | comps | even | am2 | 1 | 1.2 Properties of Eigen values and vectors | Properties of Eigen values | https://www.youtube.com/embed/example1 |
| fy | comps | even | am2 | 2 | 2.1 successive differentiation and leibnitz theorem | Successive Differentiation | https://www.youtube.com/embed/example2 |
| fy | comps | even | ds | 1 | 1.1 Introduction to Data Structures | DS Introduction | https://www.youtube.com/embed/example3 |
| fy | comps | even | ds | 1 | 1.2 Arrays and Linked Lists | Arrays Tutorial | https://www.youtube.com/embed/example4 |
| sy | comps | even | coa | 1 | 1.1 Introduction to Computer Organization | COA Basics | https://www.youtube.com/embed/example5 |
| sy | comps | even | coa | 2 | 2.1 Memory Organization | Memory Hierarchy | https://www.youtube.com/embed/example6 |

## PYQ_DATA Sheet

Copy this data into a sheet named **PYQ_DATA**:

| Year | PYQ_Title | PYQ_URL |
|------|-----------|---------|
| fy | FY B.Tech Syllabus | https://drive.google.com/file/d/example_syllabus |
| fy | Previous Year Questions | https://drive.google.com/file/d/example_pyq |
| sy | SY B.Tech Syllabus | https://drive.google.com/file/d/example_sy_syllabus |
| sy | SY Previous Year Questions | https://drive.google.com/file/d/example_sy_pyq |

## Instructions:

1. **Create Google Sheet** with exactly these sheet names: `MAIN_DATA`, `VIDEOS_DATA`, `PYQ_DATA`

2. **Copy Headers** - Make sure the first row contains exactly the column headers shown above

3. **Copy Sample Data** - Add the sample data rows to test the integration

4. **Make Sheet Public** - Set sharing to "Anyone with the link can view"

5. **Test Integration** - Run the test script:
   ```bash
   set NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
   set NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here
   node test-new-sheets-format.js
   ```

6. **Verify Application** - Start your Next.js app and navigate to `/fy/comps/even` to see if subjects load

## Notes:

- Replace all example URLs with your actual Google Drive or YouTube links
- The `Subject_Icon` should match Lucide React icon names (Brain, Database, Cpu, etc.)
- `Subject_Color` can be: blue, red, green, purple, orange, yellow, etc.
- Empty cells in `Notes_Title` and `Notes_URL` are allowed when you just want to add topics without notes
- `Topic_Title` in VIDEOS_DATA must exactly match `Topic_Title` in MAIN_DATA for proper linking
