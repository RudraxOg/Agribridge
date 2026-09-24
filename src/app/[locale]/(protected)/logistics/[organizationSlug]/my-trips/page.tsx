import DriverTripsPage from "../trips/page";

export default async function MyTripsPage({ params }: { params: Promise<{ locale: string; organizationSlug: string }> }) {
  return <DriverTripsPage params={params} />;
}
