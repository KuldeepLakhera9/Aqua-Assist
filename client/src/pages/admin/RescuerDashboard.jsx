import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Phone, Users, MapPin, MessageSquare, Truck, CheckCircle, AlertTriangle } from 'lucide-react';

import EmergencyCallsList from '../../components/Admin/EmergencyCallsList';
import RescueTeamList from '../../components/Admin/RescueTeamList';
import ResourceMap from '../../components/Admin/ResourceMap';
import CommunicationPanel from '../../components/Admin/CommunicationPanel';
import DashboardStats from '../../components/Admin/DashboardStats';

const RescuerDashboard = () => {
  const [activeTab, setActiveTab] = useState('emergency');

  const { data: dashboardStats } = useQuery({
    queryKey: ['rescuerStats'],
    queryFn: () => ({
      activeEmergencies: 5,
      availableTeams: 8,
      ongoingRescues: 3,
      completedRescues: 42
    })
  });

  const tabs = [
    { id: 'emergency', name: 'Emergency Calls', icon: Phone },
    { id: 'teams', name: 'Rescue Teams', icon: Users },
    { id: 'resources', name: 'Resource Planning', icon: Truck },
    { id: 'communication', name: 'Communication', icon: MessageSquare }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'emergency':
        return <EmergencyCallsList />;
      case 'teams':
        return <RescueTeamList />;
      case 'resources':
        return <ResourceMap />;
      case 'communication':
        return <CommunicationPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full text-app-text transition-colors space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-app-text">Rescuer Situation Room</h1>
        <p className="mt-1 text-sm text-app-muted">Tactical search-and-rescue field dispatch and life-safety operations</p>
      </div>

      {/* Stats Overview */}
      <div>
        <DashboardStats
          stats={[
            {
              name: 'Critical Calls',
              value: dashboardStats?.activeEmergencies || 0,
              icon: AlertTriangle,
              color: 'bg-rose-600'
            },
            {
              name: 'Available Teams',
              value: dashboardStats?.availableTeams || 0,
              icon: Users,
              color: 'bg-primary-600'
            },
            {
              name: 'Active Missions',
              value: dashboardStats?.ongoingRescues || 0,
              icon: Truck,
              color: 'bg-amber-600'
            },
            {
              name: 'Evacuations Completed',
              value: dashboardStats?.completedRescues || 0,
              icon: CheckCircle,
              color: 'bg-emerald-600'
            }
          ]}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-app-border">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-3.5 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:border-sky-400 dark:text-sky-400 font-semibold'
                  : 'border-transparent text-app-muted hover:text-app-text hover:border-app-border'}
              `}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RescuerDashboard;