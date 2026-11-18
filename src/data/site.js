import machineImg from '../assets/mission-machine.jpg'
import cleanroomImg from '../assets/vision-cleanroom.jpg'
import aerialImg from '../assets/collab-aerial.jpg'
import vialsImg from '../assets/menu-vials.jpg'

export const CONTACT = {
  company: 'Xceed Biopharma',
  street: '14451 Cornerstone Village Drive,',
  city: 'Houston, Texas 77014',
  email: 'info@xceedbiopharma.com',
  phone: '+1.713.566.0885',
  phoneHref: 'tel:+17135660885',
}

export const NAV_GROUPS = [
  {
    title: 'About Us',
    links: [
      { label: 'Mission', to: '/mission' },
      { label: 'Vision', to: '/vision' },
      { label: 'Team', to: '/team' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { label: 'GSI & CDMO', to: '/projects/gsi-cdmo' },
      { label: 'KSM & API', to: '/projects/ksm-api' },
      { label: 'The Biopavilion', to: '/projects/biopavilion' },
    ],
  },
]

export const NAV_PRIMARY = [
  { label: 'Insights', to: '/insights' },
  { label: 'Collaborate', to: '/collaborate' },
]

// Line arrays follow the mockup's exact line breaks (used on wide screens)
export const MISSION_LINES = [
  'By ensuring access to affordable and high-quality',
  'pharmaceuticals and active pharmaceutical',
  'ingredients through advanced and environmentally',
  'sensitive manufacturing processes, Xceed BioPharma',
  'aims to change the status quo, and improve access to',
  'life-saving medicines for all.',
]

export const MISSION_TEXT = MISSION_LINES.join(' ')

const VISION_TITLE_LINES = ['Necessity is the Mother', 'of Innovation']
const VISION_PARAGRAPH_LINES = [
  [
    'Broken pricing dynamics, unstable supply chains, and',
    'long lead times to commercialization resulting in',
    'exorbitant costs, questionable quality, and suboptimal',
    'health outcomes.',
  ],
  ['This is the sorry state of the markets that supply our', 'most critical medicines.'],
  [
    'Resolving this crisis provides a unique opportunity to',
    'revolutionize the way life-saving medicines are made',
    'and distributed.',
  ],
]

export const VISION = {
  title: VISION_TITLE_LINES.join(' '),
  titleLines: VISION_TITLE_LINES,
  paragraphs: VISION_PARAGRAPH_LINES.map((p) => p.join(' ')),
  paragraphLines: VISION_PARAGRAPH_LINES,
}

export const TEAM_LINES = [
  'A group of academics, entrepreneurs, scientists,',
  'former regulators, and executives from across the',
  'life sciences industry, with a notably wide range of',
  'backgrounds and expertise, united by a shared vision',
  'of how to deliver equity and resilience of care.',
]

export const TEAM_TEXT = TEAM_LINES.join(' ')

export const COLLAB_LINES = [
  ['Do you share our vision and drive to innovate?', 'Think there might be an opportunity for a', 'mutually beneficial collaboration?'],
  ['Xceed BioPharma believes in the value of', 'partnership - Let’s Talk'],
]

export const AREAS = [
  {
    slug: 'gsi-cdmo',
    num: '01',
    name: 'GSI & CDMO',
    short: 'GSI & CDMO',
    lines: [
      'Bringing a fresh perspective based on decades of experience to',
      'addressing chronic shortages of critical medications, and',
      'delivering ready-to-use and ready-to-mix products at competitive',
      'prices.',
    ],
    image: machineImg,
  },
  {
    slug: 'ksm-api',
    num: '02',
    name: 'KSM & API',
    short: 'KSM & API',
    lines: [
      'Using innovations in process chemistry and process engineering',
      'to create a commercially viable pipeline of KSM, Intermediaries,',
      'and API for manufacture that are price competitive & sustainable.',
    ],
    image: cleanroomImg,
  },
  {
    slug: 'biopavilion',
    num: '03',
    name: 'THE BIOPAVILION',
    short: 'The Biopavilion',
    lines: [
      'Leveraging end-to-end expertise in real estate development, and',
      'deep knowledge of the facility needs of the life sciences industry',
      'to create a master planned campus and shorten to market',
      'timelines.',
    ],
    image: aerialImg,
  },
]

for (const area of AREAS) area.text = area.lines.join(' ')

export const IMAGES = { machineImg, cleanroomImg, aerialImg, vialsImg }
