import "./legalPages.css";
import LegalPageLayout from "./LegalPageLayout";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="January 9, 2026">
      <div className="_legal_section">
        <p className="_section_number">1. Introduction</p>
        <p>
          This Privacy Policy outlines how data is collected, used, and
          managed within Yieldbook. Please note that Yieldbook is a student
          project developed for academic evaluation and educational
          purposes. It is not a commercial product and is not intended for
          real-world financial management. By using Yieldbook, you
          acknowledge that you understand its academic nature.
        </p>
      </div>

      <div className="_legal_section">
        <p className="_section_number">2. Information Collected</p>
        <p>
          To provide its features, Yieldbook collects the following types of
          information:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you register, we
            collect your email address, username, and any optional profile
            information you provide, such as a profile picture or bio.
          </li>
          <li>
            <strong>User-Generated Content:</strong> We store the data you
            create on the platform, including your portfolio details (e.g.,
            assets and transactions), posts, comments, and messages sent to
            other users.
          </li>
          <li>
            <strong>Usage Data:</strong> We automatically log information
            about your interactions with the platform, such as pages
            visited, features used, and timestamps of your activities. This
            helps us understand how the platform is used for our academic
            evaluation.
          </li>
          <li>
            <strong>Technical Data:</strong> We collect technical
            information sent by your browser, which may include your IP
            address, browser type and version, and device type. This data
            is used for debugging and ensuring platform compatibility.
          </li>
        </ul>
      </div>

      <div className="_legal_section">
        <p className="_section_number">3. How Information Is Used</p>
        <p>
          The data we collect is used exclusively for the following
          purposes:
        </p>
        <ul>
          <li>
            <strong>To Provide Core Functionality:</strong> Your account
            information and user-generated content are necessary to operate
            the platform, such as displaying your portfolio and enabling
            social interactions.
          </li>
          <li>
            <strong>To Enable User Interaction:</strong> Content like posts
            and messages is used to facilitate communication between users.
          </li>
          <li>
            <strong>To Improve Features and Performance:</strong> Usage and
            technical data help us identify bugs, analyze feature usage, and
            improve the platform's performance as part of our project's
            development goals.
          </li>
          <li>
            <strong>To Power AI-Assisted Features:</strong> Data you input
            into AI-powered tools is processed to generate analytical
            responses and explanations.
          </li>
        </ul>
      </div>

      <div className="_legal_section">
        <p className="_section_number">4. Data Storage</p>
        <p>
          All user data is stored in a database managed for this project. As
          Yieldbook is a temporary academic project, we provide no
          guarantees for long-term data retention. The project maintainers
          reserve the right to reset or delete all data at any time,
          particularly at the conclusion of the evaluation period, without
          prior notice.
        </p>
      </div>

      <div className="_legal_section">
        <p className="_section_number">5. Third-Party Services</p>
        <p>
          Yieldbook integrates with a few third-party services to provide
          its functionality. These services may process your data according
          to their own privacy policies. These include:
        </p>
        <ul>
          <li>
            <strong>Authentication Providers:</strong> If you sign in using
            a third-party service (e.g., Google OAuth), we receive profile
            information from that provider to create your account.
          </li>
          <li>
            <strong>External APIs:</strong> We fetch cryptocurrency market
            data from external providers to display real-time prices and
            charts.
          </li>
          <li>
            <strong>AI Service Providers:</strong> AI-assisted features may
            send your input to a third-party AI service to generate a
            response.
          </li>
        </ul>
      </div>

      <div className="_legal_section">
        <p className="_section_number">6. AI Features</p>
        <p>
          Our platform includes features that utilize artificial
          intelligence (AI) to provide analysis and information. When you
          use these features, the input you provide is processed to generate
          a response. Please be aware that:
        </p>
        <ul>
          <li>
            AI-generated outputs may be inaccurate, incomplete, or contain
            errors. They are for informational purposes only.
          </li>
          <li>
            Your interactions with AI features, including your inputs, may
            be logged for functionality, debugging, and project evaluation
            purposes.
          </li>
        </ul>
      </div>

      <div className="_legal_section">
        <p className="_section_number">7. Data Sharing</p>
        <p>
          We do not sell, trade, or rent your personal data. Your
          information is not used for any commercial purposes. Data is only
          shared with third-party services as strictly necessary to provide
          platform functionality (e.g., processing a request with an AI
          service provider).
        </p>
      </div>

      <div className="_legal_section">
        <p className="_section_number">8. User Rights</p>
        <p>
          We believe in providing you with control over your data. Through
          the platform's interface, you can:
        </p>
        <ul>
          <li>Access and update your account information.</li>
          <li>
            View and delete your user-generated content, such as posts or
            portfolio entries.
          </li>
          <li>
            Delete your account entirely. Please note that account deletion
            is an irreversible action that will permanently remove all your
            associated data.
          </li>
        </ul>
      </div>

      <div className="_legal_section">
        <p className="_section_number">9. Security</p>
        <p>
          We implement basic security measures to protect your data, such as
          hashing passwords and restricting access to the database.
          However, as with any system, we cannot guarantee perfect
          security. As a student project, our security measures are
          implemented on a best-effort basis.
        </p>
      </div>

      <div className="_legal_section">
        <p className="_section_number">10. Children's Privacy</p>
        <p>
          Yieldbook is not intended for individuals under the age of 18. We
          do not knowingly collect data from anyone under this age.
        </p>
      </div>

      <div className="_legal_section">
        <p className="_section_number">11. Changes to This Privacy Policy</p>
        <p>
          This Privacy Policy may be updated as the project evolves. We will
          note the "Last updated" date at the top of this policy. Your
          continued use of the platform after any changes constitutes your
          acceptance of the new policy.
        </p>
      </div>

      <div className="_legal_section">
        <p className="_section_number">12. Contact</p>
        <p>
          If you have any questions about this Privacy Policy, please reach
          out to the project maintainers.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
