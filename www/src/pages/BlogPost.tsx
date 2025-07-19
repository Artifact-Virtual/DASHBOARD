
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navigation from '../components/Navigation';
import PatternLines from '../components/PatternLines';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

interface BlogPostData {
  title: string;
  date: string;
  content: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would typically fetch the markdown file based on slug
    // For now, we'll simulate with sample data
    const samplePost: BlogPostData = {
      title: "The Future of Virtual Reality",
      date: "2024-06-15",
      content: `# The Future of Virtual Reality

Virtual reality technology has evolved dramatically over the past decade, transforming from a niche gaming peripheral into a comprehensive platform for digital experiences.

## Current State of VR

The landscape of virtual reality is more diverse than ever:

- **Hardware Innovation**: Lighter headsets with higher resolutions
- **Software Ecosystems**: Robust development platforms and tools
- **Content Creation**: Professional-grade experiences across industries

### Key Developments

The integration of AI and machine learning has opened new possibilities for adaptive virtual environments that respond to user behavior and preferences.

## Looking Forward

As we advance into the next era of digital interaction, several trends are emerging:

1. **Haptic Feedback Evolution**
2. **Social VR Platforms**
3. **Enterprise Applications**

> "The future of VR lies not in replacing reality, but in augmenting our capabilities within it."

## Technical Considerations

\`\`\`javascript
// Example VR scene initialization
const scene = new VRScene({
  environment: 'immersive',
  tracking: '6DOF',
  resolution: '4K'
});
\`\`\`

The convergence of virtual and physical spaces represents the next frontier in human-computer interaction.`
    };
    
    setPost(samplePost);
    setLoading(false);
  }, [slug]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
        <PatternLines />
        <div className="relative z-10">
          <Navigation />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-white/60 font-light tracking-wide">Post not found</div>
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
          <Link 
            to="/blog"
            className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-light tracking-wide mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>

          <article className="prose prose-invert max-w-none">
            <header className="mb-12">
              <time className="text-white/50 font-light tracking-wide text-sm uppercase">
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              
              <h1 className="text-4xl md:text-6xl font-thin tracking-wider mt-4 mb-0">
                {post.title}
              </h1>
            </header>

            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-thin tracking-wide text-white mt-12 mb-8 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-thin tracking-wide text-white mt-10 mb-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-light tracking-wide text-white mt-8 mb-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-white/80 font-light leading-relaxed mb-6 tracking-wide">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-white/20 pl-6 my-8 text-white/70 font-light italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ node, inline, className, children, ...props }: any) => 
                    inline ? (
                      <code className="bg-white/10 text-white px-2 py-1 rounded font-mono text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-white/5 p-6 rounded border border-white/10 overflow-x-auto my-6">
                        <code className="font-mono text-sm text-white/90" {...props}>{children}</code>
                      </pre>
                    ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-6 text-white/80">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 mb-6 text-white/80 list-decimal list-inside">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="font-light tracking-wide">{children}</li>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </main>
        
        <Footer />
      </div>
      
      <div className="fixed inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-50 pointer-events-none" />
    </div>
  );
};

export default BlogPost;
