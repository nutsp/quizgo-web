"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CHOICES = ["ก", "ข", "ค", "ง"] as const;
const previewQuestionCount = 7;
const ANSWERED_COUNT = 5;
const PROGRESS_PERCENT = 71;

const MINI_CARD_HEIGHT = "h-[210px] lg:h-[230px]";

const STATIC_FILLED: Record<number, string> = {
  1: "ข",
  2: "ค",
  3: "ก",
  4: "ง",
  5: "ข",
};

const animatedAnswers = [
  { questionNo: 1, choice: "ข" },
  { questionNo: 2, choice: "ค" },
  { questionNo: 3, choice: "ก" },
  { questionNo: 4, choice: "ง" },
  { questionNo: 5, choice: "ข" },
];

const MINI_QUESTIONS = [
  {
    no: 1,
    text: "ข้อใดเป็นหนังสือราชการภายนอก",
    choices: [
      "ก. บันทึกข้อความ",
      "ข. หนังสือภายนอก",
      "ค. หนังสือสั่งการ",
      "ง. หนังสือประชาสัมพันธ์",
    ],
  },
  {
    no: 2,
    text: "หลักการสำคัญของการรักษาความลับทางราชการคือข้อใด",
    choices: [
      "ก. เปิดเผยได้ทุกกรณี",
      "ข. จำกัดเฉพาะผู้มีหน้าที่",
      "ค. ไม่ต้องมีมาตรการ",
      "ง. เก็บไว้ตลอดไป",
    ],
  },
  {
    no: 3,
    text: "การจัดทำหนังสือราชการต้องใช้หลักการใด",
    choices: [
      "ก. ชัดเจน กระชับ ถูกต้อง",
      "ข. ยาวและละเอียด",
      "ค. ใช้ภาษาต่างประเทศ",
      "ง. ไม่ต้องลงนาม",
    ],
  },
  {
    no: 4,
    text: "ผู้มีอำนาจลงนามในหนังสือราชการคือใคร",
    choices: [
      "ก. เจ้าหน้าที่ทุกคน",
      "ข. ผู้มีอำนาจตามระเบียบ",
      "ค. ผู้รับสาร",
      "ง. ผู้ส่งหนังสือ",
    ],
  },
] as const;

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

function MiniQuestion({
  no,
  text,
  choices,
}: {
  no: number;
  text: string;
  choices: readonly string[];
}) {
  return (
    <div>
      <div className="flex items-start gap-1.5">
        <span className="shrink-0 rounded bg-teal-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
          ข้อ {no}
        </span>
        <p className="text-[11px] font-semibold leading-5 text-slate-900">{text}</p>
      </div>
      <div className="mt-1.5 space-y-0.5 pl-0.5 text-[10px] leading-4 text-slate-600">
        {choices.map((choice) => (
          <p key={choice}>{choice}</p>
        ))}
      </div>
    </div>
  );
}

function QuestionPaperMiniPreview({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  const questions = prefersReducedMotion
    ? MINI_QUESTIONS.slice(0, 2)
    : MINI_QUESTIONS;

  return (
    <div
      className={cn(
        MINI_CARD_HEIGHT,
        "relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
      )}
    >
      <div className="mb-2 shrink-0">
        <p className="text-xs font-semibold text-slate-500">กระดาษข้อสอบ</p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "space-y-3",
            !prefersReducedMotion && "hero-paper-scroll"
          )}
        >
          {questions.map((q) => (
            <MiniQuestion key={q.no} {...q} />
          ))}
        </div>

        {!prefersReducedMotion && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-slate-50/95 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-50/95 to-transparent" />
          </>
        )}
      </div>
    </div>
  );
}

function OMRAnswerSheetMiniPreview({
  filledAnswers,
  prefersReducedMotion,
}: {
  filledAnswers: Record<number, string>;
  prefersReducedMotion: boolean;
}) {
  return (
    <div
      className={cn(
        MINI_CARD_HEIGHT,
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4"
      )}
    >
      <div className="mb-2 flex shrink-0 items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-500">กระดาษคำตอบ</p>
          <p className="mt-0.5 text-[10px] text-slate-400">กดค้างเพื่อฝนคำตอบ</p>
        </div>
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-teal-50 px-2.5 py-1.5 text-[11px] font-semibold text-teal-700">
          <Clock className="h-3.5 w-3.5" />
          <span className="tabular-nums">00:59:42</span>
        </div>
      </div>

      <div className="mt-1 min-h-0 flex-1 space-y-1">
        {Array.from({ length: previewQuestionCount }, (_, i) => {
          const questionNo = i + 1;
          const filledChoice = filledAnswers[questionNo];

          return (
            <div
              key={questionNo}
              className="grid grid-cols-[18px_repeat(4,1fr)] items-center gap-1.5"
            >
              <span className="text-[10px] font-medium text-slate-500">
                {questionNo}
              </span>
              {CHOICES.map((choice) => {
                const isFilled = filledChoice === choice;

                return (
                  <span
                    key={choice}
                    className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded-full border text-[8px]",
                      !prefersReducedMotion && "transition-colors duration-300",
                      isFilled
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    )}
                  >
                    {choice}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HeroExamPreview() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % animatedAnswers.length);
    }, 1600);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const filledAnswers: Record<number, string> = prefersReducedMotion
    ? STATIC_FILLED
    : Object.fromEntries(
        animatedAnswers.slice(0, activeStep + 1).map((a) => [a.questionNo, a.choice])
      );

  return (
    <div className="relative">
      <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-teal-500/10 blur-2xl" />
      <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuestionPaperMiniPreview prefersReducedMotion={prefersReducedMotion} />
          <OMRAnswerSheetMiniPreview
            filledAnswers={filledAnswers}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              ตอบแล้ว {ANSWERED_COUNT}/{previewQuestionCount} ข้อ
            </span>
            <span>{PROGRESS_PERCENT}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 w-[71%] rounded-full bg-teal-600" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
