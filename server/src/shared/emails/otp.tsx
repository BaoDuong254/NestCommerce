import { Body, Container, Head, Heading, Html, Link, Section, Text } from "@react-email/components";
import * as React from "react";

interface OtpEmailProps {
  code: string;
  expiryTime: number;
  title?: string;
}

export default function OtpEmail({
  code = "123456",
  expiryTime = 10,
  title = "Email Verification",
}: OtpEmailProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <Html lang='en'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <title>{title}</title>
      </Head>
      <Body style={styles.body}>
        <Container style={styles.emailContainer}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>🛒 Ecommerce</Heading>
            <Text style={styles.headerSubtitle}>Secure Email Verification</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>Hello,</Text>

            <Text style={styles.message}>
              We received a request to verify your email address. To complete the verification process, please use the
              One-Time Password (OTP) code below:
            </Text>

            {/* OTP Box */}
            <Section style={styles.otpContainer}>
              <Text style={styles.otpLabel}>Your Verification Code</Text>
              <Text style={styles.otpCode}>{code}</Text>
              <Text style={styles.otpExpiry}>
                ⏱️ This code will expire in <strong>{expiryTime} minutes</strong>
              </Text>
            </Section>

            {/* Warning */}
            <Section style={styles.warning}>
              <Text style={styles.warningText}>
                <strong>⚠️ Security Notice:</strong> If you didn't request this code, please ignore this email or
                contact our support team immediately.
              </Text>
            </Section>

            <Section style={styles.divider} />

            {/* Additional Info */}
            <Section style={styles.info}>
              <Text style={styles.infoText}>
                <strong>Why did you receive this email?</strong>
              </Text>
              <Text style={styles.infoText}>
                This email was sent because someone attempted to verify an account using your email address on
                Ecommerce. If this wasn't you, no action is needed.
              </Text>
            </Section>

            <Section style={styles.infoSection}>
              <Text style={styles.infoText}>
                <strong>Need help?</strong>
              </Text>
              <Text style={styles.infoText}>
                If you're having trouble with your account or have any questions, feel free to reach out to our support
                team.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>
              <strong>Ecommerce</strong>
            </Text>
            <Text style={styles.footerTagline}>Your trusted online shopping destination</Text>
            <Section style={styles.footerLinks}>
              <Text style={styles.footerLinksText}>
                <Link href='#' style={styles.footerLink}>
                  Help Center
                </Link>{" "}
                |{" "}
                <Link href='#' style={styles.footerLink}>
                  Contact Support
                </Link>{" "}
                |{" "}
                <Link href='#' style={styles.footerLink}>
                  Privacy Policy
                </Link>
              </Text>
            </Section>
            <Text style={styles.footerCopyright}>© {currentYear} Ecommerce. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: "1.6",
    color: "#333333",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    margin: 0,
  },
  emailContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 30px",
    textAlign: "center" as const,
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#ffffff",
    margin: "0 0 10px 0",
  },
  headerSubtitle: {
    fontSize: "16px",
    opacity: 0.9,
    color: "#ffffff",
    margin: 0,
  },
  content: {
    padding: "40px 30px",
  },
  greeting: {
    fontSize: "18px",
    color: "#333333",
    marginBottom: "20px",
  },
  message: {
    fontSize: "16px",
    color: "#666666",
    marginBottom: "30px",
    lineHeight: "1.8",
  },
  otpContainer: {
    backgroundColor: "#f8f9fa",
    border: "2px dashed #667eea",
    borderRadius: "8px",
    padding: "30px",
    textAlign: "center" as const,
    margin: "30px 0",
  },
  otpLabel: {
    fontSize: "14px",
    color: "#666666",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginBottom: "15px",
    fontWeight: "600",
  },
  otpCode: {
    fontSize: "36px",
    fontWeight: "bold" as const,
    color: "#667eea",
    letterSpacing: "8px",
    fontFamily: '"Courier New", monospace',
    margin: "10px 0",
  },
  otpExpiry: {
    fontSize: "14px",
    color: "#999999",
    marginTop: "15px",
  },
  warning: {
    backgroundColor: "#fff3cd",
    borderLeft: "4px solid #ffc107",
    padding: "15px",
    margin: "25px 0",
    borderRadius: "4px",
  },
  warningText: {
    fontSize: "14px",
    color: "#856404",
    margin: 0,
  },
  divider: {
    height: "1px",
    backgroundColor: "#e9ecef",
    margin: "30px 0",
  },
  info: {
    fontSize: "14px",
    color: "#666666",
    marginTop: "25px",
    lineHeight: "1.6",
  },
  infoSection: {
    fontSize: "14px",
    color: "#666666",
    marginTop: "20px",
    lineHeight: "1.6",
  },
  infoText: {
    fontSize: "14px",
    color: "#666666",
    lineHeight: "1.6",
    margin: "0 0 10px 0",
  },
  footer: {
    backgroundColor: "#f8f9fa",
    padding: "30px",
    textAlign: "center" as const,
    borderTop: "1px solid #e9ecef",
  },
  footerBrand: {
    fontSize: "14px",
    color: "#999999",
    marginBottom: "10px",
  },
  footerTagline: {
    fontSize: "14px",
    color: "#999999",
    marginBottom: "10px",
  },
  footerLinks: {
    marginTop: "15px",
  },
  footerLinksText: {
    fontSize: "14px",
    margin: 0,
  },
  footerLink: {
    color: "#667eea",
    textDecoration: "none",
    margin: "0 10px",
    fontSize: "14px",
  },
  footerCopyright: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#999999",
  },
};
