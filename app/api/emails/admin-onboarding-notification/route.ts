import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clerk_user_id,
      user_type,
      pathway_type,
      trade,
      city,
      province,
      home_country,
      target_province,
      year_level,
    } = body;

    // Get user email from Supabase
    const { data: userData } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', clerk_user_id)
      .single();

    // Get trade name
    const { data: tradeData } = await supabase
      .from('trade_specializations')
      .select('name_en')
      .eq('code', trade)
      .single();

    const email = userData?.email || 'Unknown';
    const name = userData?.full_name || 'Unknown';
    const tradeName = tradeData?.name_en || trade;

    // Format user type
    const typeLabel = user_type === 'student' ? 'Student' :
                     user_type === 'international' ? 'International Student' :
                     user_type === 'employer' ? 'Employer' :
                     user_type === 'immigration_consultant' ? 'Immigration Consultant' :
                     user_type;

    // Format location
    const location = home_country !== 'CA'
      ? `${home_country} → ${target_province}, Canada`
      : `${city}, ${province}, Canada`;

    // Send email to admin
    await resend.emails.send({
      from: 'RedSealHub <notifications@redsealhub.com>',
      to: 'ryan@redsealhub.com',
      subject: `✅ Onboarding Complete: ${name} (${typeLabel})`,
      html: `
        <h2>User Completed Onboarding!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>User Type:</strong> ${typeLabel}</p>
        <p><strong>Pathway:</strong> ${pathway_type}</p>
        ${year_level ? `<p><strong>Year Level:</strong> ${year_level}</p>` : ''}
        <p><strong>Trade:</strong> ${tradeName}</p>
        <p><strong>Location:</strong> ${location}</p>
        <hr />
        <p><small>User ID: ${clerk_user_id}</small></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send admin onboarding notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
