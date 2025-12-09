/**
 * Test script to extract embedded PROJECT_TREE_DATA from Workflowy HTML
 */

const TEST_URL = 'https://workflowy.com/s/business-brainlift-s/gmlgOikRcr8N5JJm';

interface WorkflowyNode {
  id: string;
  nm?: string;
  no?: string;
  ch?: WorkflowyNode[];
}

async function testEmbeddedData() {
  console.log('Fetching HTML page...');
  
  const response = await fetch(TEST_URL, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  });
  
  const html = await response.text();
  console.log(`\nHTML length: ${html.length} bytes`);
  
  // Look for PROJECT_TREE_DATA
  console.log('\n=== Looking for embedded data ===');
  
  // Pattern 1: var PROJECT_TREE_DATA = {...}
  const projectTreeMatch = html.match(/var\s+PROJECT_TREE_DATA\s*=\s*(\{[\s\S]*?\});/);
  if (projectTreeMatch) {
    console.log('✅ Found PROJECT_TREE_DATA variable!');
    console.log(`Data preview: ${projectTreeMatch[1].substring(0, 200)}...`);
    
    try {
      const data = JSON.parse(projectTreeMatch[1]);
      console.log(`Parsed successfully! Keys: ${Object.keys(data).join(', ')}`);
      
      if (data.mainProjectTreeInfo?.rootProjectChildren) {
        const children = data.mainProjectTreeInfo.rootProjectChildren;
        console.log(`\n✅ Found ${children.length} root children!`);
        children.slice(0, 3).forEach((child: WorkflowyNode, i: number) => {
          console.log(`  ${i + 1}. ${child.nm?.substring(0, 60) || 'No name'}`);
        });
      }
    } catch (e) {
      console.log(`❌ Failed to parse: ${e}`);
    }
  } else {
    console.log('❌ PROJECT_TREE_DATA variable not found');
  }
  
  // Pattern 2: Look for WF.projectTreeData or similar
  const wfDataMatch = html.match(/WF\.projectTreeData\s*=\s*(\{[\s\S]*?\});/);
  if (wfDataMatch) {
    console.log('\n✅ Found WF.projectTreeData!');
  }
  
  // Pattern 3: Look for window.__INITIAL_DATA__ or similar
  const initialDataMatch = html.match(/window\.__INITIAL_DATA__\s*=\s*(\{[\s\S]*?\});/);
  if (initialDataMatch) {
    console.log('\n✅ Found window.__INITIAL_DATA__!');
  }
  
  // Pattern 4: Look for inline JSON with projectTreeData
  const inlineJsonMatch = html.match(/projectTreeData['"]\s*:\s*(\{[\s\S]*?rootProjectChildren[\s\S]*?\})\s*[,}]/);
  if (inlineJsonMatch) {
    console.log('\n✅ Found inline projectTreeData JSON!');
  }
  
  // Pattern 5: Look for any large JSON blob with nm/ch structure
  const jsonBlobMatch = html.match(/\{"nm":"[^"]*","ch":\[[\s\S]*?\]\}/);
  if (jsonBlobMatch) {
    console.log('\n✅ Found JSON blob with Workflowy node structure!');
    console.log(`Preview: ${jsonBlobMatch[0].substring(0, 200)}...`);
  }
  
  // Extract share_id for API calls
  console.log('\n=== Extracting share_id ===');
  const shareIdMatch = html.match(/"share_id"\s*:\s*"([^"]+)"/);
  if (shareIdMatch) {
    console.log(`✅ Found share_id: ${shareIdMatch[1]}`);
    
    // Try API call with cookies from response
    console.log('\n=== Trying API with session cookie ===');
    const cookies = response.headers.get('set-cookie');
    console.log(`Cookies received: ${cookies?.substring(0, 100)}...`);
    
    // Extract sessionid
    const sessionMatch = cookies?.match(/sessionid=([^;]+)/);
    if (sessionMatch) {
      console.log(`Session ID: ${sessionMatch[1]}`);
      
      // Try API call with session
      const apiResponse = await fetch(
        `https://workflowy.com/get_initialization_data?share_id=${shareIdMatch[1]}&client_version=21&client_version_v2=28`,
        {
          headers: {
            'Accept': 'application/json',
            'Cookie': `sessionid=${sessionMatch[1]}`,
            'User-Agent': 'Mozilla/5.0',
          },
        }
      );
      
      console.log(`API Status: ${apiResponse.status}`);
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log(`✅ API call successful! Keys: ${Object.keys(apiData).join(', ')}`);
        
        if (apiData.projectTreeData?.mainProjectTreeInfo?.rootProjectChildren) {
          const children = apiData.projectTreeData.mainProjectTreeInfo.rootProjectChildren;
          console.log(`\n✅ Got ${children.length} children from API!`);
        }
      } else {
        const errorText = await apiResponse.text();
        console.log(`❌ API failed: ${errorText.substring(0, 200)}`);
      }
    }
  }
  
  // Final approach: Look for all script tags and analyze
  console.log('\n=== Analyzing script tags ===');
  const scriptTags = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
  console.log(`Found ${scriptTags.length} script tags`);
  
  for (let i = 0; i < scriptTags.length; i++) {
    const script = scriptTags[i];
    if (script.includes('projectTreeData') || script.includes('PROJECT_TREE') || script.includes('rootProjectChildren')) {
      console.log(`\nScript ${i + 1} contains relevant data:`);
      console.log(`Preview: ${script.substring(0, 500)}...`);
      
      // Try to extract JSON from this script
      const jsonMatch = script.match(/\{[\s\S]*?"rootProjectChildren"[\s\S]*?\}/);
      if (jsonMatch) {
        console.log('\nFound JSON with rootProjectChildren!');
        try {
          // This might be partial, so let's try a more careful extraction
          const startIdx = script.indexOf('{');
          let depth = 0;
          let endIdx = startIdx;
          for (let j = startIdx; j < script.length; j++) {
            if (script[j] === '{') depth++;
            if (script[j] === '}') depth--;
            if (depth === 0) {
              endIdx = j + 1;
              break;
            }
          }
          const jsonStr = script.substring(startIdx, endIdx);
          const parsed = JSON.parse(jsonStr);
          console.log(`Parsed! Keys: ${Object.keys(parsed).join(', ')}`);
        } catch (e) {
          console.log(`Parse error: ${e}`);
        }
      }
    }
  }
}

testEmbeddedData().catch(console.error);

