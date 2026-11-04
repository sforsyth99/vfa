# Feature Specification: Website for Author's Festival

**Feature Branch**: `001-author-festival-website`
**Created**: March 30, 2026
**Status**: Draft
**Input**: User description: "I am building a website for an author's festival.  On the home page it should be really obvious which events are featured. It might be an off-season event, or a list of events for the main festival. The data will be fetched from https://victoriafestivalofauthors.ca  The events are the most important thing, with links to the Eventbrite tickets using minimal clicks. We also need to highlight author interviews. We need to display our sponsors as well. It should be very easy to sign up to the newsletter or make a donation via the CanadaHelps page. We also need information about accessibilty, and more boring stuff like who we are. There should be social media links. There must be a land acknowledgement on every page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover and Attend Events (Priority: P1)

As a visitor to the festival website, I want to easily see featured and upcoming events on the home page, so I can quickly find events of interest and purchase tickets via Eventbrite.

**Why this priority**: Events are the core offering and primary reason users visit the site.

**Independent Test**: Can be fully tested by visiting the home page and confirming that featured events are prominent, up-to-date, and each event links to its Eventbrite ticket page.

**Acceptance Scenarios**:

1. **Given** a user visits the home page, **When** events are available, **Then** featured events are displayed prominently with clear links to Eventbrite tickets.
2. **Given** a user visits during off-season, **When** off-season events exist, **Then** those are featured instead of main festival events.

---

### User Story 2 - Explore Author Interviews (Priority: P2)

As a visitor, I want to browse and read or watch author interviews, so I can learn more about the authors featured in the festival.

**Why this priority**: Author interviews add value and engagement, supporting the festival’s mission.

**Independent Test**: Can be tested by accessing the interviews section and confirming interviews are accessible and clearly associated with authors.

**Acceptance Scenarios**:

1. **Given** a user navigates to the interviews section, **When** interviews are available, **Then** they are displayed with author names and accessible content.

---

### User Story 3 - View Sponsors (Priority: P3)

As a visitor, I want to see the festival sponsors, so I can recognize and appreciate the organizations supporting the event.

**Why this priority**: Sponsor visibility is important for ongoing support and transparency.

**Independent Test**: Can be tested by confirming a sponsors section is present and up-to-date.

**Acceptance Scenarios**:

1. **Given** a user visits any page, **When** sponsors are available, **Then** they are displayed in a dedicated section.

---

### User Story 4 - Sign Up for Newsletter or Donate (Priority: P4)

As a visitor, I want to easily sign up for the newsletter or make a donation via CanadaHelps, so I can stay informed or support the festival.

**Why this priority**: Newsletter and donations are key for community engagement and funding.

**Independent Test**: Can be tested by following newsletter signup and donation links/forms and confirming successful completion.

**Acceptance Scenarios**:

1. **Given** a user wants to sign up for the newsletter, **When** they click the signup link, **Then** they are able to subscribe easily.
2. **Given** a user wants to donate, **When** they click the donation link, **Then** they are directed to the CanadaHelps page.

---

### User Story 5 - Access Information (Priority: P5)

As a visitor, I want to find information about accessibility, the organization, and other important details, so I can understand the festival’s values and logistics.

**Why this priority**: Transparency and accessibility are essential for inclusivity and trust.

**Independent Test**: Can be tested by locating and reading the accessibility and about sections.

**Acceptance Scenarios**:

1. **Given** a user seeks accessibility info, **When** they visit the relevant section, **Then** clear accessibility information is provided.
2. **Given** a user wants to know about the organization, **When** they visit the about section, **Then** they find up-to-date information.

---

### User Story 6 - Social Media and Land Acknowledgement (Priority: P6)

As a visitor, I want to find copyright, social media links and see a land acknowledgement on every page, so I can connect with the festival and see its commitment to reconciliation.

**Why this priority**: Social media drives engagement; land acknowledgement is a core value. Copyright protects intellectual property

**Independent Test**: Can be tested by confirming copyright, social media links and land acknowledgement are present on every page.

**Acceptance Scenarios**:

1. **Given** a user visits any page, **When** the page loads, **Then** copyright, social media links and a land acknowledgement are visible.

---

## Functional Requirements *(mandatory)*

1. The home page must prominently display featured events, with clear links to Eventbrite ticket pages.
2. The site must fetch event and interview data from https://victoriafestivalofauthors.ca.
3. There must be a section for author interviews, clearly associated with each author.
4. Sponsors must be displayed in a dedicated section on the site.
5. There must be easy-to-find links or forms for newsletter signup and donations (CanadaHelps).
6. Accessibility information and organizational details must be available and easy to find.
7. Social media links must be present on every page.
8. A land acknowledgement must be displayed on every page.

