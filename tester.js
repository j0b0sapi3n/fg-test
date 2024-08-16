import { checkForSpam } from './checkForSpam.js';
import fs from 'fs';
import csv from 'csv-parser';

function testSpamChecker(csvFilePath) {
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const formSubmission = {
        text: row.message,
        // Include other form fields from the CSV as needed
      };

      const { spamScore, reasons } = checkForSpam(formSubmission);
      const isSpam = spamScore > 0 ? 'spam' : 'clean';
      const manualRating = row.manual_rating.trim().toLowerCase();

      results.push({
        submission: row,
        isSpam,
        manualRating,
        correct: isSpam === manualRating,
        reasons,
      });
    })
    .on('end', () => {
      const total = results.length;
      const correct = results.filter((result) => result.correct).length;
      console.log(
        `Correct classifications: ${correct}/${total} (${
          (correct / total) * 100
        }%)`
      );

      results.forEach((result) => {
        if (!result.correct) {
          console.log(
            `Incorrect classification: ${JSON.stringify(
              result.submission
            )}\nExpected: ${result.manualRating}, Got: ${
              result.isSpam
            }\nReasons: ${result.reasons.join(', ')}`
          );
        }
      });
    });
}

// Example usage: testSpamChecker('submissions.csv');

testSpamChecker('submissions.csv');
