// Simple stub for Google Calendar integration (can be expanded)
// In this study project, we will just simulate the behavior. When env vars are present,
// you could wire googleapis OAuth2 flow.

async function syncEvent({ summary, description, start, end, attendees }) {
  // Simulate async sync
  return {
    success: true,
    provider: 'google-calendar-stub',
    event: { summary, description, start, end, attendees },
  };
}

async function deleteEvent({ eventId }) {
  return { success: true, provider: 'google-calendar-stub', eventId };
}

module.exports = { syncEvent, deleteEvent };


