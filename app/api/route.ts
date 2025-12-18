import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.name || !body.user_type) {
      return NextResponse.json(
        { error: 'Email, name, and user type are required' },
        { status: 400 }
      );
    }

    // Validate user_type
    const validUserTypes = ['student', 'employer', 'immigration_consultant', 'international_worker'];
    if (!validUserTypes.includes(body.user_type)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabase = getSupabaseServer();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Prepare data for insertion
    const waitlistData: Record<string, any> = {
      email: body.email.toLowerCase().trim(),
      name: body.name.trim(),
      first_name: body.firstName?.trim(),
      last_name: body.lastName?.trim(),
      phone: body.phone?.trim(),
      country: body.country?.trim(),
      province: body.province?.trim(),
      city: body.city?.trim(),
      user_type: body.user_type,
      status: 'pending',
    };

    // Add type-specific fields
    if (body.user_type === 'student' || body.user_type === 'international_worker') {
      if (body.trade) waitlistData.trade = body.trade.trim();
      if (body.apprenticeship_year) waitlistData.apprenticeship_year = body.apprenticeship_year.trim();
      if (body.is_apprentice) waitlistData.is_apprentice = body.is_apprentice;
      if (body.is_challenging) waitlistData.is_challenging = body.is_challenging;
      if (body.challenge_date) waitlistData.challenge_date = body.challenge_date;
    }

    if (body.user_type === 'employer') {
      if (body.company_name) waitlistData.company_name = body.company_name.trim();
      if (body.industry) waitlistData.industry = body.industry.trim();
      if (body.industry_other) waitlistData.industry_other = body.industry_other.trim();
      if (body.hiring_needs) waitlistData.hiring_needs = body.hiring_needs.trim();
    }

    if (body.user_type === 'immigration_consultant') {
      if (body.rcic_number) waitlistData.rcic_number = body.rcic_number.trim();
    }

    if (body.user_type === 'international_worker') {
      if (body.country) waitlistData.country = body.country.trim();
      if (body.experience_years) waitlistData.experience_years = body.experience_years.trim();
    }

    if (body.user_type === 'mentor') {
      if (body.mentor_trade) waitlistData.mentor_trade = body.mentor_trade.trim();
      if (body.years_experience) waitlistData.years_experience = body.years_experience.trim();
      if (body.certification_level) waitlistData.certification_level = body.certification_level.trim();
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([waitlistData])
      .select()
      .single();

    if (error) {
      // Handle duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      );
    }

    // Send welcome email to user
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/emails/send-waitlist-welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          userType: data.user_type,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification to admin
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/emails/admin-waitlist-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          first_name: data.first_name,
          last_name: data.last_name,
          user_type: data.user_type,
          trade: data.trade,
          country: data.country,
          province: data.province,
          city: data.city,
          phone: data.phone,
          company_name: data.company_name,
          industry: data.industry,
          industry_other: data.industry_other,
          hiring_needs: data.hiring_needs,
          signup_time: data.created_at,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }

    // Sync to Klaviyo
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrations/klaviyo-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          user_type: data.user_type,
          trade: data.trade,
          country: data.country,
          province: data.province,
          city: data.city,
          company_name: data.company_name,
          industry: data.industry,
          industry_other: data.industry_other,
          hiring_needs: data.hiring_needs,
        }),
      });
    } catch (klaviyoError) {
      console.error('Failed to sync to Klaviyo:', klaviyoError);
      // Don't fail the request if Klaviyo sync fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined the waitlist',
        data: {
          id: data.id,
          email: data.email,
          user_type: data.user_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if email exists (for admin use)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter required' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from('waitlist')
    .select('email, user_type, created_at')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !data) {
    return NextResponse.json(
      { exists: false },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      exists: true,
      user_type: data.user_type,
      joined_at: data.created_at,
    },
    { status: 200 }
  );
}
