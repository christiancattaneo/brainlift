import { NextRequest, NextResponse } from 'next/server';
import { extractShareId, fetchWorkflowyData, parseToSections } from '@/lib/workflowy';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'Workflowy URL is required' },
        { status: 400 }
      );
    }
    
    const shareId = extractShareId(url);
    
    if (!shareId) {
      return NextResponse.json(
        { error: 'Invalid Workflowy URL format. Expected: https://workflowy.com/s/title/shareId' },
        { status: 400 }
      );
    }
    
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
    });
  } catch (error) {
    console.error('Workflowy fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Workflowy data' },
      { status: 500 }
    );
  }
}

