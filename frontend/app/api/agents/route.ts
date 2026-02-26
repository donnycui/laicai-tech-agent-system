import { NextResponse } from 'next/server'
import { getAgentStats } from '@/lib/supabase'

export async function GET() {
  try {
    const agents = await getAgentStats()
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agent stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent stats' },
      { status: 500 }
    )
  }
}
