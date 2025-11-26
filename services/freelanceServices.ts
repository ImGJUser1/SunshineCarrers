// Mock freelance data - replace with actual API calls
const MOCK_GIGS = [
  {
    id: '1',
    title: 'Website Design',
    freelancer: 'Alice Brown',
    category: 'Design',
    price: '$500',
    rating: 4.9,
    description: 'Professional website design services',
    published: true
  },
  {
    id: '2',
    title: 'Mobile App Development',
    freelancer: 'Bob Wilson',
    category: 'Development',
    price: '$1500',
    rating: 4.7,
    description: 'Cross-platform mobile app development',
    published: true
  },
  {
    id: '3',
    title: 'Content Writing',
    freelancer: 'Carol Davis',
    category: 'Writing',
    price: '$200',
    rating: 4.8,
    description: 'SEO-optimized content writing',
    published: false
  }
];

export const getGigs = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_GIGS;
};

export const createGig = async (gigData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newGig = {
    id: Date.now().toString(),
    ...gigData,
    rating: 0,
    published: true
  };
  MOCK_GIGS.push(newGig);
  return newGig;
};

export const updateGig = async (id: string, gigData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_GIGS.findIndex(gig => gig.id === id);
  if (index !== -1) {
    MOCK_GIGS[index] = { ...MOCK_GIGS[index], ...gigData };
    return MOCK_GIGS[index];
  }
  throw new Error('Gig not found');
};

export const deleteGig = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_GIGS.findIndex(gig => gig.id === id);
  if (index !== -1) {
    MOCK_GIGS.splice(index, 1);
    return true;
  }
  throw new Error('Gig not found');
};