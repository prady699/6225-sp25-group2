import { NextResponse } from 'next/server';

/**
 * Health check endpoint for AWS
 * This endpoint returns a 200 OK response with basic system information
 * AWS services like ELB, ALB, and Route53 use this to verify the application is running
 */
export async function GET() {
  try {
    // Get basic system information
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
      memoryUsage: process.memoryUsage().rss / 1024 / 1024, // Convert to MB
    };

    // Return a 200 OK response with the health data
    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Even if there's an error collecting metrics, we still return 200
    // because the application is running and can handle requests
    return NextResponse.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      message: 'Application is running but some metrics are unavailable'
    }, { status: 200 });
  }
}
