# RozgarLocal --- Product Requirements Document (PRD)

**Version:** 1.1\
**Last updated:** 22 November 2026\
**Status:** Working baseline consolidating product decisions, technical
design and recommendations discussed so far.

------------------------------------------------------------------------

## 1. Product overview

RozgarLocal is a hyperlocal employment platform connecting job
seekers---including blue-collar and frontline workers---with nearby
employers, contractors, shops and small businesses.

It aims to make local job discovery accessible to people who may not
have a formal CV, degree or fluent English skills, while helping local
employers hire suitable workers.

**Vision:** Make it simple and trustworthy for people to find nearby
work and for local businesses to find workers.

### Product principles

-   Local-first job discovery.
-   Inclusive onboarding without requiring a CV or degree.
-   Trust and safety through proportionate employer verification and job
    moderation.
-   Mobile-friendly experience, with responsive web and installable PWA.
-   Punjabi, Hindi and English language support.
-   Simple workflows for job seekers and small employers.
-   Free for job seekers and employers at launch.

## 2. Target users

### Job seekers

Factory and warehouse workers, drivers, delivery workers, construction
and trade workers, electricians, plumbers, carpenters, mechanics,
restaurant and hotel staff, retail staff, cleaners, helpers, household
workers, office support and other entry-level or experienced workers.

**Needs:** find nearby work; understand salary, hours and requirements;
apply without a CV; use Punjabi, Hindi or English; see employer
verification information; report suspicious listings.

### Employers

Shops, factories, warehouses, restaurants, hotels, contractors, service
businesses, SMEs and individual/household employers subject to safety
rules.

**Needs:** create a profile; publish jobs; receive and manage
applications; find local candidates; establish trust through
verification.

### Administrators and moderators

Review employer documents, moderate jobs, investigate reports, restrict
accounts and maintain audit history.

## 3. Launch strategy and business model

-   Initial geography: Punjab, India.
-   Proposed pilot city: Pathankot.
-   Proposed expansion cities include Ludhiana, Amritsar, Patiala,
    Mohali (Sahibzada Ajit Singh Nagar), Hoshiarpur, Kapurthala and
    Jalandhar.
-   Expand to other Indian states after validating the Punjab launch.
-   Free for job seekers and employers initially.
-   No paid listings, subscriptions or payment workflow in the MVP.
-   Languages: Punjabi, Hindi and English.

A pilot planning target previously discussed was approximately 20--30
employers and 100 job seekers in Pathankot. This is a planning target,
not a confirmed outcome.

## 4. Goals, non-goals and measures

### MVP goals

1.  Job seekers can create useful profiles without a CV.
2.  Employers can create profiles and publish local jobs.
3.  Job seekers can discover and apply for nearby jobs.
4.  Employers can review applicants and update application statuses.
5.  Administrators can verify employers, moderate jobs and handle
    reports.
6.  The product works well on mobile and desktop and supports PWA
    installation.

### Later-phase features (not MVP blockers)

-   Native Android application.
-   AI-based job recommendations.
-   In-app chat or real-time messaging.
-   Ratings and reviews.
-   WhatsApp workflows.
-   Advanced push-notification campaigns.
-   Paid plans, subscriptions and payments.
-   Microservices architecture.

### Suggested success measures

Track registered seekers, active/verified employers, published jobs,
applications per job, time to first application,
application-to-contact/hire conversion where measurable, verification
completion rate, report rate, review turnaround time, repeat employer
posting and seeker return rate. Set numeric targets after pilot baseline
data exists.

## 5. Roles and permissions

Roles: - `JOB_SEEKER` - `EMPLOYER` - `ADMIN`

A user may potentially have both seeker and employer profiles. Backend
authorization must enforce role and resource ownership; frontend
visibility is not a security boundary.

**Job seeker:** manage own profile and skills; browse published jobs;
save jobs; apply; view own applications; receive notifications; report
jobs/employers.

**Employer:** manage own profile and verification documents;
create/manage own jobs; view applicants for own jobs; update application
statuses; receive notifications; respond to verification requests.

**Admin:** review verification; moderate jobs and reports;
suspend/reinstate accounts; inspect audit history; perform privileged
actions with recorded reasons.

## 6. Functional requirements

### 6.1 Authentication and onboarding

