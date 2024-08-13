document.addEventListener('DOMContentLoaded', function () {
  function waitForForm() {
    return new Promise((resolve) => {
      const checkForm = setInterval(() => {
        const form = document.querySelector('form[id^="hsForm_"]');
        if (form) {
          clearInterval(checkForm);
          resolve(form);
        }
      }, 100); // Check every 100ms
    });
  }

  waitForForm().then((form) => {
    form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Stop the form from submitting immediately
      event.stopImmediatePropagation();

      // Collect form data
      const formData = new FormData(form);

      // Convert FormData to JSON for spam check
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Perform your spam check
      // Perform your spam check
      try {
        const { isSpam, reasons, score } = await checkForSpam(data);

        if (isSpam) {
          console.log('Spam detected for the following reasons:', reasons);
          alert('This submission appears to be spam.');
          return; // Exit the function to prevent form submission
        }

        console.log('Begin code below isSpam if condition');
        // If not spam, create an XMLHttpRequest to submit the form data
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );

        // Convert the form data back to URL-encoded string
        const urlEncodedData = new URLSearchParams(formData).toString();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            alert('Form submitted successfully!');
            form.reset(); // Optional: reset the form after successful submission
          }
        };

        xhr.send(urlEncodedData);
      } catch (error) {
        console.error('Error during spam check:', error);
      }
    });
  });
});

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
  return false;
}

function strip_non_alpha(text) {
  return text.replace(/[^a-zA-Z\s]/g, '');
}

function strip_non_numerical(string) {
  return string.replace(/[^\d]/g, '');
}

