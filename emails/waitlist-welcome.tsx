import React from 'react';
import { Section, Text } from '@react-email/components';
import { EmailLayout, EmailButton, EmailHighlight } from './components';

interface WaitlistWelcomeEmailProps {
  customerName?: string;
  userType?: 'student' | 'employer' | 'immigration_consultant' | 'international_worker' | 'mentor';
}

export const WaitlistWelcomeEmail: React.FC<WaitlistWelcomeEmailProps> = ({
  customerName,
  userType = 'student',
}) => {
  const nameGreeting = customerName ? `Hi ${customerName}` : 'Welcome';

  // Dynamic content based on user type
  const userTypeContent = {
    student: {
      title: 'exam preparation and career platform',
      features: [
        'AI-powered Red Seal exam preparation',
        'Personalized study plans that adapt to you',
        'Thousands of practice questions',
        'Job matching after you pass',
        'Career guidance and mentorship'
      ]
    },
    employer: {
      title: 'skilled trades recruitment platform',
      features: [
        'Access verified skilled workers',
        'Post unlimited job openings',
        'Smart candidate matching by trade and location',
        'Direct messaging with candidates',
        'Skills assessment and exam scores'
      ]
    },
    immigration_consultant: {
      title: 'immigration and trades platform',
      features: [
        'Connect with pre-qualified international workers',
        'Track client exam prep progress',
        'Help clients secure job offers',
        'Earn referral revenue',
        'Verified RCIC profile badge'
      ]
    },
    international_worker: {
      title: 'Canadian skilled trades immigration platform',
      features: [
        'Study for Red Seal in 99 languages',
        'Get matched with sponsoring employers',
        'Find verified immigration consultants',
        'Understand credential recognition',
        'Settlement resources and community support'
      ]
    },
    mentor: {
      title: 'mentorship and education platform',
      features: [
        'Connect with apprentices in your trade',
        'Share your expertise and knowledge',
        'Build your reputation in the community',
        'Track your mentoring impact',
        'Support the next generation'
      ]
    }
  };

  const content = userTypeContent[userType];

  return (
    <EmailLayout
      previewText="You're on the Red Seal Hub Waitlist!"
      headerTitle="Welcome to Red Seal Hub!"
    >
      <Text style={{ fontSize: '16px', marginTop: 0 }}>
        {nameGreeting}! 👋
      </Text>

      <Text>
        Thank you for signing up for Red Seal Hub! We're excited to have you join us on this journey.
      </Text>

      <EmailHighlight variant="success">
        <strong>🎉 You're on the Waitlist!</strong><br />
        We're working hard to build the best {content.title} for skilled trades professionals.
      </EmailHighlight>

      <Section style={{ marginTop: '32px', marginBottom: '32px' }}>
        <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          What happens next?
        </Text>

        <Text style={{ marginBottom: '12px' }}>
          📧 <strong>We'll keep you updated</strong> - You'll receive emails about our progress and launch plans
        </Text>

        <Text style={{ marginBottom: '12px' }}>
          🚀 <strong>Beta launch in January 2026</strong> - You'll be among the first to access the platform
        </Text>

        <Text style={{ marginBottom: '12px' }}>
          💡 <strong>Your feedback matters</strong> - Help shape the future of skilled trades
        </Text>
      </Section>

      <EmailHighlight variant="info">
        <strong>What we're building for you:</strong><br />
        {content.features.map((feature, index) => (
          <React.Fragment key={index}>
            • {feature}<br />
          </React.Fragment>
        ))}
      </EmailHighlight>

      <Text style={{ marginTop: '32px', fontSize: '14px', color: '#666' }}>
        <strong>Questions or suggestions?</strong><br />
        We'd love to hear from you! Email us at <a href="mailto:ryan@redsealhub.com" style={{ color: '#dc2626' }}>ryan@redsealhub.com</a>
      </Text>

      <Text style={{ fontSize: '14px', color: '#666', marginTop: '16px' }}>
        Stay tuned for more updates!<br />
        The Red Seal Hub Team
      </Text>
    </EmailLayout>
  );
};

export default WaitlistWelcomeEmail;
