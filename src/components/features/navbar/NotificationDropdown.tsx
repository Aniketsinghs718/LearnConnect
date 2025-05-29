'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  date: Date;
  read: boolean;
}

interface RawNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationDropdownProps {
  mounted: boolean;
}

export default function NotificationDropdown({ mounted }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted) return;

    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mounted]);

  const fetchNotifications = async (): Promise<void> => {
    setLoading(true);
    try {
      // Check localStorage for cached notifications
      const cachedNotifications = localStorage.getItem("notifications");
      const lastFetch = localStorage.getItem("LastNotificationFetch");
      const now = new Date();

      if (
        cachedNotifications &&
        lastFetch &&
        now.getTime() - new Date(lastFetch).getTime() < 5 * 60 * 1000 // 5 minutes
      ) {
        const parsed: RawNotification[] = JSON.parse(cachedNotifications);
        const formattedNotifications: Notification[] = parsed.map((note) => ({
          ...note,
          date: new Date(note.date),
        }));
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter((note) => !note.read).length);
        return;
      }

      // Mock notifications for now - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: "1",
          message: "Welcome to LearnConnect! Check out the latest updates.",
          date: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
        },
        {
          id: "2", 
          message: "New study materials added for Computer Science.",
          date: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
          read: false,
        },
        {
          id: "3",
          message: "Your profile has been updated successfully.",
          date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: false,
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.length);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = (): void => {
    setNotifications(notifications.map((note) => ({ ...note, read: true })));
    setUnreadCount(0);
    localStorage.setItem("LastNotificationRead", new Date().toISOString());
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-500 transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-base-content" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 md:-translate-x-0 w-11/12 max-w-sm z-50 md:absolute md:transform-none md:top-auto md:left-auto md:right-0 md:mt-2 md:w-80">
          <div className="bg-base-100 rounded-lg shadow-lg w-full flex flex-col">
            <div className="p-3 border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-base-200 rounded-t-lg">
              <h3 className="text-sm font-medium text-base-content">
                Notifications
              </h3>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="rounded-full p-1 hover:bg-gray-500"
                >
                  <X className="w-4 h-4 hover:text-gray-800" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-64">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Loading...
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      !note.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <p className="text-sm text-base-content mb-1">
                      {note.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(note.date)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
