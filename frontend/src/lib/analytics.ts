export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;
  // TODO: integrate with analytics provider (Mixpanel, PostHog, etc)
  console.log(`[Analytics] ${name}`, properties);
}

export function trackPageView(path: string) {
  trackEvent("page_view", { path });
}

export function trackError(error: Error) {
  trackEvent("error", { message: error.message, stack: error.stack });
}
