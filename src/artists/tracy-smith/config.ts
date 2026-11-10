import type { ArtistSite } from '@/core/types'

/**
 * Tracy Smith — first artist on the platform.
 * Copy marked in approvals.json must be approved by Tracy before publication.
 */
export const tracySmith: ArtistSite = {
  slug: 'tracy-smith',
  hostnames: ['localhost', '127.0.0.1'],
  name: 'Tracy Smith',
  descriptor: 'Live Vocalist & Entertainer',
  location: 'Based in St. Louis, Missouri',
  genres: ['Soul', 'Jazz', 'Gospel', 'R&B', 'Timeless Favorites'],
  theme: {
    colors: {
      stage: '#171514',
      ivory: '#F0EAE0',
      copper: '#B79073',
      walnut: '#665049',
      sand: '#E3D7CA',
      night: '#241F1C',
    },
  },
  hero: {
    eyebrow: 'St. Louis · Vocalist & Live Entertainer',
    headline: ['Tracy', 'Smith.'],
    intro:
      'Soulful. Versatile. Unforgettable. Live music for the moments that deserve more than ordinary.',
    image: {
      base: '/artists/tracy-smith/hero-portrait',
      widths: [480, 768, 1200, 1206],
      width: 1206,
      height: 1801,
      alt: 'Tracy Smith singing into a microphone on stage',
      // Face sits about 47% across and 14% down the frame.
      focal: { mobile: { x: 47, y: 14 }, desktop: { x: 47, y: 18 } },
    },
  },
  about: {
    heading: ['Meet', 'Tracy Smith'],
    tagline: 'One Voice. A World of Music. An Unforgettable Experience.',
    paragraphs: [
      'With a voice that moves effortlessly between gospel, soul, jazz, R&B, and timeless classics, Tracy Smith is more than a singer—she’s an experience. Known for her powerful vocals, magnetic stage presence, and ability to connect with audiences, Tracy brings passion, elegance, and authenticity to every performance.',
      'A seasoned, world-traveled vocalist, Tracy’s musical journey has taken her from stages across the United States to audiences throughout Europe, the Middle East, and South America. Among her most meaningful experiences are performances entertaining American troops overseas through the U.S. Department of State, sharing the power of music with those serving far from home.',
      'Rooted in the rich musical traditions of St. Louis, Tracy has built a career performing at concerts, churches, festivals, private celebrations, and distinguished venues. Whether delivering a soul-stirring gospel selection, an intimate jazz standard, or an electrifying R&B favorite, she has a gift for making every song—and every moment—her own.',
      'From intimate gatherings to grand stages, Tracy Smith delivers more than exceptional music. She creates an atmosphere, connects with the audience, and leaves a lasting impression.',
    ],
    closing: 'Experience the voice. Feel the music. Discover Tracy Smith.',
    facts: ['Based in St. Louis, Missouri', 'Soul · Jazz · Gospel · R&B'],
  },
  performances: {
    heading: 'Hear what words can’t describe.',
    items: [
      {
        id: 'ensemble',
        youtubeId: 'ox8Noq3j06Y',
        kicker: 'Live ensemble',
        title: 'The full performance experience',
        poster: {
          base: '/artists/tracy-smith/band',
          widths: [480, 768, 960],
          width: 960,
          height: 540,
          alt: 'Tracy Smith performing with a live band in St. Louis',
          focal: { mobile: { x: 50, y: 40 }, desktop: { x: 50, y: 40 } },
        },
      },
      {
        id: 'close-up',
        youtubeId: 'lKYDKf9yZpQ',
        kicker: 'Live vocals',
        title: 'Up close with the music',
        poster: {
          base: '/artists/tracy-smith/closeup',
          widths: [432],
          width: 432,
          height: 768,
          alt: 'Tracy Smith singing at the microphone',
          focal: { mobile: { x: 44, y: 24 }, desktop: { x: 44, y: 24 } },
        },
      },
      {
        // Source: IMG_2380.MOV (vertical phone clip, 15 s), self-hosted.
        id: 'live-horns',
        src: '/artists/tracy-smith/live-horns.mp4',
        kicker: 'On stage',
        title: 'Live with the horn section',
        poster: {
          base: '/artists/tracy-smith/live-horns-poster',
          widths: [480],
          width: 480,
          height: 848,
          alt: 'Tracy Smith singing on a red-curtained stage with a live band and horn section',
          focal: { mobile: { x: 60, y: 48 }, desktop: { x: 60, y: 48 } },
        },
      },
      {
        // Source: IMG_2379.MOV (square clip with a colour filter, 52 s), self-hosted.
        id: 'acoustic',
        src: '/artists/tracy-smith/acoustic.mp4',
        kicker: 'Unplugged',
        title: 'An acoustic moment',
        poster: {
          base: '/artists/tracy-smith/acoustic-poster',
          widths: [480, 720],
          width: 720,
          height: 720,
          alt: 'Tracy Smith playing acoustic guitar, filmed close up at home',
          focal: { mobile: { x: 45, y: 30 }, desktop: { x: 45, y: 30 } },
        },
      },
    ],
  },
  gallery: {
    heading: 'On stage and off.',
    items: [
      {
        // Source: IMG_2477.png
        base: '/artists/tracy-smith/stage-gown',
        widths: [480, 768, 1024],
        width: 1024,
        height: 1536,
        alt: 'Tracy Smith in a black lace and tulle gown, holding a vintage microphone stand on a dimly lit stage',
        focal: { mobile: { x: 50, y: 30 }, desktop: { x: 50, y: 30 } },
      },
      {
        // Source: phone photo, EXIF-rotated and cropped 4:5 around the singer; brightened slightly (low light).
        base: '/artists/tracy-smith/dark-room',
        widths: [480, 768, 1200, 1600, 2000],
        width: 2000,
        height: 2500,
        alt: 'Tracy Smith singing into a vintage-style microphone on a dark stage, with an upright bass behind her',
        focal: { mobile: { x: 40, y: 35 }, desktop: { x: 40, y: 35 } },
      },
      {
        // Source: IMG_2472.PNG (transparent cut-out, trimmed and capped at 2000 px wide)
        base: '/artists/tracy-smith/studio-portrait',
        widths: [480, 768, 1200, 1600, 2000],
        width: 2000,
        height: 3000,
        alt: 'Tracy Smith smiling, seated on a stool in a black feathered jacket and jeans',
        focal: { mobile: { x: 50, y: 50 }, desktop: { x: 50, y: 50 } },
        cutout: true,
      },
      {
        // Source: video still (918 px wide), cropped head-to-hip to drop the foreground.
        base: '/artists/tracy-smith/backyard-set',
        widths: [480, 768, 918],
        width: 918,
        height: 1190,
        alt: 'Tracy Smith in a denim jumpsuit, smiling and singing into a microphone at an outdoor party with string lights behind her',
        focal: { mobile: { x: 50, y: 25 }, desktop: { x: 50, y: 25 } },
      },
      {
        // Source: phone photo (1206 px wide), trimmed at the top only.
        base: '/artists/tracy-smith/city-evening',
        widths: [480, 768, 1200, 1206],
        width: 1206,
        height: 2115,
        alt: 'Tracy Smith smiling in a black outfit and grey knit vest, standing beside a large glass sculpture in a warmly lit restaurant',
        focal: { mobile: { x: 45, y: 25 }, desktop: { x: 45, y: 25 } },
      },
    ],
  },
  experience: {
    heading: ['One voice.', 'Every occasion.'],
    intro:
      'From refined receptions to high-energy live shows, choose the performance format that fits the room and the moment.',
    items: [
      {
        id: 'solo',
        title: 'Solo performance',
        description:
          'Featured vocals with professional backing tracks. A flexible option for intimate events and special moments.',
      },
      {
        id: 'pianist',
        title: 'Vocalist + pianist',
        description:
          'A warm, expressive live pairing for ceremonies, dinners, receptions, and listening rooms.',
      },
      {
        id: 'full-band',
        title: 'Full band experience',
        description:
          'Rich arrangements and the impact of live musicians for concerts, celebrations, and larger productions.',
      },
    ],
  },
  booking: {
    heading: 'Let’s make it memorable.',
    intro:
      'Planning a concert, private celebration, community gathering, church program, or corporate event? Share a few details and Tracy’s booking team will review them and follow up.',
    note: 'Sending an inquiry does not reserve a date. Availability, fees, and details are confirmed by Tracy’s booking team.',
    eventTypes: [
      { value: 'corporate', label: 'Corporate event' },
      { value: 'wedding-private', label: 'Wedding or private celebration' },
      { value: 'concert-venue', label: 'Concert or venue' },
      { value: 'church', label: 'Church or inspirational event' },
      { value: 'other', label: 'Other' },
    ],
    formats: [
      { value: 'solo', label: 'Solo with backing tracks' },
      { value: 'pianist', label: 'With pianist' },
      { value: 'full-band', label: 'Full band' },
    ],
    budgetBands: [
      { value: 'under-1500', label: 'Under $1,500' },
      { value: '1500-3000', label: '$1,500 – $3,000' },
      { value: '3000-6000', label: '$3,000 – $6,000' },
      { value: '6000-plus', label: '$6,000+' },
    ],
  },
  contact: {
    // managementEmail is intentionally unset until Tracy confirms a public contact.
    social: [],
  },
}
