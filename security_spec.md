# Security Specification: HABEEVATUSSUNNAH ONLINE BUSINESS

## 1. Data Invariants
1. Categories and subcategories are public-read; modifications require admin authentication.
2. Products and variants are public-read; creation, stock update, and modification require admin access.
3. Orders can be created by any public customer (storefront checkout), but order status, payment confirmation, and tracking transitions are restricted to admin access.
4. Customer contact messages can be submitted by any visitor, but reading or updating messages is restricted to admin.
5. Site settings (OPay credentials, phone numbers) are public-read but can only be modified by the store administrator.
6. The administrative user email `yakubusanishagari@gmail.com` has administrator privileges.

## 2. The Dirty Dozen Payloads
1. **Malicious Role Injection on Order**: Attempting to inject an `isAdmin` or `role` attribute into customer orders.
2. **Unauthorized Order Status Elevation**: Customer attempting to change `payment_status` from `Awaiting Confirmation` to `Confirmed`.
3. **Price Tampering on Product Update**: Non-admin attempting to reduce product price to 0.
4. **Catastrophic ID Poisoning**: Attempting to write documents with oversized junk IDs (> 128 chars).
5. **Junk Field Pollution**: Injecting arbitrary 1MB payloads into `site_settings`.
6. **Product Stock Hijack**: Direct anonymous alteration of product inventory.
7. **Contact Message Scraping**: Unauthenticated user attempting to list private customer phone numbers and messages.
8. **Malicious Subcategory Creation**: Non-admin attempting to create a fake phishing subcategory.
9. **Fake Payment Provider Manipulation**: Attempting to alter OPay account number or name without admin rights.
10. **Order Items Array Poisoning**: Attempting to insert an empty or non-array order item list.
11. **Negative Price/Stock Exploit**: Inserting product with price < 0 or stock < 0.
12. **Unauthorized Document Deletion**: Anonymous user attempting to delete a product or order record.

## 3. Test Runner Specification
All dirty dozen attacks are blocked by `firestore.rules` using the Eight Pillars of Hardened Rules.
