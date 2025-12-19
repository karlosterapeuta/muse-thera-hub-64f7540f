import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseWithProgress } from "@/types/courses";
import { NetflixCourseCard } from "./NetflixCourseCard";

interface CourseRowProps {
  title: string;
  courses: (CourseWithProgress & { hasAccess?: boolean })[];
  onCourseClick: (course: CourseWithProgress) => void;
  onCourseInfo: (course: CourseWithProgress) => void;
  onCoursePurchase?: (course: CourseWithProgress) => void;
}

export function CourseRow({ title, courses, onCourseClick, onCourseInfo, onCoursePurchase }: CourseRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (courses.length === 0) return null;

  return (
    <div className="relative group py-4">
      {/* Title */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-4 sm:px-6 md:px-12">{title}</h2>

      {/* Scroll container */}
      <div className="relative">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 h-full w-12 rounded-none bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/90"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {/* Cards container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 pb-32"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course) => (
            <NetflixCourseCard
              key={course.id}
              course={course}
              onClick={() => onCourseClick(course)}
              onInfoClick={() => onCourseInfo(course)}
              onPurchaseClick={() => onCoursePurchase?.(course)}
            />
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 h-full w-12 rounded-none bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/90"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