// Spam check functions
function email_mismatch(data, reasons) {
  const fn = data.firstname.toLowerCase().trim();
  const ln = data.lastname.toLowerCase().trim();
  const email = data.email.toLowerCase();
  if (!(email.includes(fn) || email.includes(ln))) {
    reasons.push('Email mismatch with name');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

function email_host_irregular(data, reasons) {
  const email = data.email.toLowerCase(); // someemail@abc.live.com
  const host = email.split('@')[1].split('.').slice(0, -1).join('.'); // abc.live

  if (
    host.length < 3 ||
    (host.length > 4 && vowels_regex(host).length < 1) ||
    ['abc', 'asdf', 'qwer'].includes(host)
  ) {
    reasons.push('Email host irregular');
    return 1; // ISSUE DETECTED
  }
  return 0; // NO ISSUE DETECTED
}

const tlds = [
  'com',
  'net',
  'org',
  'info',
  'biz',
  'edu',
  'gov',
  'mil',
  'int',
  'name',
  'pro',
  'aero',
  'coop',
  'museum',
  'asia',
  'cat',
  'jobs',
  'mobi',
  'tel',
  'travel',
  'xxx',
  'ac',
  'ad',
  'ae',
  'af',
  'ag',
  'ai',
  'al',
  'am',
  'an',
  'ao',
  'aq',
  'ar',
  'as',
  'at',
  'au',
  'aw',
  'ax',
  'az',
  'ba',
  'bb',
  'bd',
  'be',
  'bf',
  'bg',
  'bh',
  'bi',
  'bj',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'bt',
  'bv',
  'bw',
  'by',
  'bz',
  'ca',
  'cc',
  'cd',
  'cf',
  'cg',
  'ch',
  'ci',
  'ck',
  'cl',
  'cm',
  'cn',
  'co',
  'cr',
  'cu',
  'cv',
  'cw',
  'cx',
  'cy',
  'cz',
  'de',
  'dj',
  'dk',
  'dm',
  'do',
  'dz',
  'ec',
  'ee',
  'eg',
  'er',
  'es',
  'et',
  'eu',
  'fi',
  'fj',
  'fk',
  'fm',
  'fo',
  'fr',
  'ga',
  'gb',
  'gd',
  'ge',
  'gf',
  'gg',
  'gh',
  'gi',
  'gl',
  'gm',
  'gn',
  'gp',
  'gq',
  'gr',
  'gs',
  'gt',
  'gu',
  'gw',
  'gy',
  'hk',
  'hm',
  'hn',
  'hr',
  'ht',
  'hu',
  'id',
  'ie',
  'il',
  'im',
  'in',
  'io',
  'iq',
  'ir',
  'is',
  'it',
  'je',
  'jm',
  'jo',
  'jp',
  'ke',
  'kg',
  'kh',
  'ki',
  'km',
  'kn',
  'kp',
  'kr',
  'kw',
  'ky',
  'kz',
  'la',
  'lb',
  'lc',
  'li',
  'lk',
  'lr',
  'ls',
  'lt',
  'lu',
  'lv',
  'ly',
  'ma',
  'mc',
  'md',
  'me',
  'mg',
  'mh',
  'mk',
  'ml',
  'mm',
  'mn',
  'mo',
  'mp',
  'mq',
  'mr',
  'ms',
  'mt',
  'mu',
  'mv',
  'mw',
  'mx',
  'my',
  'mz',
  'na',
  'nc',
  'ne',
  'nf',
  'ng',
  'ni',
  'nl',
  'no',
  'np',
  'nr',
  'nu',
  'nz',
  'om',
  'pa',
  'pe',
  'pf',
  'pg',
  'ph',
  'pk',
  'pl',
  'pm',
  'pn',
  'pr',
  'ps',
  'pt',
  'pw',
  'py',
  'qa',
  're',
  'ro',
  'rs',
  'ru',
  'rw',
  'sa',
  'sb',
  'sc',
  'sd',
  'se',
  'sg',
  'sh',
  'si',
  'sj',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sr',
  'ss',
  'st',
  'sv',
  'sx',
  'sy',
  'sz',
  'tc',
  'td',
  'tf',
  'tg',
  'th',
  'tj',
  'tk',
  'tl',
  'tm',
  'tn',
  'to',
  'tr',
  'tt',
  'tv',
  'tw',
  'tz',
  'ua',
  'ug',
  'uk',
  'us',
  'uy',
  'uz',
  'va',
  'vc',
  've',
  'vg',
  'vi',
  'vn',
  'vu',
  'wf',
  'ws',
  'ye',
  'yt',
  'za',
  'zm',
  'zw',
];

function email_domain_irregular(data, reasons) {
  const email = data.email.toLowerCase(); // someemail@abc.live.com
  const domain = email.split('@')[1].split('.').pop(); // com
  if (!tlds.includes(domain)) {
    reasons.push('Email domain irregular');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

function name_irregular(data, reasons) {
  const fn = data.firstname.toLowerCase().trim();
  const ln = data.lastname.toLowerCase().trim();
  if ((fn.length && is_irregular(fn)) || (ln.length && is_irregular(ln))) {
    reasons.push('Name irregular');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

const names = new Set([
  'john',
  'jane',
  'michael',
  'emily',
  'joshua',
  'samantha' /* Add more known names here */,
]);

function name_unknown(data, reasons) {
  const fn = data.firstname.toLowerCase().trim();
  const ln = data.lastname.toLowerCase().trim();
  const tokens = [...fn.split(' '), ...ln.split(' ')];
  if (!tokens.some((tok) => names.has(tok))) {
    reasons.push('Name unknown');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

function title_irregular(data, reasons) {
  const title = data.jobtitle;
  if (title.length && is_irregular(title)) {
    reasons.push('Title irregular');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

const corporate_titles = new Set([
  'chief executive officer',
  'ceo',
  'chief operating officer',
  'coo',
  'chief financial officer',
  'cfo' /* Add more corporate titles here */,
]);

function title_unknown(data, reasons) {
  const titleTokens = data.jobtitle
    .toLowerCase()
    .split(' ')
    .map(strip_non_alpha);
  if (!titleTokens.some((token) => corporate_titles.has(token))) {
    reasons.push('Title unknown');
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

function company_irregular(data, reasons) {
  const company = strip_non_alpha(data.company.toLowerCase().trim());
  if (company.length && is_irregular(company)) {
    reasons.push('Company irregular');
    return 1; // ISSUE DETECTED
  }
  return 0;
}

function checkForSpam(data) {
  return new Promise((resolve) => {
    let score = 0;
    const reasons = [];

    score += email_mismatch(data, reasons);
    score += email_host_irregular(data, reasons);
    score += email_domain_irregular(data, reasons);
    score += name_irregular(data, reasons);
    score += name_unknown(data, reasons);
    score += title_irregular(data, reasons);
    score += title_unknown(data, reasons);
    score += company_irregular(data, reasons);

    const isSpam = score > 2;
    resolve({ isSpam, reasons, score });
  });
}
