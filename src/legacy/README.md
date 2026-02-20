# Legacy Code Archive

This folder contains code that has been archived but not deleted.

## Archived Dashboards

**Location**: `dashboards/`

**Date Archived**: January 25, 2026

**Reason**: Dashboard functionality was no longer required in the main application. The app now defaults to the Issues page.

**Contents**:
- `CEODashboard.tsx` - CEO-level executive dashboard
- `CXODashboard.tsx` - CXO functional dashboards (Quality, Sales, Supply Chain, Marketing)
- `ExtendedLeadershipDashboard.tsx` - Regional/zone-level dashboard
- `BreweryDashboard.tsx` - Brewery-specific quality & CAPA dashboard
- `GovernanceDashboard.tsx` - SLA & escalation governance dashboard
- `OperationalCXDashboard.tsx` - CX communication governance dashboard

**Code Preserved**: ~150KB of React components with role-based rendering, data visualization (Recharts), and dashboard filters.

## Restoration

If you need to restore dashboard functionality:

1. Move files from `src/legacy/dashboards/` back to `src/dashboards/`
2. Re-enable dashboard imports in `src/App.tsx`
3. Add "Dashboard" navigation item back to `src/components/Navigation.tsx`
4. Add `'dashboard'` back to `PageType` in `src/types/index.ts`
5. Restore dashboard routing logic in `App.tsx`

## Related Systems Still Active

The following systems used by dashboards remain active:
- Data services (`src/services/`)
- Mock data service
- Data extraction & export services
- Type definitions (`src/types/`)
- Dashboard filters (still used by other pages)
