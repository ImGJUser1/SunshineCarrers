import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, TextArea, Tabs } from './ui';
import { 
  getFirestoreUsage, 
  getStorageUsage, 
  getAPIRequests, 
  getUserAnalytics,
  toggleBackendConnection,
  getBackendStatus,
  deleteCollectionData,
  deleteStorageData
} from '../services/adminService';
import { 
  BarChart3, 
  Database, 
  Cloud, 
  Activity, 
  Users, 
  Power, 
  Trash2, 
  Download, 
  Upload,
  Plus,
  Edit3,
  Eye,
  Settings,
  TrendingUp,
  FileText,
  Image,
  Video,
  Link,
  UserCheck,
  Globe,
  Briefcase,
  GraduationCap,
  Cpu,
  Handshake
} from 'lucide-react';

export const AdminControlPanel = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [backendConnected, setBackendConnected] = useState(true);
  const [analytics, setAnalytics] = useState({
    firestoreUsage: { size: '0 MB', documents: 0 },
    storageUsage: { size: '0 MB', files: 0 },
    apiRequests: { count: 0, last24h: 0 },
    users: { total: 0, active: 0, newThisMonth: 0 },
    userActivities: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
    checkBackendStatus();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [
        firestoreData,
        storageData,
        apiData,
        userData,
        activities
      ] = await Promise.all([
        getFirestoreUsage(),
        getStorageUsage(),
        getAPIRequests(),
        getUserAnalytics(),
        getUserActivities()
      ]);

      setAnalytics({
        firestoreUsage: firestoreData,
        storageUsage: storageData,
        apiRequests: apiData,
        users: userData,
        userActivities: activities
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBackendStatus = async () => {
    try {
      const status = await getBackendStatus();
      setBackendConnected(status.connected);
    } catch (error) {
      console.error('Error checking backend status:', error);
    }
  };

  const handleBackendToggle = async () => {
    try {
      await toggleBackendConnection(!backendConnected);
      setBackendConnected(!backendConnected);
    } catch (error) {
      console.error('Error toggling backend:', error);
    }
  };

  const handleDeleteFirestoreData = async (collection: string) => {
    if (confirm(`Are you sure you want to delete all data from ${collection}? This action cannot be undone.`)) {
      try {
        await deleteCollectionData(collection);
        await loadAnalytics();
      } catch (error) {
        console.error('Error deleting firestore data:', error);
      }
    }
  };

  const handleDeleteStorageData = async (path: string) => {
    if (confirm(`Are you sure you want to delete all files from ${path}? This action cannot be undone.`)) {
      try {
        await deleteStorageData(path);
        await loadAnalytics();
      } catch (error) {
        console.error('Error deleting storage data:', error);
      }
    }
  };

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'content', name: 'Content Management', icon: FileText },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'system', name: 'System Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-500">Complete platform management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Backend Status:</span>
            <Badge color={backendConnected ? 'green' : 'red'}>
              {backendConnected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
          <Button 
            variant={backendConnected ? 'danger' : 'primary'}
            onClick={handleBackendToggle}
          >
            <Power size={16} className="mr-2" />
            {backendConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs 
        tabs={tabs.map(tab => tab.name)} 
        activeTab={tabs.find(tab => tab.id === activeTab)?.name || 'Analytics'} 
        onChange={(tabName) => {
          const tab = tabs.find(t => t.name === tabName);
          if (tab) setActiveTab(tab.id);
        }} 
      />

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <AnalyticsTab 
          analytics={analytics}
          loading={loading}
          onRefresh={loadAnalytics}
        />
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <ContentManagementTab 
          backendConnected={backendConnected}
        />
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <UserManagementTab 
          users={analytics.users}
          activities={analytics.userActivities}
          loading={loading}
        />
      )}

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <SystemSettingsTab 
          firestoreUsage={analytics.firestoreUsage}
          storageUsage={analytics.storageUsage}
          onDeleteFirestore={handleDeleteFirestoreData}
          onDeleteStorage={handleDeleteStorageData}
        />
      )}
    </div>
  );
};

