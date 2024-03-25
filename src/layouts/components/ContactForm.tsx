'use client'
import React, { useState, useRef } from 'react';

const ContactForm = () => {
    // Create a ref to store the form element
  const formRef = useRef<HTMLFormElement>(null);
  // State to manage the submission status and messages
  const [formStatus, setFormStatus] = useState<{ message: string; isSuccess: boolean | null }>({
    message: '',
    isSuccess: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string };
      email: { value: string };
      message: { value: string };
      honeypot: { value: string }; // Honeypot for bot detection
    };

    // Early return if honeypot field is filled, assuming it's a bot submission
    if (target.honeypot.value) return;

    const formData = {
      name: target.name.value,
      email: target.email.value,
      message: target.message.value,
    };

    // Attempt to send the form data to the API
    try {
      const response = await fetch('/api/sendmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({ message: 'Your message has been sent successfully!', isSuccess: true });
        formRef.current?.reset(); // Reset the form on success
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
        console.error('Error during form submission: ', error);
        let errorMessage = 'There was an error sending your message. Please try again.';
        if (error instanceof Error) {
          // Optionally process the error further or log it
          errorMessage = error.message; // This is more for logging. Since you're in client-side, showing detailed error messages from exceptions might not be user-friendly or secure.
        }
        setFormStatus({ message: errorMessage, isSuccess: false });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-6">
          <label htmlFor="name" className="form-label">Fullständigt namn <span className="text-red-500">*</span></label>
          <input id="name" name="name" type="text" required className="form-input" placeholder="John Doe" />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="form-label">E-mail <span className="text-red-500">*</span></label>
          <input id="email" name="email" type="email" required className="form-input" placeholder="john.doe@email.com" />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="form-label">Meddelande <span className="text-red-500">*</span></label>
          <textarea id="message" name="message" required className="form-input" placeholder="Ditt meddelande..." rows={8}></textarea>
        </div>
        {/* Honeypot Field: Invisible to users but might be filled by bots */}
        <div style={{ display: 'none' }}>
          <input id="honeypot" name="honeypot" type="text" tabIndex={-1} />
        </div>
        <button type="submit" className="btn btn-primary">Skicka</button>
      </form>
      {formStatus.isSuccess !== null && (
        <div className={formStatus.isSuccess ? 'alert-success' : 'alert-error'}>
          {formStatus.message}
        </div>
      )}
    </>
  );
};

export default ContactForm;
