# Open5e Monster Fetcher

A Node.js script to fetch and update a list of monsters from the Open5e API, storing the data locally in a JSON file for easy lookup and future use. This script is designed to handle API pagination, errors, and retries, making it robust for repeated use.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Script Details](#script-details)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)
- [Acknowledgments](#acknowledgments)

## Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or later)
- npm (comes with Node.js)

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/open5e-monster-fetcher.git
   cd open5e-monster-fetcher
   ```

2. Install the required dependencies:

   ```bash
   npm install axios
   ```

## Usage

To run the script and fetch the monsters:

1. Ensure you have Node.js installed on your machine.
2. Run the script using Node.js:

   ```bash
    node fetchMonsters.js
   ```

The script will automatically fetch the latest monster data starting from the last fetched page or from page 1 if no log exists.

## Script Details

- `fetchMonsters.js`: The main script that handles fetching data from the Open5e API, managing pagination, handling errors, and saving the data to a local JSON file.

## Key Features

- **Pagination Handling:** Automatically fetches all pages of data from the Open5e API.
- **Error Handling:** Includes retry logic with exponential backoff for handling API errors.
- **Data Deduplication:** Ensures that the local JSON file does not contain duplicate entries.
- **Logging:** Logs the last successfully fetched page to resume fetching from the correct point in case of interruptions.

## Configuration

### Customizing Data Fields Saved to JSON

**Modifying Data Fields:** You can add or remove data fields that the script saves to the `monsters_summary.json` file by editing the object stored in the newMonsters constant in the `fetchMonsters.js` script.

```JS
const newMonsters = data.results.map((monster) => ({
  name: monster.name, // Name of the monster
  challenge_rating: monster.challenge_rating, // Challenge rating
  source: monster.document__slug, // Source of the monster data
  slug: monster.slug, // Unique identifier
  // Add or remove fields here
}));
```

**To Add a Field:** Find the desired field in the API response and add it to the object inside the `map` function. For example, to add the monster's `hit_points`, modify the object like so:

```JS
const newMonsters = data.results.map((monster) => ({
  name: monster.name,
  challenge_rating: monster.challenge_rating,
  source: monster.document__slug,
  slug: monster.slug,
  hit_points: monster.hit_points, // New field added
}));
```

**To Remove a Field:** Simply delete the corresponding line from the object. For example, to remove the source field:

```JS
const newMonsters = data.results.map((monster) => ({
  name: monster.name,
  challenge_rating: monster.challenge_rating,
  slug: monster.slug,
  // source: monster.document__slug, // Field removed
}));
```

### Log and Output Configuration

- `fetch_log.txt`: Stores the last successfully fetched page number and timestamp to enable resuming from the correct point.
- `monsters_summary.json`: The output file where all fetched monster data is stored.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Submit a pull request with a description of your changes.

## License

This project is licensed under the MIT License.

## Contact Information

For questions or feedback, please reach out to:

GitHub: gravem

## Acknowledgments

Open5e API for providing the monster data.
Node.js for the server-side JavaScript runtime.
axios for HTTP requests.
Special thanks to contributors and the Open5e community!