-   Support email/password signup and sign-in, plus Google authentication
    (OAuth/OpenID Connect).
-   Email/password signup must collect a unique email address and
    password, normalize email addresses for uniqueness and require
    email verification before protected account actions that require a
    verified account.
-   Passwords must contain at least 12 characters and no more than 128
    characters. Reject commonly used or compromised passwords where
    practical. Do not require the user to periodically change a password
    solely for policy purposes.
-   Hash passwords with Argon2id using a unique salt per password and
    parameters tuned for the production environment; never store or log
    plaintext passwords or password-reset tokens.
-   Email/password sign-in must show an appropriate generic error for
    invalid email/password combinations and enforce account-status,
    lockout or throttling controls for repeated failures.
-   Provide a forgot-password flow that accepts an email address and
    always returns a generic success response, without revealing whether
    the account exists.
-   Send password-reset links using short-lived, cryptographically
    random, single-use tokens. Reset links must expire (recommended
    maximum: 30 minutes), invalidate the token after use and allow the
    user to set a new password that meets the password policy.
-   After a successful password reset, revoke active sessions and
    invalidate previously issued password-reset tokens for the account.
-   Provide email verification, password reset and account-security
    messages in clear, accessible language with a consistent expiration
    notice.
-   Google sign-in must use server-side validation of authorization
    responses or identity tokens.
-   Do not silently merge accounts based only on matching email
    addresses. Account linking must require a verified proof of control
    for the existing account and follow a confirmed linking policy.
-   Store each authentication method/provider identity and stable provider
    subject identifier separately from the user's public profile.
-   A user may use both email/password and Google for the same account
    only when the account-linking flow verifies ownership.
-   Support role selection, account status checks, logout and session
    revocation across both authentication methods.
-   Issue short-lived access tokens and longer-lived refresh tokens after
    successful authentication. Refresh tokens must be rotated on every
    successful refresh; invalidate the previous token and detect reuse of
    an already-rotated token.
-   Bind refresh tokens to a server-side session/token family. Support
    revoking one session (logout) or all of a user's sessions, and expire
    refresh tokens according to a defined absolute lifetime and inactivity
    timeout.
-   Revoke the affected refresh-token session on logout. Revoke all active
    sessions after password reset or a security-sensitive credential
    change; revoke sessions for suspended or disabled accounts.
-   Authentication proves control of a Google account or email/password
    credential, not business ownership.
-   Mobile OTP is not part of initial login. Phone verification may be
    added later for contact/safety purposes.
-   Validate Google authorization responses or identity tokens securely
    on the server.
-   Do not trust client-supplied email or profile claims without
    server-side validation.
-   Collect required RozgarLocal profile information after sign-in.

### 6.2 Job seeker profile

Suggested fields: name, optional photo, preferred language, contact
number according to policy, current/preferred locations, skills,
experience level and summary, preferred employment types, optional
expected salary range, availability and optional introduction.

The profile must be useful without optional fields or a CV.

### 6.3 Employer profile

Suggested fields: business/employer name, employer type, contact person,
business phone, description, address, city/district/state, optional
coordinates, optional website/public link, verification state and
documents.

Employer types must distinguish registered businesses from
individual/household employers and other relevant hiring entities.

### 6.4 Categories and skills

-   Use curated category and skill directories, not only free-text tags.
-   Admins can maintain them.
-   Jobs can have a category and multiple required skills.
-   Seekers can have multiple skills.
-   Labels should support localization.

Starter categories: manufacturing/factory, construction/trades,
driving/transport, delivery/logistics, retail/sales, hotel/restaurant,
office/administration, cleaning/housekeeping, healthcare support and
other local services.

Starter skills: driving, packing, welding, electrical work, plumbing,
carpentry, cooking, housekeeping, machine operation, sales, delivery and
data entry. Refine these with pilot feedback.

### 6.5 Job posting

Employers can create, edit, preview, publish, pause, close and archive
their own jobs subject to moderation policy.

Suggested fields: - Title, description and responsibilities. - Employer,
category and required skills. - Employment type, work mode and
experience level. - Salary amount/range and salary period (hourly,
daily, weekly, monthly or other supported period). - Number of
openings. - Work location, address, city, district and state. - Optional
latitude/longitude. - Working hours or shift. - Urgent hiring
indicator. - Application instructions/contact policy. - Publication and
expiry timestamps. - Moderation status and notes.

