import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WaitlistWelcomeEmail } from '@/emails/waitlist-welcome';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, userType } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Red Seal Hub <noreply@send.redsealhub.com>',
      to: email,
      subject: "You're on the Red Seal Hub Waitlist! 🎉",
      react: React.createElement(WaitlistWelcomeEmail, {
        customerName: name,
        userType: userType
      }),
    });

    if (error) {
      console.error('Error sending waitlist welcome email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in send-waitlist-welcome:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
