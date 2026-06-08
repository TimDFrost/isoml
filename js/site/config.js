/**
 * IsoML Site Config — single source of truth for homepage & guide content.
 * Edit this file to update copy across the site without touching HTML.
 */

export const SITE = {
  name: "IsoML",
  tagline: "Comedy meets business",
  url: "https://isoml.com",
  company: "Oh Ya Inc",
  companyLegal: "Oh Ya Inc, Est. 2024",
  established: 2024,
  ceo: {
    name: "Tim Frost",
    title: "Chief Executive Officer",
    email: "tim@isoml.com",
    emailDisplay: "Tim@IsoML.com",
    phone: "603-519-6949",
  },
  email: "tim@isoml.com",
  phone: "603-519-6949",
};

export const SEO = {
  home: {
    title: "IsoML — Comedy Podcast, Comedians Wanted & Bribe Your Favorite Comedian",
    description:
      "Comedians: apply for invite-only podcast interviews at isoml.com. Fans: bribe your favorite comedian (75% to guests). Pre-order training, guides, and updates.",
    keywords:
      "comedians wanted, comedy podcast guest, submit stand up comedy, comedy podcast interview, bribe your favorite comedian, comedy training, how to be a comedian, isoml",
  },
};

export const NAV_LINKS = [
  { href: "/#podcast", label: "Podcast" },
  { href: "/#comedians-wanted", label: "Comedians Wanted" },
  { href: "/#bribe", label: "Bribe a Comic" },
  { href: "/#preorder", label: "Pre-order" },
  { href: "/#updates", label: "Updates" },
  { href: "/#fan-lounge", label: "Fan Lounge" },
  { href: "/simulator/", label: "TV Simulator", external: false },
];

export const PODCAST = {
  eyebrow: "The IsoML Podcast",
  title: "Where comedy meets business",
  description:
    "Every week we pull back the curtain on stand-up, clubs, content, and the hustle behind the laugh. Real conversations with working comedians, bookers, and operators building careers in comedy — and the business models that actually pay.",
  highlights: [
    "Behind-the-scenes of club economics & touring",
    "Joke craft, set structure, and stage confidence",
    "Marketing, merch, and monetizing your audience",
  ],
  youtube: {
    handle: "@IsoMassiveLaughs",
    url: "https://www.youtube.com/@IsoMassiveLaughs",
    channelId: "UC-B_skZn7Q0EHTGVKYWzetA",
    subscribeLabel: "Subscribe on YouTube",
  },
  /**
   * Pin episodes here as you publish — use video URL or 11-char ID.
   * Leave empty to show the channel uploads playlist (auto-updates).
   */
  episodes: [
    // { id: "VIDEO_ID", title: "Episode title", date: "2026-06-01" },
  ],
  /** "playlist" = latest uploads queue · "featured" = first pinned episode */
  embedMode: "playlist",
  maxEpisodes: 6,
  cta: { label: "Watch on YouTube", href: "https://www.youtube.com/@IsoMassiveLaughs" },
  platforms: [
    { name: "YouTube", href: "https://www.youtube.com/@IsoMassiveLaughs", icon: "youtube" },
    { name: "Spotify", href: "#", icon: "spotify", comingSoon: true },
    { name: "Apple Podcasts", href: "#", icon: "apple", comingSoon: true },
  ],
};