Listings should communicate pay and working conditions clearly.
Discourage misleading, discriminatory, unsafe or fee-charging listings.

### 6.6 Job discovery

-   Browse and search published jobs by title, keyword, category or
    skill.
-   Filter by location/distance where location is available, category,
    employment type, salary and experience.
-   View job details and employer verification status.
-   Save jobs and apply.
-   Indicate whether the seeker has already applied.
-   Location permission is optional; allow manual city/locality
    selection.
-   Do not expose a seeker's precise home location to employers by
    default.

### 6.7 Applications

-   A seeker can apply to a job.
-   Prevent duplicate applications by the same seeker to the same job.
-   Seekers can track application status.
-   Employers can view applicants only for jobs they own.
-   Employers can update application statuses.
-   Record status changes in history and notify relevant parties.
-   Enforce authorization on all application operations.

Suggested statuses: `APPLIED`, `REVIEWING`, `SHORTLISTED`, `CONTACTED`,
`REJECTED`, `HIRED`, `WITHDRAWN`.

The exact contact mechanism and privacy policy for employer/applicant
communication remain to be finalized.

### 6.8 Saved jobs

Seekers can save/unsave jobs and view saved jobs. Closed or removed jobs
must not appear as active opportunities.

### 6.9 Notifications

MVP in-app notifications: - Application submitted. - Application status
changed. - New application received. - Verification
submitted/approved/rejected/more information requested. - Job
approved/rejected/paused/removed. - Important account and safety
notices.

Push and WhatsApp notifications are later enhancements.

### 6.10 Admin moderation and reports

Admins can review verification submissions, moderate jobs, review
reports, record decisions/reasons, suspend employers or remove listings,
and preserve audit history. Users need a clear report-job and
report-employer workflow.

## 7. Employer verification and trust

Employer verification is a core trust feature. Distinguish Google
account authentication, business verification and a broader trust
assessment.

### 7.1 Proposed levels

1.  **Basic:** verified account authentication (verified email/password
    account or Google sign-in), required employer profile fields completed
    and basic platform safety checks passed. This is not proof of
    business registration.
2.  **Business verified:** suitable business evidence reviewed and
    accepted; business name and relevant details are reasonably
    consistent with the profile.
3.  **Trusted:** business verification plus additional checks such as
    address confirmation, representative authority checks, phone contact
    or physical verification where justified. This is a later
    enhancement.

Badge text must state what was checked. A badge must not guarantee every
job is safe or guarantee hiring outcomes.

### 7.2 Acceptable evidence

Depending on employer type, possible evidence includes: - GST
registration certificate. - Udyam registration certificate. - Shop and
Establishment registration. - Trade licence, where applicable. - Company
incorporation certificate. - Business address evidence. - Business bank
proof only if necessary, with sensitive details minimized. - Other
relevant official or independently verifiable evidence.

Do not require every document from every employer. GST registration must
not be mandatory for every small business or individual employer. Define
a proportionate route for individual/household employers. Do not make
Aadhaar a default mandatory document. Collect only necessary personal
data with suitable notice, consent, access control and retention rules.

### 7.3 Workflow

1.  Employer signs up or signs in with email/password or Google.
2.  Selects employer type and completes profile.
3.  Submits appropriate documents and supporting details.
4.  System checks file type, size, completeness, duplicates and obvious
    inconsistencies.
5.  Use official registry verification only where a reliable service is
    available and its access, cost, legal basis and terms have been
    assessed.
6.  Admin reviews submission.
7.  Admin approves, rejects with reason or requests more information.
8.  Record decision, reviewer, timestamp and evidence.
9.  Display appropriate verification state on employer profile and
    relevant job listings.
10. Allow resubmission according to policy.

### 7.4 Proposed MVP publishing policy

Recommended, but not yet confirmed as a final product rule: - Allow
draft jobs before business verification. - Allow limited publishing
after basic profile and safety checks. - Business verification unlocks a
stronger badge and potentially higher posting limits. - Hold suspicious
or higher-risk jobs for manual review. - Apply additional checks when
risk signals are triggered.

Exact posting limits and moderation thresholds remain open.

### 7.5 Safety controls

