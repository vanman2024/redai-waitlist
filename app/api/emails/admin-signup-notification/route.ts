import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { user_id, email, first_name, last_name, signup_time } = body;

    const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'Unknown';

    // Send email to admin
    await resend.emails.send({
      from: 'RedSealHub <notifications@redsealhub.com>',
      to: 'ryan@redsealhub.com',
      subject: `🎉 New Signup: ${fullName}`,
      html: `
        <h2>New User Signed Up!</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>User ID:</strong> ${user_id}</p>
        <p><strong>Signup Time:</strong> ${new Date(signup_time).toLocaleString()}</p>
        <hr />
        <p><em>Note: User type and location will be available after they complete onboarding.</em></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