/** Six linked guides — edit titles, descriptions, and slugs here */
export const HOW_TO_GUIDES = [
  {
    slug: "writing-jokes",
    number: "01",
    title: "Writing Jokes That Land",
    shortDescription:
      "Premise, punchline, and rewrite loops — the fundamentals every working comic uses to build material that gets laughs on purpose.",
    descriptionPlaceholder:
      "Full guide coming soon. You'll learn premise selection, tag writing, callback structure, and how to test jokes without bombing your reputation.",
    keywords: ["joke writing", "comedy writing", "punchlines"],
    icon: "✍️",
    aiFocus:
      "joke writing fundamentals — premises, punchlines, tags, callbacks, and rewrite loops; how to test material and kill weak bits without losing my voice",
  },
  {
    slug: "stage-presence",
    number: "02",
    title: "Stage Presence & Delivery",
    shortDescription:
      "Mic technique, pacing, silence, and physicality — how you say it matters as much as what you say.",
    descriptionPlaceholder:
      "Full guide coming soon. Covers vocal variety, eye contact, handling hecklers, and owning the room from walk-on to walk-off.",
    keywords: ["stage presence", "comedy delivery", "stand up performance"],
    icon: "🎤",
    aiFocus:
      "stage presence and delivery — mic technique, pacing, pauses, vocal variety, body language, and commanding attention from walk-on to walk-off",
  },
  {
    slug: "open-mics",
    number: "03",
    title: "Open Mics & Your First Sets",
    shortDescription:
      "Finding rooms, signing up, surviving the bucket, and turning five brutal minutes into a repeatable process.",
    descriptionPlaceholder:
      "Full guide coming soon. Where to start, what to expect, how to prep a tight three minutes, and etiquette that gets you invited back.",
    keywords: ["open mic comedy", "first stand up set", "beginner comedian"],
    icon: "🚪",
    aiFocus:
      "open mics and first sets — finding rooms, signing up, preparing a tight 3–5 minutes, surviving bad nights, and etiquette that gets me invited back",
  },
  {
    slug: "building-a-set",
    number: "04",
    title: "Building a Tight 5-Minute Set",
    shortDescription:
      "From scattered bits to a cohesive mini-show — structure, transitions, and the arc that wins showcases.",
    descriptionPlaceholder:
      "Full guide coming soon. Set order, opener/closer strategy, theme vs. variety, and trimming fat without losing your voice.",
    keywords: ["comedy set structure", "5 minute set", "stand up set"],
    icon: "📋",
    aiFocus:
      "building a tight 5-minute set — opener/closer strategy, bit order, transitions, theme vs. variety, and trimming fat while keeping momentum",
  },
  {
    slug: "comedy-business",
    number: "05",
    title: "The Business of Stand-Up Comedy",
    shortDescription:
      "Bookings, splits, branding, and revenue streams beyond the door — comedy is show business.",
    descriptionPlaceholder:
      "Full guide coming soon. Club deals, corporate gigs, content strategy, and building an email list that converts.",
    keywords: ["comedy business", "how comedians make money", "booking comedy gigs"],
    icon: "💼",
    aiFocus:
      "the business of stand-up — booking gigs, club splits, branding, email lists, corporate work, content strategy, and realistic revenue streams for my level",
  },
  {
    slug: "finding-your-voice",
    number: "06",
    title: "Finding Your Comedic Voice",
    shortDescription:
      "Authenticity beats imitation. Discover the point of view only you can write from.",
    descriptionPlaceholder:
      "Full guide coming soon. Influences vs. copying, personal story mining, and developing a brand fans recognize instantly.",
    keywords: ["comedic voice", "comedy style", "authentic stand up"],
    icon: "🎭",
    aiFocus:
      "finding my comedic voice — point of view, authenticity vs. imitation, mining personal stories, and building a recognizable brand fans connect with",
  },
];

export const FUNNELS = {
  training: {
    id: "training",
    productId: "backer-comic",
    eyebrow: "Comedy Development Course",
    title: "Your material deserves a system — not another random Tuesday at the bucket.",
    tagline: "The structured path from scattered bits to booked gigs.",
    description:
      "Open mics teach survival. The Comedy Development Course teaches advancement — joke architecture, set construction, stage craft, and the business math club owners never explain. Built for beginners grinding their first five and working pros sharpening the next hour.",
    pullQuote: "Stop hoping the next set goes well. Start developing material that has to.",
    features: [
      "Video curriculum + worksheets you actually use between mics",
      "Live set reviews and Q&A — feedback from someone who's been in the bucket",
      "Private community of comics at your stage, not your cousin's opinions",
      "Founding pre-order locks launch pricing before the public pays retail",
    ],
    cta: { label: "Enroll at founding price", action: "preorder" },
    secondaryCta: { label: "Compare backer tiers", href: "#preorder" },
  },
  friend: {
    id: "friend",
    productId: "backer-fan",
    eyebrow: "Meet Your Favorite Comedian",
    title: "You've laughed at them for years. Now pull up a chair.",
    tagline: "Insider access for fans who want more than a post-show selfie.",
    description:
      "The handshake in the parking lot fades by morning. Priority tickets, bonus clips, and real conversation don't. Meet Your Favorite Comedian puts you inside the world of working comics — the stories behind the bits, the grind behind the grin, and the access most fans never get.",
    pullQuote: "Closer than the front row. Realer than Instagram.",
    features: [
      "Bonus podcast episodes and behind-the-scenes drops at launch",
      "Priority access to live shows and virtual hangs before public on-sale",
      "Direct support for independent comics building careers on their own terms",
      "Guardian bribers unlock a private 30-minute hang with their comic — see below",
    ],
    cta: { label: "Reserve your seat", action: "preorder" },
    secondaryCta: { label: "Bribe your way to a 1:1 hang", href: "#bribe" },
  },
};

