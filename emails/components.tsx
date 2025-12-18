import React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
}

export const EmailLayout = ({ children, preview }: EmailLayoutProps) => (
  <Html>
    <Head />
    {preview && <Preview>{preview}</Preview>}
    <Body style={main}>
      <Container style={container}>{children}</Container>
    </Body>
  </Html>
);

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
}

export const EmailButton = ({ href, children }: EmailButtonProps) => (
  <Button href={href} style={button}>
    {children}
  </Button>
);

interface EmailHighlightProps {
  variant?: 'info' | 'success' | 'warning';
  children: React.ReactNode;
}

export const EmailHighlight = ({ variant = 'info', children }: EmailHighlightProps) => {
  const colors = {
    info: '#eff6ff',
    success: '#f0fdf4',
    warning: '#fef3c7',
  };
  
  return (
    <Section style={{ ...highlight, backgroundColor: colors[variant] }}>
      <Text style={{ margin: 0 }}>{children}</Text>
    </Section>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
};

const highlight = {
  padding: '16px',
  borderRadius: '8px',
  marginTop: '16px',
  marginBottom: '16px',
};
