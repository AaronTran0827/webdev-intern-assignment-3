import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const prisma = new PrismaClient();

function parseFloatOrNull(val?: string): number | null {
  if (!val || val.trim() === '') return null;
  const num = parseFloat(val.trim());
  return isNaN(num) ? null : num;
}

async function seedFromCSV() {
  const possiblePaths = [
    path.resolve(process.cwd(), '../dataset/diem_thi_thpt_2024.csv'),
    path.resolve(process.cwd(), './dataset/diem_thi_thpt_2024.csv'),
  ];

  let csvPath = possiblePaths.find((p) => fs.existsSync(p));

  if (!csvPath) {
    console.error('❌ Could not find diem_thi_thpt_2024.csv in dataset directory.');
    process.exit(1);
  }

  console.log(`🌱 Starting Prisma Full Seeding from CSV: ${csvPath}`);

  const fileStream = fs.createReadStream(csvPath, { encoding: 'utf-8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const BATCH_SIZE = 2000;
  // If SEED_LIMIT is specified > 0, limit to that number. Default 0 means seed ALL 1M+ records.
  const MAX_ROWS = process.env.SEED_LIMIT ? parseInt(process.env.SEED_LIMIT, 10) : 0;

  let batch: any[] = [];
  let totalInserted = 0;
  let lineIndex = 0;

  const startTime = Date.now();

  for await (const line of rl) {
    if (lineIndex === 0) {
      lineIndex++;
      continue; // Skip header row: sbd,toan,ngu_van,ngoai_ngu,vat_li,hoa_hoc,sinh_hoc,lich_su,dia_li,gdcd,ma_ngoai_ngu
    }

    if (!line.trim()) continue;

    const parts = line.split(',');
    if (parts.length < 11) continue;

    const [sbd, toan, ngu_van, ngoai_ngu, vat_li, hoa_hoc, sinh_hoc, lich_su, dia_li, gdcd, ma_ngoai_ngu] = parts;

    batch.push({
      sbd: sbd.trim(),
      toan: parseFloatOrNull(toan),
      ngu_van: parseFloatOrNull(ngu_van),
      ngoai_ngu: parseFloatOrNull(ngoai_ngu),
      vat_li: parseFloatOrNull(vat_li),
      hoa_hoc: parseFloatOrNull(hoa_hoc),
      sinh_hoc: parseFloatOrNull(sinh_hoc),
      lich_su: parseFloatOrNull(lich_su),
      dia_li: parseFloatOrNull(dia_li),
      gdcd: parseFloatOrNull(gdcd),
      ma_ngoai_ngu: ma_ngoai_ngu?.trim() || null,
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.student.createMany({
        data: batch,
        skipDuplicates: true,
      });
      totalInserted += batch.length;
      if (totalInserted % 10000 === 0 || MAX_ROWS > 0) {
        console.log(`  └─ Seeded ${totalInserted.toLocaleString()} students...`);
      }
      batch = [];
    }

    lineIndex++;
    if (MAX_ROWS > 0 && totalInserted >= MAX_ROWS) {
      console.log(`ℹ️ Reached configured limit of ${MAX_ROWS.toLocaleString()} rows.`);
      break;
    }
  }

  // Insert any remaining items in final batch
  if (batch.length > 0) {
    await prisma.student.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalInserted += batch.length;
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Full Seeding Complete! Total: ${totalInserted.toLocaleString()} students inserted in ${durationSec}s.`);
}

seedFromCSV()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
