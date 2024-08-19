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
  return false;
}

function strip_non_alpha(text) {
  return text.replace(/[^a-zA-Z\s]/g, '');
}

function strip_non_numerical(string) {
  return string ? string.replace(/[^\d]/g, '') : ''; // Return an empty string if undefined
}

// Spam check functions
// function email_mismatch(data, reasons) {
//   const fn = data.firstname.toLowerCase().trim();
//   const ln = data.lastname.toLowerCase().trim();
//   const email = data.email.toLowerCase();
//   if (!(email.includes(fn) || email.includes(ln))) {
//     reasons.push('Email mismatch with name');
//     return 1; // ISSUE DETECTED
//   }
//   return 0;
// }

// function email_host_irregular(data, reasons) {
//   const email = data.email.toLowerCase(); // someemail@abc.live.com
//   const host = email.split('@')[1].split('.').slice(0, -1).join('.'); // abc.live

//   if (
//     host.length < 3 ||
//     (host.length > 4 && vowels_regex(host).length < 1) ||
//     ['abc', 'asdf', 'qwer'].includes(host)
//   ) {
//     reasons.push('Email host irregular');
//     return 1; // ISSUE DETECTED
//   }
//   return 0; // NO ISSUE DETECTED
// }

// const tlds = [
//   'com',
//   'net',
//   'org',
//   'info',
//   'biz',
//   'edu',
//   'gov',
//   'mil',
//   'int',
//   'name',
//   'pro',
//   'aero',
//   'coop',
//   'museum',
//   'asia',
//   'cat',
//   'jobs',
//   'mobi',
//   'tel',
//   'travel',
//   'xxx',
//   'ac',
//   'ad',
//   'ae',
//   'af',
//   'ag',
//   'ai',
//   'al',
//   'am',
//   'an',
//   'ao',
//   'aq',
//   'ar',
//   'as',
//   'at',
//   'au',
//   'aw',
//   'ax',
//   'az',
//   'ba',
//   'bb',
//   'bd',
//   'be',
//   'bf',
//   'bg',
//   'bh',
//   'bi',
//   'bj',
//   'bm',
//   'bn',
//   'bo',
//   'br',
//   'bs',
//   'bt',
//   'bv',
//   'bw',
//   'by',
//   'bz',
//   'ca',
//   'cc',
//   'cd',
//   'cf',
//   'cg',
//   'ch',
//   'ci',
//   'ck',
//   'cl',
//   'cm',
//   'cn',
//   'co',
//   'cr',
//   'cu',
//   'cv',
//   'cw',
//   'cx',
//   'cy',
//   'cz',
//   'de',
//   'dj',
//   'dk',
//   'dm',
//   'do',
//   'dz',
//   'ec',
//   'ee',
//   'eg',
//   'er',
//   'es',
//   'et',
//   'eu',
//   'fi',
//   'fj',
//   'fk',
//   'fm',
//   'fo',
//   'fr',
//   'ga',
//   'gb',
//   'gd',
//   'ge',
//   'gf',
//   'gg',
//   'gh',
//   'gi',
//   'gl',
//   'gm',
//   'gn',
//   'gp',
//   'gq',
//   'gr',
//   'gs',
//   'gt',
//   'gu',
//   'gw',
//   'gy',
//   'hk',
//   'hm',
//   'hn',
//   'hr',
//   'ht',
//   'hu',
//   'id',
//   'ie',
//   'il',
//   'im',
//   'in',
//   'io',
//   'iq',
//   'ir',
//   'is',
//   'it',
//   'je',
//   'jm',
//   'jo',
//   'jp',
//   'ke',
//   'kg',
//   'kh',
//   'ki',
//   'km',
//   'kn',
//   'kp',
//   'kr',
//   'kw',
//   'ky',
//   'kz',
//   'la',
//   'lb',
//   'lc',
//   'li',
//   'lk',
//   'lr',
//   'ls',
//   'lt',
//   'lu',
//   'lv',
//   'ly',
//   'ma',
//   'mc',
//   'md',
//   'me',
//   'mg',
//   'mh',
//   'mk',
//   'ml',
//   'mm',
//   'mn',
//   'mo',
//   'mp',
//   'mq',
//   'mr',
//   'ms',
//   'mt',
//   'mu',
//   'mv',
//   'mw',
//   'mx',
//   'my',
//   'mz',
//   'na',
//   'nc',
//   'ne',
//   'nf',
//   'ng',
//   'ni',
//   'nl',
//   'no',
//   'np',
//   'nr',
//   'nu',
//   'nz',
//   'om',
//   'pa',
//   'pe',
//   'pf',
//   'pg',
//   'ph',
//   'pk',
//   'pl',
//   'pm',
//   'pn',
//   'pr',
//   'ps',
//   'pt',
//   'pw',
//   'py',
//   'qa',
//   're',
//   'ro',
//   'rs',
//   'ru',
//   'rw',
//   'sa',
//   'sb',
//   'sc',
//   'sd',
//   'se',
//   'sg',
//   'sh',
//   'si',
//   'sj',
//   'sk',
//   'sl',
//   'sm',
//   'sn',
//   'so',
//   'sr',
//   'ss',
//   'st',
//   'sv',
//   'sx',
//   'sy',
//   'sz',
//   'tc',
//   'td',
//   'tf',
//   'tg',
//   'th',
//   'tj',
//   'tk',
//   'tl',
//   'tm',
//   'tn',
//   'to',
//   'tr',
//   'tt',
//   'tv',
//   'tw',
//   'tz',
//   'ua',
//   'ug',
//   'uk',
//   'us',
//   'uy',
//   'uz',
//   'va',
//   'vc',
//   've',
//   'vg',
//   'vi',
//   'vn',
//   'vu',
//   'wf',
//   'ws',
//   'ye',
//   'yt',
//   'za',
//   'zm',
//   'zw',
// ];

