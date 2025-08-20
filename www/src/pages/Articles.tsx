import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesDatabase, Article } from '../data/articlesDatabase';
import PatternLines from '../components/PatternLines';
import Footer from '../components/Footer';

const topics = [
  { id: 'AI', label: 'AI' },
  { id: 'ML', label: 'Machine Learning' },
  { id: 'Quantum', label: 'Quantum Computing' },
  { id: 'Blockchain', label: 'Blockchain' },
  { id: 'Web3', label: 'Web3' },
];

const Articles = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = articlesDatabase.filter(
    (a) =>
      (!selectedTopic || a.topic === selectedTopic) &&
      (a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.summary.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
      <PatternLines />
      <div className="relative z-10">
        <main className="max-w-5xl mx-auto px-8 py-16">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-thin tracking-wider mb-2">ARTICLES</h1>
              <p className="text-white/70 font-light tracking-wide text-lg max-w-2xl">
                In-depth explorations in AI, ML, Quantum Computing, Blockchain, and Web3.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-4 py-2 text-white font-light focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="flex gap-2 mt-2 md:mt-0">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    className={`px-4 py-2 rounded font-light border transition-all duration-200 text-sm ${selectedTopic === t.id ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-white/5 border-white/20 text-white/70 hover:bg-cyan-800/30 hover:border-cyan-400'}`}
                    onClick={() => setSelectedTopic(selectedTopic === t.id ? null : t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {filtered.length === 0 && (
              <div className="text-white/60 font-light tracking-wide">No articles found.</div>
            )}
            {filtered.map((article) => (
              <article key={article.id} className="border-b border-white/10 pb-12 last:border-b-0">
                <div
                  className="group block hover:bg-white/[0.02] transition-all duration-300 p-6 -m-6 rounded cursor-pointer"
                  onClick={() => navigate(`/articles/${article.slug}`)}
                >
                  <time className="text-white/50 font-light tracking-wide text-sm uppercase">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="text-3xl md:text-4xl font-thin tracking-wide mt-4 mb-4 group-hover:text-white/90 transition-colors">
                    {article.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="bg-cyan-800/30 text-cyan-200 px-2 py-1 rounded text-xs font-light">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/70 font-light tracking-wide leading-relaxed">
                    {article.summary}
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

export default Articles;
