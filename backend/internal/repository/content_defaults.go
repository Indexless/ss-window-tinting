package repository

import "snswindowtinting/backend/internal/domain"

func defaultFAQ() []domain.FAQItem {
	return []domain.FAQItem{
		{
			Question: "What types of window tinting do you offer?",
			Answer:   "S&S Window Tinting handles automotive, commercial, and residential jobs. Whether it is a vehicle, home, or business space, tell us what you need tinted and we will recommend a suitable approach.",
		},
		{
			Question: "How long does window tinting take?",
			Answer:   "Most vehicles take about 1 to 4 hours, depending on the car and whether old film needs removing first. Homes often take a few hours based on how many windows are involved. Larger commercial projects can take a day or more. We will confirm timing when we quote your job.",
		},
		{
			Question: "Do I need to keep my windows up after a car tint?",
			Answer:   "Yes. Keep tinted windows fully closed for at least 2 to 3 days so the film can bond properly. Rolling them down too soon is a common cause of edge lifting. Exact aftercare tips will depend on the film and weather on the day of install.",
		},
		{
			Question: "Why do my windows look hazy or have small bubbles after tinting?",
			Answer:   "A hazy, streaky, or blotchy look is normal at first. Moisture left between the film and the glass needs time to evaporate as the film cures. Small water pockets usually clear on their own over the following days or weeks. Do not press, poke, or scrape the film while it is curing.",
		},
		{
			Question: "How should I clean tinted windows?",
			Answer:   "Wait at least a week before cleaning the film side, and longer if we advise a full cure period. Use a soft cloth or microfiber and an ammonia-free cleaner. Avoid blades, abrasive pads, and harsh chemicals, as they can scratch or damage the film.",
		},
		{
			Question: "How do I request a quote?",
			Answer:   "Use the quote form on this site and include the service type, vehicle or property details, and what you want tinted. We also offer mobile tinting where the job allows. Submit your request and we will follow up with you.",
		},
	}
}

func defaultPolicyPrivacy() domain.PolicyDoc {
	return domain.PolicyDoc{
		Title:     "Privacy Policy",
		UpdatedAt: "3 October 2026",
		Body: `{{businessName}} ("we", "us", "our") respects your privacy and processes personal information in line with South Africa's Protection of Personal Information Act 4 of 2013 (POPIA).

## Responsible party
{{businessName}} is the responsible party for personal information collected through this website and related quote enquiries. Contact us using the details on this website for privacy requests.

## What we collect
Depending on how you contact us, we may collect:
- Identity and contact details (name, phone or WhatsApp number, email address)
- Enquiry details (service type, vehicle or property information, message content)
- Preferred contact method and any notes you choose to share
- Technical information needed to run the site securely (for example cookie identifiers for staff sign-in)

## Why we process your information
We process personal information to:
- Respond to quote requests and schedule or deliver window tinting services
- Communicate with you using your preferred contact method
- Keep records needed for customer service, safety, and legal compliance
- Send marketing updates only if you have given separate, optional consent

Our lawful bases include consent (where you tick the privacy notice on the quote form), and performance of a contract or steps taken at your request before entering a contract when you ask for a quote or service.

## Who we share information with
We do not sell your personal information. We may share it with trusted service providers who help us host this website, send communications, or operate our business, and only as needed for those purposes. We may also disclose information if required by law.

## Retention
We keep enquiry and customer records for as long as reasonably needed to handle your request, provide services, resolve disputes, and meet legal or accounting duties. When information is no longer needed, we delete or de-identify it where practicable.

## Security
We take reasonable technical and organisational steps to protect personal information against loss, misuse, and unauthorised access. No online system is perfectly secure, so please avoid sending sensitive information that is not needed for your enquiry.

## Your rights under POPIA
Subject to POPIA, you may request to:
- Access the personal information we hold about you
- Correct or update inaccurate or incomplete information
- Object to certain processing, or withdraw consent where processing is based on consent
- Ask us to delete or destroy information where we no longer have a lawful reason to keep it
- Lodge a complaint with the Information Regulator (South Africa) at https://inforegulator.org.za

To exercise these rights, contact us using the details on this website. We may need to verify your identity before responding.

## Children
This website and our services are aimed at adults and businesses. We do not knowingly collect personal information from children under 18 without a competent person's consent.

## Updates
We may update this policy from time to time. The latest version will always be available on this page.`,
	}
}

func defaultPolicyCookies() domain.PolicyDoc {
	return domain.PolicyDoc{
		Title:     "Cookie Policy",
		UpdatedAt: "3 October 2026",
		Body: `Cookies are small text files stored on your device. {{businessName}} uses a limited set of cookies and similar technologies to operate this website.

## Essential cookies
We use essential cookies for staff authentication and session security in the admin portal (for example HttpOnly access and refresh cookies). These cookies are required for the portal to work and are not used for advertising.

## Preference storage
We may store a simple preference in your browser (such as whether you have acknowledged this cookie notice) so we do not show the notice on every visit.

## Analytics and marketing cookies
We do not currently use third-party advertising or analytics cookies on this site. If that changes, we will update this policy and, where required, ask for your consent.

## Managing cookies
You can control cookies through your browser settings. Blocking essential cookies may prevent staff from signing in to the portal.`,
	}
}

func defaultPolicyTerms() domain.PolicyDoc {
	return domain.PolicyDoc{
		Title:     "Website Terms",
		UpdatedAt: "3 October 2026",
		Body: `By using this website you agree to these terms. If you do not agree, please do not use the site.

## About this site
This website provides information about {{businessName}}'s automotive, commercial, and residential window tinting services and allows you to request a quote. Quotes and availability are subject to confirmation by us.

## Accuracy of information
We aim to keep website content accurate and up to date, but information may change without notice. Photos and examples are for illustration and may not reflect every finished job.

## Quotes and services
Submitting a quote request does not create a binding contract. Pricing, scheduling, and service scope are confirmed when we respond and when you accept our offer. Film choice, vehicle or property condition, and site access can affect the final quote.

## Acceptable use
You may not misuse this website, attempt unauthorised access to the admin portal, submit false or harmful content, or use the site in a way that breaches applicable law.

## Intellectual property
Branding, text, design, and media on this site belong to {{businessName}} or our licensors. You may not copy or reuse them without permission, except for personal, non-commercial viewing.

## Liability
To the extent permitted by South African law, we are not liable for indirect or consequential loss arising from use of this website. Nothing in these terms excludes liability that cannot lawfully be excluded.

## Privacy
Personal information is handled according to our Privacy Policy.

## Governing law
These terms are governed by the laws of the Republic of South Africa. Courts in South Africa have jurisdiction over disputes arising from these terms, subject to any rights you may have under consumer protection law.`,
	}
}
