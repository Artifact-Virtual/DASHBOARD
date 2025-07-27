
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import PatternLines from '../components/PatternLines';
import Footer from '../components/Footer';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // This would typically fetch from your markdown files
    // For now, we'll simulate with sample data
    const samplePosts: BlogPost[] = [
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
    setPosts(samplePosts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
        <PatternLines />
        <div className="relative z-10">
          <Navigation />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-white/60 font-light tracking-wide">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
      <PatternLines />
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-8 py-16">
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-thin tracking-wider mb-6">
              BLOG
            </h1>
            <p className="text-white/70 font-light tracking-wide text-lg max-w-2xl">
              Insights, thoughts, and explorations in the realm of digital artifacts and virtual experiences.
            </p>
          </div>

          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-white/10 pb-12 last:border-b-0">
                <div
                  className="group block hover:bg-white/[0.02] transition-all duration-300 p-6 -m-6 rounded cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <time className="text-white/50 font-light tracking-wide text-sm uppercase">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  <h2 className="text-3xl md:text-4xl font-thin tracking-wide mt-4 mb-4 group-hover:text-white/90 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-white/70 font-light tracking-wide leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex items-center space-x-2 text-white/60 group-hover:text-white/80 transition-colors">
                    <span className="font-light tracking-wide text-sm">READ MORE</span>
                    <div className="w-0 group-hover:w-8 h-px bg-white/60 transition-all duration-300" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
        
        <Footer />
      </div>
      
      <div className="fixed inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-50 pointer-events-none" />
    </div>
  );
};

export default Blog;
