import { AppDataSource } from '../data-source';
import { User } from '../../users/user.entity';

export async function seedUsers() {
  try {
    const userRepo = AppDataSource.getRepository(User);

    // Optional: clear existing users
    await userRepo.clear();

    // Plain user objects
    const users = [
      { first_name: 'Admin', last_name: 'User', email: 'admin@test.com', password: 'admin123' },
      { first_name: 'John', last_name: 'Doe', email: 'john@test.com', password: 'john123' },
      { first_name: 'Jane', last_name: 'Smith', email: 'jane@test.com', password: 'jane123' },
    ];

    // Convert plain objects to entity instances → triggers @BeforeInsert()
    const userEntities = userRepo.create(users);

    // Save entities to DB
    await userRepo.save(userEntities);

    console.log('✅ Users seeded successfully with encrypted passwords');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}