// Analytics Sub-component
const AnalyticsTab = ({ analytics, loading, onRefresh }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <MetricCard
      title="Firestore Usage"
      value={`${analytics.firestoreUsage.size}`}
      subtitle={`${analytics.firestoreUsage.documents} documents`}
      icon={Database}
      color="blue"
    />
    <MetricCard
      title="Storage Usage"
      value={`${analytics.storageUsage.size}`}
      subtitle={`${analytics.storageUsage.files} files`}
      icon={Cloud}
      color="green"
    />
    <MetricCard
      title="API Requests"
      value={analytics.apiRequests.count.toLocaleString()}
      subtitle={`${analytics.apiRequests.last24h} last 24h`}
      icon={Activity}
      color="orange"
    />
    <MetricCard
      title="Total Users"
      value={analytics.users.total.toLocaleString()}
      subtitle={`${analytics.users.active} active, ${analytics.users.newThisMonth} new this month`}
      icon={Users}
      color="purple"
    />
    
    {/* Recent Activities */}
    <Card className="md:col-span-2 lg:col-span-4 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent User Activities</h3>
        <Button variant="outline" onClick={onRefresh}>
          <TrendingUp size={16} className="mr-2" />
          Refresh
        </Button>
      </div>
      <div className="space-y-3">
        {analytics.userActivities.slice(0, 10).map((activity: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCheck size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// Content Management Sub-component
const ContentManagementTab = ({ backendConnected }: any) => {
  const contentTypes = [
    { 
      name: 'Jobs', 
      icon: Briefcase, 
      description: 'Manage job postings, internships, and career opportunities',
      features: ['Create Posts', 'Excel Upload', 'URL Import', 'Edit/Delete']
    },
    { 
      name: 'Learning', 
      icon: GraduationCap, 
      description: 'Manage courses, tutorials, and educational content',
      features: ['Video Upload', 'Static Posts', 'Image Content', 'Course Management']
    },
    { 
      name: 'Freelance', 
      icon: Handshake, 
      description: 'Manage freelance marketplace and user requests',
      features: ['User Requests', 'Admin Posts', 'Gig Management', 'Approval System']
    },
    { 
      name: 'Study Abroad', 
      icon: Globe, 
      description: 'Manage universities, countries, and study programs',
      features: ['University Data', 'Country Info', 'Program Management', 'Content Updates']
    },
    { 
      name: 'AI Marketplace', 
      icon: Cpu, 
      description: 'Manage AI tools and user access requests',
      features: ['Tool Management', 'User Access', 'Request Handling', 'Restrictions']
    },
    { 
      name: 'Consultants', 
      icon: UserCheck, 
      description: 'Manage consultant profiles and appointments',
      features: ['Profile Management', 'Booking System', 'Verification', 'Reviews']
    }
  ];

  return (
    <div className="space-y-6">
      {!backendConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Backend is disconnected. Content management features are disabled.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentTypes.map((type) => (
          <Card key={type.name} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {type.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                className="flex-1"
                disabled={!backendConnected}
                onClick={() => window.location.href = `/admin/content/${type.name.toLowerCase()}`}
              >
                <Plus size={16} className="mr-2" />
                Manage
              </Button>
              <Button 
                variant="outline"
                disabled={!backendConnected}
                onClick={() => window.location.href = `/admin/content/${type.name.toLowerCase()}/import`}
              >
                <Upload size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// User Management Sub-component
const UserManagementTab = ({ users, activities, loading }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">User Statistics</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Users</span>
          <span className="font-bold">{users.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Active Users</span>
          <span className="font-bold text-green-600">{users.active}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">New This Month</span>
          <span className="font-bold text-blue-600">{users.newThisMonth}</span>
        </div>
      </div>
    </Card>

    <Card className="p-6 lg:col-span-2">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent User Requests</h3>
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          activities.slice(0, 5).map((activity: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.request}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm">Approve</Button>
                <Button variant="outline" size="sm">Reject</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  </div>
);

// System Settings Sub-component
const SystemSettingsTab = ({ firestoreUsage, storageUsage, onDeleteFirestore, onDeleteStorage }: any) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Firestore Data</h4>
            <p className="text-sm text-gray-500">
              {firestoreUsage.size} ({firestoreUsage.documents} documents)
            </p>
          </div>
          <Button 
            variant="danger" 
            onClick={() => onDeleteFirestore('all')}
          >
            <Trash2 size={16} className="mr-2" />
            Clear All
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Storage Data</h4>
            <p className="text-sm text-gray-500">
              {storageUsage.size} ({storageUsage.files} files)
            </p>
          </div>
          <Button 
            variant="danger" 
            onClick={() => onDeleteStorage('all')}
          >
            <Trash2 size={16} className="mr-2" />
            Clear All
          </Button>
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Collection Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['jobs', 'universities', 'countries', 'ai_tools', 'courses', 'freelance_gigs', 'consultants'].map(collection => (
          <div key={collection} className="flex items-center justify-between p-3 border rounded-lg">
            <span className="capitalize">{collection.replace('_', ' ')}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDeleteFirestore(collection)}
            >
              Clear
            </Button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className={`h-12 w-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </Card>
);