-   Prohibit registration fees, deposits or placement payments charged
    to applicants.
-   Flag requests for money, banking credentials or unnecessary
    sensitive information.
-   Provide report-job and report-employer actions.
-   Detect duplicate listings and suspicious account patterns.
-   Re-review material changes to employer identity/business details.
-   Allow suspension and badge revocation.
-   Preserve decisions and admin audit logs.
-   Provide an appeal/correction route.
-   Define document retention and deletion periods.

## 8. Technical architecture

### 8.1 Selected stack

  Area                Technology
  ------------------- -------------------------------
  Monorepo            Turborepo
  Frontend            Next.js
  Backend             NestJS
  Language            TypeScript
  Styling             Tailwind CSS
  UI components       shadcn/ui
  Validation          Zod
  ORM                 Prisma
  Database            PostgreSQL
  Authentication      Email/password and Google OAuth / OpenID Connect
  API                 REST
  API documentation   Swagger / OpenAPI
  Client state        Zustand
  Server state        TanStack Query
  Testing             Vitest and Playwright
  Delivery            Responsive web app + PWA

### 8.2 Architecture style

Use a modular monolith initially, not microservices. - Next.js owns the
web experience and frontend routing. - NestJS owns business logic,
authorization and REST endpoints. - PostgreSQL is the primary relational
database. - Prisma manages database access and migrations. - Shared
packages hold reusable UI, validation, types and database code. -
Backend is the source of truth for permissions and business rules.

### 8.3 Proposed Turborepo layout

``` text
rozgarlocal/
├── apps/
│   ├── web/                    # Next.js application
│   └── api/                    # NestJS application
├── packages/
│   ├── ui/                     # Shared shadcn/ui components
│   ├── validation/             # Shared Zod schemas
│   ├── types/                  # Shared TypeScript types
│   ├── database/               # Prisma schema and generated client
│   └── config/                 # Shared configuration
├── tooling/
│   └── eslint/
├── turbo.json
├── package.json
├── tsconfig.json
└── README.md
```

This is the proposed workspace layout; exact package names and scripts
are implementation choices.

### 8.4 Suggested NestJS modules

`AuthModule`, `UsersModule`, `SeekerProfilesModule`,
`EmployerProfilesModule`, `EmployerVerificationModule`,
`LocationsModule`, `CategoriesModule`, `SkillsModule`, `JobsModule`,
`ApplicationsModule`, `SavedJobsModule`, `NotificationsModule`,
`ReportsModule`, `AdminModule`, `AuditModule`, `HealthModule`.

### 8.5 Security and engineering

-   Validate Google identity tokens/authorization codes on the server.
-   Hash email/password credentials with Argon2id and store reset,
    verification and refresh tokens only in hashed or otherwise
    non-readable form where retained.
-   Rate-limit signup, sign-in, email verification, forgot-password and
    reset-password endpoints to prevent enumeration and brute-force
    abuse.
-   Use secure HTTP-only, SameSite cookies or another carefully designed
    token/session strategy; protect cookie-based refresh flows against
    cross-site request forgery.
-   Keep access tokens short-lived. Rotate refresh tokens on every use,
    invalidate the predecessor, and revoke the token family if reuse of a
    rotated token is detected.
-   Store only a cryptographic hash of each refresh token server-side;
    never log raw access or refresh tokens. Support individual-session
    logout, logout-all and administrative/session revocation.
-   Enforce role and resource ownership in NestJS.
-   Validate untrusted runtime payloads; TypeScript types alone are not
    runtime validation.
-   Use shared Zod schemas where appropriate.
-   Rate-limit authentication, uploads, reports and sensitive endpoints.
-   Restrict upload MIME types, size and content; scan files where
    feasible.
-   Store verification documents in private object storage.
-   Use short-lived signed URLs or authenticated document delivery.
-   Keep secrets in environment variables or a secrets manager.
-   Audit privileged admin actions.
-   Use migrations and backups.
-   Do not expose precise seeker coordinates or private employer
    documents.
-   Test authorization and abuse cases.

### 8.6 API conventions

-   Versioned REST prefix, e.g. `/api/v1`.
-   Swagger/OpenAPI generated from NestJS.
-   Consistent response and error formats.
-   Pagination for jobs, applicants, reports and admin queues.
-   Validated query parameters for filtering and sorting.
-   Server-side authorization for every protected resource.
-   Do not expose Prisma database models directly as public API
    contracts.

