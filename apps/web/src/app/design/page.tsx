import { notFound } from 'next/navigation';
import { DesignKit } from './design-kit';

// Component gallery for development; not served in production.
export default function DesignPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <DesignKit />;
}
