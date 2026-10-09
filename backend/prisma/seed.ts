import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const prisma = new PrismaClient();

function parseFloatOrDefault0(val?: string): number {
  if (!val || val.trim() === '') return 0.0;
  const num = parseFloat(val.trim());
  return isNaN(num) ? 0.0 : num;
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

  const BATCH_SIZE = 5000;
  // If SEED_LIMIT is specified > 0, limit to that number. Default 0 means seed ALL 1M+ records.
  const MAX_ROWS = process.env.SEED_LIMIT ? parseInt(process.env.SEED_LIMIT, 10) : 0;

  let batch: any[] = [];
  let totalInserted = 0;
  let isHeader = true;

  const startTime = Date.now();

  try {
    for await (const line of rl) {
      if (isHeader) {
        isHeader = false;
        continue; // Skip header row: sbd,toan,ngu_van,ngoai_ngu,vat_li,hoa_hoc,sinh_hoc,lich_su,dia_li,gdcd,ma_ngoai_ngu
      }

      if (!line.trim()) continue;

      const parts = line.split(',');
      if (parts.length < 11) continue;

      const [sbd, toan, ngu_van, ngoai_ngu, vat_li, hoa_hoc, sinh_hoc, lich_su, dia_li, gdcd, ma_ngoai_ngu] = parts;

      batch.push({
        sbd: sbd.trim(),
        toan: parseFloatOrDefault0(toan),
        ngu_van: parseFloatOrDefault0(ngu_van),
        ngoai_ngu: parseFloatOrDefault0(ngoai_ngu),
        vat_li: parseFloatOrDefault0(vat_li),
        hoa_hoc: parseFloatOrDefault0(hoa_hoc),
        sinh_hoc: parseFloatOrDefault0(sinh_hoc),
        lich_su: parseFloatOrDefault0(lich_su),
        dia_li: parseFloatOrDefault0(dia_li),
        gdcd: parseFloatOrDefault0(gdcd),
        ma_ngoai_ngu: ma_ngoai_ngu?.trim() || null,
      });

      if (batch.length >= BATCH_SIZE) {
        const recordsToInsert = [...batch];
        batch = [];
        await prisma.student.createMany({
          data: recordsToInsert,
          skipDuplicates: true,
        });
        totalInserted += recordsToInsert.length;
        if (totalInserted % 10000 === 0 || MAX_ROWS > 0) {
          console.log(`  └─ Seeded ${totalInserted.toLocaleString()} students...`);
        }
      }

      if (MAX_ROWS > 0 && totalInserted >= MAX_ROWS) {
        console.log(`ℹ️ Reached configured limit of ${MAX_ROWS.toLocaleString()} rows.`);
        rl.close();
        break;
      }
    }
  } catch (err: any) {
    if (err?.code !== 'ERR_USE_AFTER_CLOSE') {
      throw err;
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
    if (e?.code === 'ERR_USE_AFTER_CLOSE') {
      console.log(`✅ Full Seeding Completed Successfully!`);
      process.exit(0);
    }
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
