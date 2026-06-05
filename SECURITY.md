# Security Policy 

At **InnerHue**, we believe that emotional reflection requires a safe, private, and secure environment. We take the security of our platform and our users' data incredibly seriously. 

This document outlines our security policies, how to report vulnerabilities, and our commitment to keeping InnerHue a trusted space.

---

## Supported Versions

We actively provide security updates and patches for the following versions of InnerHue:

| Version | Supported | Notes |
| :--- | :--- | :--- |
| v1.x.x (Current) | Yes | Active development and patch support. |
| < v1.0.0 | No | Please upgrade to the latest release for secure local storage handling. |

---

## Data Privacy & Architecture Security

As InnerHue evolves through its **2026 Roadmap**, our security posture adapts to its architectural changes:

### 1. Current Architecture (Client-Side Persistence)
* **Local Storage:** Currently, all emotional tracking data, journals, and analytics are stored strictly on your local device via `LocalStorage`. No emotional data is transmitted to external servers.
* **XSS Prevention:** Because data is rendered dynamically, we maintain strict **React 19 + Vite** sanitization boundaries to prevent Cross-Site Scripting (XSS) via custom journal prompts or keyword clouds.

### 2. Upcoming Roadmap Roadmap Implementations (Q1/Q2 2026)
As we transition to Cloud Sync, Authentication, and AI-Powered Insights, the following security constraints are being strictly implemented:
* **NextAuth.js Configuration:** Session tokens and JWTs will use secure, HTTP-only cookies with CSRF protection.
* **API Key Masking:** All AI endpoints (OpenAI/Cohere) will be strictly isolated behind backend environment variables—never exposed to the client-side bundle.

---

## Reporting a Vulnerability

If you discover a security vulnerability within InnerHue, **please do not open a public GitHub issue.** Reporting it publicly can expose user data architectures before a fix can be deployed.

### Submission Process
Please report security vulnerabilities privately by following these steps:

1. **Email Us:** Send a detailed report to **[Your Security/Contact Email]** (or reach out directly to the repository owner `@Nitya-003`).
2. **Include Details:** To help us triage efficiently, please include:
   * A description of the vulnerability and its potential impact.
   * Step-by-step instructions to reproduce the issue (or a proof-of-concept script/exploit).
   * Your GitHub username if you wish to be credited in our changelog.

### Our Commitment
* **Acknowledgment:** We will acknowledge receipt of your vulnerability report within **48 hours**.
* **Status Updates:** We will keep you updated on our progress as we validate and work on a patch.
* **Resolution:** We aim to resolve valid vulnerabilities within **7–14 days** of initial reporting, depending on complexity.

---

## Out of Scope
The following types of reports are generally considered out of scope unless they demonstrate a direct, high-impact exploit chain:
* Missing security headers that do not directly lead to a vulnerability.
* Vulnerabilities dependent on root/jailbroken client environments.
* Content spoofing or text injection without executive script execution capability.

---

### Acknowledgments
We highly appreciate the open-source community's efforts to keep platforms secure. Valid disclosures that help protect InnerHue's users will be proudly credited in our release notes!
