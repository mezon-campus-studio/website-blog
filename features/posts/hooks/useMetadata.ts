export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Technology', description: 'Latest in tech' },
  { id: '2', name: 'Lifestyle', description: 'Daily life and more' },
  { id: '3', name: 'Design', description: 'Art and aesthetics' },
  { id: '4', name: 'Productivity', description: 'Work smarter' },
];

export const MOCK_TAGS: Tag[] = [
  { id: '1', name: 'Next.js' },
  { id: '2', name: 'React' },
  { id: '3', name: 'Tailwind' },
  { id: '4', name: 'AI' },
  { id: '5', name: 'Frontend' },
  { id: '6', name: 'Backend' },
];

export const useCategories = () => {
  return {
    data: MOCK_CATEGORIES,
    isLoading: false,
  };
};

export const useTags = () => {
  return {
    data: MOCK_TAGS,
    isLoading: false,
  };
};
