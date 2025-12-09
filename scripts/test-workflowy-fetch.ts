/**
 * Test script to investigate Workflowy shared link data fetching
 * 
 * Key discovery from browser network inspection:
 * - URL: https://workflowy.com/s/business-brainlift-s/gmlgOikRcr8N5JJm
 * - Internal share_id: O6pS.KeWTeqtr9c
 * 
 * The URL identifier (gmlgOikRcr8N5JJm) maps to a different internal share_id format.
 * We need to figure out how to get this mapping.
 */

const TEST_URL = 'https://workflowy.com/s/business-brainlift-s/gmlgOikRcr8N5JJm';
const KNOWN_INTERNAL_SHARE_ID = 'O6pS.KeWTeqtr9c';

interface TestResult {
  method: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

const results: TestResult[] = [];

// Extract URL identifier from shared link
function extractUrlIdentifier(url: string): string | null {
  const match = url.match(/workflowy\.com\/s\/[^/]+\/([a-zA-Z0-9]+)/);
  return match?.[1] || null;
}

// Method 1: Try fetching the HTML page and look for share_id in the response
async function testMethod1_FetchHTML(): Promise<TestResult> {
  console.log('\n=== Method 1: Fetch HTML and extract share_id ===');
  try {
    const response = await fetch(TEST_URL, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });
    
    const html = await response.text();
    console.log(`HTML length: ${html.length}`);
    
    // Look for share_id patterns in HTML
    const patterns = [
      /share_id['":\s]+['"]?([A-Za-z0-9.]+)['"]?/g,
      /shareId['":\s]+['"]?([A-Za-z0-9.]+)['"]?/g,
      /O6pS\.[A-Za-z0-9]+/g,
      /"projectTreeData"/,
      /PROJECT_TREE_DATA/,
      /__INITIAL_DATA__/,
    ];
    
    const findings: string[] = [];
    for (const pattern of patterns) {
      const matches = html.match(pattern);
      if (matches) {
        findings.push(`Pattern ${pattern}: ${matches.slice(0, 3).join(', ')}`);
      }
    }
    
    // Check for the known internal share_id
    const hasKnownShareId = html.includes(KNOWN_INTERNAL_SHARE_ID);
    
    console.log(`Found known share_id in HTML: ${hasKnownShareId}`);
    console.log(`Findings: ${findings.join('\n')}`);
    
    return {
      method: 'Fetch HTML',
      success: hasKnownShareId,
      data: { htmlLength: html.length, hasKnownShareId, findings },
    };
  } catch (error) {
    return {
      method: 'Fetch HTML',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Method 2: Try the API directly with URL identifier
async function testMethod2_DirectAPI(): Promise<TestResult> {
  console.log('\n=== Method 2: Direct API with URL identifier ===');
  const urlId = extractUrlIdentifier(TEST_URL);
  console.log(`URL identifier: ${urlId}`);
  
  try {
    const response = await fetch(
      `https://workflowy.com/get_initialization_data?share_id=${urlId}&client_version=21&client_version_v2=28`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      }
    );
    
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log(`Response length: ${text.length}`);
    
    if (response.ok && text.length > 100) {
      try {
        const data = JSON.parse(text);
        return {
          method: 'Direct API with URL ID',
          success: true,
          data: { hasProjectTree: !!data.projectTreeData },
        };
      } catch {
        return {
          method: 'Direct API with URL ID',
          success: false,
          error: 'Invalid JSON response',
        };
      }
    }
    
    return {
      method: 'Direct API with URL ID',
      success: false,
      error: `Status ${response.status}`,
    };
  } catch (error) {
    return {
      method: 'Direct API with URL ID',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Method 3: Try the API with known internal share_id
async function testMethod3_InternalShareId(): Promise<TestResult> {
  console.log('\n=== Method 3: API with known internal share_id ===');
  
  try {
    const response = await fetch(
      `https://workflowy.com/get_initialization_data?share_id=${KNOWN_INTERNAL_SHARE_ID}&client_version=21&client_version_v2=28`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      }
    );
    
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log(`Response length: ${text.length}`);
    
    if (response.ok && text.length > 100) {
      try {
        const data = JSON.parse(text);
        const hasData = !!data.projectTreeData?.mainProjectTreeInfo;
        console.log(`Has project tree data: ${hasData}`);
        return {
          method: 'API with internal share_id',
          success: hasData,
          data: { hasProjectTree: hasData, keys: Object.keys(data) },
        };
      } catch {
        return {
          method: 'API with internal share_id',
          success: false,
          error: 'Invalid JSON response',
        };
      }
    }
    
    return {
      method: 'API with internal share_id',
      success: false,
      error: `Status ${response.status}`,
    };
  } catch (error) {
    return {
      method: 'API with internal share_id',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Method 4: Try get_tree_data endpoint
async function testMethod4_TreeData(): Promise<TestResult> {
  console.log('\n=== Method 4: get_tree_data endpoint ===');
  
  try {
    const response = await fetch(
      `https://workflowy.com/get_tree_data/?share_id=${KNOWN_INTERNAL_SHARE_ID}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      }
    );
    
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log(`Response length: ${text.length}`);
    
    if (response.ok && text.length > 100) {
      try {
        const data = JSON.parse(text);
        const children = data.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren;
        console.log(`Number of root children: ${children?.length || 0}`);
        return {
          method: 'get_tree_data endpoint',
          success: !!children?.length,
          data: { 
            childCount: children?.length || 0,
            firstChildName: children?.[0]?.nm?.substring(0, 50),
          },
        };
      } catch {
        return {
          method: 'get_tree_data endpoint',
          success: false,
          error: 'Invalid JSON response',
        };
      }
    }
    
    return {
      method: 'get_tree_data endpoint',
      success: false,
      error: `Status ${response.status}`,
    };
  } catch (error) {
    return {
      method: 'get_tree_data endpoint',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Method 5: Fetch page and extract share_id from script tags or embedded data
async function testMethod5_ExtractFromPage(): Promise<TestResult> {
  console.log('\n=== Method 5: Extract share_id from page scripts ===');
  
  try {
    const response = await fetch(TEST_URL, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });
    
    const html = await response.text();
    
    // Look for various patterns where share_id might be embedded
    const patterns = [
      // Direct share_id in URL parameters within the HTML
      /share_id=([A-Za-z0-9.]+)/,
      // JSON data patterns
      /"share_id"\s*:\s*"([^"]+)"/,
      /'share_id'\s*:\s*'([^']+)'/,
      // Workflowy specific patterns
      /WF\.shareId\s*=\s*['"]([^'"]+)['"]/,
      /shareId['"]?\s*:\s*['"]([^'"]+)['"]/,
      // Data attribute
      /data-share-id=['"]([^'"]+)['"]/,
      // In script initialization
      /initializeSharedDocument\(['"]([^'"]+)['"]/,
    ];
    
    let foundShareId: string | null = null;
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        foundShareId = match[1];
        console.log(`Found with pattern ${pattern}: ${foundShareId}`);
        break;
      }
    }
    
    // Also look for O6pS prefix which seems to be the format
    const o6psMatch = html.match(/O6pS\.[A-Za-z0-9]+/);
    if (o6psMatch) {
      console.log(`Found O6pS format share_id: ${o6psMatch[0]}`);
      foundShareId = o6psMatch[0];
    }
    
    return {
      method: 'Extract from page scripts',
      success: !!foundShareId,
      data: { foundShareId },
    };
  } catch (error) {
    return {
      method: 'Extract from page scripts',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Method 6: Use the shared URL redirect to find internal ID
async function testMethod6_FollowRedirect(): Promise<TestResult> {
  console.log('\n=== Method 6: Check for redirects and headers ===');
  
  try {
    const response = await fetch(TEST_URL, {
      redirect: 'manual',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Location header: ${response.headers.get('location')}`);
    
    // Check all headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
    
    return {
      method: 'Follow redirect',
      success: response.status === 200 || response.status === 302,
      data: { status: response.status, headers },
    };
  } catch (error) {
    return {
      method: 'Follow redirect',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Method 7: Try variations of share_id format conversion
async function testMethod7_ShareIdConversion(): Promise<TestResult> {
  console.log('\n=== Method 7: Try share_id format conversions ===');
  
  const urlId = extractUrlIdentifier(TEST_URL);
  if (!urlId) {
    return {
      method: 'Share ID conversion',
      success: false,
      error: 'Could not extract URL identifier',
    };
  }
  
  // Try different conversion approaches
  const conversions = [
    urlId, // Direct
    `O6pS.${urlId}`, // Add O6pS prefix
    Buffer.from(urlId, 'base64').toString('hex'), // Base64 decode
    urlId.replace(/[A-Z]/g, c => c.toLowerCase()), // Lowercase
  ];
  
  const results: { format: string; status: number }[] = [];
  
  for (const shareId of conversions) {
    try {
      const response = await fetch(
        `https://workflowy.com/get_initialization_data?share_id=${shareId}&client_version=21`,
        { headers: { 'Accept': 'application/json' } }
      );
      results.push({ format: shareId.substring(0, 20), status: response.status });
      console.log(`Tried ${shareId.substring(0, 20)}... - Status: ${response.status}`);
    } catch {
      results.push({ format: shareId.substring(0, 20), status: -1 });
    }
  }
  
  return {
    method: 'Share ID conversion',
    success: results.some(r => r.status === 200),
    data: results,
  };
}

// Run all tests
async function runAllTests() {
  console.log('========================================');
  console.log('WORKFLOWY FETCH INVESTIGATION');
  console.log('========================================');
  console.log(`Test URL: ${TEST_URL}`);
  console.log(`Known internal share_id: ${KNOWN_INTERNAL_SHARE_ID}`);
  console.log('========================================\n');
  
  const tests = [
    testMethod1_FetchHTML,
    testMethod2_DirectAPI,
    testMethod3_InternalShareId,
    testMethod4_TreeData,
    testMethod5_ExtractFromPage,
    testMethod6_FollowRedirect,
    testMethod7_ShareIdConversion,
  ];
  
  for (const test of tests) {
    const result = await test();
    results.push(result);
    console.log(`\nResult: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (result.error) console.log(`Error: ${result.error}`);
    if (result.data) console.log(`Data: ${JSON.stringify(result.data, null, 2)}`);
  }
  
  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  for (const result of results) {
    console.log(`${result.success ? '✅' : '❌'} ${result.method}`);
  }
  
  const successfulMethods = results.filter(r => r.success);
  console.log(`\nSuccessful methods: ${successfulMethods.length}/${results.length}`);
  
  return results;
}

// Export for use as module or run directly
export { runAllTests, extractUrlIdentifier, KNOWN_INTERNAL_SHARE_ID };

// Run if executed directly
runAllTests().catch(console.error);

