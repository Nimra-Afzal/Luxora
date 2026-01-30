# Week 19: Customer Support

> **Phase:** Advanced Features (Week 19 of 20)
> **Focus:** Implement support ticket system and help center

---

## Week 19 Summary

Build a customer support system with tickets, messaging, and a help center with FAQs.

---

## Day 1 (Monday): Ticket Model & Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Ticket model already created in Week 2, verify fields: `ticketNumber`, `user`, `subject`, `category`, `status`, `priority`, `assignedTo`, `messages[]`, timestamps | VERIFY | `backend/src/models/Ticket.model.ts` |
| 1.2 | Create ticket service with methods: `create`, `getById`, `getUserTickets`, `addMessage`, `updateStatus`, `assign`, `close` | ADD | `backend/src/services/ticket.service.ts` |
| 1.3 | Add `generateTicketNumber()` - generates TKT-XXXXXX | ADD | `backend/src/services/ticket.service.ts` |
| 1.4 | Define ticket categories: order_issue, product_inquiry, shipping, refund, account, other | ADD | `backend/src/constants/ticketCategories.ts` |

---

## Day 2 (Tuesday): Customer Ticket Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create ticket controller | ADD | `backend/src/controllers/ticket.controller.ts` |
| 2.2 | Add route: `POST /api/v1/tickets` - create support ticket (auth) | ADD | `backend/src/routes/ticket.routes.ts` |
| 2.3 | Add route: `GET /api/v1/tickets` - get user's tickets (auth) | ADD | `backend/src/routes/ticket.routes.ts` |
| 2.4 | Add route: `GET /api/v1/tickets/:id` - get ticket details (auth, owner) | ADD | `backend/src/routes/ticket.routes.ts` |
| 2.5 | Add route: `POST /api/v1/tickets/:id/messages` - add message to ticket (auth, owner) | ADD | `backend/src/routes/ticket.routes.ts` |
| 2.6 | Add route: `PUT /api/v1/tickets/:id/close` - close ticket (auth, owner) | ADD | `backend/src/routes/ticket.routes.ts` |
| 2.7 | Mount ticket routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 3 (Wednesday): Admin/Support Ticket Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Add route: `GET /api/v1/admin/tickets` - list all tickets with filters (admin/support) | ADD | `backend/src/routes/ticket.routes.ts` |
| 3.2 | Add route: `GET /api/v1/admin/tickets/:id` - get any ticket (admin/support) | ADD | `backend/src/routes/ticket.routes.ts` |
| 3.3 | Add route: `PUT /api/v1/admin/tickets/:id/assign` - assign to support agent (admin) | ADD | `backend/src/routes/ticket.routes.ts` |
| 3.4 | Add route: `PUT /api/v1/admin/tickets/:id/status` - update status (admin/support) | ADD | `backend/src/routes/ticket.routes.ts` |
| 3.5 | Add route: `POST /api/v1/admin/tickets/:id/messages` - add staff reply (admin/support) | ADD | `backend/src/routes/ticket.routes.ts` |
| 3.6 | Send email notification when ticket receives reply | MODIFY | `backend/src/services/ticket.service.ts` |

---

## Day 4 (Thursday): Frontend - Customer Support UI

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create ticketSlice with state: tickets, currentTicket, loading, error | ADD | `frontend/redux/features/ticketSlice.ts` |
| 4.2 | Add thunks: `createTicket`, `fetchTickets`, `fetchTicketById`, `addMessage`, `closeTicket` | ADD | `frontend/redux/features/ticketSlice.ts` |
| 4.3 | Create TicketForm component (subject, category, message) | ADD | `frontend/components/TicketForm.tsx` |
| 4.4 | Create support page / contact page with ticket form | ADD | `frontend/app/support/page.tsx` |
| 4.5 | Create tickets list page in dashboard | ADD | `frontend/app/dashboard/support/page.tsx` |
| 4.6 | Create ticket detail page with message thread | ADD | `frontend/app/dashboard/support/[id]/page.tsx` |
| 4.7 | Add "Support" menu item in dashboard sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |

---

## Day 5 (Friday): Admin Support UI & Help Center

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create admin tickets page with filters (status, priority, assignee) | ADD | `frontend/app/dashboard/admin/support/page.tsx` |
| 5.2 | Create admin ticket detail page with reply form | ADD | `frontend/app/dashboard/admin/support/[id]/page.tsx` |
| 5.3 | Create FAQ page with common questions | ADD | `frontend/app/help/page.tsx` |
| 5.4 | Add ticket priority badges (low, medium, high, urgent) | ADD | `frontend/components/TicketPriorityBadge.tsx` |
| 5.5 | Add ticket status badges | ADD | `frontend/components/TicketStatusBadge.tsx` |
| 5.6 | Test: Customer can create ticket | TEST | - |
| 5.7 | Test: Customer receives email on reply | TEST | - |
| 5.8 | Test: Admin can assign and respond to tickets | TEST | - |

---

## Week 19 Checklist

- [ ] Ticket model verified
- [ ] Ticket service created
- [ ] Customer ticket endpoints
- [ ] Admin ticket endpoints
- [ ] Ticket assignment working
- [ ] Message threading working
- [ ] Email notifications on reply
- [ ] Customer support UI
- [ ] Admin support UI
- [ ] FAQ/Help page

---

**Next Week:** Week 20 - Analytics Dashboard
