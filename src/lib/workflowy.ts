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
 * Fetch Workflowy data from shared link using two-step approach:
 * 1. Fetch HTML page to get internal share_id and session cookie
 * 2. Use session cookie to call API and get full data
 */
export async function fetchWorkflowyData(urlIdentifier: string): Promise<WorkflowyNode[]> {
  // Construct the full shared URL
  // Handle both full URLs and just the identifier
  let sharedUrl: string;
  if (urlIdentifier.includes('workflowy.com')) {
    sharedUrl = urlIdentifier;
  } else {
    sharedUrl = `https://workflowy.com/s/${urlIdentifier}`;
  }
  
  console.log(`[Workflowy] Fetching: ${sharedUrl}`);
  
  // Step 1: Fetch the HTML page to get share_id and session cookie
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
  console.log(`[Workflowy] HTML length: ${html.length}`);
  
  // Extract the internal share_id from the HTML
  const shareIdMatch = html.match(/"share_id"\s*:\s*"([^"]+)"/);
  if (!shareIdMatch?.[1]) {
    throw new Error('Could not find share_id in Workflowy page. The link may be private or invalid.');
  }
  
  const internalShareId = shareIdMatch[1];
  console.log(`[Workflowy] Found internal share_id: ${internalShareId}`);
  
  // Extract session cookie from response
  const cookies = pageResponse.headers.get('set-cookie') || '';
  const sessionMatch = cookies.match(/sessionid=([^;]+)/);
  
  if (!sessionMatch?.[1]) {
    throw new Error('Could not get session from Workflowy. Please try again.');
  }
  
  const sessionId = sessionMatch[1];
  console.log(`[Workflowy] Got session cookie`);
  
  // Step 2: Call API with session cookie to get full data
  const apiResponse = await fetch(
    `https://workflowy.com/get_initialization_data?share_id=${internalShareId}&client_version=21&client_version_v2=28&no_root_children=0&include_main_tree=1`,
    {
      headers: {
        'Accept': 'application/json',
        'Cookie': `sessionid=${sessionId}`,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': sharedUrl,
      },
    }
  );
  
  if (!apiResponse.ok) {
    console.log(`[Workflowy] API returned ${apiResponse.status}, trying get_tree_data...`);
    
    // Fallback to get_tree_data endpoint
    const treeResponse = await fetch(
      `https://workflowy.com/get_tree_data/?share_id=${internalShareId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Cookie': `sessionid=${sessionId}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Referer': sharedUrl,
        },
      }
    );
    
    if (!treeResponse.ok) {
      throw new Error(`Workflowy API returned ${treeResponse.status}. The link may require authentication.`);
    }
    
    const treeData = await treeResponse.json();
    if (treeData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
      return treeData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
    }
    
    throw new Error('Could not extract data from Workflowy API response.');
  }
  
  const apiData = await apiResponse.json();
  console.log(`[Workflowy] API response keys: ${Object.keys(apiData).join(', ')}`);
  
  // Extract children from the response
  if (apiData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
    const children = apiData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
    console.log(`[Workflowy] Found ${children.length} root children`);
    return children;
  }
  
  throw new Error('Could not extract Workflowy data from API response.');
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
