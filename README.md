# Golf Charity Subscription Platform

**Live Website:** https://golf-charity-subscription-platform-henna.vercel.app/


 

---

## Project Overview

The **Golf Charity Subscription Platform** is a subscription-driven web application combining golf performance tracking, charity fundraising, and monthly prize draws. The platform is designed to be engaging, modern, and emotion-driven, emphasizing charitable impact rather than traditional golf aesthetics.

Users can:
- Subscribe monthly or yearly.
- Enter their latest golf scores in Stableford format.
- Participate in monthly draw-based prize pools.
- Support a charity of their choice with a portion of their subscription.

---

## Core Features

### Subscription & Payment System
- Monthly and yearly subscription plans.
- Handles subscription lifecycle: renewal, cancellation, lapsed status.
- Access control for subscribers vs. non-subscribers.
- **Future Implementation:** Stripe or equivalent PCI-compliant payment gateway integration.

### Score Management
- Enter up to 5 most recent golf scores (Stableford format).
- Automatic rolling logic: oldest scores replaced by new entries.
- Reverse chronological display of scores.

### Draw & Reward System
- Random or algorithmic monthly draws.
- Multiple prize tiers: 5-number match, 4-number match, 3-number match.
- Jackpot rollover if 5-number match is unclaimed.
- Admin control for publishing results and simulations.

### Charity Integration
- Users select a charity at signup.
- Minimum contribution: 10% of subscription (option to increase).
- Charity directory with search and filter.
- Featured charities and individual profiles.

### Winner Verification System
- Admin reviews submissions from winners.
- Approval or rejection of proofs.
- Tracks payment status: Pending → Paid.

### Dashboards
**User Dashboard:**
- Subscription status, score entry/edit, charity selection, participation summary, winnings overview.  

**Admin Dashboard:**
- Manage users, subscriptions, scores.
- Configure draws, run simulations, publish results.
- Charity management: add/edit/delete.
- Verify winners and track payouts.
- Reports & analytics: total users, prize pool, charity contributions, draw statistics.

---

## Technical Details

- **Frontend:** React, Tailwind CSS, modern responsive UI/UX design.
- **Backend:** Node.js / Express (or your chosen stack), database connected via Supabase.
- **Authentication:** JWT/session-based.
- **Deployment:** Vercel.
- **Mobile-first, responsive, and fast performance**.

---

## Future Enhancements
- Stripe or equivalent payment integration for live subscription payments.
- Corporate/Team accounts support.
- Mobile app version extension.
- Campaign modules for promotions and seasonal events.


Pull Requests are allowed



## Instructions to Run Locally

1. Clone the repository:  
   ```bash
   git clone https://github.com/Santosh-kumar-sah/Golf_Charity_Subscription_Platform.git
