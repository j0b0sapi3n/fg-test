import { checkForSpam } from './checkForSpam.js';
import fs from 'fs';
import csv from 'csv-parser';

function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function testSpamChecker(filePath) {
  try {
    const submissions = await loadCSV(filePath);
    let correct = 0;
    let incorrect = 0;

    for (const submission of submissions) {
      const { score_manual, ...formData } = submission;
      const { isSpam, score, reasons } = await checkForSpam(formData);

      // Output the data for each submission
      console.log('Submission Data:', formData);
      console.log('Manual Score:', score_manual);
      console.log('isSpam:', isSpam);
      console.log('Spam Score:', score);
      console.log('Reasons:', reasons.join(', ') || 'No specific reasons');

      if (
        (isSpam && score_manual === 'spam') ||
        (!isSpam && score_manual === 'clean')
      ) {
        correct++;
      } else {
        incorrect++;
        console.log('\x1b[31m%s\x1b[0m', '*** DIFFERENT RESULT ***');
      }

      console.log('--------------------------\n');
    }

    console.log(`Correct detections: ${correct}`);
    console.log(`Incorrect detections: ${incorrect}`);
    console.log(`Accuracy: ${(correct / submissions.length) * 100}%`);
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Update the script to use command-line argument
const csvFilePath = process.argv[2] || './test_data/basic2.csv';
testSpamChecker(csvFilePath);