## 9. Initial database design

Use PostgreSQL with Prisma. UUID primary keys are recommended. Store
timestamps consistently in UTC and format for the user's locale in the
UI.

The first database deliverable discussed 21 core models:

  --------------------------------------------------------------------------
  Model                               Responsibility and key data
  ----------------------------------- --------------------------------------
  `User`                              Shared account; role, account status,
                                      preferred language, provider identity;
                                      optional seeker/employer profiles

  `AuthSession`                       User, hashed refresh token, token
                                      family, expiry, rotation and revocation

  `PasswordCredential`                User, Argon2id password hash,
                                      password version and update timestamp

  `EmailVerificationToken`            User/email, hashed token, expiry,
                                      use status

  `PasswordResetToken`                User, hashed token, expiry,
                                      use status and request timestamp

  `OtpRequest`                        Future/legacy OTP capability; hashed
                                      code, purpose, expiry, attempts; not
                                      used for initial Google login

  `SeekerProfile`                     User, profile details, location,
                                      coordinates, experience, salary
                                      expectation, employment preferences,
                                      availability

  `EmployerProfile`                   User, business name/type, contact
                                      details, address/location,
                                      verification state and level

  `EmployerDocument`                  Employer, document type, private
                                      storage key, review status, reviewer,
                                      note, expiry

  `Location`                          Country/state/district/city/locality
                                      hierarchy, parent relation and
                                      optional coordinates

  `JobCategory`                       Category name/slug, description,
                                      active state, optional hierarchy

  `Skill`                             Skill name/slug, localized labels and
                                      active state

  `SeekerSkill`                       Seeker-to-skill association and
                                      optional experience/proficiency

  `JobSkill`                          Job-to-required-skill association

  `Job`                               Employer, category, title,
                                      description, employment/work mode,
                                      experience, salary, openings,
                                      location, coordinates, status and
                                      dates

  `JobApplication`                    Job, seeker, status and timestamps;
                                      unique job/seeker pair

  `ApplicationStatusHistory`          Application, old/new status, actor,
                                      note and timestamp

  `SavedJob`                          Seeker and job; unique seeker/job pair

  `Notification`                      User, type, title/body, read state and
                                      related resource

  `Report`                            Reporter, target job/employer/user,
                                      reason, details and moderation status

  `AuditLog`                          Actor, action, entity, entity ID,
                                      metadata and timestamp
  --------------------------------------------------------------------------

### 9.1 Enums discussed

-   User role and account status.
-   OTP purpose.
-   Location type.
-   Employer verification status and document review status.
-   Employment type, work mode, salary period and experience level.
-   Job status and application status.
-   Notification type.
-   Report reason and report status.

Proposed verification levels: `NONE`, `BASIC`, `BUSINESS`, `TRUSTED`.

### 9.2 Key relationships and constraints

-   A user may have one seeker profile and/or one employer profile.
-   An employer has many documents and may publish many jobs.
-   A job belongs to an employer and may belong to a category and
    location.
-   Jobs and skills are many-to-many through `JobSkill`.
-   Seekers and skills are many-to-many through `SeekerSkill`.
-   Unique `(jobId, seekerId)` prevents duplicate applications.
-   Unique `(seekerId, jobId)` prevents duplicate saved-job rows.
-   Applications have multiple status-history records.
-   Protect user-owned resources through API ownership checks.

### 9.3 Indexing and geospatial strategy

Index common lookups: user role/status; employer verification status;
document review status; job status/category/location/publication
date/employer/expiry; application job/seeker/status; notification
user/read state; report status/creation date.

The initial schema stores latitude/longitude as numeric fields. Add
PostGIS geography columns and GIST indexes through a dedicated migration
when radius-search needs justify it. Ordinary latitude/longitude indexes
are not equivalent to geospatial indexes.

### 9.4 Seed data

Starter seed plan: - Punjab state. - Districts: Pathankot, Ludhiana,
Amritsar, Patiala, Sahibzada Ajit Singh Nagar (Mohali), Hoshiarpur,
Kapurthala and Pathankot. - Starter categories and skills.

Initial city/locality entries are placeholders and must be verified and
enriched before production. Location data should be maintainable by
admins without code changes.

