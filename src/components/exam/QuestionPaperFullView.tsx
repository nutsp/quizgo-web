"use client";

import type { Question } from "@/data/questions";
import {
  QuestionChoiceList,
  QuestionHeading,
} from "@/components/exam/QuestionPaperContent";

export interface QuestionPaperFullViewProps {
  questions: Question[];
}

interface QuestionPaperFullItemProps {
  question: Question;
  questionNo: number;
}

function QuestionPaperFullItem({ question, questionNo }: QuestionPaperFullItemProps) {
  return (
    <div id={`question-${questionNo}`} className="py-6">
      <QuestionHeading questionNo={questionNo} text={question.text} />
      <QuestionChoiceList choices={question.choices} />
    </div>
  );
}

export function QuestionPaperFullView({ questions }: QuestionPaperFullViewProps) {
  return (
    <div className="px-5 py-5 xl:px-8 xl:py-6">
      <div className="divide-y divide-slate-200">
        {questions.map((question) => (
          <QuestionPaperFullItem
            key={question.id}
            question={question}
            questionNo={question.id}
          />
        ))}
      </div>
    </div>
  );
}
