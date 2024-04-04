const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchLatestHighlight() {
  const apiEndpoint = 'https://api.opensauced.pizza/v2/users/bekahhw/highlights?page=1&limit=3&range=30&prev_days_start_date=0';
  const response = await axios.get(apiEndpoint, {
    headers: { accept: 'application/json' }
  });
  if (response.data && response.data.data.length > 0) {
    return response.data.data[0].highlight;  
  }
  return null;
}

async function updateReadme(highlight) {
  const readmePath = path.join(__dirname, 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  const updatedReadmeContent = readmeContent.replace(/<!-- OPENSAUCED_START -->[\s\S]*?<!-- OPENSAUCED_END -->/, `<!-- OPENSAUCED_START -->\n${highlight}\n<!-- OPENSAUCED_END -->`);
  fs.writeFileSync(readmePath, updatedReadmeContent);
}

(async () => {
  try {
    const highlight = await fetchLatestHighlight();
    if (highlight) {
      await updateReadme(highlight);
      console.log('README updated with the latest OpenSauced highlight.');
    } else {
      console.log('No highlight found.');
    }
  } catch (error) {
    console.error('Error fetching or updating OpenSauced highlight:', error);
  }
})();
