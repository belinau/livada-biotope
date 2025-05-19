export interface Instructable {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string;
  materials: string[];
  tools: string[];
  steps: {
    title: string;
    content: string;
    image?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  relatedInstructables?: string[];
}
