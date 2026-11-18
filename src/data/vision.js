// Vision page copy and geometry. Coordinates are Figma design pixels (1728-wide frame);
// line arrays follow the reference's exact line breaks (used on wide screens).

export const TITLE = 'Necessity is the Mother of Innovation'

export const STRATEGY_LINES = [
  'Recognizing a once-in-a-generation opportunity to enhance',
  'the resilience and quality of critical drug supply, Xceed',
  'BioPharma and its collaborators have formulated a holistic',
  'strategy that involves leveraging technical and scientific',
  'expertise, political and economic resources, and a strong',
  'commitment to establishing a functional marketplace. This',
  'approach aims to guarantee the provision and accessibility of',
  'affordable, high-quality pharmaceuticals for everyone.',
]

export const INITIATIVES_LINES = ['In pursuit of this vision, several initiatives will', 'be undertaken over the coming decades:']

export const INITIATIVES = [
  [
    'Delivery to market of a differentiated',
    'portfolio of ready-to-use and',
    'ready-to-mix generic sterile',
    'injectables',
  ],
  [
    'Securing the means and modes of',
    'production for Active Pharmaceutical',
    'Ingredients, Key Starting Materials, and',
    'Intermediates',
  ],
  [
    'Creating and developing on-the-ground',
    'research, incubation, and manufacturing',
    'spaces to support internal projects, as well as',
    'offering a springboard to market for potential',
    'collaborators/tenants.',
  ],
]

// Assuring Success tabs. `label` sits in the octagon; `paragraphs` are line arrays where the
// reference shows the breaks, plain strings otherwise.
export const PILLARS = [
  {
    label: ['Collaborative', 'Regulatory', 'Relationships'],
    title: 'Collaborative Regulatory Relationships',
    paragraphs: [
      [
        'Xceed BioPharma’s approach to regulatory relationships is characterized',
        'by collaboration and forward-looking engagement with the FDA and other',
        'relevant regulatory agencies. The experienced Xceed BioPharma team, well-',
        'versed in regulatory frameworks, establishes a clear path for facility',
        'commissioning and novel product approvals.',
      ],
      [
        'Operating on principles of compliance and safety, this framework ensures',
        'a manufacturing process that produces finished materials of the highest',
        'purity. The broad and shared understanding of the geo-strategic landscape',
        'informs the development of collaboration pathways with regulators and',
        'policy-making bodies. These pathways are designed to align with the',
        'strategic interests of national healthcare systems.',
      ],
    ],
  },
  {
    label: ['Advancing', 'Through', 'Chemistry'],
    title: 'Advancing Through Chemistry',
    paragraphs: [
      'Continuous synthesis offers significant advantages to the pharmaceutical industry by providing greater control over processing conditions, enhancing safety in handling hazardous processes, and reducing manufacturing costs associated with active pharmaceutical ingredient (API) production. Utilizing continuous processing and flow synthesis within manufacturing programs offers substantial advantages, including cost reduction, risk management, and enhanced process control. Delivering reliable continuous processing solutions helps to mitigate risks associated with extreme conditions, boosts operational efficiency, reduces waste, and ultimately offers cost-effective opportunities for pharmaceutical manufacturing.',
    ],
  },
  {
    label: ['Investing in', 'Human', 'Capital'],
    title: 'Investing in Human Capital',
    paragraphs: [
      'Well-trained employees play a crucial role in contributing to efficient research and development, ensuring the creation of high-quality drugs and accelerating the drug approval process. A knowledgeable workforce also enhances regulatory compliance and minimizes costly errors, thereby reducing operational expenses and legal risks. Moreover, a strong emphasis on employee development fosters innovation and adaptability in an ever-evolving industry. Ultimately, a commitment to human capital not only promotes long-term growth and sustainability but also enhances the organization’s reputation, attracting top talent and bolstering investor confidence.',
    ],
  },
  {
    label: ['Public', 'Private', 'Partnership'],
    title: 'Public Private Partnerships',
    paragraphs: [
      'To best address the long-term healthcare needs within the country, it’s essential to establish partnerships between private enterprises and public institutions. The creation and optimization of productive capacity for crucial medications, from training programs to supporting research and development (R&D), clearly require effective collaboration with academic institutions and various government organizations. These multi-stakeholder relationships are a prerequisite for ensuring a resilient standard of care through the production of necessary goods, which might otherwise be economically unfeasible.',
    ],
  },
]

/* ------------------------------------------------------------------
   Hero: two rings of six terrain hexagons (200 × 177), 182.5 apart
------------------------------------------------------------------- */
const HX = 156.75
const HY = 91.25
// Slot offsets from the ring centre: top, upper-left, upper-right, lower-left, lower-right, bottom
export const RING_SLOTS = [
  [0, -2 * HY],
  [-HX, -HY],
  [HX, -HY],
  [-HX, HY],
  [HX, HY],
  [0, 2 * HY],
]

