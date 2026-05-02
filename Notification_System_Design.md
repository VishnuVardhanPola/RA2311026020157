# Stage 1 - Notification System Design

## Approach

We fetch notifications from the provided API using an authorization token.

Each notification is assigned a priority score based on:

1. Type:
   - Placement (Highest priority)
   - Result
   - Event
   - Others

2. Recency:
   - Notifications within last 1 hour get highest weight
   - Notifications within last 24 hours get medium weight
   - Older notifications get lower weight

After calculating priority, notifications are sorted in descending order and top 10 are selected.

## Scalability

Since new notifications are continuously added:
- We fetch fresh data each time
- Priority is dynamically calculated
- No database storage is used

## Logging Strategy

Logging middleware is used to track:
- API calls (start & success)
- Priority calculations
- Error handling

This ensures observability and debugging capability.

## Output

The system returns top 10 notifications based on computed priority.