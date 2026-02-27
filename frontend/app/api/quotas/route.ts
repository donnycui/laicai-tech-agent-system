import { NextResponse } from 'next/server'
import { getQuotas } from '@/lib/supabase'

export async function GET() {
  try {
    const data = await getQuotas()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching quotas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotas' },
      { status: 500 }
    )
  }
}