### 9.5 Privacy and integrity

-   Store hashed refresh tokens, never raw session secrets. Support
    refresh-token rotation and session/token-family revocation.
-   Never store raw OTP codes if OTP is added later.
-   Keep employer documents in private storage.
-   Minimize sensitive identity and financial data.
-   Define document retention/deletion and account-data policies.
-   Use transactions for multi-record operations such as status changes
    plus audit history.
-   Consider soft deletion or archival where appropriate.
-   Keep audit history for verification and privileged moderation
    decisions.

## 10. Main user journeys

### Job seeker

1.  Visit app and sign up with email/password or sign in with Google or
    an existing email/password account.
2.  Choose job seeker role.
3.  Add name, location, skills and experience.
4.  Browse/search nearby jobs.
5.  Review job details and employer verification.
6.  Apply.
7.  Track application status and receive notifications.

### Employer

1.  Sign up or sign in with email/password or Google.
2.  Choose employer role.
3.  Complete employer profile.
4.  Submit appropriate verification documents.
5.  Create a job draft and complete job details.
6.  Submit for publication/moderation.
7.  Receive applications.
8.  Review candidates and update statuses.
9.  Maintain profile and verification information.

### Admin

1.  Sign in to an authorized admin account using an approved account
    method.
2.  Open verification queue.
3.  Review employer profile and private documents.
4.  Approve, reject or request more information with a reason.
5.  Review flagged jobs and reports.
6.  Take moderation action.
7.  Confirm actions are recorded in the audit log.

## 11. UI and experience requirements

-   Professional job-portal visual style.
-   Responsive mobile, tablet and desktop layouts.
-   Readable typography and accessible contrast.
-   Simple navigation and low-friction forms.
-   shadcn/ui components styled with Tailwind CSS.
-   Clear loading, empty, success and error states.
-   Job seeker journey must not depend on CV upload.
-   Display salary, location, work type and employer verification
    clearly.
-   Plain language and Punjabi, Hindi and English support.
-   Forms suitable for varied digital literacy.
-   Keyboard and assistive-technology accessibility.

## 12. Delivery roadmap

1.  **Monorepo foundation:** Turborepo, Next.js, NestJS, TypeScript,
    shared packages, linting/formatting and local development.
2.  **Database foundation:** PostgreSQL, Prisma in `packages/database`,
    schema, relations, constraints, indexes, migrations and seed.
3.  **Backend foundation:** NestJS, Prisma integration, health endpoint,
    environment validation, API versioning, Swagger, error handling,
    logging and tests.
4.  **Frontend foundation:** Next.js, Tailwind, shadcn/ui, shared UI
    package, layout, navigation, localization foundation, TanStack Query
    and Zustand.
5.  **Authentication:** email/password signup and sign-in, forgot/reset
    password, email verification, Google OAuth/OIDC, account linking,
    role selection, profile onboarding and session management.
6.  **Profiles and taxonomy:** seeker/employer profiles, locations,
    categories and skills.
7.  **Jobs and discovery:** job lifecycle, moderation states, search,
    filters, location selection and saved jobs.
8.  **Applications:** apply flow, duplicate prevention, employer
    applicant dashboard, status history and notifications.
9.  **Verification/admin:** private document uploads, verification
    queue, decisions, reports, account restrictions and audit logs.
10. **Quality and pilot:** unit/integration/E2E tests, security review,
    mobile/PWA testing, monitoring, backups and Pathankot pilot.

A roughly 10-week MVP planning estimate was previously discussed. Actual
duration depends on team size, integrations, content preparation and
testing; it is not a delivery guarantee.

## 13. Testing and acceptance criteria

### Authentication

-   Email/password signup accepts a valid normalized unique email and
    creates a password-hashed account.
-   Email/password sign-in rejects invalid credentials without
    revealing whether an email exists.
-   Email verification links expire and cannot be reused.
-   Forgot-password responses are account-agnostic.
-   Password-reset links expire, work only once and rotate/revoke
    sessions after use.
-   Password-reset abuse is rate-limited and reset tokens are never
    stored or logged in plaintext.
-   Passwords are hashed with Argon2id and are never stored or logged in
    plaintext.
-   Refresh tokens rotate on use; replaying a rotated token is rejected
    and revokes its token family.