// function email_domain_irregular(data, reasons) {
//   const email = data.email.toLowerCase(); // someemail@abc.live.com
//   const domain = email.split('@')[1].split('.').pop(); // com
//   if (!tlds.includes(domain)) {
//     reasons.push('Email domain irregular');
//     return 1; // ISSUE DETECTED
//   }
//   return 0;
// }

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
      return 1;
    }

    const { result: validationResult, reason, score } = result.data;

    if (validationResult === 'undeliverable') {
      reasons.push(`Email validation failed: ${reason}`);
      return 1;
    }

    if (score < 70) {
      reasons.push('Email validation score is too low.');
      return 1;
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
  const title = data.title;
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
  'cfo',
  'chief technology officer',
  'cto',
  'chief information officer',
  'cio',
  'chief marketing officer',
  'cmo',
  'chief human resources officer',
  'chro',
  'chief product officer',
  'cpo',
  'chief legal officer',
  'clo',
  'chief compliance officer',
  'cco',
  'chief strategy officer',
  'cso',
  'chief data officer',
  'cdo',
  'chief customer officer',
  'cco',
  'chief digital officer',
  'cdo',
  'chief security officer',
  'cso',
  'chief experience officer',
  'cxo',
  'chief communications officer',
  'cco',
  'chief sustainability officer',
  'cso',
  'chief supply chain officer',
  'csco',
  'chief risk officer',
  'cro',
  'president',
  'vice president',
  'vp',
  'senior vice president',
  'svp',
  'executive vice president',
  'evp',
  'assistant vice president',
  'avp',
  'managing director',
  'md',
  'general manager',
  'gm',
  'regional manager',
  'regional director',
  'area manager',
  'area director',
  'country manager',
  'country director',
  'global head',
  'global director',
  'head of operations',
  'head of marketing',
  'head of sales',
  'head of finance',
  'head of technology',
  'head of hr',
  'head of product',
  'head of legal',
  'head of compliance',
  'head of communications',
  'head of customer experience',
  'head of strategy',
  'head of data',
  'head of security',
  'head of supply chain',
  'partner',
  'principal',
  'senior partner',
  'associate partner',
  'junior partner',
  'director',
  'associate director',
  'executive director',
  'non-executive director',
  'board member',
  'board chair',
  'chairperson',
  'secretary',
  'treasurer',
  'controller',
  'chief accountant',
  'accounting manager',
  'finance manager',
  'senior manager',
  'associate manager',
  'product manager',
  'project manager',
  'program manager',
  'sales manager',
  'marketing manager',
  'operations manager',
  'business development manager',
  'customer success manager',
  'client services manager',
  'account manager',
  'service manager',
  'technical manager',
  'engineering manager',
  'design manager',
  'creative director',
  'art director',
  'production manager',
  'supply chain manager',
  'quality manager',
  'risk manager',
  'compliance manager',
  'legal manager',
  'policy manager',
  'data manager',
  'technology manager',
  'it manager',
  'security manager',
  'communications manager',
  'public relations manager',
  'media relations manager',
  'human resources manager',
  'talent acquisition manager',
  'recruitment manager',
  'learning and development manager',
  'training manager',
  'health and safety manager',
  'environmental manager',
  'facilities manager',
  'administration manager',
  'logistics manager',
  'inventory manager',
  'procurement manager',
  'purchasing manager',
  'supply chain analyst',
  'financial analyst',
  'business analyst',
  'data analyst',
  'systems analyst',
  'investment analyst',
  'research analyst',
  'market analyst',
  'product analyst',
  'customer analyst',
  'service analyst',
  'sales analyst',
  'marketing analyst',
  'operations analyst',
  'strategy analyst',
  'engineering analyst',
  'creative lead',
  'technical lead',
  'team lead',
  'group leader',
  'senior engineer',
  'lead engineer',
  'principal engineer',
  'staff engineer',
  'software engineer',
  'hardware engineer',
  'network engineer',
  'systems engineer',
  'civil engineer',
  'mechanical engineer',
  'electrical engineer',
  'chemical engineer',
  'industrial engineer',
  'quality engineer',
  'process engineer',
  'design engineer',
  'test engineer',
  'application engineer',
  'sales engineer',
  'marketing specialist',
  'operations specialist',
  'business development specialist',
  'client services specialist',
  'account executive',
  'sales executive',
  'marketing executive',
  'operations executive',
  'customer success executive',
  'business development executive',
  'client services executive',
  'account coordinator',
  'project coordinator',
  'program coordinator',
  'office manager',
  'administrative manager',
  'executive assistant',
  'personal assistant',
  'office assistant',
  'administrative assistant',
  'office coordinator',
  'customer service representative',
  'customer support representative',
  'sales representative',
  'marketing representative',
  'business development representative',
  'client services representative',
  'account representative',
  'service representative',
]);

function title_unknown(data, reasons) {
  const titleTokens = data.title.toLowerCase().split(' ').map(strip_non_alpha);
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

export const checkForSpam = async (data) => {
  let score = 0;
  const reasons = [];

  // These functions are synchronous and will execute immediately
  // score += email_mismatch(data, reasons);
  // score += email_host_irregular(data, reasons);
  // score += email_domain_irregular(data, reasons);
  score += name_irregular(data, reasons);
  score += name_unknown(data, reasons);
  score += title_irregular(data, reasons);
  score += title_unknown(data, reasons);
  score += company_irregular(data, reasons);
  score += phone_irregular(data, reasons);

  // This is the asynchronous function
  const emailScore = await email_validate(data, reasons);
  score += emailScore;

  const isSpam = score > 2;
  return { isSpam, reasons, score };
};
