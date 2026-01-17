# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [x] Read the README [please please please]
- [x] Something cool!
- [x] Back-end
  - [x] Minimum Requirements
    - [x] Setup MongoDB database (done, app/lib/db/mongoose.ts)
    - [x] Setup item requests collection (done, app/lib/db/models/Request.ts, along with correct schema)
    - [x] `PUT /api/request` (done, in app/api/mock/request/route.ts)
    - [x] `GET /api/request?page=_` (same as above)
  - [ ] Main Requirements
    - [x] `GET /api/request?status=pending` (same as above)
    - [x] `PATCH /api/request` (same as above)
  - [x] Above and Beyond
    - [x] Batch edits (done, in app/api/mock/batch/route.ts)
    - [x] Batch deletes (same as above)
- [ ] Front-end
  - [ ] Minimum Requirements
    - [ ] Dropdown component
    - [ ] Table component
    - [ ] Base page [table with data]
    - [ ] Table dropdown interactivity
  - [ ] Main Requirements
    - [ ] Pagination
    - [ ] Tabs
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes

# Notes

## Batch Operations API Endpoints

### Batch Update Status
**PATCH /api/request/batch**

Updates the status of multiple requests at once.

Request body:
```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "status": "approved"
}
```

Response (200 OK):
```json
{
  "message": "Successfully updated 2 requests",
  "modifiedCount": 2
}
```

### Batch Delete
**DELETE /api/request/batch**

Deletes multiple requests at once.

Request body:
```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

Response (200 OK):
```json
{
  "message": "Successfully deleted 2 requests",
  "deletedCount": 2
}
```

Both endpoints return 400 with `INVALID_INPUT` response type if:
- `ids` array is missing, invalid, or empty
- `status` is missing (for PATCH) or invalid
- No requests are found with the provided IDs

**Tested with MongoDB Atlas (cloud instance), example request record copied from Atlas UI:
```json
{
  "_id": {
    "$oid": "696adfb5fdc5f68a7b8687bf"
  },
  "requestorName": "Test",
  "itemRequested": "Item",
  "requestCreatedDate": {
    "$date": "2026-01-17T01:02:45.066Z"
  },
  "lastEditedDate": {
    "$date": "2026-01-17T01:02:45.066Z"
  },
  "status": "pending",
  "createdAt": {
    "$date": "2026-01-17T01:02:45.074Z"
  },
  "updatedAt": {
    "$date": "2026-01-17T01:02:45.074Z"
  },
  "__v": 0
}
```
