# Week 16: Emails & Invoices

> **Phase:** Payments & Orders (Week 16 of 16)
> **Focus:** Implement transactional emails and PDF invoice generation

---

## Week 16 Summary

Build email notification system for order events and PDF invoice generation.

---

## Day 1 (Monday): Email Templates

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Install email templating: `npm install @react-email/render react-email` (or use handlebars) | ADD | `backend/package.json` |
| 1.2 | Create email templates folder | ADD | `backend/src/templates/emails/` |
| 1.3 | Create order confirmation email template | ADD | `backend/src/templates/emails/orderConfirmation.ts` |
| 1.4 | Create order shipped email template | ADD | `backend/src/templates/emails/orderShipped.ts` |
| 1.5 | Create order delivered email template | ADD | `backend/src/templates/emails/orderDelivered.ts` |
| 1.6 | Create order cancelled email template | ADD | `backend/src/templates/emails/orderCancelled.ts` |

---

## Day 2 (Tuesday): Email Service Enhancement

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add `sendOrderConfirmation()` to email service | MODIFY | `backend/src/services/email.service.ts` |
| 2.2 | Add `sendOrderShipped()` to email service | MODIFY | `backend/src/services/email.service.ts` |
| 2.3 | Add `sendOrderDelivered()` to email service | MODIFY | `backend/src/services/email.service.ts` |
| 2.4 | Add `sendOrderCancelled()` to email service | MODIFY | `backend/src/services/email.service.ts` |
| 2.5 | Call `sendOrderConfirmation()` after successful checkout | MODIFY | `backend/src/services/order.service.ts` |
| 2.6 | Call appropriate email on order status change | MODIFY | `backend/src/services/order.service.ts` |

---

## Day 3 (Wednesday): Invoice Generation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Install PDF library: `npm install @react-pdf/renderer` or `npm install pdfkit` | ADD | `backend/package.json` |
| 3.2 | Create invoice service with method: `generateInvoice` | ADD | `backend/src/services/invoice.service.ts` |
| 3.3 | Create invoice PDF template (order details, items, totals, company info) | ADD | `backend/src/templates/invoice.ts` |
| 3.4 | Add `generateInvoiceNumber()` - generates INV-XXXXXX | ADD | `backend/src/services/invoice.service.ts` |
| 3.5 | Upload generated PDF to S3 | MODIFY | `backend/src/services/invoice.service.ts` |
| 3.6 | Store invoice URL in Order model | MODIFY | `backend/src/models/Order.model.ts` |

---

## Day 4 (Thursday): Invoice Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create invoice controller | ADD | `backend/src/controllers/invoice.controller.ts` |
| 4.2 | Add route: `GET /api/v1/orders/:orderNumber/invoice` - download invoice PDF (auth, owner only) | ADD | `backend/src/routes/order.routes.ts` |
| 4.3 | Generate invoice automatically when order is paid | MODIFY | `backend/src/controllers/webhook.controller.ts` |
| 4.4 | Attach invoice to order confirmation email | MODIFY | `backend/src/services/email.service.ts` |

---

## Day 5 (Friday): Frontend & Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Add "Download Invoice" button in order detail page | MODIFY | `frontend/app/dashboard/orders/[orderNumber]/page.tsx` |
| 5.2 | Add invoice download link in admin order detail | MODIFY | `frontend/app/dashboard/admin/orders/[id]/page.tsx` |
| 5.3 | Create welcome email template (sent after registration) | ADD | `backend/src/templates/emails/welcome.ts` |
| 5.4 | Send welcome email after user registration | MODIFY | `backend/src/services/auth.service.ts` |
| 5.5 | Test: Order confirmation email sent | TEST | - |
| 5.6 | Test: Invoice PDF generates correctly | TEST | - |
| 5.7 | Test: Customer can download invoice | TEST | - |
| 5.8 | Test: Status change emails sent | TEST | - |

---

## Week 16 Checklist

- [ ] Email templates created
- [ ] Order confirmation email working
- [ ] Order shipped email working
- [ ] Order delivered email working
- [ ] Invoice PDF generation working
- [ ] Invoice uploaded to S3
- [ ] Invoice download endpoint working
- [ ] Invoice attached to email
- [ ] Welcome email working
- [ ] All emails tested

---

**Phase 4 Complete!**

**Next Week:** Week 17 - Coupons & Promotions
