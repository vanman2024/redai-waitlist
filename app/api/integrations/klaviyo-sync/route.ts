import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_API_URL = 'https://a.klaviyo.com/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      first_name,
      last_name,
      phone,
      user_type,
      trade,
      country,
      province,
      city,
      company_name,
      industry,
      industry_other,
      hiring_needs,
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!KLAVIYO_API_KEY) {
      console.error('KLAVIYO_PRIVATE_API_KEY not configured');
      return NextResponse.json({ error: 'Klaviyo not configured' }, { status: 500 });
    }

    // Format industry display
    let industryDisplay = industry;
    if (industry === 'other' && industry_other) {
      industryDisplay = `Other (${industry_other})`;
    } else if (industry) {
      industryDisplay = industry.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // Format hiring needs (multiple trades)
    let hiringNeedsDisplay = '';
    if (hiring_needs) {
      const trades = hiring_needs.split(',').filter(Boolean).map((t: string) =>
        t.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      );
      hiringNeedsDisplay = trades.join(', ');
    }

    // Create/update profile in Klaviyo
    const profileData = {
      data: {
        type: 'profile',
        attributes: {
          email: email,
          first_name: first_name || '',
          last_name: last_name || '',
          phone_number: phone || '',
          properties: {
            user_type: user_type,
            trade: trade || '',
            country: country || '',
            province: province || '',
            city: city || '',
            company_name: company_name || '',
            industry: industryDisplay || '',
            hiring_needs: hiringNeedsDisplay || '',
            waitlist_signup_date: new Date().toISOString(),
          },
        },
      },
    };

    // Create or update profile
    const profileResponse = await fetch(`${KLAVIYO_API_URL}/profiles/`, {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15', // Klaviyo API version
      },
      body: JSON.stringify(profileData),
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Klaviyo profile creation failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to sync to Klaviyo', details: errorText },
        { status: profileResponse.status }
      );
    }

    const profileResult = await profileResponse.json();
    const profileId = profileResult.data?.id;
    console.log('✅ Profile synced to Klaviyo:', email);

    // Step 2: Add profile to "Waitlist" list
    // First, we need to get or create the Waitlist list
    // For now, we'll use a hardcoded list ID - you'll need to create this list in Klaviyo dashboard
    // Or we can create it programmatically (see commented code below)

    const WAITLIST_LIST_ID = process.env.KLAVIYO_WAITLIST_LIST_ID;

    if (WAITLIST_LIST_ID && profileId) {
      try {
        const addToListResponse = await fetch(`${KLAVIYO_API_URL}/lists/${WAITLIST_LIST_ID}/relationships/profiles/`, {
          method: 'POST',
          headers: {
            'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
            'Content-Type': 'application/json',
            'revision': '2024-10-15',
          },
          body: JSON.stringify({
            data: [{ type: 'profile', id: profileId }]
          }),
        });

        if (addToListResponse.ok) {
          console.log('✅ Added to Waitlist list:', email);
        } else {
          const errorText = await addToListResponse.text();
          console.error('Failed to add to list:', errorText);
        }
      } catch (error) {
        console.error('Error adding to list:', error);
      }
    }

    // Step 3: Send custom event "Joined Waitlist"
    if (profileId) {
      try {
        const eventData = {
          data: {
            type: 'event',
            attributes: {
              profile: {
                data: {
                  type: 'profile',
                  id: profileId
                }
              },
              metric: {
                data: {
                  type: 'metric',
                  attributes: {
                    name: 'Joined Waitlist'
                  }
                }
              },
              properties: {
                user_type: user_type,
                trade: trade || '',
                country: country || '',
                province: province || '',
                city: city || '',
                company_name: company_name || '',
                industry: industryDisplay || '',
                hiring_needs: hiringNeedsDisplay || '',
              },
              time: new Date().toISOString(),
            }
          }
        };

        const eventResponse = await fetch(`${KLAVIYO_API_URL}/events/`, {
          method: 'POST',
          headers: {
            'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
            'Content-Type': 'application/json',
            'revision': '2024-10-15',
          },
          body: JSON.stringify(eventData),
        });

        if (eventResponse.ok) {
          console.log('✅ Event "Joined Waitlist" sent:', email);
        } else {
          const errorText = await eventResponse.text();
          console.error('Failed to send event:', errorText);
        }
      } catch (error) {
        console.error('Error sending event:', error);
      }
    }

    return NextResponse.json({
      success: true,
      profile_id: profileId,
    });
  } catch (error) {
    console.error('Klaviyo sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync to Klaviyo' },
      { status: 500 }
    );
  }
}
