import { useState, useEffect } from 'react';
import { HomeData } from '../types';

const MOCK_DATA: HomeData = {
  featuredArticle: {
    id: '1',
    title: 'The Architect of Digital Serenity: A Guide to Minimalism.',
    excerpt: 'Exploring how intentional whitespace and structural hierarchy can transform complex technical documentation into an effortless reading journey for developers and designers alike.',
    category: 'FEATURED INSIGHT',
    date: 'March 24, 2024',
    readTime: '10 min',
    imageUrl: 'https://placehold.co/600x800/1d4ed8/FFF', // Placeholder
    author: {
      name: 'Julian Sterling',
      role: 'Lead Design Systems Architect',
      avatar: 'https://placehold.co/100x100/333/FFF'
    }
  },
  categories: ['All Topics', 'Design Systems', 'Frontend Architecture', 'Next.js Framework', 'UI/UX Psychology', 'Cloud Infrastructure'],
  latestArticles: [
    { id: '2', title: 'Deciphering the Aesthetics of Early Computing Systems.', excerpt: 'How the constraints of the 80s hardware birthed a visual language...', category: 'RETRO TECH', date: 'Yesterday', readTime: '8 min read', imageUrl: 'https://placehold.co/600x400/222/FFF' },
    { id: '3', title: 'The Scalable Blueprint: Micro-Frontends in 2024.', excerpt: 'A technical deep dive into orchestrating independent teams...', category: 'ARCHITECTURE', date: 'March 21, 2024', readTime: '12 min read', imageUrl: 'https://placehold.co/600x400/555/FFF' },
    { id: '4', title: 'The Art of The Curated Newsletter Sidebar.', excerpt: 'Why the secondary information channel is the most critical part...', category: 'EDITORIAL DESIGN', date: 'March 19, 2024', readTime: '5 min read', imageUrl: 'https://placehold.co/600x400/DDD/333' }
  ]
};

// custom hook from ReactQuery
export const useHomeData = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation call (500ms)
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};