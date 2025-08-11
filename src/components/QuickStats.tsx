"use client";
import React, { useEffect, useState } from "react";

export default function QuickStats() {
  const [stats, setStats] = useState({
    teamMembers: 0,
    departments: 0,
    announcements: 0,
    upcomingCelebrations: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [employeesRes, announcementsRes, celebrationsRes] = await Promise.all([
          fetch("http://localhost:5000/api/employees"),
          fetch("http://localhost:5000/api/announcements"),
          fetch("http://localhost:5000/api/celebrations"),
        ]);

        const employeesData = await employeesRes.json();
        const announcementsData = await announcementsRes.json();
        const celebrationsData = await celebrationsRes.json();

        const teamMembersCount = employeesData?.count || employeesData?.data?.length || 0;
        const departmentsCount = new Set(
          employeesData?.data?.map((emp: any) => emp.department)
        ).size || 0;
        const announcementsCount =
          announcementsData?.length || announcementsData?.data?.length || 0;

        // Filter celebrations to only those within the next 7 days
        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);

        const upcomingThisWeek =
          celebrationsData?.data?.filter((celebration: any) => {
            const eventDate = new Date(celebration.date);
            return eventDate >= today && eventDate <= oneWeekLater;
          }).length || 0;

        setStats({
          teamMembers: teamMembersCount,
          departments: departmentsCount,
          announcements: announcementsCount,
          upcomingCelebrations: upcomingThisWeek,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Team Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.teamMembers}
          </div>
          <div className="text-gray-600">Team Members</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.departments}
          </div>
          <div className="text-gray-600">Departments</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats.announcements}
          </div>
          <div className="text-gray-600">Recent Announcements</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600 mb-2">
            {stats.upcomingCelebrations}
          </div>
          <div className="text-gray-600">Upcoming Celebrations </div>
        </div>
      </div>
    </div>
  );
}
