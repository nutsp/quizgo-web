import Link from "next/link";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { Button } from "@/components/ui/button";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
};

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <AdminPageContainer
      title={title}
      description={description}
      actions={
        action ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : undefined
      }
    />
  );
}