/**
 * Pre-order campaign — crowdfunding-style monetization.
 * Paste Stripe Payment Links per reward tier when ready.
 */
export const STRIPE = {
  publishableKey: null,
  paymentLinks: {
    backer_fan: null,
    backer_comic: null,
    backer_pro: null,
    backer_producer: null,
    adopt_supporter: null,
    adopt_patron: null,
    adopt_champion: null,
    adopt_guardian: null,
  },
};

/**
 * Bribe Your Favorite Comedian — fan fundraiser (formerly Adopt-a-Comedian).
 * 75% to podcast comedy guests · 25% to IsoML platform.
 */
export const ADOPT_A_COMEDIAN = {
  headline: "Bribe Your Favorite Comedian",
  tagline: "The fastest way from fan to face-to-face.",
  pitch:
    "Every comic remembers the one person who showed up when it mattered. Bribe Your Favorite Comedian turns that instinct into something real — gas for the next mic, a showcase fee covered, and for Guardian bribers, thirty unscripted minutes with the comic you came to see. Seventy-five cents of every dollar lands with the comedian. The other quarter keeps the lights on.",
  fundSplit: {
    platform: 25,
    guests: 75,
    label: "75% comedy guests · 25% platform",
    detail:
      "Transparent split, no fine print. Three quarters fund your comic — podcast guest or featured roster spot. One quarter runs IsoML so the meeting actually happens.",
  },
  goal: 5000,
  goalLabel: "$5,000",
  seedFunded: 890,
  seedAdoptions: 23,
  howItWorks: [
    {
      step: "1",
      title: "Choose your comic",
      body: "Pick a featured comedian — or fund the guest pool and we'll match you with the next podcast interview you helped make possible.",
    },
    {
      step: "2",
      title: "Select your bribe",
      body: "From a single open-mic night ($15) to a full season ($500). Every level earns updates. Guardian bribers earn the hang.",
    },
    {
      step: "3",
      title: "Meet them where it counts",
      body: "Progress reports, Fan Lounge recognition, podcast shout-outs — and at Guardian level, a private 30-minute virtual hang with the comic you backed.",
    },
  ],
  /** Roster — add real comics as campaign launches */
  featuredComics: [
    {
      id: "pool",
      name: "General Comedy Guest Fund",
      city: "Podcast roster",
      pitch: "Fund the next invite-only guest — and get closer to the comics shaping the show.",
      goal: 2000,
      seedRaised: 420,
      adoptable: true,
      emoji: "🎪",
    },
    {
      id: "comic-spotlight-1",
      name: "Spotlight Comic — TBD",
      city: "Northeast US",
      pitch: "Open-mic regular grinding toward first paid weekend. Needs showcase fee + travel for regional club.",
      goal: 750,
      seedRaised: 310,
      adoptable: true,
      emoji: "🎤",
    },
    {
      id: "comic-spotlight-2",
      name: "Spotlight Comic — TBD",
      city: "Midwest US",
      pitch: "Writing new material, recording sets, building toward a tight five. Needs mic fees + editing for demo reel.",
      goal: 500,
      seedRaised: 160,
      adoptable: true,
      emoji: "✍️",
    },
  ],
  tiers: [
    {
      id: "adopt-supporter",
      name: "Supporter",
      price: 15,
      retailValue: 30,
      retailLabel: "1 open mic funded",
      description: "Buy them one night at the mic — bucket fee, gas, and the coffee that tastes like victory.",
      limit: 500,
      features: [
        "Digital certificate — proof you showed up first",
        "Shout-out on the Fan Lounge wall",
        "Personal progress email when your comic hits a milestone",
        "Briber badge — because you earned it",
      ],
      cta: "Bribe — $15",
      tier: "adopt",
      stripeKey: "adopt_supporter",
      category: "adopt",
    },
    {
      id: "adopt-patron",
      name: "Patron",
      price: 50,
      retailValue: 120,
      retailLabel: "1 month of reps",
      description: "One month of reps or one showcase entry — the push that turns a fan into someone they remember.",
      limit: 200,
      features: [
        "Everything in Supporter",
        "Pick your comic — or fund the guest pool",
        "Quarterly video update straight from the stage",
        "Your name on their supporter page — permanent",
        "6 months Meet Your Favorite Comedian at launch",
      ],
      cta: "Bribe — $50",
      badge: "Where access begins",
      tier: "adopt",
      stripeKey: "adopt_patron",
      category: "adopt",
    },
    {
      id: "adopt-champion",
      name: "Champion",
      price: 150,
      retailValue: 400,
      retailLabel: "Showcase season",
      description: "Fund a showcase cycle — fee, travel, promo — and watch someone you believe in step into the room they earned.",
      limit: 75,
      features: [
        "Everything in Patron",
        "First pick from the featured roster",
        "Podcast shout-out on launch day",
        "Exclusive clip drops — material fans never see live",
        "Vote on the next comic joining the roster",
      ],
      cta: "Bribe — $150",
      tier: "adopt",
      stripeKey: "adopt_champion",
      category: "adopt",
    },
    {
      id: "adopt-guardian",
      name: "Guardian",
      price: 500,
      retailValue: 1500,
      retailLabel: "Full season support",
      description: "The full season. The demo reel. The headshots. And thirty minutes alone with the comic you've been quoting since 2019.",
      limit: 20,
      features: [
        "Everything in Champion",
        "Guardian credit on their profile — forever",
        "Private 30-minute virtual hang with your comic",
        "Producer-level IsoML perks at launch",
        "Your name read on the launch podcast episode",
      ],
      cta: "Bribe — $500",
      badge: "Meet them — 20 spots",
      tier: "adopt",
      stripeKey: "adopt_guardian",
      category: "adopt",
    },
  ],
};

