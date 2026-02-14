"use client";

import { useState } from "react";
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    Clock,
    Settings,
    X,
    MoreHorizontal
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export type NotificationType = "BOOKING_PENDING" | "CHECK_IN" | "CHECK_OUT" | "HOUSEKEEPING" | "SYSTEM";

export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
}

interface NotificationsProps {
    notifications?: NotificationItem[];
}

export function NotificationBell({ notifications = [] }: NotificationsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

    // Filter unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = activeTab === "all"
        ? notifications
        : notifications.filter(n => !n.read);

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "BOOKING_PENDING":
                return <Clock className="h-4 w-4 text-amber-500" />;
            case "CHECK_IN":
                return <CheckCircle2 className="h-4 w-4 text-[#b5f347]" />;
            case "CHECK_OUT":
                return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
            case "HOUSEKEEPING":
                return <AlertCircle className="h-4 w-4 text-rose-500" />;
            default:
                return <Bell className="h-4 w-4 text-slate-500" />;
        }
    };

    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case "BOOKING_PENDING": return "bg-amber-500/10 border-amber-500/20";
            case "CHECK_IN": return "bg-[#b5f347]/10 border-[#b5f347]/20";
            case "CHECK_OUT": return "bg-blue-500/10 border-blue-500/20";
            case "HOUSEKEEPING": return "bg-rose-500/10 border-rose-500/20";
            default: return "bg-slate-500/10 border-slate-500/20";
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="relative rounded-full hover:bg-white/10 h-10 w-10">
                    <Bell className={cn("h-5 w-5 text-slate-400 transition-colors", isOpen && "text-white")} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#b5f347] ring-2 ring-[#0a0a0a] animate-pulse shadow-[0_0_10px_#b5f347]" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-2xl shadow-2xl shadow-black border-[#222] bg-[#111] overflow-hidden text-white">
                {/* Header */}
                <div className="p-4 bg-[#111] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="font-black text-white uppercase tracking-wide text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-[#b5f347]/20 text-[#b5f347] hover:bg-[#b5f347]/30 font-bold px-1.5 h-5 border border-[#b5f347]/30">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-7 text-[10px] font-bold px-2 rounded-lg hover:bg-white/10 hover:text-white", activeTab === "all" ? "bg-white/10 text-white" : "text-slate-500")}
                            onClick={(e) => { e.preventDefault(); setActiveTab("all"); }}
                        >
                            All
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-7 text-[10px] font-bold px-2 rounded-lg hover:bg-white/10 hover:text-white", activeTab === "unread" ? "bg-white/10 text-white" : "text-slate-500")}
                            onClick={(e) => { e.preventDefault(); setActiveTab("unread"); }}
                        >
                            Unread
                        </Button>
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto scrollbar-hide bg-[#0a0a0a]">
                    {filteredNotifications.length > 0 ? (
                        <div className="flex flex-col">
                            {filteredNotifications.map((notification) => (
                                <Link
                                    href={notification.link || "#"}
                                    key={notification.id}
                                    className="relative group p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors block"
                                >
                                    {!notification.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#b5f347]" />
                                    )}

                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                                            getBgColor(notification.type)
                                        )}>
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <p className="text-sm font-bold text-white truncate pr-2 group-hover:text-[#b5f347] transition-colors">
                                                    {notification.title}
                                                </p>
                                                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-snug line-clamp-2 font-medium">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 flex flex-col items-center justify-center text-center text-slate-600">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">No signals detected</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-white/5 bg-[#111]">
                    <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-500 h-8 hover:text-white hover:bg-white/5">
                        Mark all as read
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
