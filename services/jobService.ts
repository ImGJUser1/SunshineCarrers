// Mock job data - replace with actual API calls
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    type: 'Remote',
    salary: '$80,000 - $120,000',
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    tags: ['React', 'TypeScript', 'CSS'],
    published: true
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'New York, NY',
    type: 'Hybrid',
    salary: '$100,000 - $140,000',
    description: 'Join our backend team to build scalable APIs and services...',
    tags: ['Node.js', 'Python', 'AWS'],
    published: true
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'CreativeLabs',
    location: 'San Francisco, CA',
    type: 'On-site',
    salary: '$70,000 - $100,000',
    description: 'Design beautiful and intuitive user interfaces for our products...',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    published: false
  }
];

export const getJobs = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_JOBS;
};

export const createJob = async (jobData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newJob = {
    id: Date.now().toString(),
    ...jobData,
    published: true
  };
  MOCK_JOBS.push(newJob);
  return newJob;
};

export const updateJob = async (id: string, jobData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_JOBS.findIndex(job => job.id === id);
  if (index !== -1) {
    MOCK_JOBS[index] = { ...MOCK_JOBS[index], ...jobData };
    return MOCK_JOBS[index];
  }
  throw new Error('Job not found');
};

export const deleteJob = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_JOBS.findIndex(job => job.id === id);
  if (index !== -1) {
    MOCK_JOBS.splice(index, 1);
    return true;
  }
  throw new Error('Job not found');
};