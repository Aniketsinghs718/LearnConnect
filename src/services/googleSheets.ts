// Google Sheets API Service for Notes Management
import { NotesLink } from '@/interfaces/Subject';

export interface MainDataRow {
  year: string;           // fy, sy, ty, ly
  branch: string;         // comps, it, aids, excp, extc, mech, rai
  semester: string;       // odd, even
  subject_key: string;    // am2, dsip, coa, ds, etc.
  subject_name: string;   // Applied Mathematics 2, etc.
  subject_icon: string;   // Brain, Signal, Database, etc.
  subject_color: string;  // blue, red, green, etc.
  module_number: number;  // 1, 2, 3, 4, 5, etc.
  notes_title: string;    // Notes document title
  notes_url: string;      // Notes document URL
  topic_title: string;    // Topic name
  topic_description: string; // Topic description
}

export interface VideoDataRow {
  year: string;
  branch: string;
  semester: string;
  subject_key: string;
  module_number: number;
  topic_title: string;
  video_title: string;
  video_url: string;
}

export interface ImportantLinkRow {
  year: string;
  branch: string;
  semester: string;
  subject_key: string;
  link_title: string;
  link_url: string;
}

export interface ImportantLink {
  title: string;
  url: string;
}

export interface SubjectData {
  key: string;
  name: string;
  icon: string;
  color: string;
  modules: { [moduleNumber: number]: ModuleData };
}

export interface ModuleData {
  notesLink: NotesLink[];
  topics: TopicData[];
}

export interface TopicData {
  title: string;
  description: string;
  videos: VideoData[];
}

export interface VideoData {
  title: string;
  url: string;
}

