import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      first_name,
      last_name,
      user_type,
      trade,
      country,
      province,
      city,
      phone,
      company_name,
      industry,
      industry_other,
      hiring_needs,
      signup_time
    } = body;

    const fullName = name || [first_name, last_name].filter(Boolean).join(' ') || 'Unknown';
    const location = [city, province, country].filter(Boolean).join(', ') || 'Not provided';

    // Format user type for display
    const userTypeLabels: Record<string, string> = {
      'student': 'Student/Apprentice',
      'employer': 'Employer',
      'immigration_consultant': 'Immigration Consultant',
      'international_worker': 'International Student',
      'mentor': 'Mentor/Instructor'
    };
    const userTypeLabel = userTypeLabels[user_type] || user_type;

    // Build user type specific details
    let typeDetails = '';
    if (user_type === 'student' || user_type === 'international_worker') {
      typeDetails += trade ? `<p><strong>Trade:</strong> ${trade}</p>` : '';
    }
    if (user_type === 'employer') {
      typeDetails += company_name ? `<p><strong>Company:</strong> ${company_name}</p>` : '';

      // Show industry with "Other" specification if applicable
      if (industry) {
        const industryDisplay = industry === 'other' && industry_other
          ? `Other (${industry_other})`
          : industry.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        typeDetails += `<p><strong>Industry:</strong> ${industryDisplay}</p>`;
      }

      // Show hiring needs (multiple trades)
      if (hiring_needs) {
        const trades = hiring_needs.split(',').filter(Boolean).map((t: string) =>
          t.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        );
        typeDetails += `<p><strong>Hiring For:</strong> ${trades.join(', ')}</p>`;
      }
    }

    // Send email to admin
    await resend.emails.send({
      from: 'Red Seal Hub <notifications@send.redsealhub.com>',
      to: 'ryan@redsealhub.com',
      subject: `🎯 New Waitlist Signup: ${fullName} (${userTypeLabel})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">🎉 New Waitlist Signup!</h2>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Contact Information</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Location:</strong> ${location}</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">User Type Details</h3>
            <p><strong>User Type:</strong> ${userTypeLabel}</p>
            ${typeDetails}
          </div>

          <div style="background: #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Signup Time:</strong> ${new Date(signup_time).toLocaleString()}</p>
          </div>

          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="font-size: 12px; color: #6b7280;">
            This is an automated notification from the Red Seal Hub waitlist system.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send admin waitlist notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
