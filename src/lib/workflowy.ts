import { WorkflowyNode, BrainliftSection, BrainliftSubsection } from '@/types';

/**
 * Extract share ID from Workflowy URL
 * URL format: https://workflowy.com/s/title-slug/shareId
 */
export function extractShareId(url: string): string | null {
  const patterns = [
    /workflowy\.com\/s\/[^/]+\/([a-zA-Z0-9]+)/,
    /workflowy\.com\/s\/([a-zA-Z0-9]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Fetch Workflowy data from shared link by scraping the page
 */
export async function fetchWorkflowyData(shareId: string): Promise<WorkflowyNode[]> {
  // Construct the full shared URL
  const sharedUrl = `https://workflowy.com/s/${shareId}`;
  
  // Fetch the HTML page
  const pageResponse = await fetch(sharedUrl, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  
  if (!pageResponse.ok) {
    throw new Error(`Failed to fetch Workflowy page: ${pageResponse.status}`);
  }
  
  const html = await pageResponse.text();
  
  // Try to extract the internal share_id from the page
  // Look for patterns like: "shareId":"xxxxx" or share_id in various formats
  const shareIdPatterns = [
    /"shareId"\s*:\s*"([^"]+)"/,
    /share_id=([^&"'\s]+)/,
    /"share_id"\s*:\s*"([^"]+)"/,
    /data-share-id="([^"]+)"/,
  ];
  
  let internalShareId: string | null = null;
  for (const pattern of shareIdPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      internalShareId = match[1];
      break;
    }
  }
  
  // Try to extract embedded project data from the HTML
  const projectDataMatch = html.match(/var\s+PROJECT_TREE_DATA\s*=\s*(\{[\s\S]*?\});/);
  if (projectDataMatch) {
    try {
      const projectData = JSON.parse(projectDataMatch[1]);
      if (projectData.mainProjectTreeInfo?.rootProjectChildren) {
        return projectData.mainProjectTreeInfo.rootProjectChildren;
      }
    } catch {
      // Continue to API fallback
    }
  }
  
  // Try another pattern for embedded data
  const initDataMatch = html.match(/__INITIAL_DATA__\s*=\s*(\{[\s\S]*?\});/);
  if (initDataMatch) {
    try {
      const initData = JSON.parse(initDataMatch[1]);
      if (initData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
        return initData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
      }
    } catch {
      // Continue to API fallback
    }
  }
  
  // If we found an internal share_id, try the API
  const apiShareId = internalShareId || shareId;
  
  // Try the get_initialization_data endpoint
  const initResponse = await fetch(
    `https://workflowy.com/get_initialization_data?share_id=${apiShareId}&client_version=21&client_version_v2=28&no_root_children=1&include_main_tree=1`,
    {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': sharedUrl,
      },
    }
  );
  
  if (initResponse.ok) {
    try {
      const initData = await initResponse.json();
      if (initData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
        return initData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
      }
    } catch {
      // Continue to tree data fallback
    }
  }
  
  // Try get_tree_data endpoint
  const treeResponse = await fetch(
    `https://workflowy.com/get_tree_data/?share_id=${apiShareId}`,
    {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': sharedUrl,
      },
    }
  );
  
  if (treeResponse.ok) {
    try {
      const treeData = await treeResponse.json();
      if (treeData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
        return treeData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
      }
    } catch {
      // Fall through to error
    }
  }
  
  throw new Error('Could not extract Workflowy data. The shared link may require authentication or the format is not supported. Please try pasting your content directly.');
}

/**
 * Parse raw text content into sections (fallback for manual input)
 */
