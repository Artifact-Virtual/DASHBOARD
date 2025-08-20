import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PatternLines from '../components/PatternLines';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { articlesDatabase } from '../data/articlesDatabase';

const ArticlePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const article = articlesDatabase.find((a) => a.slug === slug);
      setPost(article || null);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
        <PatternLines />
        <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
          <div className="text-white/60 font-light tracking-wide">Loading...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
        <PatternLines />
        <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
          <div className="text-white/60 font-light tracking-wide">Article not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
      <PatternLines />
      <div className="relative z-10">
        <main className="max-w-4xl mx-auto px-8 py-16">
          <Link
            to="/articles"
            className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-light tracking-wide mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Articles</span>
          </Link>
          <article className="prose prose-invert max-w-none">
            <header className="mb-12">
              <time className="text-white/50 font-light tracking-wide text-sm uppercase">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <h1 className="text-4xl md:text-6xl font-thin tracking-wider mt-4 mb-0">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="bg-cyan-800/30 text-cyan-200 px-2 py-1 rounded text-xs font-light">
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </article>
        </main>
        <Footer />
      </div>
      <div className="fixed inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-50 pointer-events-none" />
    </div>
  );
};

export default ArticlePost;
