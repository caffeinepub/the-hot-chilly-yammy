# The Hot Chilly Yammy

## Current State
- Mobile-friendly Chinese vegetarian food menu app
- Dark olive green + white theme, square grid card layout (2 columns)
- Categories: Spring Roll, Momos, Noodles, Manchurian, Soup, Rice
- Each dish has photo, name, price; customer order form with Name, Phone, Address
- Payment: COD and UPI; orders sent to WhatsApp: 8582024063, 8228096793
- Admin page at #admin (password: 8228096793) for offer/discount management
- QR code sharing page
- No quantity selection, no bill generation, no daily order ledger

## Requested Changes (Diff)

### Add
- Quantity selector (+/-) on each dish card
- After order is placed, generate a downloadable/printable bill with:
  - Restaurant name, unique order number, date & time
  - Customer name, phone, address
  - Itemized list: dish name, quantity, unit price, subtotal
  - Discount applied (if offer active), Grand Total, Payment method
- Daily Hisab page in admin panel (after admin login):
  - All orders for selected date with date filter
  - Total collection for the day
  - Orders stored in localStorage

### Modify
- Order form: include quantities in WhatsApp message and bill
- Admin panel: add "Daily Hisab" tab alongside offer/discount settings

### Remove
- Nothing

## Implementation Plan
1. Add quantity state per dish (+/- buttons), cart summary when qty > 0
2. Order submit: WhatsApp message with itemized quantities + save order to localStorage
3. Bill component: printable receipt, triggered after order placed, with download/print button
4. Admin panel: Daily Hisab tab with date filter, orders table, total collection