/** Comedians Wanted — invite-only podcast guest applications (SEO + submission form) */
export const COMEDIANS_WANTED = {
  headline: "Comedians Wanted",
  tagline: "Invite-only podcast interviews · Apply at isoml.com",
  pitch:
    "IsoML is where working comedians find podcast interviews, fan funding, and business-minded comedy content. We are invite-only — submit your info and we'll reach out to schedule an interview with Tim. Managers welcome.",
  inviteOnly:
    "Invite-only. Every application is reviewed. If you're a fit, Tim will contact you to set up the interview — no open casting calls, no spam.",
  seoDiscovery: [
    "Comedians search Google for podcast guest spots, comedy interview opportunities, and platforms that pay beyond the open-mic bucket.",
    "IsoML is built to be found for: comedians wanted, comedy podcast guest, submit stand up comedy, book comedy interview, comedy podcast submission.",
    "Share isoml.com/comedians-wanted with your comic friends, managers, and club bookers.",
  ],
  form: {
    nameLabel: "Comedian or manager name",
    namePlaceholder: "Stage name or manager's full name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    submitLabel: "Apply for invite",
    successMessage:
      "Application received. Invite-only — if you're a fit, Tim will email you to schedule an interview.",
  },
};

/** Updates & News — email list + upcoming features with upsells */
export const UPDATES_NEWS = {
  headline: "Updates & News",
  tagline: "Upcoming features, launch news, and early access",
  pitch:
    "Get email updates on new guides, podcast drops, Fan Lounge features, and pre-order windows. Subscribers hear first — and get upsell access before the public.",
  form: {
    submitLabel: "Get updates",
    successMessage: "You're on the list. Watch your inbox for launch news and early-access offers.",
  },
  upcomingFeatures: [
    {
      id: "podcast-launch",
      title: "Podcast interviews go live",
      description: "Invite-only comedy + business conversations with working comics and operators.",
      status: "In production",
      upsell: { label: "Apply as a guest", href: "#comedians-wanted" },
    },
    {
      id: "meet-comic",
      title: "Meet Your Favorite Comedian",
      description: "Founding membership for fans — bonus clips, priority tickets, and Guardian-level 1:1 hangs.",
      status: "Pre-order open",
      upsell: { label: "Reserve your seat", href: "#friend", preorder: "backer-fan" },
    },
    {
      id: "bribe-fund",
      title: "Bribe Your Favorite Comedian",
      description: "The direct line from fan to face-to-face — 75% to the comic, 30-minute hang at Guardian tier.",
      status: "Pre-order open",
      upsell: { label: "Meet them — from $500", href: "#bribe", preorder: "adopt-guardian" },
    },
    {
      id: "training-v1",
      title: "Comedy Development Course",
      description: "Structured curriculum, live feedback, and a community built for comics who refuse to plateau.",
      status: "Coming Fall 2026",
      upsell: { label: "Enroll at founding price", href: "#training", preorder: "backer-comic" },
    },
    {
      id: "fan-lounge-v2",
      title: "Fan Lounge + XP voting",
      description: "Clips, comments, leaderboards — gamified community for fans and comics.",
      status: "Preview live",
      upsell: { label: "Join Fan Lounge", href: "#fan-lounge" },
    },
    {
      id: "ai-coach",
      title: "AI Comedy Coach",
      description: "Agent-powered joke and set feedback wired to the How to Be a Comedian guides.",
      status: "On roadmap",
      upsell: { label: "Pre-order Pro Backer", href: "#preorder", preorder: "backer-pro" },
    },
  ],
};

