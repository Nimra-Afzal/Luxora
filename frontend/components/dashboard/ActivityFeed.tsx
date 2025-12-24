"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Activity {
  id: string;
  message: string;
  date: string;
}

export default function ActivityFeed() {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/blogs/my");
        const blogs = res.data.blogs || [];

        const items = blogs.slice(0, 5).map((blog: any) => ({
          id: blog._id,
          message: `You published "${blog.title}"`,
          date: blog.createdAt,
        }));

        setActivity(items);
      } catch {
        console.warn("Activity feed unavailable.");
      }
    })();
  }, []);

  if (activity.length === 0)
    return <p className="text-gray-500">No recent activity.</p>;

  return (
    <ul className="space-y-3">
      {activity.map((item) => (
        <li
          key={item.id}
          className="flex justify-between text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700"
        >
          <span>{item.message}</span>
          <span className="text-gray-400">
            {new Date(item.date).toLocaleDateString()}

          </span>
        </li>
      ))}
    </ul>
  );
}
