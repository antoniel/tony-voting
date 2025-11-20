import { eq } from 'drizzle-orm'
import { db } from './index'
import { Features, newId } from './schema'

const seedFeatures = async () => {
  try {
    console.log('Seeding database with initial features...')

    const seedData = [
      {
        title: 'Dark Mode Support',
        description: 'Add dark mode toggle for better viewing in low-light environments',
        authorName: 'John Doe',
        status: 'open'
      },
      {
        title: 'Mobile App',
        description: 'Create native mobile applications for iOS and Android',
        authorName: 'Jane Smith',
        status: 'open'
      },
      {
        title: 'Advanced Search',
        description: 'Implement advanced search with filters and sorting options',
        authorName: 'Bob Johnson',
        status: 'open'
      }
    ]

    const now = new Date()

    for (const feature of seedData) {
      const existing = await db.select().from(Features).where(eq(Features.title, feature.title)).limit(1)

      if (existing.length === 0) {
        await db.insert(Features).values({
          title: feature.title,
          description: feature.description,
          authorName: feature.authorName,
          status: feature.status,
          createdAt: now,
          updatedAt: now,
          id: newId('feature')
        })
        console.log(`✓ Created feature: ${feature.title}`)
      } else {
        console.log(`→ Feature already exists: ${feature.title}`)
      }
    }

    console.log('✓ Database seeding completed')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedFeatures()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedFeatures }
