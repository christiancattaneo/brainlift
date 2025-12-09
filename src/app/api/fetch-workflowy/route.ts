import { NextRequest, NextResponse } from 'next/server';
import { extractShareId, fetchWorkflowyData, parseToSections, parseTextToSections } from '@/lib/workflowy';

export async function POST(request: NextRequest) {
  try {
    const { url, content } = await request.json();
    
    // If direct content is provided, parse it directly
    if (content && typeof content === 'string' && content.trim().length > 0) {
      const sections = parseTextToSections(content);
      
      if (sections.length === 0) {
        return NextResponse.json(
          { error: 'Could not parse any sections from the provided content. Make sure it follows the Business Brainlift template structure with section headers.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        sections,
        sectionCount: sections.length,
        source: 'direct',
      });
    }
    
    // Otherwise, try to fetch from Workflowy URL
    if (!url) {
      return NextResponse.json(
        { error: 'Please provide a Workflowy URL or paste your content directly' },
        { status: 400 }
      );
    }
    
    // Handle full URLs or just the share ID
    let shareId: string | null = null;
    
    if (url.includes('workflowy.com')) {
      shareId = extractShareId(url);
    } else if (/^[a-zA-Z0-9]+$/.test(url.trim())) {
      // Assume it's just the share ID
      shareId = url.trim();
    }
    
    if (!shareId) {
      return NextResponse.json(
        { error: 'Invalid Workflowy URL format. Expected: https://workflowy.com/s/title/shareId' },
        { status: 400 }
      );
    }
    
    try {
      const nodes = await fetchWorkflowyData(shareId);
      const sections = parseToSections(nodes);
      
      if (sections.length === 0) {
        return NextResponse.json(
          { error: 'Could not parse any sections from the Workflowy document. Make sure it follows the Business Brainlift template structure.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        sections,
        sectionCount: sections.length,
        source: 'workflowy',
      });
    } catch (workflowyError) {
      // Return a helpful error message
      const errorMessage = workflowyError instanceof Error ? workflowyError.message : 'Unknown error';
      return NextResponse.json(
        { 
          error: `Unable to fetch from Workflowy: ${errorMessage}. Try copying your content from Workflowy and pasting it directly.`,
          suggestion: 'paste_content'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Workflowy fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
