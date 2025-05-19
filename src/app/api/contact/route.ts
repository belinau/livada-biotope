import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Define validation schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  phone: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy',
  }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = contactFormSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: validation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })) 
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, phone } = validation.data;
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Livada Biotope <noreply@livadabiotope.org>',
      to: ['info@livadabiotope.org'],
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
            <p style="margin: 0; white-space: pre-line;">${message}</p>
          </div>
          <div style="margin-top: 30px; font-size: 0.9em; color: #7f8c8d; border-top: 1px solid #ecf0f1; padding-top: 15px;">
            <p>This message was sent from the contact form on Livada Biotope's website.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send message. Please try again later.' 
        },
        { status: 500 }
      );
    }

    // Send a confirmation email to the user
    await resend.emails.send({
      from: 'Livada Biotope <noreply@livadabiotope.org>',
      to: [email],
      subject: 'Thank you for contacting Livada Biotope',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you for your message, ${name}!</h2>
          <p>We have received your message and will get back to you as soon as possible. Here's a copy of your submission:</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="white-space: pre-line; margin: 15px 0 0 0;">${message}</p>
          </div>
          
          <p>We typically respond within 1-2 business days.</p>
          
          <div style="margin-top: 30px; font-size: 0.9em; color: #7f8c8d; border-top: 1px solid #ecf0f1; padding-top: 15px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p> ${new Date().getFullYear()} Livada Biotope. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic route handling
