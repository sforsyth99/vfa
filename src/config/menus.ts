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
      { label: 'Events', to: '/events' },
      { label: 'Authors', to: '/authors' },
      { label: 'Interviews', to: '/interviews' },
      { label: 'KidsFest', to: '/kidsfest2026' },
      { label: 'Archives', to: '/archives' },
    ],
  },
  {
    heading: 'The Festival',
    items: [
      { label: 'Venues', to: '/venues' },
      { label: 'Accessibility', to: '/vfa-accessibility-info' },
      { label: 'Festival History', to: '/history' },
    ],
  },
  {
    heading: 'About VFA',
    items: [
      { label: 'Who We Are', to: '/who-we-are' },
      { label: 'Our Mission', to: '/what-we-do' },
      { label: 'Strategic Plan', to: '/strategic-plan' },
      { label: 'Contact Us', to: '/contact-us' },
    ],
  },
  {
    heading: 'Support the Festival',
    items: [
      { label: 'Get Tickets', to: 'https://www.eventbrite.ca/o/victoria-festival-of-authors-11095513695', external: true },
      { label: 'Donate', to: 'https://www.canadahelps.org/en/charities/victoria-festival-of-authors-society/', external: true },
      { label: 'Volunteer', to: '/become-a-volunteer' },
      { label: 'Become a Sponsor', to: '/sponsor-us' },
    ],
  },
];
