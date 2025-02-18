export type Role = 'Admin' | 'Vertriebsleiter' | 'Vertriebler' | 'Innendienst' | 'Monteur-AC' | 'Monteur-DC' | 'Planer' | 'Geschäftsführer';

export interface Employee {
  id: number;
  personnelNumber: string; // New field for personnel number
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive';
  role: Role;
  avatar?: string;
  performance: {
    deals: number;
    revenue: number;
    commission: number;
    target: number;
    achievement: number;
  };
  statistics: {
    closedDeals: number;
    activeDeals: number;
    successRate: number;
    averageDealValue: number;
    monthlyCommission: number[];
    conversionRate: number;
    receivedLeads: number;
    processedLeads: number;
    projectTypes: {
      largeInstallations: number;
      singleFamilyHomes: number;
      openAreaSystems: number;
      roofLeasing: number;
      electricityContracts: number;
    };
    leadProcessingTime: number;
    customerSatisfaction: number;
  };
  recentActivities: {
    id: number;
    type: 'deal' | 'contact' | 'meeting' | 'note';
    description: string;
    date: string;
  }[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

