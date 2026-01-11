import React from "react";

import "./Pages.css";
import Footer from "../Components/Footer/index";
import Header from "../Components/TheHeader/index";

const TermsOfService = () => {
  const termsContent = `
<h1 class='_terms_title'>Terms of Service for Yieldbook</h1>

<p><strong>Effective Date:</strong> January 9, 2026</p>

<p>Welcome to Yieldbook. Please read these Terms of Service ("Terms") carefully before using the platform.</p>

<h3>1. Introduction</h3>
<p>Yieldbook is a web application developed as a student project for educational and evaluation purposes. It is not a commercial product and is not intended for real-world financial management. By accessing or using Yieldbook, you agree to be bound by these Terms. The platform and all its content are provided on an "as-is" and "as-available" basis, without any warranties.</p>

<h3>2. Eligibility</h3>
<p>To use Yieldbook, you must be at least 18 years of age. By creating an account, you confirm that you meet this requirement. You are solely responsible for the accuracy of any information you provide during registration or post on the platform.</p>

<h3>3. Account Registration</h3>
<p>You are responsible for maintaining the security of your account, including your password. All activities that occur under your account are your responsibility. You agree to notify the project maintainers immediately of any unauthorized use of your account.</p>

<h3>4. Use of the Platform</h3>
<p>You agree to use Yieldbook in a lawful and respectful manner. The following activities are strictly prohibited:</p>
<ul>
<li>Harassing, threatening, or abusing other users.</li>
<li>Posting content that is defamatory, obscene, or hateful.</li>
<li>Sending spam or unsolicited messages.</li>
<li>Using automated scripts, bots, or other methods to scrape, access, or interact with the platform in a way that disrupts its normal operation.</li>
<li>Attempting to breach, exploit, or compromise the platform's security or integrity.</li>
</ul>

<h3>5. User-Generated Content</h3>
<p>You retain full ownership of the text, data, and other content you create or post on Yieldbook ("User Content").</p>

<p>By posting User Content, you grant the platform a temporary, non-exclusive license to store, display, and reproduce that content solely for the purpose of operating and providing the platform's features. For example, we need to store your portfolio data to display it back to you, and we need to display your posts to other users as part of the social functionality.</p>

<p>We reserve the right to remove any User Content that violates these Terms or is deemed inappropriate for the platform, without prior notice.</p>

<h3>6. Data & Accuracy</h3>
<p>The financial market data displayed on Yieldbook, including cryptocurrency prices and performance metrics, is sourced from third-party providers and is for informational purposes only. This data may be delayed, incomplete, or contain inaccuracies. The creators of Yieldbook make no guarantees regarding the correctness, timeliness, or availability of any data on the platform. The platform is provided without warranties of any kind, express or implied.</p>

<h3>7. AI Features</h3>
<p>Yieldbook includes features that use artificial intelligence (AI) to provide explanations and analyze portfolio structures. The output from these AI features is generated automatically and may be inaccurate, incomplete, or contain errors. These features are provided for informational and educational exploration only. You are responsible for how you interpret and use any information provided by the AI.</p>

<h3>8. Service Availability</h3>
<p>As an academic project, Yieldbook's availability is not guaranteed. The platform may be taken offline, have its features modified, or be shut down permanently at any time, without prior notice. All user data, including portfolios and posts, may be reset or permanently deleted without notice, particularly at the conclusion of the evaluation period. There are no uptime or data retention guarantees.</p>

<h3>9. Limitation of Liability</h3>
<p>In no event shall the student creators of Yieldbook be liable for any direct, indirect, incidental, or consequential damages, losses, or decisions arising out of the use of or inability to use the platform. This includes, but is not limited to, any damages resulting from reliance on platform data, user content, or AI-generated information.</p>

<h3>10. Termination</h3>
<p>We may suspend or terminate your access to Yieldbook at any time, without prior notice, for any reason, including for a breach of these Terms. As this is a project with a limited lifecycle, the entire service may be terminated permanently upon completion of its academic requirements.</p>

<h3>11. Changes to These Terms</h3>
<p>We reserve the right to modify these Terms at any time. As the platform evolves during its development cycle, we may need to update these rules. If we make changes, we will note the new effective date. Your continued use of Yieldbook after any such changes constitutes your acceptance of the new Terms.</p>

<h3>12. Contact</h3>
<p>If you have any questions about these Terms, please contact the project maintainers.</p>
`;

  return (
    <>
      <Header />
      <div className='_terms_of_use_container'>
        <div dangerouslySetInnerHTML={{ __html: termsContent }} />
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;
