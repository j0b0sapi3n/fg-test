import fetch from 'node-fetch';

// Utility functions
function vowels_regex(text) {
  return text.match(/[aeiouAEIOU]/g) || [];
}

function is_irregular(text) {
  const vowel_count = vowels_regex(text).length;
  const word_len = text.length;
  const vratio = vowel_count / word_len;

  if (word_len < 3) {
    // IF TEXT TOO SHORT
    return true;
  }

  if (vratio < 0.2) {
    // IF VOWEL RATIO IS TOO LOW
    return true;
  }

  if (text.toLowerCase().includes("test")) {
    // IF TEXT INCLUDES "TEST"
    return true;
  }

  return false;
}

function strip_non_alpha(text) {
  return text.replace(/[^a-zA-Z\s]/g, '');
}

function strip_non_numerical(string) {
  return string ? string.replace(/[^\d]/g, '') : ''; // Return an empty string if undefined
}

// Email validation check via mails.so API
export const email_validate = async (data, reasons) => {
  const apiKey = '7ef44d64-27d1-4066-9b81-7a48e554fc5a';
  const email = data.email.toLowerCase();

  try {
    const response = await fetch(
      `https://api.mails.so/v1/validate?email=${email}`,
      {
        method: 'GET',
        headers: {
          'x-mails-api-key': apiKey,
        },
      }
    );

    const result = await response.json();

    if (result.error) {
      reasons.push('Email validation error: ' + result.error);
      return 2;
    }

    const { result: validationResult, reason, score } = result.data;

    if (validationResult === 'undeliverable') {
      reasons.push(`Email validation failed: ${reason}`);
      return 2;
    }

    if (score < 80 && score >= 40) {
      reasons.push('Email validation score is low.');
      return 1;
    } else if (score < 40) {
      reasons.push('Email validation score is very low.');
      return 2;
    }

    return 0;
  } catch (error) {
    console.error('Error during email validation:', error);
    reasons.push('Error occurred during email validation.');
    return 1; // In case of error, we might consider it suspicious and increase the score
  }
};

function name_irregular(data, reasons) {
  const fn = data.firstname.toLowerCase().trim();
  const ln = data.lastname.toLowerCase().trim();
  if ((fn.length && (is_irregular(fn) || /\d/.test(fn))) || (ln.length && (is_irregular(ln) || /\d/.test(ln)))) {
    reasons.push('Name irregular');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

function title_irregular(data, reasons) {
  const title = data.title;
  const numberCount = (title.match(/\d/g) || []).length;
  if (title.length && (is_irregular(title) || numberCount > 1)) {
    if (numberCount > 2) {
      reasons.push('Title irregular with extra numbers');
      return 2; // INCREASED ISSUE SEVERITY
    }
    reasons.push('Title irregular');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

function company_irregular(data, reasons) {
  const company = data.company.toLowerCase().trim();
  const companyAlpha = strip_non_alpha(company);
  const numberCount = (company.match(/\d/g) || []).length;

  if (numberCount >= 4) {
    reasons.push('Company name contains 4 or more numbers');
    return 2; // INCREASED ISSUE SEVERITY
  }

  if (companyAlpha.length && is_irregular(companyAlpha)) {
    reasons.push('Company irregular');
    return 1; // ISSUE DETECTED
  }

  return 0;
}

function phone_irregular(data, reasons) {
  const phone = strip_non_numerical(data.phone);
  if (phone && ![10, 12].includes(phone.length)) {
    reasons.push('Phone irregular');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

export const checkForSpam = async (data) => {
  let score = 0;
  const reasons = [];

  // These functions are synchronous and will execute immediately
  score += name_irregular(data, reasons);
  score += title_irregular(data, reasons);
  score += company_irregular(data, reasons);
  score += phone_irregular(data, reasons);

  // This is the asynchronous function
  const emailScore = await email_validate(data, reasons);
  score += emailScore;

  const isSpam = score >= 2;
  return { isSpam, reasons, score };
};
