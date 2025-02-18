export interface Deal {
  id: string;
  name: string;
  value: number;
  contactId: string;
  description: string;
  status: string;
  paymentStatus: {
    invoiced: number;
    paid: number;
  };
  lastPaymentDate?: string;
}

export interface Stage {
  id: string;
  name: string;
  deals: Deal[];
}

export interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

export interface PipelineCategory {
  id: string;
  name: string;
  pipelines: Pipeline[];
}

