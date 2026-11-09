"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts its children only when they come close to the viewport, so code that nobody needs until
 * the bottom of the page isn't downloaded with the first load. Give it a min-height close to the
 * real content, so nothing jumps when it arrives.
 */
export function WhenNear({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "1000px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={className}>
      {near ? children : null}
    </div>
  );
}
