import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get database statistics
    const userCount = await prisma.user.count();
    const reportCount = await prisma.report.count();
    const transactionCount = await prisma.transaction.count();
    const feedbackCount = await prisma.feedback.count();
    
    // Get PRO users count
    const proUsersCount = await prisma.user.count({
      where: {
        isPro: true,
        proExpiresAt: {
          gt: new Date()
        }
      }
    });
    
    // Get today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayReports = await prisma.report.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });
    
    const todayUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });
    
    // Get total reports per user (AI usage)
    const topUsers = await prisma.user.findMany({
      select: {
        email: true,
        _count: {
          select: {
            reports: true
          }
        }
      },
      orderBy: {
        reports: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Estimate database queries (rough calculation)
    // Each report generation = ~10-15 DB queries
    // Each user login = ~3-5 queries  
    // Each transaction = ~2-3 queries
    const estimatedQueries = (reportCount * 12) + (userCount * 4) + (transactionCount * 3);

    const stats = {
      tables: {
        users: userCount,
        reports: reportCount,
        transactions: transactionCount,
        feedbacks: feedbackCount
      },
      activity: {
        proUsers: proUsersCount,
        todayReports: todayReports,
        todayUsers: todayUsers
      },
      usage: {
        estimatedQueries: estimatedQueries,
        avgQueriesPerUser: Math.round(estimatedQueries / userCount),
        topUsers: topUsers
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Database stats error:", error);
    return NextResponse.json({ error: "Failed to fetch database stats" }, { status: 500 });
  }
}