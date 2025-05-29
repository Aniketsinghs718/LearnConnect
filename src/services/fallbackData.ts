// Fallback data provider for when notes folder is deleted
import { GoogleSheetsService } from '@/services/googleSheets';
import { Subject } from '@/interfaces/Subject';
import { BookOpen } from 'lucide-react';

export interface FallbackSubjectData {
  [subjectKey: string]: Subject;
}

export interface FallbackData {
  [year: string]: {
    [branch: string]: {
      [semester: string]: FallbackSubjectData;
    };
  };
}

/**
 * Provides fallback data when the notes folder is not available
 * This ensures the app works even when static data is removed
 */
export class FallbackDataProvider {
  private static cache: Map<string, any> = new Map();

  /**
   * Get subjects from Google Sheets or provide empty fallback
   */
  static async getSubjects(
    year: string,
    branch: string,
    semester: string
  ): Promise<FallbackSubjectData> {
    const cacheKey = `${year}-${branch}-${semester}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Try to get structured data from Google Sheets
      const sheetsData = await GoogleSheetsService.getSubjectsData(year, branch, semester);
      
      if (Object.keys(sheetsData).length > 0) {
        // Convert Google Sheets format to our internal format
        const subjects: FallbackSubjectData = {};
        
        for (const [subjectKey, subjectData] of Object.entries(sheetsData)) {
          // Convert modules structure
          const modules: any = {};
          
          for (const [moduleNum, moduleData] of Object.entries(subjectData.modules)) {
            modules[moduleNum] = {
              notesLink: moduleData.notesLink || [],
              topics: moduleData.topics || []
            };
          }

          subjects[subjectKey] = {
            name: subjectData.name,
            icon: this.getIconComponent(subjectData.icon),
            color: subjectData.color,
            modules: modules
          };
        }
        
        this.cache.set(cacheKey, subjects);
        return subjects;
      }
    } catch (error) {
      console.warn('Failed to load from Google Sheets:', error);
    }

    // Return empty fallback if Google Sheets fails
    const fallbackData: FallbackSubjectData = {};
    this.cache.set(cacheKey, fallbackData);
    return fallbackData;
  }

  /**
   * Convert icon string to icon component
   */
  private static getIconComponent(iconName: string): any {
    // Default to BookOpen if icon not found
    return BookOpen;
  }

  /**
   * Check if Google Sheets is configured
   */
  static isGoogleSheetsConfigured(): boolean {
    return !!(
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID && 
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    );
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Enhanced data loader that tries static data first, then Google Sheets
 */
export async function loadSubjectData(
  year: string,
  branch: string,
  semester: string
): Promise<FallbackSubjectData> {
  // Always use Google Sheets as primary source now
  console.log(`Loading subject data for ${year}/${branch}/${semester} from Google Sheets`);
  return await FallbackDataProvider.getSubjects(year, branch, semester);
}

/**
 * Load Important Links data with fallback
 * @deprecated Use loadImportantLinksDataForSubject for subject-specific links
 */
export async function loadImportantLinksData(
  year: string,
  branch: string,
  semester: string
): Promise<any[]> {
  try {
    // Try Google Sheets first
    const importantLinks = await GoogleSheetsService.getImportantLinks(year, branch, semester);
    if (importantLinks.length > 0) {
      console.log(`Loaded ${importantLinks.length} important links from Google Sheets`);
      return importantLinks;
    }
  } catch (error) {
    console.warn('Important links data not available from Google Sheets:', error);
  }  // Fallback: return empty array since static data is no longer available
  console.log('No important links found, returning empty array');
  return [];
}

/**
 * Load Important Links data for a specific subject with fallback
 */
export async function loadImportantLinksDataForSubject(
  year: string,
  branch: string,
  semester: string,
  subjectKey: string
): Promise<any[]> {
  try {
    // Try Google Sheets first
    const importantLinks = await GoogleSheetsService.getImportantLinksForSubject(year, branch, semester, subjectKey);
    if (importantLinks.length > 0) {
      console.log(`Loaded ${importantLinks.length} subject-specific important links from Google Sheets for ${subjectKey}`);
      return importantLinks;
    }
  } catch (error) {
    console.warn(`Subject-specific important links data not available from Google Sheets for ${subjectKey}:`, error);
  }  // Fallback: return empty array since static data is no longer available
  console.log(`No subject-specific important links found for ${subjectKey}, returning empty array`);
  return [];
}
