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
    let score0 = [];
    let score0to2 = [];
    let score2plus = [];
    let differentRatings = [];

    console.log(`Processing ${submissions.length} submissions...`);

    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      const { score_manual, ...formData } = submission;
      const { isSpam, score, reasons } = await checkForSpam(formData);

      // Show progress
      console.log(`Processed ${i + 1}/${submissions.length} submissions`);

      // Categorize submissions based on spam score
      if (score === 0) {
        score0.push({ ...formData, score, reasons, score_manual });
      } else if (score < 2) {
        score0to2.push({ ...formData, score, reasons, score_manual });
      } else {
        score2plus.push({ ...formData, score, reasons, score_manual });
      }

      // Compare with manual score
      if ((isSpam && score_manual === 'spam') || (!isSpam && score_manual === 'clean')) {
        correct++;
      } else {
        incorrect++;
        differentRatings.push({ ...formData, score_manual, score, reasons });
      }
    }

    console.log('\nProcessing complete. Generating report...\n');

    // Section 1: Overall results split up by Spam Score
    console.log('Section 1: Overall results split up by Spam Score');
    console.log('\nSubmissions with Spam Score of 0:');
    score0.forEach(s => console.log({ ...s, score_manual: s.score_manual }));

    console.log('\nSubmissions with Spam Score between 0 and 2:');
    score0to2.forEach(s => console.log({ ...s, score_manual: s.score_manual }, 'Reasons:', s.reasons.join(', ')));

    console.log('\nSubmissions with Spam Score of 2 or greater:');
    score2plus.forEach(s => console.log({ ...s, score_manual: s.score_manual }, 'Reasons:', s.reasons.join(', ')));

    // Section 2: Comparison to the manual score
    console.log('\nSection 2: Comparison to the manual score');
    const totalSubmissions = submissions.length;
    const sameRatingPercentage = (correct / totalSubmissions) * 100;

    console.log(`Overall percentage that were the same as the manual score: ${sameRatingPercentage.toFixed(2)}%`);
    console.log(`Number of submissions that were rated the same: ${correct}`);
    console.log(`Number of submissions that were rated differently: ${incorrect}`);

    console.log('\nSubmissions that were rated differently:');
    differentRatings.forEach(s => {
      console.log(s);
      console.log('Reasons:', s.reasons.join(', '));
      console.log('--------------------------');
    });
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Update the script to use command-line argument
const csvFilePath = process.argv[2] || './test_data/basic2.csv';
testSpamChecker(csvFilePath);
