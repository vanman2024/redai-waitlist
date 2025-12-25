'use client';

import { useEffect, useState } from 'react';

const roles = [
  'Study Partner',        // Students - exam prep
  'Career Coach',         // Students - career guidance
  'Job Matcher',          // Students/Workers - employment
  'Talent Scout',         // Employers - hiring
  'Client Connector',     // Immigration Consultants - matching
  'Pathway Assistant'     // International Workers - immigration journey
];

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % roles.length);
        setIsVisible(true);
      }, 500); // Half second fade out before changing text

    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block min-w-[280px] lg:min-w-[320px] text-left transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {roles[currentIndex]}
    </span>
  );
}
