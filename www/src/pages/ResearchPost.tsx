
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navigation from '../components/Navigation';
import PatternLines from '../components/PatternLines';
import Footer from '../components/Footer';
import TechnicalDiagram from '../components/TechnicalDiagram';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { getArticleBySlug, ResearchArticle } from '../data/researchDatabase';

const ResearchPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<ResearchArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const article = getArticleBySlug(slug);
      setPost(article || null);
    }
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
            <div className="text-white/60 font-light tracking-wide">Research not found</div>
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
            to="/research"
            className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-light tracking-wide mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Research</span>
          </Link>

          <article className="prose prose-invert max-w-none">
            <header className="mb-12">
              <div className="flex items-center space-x-6 text-white/50 font-light tracking-wide text-sm uppercase mb-6">
                <time>
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-thin tracking-wider mb-6">
                {post.title}
              </h1>
              
              <p className="text-xl text-white/70 font-light leading-relaxed mb-8">
                {post.summary}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-light tracking-wide"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </header>

            {/* Technical Diagrams */}
            {post.diagrams && post.diagrams.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-thin tracking-wide text-white mb-8">Technical Architecture</h2>
                {post.diagrams.map((diagram, index) => (
                  <TechnicalDiagram
                    key={index}
                    title={diagram.title}
                    description={diagram.description}
                    nodes={diagram.nodes}
                    connections={diagram.connections}
                  />
                ))}
              </section>
            )}

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
                  code: (props: {inline?: boolean; className?: string; children: React.ReactNode} & Record<string, unknown>) => {
                    const { inline, className, children, ...rest } = props;
                    return inline ? (
                      <code className="bg-white/10 text-white px-2 py-1 rounded font-mono text-sm" {...rest}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-white/5 p-6 rounded border border-white/10 overflow-x-auto my-6">
                        <code className="font-mono text-sm text-white/90" {...rest}>{children}</code>
                      </pre>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-6 text-white/80 list-disc list-inside">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 mb-6 text-white/80 list-decimal list-inside">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => {
                    // This component should only be rendered within ul/ol contexts
                    // The parent ul/ol provides the list styling
                    return <span className="font-light tracking-wide pl-2">{children}</span>;
                  },
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border border-white/10 rounded">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-white/10 bg-white/5 px-4 py-2 text-left font-light text-white">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-white/10 px-4 py-2 text-white/80 font-light">
                      {children}
                    </td>
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

export default ResearchPost;
