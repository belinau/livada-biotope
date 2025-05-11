export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  type: 'workshop' | 'lecture' | 'community' | 'other';
}

export const events: Event[] = [
  // Past events
  {
    id: '1',
    title: 'Introduction to Urban Biodiversity',
    description: 'A workshop on identifying and supporting biodiversity in urban environments.',
    date: '2025-04-10T14:00:00',
    location: 'Livada Community Garden',
    type: 'workshop'
  },
  {
    id: '2',
    title: 'Decolonial Composting Methods',
    description: 'Learn about traditional and indigenous composting techniques and their ecological benefits.',
    date: '2025-04-18T16:00:00',
    location: 'Livada Community Garden',
    type: 'workshop'
  },
  {
    id: '3',
    title: 'Environmental Justice Panel Discussion',
    description: 'A panel of local activists discussing environmental justice issues in Ljubljana.',
    date: '2025-04-25T18:00:00',
    location: 'City Library',
    type: 'lecture'
  },
  {
    id: '4',
    title: 'Spring Planting Day',
    description: 'Community event for planting drought-resistant native species in the biotope.',
    date: '2025-05-01T10:00:00',
    location: 'Livada Community Garden',
    type: 'community'
  },
  // Current and upcoming events
  {
    id: '5',
    title: 'Soil Moisture Monitoring Workshop',
    description: 'Learn how to set up and use soil moisture sensors for your garden or farm.',
    date: '2025-05-20T14:00:00',
    location: 'Livada Community Garden',
    type: 'workshop'
  },
  {
    id: '6',
    title: 'Sustainable Irrigation Practices',
    description: 'A lecture on water conservation and sustainable irrigation techniques.',
    date: '2025-05-25T18:00:00',
    location: 'City Library',
    type: 'lecture'
  },
  {
    id: '7',
    title: 'Community Garden Day',
    description: 'Join us for a day of gardening, sharing knowledge, and building community.',
    date: '2025-06-05T10:00:00',
    location: 'Livada Community Garden',
    type: 'community'
  },
  {
    id: '8',
    title: 'Eco-Feminist Reading Group',
    description: 'Monthly reading group discussing eco-feminist literature and practices.',
    date: '2025-06-10T19:00:00',
    location: 'Online (Zoom)',
    type: 'other'
  },
  {
    id: '9',
    title: 'DIY Rainwater Collection Systems',
    description: 'Workshop on building your own rainwater collection system for garden irrigation.',
    date: '2025-06-15T15:00:00',
    location: 'Livada Community Garden',
    type: 'workshop'
  }
];