export const PREORDER = {
  campaign: {
    name: "IsoML Launch Campaign",
    headline: "Back the comedy platform built for comics and the fans who fund them",
    subhead:
      "Meet Your Favorite Comedian. Enroll in the Comedy Development Course. Bribe your way to a private hang — before we open to the public.",
    goal: 15000,
    goalLabel: "$15,000",
    /** Demo seed — set to 0 when live; counts real pre-orders automatically */
    seedFunded: 2840,
    seedBackers: 47,
    deadline: "2026-08-01",
    launchWindow: "Fall 2026",
    creatorName: "Tim Frost · Oh Ya Inc",
    guarantee: {
      label: "Guaranteed or Your Pre-Order Back",
      detail: "If we don't deliver what we promise at launch, you get a full refund — no runaround.",
    },
  },
  pitch: {
    problem: {
      title: "Comedy has an attention problem",
      body:
        "Open mics don't pay. YouTube doesn't teach club economics. Fans want to support comics but there's no clear way in. Comics grind in silence while platforms capture the value.",
    },
    solution: {
      title: "IsoML connects craft, business, and the fans who want in",
      body:
        "Free guides earn trust. The podcast pulls back the curtain. The Comedy Development Course turns scattered reps into a career arc. Meet Your Favorite Comedian — and Bribe Your Favorite Comedian — give fans a door the industry never installed. Fan Lounge turns all of it into a game worth playing.",
    },
    proof: {
      title: "Already building in public",
      body:
        "Six SEO guides live. Gamified Fan Lounge. Public accounts. AI-ready architecture. This campaign funds the content, polish, and launch push — not a slide deck.",
    },
    whyNow: {
      title: "Why pre-order?",
      body:
        "Founding backers lock the lowest price forever, get named on the wall, and shape what we ship first. If we don't hit our goal, you still keep everything promised at pre-order — we're building either way.",
    },
  },
  /** Reward tiers — Kickstarter-style backer levels */
  tiers: [
    {
      id: "backer-fan",
      name: "Fan Backer",
      price: 25,
      retailValue: 84,
      retailLabel: "$7/mo at launch",
      description: "One year of Meet Your Favorite Comedian — the founding membership for fans who want inside the room.",
      limit: 250,
      features: [
        "12 months Meet Your Favorite Comedian at founding price",
        "Founding Fan badge + Fan Lounge flair",
        "Bonus podcast episodes — stories the stage never tells",
        "Priority tickets before the public even knows there's a show",
        "Name on the digital backer wall",
      ],
      cta: "Reserve your seat — $25",
      badge: "Most popular",
      tier: "fan",
      stripeKey: "backer_fan",
      anchorId: "friend",
    },
    {
      id: "backer-comic",
      name: "Comic Backer",
      price: 99,
      retailValue: 588,
      retailLabel: "$49/mo at launch",
      description: "3 months of the Comedy Development Course + lifetime Founding Comic status — enroll before doors open to the public.",
      limit: 150,
      features: [
        "3 months Comedy Development Course at launch",
        "All 6 guides expanded with pro worksheets",
        "Live set-review session — group Q&A with real feedback",
        "Private comic community — peers, not spectators",
        "Founding Comic badge — yours forever",
      ],
      cta: "Enroll — $99",
      badge: "Best for developing comics",
      tier: "comic",
      stripeKey: "backer_comic",
      anchorId: "training",
    },
    {
      id: "backer-pro",
      name: "Pro Backer",
      price: 199,
      retailValue: 1200,
      retailLabel: "Full curriculum value",
      description: "Six months of the Comedy Development Course + priority feedback — for comics ready to compress years into one season.",
      limit: 75,
      features: [
        "6 months Comedy Development Course at launch",
        "Priority set review — front of the founding queue",
        "All Pro + Comic Backer perks included",
        "Vote on the first three podcast guests",
        "Shout-out on the launch episode",
      ],
      cta: "Enroll — $199",
      tier: "pro",
      stripeKey: "backer_pro",
    },
    {
      id: "backer-producer",
      name: "Producer",
      price: 497,
      retailValue: 2500,
      retailLabel: "Lifetime + producer credit",
      description: "Lifetime Comedy Development Course + Producer credit — for believers who want a seat at the table, not a ticket at the door.",
      limit: 25,
      features: [
        "Lifetime Comedy Development Course access",
        "Producer credit on site + podcast",
        "1:1 strategy call with Tim (30 min)",
        "All Pro Backer perks included",
        "First access to live shows and collabs",
      ],
      cta: "Enroll — $497",
      badge: "Limited — 25 seats",
      tier: "producer",
      stripeKey: "backer_producer",
    },
  ],
  stretchGoals: [
    { amount: 5000, title: "Bonus guide: Touring 101", description: "Unlocked — every backer gets the 7th guide free at launch." },
    { amount: 10000, title: "Monthly live open-mic review stream", description: "Unlocked — Tim reviews submitted sets on YouTube Live." },
    { amount: 15000, title: "Full campaign funded — launch sprint", description: "Hit goal → accelerated launch + double Fan Lounge features at ship." },
    { amount: 25000, title: "Stretch: Bribe fund expansion", description: "Fund 10 additional roster slots + monthly briber update show." },
  ],
  trust: [
    "Guaranteed or Your Pre-Order Back",
    "Secure checkout via Stripe",
    "Founding prices locked at pre-order",
    "Bribe fund: 75% to comedy guests, 25% to platform",
    "Questions? tim@isoml.com",
  ],
  upsells: {
    guide: {
      title: "The free guides are the appetizer.",
      text: "The Comedy Development Course is the meal — 3 months at founding price, or bribe your way to meeting a working comic from $15.",
      tierId: "backer-comic",
    },
    fanLounge: {
      title: "You've watched them kill. Now meet them.",
      text: "Guardian bribers get a private 30-minute hang. Patron bribes start at $50 — 75% goes straight to the comic.",
      tierId: "adopt-guardian",
    },
  },
};

