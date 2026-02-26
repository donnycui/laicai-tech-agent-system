import { NextResponse } from 'next/server'
import { getMissionPipeline } from '@/lib/supabase'

export async function GET() {
  try {
    const data = await getMissionPipeline()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching mission pipeline:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mission pipeline' },
      { status: 500 }
    )
  }
}
