import React, { useState, useEffect } from 'react';
import { Card, Button, Input, TextArea, Badge, Table } from './ui';
import { Plus, Edit3, Trash2, Upload, Link, Download } from 'lucide-react';

// Import the service functions
import { getJobs, createJob, updateJob, deleteJob } from '../services/jobService';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/learningService';
import { getGigs, createGig, updateGig, deleteGig } from '../services/freelanceServices';

export const ContentManager = ({ contentType, onDataChange }: any) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadItems();
  }, [contentType]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchContent(contentType);
      setItems(data);
    } catch (error) {
      console.error(`Error loading ${contentType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (type: string) => {
    switch (type) {
      case 'jobs':
        return await getJobs();
      case 'learning':
        return await getCourses();
      case 'freelance':
        return await getGigs();
      default:
        return [];
    }
  };

  // Generic CRUD functions
  const createItem = async (type: string, data: any) => {
    switch (type) {
      case 'jobs':
        return await createJob(data);
      case 'learning':
        return await createCourse(data);
      case 'freelance':
        return await createGig(data);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  const updateItem = async (type: string, id: string, data: any) => {
    switch (type) {
      case 'jobs':
        return await updateJob(id, data);
      case 'learning':
        return await updateCourse(id, data);
      case 'freelance':
        return await updateGig(id, data);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  const deleteItem = async (type: string, id: string) => {
    switch (type) {
      case 'jobs':
        return await deleteJob(id);
      case 'learning':
        return await deleteCourse(id);
      case 'freelance':
        return await deleteGig(id);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem(contentType, editingItem.id, formData);
      } else {
        await createItem(contentType, formData);
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      await loadItems();
      onDataChange?.();
    } catch (error) {
      console.error(`Error saving ${contentType}:`, error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this ${contentType.slice(0, -1)}?`)) {
      try {
        await deleteItem(contentType, id);
        await loadItems();
        onDataChange?.();
      } catch (error) {
        console.error(`Error deleting ${contentType}:`, error);
      }
    }
  };

  const handleImport = async (type: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/admin/import/${contentType}/${type}`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        await loadItems();
        onDataChange?.();
      }
    } catch (error) {
      console.error(`Error importing ${contentType}:`, error);
    }
  };

  const renderForm = () => {
    const fields = getFormFields(contentType);
    
    return (
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">
          {editingItem ? `Edit ${contentType.slice(0, -1)}` : `Create New ${contentType.slice(0, -1)}`}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field: any) => (
            <div key={field.name}>
              {field.type === 'textarea' ? (
                <TextArea
                  label={field.label}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <div>
                  <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option: string) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  label={field.label}
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              {editingItem ? 'Update' : 'Create'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData({});
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const getFormFields = (type: string) => {
    switch (type) {
      case 'jobs':
        return [
          { name: 'title', label: 'Job Title', type: 'text', required: true },
          { name: 'company', label: 'Company', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'type', label: 'Job Type', type: 'select', options: ['Remote', 'On-site', 'Hybrid'], required: true },
          { name: 'salary', label: 'Salary Range', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'tags', label: 'Tags (comma separated)', type: 'text', required: false }
        ];
      case 'learning':
        return [
          { name: 'title', label: 'Course Title', type: 'text', required: true },
          { name: 'instructor', label: 'Instructor', type: 'text', required: true },
          { name: 'duration', label: 'Duration', type: 'text', required: true },
          { name: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true }
        ];
      case 'freelance':
        return [
          { name: 'title', label: 'Gig Title', type: 'text', required: true },
          { name: 'freelancer', label: 'Freelancer Name', type: 'text', required: true },
          { name: 'category', label: 'Category', type: 'select', options: ['Design', 'Development', 'Writing', 'Marketing'], required: true },
          { name: 'price', label: 'Price', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true }
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Manage {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
        </h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" />
            Add New
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport('excel', file);
              }}
            />
            <Button variant="outline">
              <Upload size={16} className="mr-2" />
              Import Excel
            </Button>
          </label>
          <Button variant="outline">
            <Link size={16} className="mr-2" />
            Import from URL
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && renderForm()}

      {/* Data Table */}
      <Card className="overflow-hidden">
        <Table headers={[...getTableHeaders(contentType), 'Actions']}>
          {items.map((item: any) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              {getTableCells(contentType, item).map((cell, index) => (
                <td key={index} className="px-6 py-4">
                  {cell}
                </td>
              ))}
              <td className="px-6 py-4 flex gap-2">
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-blue-600"
                  onClick={() => {
                    setEditingItem(item);
                    setFormData(item);
                    setShowForm(true);
                  }}
                >
                  <Edit3 size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-600"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};

const getTableHeaders = (contentType: string) => {
  switch (contentType) {
    case 'jobs':
      return ['Title', 'Company', 'Location', 'Type', 'Salary', 'Status'];
    case 'learning':
      return ['Title', 'Instructor', 'Duration', 'Level', 'Rating', 'Status'];
    case 'freelance':
      return ['Title', 'Freelancer', 'Category', 'Price', 'Rating', 'Status'];
    default:
      return ['Name', 'Description', 'Status'];
  }
};

const getTableCells = (contentType: string, item: any) => {
  switch (contentType) {
    case 'jobs':
      return [
        <span className="font-medium">{item.title}</span>,
        <span className="text-gray-600">{item.company}</span>,
        <span className="text-gray-600">{item.location}</span>,
        <Badge color={item.type === 'Remote' ? 'green' : 'blue'}>{item.type}</Badge>,
        <span className="font-medium">{item.salary}</span>,
        <Badge color={item.published ? 'green' : 'gray'}>{item.published ? 'Active' : 'Draft'}</Badge>
      ];
    case 'learning':
      return [
        <span className="font-medium">{item.title}</span>,
        <span className="text-gray-600">{item.instructor}</span>,
        <span className="text-gray-600">{item.duration}</span>,
        <Badge color="purple">{item.level}</Badge>,
        <span className="font-medium">⭐ {item.rating}</span>,
        <Badge color={item.published ? 'green' : 'gray'}>{item.published ? 'Active' : 'Draft'}</Badge>
      ];
    case 'freelance':
      return [
        <span className="font-medium">{item.title}</span>,
        <span className="text-gray-600">{item.freelancer}</span>,
        <Badge color="blue">{item.category}</Badge>,
        <span className="font-medium">{item.price}</span>,
        <span className="font-medium">⭐ {item.rating}</span>,
        <Badge color={item.published ? 'green' : 'gray'}>{item.published ? 'Active' : 'Draft'}</Badge>
      ];
    default:
      return [
        <span className="font-medium">{item.name || item.title}</span>,
        <span className="text-gray-600">{item.description}</span>,
        <Badge color={item.published ? 'green' : 'gray'}>{item.published ? 'Active' : 'Draft'}</Badge>
      ];
  }
};