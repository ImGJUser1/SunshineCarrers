import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getPageBySlug } from '../services/firebase';
import { CMSPage } from '../types';
import { Button, Badge } from './ui';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      if (slug) {
        const data = await getPageBySlug(slug);
        setPage(data);
      }
      setLoading(false);
    };
    fetchPage();
  }, [slug]);

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF9500] border-t-transparent rounded-full animate-spin"></div></div>;

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h1 className="text-4xl font-black text-gray-300 mb-4">404</h1>
        <p className="text-gray-500 mb-6">Page not found.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 pl-0 hover:bg-transparent hover:text-[#FF9500]">
        <ArrowLeft size={16}/> Back
      </Button>

      {page.featuredImage && (
        <div className="w-full h-64 md:h-96 rounded-[2rem] overflow-hidden mb-10 shadow-2xl relative">
          <img src={page.featuredImage} alt={page.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      <div className="mb-10 text-center">
        <div className="flex justify-center gap-2 mb-4">
           {!page.published && <Badge color="red">Draft</Badge>}
           <Badge color="orange">{page.id}</Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">{page.title}</h1>
        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm font-medium">
          <span className="flex items-center gap-2"><User size={14}/> Admin</span>
          <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(page.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <article className="prose prose-lg prose-orange max-w-none bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/50 shadow-xl">
        <ReactMarkdown>{page.content}</ReactMarkdown>
      </article>
    </div>
  );
};