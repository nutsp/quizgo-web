import { BookOpen, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Course } from "@/data/courses";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-soft">
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
          <BookOpen className="h-5 w-5 text-secondary" />
        </div>
        <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
        <p className="text-sm text-muted">{course.description}</p>
      </CardHeader>
      <CardContent className="flex gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          {course.lessonCount} บทเรียน
        </span>
        <span className="flex items-center gap-1">
          <PenLine className="h-3.5 w-3.5" />
          {course.practiceCount} ข้อฝึก
        </span>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          เริ่มเรียน
        </Button>
      </CardFooter>
    </Card>
  );
}
