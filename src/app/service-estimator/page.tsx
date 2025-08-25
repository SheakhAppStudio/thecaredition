'use client';

import Image from 'next/image';
import ServiceEstimatorComponent from '@/components/reuseableComponents/ServicesEstimator/ServiceEstimator';


export default function ServiceEstimator() {

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with background image */}
      <div className="relative h-64 bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/logos/backgroundlogo2.jpg"
            alt="Car Workshop"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>
        {/* No title in header */}
        <div className="relative flex flex-col items-center justify-center h-full">
          {/* Empty header for background only */}
        </div>
      </div>

      {/* Main content */}
        <ServiceEstimatorComponent/>
    </div>
  );
}