9. Every page must include a "Skip to main content" accessibility link for improved navigation.
10. The site must display clear visual branding, including the festival logo and dates, especially on the home page.
11. The site must highlight special fundraising or off-season events when applicable.
12. Every page must include copyright/footer information.
13. If there are no upcoming events, the home page must display a clear message and suggest alternative content (e.g., past events, newsletter signup).
14. The site must support books with multiple authors, displaying all relevant author names and profiles.
15. Author profile photos and book covers must be displayed correctly regardless of image dimensions (supporting various aspect ratios and sizes).

## Success Criteria *(mandatory)*

- 100% of featured events are visible on the home page with working Eventbrite links.
- Author interviews are accessible and clearly attributed.
- Sponsors are displayed and up-to-date.
- Users can sign up for the newsletter and make donations without confusion or errors.
- Accessibility and organizational information is easy to find and understand.
- Social media links and land acknowledgement are present on every page.
- All user journeys can be independently tested as described above.

- "Skip to main content" link is present and functional on every page.
- Festival logo and dates are clearly visible on the home page.
- Special fundraising/off-season events are highlighted when relevant.
- Copyright/footer information is present and accurate on every page.

## Key Entities *(if data involved)*

- Event (title, date, description, Eventbrite link, featured status, format [physical/online], location [Indigenous name, English name])
- Author (name, bio, interview(s), profile photo, associated books)
- Book (title, cover image, author(s))
- Sponsor (name, logo, link)

## Additional Notes

- Accessibility is further supported by the inclusion of a "Skip to main content" link.
- Visual branding (logo, dates) reinforces festival identity and event timing.
- Special events (e.g., fundraisers) should be as prominent as main festival events when active.
- Footer should include copyright and any required legal or organizational information.

## Assumptions

- Event and interview data will be reliably available from https://victoriafestivalofauthors.ca.
- Eventbrite and CanadaHelps links will be provided and maintained by the festival organizers.
- The land acknowledgement text will be supplied and approved by the organization.
- Author profile photos and book covers may be provided in various dimensions and aspect ratios.
- User management (authentication, permissions) is handled by the WordPress backend and is out of scope for this site.

- Many users may be on their way to an event and using a mobile phone to look up the address or event details.
- Some users may have accessibility needs (e.g., vision, mobility, cognitive challenges).
- Users come from a very diverse background, including different ages, cultures, and technical abilities.
- Some users may be older and less comfortable with technology.

- Events may be either physical (in-person) or online (virtual), and the site must clearly indicate the format for each event.
- Event locations may be presented using both Indigenous and English place names.
  (These attributes are included in the Event entity to ensure users know how to attend and to respect local naming conventions.)

## Dependencies

- Reliable data source at https://victoriafestivalofauthors.ca
- Eventbrite and CanadaHelps integration
- Land acknowledgement content from organizers

## Out of Scope

- Detailed design of the visual layout
- Implementation of backend systems or APIs beyond data fetching
- Custom ticketing or donation systems (using Eventbrite and CanadaHelps only)
- User authentication, registration, and permissions management (handled by WordPress backend)

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- No upcoming events: The home page displays a clear message and suggests alternative content (e.g., past events, newsletter signup).
- Books with multiple authors: All author names and profiles are displayed for each book.
- Author profile photos and book covers: Images are displayed correctly regardless of their original dimensions or aspect ratios.

## Requirements *(mandatory)*

### Key Entities

- Event: title, date, description, Eventbrite link, featured status, participants (authors, facilitators, musicians)
- Author: name, alternate name, bio, profile photo, interviews, books, events 
- Book: title, cover image, author(s), link to purchase
- Sponsor: name, logo, link, description (optional)
- Facilitator: name, bio, photo, role 
- Musician: name, bio, photo, role
- Curator: name, bio, photo, role
- Interview: interviewee (an author), interviewer, introduction, Q&A format

## Success Criteria *(mandatory)*

### Measurable Outcomes

- 100% of featured events are visible on the home page with working Eventbrite links.
- All authors, facilitators, and musicians are displayed with correct names and photos.
- All books are shown with correct cover images and author attributions.
- Users can sign up for the newsletter and make donations without confusion or errors.
- Accessibility and organizational information is easy to find and understand.
- Social media links and land acknowledgement are present on every page.
- All user journeys can be independently tested as described above.

