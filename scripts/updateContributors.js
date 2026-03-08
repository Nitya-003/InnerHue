const fs = require('fs/promises');
const path = require('path');

const REPO_OWNER = 'Nitya-003';
const REPO_NAME = 'InnerHue';
const DATA_DIR = path.join(process.cwd(), 'data');
const OUT_FILE = path.join(DATA_DIR, 'contributors.json');

function safeParseCSV(csv) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((ln) => {
    const cols = ln.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ? cols[i].trim() : '';
    });
    return obj;
  });
}

async function fetchWithAuth(url) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Read optional CSV extras
  const csvPath = path.join(DATA_DIR, 'contributors.csv');
  let csvExtras = [];
  try {
    const csvRaw = await fs.readFile(csvPath, 'utf-8');
    csvExtras = safeParseCSV(csvRaw);
  } catch (e) {
    // no CSV provided — that's fine
  }

  // Fetch contributors list
  const listUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100&anon=0`;
  const contributors = await fetchWithAuth(listUrl);

  // Fetch details in parallel (bounded concurrency could be added)
  const detailed = await Promise.all(
    contributors.map(async (c) => {
      try {
        const user = await fetchWithAuth(`https://api.github.com/users/${c.login}`);
        const extra = csvExtras.find((r) => (r.login || r.Login || r.username) === c.login) || {};
        return {
          login: c.login,
          id: c.id,
          avatar_url: c.avatar_url,
          html_url: c.html_url,
          contributions: c.contributions || 0,
          name: user.name ?? null,
          bio: user.bio ?? null,
          blog: user.blog ?? null,
          twitter_username: user.twitter_username ?? null,
          location: user.location ?? null,
          public_repos: user.public_repos ?? 0,
          followers: user.followers ?? 0,
          // merge any CSV fields
          ...(extra && extra !== {} ? extra : {}),
        };
      } catch (e) {
        return {
          login: c.login,
          id: c.id,
          avatar_url: c.avatar_url,
          html_url: c.html_url,
          contributions: c.contributions || 0,
        };
      }
    })
  );

  await fs.writeFile(OUT_FILE, JSON.stringify(detailed, null, 2), 'utf-8');
  console.log('Wrote', OUT_FILE);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
