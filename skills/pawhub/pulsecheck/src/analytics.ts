import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { ConfigManager } from './config.js';
import { format, subDays, subHours, startOfDay, endOfDay } from 'date-fns';

export interface AnalyticsQuery {
  dateRange?: 'today' | 'yesterday' | '7d' | '30d' | 'last-hour';
  metrics?: string[];
  dimensions?: string[];
  limit?: number;
}

export interface AnalyticsResult {
  rows: any[];
  totals?: any;
  summary: string;
}

export class AnalyticsService {
  private client: BetaAnalyticsDataClient;
  private config: ConfigManager;
  private propertyId: string;

  constructor(config: ConfigManager) {
    this.config = config;
    const credentials = config.loadGACredentials();

    this.client = new BetaAnalyticsDataClient({
      credentials
    });

    const propertyId = config.get('gaPropertyId');
    if (!propertyId) {
      throw new Error('Google Analytics Property ID not configured');
    }
    this.propertyId = propertyId;
  }

  async query(query: AnalyticsQuery): Promise<AnalyticsResult> {
    const dateRange = this.parseDateRange(query.dateRange || 'today');
    const metrics = query.metrics || ['activeUsers', 'screenPageViews'];
    const dimensions = query.dimensions || ['pagePath'];

    const [response] = await this.client.runReport({
      property: `properties/${this.propertyId}`,
      dateRanges: [dateRange],
      metrics: metrics.map(m => ({ name: m })),
      dimensions: dimensions.map(d => ({ name: d })),
      limit: query.limit || 10,
      orderBys: [
        {
          metric: { metricName: metrics[0] },
          desc: true
        }
      ]
    });

    const rows = response.rows?.map(row => {
      const result: any = {};
      row.dimensionValues?.forEach((dim, i) => {
        result[dimensions[i]] = dim.value;
      });
      row.metricValues?.forEach((metric, i) => {
        result[metrics[i]] = metric.value;
      });
      return result;
    }) || [];

    const totals = response.totals?.[0]?.metricValues?.reduce((acc, val, i) => {
      acc[metrics[i]] = val.value;
      return acc;
    }, {} as any);

    return {
      rows,
      totals,
      summary: this.generateSummary(rows, totals, query)
    };
  }

  async getTopPages(period: string = 'today', limit: number = 10): Promise<AnalyticsResult> {
    return this.query({
      dateRange: period as any,
      metrics: ['screenPageViews', 'activeUsers'],
      dimensions: ['pagePath'],
      limit
    });
  }

  async getTrafficSources(period: string = 'today'): Promise<AnalyticsResult> {
    return this.query({
      dateRange: period as any,
      metrics: ['activeUsers'],
      dimensions: ['sessionSource'],
      limit: 10
    });
  }

  async getRealtime(): Promise<AnalyticsResult> {
    const [response] = await this.client.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'city' }],
      limit: 10
    });

    const rows = response.rows?.map(row => ({
      city: row.dimensionValues?.[0]?.value,
      activeUsers: row.metricValues?.[0]?.value
    })) || [];

    const total = response.totals?.[0]?.metricValues?.[0]?.value || '0';

    return {
      rows,
      totals: { activeUsers: total },
      summary: `${total} users online right now`
    };
  }

  private parseDateRange(period: string): { startDate: string; endDate: string } {
    const now = new Date();

    switch (period) {
      case 'today':
        return { startDate: 'today', endDate: 'today' };
      case 'yesterday':
        return { startDate: 'yesterday', endDate: 'yesterday' };
      case '7d':
        return { startDate: '7daysAgo', endDate: 'today' };
      case '30d':
        return { startDate: '30daysAgo', endDate: 'today' };
      case 'last-hour':
        return { startDate: 'today', endDate: 'today' };
      default:
        return { startDate: 'today', endDate: 'today' };
    }
  }

  private generateSummary(rows: any[], totals: any, query: AnalyticsQuery): string {
    const period = query.dateRange || 'today';
    const metric = query.metrics?.[0] || 'screenPageViews';
    const total = totals?.[metric] || '0';

    if (rows.length === 0) {
      return `No data for ${period}`;
    }

    const topItem = rows[0];
    return `${total} total ${metric} ${period}. Top: ${topItem.pagePath || topItem.sessionSource} (${topItem[metric]})`;
  }
}
