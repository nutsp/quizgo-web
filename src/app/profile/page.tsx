"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MemberIdentityCard } from "@/components/profile/MemberIdentityCard";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, toUserFriendlyError } from "@/lib/api";
import { profileApi } from "@/lib/api/profileApi";
import type { UserProfile } from "@/lib/api/types";
import { publicDisplayName } from "@/lib/format";

function ProfilePageContent() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [previewName, setPreviewName] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
      setPreviewName(data.display_name ?? "");
    } catch (e) {
      setError(toUserFriendlyError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdate = async (displayName: string) => {
    try {
      const updated = await profileApi.updateProfile({ display_name: displayName });
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              display_name: updated.display_name,
              public_display_name: updated.public_display_name,
            }
          : prev
      );
      updateUser({
        display_name: updated.display_name ?? "",
        public_display_name: updated.public_display_name,
      });
      showToast("บันทึกโปรไฟล์สำเร็จ", "success");
    } catch (e) {
      const message =
        e instanceof ApiError && e.code === "VALIDATION_ERROR"
          ? e.message
          : "ไม่สามารถบันทึกโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง";
      showToast(message, "error");
      throw e;
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>กำลังโหลดโปรไฟล์...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="py-16 text-center">
          <p className="text-danger">
            {error ?? "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง"}
          </p>
        </div>
      </main>
    );
  }

  const cardDisplayName = publicDisplayName(previewName, profile.email);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">โปรไฟล์ของฉัน</h1>
        <p className="text-sm text-muted md:text-base">
          จัดการชื่อที่ใช้แสดงในระบบและบนกระดานอันดับ
        </p>
      </header>

      <section className="mt-6">
        <MemberIdentityCard
          displayName={cardDisplayName}
          email={profile.email}
          joinedAt={profile.created_at}
          completedExamSetCount={profile.stats?.completed_exam_sets ?? 0}
          totalAttempts={profile.stats?.total_attempts ?? 0}
          averageScorePercent={profile.stats?.average_score_percent}
          highestScorePercent={profile.stats?.best_score_percent}
        />
      </section>

      <section className="mt-6">
        <ProfileInfoCard
          profile={profile}
          onSubmit={handleUpdate}
          onDisplayNameChange={setPreviewName}
        />
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  );
}