export function parseTextToSections(text: string): BrainliftSection[] {
  const sections: BrainliftSection[] = [];
  
  const sectionMapping: Record<string, string> = {
    'strategic vision': 'strategic-vision',
    'executive summary': 'strategic-vision',
    'long-term vision': 'long-term-vision',
    '3-year plan': 'long-term-vision',
    'semester targets': 'semester-targets',
    '4.5-month goals': 'semester-targets',
    '30-day gameplan': '30-day-gameplan',
    '30 day gameplan': '30-day-gameplan',
    'market and competitive analysis': 'market-analysis',
    'market analysis': 'market-analysis',
    'product/service description': 'product-description',
    'product description': 'product-description',
    'service description': 'product-description',
    'skills and resources needed': 'skills-resources',
    'skills and resources': 'skills-resources',
    'financial projections': 'financial-projections',
    'risks, mitigation, and contingencies': 'risks-mitigation',
    'risks and mitigation': 'risks-mitigation',
    'risks': 'risks-mitigation',
    'appendix': 'appendix',
    'appendices': 'appendix',
  };
  
  // Split by markdown headers or bullet points that look like section titles
  const lines = text.split('\n');
  let currentSection: BrainliftSection | null = null;
  let currentContent: string[] = [];
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    
    // Check if this line is a section header
    let foundSection = false;
    for (const [key, sectionId] of Object.entries(sectionMapping)) {
      if (lowerLine.includes(key) && (lowerLine.startsWith('#') || lowerLine.startsWith('-') || lowerLine.length < 60)) {
        // Save previous section
        if (currentSection) {
          currentSection.content = currentContent.join('\n');
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          id: sectionId,
          title: line.replace(/^[#\-*\s]+/, '').trim(),
          content: '',
          subsections: [],
        };
        currentContent = [];
        foundSection = true;
        break;
      }
    }
    
    if (!foundSection && currentSection) {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n');
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Convert node tree to readable text
 */
function nodeToText(node: WorkflowyNode, indent: number = 0): string {
  const prefix = '  '.repeat(indent);
  let text = '';
  
  if (node.nm) {
    text += `${prefix}- ${stripHtml(node.nm)}\n`;
  }
  
  if (node.no) {
    text += `${prefix}  Note: ${stripHtml(node.no)}\n`;
  }
  
  if (node.ch) {
    for (const child of node.ch) {
      text += nodeToText(child, indent + 1);
    }
  }
  
  return text;
}

/**
 * Parse Workflowy nodes into structured Brainlift sections
 */
export function parseToSections(nodes: WorkflowyNode[]): BrainliftSection[] {
  const sections: BrainliftSection[] = [];
  
  const sectionMapping: Record<string, string> = {
    'strategic vision': 'strategic-vision',
    'executive summary': 'strategic-vision',
    'long-term vision': 'long-term-vision',
    '3-year plan': 'long-term-vision',
    'semester targets': 'semester-targets',
    '4.5-month goals': 'semester-targets',
    '30-day gameplan': '30-day-gameplan',
    '30 day gameplan': '30-day-gameplan',
    'market and competitive analysis': 'market-analysis',
    'market analysis': 'market-analysis',
    'product/service description': 'product-description',
    'product description': 'product-description',
    'service description': 'product-description',
    'skills and resources needed': 'skills-resources',
    'skills and resources': 'skills-resources',
    'financial projections': 'financial-projections',
    'risks, mitigation, and contingencies': 'risks-mitigation',
    'risks and mitigation': 'risks-mitigation',
    'risks': 'risks-mitigation',
    'appendix': 'appendix',
    'appendices': 'appendix',
  };
  
  for (const node of nodes) {
    const title = node.nm ? stripHtml(node.nm).toLowerCase() : '';
    
    // Check if this is a main section
    for (const [key, sectionId] of Object.entries(sectionMapping)) {
      if (title.includes(key)) {
        const section: BrainliftSection = {
          id: sectionId,
          title: stripHtml(node.nm || ''),
          content: nodeToText(node, 0),
          subsections: [],
        };
        
        // Parse subsections
        if (node.ch) {
          for (const child of node.ch) {
            const subsection: BrainliftSubsection = {
              title: stripHtml(child.nm || ''),
              content: nodeToText(child, 0),
              items: [],
            };
            
            // Get items from children
            if (child.ch) {
              for (const item of child.ch) {
                subsection.items.push(nodeToText(item, 0));
              }
            }
            
            section.subsections.push(subsection);
          }
        }
        
        sections.push(section);
        break;
      }
    }
  }
  
  return sections;
}

/**
 * Convert sections to a readable format for grading
 */
export function sectionsToGradingText(sections: BrainliftSection[]): string {
  let text = '# BUSINESS BRAINLIFT SUBMISSION\n\n';
  
  for (const section of sections) {
    text += `## ${section.title}\n\n`;
    text += section.content;
    text += '\n\n';
  }
  
  return text;
}
