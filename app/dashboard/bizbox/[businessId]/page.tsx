import BusinessDashboardClient from './BusinessDashboardClient'

// Provide a static param so Next.js static export is satisfied.
// All real business IDs are handled via client-side navigation.
export function generateStaticParams() {
  return [{ businessId: 'index' }]
}

export default function Page() {
  return <BusinessDashboardClient />
}