export const RINGS = [
  { side: 'l', cx: 365.25, cy: 369.75, tiles: [['rb', 180], ['lul'], ['lur'], ['lll'], ['llr'], ['lb']] },
  { side: 'r', cx: 1241.25, cy: 558.9, tiles: [['rt'], ['rul'], ['rur'], ['lur', 180], ['rlr'], ['rb']] },
]

// Navy dots [x, y, r] (drawn with multiply, so they darken the tiles they cross)
export const NAVY_DOTS = [
  [655.8, 337.2, 5], [634.4, 348.1, 5], [669.7, 381.1, 9], [611.5, 398.5, 2], [873, 400.5, 2.3],
  [680.5, 413.5, 2], [870.5, 442.5, 11], [809.5, 447.8, 3], [945.1, 449.5, 2.2], [773.3, 470.1, 1.8],
  [974, 483.5, 2.3], [742.5, 496.2, 1.8], [895.7, 496.6, 6], [1288.3, 497.4, 6], [866, 499.4, 6.2],
  [721.5, 513.6, 5], [1227.1, 520.7, 3.7], [833.1, 521.5, 3], [866, 548, 6.8], [1174, 568.2, 11.3],
  [1224, 586.4, 2.3], [852.1, 582.4, 5.2], [1262.7, 603.6, 4], [695.5, 612.1, 23.2], [1294.8, 619, 6.5],
  [838.9, 626, 6.8], [700.5, 642.5, 2], [692, 646, 1.5], [1598.8, 650, 6.2], [785.8, 652.8, 3],
  [494, 669, 4.7], [418.2, 670.5, 17.2], [717, 691, 1.5], [702.7, 699.1, 1.8], [682.4, 752.4, 10.4],
  [1264.8, 840.1, 6.2], [1657.2, 840.8, 6.1], [1578.9, 853.7, 2.3], [1492.4, 869.7, 13.1], [1607.7, 888.1, 2.3],
  [482.7, 810.3, 4.8], [1292.6, 227.4, 21.3], [735.5, 986, 2],
  // on the tiles
  [1061.5, 466.5, 12.5], [1101.9, 622.9, 8.6], [1119.7, 733.6, 6.5], [1434.3, 604.3, 6], [1335.7, 619, 9.5],
  [1321, 664, 6], [1451.7, 715, 8.5], [1232.3, 674, 6], [1217.7, 719, 9.5], [1258.3, 718.7, 7],
  [1290.3, 734, 4.5], [1329.3, 751.7, 3],
]

export const GREEN_DOTS = [
  [849.5, 483.1, 16.9], [691.7, 528.2, 63.4], [787.1, 530.5, 12.3], [169, 531.7, 5.3], [292.2, 516.9, 15],
  [1183.1, 525.5, 5], [909.9, 559.9, 25.4], [478.4, 563, 14.8], [1028.5, 567, 35], [584.5, 571.6, 16.1],
  [1158, 581.9, 5.6], [1226.7, 574.5, 2.1], [1133.2, 586, 3.5], [1174.8, 617.5, 20.5], [126.5, 616.1, 6.3],
  [367.3, 620.4, 5.5], [456.4, 628.6, 10.9], [1478.5, 441.5, 13], [1425.9, 577.4, 7], [1119, 553.5, 3],
]

// Plus signs [x, y] — large (63 wide, 12.5 thick) and small (21 wide, 4 thick)
export const BIG_PLUSES = [[138.5, 569.5], [256, 569.5], [138.5, 681.2], [256, 681.2]]
export const SMALL_PLUSES = [
  [1255.5, 151.6], [1295.7, 151.6],
  [1255.5, 189.8], [1295.7, 189.8], [1333.7, 189.8], [1373.8, 189.8],
  [1333.8, 228], [1373.8, 228],
  [400.2, 811.3], [440.2, 811.2],
  [400.2, 849.3], [440.2, 849.2], [478.2, 849.2], [518.5, 849.2],
  [478.2, 887.7], [518.2, 887.8],
]

/* ------------------------------------------------------------------
   Initiatives: the two sweeping arcs behind the photo, and the four
   branches that drop from it to the cards (section-relative)
------------------------------------------------------------------- */
// [P0, P1, P2, P3] — `from` is the flatter shape they start drawing in with
export const ARCS = [
  { from: [18, 381.5, 640, 376, 1300, 390, 1728, 560], to: [18, 381.5, 608.7, 362.6, 1391.5, 450.4, 1728, 1008] },
  { from: [1728, 381.5, 1106, 376, 446, 390, 18, 560], to: [1728, 381.5, 1134.9, 362.6, 353.9, 451.8, 18, 1006] },
]

export const BRANCHES = [
  'M366 1004C361.7 1015.8 339.8 1048.6 332 1074',
  'M827 1004C836.9 1021.5 855.2 1049.6 863.5 1074',
  'M898.5 1004C885.1 1028.8 870 1055.8 863.5 1074',
  'M1359.5 1004C1372.3 1028.8 1387.1 1048.1 1395 1074',
]

// Octagon centres (Assuring Success), section-relative
export const OCTAGONS = [
  [244, 359.5],
  [422, 533],
  [244, 706.5],
  [422, 880],
]
