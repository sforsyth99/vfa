# Data Model: Author's Festival Website


## Entities

### Person
- id: string
- name: string  # Required (display name, indigenous or English)
- namePronunciation?: string
- alternateName?: string
- alternateNamePronunciation?: string
- pronouns?: string
- bio?: string
- photo?: string (URL)
- roles: Array<'Author' | 'Facilitator' | 'Musician' | 'Curator' | 'Moderator' | 'Other'>
- books?: Array<Book>         # Only for Authors
- interviews?: Array<Interview> # Only for Authors
- events?: Array<Event>       # Only for Authors

### Event
- id: string
- title: string
- date: string (ISO8601)
- startTime: string
- endTime: string
- description: string
- registrationLink: string  # General registration/ticketing link (e.g., Eventbrite)
- onlineLink?: string       # Optional link for online event access (e.g., Zoom, YouTube)
- featured: boolean
- format: 'physical' | 'online'
- location?: {
    name: string
    namePronunciation?: string
    alternateName?: string
    alternateNamePronunciation?: string
    address?: string
  }
- participants: Array<Person>
- sponsors?: Array<Sponsor>  # One or more sponsors for the event
- pricePoints: Array<number>


### Book
- id: string
- title: string
- description: string
- coverImage: string (URL)
- authors: Array<Person>
- purchaseLink?: string

### Sponsor
- id: string
- name: string
- logo?: Array<string> (URLs)
- link?: string
- description?: string
- sponsorshipLevel?: number

### Interview
- id: string
- interviewees: Array<Person>
- interviewers: Array<Person>
- introduction: string
- content: Array<
    | { type: 'text', text: string }
    | { type: 'qa', question: string, answer: string }
  >
  # content is an ordered list of either plain text chunks or question-and-answer pairs, allowing flexible rendering and styling

## Relationships
- An Event can have multiple participants (Person with roles: author, facilitator, musician, curator, etc.)
- A Book can have multiple authors (Person)
- A Person with role Author can have multiple books and interviews
- Sponsors are independent but may be linked to events
- An interview has one or more Person(s) as interviewees

---

*Update this file as the data model evolves during implementation.*
