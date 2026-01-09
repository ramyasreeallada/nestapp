import { AppDataSource } from '../data-source';
import { seedUsers } from './user.seed';

async function run() {
  await AppDataSource.initialize();
  await seedUsers();
  await AppDataSource.destroy();
}

run();