/** @deprecated — use PREORDER.tiers + ADOPT_A_COMEDIAN.tiers */
export const MONETIZE = {
  currency: "USD",
  products: [...PREORDER.tiers, ...ADOPT_A_COMEDIAN.tiers].map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    interval: "preorder",
    description: t.description,
    features: t.features,
    cta: { label: t.cta, action: "preorder" },
    tier: t.tier,
    badge: t.badge,
    stripeKey: t.stripeKey,
    limit: t.limit,
    retailValue: t.retailValue,
    hidden: false,
  })),
  upsells: {
    guide: { title: PREORDER.upsells.guide.title, text: PREORDER.upsells.guide.text, productId: PREORDER.upsells.guide.tierId },
    fanLounge: { title: PREORDER.upsells.fanLounge.title, text: PREORDER.upsells.fanLounge.text, productId: PREORDER.upsells.fanLounge.tierId },
  },
  revenueStreams: [],
};

/** Founder follow-up — pre-order campaign launch checklist */
export const FOUNDER_PLAYBOOK = {
  title: "Pre-order campaign checklist",
  intro: "Work through these steps to run a successful crowdfunding-style launch on IsoML. Progress saves locally.",
  steps: [
    {
      id: "adopt-roster",
      title: "Fill the Bribe Your Favorite Comedian roster",
      prompt: "Which 3 real comedians will be first on the featured roster?",
      followUp: "Edit ADOPT_A_COMEDIAN.featuredComics in config.js — name, city, pitch, funding goal per comic.",
    },
    {
      id: "campaign-video",
      title: "Record 90-second campaign video",
      prompt: "Can you explain Bribe Your Favorite Comedian (75/25 split) + pre-order rewards in under 90 seconds on camera?",
      followUp: "Embed YouTube in PREORDER.campaign.videoUrl. Campaigns with video convert 2–3× higher.",
    },
    {
      id: "stripe-preorder",
      title: "Create Stripe pre-order & bribe links",
      prompt: "Payment links for all 8 tiers — 4 pre-order + 4 Bribe tiers ($15–$500)?",
      followUp: "Stripe → Products → name each tier → Payment link → paste into STRIPE.paymentLinks in config.js.",
      action: { label: "Stripe payment links", href: "https://dashboard.stripe.com/payment-links/create" },
    },
    {
      id: "comedians-wanted",
      title: "Promote Comedians Wanted page",
      prompt: "Have you shared isoml.com/comedians-wanted with comics, managers, and club bookers?",
      followUp: "SEO page at pages/comedians-wanted.html — applications save to localStorage until backend is live.",
    },
    {
      id: "updates-email",
      title: "Wire Updates & News email list",
      prompt: "Where should update subscribers export to — Mailchimp, ConvertKit, or Resend?",
      followUp: "Subscribers save to isoml:v1:updates-subscribers. Export before blast; upsell CTAs link to bribe + pre-order tiers.",
    },
    {
      id: "deadline",
      title: "Set campaign deadline",
      prompt: "When does pre-order close? (Creates urgency — 30–45 days is typical.)",
      followUp: "Update PREORDER.campaign.deadline in config.js. Countdown renders automatically.",
    },
    {
      id: "goal",
      title: "Validate funding goal",
      prompt: "Is $15,000 the real minimum to launch content + marketing, or should we adjust?",
      followUp: "Goal = (tier prices × realistic backer mix). Lower goal = faster 'funded' social proof.",
    },
    {
      id: "first-backers",
      title: "Line up first 10 backers",
      prompt: "Who are 10 people you will personally ask to pre-order in week one?",
      followUp: "Campaigns that hit 30% in 48 hours often fund fully. DM before public push.",
    },
    {
      id: "stretch-goals",
      title: "Confirm stretch goals",
      prompt: "Are the 4 stretch goals deliverable if unlocked?",
      followUp: "Edit PREORDER.stretchGoals — only promise what ships within 90 days of launch.",
    },
    {
      id: "launch-email",
      title: "Launch email to waitlist",
      prompt: "Do you have emails from pre-order modals and waitlists to blast on day one?",
      followUp: "Export localStorage preorders + waitlists before backend. One email: story + CTA + deadline.",
    },
    {
      id: "social-proof",
      title: "Update seed funded amount",
      prompt: "Any offline pre-orders or commitments to add to the progress bar?",
      followUp: "Set PREORDER.campaign.seedFunded and seedBackers for honest starting momentum, then set to 0 when live.",
    },
    {
      id: "fulfillment",
      title: "Fulfillment plan",
      prompt: "What does each backer receive on launch day — login, email, or manual invite?",
      followUp: "Stripe webhook → tag user role (fan/comic/producer) → send welcome email with access links.",
    },
    {
      id: "legal-preorder",
      title: "Pre-order terms",
      prompt: "Estimated delivery (Fall 2026)? Refund policy if timeline slips?",
      followUp: "Add /pages/preorder-terms.html — required for trust at checkout scale.",
    },
  ],
};

