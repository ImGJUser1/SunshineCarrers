// Mock learning data - replace with actual API calls
const MOCK_COURSES = [
  {
    id: '1',
    title: 'React Masterclass',
    instructor: 'John Doe',
    duration: '12 hours',
    level: 'Intermediate',
    description: 'Learn React from basics to advanced concepts',
    rating: 4.8,
    published: true
  },
  {
    id: '2',
    title: 'Node.js Fundamentals',
    instructor: 'Jane Smith',
    duration: '8 hours',
    level: 'Beginner',
    description: 'Build server-side applications with Node.js',
    rating: 4.5,
    published: true
  },
  {
    id: '3',
    title: 'Advanced TypeScript',
    instructor: 'Mike Johnson',
    duration: '10 hours',
    level: 'Advanced',
    description: 'Master TypeScript for large-scale applications',
    rating: 4.9,
    published: false
  }
];

export const getCourses = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_COURSES;
};

export const createCourse = async (courseData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newCourse = {
    id: Date.now().toString(),
    ...courseData,
    rating: 0,
    published: true
  };
  MOCK_COURSES.push(newCourse);
  return newCourse;
};

export const updateCourse = async (id: string, courseData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_COURSES.findIndex(course => course.id === id);
  if (index !== -1) {
    MOCK_COURSES[index] = { ...MOCK_COURSES[index], ...courseData };
    return MOCK_COURSES[index];
  }
  throw new Error('Course not found');
};

export const deleteCourse = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_COURSES.findIndex(course => course.id === id);
  if (index !== -1) {
    MOCK_COURSES.splice(index, 1);
    return true;
  }
  throw new Error('Course not found');
};