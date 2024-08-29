const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'https://api.open5e.com/v1/monsters/';
const OUTPUT_FILE = 'monsters_summary.json';
const LOG_FILE = 'fetch_log.txt';

// Utility function to add a delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to get the last fetched page from the log file (if available)
function getLastFetchedPage() {
  if (fs.existsSync(LOG_FILE)) {
    const logData = fs.readFileSync(LOG_FILE, 'utf-8');
    const lastPageMatch = logData.match(/Last fetched page: (\d+)/);
    return lastPageMatch ? parseInt(lastPageMatch[1], 10) : 1;
  }
  return 1; // Start from page 1 if no log file exists
}

// Function to log the last fetched page
function logLastFetchedPage(page) {
  const logMessage = `Last fetched page: ${page}\nLast fetched at: ${new Date().toISOString()}\n`;
  fs.writeFileSync(LOG_FILE, logMessage);
}

// Main function to fetch monsters
async function fetchMonsters(startPage = 1) {
  let monsters = [];
  let url = `${BASE_URL}?page=${startPage}`;
  const initialDelay = 1000; // Initial delay of 1 second (1000 milliseconds)
  let delay = initialDelay;
  const maxRetries = 5;
  let retries = 0;

  try {
    // Load existing data from file if it exists
    if (fs.existsSync(OUTPUT_FILE)) {
      const existingData = fs.readFileSync(OUTPUT_FILE, 'utf-8');
      monsters = JSON.parse(existingData);
      console.log(`Loaded ${monsters.length} monsters from existing file.`);
    }

    while (url) {
      console.log(`Fetching data from: ${url}`);

      try {
        // Fetch data with error handling
        const response = await axios.get(url);
        const data = response.data;

        // Extract necessary fields and append to the monsters array
        monsters = monsters.concat(
          data.results.map((monster) => ({
            name: monster.name,
            challenge_rating: monster.challenge_rating,
            source: monster.document__slug,
            slug: monster.slug,
          }))
        );

        url = data.next; // Update the URL to the next page, or null if done
        retries = 0; // Reset retries after a successful request
        delay = initialDelay; // Reset delay after a successful request

        // Log the last fetched page number
        const lastFetchedPage = new URL(url).searchParams.get('page') - 1;
        logLastFetchedPage(lastFetchedPage);

        // Delay before making the next request
        if (url) {
          console.log(
            `Waiting for ${delay} milliseconds before the next request...`
          );
          await sleep(delay);
        }
      } catch (error) {
        console.error(`Error fetching data from ${url}: ${error.message}`);
        retries++;
        if (retries > maxRetries) {
          console.error('Max retries reached. Exiting.');
          break;
        }
        console.log(`Retrying after ${delay} milliseconds...`);
        await sleep(delay);
        delay *= 2; // Exponential backoff: Increase delay after each retry
      }
    }

    // Save the combined results back to the JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(monsters, null, 2));
    console.log(
      `Successfully fetched and saved ${monsters.length} monsters to ${OUTPUT_FILE}`
    );
  } catch (error) {
    console.error('Error fetching monsters:', error.message);
  }
}

// Start fetching monsters from the last fetched page or from page 1 if no log exists
const lastFetchedPage = getLastFetchedPage();
fetchMonsters(lastFetchedPage);