export class GoogleSheetsService {
  private static SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  private static API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  /**
   * Get all subjects data for a specific year, branch, and semester
   * Returns structured data that matches the Subject interface
   */
  static async getSubjectsData(
    year: string,
    branch: string,
    semester: string
  ): Promise<{ [subjectKey: string]: SubjectData }> {
    if (!this.SHEET_ID || !this.API_KEY) {
      console.warn('Google Sheets credentials not configured.');
      return {};
    }

    try {
      // Fetch main data and videos data
      const mainDataRange = 'MAIN_DATA!A:L';
      const videosDataRange = 'VIDEOS_DATA!A:H';
      
      const [mainResponse, videosResponse] = await Promise.all([
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${mainDataRange}?key=${this.API_KEY}`),
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${videosDataRange}?key=${this.API_KEY}`)
      ]);

      if (!mainResponse.ok || !videosResponse.ok) {
        throw new Error(`HTTP error! Main: ${mainResponse.status}, Videos: ${videosResponse.status}`);
      }

      const [mainData, videosData] = await Promise.all([
        mainResponse.json(),
        videosResponse.json()
      ]);

      if (!mainData.values || mainData.values.length <= 1) {
        console.warn('No main data found in Google Sheets');
        return {};
      }

      // Process main data
      const filteredMainRows = mainData.values
        .slice(1) // Skip header
        .filter((row: string[]) => {
          return (
            row[0]?.toLowerCase() === year.toLowerCase() &&
            row[1]?.toLowerCase() === branch.toLowerCase() &&
            row[2]?.toLowerCase() === semester.toLowerCase()
          );
        });

      // Process videos data
      const filteredVideoRows = videosData.values 
        ? videosData.values
            .slice(1) // Skip header
            .filter((row: string[]) => {
              return (
                row[0]?.toLowerCase() === year.toLowerCase() &&
                row[1]?.toLowerCase() === branch.toLowerCase() &&
                row[2]?.toLowerCase() === semester.toLowerCase()
              );
            })
        : [];

      // Build subjects data structure
      const subjects: { [subjectKey: string]: SubjectData } = {};

      // Group main data by subject
      filteredMainRows.forEach((row: string[]) => {
        const subjectKey = row[3];
        const subjectName = row[4];
        const subjectIcon = row[5] || 'BookOpen';
        const subjectColor = row[6] || 'blue';
        const moduleNumber = parseInt(row[7]) || 1;
        const notesTitle = row[8];
        const notesUrl = row[9];
        const topicTitle = row[10];
        const topicDescription = row[11];

        if (!subjectKey) return;

        // Initialize subject if not exists
        if (!subjects[subjectKey]) {
          subjects[subjectKey] = {
            key: subjectKey,
            name: subjectName || subjectKey,
            icon: subjectIcon,
            color: subjectColor,
            modules: {}
          };
        }

        // Initialize module if not exists
        if (!subjects[subjectKey].modules[moduleNumber]) {
          subjects[subjectKey].modules[moduleNumber] = {
            notesLink: [],
            topics: []
          };
        }

        // Add notes link if provided
        if (notesTitle && notesUrl) {
          subjects[subjectKey].modules[moduleNumber].notesLink.push({
            title: notesTitle,
            url: notesUrl
          });
        }

        // Add topic if provided
        if (topicTitle) {
          // Check if topic already exists
          const existingTopic = subjects[subjectKey].modules[moduleNumber].topics.find(
            topic => topic.title === topicTitle
          );

          if (!existingTopic) {
            subjects[subjectKey].modules[moduleNumber].topics.push({
              title: topicTitle,
              description: topicDescription || '',
              videos: []
            });
          }
        }
      });

      // Add videos to topics
      filteredVideoRows.forEach((row: string[]) => {
        const subjectKey = row[3];
        const moduleNumber = parseInt(row[4]) || 1;
        const topicTitle = row[5];
        const videoTitle = row[6];
        const videoUrl = row[7];

        if (!subjectKey || !topicTitle || !videoTitle || !videoUrl) return;

        const subject = subjects[subjectKey];
        if (!subject || !subject.modules[moduleNumber]) return;

        const topic = subject.modules[moduleNumber].topics.find(
          t => t.title === topicTitle
        );

        if (topic) {
          topic.videos.push({
            title: videoTitle,
            url: videoUrl
          });
        }
      });

      return subjects;

    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      return {};
    }
  }
  /**
   * Get important links for a specific year, branch, and semester
   * @deprecated Use getImportantLinksForSubject for subject-specific links
   */
  static async getImportantLinks(
    year: string,
    branch: string,
    semester: string
  ): Promise<ImportantLink[]> {
    if (!this.SHEET_ID || !this.API_KEY) {
      console.warn('Google Sheets credentials not configured.');
      return [];
    }

    try {
      const range = 'IMPORTANT_LINKS!A:F';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${range}?key=${this.API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        return [];
      }
      
      // Skip header row and filter data
      const filteredRows = data.values
        .slice(1) // Skip header
        .filter((row: string[]) => {
          return (
            row[0]?.toLowerCase() === year.toLowerCase() &&
            row[1]?.toLowerCase() === branch.toLowerCase() &&
            row[2]?.toLowerCase() === semester.toLowerCase()
          );
        });
      
      return filteredRows.map((row: string[]) => ({
        title: row[4] || 'Untitled',
        url: row[5] || '#'
      }));
      
    } catch (error) {
      console.error('Error fetching important links from Google Sheets:', error);
      return [];
    }
  }

  /**
   * Get important links for a specific year, branch, semester, and subject
   */
  static async getImportantLinksForSubject(
    year: string,
    branch: string,
    semester: string,
    subjectKey: string
  ): Promise<ImportantLink[]> {
    if (!this.SHEET_ID || !this.API_KEY) {
      console.warn('Google Sheets credentials not configured.');
      return [];
    }

    try {
      const range = 'IMPORTANT_LINKS!A:F';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${range}?key=${this.API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        return [];
      }
      
      // Skip header row and filter data
      const filteredRows = data.values
        .slice(1) // Skip header
        .filter((row: string[]) => {
          return (
            row[0]?.toLowerCase() === year.toLowerCase() &&
            row[1]?.toLowerCase() === branch.toLowerCase() &&
            row[2]?.toLowerCase() === semester.toLowerCase() &&
            row[3]?.toLowerCase() === subjectKey.toLowerCase()
          );
        });
      
      return filteredRows.map((row: string[]) => ({
        title: row[4] || 'Untitled',
        url: row[5] || '#'
      }));
      
    } catch (error) {
      console.error('Error fetching subject-specific important links from Google Sheets:', error);
      return [];
    }
  }
  /**
   * Get all subjects for a specific year, branch, and semester
   * Legacy method for backward compatibility
   */
  static async getSubjects(
    year: string,
    branch: string,
    semester: string
  ): Promise<string[]> {
    const subjectsData = await this.getSubjectsData(year, branch, semester);
    return Object.keys(subjectsData);
  }

  /**
   * Get available modules for a specific subject
   * Legacy method for backward compatibility
   */
  static async getModules(
    year: string,
    branch: string,
    semester: string,
    subject: string
  ): Promise<number[]> {
    const subjectsData = await this.getSubjectsData(year, branch, semester);
    const subjectData = subjectsData[subject];
    
    if (!subjectData) return [];
    
    return Object.keys(subjectData.modules).map(Number).sort((a, b) => a - b);
  }

  /**
   * Fetch notes links for a specific year, branch, semester, subject, and module
   * Legacy method for backward compatibility
   */
  static async getNotesLinks(
    year: string,
    branch: string,
    semester: string,
    subject: string,
    module: number
  ): Promise<NotesLink[]> {
    const subjectsData = await this.getSubjectsData(year, branch, semester);
    const subjectData = subjectsData[subject];
    
    if (!subjectData || !subjectData.modules[module]) {
      return [];
    }
    
    return subjectData.modules[module].notesLink || [];
  }
  /**
   * Test connection to Google Sheets
   */
  static async testConnection(): Promise<boolean> {
    if (!this.SHEET_ID || !this.API_KEY) {
      return false;
    }

    try {
      const range = 'MAIN_DATA!A1:A1';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${range}?key=${this.API_KEY}`;
      
      const response = await fetch(url);
      return response.ok;
      
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }
}
