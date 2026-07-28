export interface NavItem {
  label: string;
  to: string;
  external?: boolean;
}

export interface FooterNavGroup {
  heading: string;
  items: NavItem[];
}

// ── Edit these to reorganize the header nav ───────────────────────────────────
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Events', to: '/events' },
  { label: 'Authors', to: '/authors' },
  { label: 'Interviews', to: '/interviews' },
  { label: 'KidsFest', to: '/kidsfest2026' },
];

// ── Edit these to reorganize the footer nav ───────────────────────────────────
export const FOOTER_NAV: FooterNavGroup[] = [
  {
    heading: 'Explore VFA',
    items: [
      { label: 'Archives', to: '/qa-archive-page' },
    ],
  },
  {
    heading: 'Festival',
    items: [
      { label: 'Events', to: '/events' },
      { label: 'Authors', to: '/authors' },
      { label: 'KidsFest', to: '/kidsfest2026' },
      { label: 'Interviews', to: '/interviews' },
      { label: 'Venues', to: '/venues' },
      { label: 'Accessibility', to: '/vfa-accessibility-info' },
    ],
  },
  {
    heading: 'About',
    items: [
      { label: 'Who we are', to: '/who-we-are-2' },
      { label: 'History', to: '/history' },
      { label: 'Strategic Plan', to: '/strategic-plan' },
      { label: 'Our mission', to: '/what-we-do' },
      { label: 'Contact Us', to: '/contact-us' },
    ],
  },
  {
    heading: 'Support the festival',
    items: [
      { label: 'Get Tickets', to: 'https://www.eventbrite.ca/o/victoria-festival-of-authors-11095513695', external: true },
      { label: 'Donate', to: 'https://www.canadahelps.org/en/charities/victoria-festival-of-authors-society/', external: true },
      { label: 'Volunteer', to: '/become-a-volunteer' },
      { label: 'Become a Sponsor', to: '/sponsor-us' },
    ],
  },
];
