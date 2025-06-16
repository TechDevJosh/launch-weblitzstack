'use client';

import React, { useState, useMemo, useEffect } from 'react';

// --- Configuration based on Pricing Strategy Handbook ---
const PRICING_CONFIG = {
  tiers: [
    {
      id: 'standard',
      name: 'Standard Tier',
      setupFee: 5000,
      monthlyFee: 500,
      description:
        'A local business, freelancer, or small shop needing a professional online presence.',
      features: [
        '4 essential pages (Home, About, Services, Contact)',
        'CMS (admin panel) for easy updates',
        'Fully managed hosting & database',
        'Domain purchase & yearly renewal included',
        'Mobile responsive design',
        'Basic SEO (meta, alt text, slugs)',
        'HTTPS/SSL security & Google Analytics',
        'Free yearly refresh (minor updates)',
      ],
    },
    {
      id: 'plus',
      name: 'Plus Tier',
      setupFee: 15000,
      monthlyFee: 1000,
      description:
        'A clinic, service provider, or scaling brand needing to capture leads and bookings.',
      features: [
        '4 essential pages (Home, About, Services, Contact)',
        'CMS (admin panel) for easy updates',
        'Fully managed hosting & database',
        'Domain purchase & yearly renewal included',
        'Mobile responsive design',
        'Basic SEO (meta, alt text, slugs)',
        'HTTPS/SSL security & Google Analytics',
        'Free yearly refresh (minor updates)',
        'Up to 8 total pages',
        'Blog setup (CMS-enabled)',
        'Inquiry/booking forms',
        'Testimonials carousel / photo gallery',
        'WhatsApp or FB Messenger live chat',
        '1 monthly content upload & Priority support',
        'Quarterly performance reports',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Tier',
      setupFee: 30000,
      monthlyFee: 2000,
      description:
        'A growing business focused on automation, payments, and advanced features.',
      features: [
        '4 essential pages (Home, About, Services, Contact)',
        'CMS (admin panel) for easy updates',
        'Fully managed hosting & database',
        'Domain purchase & yearly renewal included',
        'Mobile responsive design',
        'Basic SEO (meta, alt text, slugs)',
        'HTTPS/SSL security & Google Analytics',
        'Free yearly refresh (minor updates)',
        'Up to 8 total pages',
        'Blog setup (CMS-enabled)',
        'Inquiry/booking forms',
        'Testimonials carousel / photo gallery',
        'WhatsApp or FB Messenger live chat',
        '1 monthly content upload & Priority support',
        'Quarterly performance reports',
        'AI chatbot (FAQ or contact assistant)',
        'Custom quote/survey forms',
        'Online payment gateway integration',
        'Advanced animations & custom UI polish',
        'SEO-ready content structure',
        'Up to 3 monthly content uploads',
        'Monthly SEO & analytics reports',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Tier',
      setupFee: 0, // Quote-based
      monthlyFee: 0, // Quote-based
      description:
        'A larger enterprise (hotel, real estate, SaaS) needing a custom-built platform.',
      features: [
        'Fully customized solution',
        'Hotel/resort booking engines',
        'Full-scale e-commerce',
        'Franchise / multi-branch structures',
        'Custom dashboard or admin portal',
        'Multi-language support',
        'API integrations & automation workflows',
        'Dedicated support & consultation',
      ],
    },
  ],
  addOns: [
    {
      id: 'logo',
      label: 'Logo Design (2 concepts)',
      price: 2000,
      description:
        'Get two professionally designed logo options to match your brand identity.',
    },
    {
      id: 'extraPage',
      label: 'Extra Page',
      price: 1000,
      description:
        'Add additional custom-designed pages for services, FAQs, or anything else you need.',
    },
    {
      id: 'bookingCalendar',
      label: 'Booking Calendar',
      price: 3000,
      description:
        'Allow visitors to book appointments or reservations directly from your site.',
    },
    {
      id: 'gallery',
      label: 'Gallery/Carousel',
      price: 1500,
      description:
        'Show off your photos or portfolio in an interactive, scrollable image section.',
    },
    {
      id: 'customForms',
      label: 'Custom Forms (Quote/Survey)',
      price: 1500,
      description:
        'Collect leads, inquiries, or feedback through personalized, data-driven forms.',
    },
    {
      id: 'socialFeed',
      label: 'Social Media Feed',
      price: 1000,
      description:
        'Embed your live Facebook or Instagram feed to keep your site fresh and connected.',
    },
    {
      id: 'multiLanguage',
      label: 'Multi-language Site',
      price: 3000,
      description:
        'Reach a wider audience by adding support for multiple languages.',
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce Add-on (10 items)',
      price: 15000,
      description:
        'Turn your site into a mini-online store with product listings, cart, and checkout.',
    },
  ],
};

const CheckIcon = (props) => (
  <svg
    className={`w-5 h-5 text-green-400 ${props.className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// --- Reusable Components ---
const FinalQuoteSummary = ({ finalPackage }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 text-left space-y-3 mb-8">
    <h3 className="text-2xl font-bold border-b border-gray-600 pb-3 mb-4">
      {finalPackage.tier.name}
    </h3>
    <p className="text-gray-400 italic">
      This package includes the following features and benefits:
    </p>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
      {finalPackage.tier.features.map((feature) => (
        <li key={feature} className="flex items-start">
          <CheckIcon className="flex-shrink-0 mr-2 mt-1" />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    {finalPackage.addOns.length > 0 && (
      <div className="pt-4 border-t border-gray-700/50 mt-4">
        <h4 className="text-xl font-bold mb-2 text-blue-300">
          Selected Add-ons:
        </h4>
        <ul className="space-y-2">
          {finalPackage.addOns.map((addon) => (
            <li key={addon.id} className="flex items-start">
              <CheckIcon className="flex-shrink-0 mr-2 mt-1" />
              <span className="text-gray-300">{addon.label}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className="flex justify-between items-center text-2xl mt-6 pt-4 border-t border-gray-600">
      <span className="font-bold">Setup Fee:</span>
      <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        ₱{finalPackage.totalSetupFee.toLocaleString()}
      </span>
    </div>
    <div className="flex justify-between items-center text-xl mt-2">
      <span className="font-bold">Monthly Subscription:</span>
      <span className="font-extrabold text-blue-300">
        ₱{finalPackage.monthlyFee.toLocaleString()}/month
      </span>
    </div>
  </div>
);

const ReferralAndShare = ({ referralCode }) => (
  <div className="bg-purple-900/20 border border-purple-700 rounded-2xl p-6 text-center my-10">
    <h3 className="text-2xl font-bold text-white mb-2">Be a Helping Hand!</h3>
    <p className="text-gray-300 mb-4">
      Share this tool with friends, colleagues, or other people who might be
      helped by our transparent pricing and instant quote for websites.
    </p>
    <p className="text-gray-400">Your personal referral code is:</p>
    <div className="my-2 p-3 bg-gray-900 text-2xl font-mono tracking-widest text-purple-400 rounded-md border border-dashed border-purple-600">
      {referralCode}
    </div>
    <div className="flex justify-center items-center gap-4 mt-4">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=https://launch.weblitzstack.com`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=https://launch.weblitzstack.com&text=Get a transparent, instant quote for your website with WeblitzStack!`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.403 0-6.177 2.942-6.177 6.564 0 .515.061 1.017.165 1.498-5.148-.256-9.714-2.723-12.766-6.471-.529.904-.83 1.948-.83 3.084 0 2.27.994 4.286 2.532 5.464-.928-.028-1.807-.286-2.572-.711v.08c0 2.981 2.177 5.467 5.063 6.039-.525.14-.852.172-1.162.052.802 2.053 3.128 3.553 5.884 3.593-2.932 2.298-6.626 3.702-10.65 3.702-.693 0-1.372-.04-2.035-.112 3.755 2.41 8.243 3.816 13.051 3.816 15.02 0 23.238-12.288 23.238-23.238 0-.354-.01-.707-.022-1.06z" />
        </svg>
      </a>
    </div>
  </div>
);

// --- Main Application Component ---
export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    tier: PRICING_CONFIG.tiers[0].id,
    addOns: [],
    consultationDate: '',
    consultationTime: '',
  });
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isTimeLoading, setIsTimeLoading] = useState(false);
  const [expandedAddOn, setExpandedAddOn] = useState(null);

  // --- Step Definitions ---
  const steps = [
    {
      id: 'welcome',
      title: 'Start Your Instant Quote—Tailored for Your Business',
      subtitle:
        'Our smart tool gives you a transparent, custom website price in less than 60 seconds—no sales talk, just honest numbers.',
      isWelcome: true,
    },
    {
      key: 'fullName',
      id: 'fullName',
      title: "What's your full name?",
      type: 'text',
      placeholder: 'e.g., Juan dela Cruz',
      required: true,
    },
    {
      key: 'email',
      id: 'email',
      title: 'And your email address?',
      type: 'email',
      placeholder: 'you@company.com',
      required: true,
    },
    {
      key: 'contactNumber',
      id: 'contactNumber',
      title: "What's the best number to reach you on?",
      type: 'tel',
      placeholder: 'e.g., 09171234567',
      required: true,
    },
    {
      key: 'tier',
      id: 'tier',
      title: 'Which of these best describes your business?',
      type: 'radio',
      options: PRICING_CONFIG.tiers.map((t) => ({
        label: t.description,
        value: t.id,
      })),
    },
    {
      key: 'addOns',
      id: 'addOns',
      title: 'Any additional one-time features?',
      subtitle: 'Select all that you need.',
      type: 'checkbox',
      options: PRICING_CONFIG.addOns.map((a) => ({
        label: a.label,
        value: a.id,
      })),
    },
    { id: 'summary', isSummary: true },
    { id: 'results', isResults: true },
    {
      id: 'availNow',
      isFinalConfirmation: true,
      title: "We'll Be In Touch!",
      message:
        'Thank you for choosing to proceed. A WeblitzStack team member will contact you shortly using the information you provided to finalize your project.',
    },
    {
      id: 'scheduleForm',
      isScheduleForm: true,
      title: 'Schedule Your Free Consultation',
    },
    {
      id: 'scheduleConfirmation',
      isFinalConfirmation: true,
      title: 'Consultation Booked!',
      message:
        "Your consultation time has been reserved. We've sent a confirmation to your email and will send a Zoom/Meet link soon. We look forward to speaking with you!",
    },
  ];

  const currentStepConfig = steps[currentStep];

  const finalPackage = useMemo(() => {
    const selectedTier = PRICING_CONFIG.tiers.find(
      (t) => t.id === formData.tier
    );
    const selectedAddOns = PRICING_CONFIG.addOns.filter((addon) =>
      formData.addOns.includes(addon.id)
    );
    let totalSetupFee = selectedTier.setupFee;
    selectedAddOns.forEach((addon) => {
      totalSetupFee += addon.price;
    });
    const referralCodeValue = formData.fullName
      ? `${formData.fullName.replace(/\s+/g, '').toUpperCase()}5OFF`
      : 'YOURCODE5OFF';
    return {
      tier: selectedTier,
      addOns: selectedAddOns,
      totalSetupFee: totalSetupFee,
      monthlyFee: selectedTier.monthlyFee,
      fullName: formData.fullName,
      email: formData.email,
      referralCode: referralCodeValue,
    };
  }, [formData]);

  // --- NEW: Helper function to generate a plain text summary ---
  const generateSummaryText = (pkg) => {
    let summary = `Tier: ${pkg.tier.name}\n`;
    summary += `One-Time Setup Fee: ₱${pkg.totalSetupFee.toLocaleString()}\n`;
    summary += `Monthly Fee: ₱${pkg.monthlyFee.toLocaleString()}/month\n\n`;

    if (pkg.addOns.length > 0) {
      summary += 'Selected Add-ons:\n';
      pkg.addOns.forEach((addon) => {
        summary += `- ${addon.label}\n`;
      });
    }
    return summary;
  };

  // --- Replace your entire 'saveToSupabase' function with this one ---

  const saveToSupabase = async (formData) => {
    try {
      // --- First, submit the data to Supabase ---
      const supabaseResponse = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          consultation_timestamp: formData.consultationTime,
        }),
      });

      if (!supabaseResponse.ok) {
        const errorResult = await supabaseResponse.json();
        throw new Error(`Supabase error: ${errorResult.error}`);
      }

      const supabaseResult = await supabaseResponse.json();
      console.log('[Supabase] Response:', supabaseResult);

      // --- If Supabase succeeds, generate summary and send confirmation email ---

      const summaryText = generateSummaryText(finalPackage);

      const emailResponse = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          referralCode: finalPackage.referralCode,
          finalPackage: finalPackage,
          consultationTime: formData.consultationTime, // ✅ ADD THIS LINE
        }),
      });

      if (!emailResponse.ok) {
        const errorResult = await emailResponse.json();
        throw new Error(`Resend error: ${errorResult.error}`);
      }

      const emailResult = await emailResponse.json();
      console.log('[Resend] Response:', emailResult);
    } catch (error) {
      console.error(
        '[Submission Error] Failed to submit form or send email:',
        error
      );
    }
  };

  const validateField = (name, value) => {
    let error = '';
    const stepConfig = steps.find((s) => s.key === name);
    if (stepConfig?.required && !value.trim()) {
      error = 'This field is required.';
    } else if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (
      name === 'contactNumber' &&
      value &&
      !/^\d{10,11}$/.test(value.replace(/\s/g, ''))
    ) {
      error = 'Please enter a valid phone number.';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const isStepValid = (stepIndex) => {
    const step = steps[stepIndex];
    if (!step.key || !step.required) return true;
    const value = formData[step.key];
    const error = errors[step.key];
    return (
      value && value.trim() !== '' && (error === '' || error === undefined)
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    validateField(name, value);

    if (name === 'consultationDate' || name === 'consultationTime') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        addOns: checked
          ? [...prev.addOns, name]
          : prev.addOns.filter((id) => id !== name),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const navigateToStepById = (id) => {
    const stepIndex = steps.findIndex((step) => step.id === id);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  const nextStep = () => {
    if (currentStepConfig.key && currentStepConfig.required) {
      const isValid = validateField(
        currentStepConfig.key,
        formData[currentStepConfig.key]
      );
      if (!isValid) return;
    }

    if (currentStepConfig.key === 'contactNumber') {
      const leadData = {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
      };
      console.log('Lead Captured:', leadData);
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const startOver = () => {
    setFormData({
      fullName: '',
      email: '',
      contactNumber: '',
      tier: PRICING_CONFIG.tiers[0].id,
      addOns: [],
      consultationDate: '',
      consultationTime: '',
    });
    setErrors({});
    setCurrentStep(0);
  };

  useEffect(() => {
    if (formData.consultationDate) {
      setIsTimeLoading(true);
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const selectedDate = new Date(formData.consultationDate);
      const availableSlots = [];
      for (let hour = 8; hour < 24; hour++) {
        for (let minute of [0, 30]) {
          if (hour === 23 && minute > 30) continue;
          const phtDate = new Date(
            Date.UTC(
              selectedDate.getUTCFullYear(),
              selectedDate.getUTCMonth(),
              selectedDate.getUTCDate(),
              hour - 8,
              minute
            )
          );
          if (phtDate > new Date()) {
            const userLocaleTime = phtDate.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: userTimezone,
            });
            availableSlots.push({
              value: phtDate.toISOString(),
              label: userLocaleTime,
            });
          }
        }
      }
      setAvailableTimes(availableSlots);
      setIsTimeLoading(false);
    }
  }, [formData.consultationDate]);

  const handleToggleDescription = (addonId) => {
    setExpandedAddOn((prev) => (prev === addonId ? null : addonId));
  };

  const renderStep = () => {
    if (currentStepConfig.isWelcome) {
      return (
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            {currentStepConfig.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {currentStepConfig.subtitle}
          </p>
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition transform hover:scale-105 shadow-lg text-lg"
          >
            Get Your Free Quote
          </button>
        </div>
      );
    }

    if (currentStepConfig.isSummary) {
      if (finalPackage.tier.id === 'enterprise') {
        return (
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Enterprise Consultation
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              For a custom Enterprise solution, we need to connect directly to
              understand your unique requirements. Please schedule a call with
              us to get a detailed quote.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={prevStep}
                className="bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                onClick={() => navigateToStepById('scheduleForm')}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Review Your Quote
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Here’s your personalized package. You can still add or remove
            optional features below.
          </p>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-left space-y-3 mb-8">
            <h3 className="text-2xl font-bold border-b border-gray-600 pb-3 mb-4">
              {finalPackage.tier.name} Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
              {finalPackage.tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckIcon className="flex-shrink-0 mr-2 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-gray-700/50 mt-4">
              <h4 className="text-xl font-bold mb-3 text-blue-300">
                Optional One-Time Add-ons:
              </h4>
              <div className="space-y-3">
                {PRICING_CONFIG.addOns.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center p-3 bg-gray-900 rounded-lg cursor-pointer border-2 border-transparent has-[:checked]:border-blue-500 transition"
                  >
                    <input
                      type="checkbox"
                      name={addon.id}
                      checked={formData.addOns.includes(addon.id)}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-4 flex-grow text-gray-200">
                      {addon.label}
                    </span>
                    <span className="font-semibold text-gray-400">
                      + ₱{addon.price.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl mt-6 pt-4 border-t border-gray-600">
              <span className="font-bold">Setup Fee:</span>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                ₱{finalPackage.totalSetupFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xl mt-2">
              <span className="font-bold">Monthly Subscription:</span>
              <span className="font-extrabold text-blue-300">
                ₱{finalPackage.monthlyFee.toLocaleString()}/month
              </span>
            </div>
          </div>
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={prevStep}
              className="bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-500 transition"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition"
            >
              Confirm & Submit Quote
            </button>
          </div>
        </div>
      );
    }

    if (currentStepConfig.isResults) {
      return (
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Your Quote is Ready!
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Thank you, {finalPackage.fullName}. Here is your complete package
            summary.
          </p>
          <FinalQuoteSummary finalPackage={finalPackage} />
          <p className="text-lg text-gray-300 mb-8">
            What would you like to do next?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                saveToSupabase(formData); // ✅ pass it in
                navigateToStepById('availNow');
              }}
              className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition transform hover:scale-105 shadow-lg text-lg"
            >
              Avail Now
            </button>
            <a
              href="https://www.weblitzstack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 text-white font-bold py-4 px-8 rounded-full hover:bg-gray-600 transition transform hover:scale-105 shadow-lg text-lg"
            >
              Explore Our Website
            </a>
            <button
              onClick={() => navigateToStepById('scheduleForm')}
              className="bg-purple-600 text-white font-bold py-4 px-8 rounded-full hover:bg-purple-700 transition transform hover:scale-105 shadow-lg text-lg"
            >
              Schedule Free Consultation
            </button>
          </div>
          <button
            onClick={startOver}
            className="text-gray-400 hover:text-white transition mt-12"
          >
            Start a New Quote
          </button>
        </div>
      );
    }

    if (currentStepConfig.isFinalConfirmation) {
      return (
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            {currentStepConfig.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            {currentStepConfig.message}
          </p>
          <ReferralAndShare referralCode={finalPackage.referralCode} />
          <button
            onClick={startOver}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition"
          >
            Start New Quote
          </button>
        </div>
      );
    }

    if (currentStepConfig.isScheduleForm) {
      return (
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            {currentStepConfig.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Please select a date and time that works for you. Times are shown in
            your local timezone (
            {Intl.DateTimeFormat().resolvedOptions().timeZone}).
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveToSupabase(formData); // ✅ This triggers final save
              navigateToStepById('scheduleConfirmation');
            }}
            className="space-y-4"
          >
            <input
              type="date"
              name="consultationDate"
              value={formData.consultationDate}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
              required
            />
            {isTimeLoading && <p>Loading times...</p>}
            {formData.consultationDate && availableTimes.length > 0 && (
              <select
                name="consultationTime"
                value={formData.consultationTime}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg"
                required
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            )}
            {formData.consultationDate &&
              !isTimeLoading &&
              availableTimes.length === 0 && (
                <p className="text-yellow-400">
                  No available slots for this day. Please try another date.
                </p>
              )}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigateToStepById('results')}
                className="bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formData.consultationTime}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition disabled:bg-gray-500"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto text-center" key={currentStep}>
        <h2 className="text-3xl font-bold mb-2">
          {formData.fullName && currentStep > 0
            ? `Okay, ${formData.fullName.split(' ')[0]}! `
            : ''}
          {currentStepConfig.title}
        </h2>
        {currentStepConfig.subtitle && (
          <p className="text-lg text-gray-400 mb-8">
            {currentStepConfig.subtitle}
          </p>
        )}

        <div className="mt-8">
          {currentStepConfig.type === 'text' ||
          currentStepConfig.type === 'email' ||
          currentStepConfig.type === 'tel' ? (
            <div>
              <input
                name={currentStepConfig.key}
                type={currentStepConfig.type}
                placeholder={currentStepConfig.placeholder}
                required={currentStepConfig.required}
                aria-label={currentStepConfig.title}
                aria-invalid={!!errors[currentStepConfig.key]}
                aria-describedby={`${currentStepConfig.key}-error`}
                className={`w-full max-w-md mx-auto p-4 bg-gray-700 text-white text-xl text-center border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition ${errors[currentStepConfig.key] ? 'border-red-500' : 'border-gray-600'}`}
                onChange={handleInputChange}
                value={formData[currentStepConfig.key]}
              />
              {errors[currentStepConfig.key] && (
                <p
                  id={`${currentStepConfig.key}-error`}
                  className="text-red-400 text-sm mt-2"
                  aria-live="polite"
                >
                  {errors[currentStepConfig.key]}
                </p>
              )}
            </div>
          ) : currentStepConfig.type === 'radio' ? (
            <div className="space-y-3 text-left">
              {currentStepConfig.options.map((option) => (
                <label
                  htmlFor={`${currentStepConfig.key}-${option.value}`}
                  key={option.value}
                  className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer border-2 border-gray-700 has-[:checked]:border-blue-500 transition-all duration-200 transform hover:scale-102"
                >
                  <input
                    type="radio"
                    id={`${currentStepConfig.key}-${option.value}`}
                    name={currentStepConfig.key}
                    value={option.value}
                    checked={formData[currentStepConfig.key] === option.value}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="ml-4 text-lg text-gray-200">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          ) : currentStepConfig.type === 'checkbox' ? (
            <div className="space-y-3 text-left">
              {PRICING_CONFIG.addOns.map((addon) => {
                const isExpanded = expandedAddOn === addon.id;
                return (
                  <div
                    key={addon.id}
                    className="bg-gray-800 rounded-lg border-2 border-gray-700 has-[:checked]:border-blue-500 transition-all duration-200"
                  >
                    <div className="flex items-center p-4">
                      <input
                        type="checkbox"
                        id={`addon-${addon.id}`}
                        name={addon.id}
                        checked={formData.addOns.includes(addon.id)}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded-lg focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`addon-${addon.id}`}
                        className="ml-4 flex-grow text-lg text-gray-200 cursor-pointer"
                      >
                        {addon.label}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleDescription(addon.id)}
                        className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`More info about ${addon.label}`}
                        aria-expanded={isExpanded}
                      >
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-700/50">
                        <p className="text-gray-300 text-left">
                          {addon.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-500 transition transform hover:scale-105"
            >
              Back
            </button>
          )}
          <button
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const [animationClass, setAnimationClass] = useState('opacity-0');
  useEffect(() => {
    setAnimationClass('opacity-0');
    const timer = setTimeout(() => setAnimationClass('opacity-100'), 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-gradient-to-br from-blue-900 via-transparent to-purple-900 opacity-30 filter blur-3xl rounded-full animate-pulse"></div>
      <div
        className={`relative z-10 w-full transition-opacity duration-500 ease-in-out ${animationClass}`}
      >
        {currentStep > 0 &&
          currentStep < steps.findIndex((s) => s.isSummary) && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{
                    width: `${(currentStep / (steps.findIndex((s) => s.isSummary) - 1)) * 100}%`,
                    transition: 'width 0.5s ease-in-out',
                  }}
                ></div>
              </div>
            </div>
          )}
        {renderStep()}
      </div>
    </div>
  );
}
