/**
 * API client for communicating with the Atlas Marketing OS backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      // Return error object instead of throwing, allowing components to gracefully handle it
      return { error: errorData.error || errorData.detail || `API Error: ${res.status}` } as any;
    }

    return await res.json();
  } catch (error) {
    console.error(`[Network Error] Failed to fetch ${endpoint}:`, error);
    return { error: "Unable to connect to the server. Please check if the backend is running." } as any;
  }
}

// ─── Customer APIs ────────────────────────────────────────────

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
  joined_at: string;
  total_spent: number;
  total_orders: number;
  last_order_date: string | null;
  health_score: number;
  tags: string[];
  created_at: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  limit: number;
  offset: number;
}

export interface CustomerStats {
  total_customers: number;
  avg_spent: number;
  max_spent: number;
  total_revenue: number;
  total_orders: number;
  frequent_buyers: number;
  dormant_customers: number;
}

export const getCustomers = (params?: Record<string, string | number>) => {
  const query = params ? '?' + new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString() : '';
  return fetchAPI<CustomerListResponse>(`/api/customers${query}`);
};

export const getCustomerStats = () =>
  fetchAPI<CustomerStats>('/api/customers/stats');

export const getCities = () =>
  fetchAPI<string[]>('/api/customers/cities');

export const getCustomer = (id: number) =>
  fetchAPI<Customer & { orders: any[]; category_breakdown: any[] }>(`/api/customers/${id}`);

// ─── Segment APIs ─────────────────────────────────────────────

export interface Segment {
  id: number;
  name: string;
  description: string | null;
  rules_json: any;
  customer_count: number;
  created_by: string;
  created_at: string;
}

export const getSegments = () =>
  fetchAPI<{ segments: Segment[] }>('/api/segments');

export const createSegment = (data: {
  name: string;
  description?: string;
  rules_json?: string;
  customer_ids: number[];
}) => fetchAPI<Segment>('/api/segments', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getSegment = (id: number) =>
  fetchAPI<Segment & { customers: Customer[] }>(`/api/segments/${id}`);

export const deleteSegment = (id: number) =>
  fetchAPI<{ message: string }>(`/api/segments/${id}`, { method: 'DELETE' });

// ─── Campaign APIs ────────────────────────────────────────────

export interface Campaign {
  id: number;
  name: string;
  segment_id: number;
  segment_name?: string;
  message_template: string;
  channel: string;
  status: string;
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  total_opened: number;
  total_clicked: number;
  sent_at: string | null;
  created_at: string;
}

export const getCampaigns = () =>
  fetchAPI<{ campaigns: Campaign[] }>('/api/campaigns');

export const createCampaign = (data: {
  name: string;
  segment_id: number;
  message_template: string;
  channel?: string;
}) => fetchAPI<{ campaign_id: number; name: string; total_sent: number; status: string }>('/api/campaigns', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getCampaign = (id: number) =>
  fetchAPI<Campaign & { communications: any[]; status_breakdown: Record<string, number> }>(`/api/campaigns/${id}`);

// ─── AI APIs ──────────────────────────────────────────────────

export interface AISegmentResponse {
  segment_id: number;
  segment_name: string;
  description: string;
  sql_query: string;
  customer_count: number;
  customer_ids: number[];
  customer_preview: { id: number; name: string }[];
  error?: string;
}

export interface AIMessageResponse {
  message: string;
  subject_line?: string;
  channel_recommendation: string;
  note?: string;
  error?: string;
}

export const aiSegment = (prompt: string) =>
  fetchAPI<AISegmentResponse>('/api/ai/segment', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

export const aiGenerateMessage = (data: {
  segment_id: number;
  campaign_goal: string;
  tone?: string;
}) => fetchAPI<AIMessageResponse>('/api/ai/message', {
  method: 'POST',
  body: JSON.stringify(data),
});

// ─── Analytics APIs ───────────────────────────────────────────

export interface AnalyticsOverview {
  total_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_failed: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
}

export interface AnalyticsResponse {
  overview: AnalyticsOverview;
  campaigns: (Campaign & {
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
    failure_rate: number;
  })[];
  channels: any[];
  engagement: { customers_reached: number; total_communications: number };
  recent_activity: any[];
}

export const getAnalytics = () =>
  fetchAPI<AnalyticsResponse>('/api/analytics');

export const getCampaignAnalytics = (id: number) =>
  fetchAPI<any>(`/api/analytics/campaigns/${id}`);
