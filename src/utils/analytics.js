export function trackEvent(name, payload = {}) {
  const event = {
    name,
    payload,
    timestamp: new Date().toISOString()
  };

  const previousEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
  previousEvents.push(event);
  localStorage.setItem('analyticsEvents', JSON.stringify(previousEvents.slice(-200)));

  if (window.dataLayer) {
    window.dataLayer.push({ event: name, ...payload });
  }
}