/** Public user accounts — swap provider when backend auth ships */
export const AUTH = {
  defaultRole: "fan",
  roles: [
    { id: "fan", label: "Fan — vote, comment, share clips" },
    { id: "comic", label: "Comedian — fan perks + comic badge" },
  ],
  /** future: 'local' | 'magic_link' | 'oauth_google' | 'oauth_apple' */
  provider: "local",
  /** Session expiry — clear stale localStorage sessions (ms). Set null to disable. */
  sessionTtlMs: 7 * 24 * 60 * 60 * 1000,
};

/** Security policy — headers, validation, production switches */
export const SECURITY = {
  /** local-demo: PII in localStorage for prototyping only. Use "server" in production. */
  piiStorageMode: "local-demo",
  stripePaymentHosts: ["buy.stripe.com", "checkout.stripe.com"],
  allowedVideoHosts: ["www.youtube.com", "youtube.com", "youtu.be", "www.youtube-nocookie.com"],
  maxPostsStored: 500,
  maxCommentsStored: 2000,
  maxVotesStored: 10000,
};

/** Gamification rules — tune XP, levels, badges here */
export const GAMIFY = {
  leaderboardSize: 8,
  funniestBoardSize: 5,
  levelThresholds: [0, 100, 250, 500, 1000, 2000, 4000],
  actions: {
    POST_CREATED: { xp: 50, label: "Posted a clip" },
    COMMENT_CREATED: { xp: 15, label: "Left a comment" },
    CAST_VOTE: { xp: 5, label: "Voted funniest", cooldownKey: "daily-vote-bonus", cooldownMs: 3600000 },
    RECEIVED_UPVOTE: { xp: 10, label: "Someone laughed (upvote)" },
    POST_FEATURED: { xp: 100, label: "Featured on IsoML" },
    YOUTUBE_QUEUED: { xp: 75, label: "Queued for YouTube" },
    YOUTUBE_PUBLISHED: { xp: 250, label: "Featured on @IsoMassiveLaughs" },
    WEEKLY_FUNNIEST: { xp: 500, label: "Crowned funniest of the week" },
    GUIDE_HELPFUL: { xp: 8, label: "Marked a guide helpful" },
  },
  badges: [
    { id: "first-post", label: "First Clip", check: ({ action }) => action === "POST_CREATED" },
    { id: "crowd-voter", label: "Crowd Voter", check: ({ xp }) => xp >= 50 },
    { id: "regular", label: "Regular", check: ({ level }) => level >= 3 },
    { id: "superfan", label: "Superfan", check: ({ xp }) => xp >= 500 },
    { id: "funniest-week", label: "Funniest This Week", check: ({ action }) => action === "WEEKLY_FUNNIEST" },
    { id: "youtube-star", label: "YouTube Featured", check: ({ action }) => action === "YOUTUBE_PUBLISHED" },
    { id: "spotlight", label: "Spotlight Fan", check: ({ action }) => action === "POST_FEATURED" },
  ],
};

