import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 sm:py-14 text-center rounded-2xl bg-[#111827]/60 border border-dashed border-[#2A3548]">
      <div
        aria-hidden="true"
        className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-300"
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-gray-100 mb-1.5 text-balance">{title}</h3>
      <p className="text-[13px] text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="omx-btn-primary"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && !actionHref && onActionClick && (
        <button
          onClick={onActionClick}
          className="omx-btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
