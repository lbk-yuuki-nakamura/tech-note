#!/usr/bin/env node
// Hatena CDN画像をダウンロードしてpublic/images/{slug}/配下に保存し、
// Markdownのリンクをローカルパスに書き換えるスクリプト

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { readdir } from 'fs/promises';

const POSTS_DIR = new URL('../posts/', import.meta.url).pathname;
const PUBLIC_IMAGES_DIR = new URL('../public/images/', import.meta.url).pathname;
const HATENA_PREFIX = 'https://cdn-ak.f.st-hatena.com/images/';

async function downloadImage(url, destPath) {
  if (existsSync(destPath)) {
    console.log(`  skip (exists): ${basename(destPath)}`);
    return true;
  }

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ERROR ${res.status}: ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buf);
  console.log(`  downloaded: ${basename(destPath)}`);
  return true;
}

async function processFile(filePath, slug) {
  const content = readFileSync(filePath, 'utf8');

  // collect all hatena image URLs in this file
  const urlRegex = /https:\/\/cdn-ak\.f\.st-hatena\.com\/images\/[^\s)"\]]+/g;
  const urls = [...new Set(content.match(urlRegex) ?? [])];
  if (urls.length === 0) return;

  console.log(`\n[${slug}] ${urls.length} image(s)`);

  const slugDir = join(PUBLIC_IMAGES_DIR, slug);
  mkdirSync(slugDir, { recursive: true });

  let updated = content;
  for (const url of urls) {
    const filename = basename(url.split('?')[0]);
    const destPath = join(slugDir, filename);
    const ok = await downloadImage(url, destPath);
    if (ok) {
      const localPath = `/images/${slug}/${filename}`;
      // replace all occurrences of this URL
      updated = updated.replaceAll(url, localPath);
    }
  }

  if (updated !== content) {
    writeFileSync(filePath, updated, 'utf8');
    console.log(`  updated markdown`);
  }
}

async function main() {
  const files = (await readdir(POSTS_DIR))
    .filter(f => f.endsWith('.md'))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const filePath = join(POSTS_DIR, file);
    const content = readFileSync(filePath, 'utf8');
    if (!content.includes(HATENA_PREFIX)) continue;
    await processFile(filePath, slug);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