/** Fan Lounge — video posts, funniest-vote competition, YouTube featuring */
export const FAN_LOUNGE = {
  title: "Fan Lounge",
  description:
    "Post your funniest clips, vote for what kills, and climb the board. Top fan content gets featured on site — and promoted on @IsoMassiveLaughs.",
  maxCommentLength: 500,
  xpPreview: { post: 50, comment: 15, vote: 5 },
  videoProviders: ["youtube"],
  competition: {
    headline: "Funniest Fan Content",
    tagline: "Vote 😂 — highest score each week gets crowned",
    minVotesToQualify: 3,
    voteLabels: { up: "Funny", down: "Pass" },
  },
  youtube: {
    handle: "@IsoMassiveLaughs",
    url: "https://www.youtube.com/@IsoMassiveLaughs",
    channelId: "UC-B_skZn7Q0EHTGVKYWzetA",
    uploadUrl: "https://www.youtube.com/upload",
    featuredHeadline: "Featured on @IsoMassiveLaughs",
    featuredTagline: "Fan clips promoted to the IsoML YouTube channel",
  },
  founder: {
    emails: ["tim@isoml.com"],
    usernames: ["tim", "timfrost"],
  },
};

/** Future module slots — wire AI agents, remote API here */
export const MODULES = {
  agentChat: { enabled: false, mountId: "module-agent-chat" },
  userAuth: { enabled: true },
  gamify: { enabled: true },
  fanLounge: { enabled: true },
  checkout: { enabled: true },
  remoteApi: { enabled: false, baseUrl: null },
};
