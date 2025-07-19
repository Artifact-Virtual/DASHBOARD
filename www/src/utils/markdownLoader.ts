
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const getAllPosts = async (): Promise<BlogPost[]> => {
  // For now, return sample data
  // In production, this would read from markdown files
  return [
    {
      slug: "virtual-reality-future",
      title: "The Future of Virtual Reality",
      date: "2024-06-15",
      excerpt: "Exploring the cutting-edge developments in VR technology and their implications for digital experiences.",
      content: "# The Future of Virtual Reality\n\nVirtual reality is evolving..."
    },
    {
      slug: "artifact-design-principles",
      title: "Design Principles for Digital Artifacts",
      date: "2024-06-10",
      excerpt: "Understanding the core principles that drive exceptional digital design and user experiences.",
      content: "# Design Principles\n\nGreat design starts with understanding..."
    }
  ];
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
};