-   Logout revokes the current refresh-token session, and logout-all or
    password reset revokes all active sessions.
-   Google sign-in works.
-   Forged or invalid identity assertions are rejected.
-   Account linking cannot silently merge accounts based only on an
    unverified email.
-   Protected endpoints reject unauthenticated requests.

### Authorization

-   Seekers cannot edit other seekers' profiles or applications.
-   Employers cannot edit other employers' jobs or view their
    applicants.
-   Only authorized admins can review documents or suspend accounts.
-   Authorization tests cover APIs, not just frontend controls.

### Jobs and applications

-   Employers manage only their own jobs.
-   Seekers browse published jobs and apply.
-   Duplicate applications are prevented at API and database levels.
-   Closed, expired or removed jobs cannot accept applications.
-   Status changes are recorded in history.

### Employer verification

-   Employers can submit supported document types.
-   Documents remain private.
-   Admin decisions are recorded with reviewer and timestamp.
-   Verification status and level remain consistent.
-   Suspended/rejected employers do not display an active verified
    badge.
-   Every decision is auditable.

### Experience

-   Core journeys work on mobile and desktop.
-   Browsing and applying do not require a CV.
-   Forms show useful validation errors.
-   Empty/error states are handled.
-   Localization can expand without schema redesign.

## 14. Deployment and operations

Hosting provider and topology are not finalized. Plan for: - Next.js web
hosting. - NestJS API hosting. - PostgreSQL hosting. - Private object
storage for verification documents. - Separate development, staging and
production environments. - HTTPS, domain and secret management. -
Database migrations during release. - Automated backups and restore
testing. - Error monitoring, structured logs and health checks. - Rate
limiting and abuse monitoring. - Data export, retention and deletion
procedures.

## 15. Open decisions

1.  Confirm exact job publishing limits before business verification and
    manual-review thresholds.
2.  Select the password-hashing, email-delivery, Google OAuth/provider
    and session strategy for Next.js + NestJS.
3.  Decide whether phone number is mandatory for seekers, employers or
    particular actions, and when it must be verified.
4.  Finalize acceptable employer evidence by employer type, including
    individual/household employers.
5.  Assess access, cost, legal basis and terms before integrating GST,
    Udyam or other registries.
6.  Choose document storage, scanning and retention approach.
7.  Decide when to introduce PostGIS and the radius-search strategy.
8.  Decide how employers contact applicants: disclosed phone/email,
    in-app workflow or another controlled method.
9.  Define prohibited jobs, prohibited fees, discrimination rules,
    escalation and appeals.
10. Finalize translation scope for the first pilot.
11. Select hosting/deployment providers.
12. Prepare privacy notice, terms, consent language and retention
    policies suitable for the Indian launch.

## 16. Decision summary

### Confirmed

-   Product: RozgarLocal, a hyperlocal employment marketplace.
-   Audience: job seekers and employers.
-   Punjab-first, then wider India.
-   Pathankot proposed as pilot.
-   Free for both sides initially.
-   Responsive web application and mobile-friendly PWA.
-   Punjabi, Hindi and English target languages.
-   Inclusive for workers without formal CVs, degrees or fluent English.
-   Turborepo monorepo.
-   Next.js frontend, NestJS backend, TypeScript.
-   Tailwind CSS, shadcn/ui, Zod, Prisma and PostgreSQL.
-   Email/password authentication plus Google authentication, instead
    of mobile OTP for initial sign-in.
-   REST API, Swagger/OpenAPI, Zustand, TanStack Query.
-   Vitest and Playwright.
-   Modular monolith architecture.

### Proposed or pending confirmation

-   Exact verification evidence and trusted-level checklist.
-   Publishing limits before business verification.
-   Automated registry checks.
-   PostGIS timing.
-   Hosting provider.
-   Exact OAuth/session library and implementation.
-   Document storage and retention.
-   Phone verification policy.
-   Employer/applicant contact mechanism.

## 17. Product direction

The first release should reliably complete the core local hiring loop:

**A genuine employer posts a clear local job → a nearby worker discovers
it → the worker applies easily → the employer reviews the application →
both sides can rely on clear safety and verification signals.**

Prioritize correctness, accessibility, privacy and trust over adding
many features before the pilot.
