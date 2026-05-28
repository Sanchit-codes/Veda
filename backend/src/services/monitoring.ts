export interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  timestamp: Date;
}

export const metrics: PerformanceMetrics[] = [];

export function recordMetric(metric: PerformanceMetrics) {
  metrics.push(metric);
  // TODO: send to monitoring service (Datadog, New Relic, etc)
}

export function getAverageResponseTime(endpoint: string): number {
  const endpointMetrics = metrics.filter((m) => m.endpoint === endpoint);
  if (endpointMetrics.length === 0) return 0;
  const sum = endpointMetrics.reduce((acc, m) => acc + m.duration, 0);
  return sum / endpointMetrics.length;
}
