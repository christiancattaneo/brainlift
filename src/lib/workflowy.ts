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
 * Fetch Workflowy data from shared link
 */
export async function fetchWorkflowyData(shareId: string): Promise<WorkflowyNode[]> {
  // First, get initialization data to get the proper share_id format
  const initResponse = await fetch(
    `https://workflowy.com/get_initialization_data?share_id=${shareId}&client_version=21&client_version_v2=28&no_root_children=1&include_main_tree=1`,
    {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    }
  );
  
  if (!initResponse.ok) {
    throw new Error(`Failed to fetch initialization data: ${initResponse.status}`);
  }
  
  const initData = await initResponse.json();
  
  // Try to get tree data
  const treeResponse = await fetch(
    `https://workflowy.com/get_tree_data/?share_id=${shareId}`,
    {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    }
  );
  
  if (!treeResponse.ok) {
    throw new Error(`Failed to fetch tree data: ${treeResponse.status}`);
  }
  
  const treeData = await treeResponse.json();
  
  // Extract the root children from the response
  if (treeData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
    return treeData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
  }
  
  if (initData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
    return initData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
  }
  
  throw new Error('Could not extract Workflowy data from response');
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

