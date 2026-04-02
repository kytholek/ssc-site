/**
 * SOURCE CODE: LIFE — data.js
 * All static content: number meanings, quests, archetypes.
 * Depends on: numerology.js (for MASTERS)
 */

/* ================================================
   ROOT NUMBER MEANINGS (1–9, 11, 22, 33, 44)
   ================================================ */
const ROOT = {
  1: {
    name: 'The Initiator', essence: 'Original Creative Force',
    lp:    'You are here to learn bold self-direction — to move first, pioneer new paths, and lead without waiting for permission. The simulation places you at the beginning of cycles and tests whether you will step forward or shrink back.',
    ex:    'You naturally carry leadership, pioneering instinct, and original thinking. You were made to start things without prompting, blaze new trails, and inspire others through confident action.',
    soul:  'Deep within, you crave autonomy, recognition, and the freedom to lead. Your soul yearns to be the initiator — the original spark that sets things in motion.',
    outer: 'The world sees you as confident, self-directed, and independent — a natural leader who moves forward without needing permission or approval.',
    ach:   'Your achievement energy centres on initiation and leadership. You accomplish most powerfully when you go first and forge new paths without hesitation.',
    theme: 'The overarching theme of your life involves initiating new cycles, developing independence, and learning that self-reliance is a gift — not a burden.',
    shadow: 'The shadow of 1 is arrogance, isolation, and the fear of dependence dressed as independence. When the initiating energy collapses, it becomes aggression, self-centredness, or total shutdown — the person who goes nowhere because they cannot admit they need a map. The unintegrated 1 confuses leading with dominating, and starting with refusing to finish.',
    integration: 'Integration for 1 means learning that receiving is not weakness. The fully expressed 1 leads by example rather than demand, includes others without losing the thread of their own direction, and initiates from genuine vision rather than compulsive restlessness. Self-reliance becomes self-sufficiency — the kind that has room for others inside it.',
    aff:   '"I am the first spark of creation. I initiate without waiting for permission."'
  },
  2: {
    name: 'The Harmonizer', essence: 'Bridge & Balance',
    lp:    'You are here to master connection — to harmonize opposites, bridge divides, and find unity in duality. Every relationship the simulation brings is a mirror of your own inner polarities.',
    ex:    'You naturally carry diplomatic awareness, relational sensitivity, and dual-perspective vision. You see all sides, bring people together, and create peace from conflict.',
    soul:  'Deep within, you crave harmony, partnership, and the experience of being truly seen. Your soul yearns to belong — to meet and be met in genuine union.',
    outer: 'The world sees you as gentle, empathetic, and easy to trust — a natural mediator and peacemaker who brings calm to even the most charged situations.',
    ach:   'Your achievement energy centres on collaboration and partnership. You accomplish most powerfully through relationship and cooperative effort.',
    theme: 'The overarching theme of your life involves mastering relationship, learning to receive as well as give, and discovering wholeness through conscious connection.',
    shadow: 'The shadow of 2 is self-erasure, codependency, and the manipulation that lives inside endless accommodation. When the harmonising energy collapses inward, it produces the person who disappears into other people\'s needs, resentment that accumulates silently, and passive aggression deployed in place of direct truth. The unintegrated 2 mistakes compliance for kindness.',
    integration: 'Integration for 2 means becoming a bridge without becoming a doormat. The fully expressed 2 holds space for others without losing their own ground, speaks their truth even when it creates temporary discomfort, and discovers that the peace they seek through harmony can only arrive through the honesty they have been avoiding.',
    aff:   '"I harmonize from wholeness, not from lack."'
  },
  3: {
    name: 'The Creator', essence: 'Expression & Joy',
    lp:    'You are here to learn authentic self-expression — to channel creative force without performing for approval. The simulation blocks creativity until you stop seeking validation and start expressing truth.',
    ex:    'You naturally carry creative flow, expressiveness, and joyful energy. You communicate beautifully, uplift others naturally, and inspire through genuine authenticity.',
    soul:  'Deep within, you crave expression, joy, and creative freedom. Your soul yearns to be heard — to share its unique voice without apology or diminishment.',
    outer: 'The world sees you as charming, expressive, and magnetic — a natural communicator whose presence uplifts any room and inspires others to come alive.',
    ach:   'Your achievement energy centres on creative expression. You accomplish most powerfully when you allow authentic creativity to lead, free from the need for applause.',
    theme: 'The overarching theme of your life involves discovering and honouring your unique voice, finding joy through creation, and learning to complete what you begin.',
    shadow: 'The shadow of 3 is performance, superficiality, and creativity deployed as armour rather than genuine expression. When the expressive energy collapses, it produces relentless social performance, scattered attention that never completes anything, or a silence that comes from believing the inner voice is not worth hearing. The unintegrated 3 entertains to avoid being seen.',
    integration: 'Integration for 3 means making things without needing the audience\'s approval to validate the making. The fully expressed 3 creates from overflow rather than deficit, says the true thing rather than the clever thing, and learns that joy is not a performance to be perfected but a frequency to be inhabited — imperfectly, loudly, and without apology.',
    aff:   '"I am a clear channel for creative force."'
  },
  4: {
    name: 'The Builder', essence: 'Structure & Stability',
    lp:    'You are here to master discipline, order, and patient building. The simulation tests your relationship with structure — too rigid and it shatters you; too loose and chaos forces discipline upon you.',
    ex:    'You naturally carry organizational instinct, systematic thinking, and grounded presence. You create order from chaos and manifest through disciplined, sustained effort.',
    soul:  'Deep within, you crave stability, security, and the satisfaction of building something solid and lasting. Your soul yearns to create foundations that endure.',
    outer: 'The world sees you as reliable, methodical, and dependable — the one others count on to get things done and keep everything steady.',
    ach:   'Your achievement energy centres on building and consolidation. You accomplish most powerfully through sustained, disciplined effort compounded over time.',
    theme: "The overarching theme of your life involves learning the sacred nature of limitation, discovering that structure creates freedom, and building foundations that serve those who come after.",
    shadow: 'The shadow of 4 is rigidity, workaholism, and the belief that structure is the same as safety. When the building energy contracts, it produces obsessive control, inability to rest without guilt, and a harshness toward both self and others that mistakes discipline for punishment. The unintegrated 4 builds walls in place of foundations.',
    integration: 'Integration for 4 means discovering that the body and the spirit need maintenance as much as the project does. The fully expressed 4 builds with patience rather than compulsion, honours limitation as creative constraint rather than personal failure, and learns that the most enduring structures include flexibility — the ability to adapt without collapse.',
    aff:   '"I build foundations that serve life\'s unfolding."'
  },
  5: {
    name: 'The Explorer', essence: 'Freedom Through Embodiment',
    lp:    'You are the central vessel — the interface between spirit and matter. Your lesson is full presence in the midst of constant change. The simulation provides endless variety to test whether you stay present or flee.',
    ex:    'You naturally carry adaptability, present-moment awareness, and dynamic responsiveness. You are the interface in the system — embodying freedom through presence, not escape.',
    soul:  'Deep within, you crave freedom, variety, and full sensory experience. Your soul yearns to explore — to taste life completely without being caged.',
    outer: 'The world sees you as adventurous, dynamic, and magnetically alive — someone who inhabits the present moment in a way others aspire to.',
    ach:   'Your achievement energy centres on adaptability and embodied presence. You accomplish most powerfully when you stay fully here and let each moment be enough.',
    theme: 'The overarching theme of your life involves mastering presence, discovering that true freedom is found within rather than through escape, and becoming the living interface between worlds.',
    shadow: 'The shadow of 5 is escape, addiction, and the restlessness that confuses movement with freedom. When the presence energy disperses, it produces the person who is always arriving and never staying, who numbs sensation in the name of chasing it, and who mistakes novelty for depth. The unintegrated 5 fears presence because presence means feeling everything.',
    integration: 'Integration for 5 means discovering that the freedom they have been searching for was never in the next place. The fully expressed 5 brings full attention to what is already here — and finds that real aliveness is not caused by constant change but by the willingness to be completely present to whatever is. Freedom becomes the quality of being, not the location.',
    aff:   '"I am fully here — the interface between spirit and matter."'
  },
  6: {
    name: 'The Nurturer', essence: 'Service & Responsibility',
    lp:    'You are here to learn that love requires boundaries — that serving others begins with serving yourself. The simulation places you in caretaking roles and tests whether you enable or empower.',
    ex:    'You naturally carry nurturing instinct, compassionate awareness, and integration ability. You are the integrator — nothing completes until it reaches you and becomes sustainable.',
    soul:  'Deep within, you crave love, belonging, and the fulfilment of being genuinely needed. Your soul yearns to nurture — to create a world where everyone feels cared for.',
    outer: 'The world sees you as warm, responsible, and caring — someone who shows up reliably and creates environments of safety and unconditional support.',
    ach:   'Your achievement energy centres on service and care. You accomplish most powerfully when you serve from wholeness rather than self-sacrifice.',
    theme: 'The overarching theme of your life involves mastering the balance between self-care and service, learning that boundaries are an act of love, and becoming a sustainable source of nurturance.',
    shadow: 'The shadow of 6 is martyrdom, control disguised as care, and the resentment that builds when love is given without being resourced. When the nurturing energy collapses, it produces the person who exhausts themselves serving others while secretly demanding recognition, who enables rather than empowers, and who uses care as a form of control. The unintegrated 6 cannot receive.',
    integration: 'Integration for 6 means learning that sustainable love requires a sustainable source. The fully expressed 6 creates boundaries not as rejection but as the condition of genuine generosity — they discover that saying no to depletion is how they protect their capacity to say yes to what actually matters. Receiving becomes as natural as giving.',
    aff:   '"I serve from wholeness and stay whole while serving."'
  },
  7: {
    name: 'The Seeker', essence: 'Wisdom & Inner Knowing',
    lp:    'You are here to seek truth through direct experience — not merely intellectual knowing. The simulation enforces solitude until you stop looking to external authorities and begin trusting your own inner oracle.',
    ex:    'You naturally carry an analytical mind, introspective nature, and deep inner authority. You see beneath the surface and teach wisdom only after you have lived it.',
    soul:  'Deep within, you crave truth, understanding, and spiritual depth. Your soul yearns to pierce through illusion — to touch what is actually real beneath all the noise.',
    outer: 'The world sees you as introspective, intelligent, and quietly compelling — someone who observes carefully and carries a stillness others find deeply reassuring.',
    ach:   'Your achievement energy centres on investigation and inner mastery. You accomplish most powerfully when you trust your own knowing above any external validation.',
    theme: 'The overarching theme of your life involves the sacred quest for truth, learning to embody wisdom rather than merely accumulate knowledge, and finding the divine in the everyday.',
    shadow: 'The shadow of 7 is isolation, intellectual arrogance, and the paralysis of analysis that substitutes knowing for living. When the seeking energy turns inward without outlet, it produces the person who withholds their wisdom behind a wall of scepticism, who trusts no one including themselves, and who uses the quest for truth as a way to avoid relationship. The unintegrated 7 analyses feeling rather than feeling it.',
    integration: 'Integration for 7 means bringing the wisdom down from the mountain and letting it serve. The fully expressed 7 trusts their inner knowing enough to share it, allows other people in without losing the thread of their own inner life, and discovers that the truth they sought in solitude becomes more real when it is lived in relationship with the world.',
    aff:   '"I trust my inner knowing and embody the wisdom I discover."'
  },
  8: {
    name: 'The Power Master', essence: 'Authority & Manifestation',
    lp:    'You are here to master yourself — to discover that true power is self-mastery, not control of others. The simulation will make your temptations inescapable until you demonstrate dominion over impulse.',
    ex:    'You naturally carry authority, manifestation ability, and achievement drive. You demonstrate power-with rather than power-over, and you lead through earned respect.',
    soul:  'Deep within, you crave mastery, influence, and the satisfaction of tangible accomplishment. Your soul yearns to build something that proves what disciplined human will can achieve.',
    outer: 'The world sees you as authoritative, ambitious, and capable — someone who commands respect naturally and consistently delivers results.',
    ach:   'Your achievement energy centres on mastery and manifestation. You accomplish most powerfully when discipline, vision, and integrity are working in alignment.',
    theme: 'The overarching theme of your life involves learning the proper use of power, discovering that self-mastery precedes all other authority, and proving that material success is a spiritual test.',
    shadow: 'The shadow of 8 is domination, materialism, and the pursuit of power as a substitute for the self-worth that was never properly built. When the power energy operates unconsciously, it produces control, financial compulsion, abuse of authority, and the belief that achievement will finally make the person feel whole. The unintegrated 8 confuses having with being.',
    integration: 'Integration for 8 means recognising that the authority they were born to carry begins inside. The fully expressed 8 exercises power in service of others rather than at their expense, builds material success without sacrificing integrity, and discovers that true abundance — the kind that does not disappear when the numbers change — is built on self-mastery rather than self-promotion.',
    aff:   '"I master myself and use power to serve."'
  },
  9: {
    name: 'The Humanitarian', essence: 'Completion & Universal Service',
    lp:    'You are here to complete cycles with grace — to release what is finished and serve the greater good. The simulation brings repeated endings; your lesson is letting go with love.',
    ex:    'You naturally carry compassionate awareness, universal perspective, and completion orientation. You facilitate endings and serve collective evolution through wisdom freely shared.',
    soul:  'Deep within, you crave meaning, contribution, and the sense of having served something larger than yourself. Your soul yearns to give — to leave the world measurably better.',
    outer: 'The world sees you as compassionate, idealistic, and deeply wise — someone who holds all of humanity in their heart with genuine tenderness.',
    ach:   'Your achievement energy centres on completion and service to the whole. You accomplish most powerfully when you release attachment to outcomes and give freely.',
    theme: 'The overarching theme of your life involves learning graceful release, completing cycles consciously, and contributing your accumulated wisdom to collective evolution.',
    shadow: 'The shadow of 9 is self-righteousness, martyrdom, and the inability to complete — particularly to complete the self. When the completion energy stalls, it produces the person who serves everyone else to avoid their own unfinished business, who clings to suffering as an identity, and who gives so much that nothing real is ever received. The unintegrated 9 completes everything except themselves.',
    integration: 'Integration for 9 means applying the same compassion they extend to the world to their own unfinished interior. The fully expressed 9 releases the past with genuine love rather than spiritual performance, receives what others offer without guilt, and discovers that the completion they came to facilitate begins with their own — with the loops closed, the grief held, the self finally included in the universal care.',
    aff:   '"I complete with grace and serve the whole."'
  },
  11: {
    name: 'The Illuminated Bridge', essence: 'Master Channel Between Worlds',
    lp:    'A master number — your lesson is to channel higher wisdom while remaining grounded in human experience. Heightened sensitivity is your gift; rigorous daily grounding and energetic protection are its requirements.',
    ex:    'A master expression — you carry gateway frequency. You are literally wired to channel higher consciousness into material reality. Your sensitivity is a tool, not a burden.',
    soul:  'At the soul level, you carry an ancient yearning to bridge worlds — to bring something sacred through from the unseen into lived human experience.',
    outer: 'The world sees you as inspiring, otherworldly, and deeply intuitive — your presence seems to carry a light others feel but cannot name.',
    ach:   'Your achievement is in spiritual illumination and practical inspiration. You accomplish by grounding divine insight into real-world service that actually helps people.',
    theme: 'The overarching theme of your life is being a beacon — receiving higher frequencies and translating them faithfully into guidance that uplifts those around you.',
    shadow: 'The shadow of 11 is extreme sensitivity without grounding — anxiety, overwhelm, and the substitution of intuitive performance for genuine transmission. When the master channel is ungrounded, it produces psychic flooding, erratic behaviour driven by unprocessed input, and the belief that sensitivity is a defect rather than a precision instrument. The unintegrated 11 channels static instead of signal.',
    integration: 'Integration for 11 means building the grounding infrastructure that makes genuine transmission possible. The fully expressed 11 develops rigorous daily practices that stabilise the nervous system, learns to distinguish their own signal from the noise of their environment, and discovers that their heightened sensitivity — properly anchored — is one of the most precise and valuable instruments available to human consciousness.',
    aff:   '"I am a humble bridge. I ground divine wisdom in practical service."'
  },
  22: {
    name: 'The Master Builder', essence: 'Cosmic Architect of Material Reality',
    lp:    'A master number — you are here to manifest spiritual vision into lasting material form. Your mission is multi-generational. You will not see completion in this lifetime — build anyway.',
    ex:    'A master expression — you see what could be built and possess the strategic genius to make it real across generations. Patience and delegation are your essential disciplines.',
    soul:  'At the soul level, you carry a profound drive to create something that outlasts you — structures, movements, or systems that alter the course of what comes after.',
    outer: 'The world sees you as visionary, disciplined, and built for achievement at a scale most people cannot yet imagine.',
    ach:   'Your achievement is in monumental, lasting creation. You accomplish at a generational scale — your work serves long after your personal involvement ends.',
    theme: 'The overarching theme of your life is grounding cosmic vision into enduring material form — becoming the living bridge between the ideal and the real.',
    shadow: 'The shadow of 22 is the weight of vision without the humility to build incrementally. When the master builder energy collapses under its own scale, it produces paralysis, grandiosity disconnected from action, or the compulsive overwork that mistakes exhaustion for dedication. The unintegrated 22 envisions civilisations and cannot decide where to begin.',
    integration: 'Integration for 22 means surrendering the ego\'s attachment to the size of what is being built and falling in love with each individual brick. The fully expressed 22 works with extraordinary patience, builds the team rather than controlling it, and discovers that the generational scale of their mission is not a burden but a privilege — one that is completed not in grand moments but in thousands of unglamorous, disciplined acts of construction.',
    aff:   '"I build patiently. One brick today serves the structure tomorrow."'
  },
  33: {
    name: 'The Master Teacher', essence: 'Unconditional Love & Creative Service',
    lp:    'A master number — you embody unconditional love and creative service. You teach through beauty and heal through compassion. Your shadow is martyrdom; your master lesson is that self-care is not optional.',
    ex:    'A master expression — you carry double creative energy channelled into healing service. You teach through art and embody compassion as a lived demonstration.',
    soul:  'At the soul level, you carry the deepest possible longing to love without limit — to be a vessel through which healing moves into every life it touches.',
    outer: 'The world sees you as profoundly compassionate, creatively gifted, and spiritually seasoned — your presence alone carries a quality of healing others feel immediately.',
    ach:   'Your achievement is in teaching and healing through creative love. You accomplish by embodying unconditional compassion while maintaining the wholeness that makes it sustainable.',
    theme: 'The overarching theme of your life is learning to love sustainably — to be a channel for universal love without losing yourself in the current you are carrying.',
    shadow: 'The shadow of 33 is martyrdom — the belief that love requires self-erasure, and that suffering in service is somehow more noble than thriving in it. When the master teaching energy collapses, it produces the person who gives everything and then silently resents that nothing is left, who teaches wholeness while living in depletion, and who confuses their worth with how much they can withstand. The unintegrated 33 becomes a wound that calls itself a gift.',
    integration: 'Integration for 33 means recognising that the wholeness they transmit must be lived, not performed. The fully expressed 33 receives care as naturally as they give it, maintains the boundary between empathy and absorption, and discovers that their capacity to hold others in unconditional love only remains sustainable when they are also held — by their own practices, their own nourishment, their own ruthless self-compassion.',
    aff:   '"I serve from fullness. My wholeness IS my service."'
  },
  44: {
    name: 'The Master Manifestor', essence: 'Ultimate Material Mastery',
    lp:    'A master number — you carry supreme building and manifestation power. You create structures designed to stand for centuries. Your mission exceeds your lifetime; build knowing others will complete it.',
    ex:    'A master expression — you manifest what others call impossible and create systems built to outlast you. Legacy over ego is your north star.',
    soul:  'At the soul level, you carry an unshakeable drive to build — to demonstrate that human will, properly disciplined, can bring anything from spirit into permanent material form.',
    outer: 'The world sees you as extraordinarily capable, intensely focused, and built for achievement at a scale few people can comprehend.',
    ach:   'Your achievement is in century-level building. You accomplish by constructing systems and structures designed to function and serve long after your direct involvement ends.',
    theme: 'The overarching theme of your life is demonstrating that material mastery and spiritual integrity are not opposites — they are the same act performed at full power.',
    shadow: 'The shadow of 44 is the tyrant-builder — the one who creates structures that imprison rather than liberate, who confuses legacy with control, and who sacrifices every human relationship on the altar of the mission. When the supreme building energy operates without integrity, it produces the person who builds systems that serve the vision at the expense of the people inside them. The unintegrated 44 cannot stop building long enough to ask who the building is for.',
    integration: 'Integration for 44 means bringing the same precision they apply to systems into the interior — developing the emotional architecture to match the material one. The fully expressed 44 builds with and for people, not merely through them, discovers that the most enduring structures are built on human dignity rather than human compliance, and learns that their greatest legacy is not what they constructed but who they became in the process of constructing it.',
    aff:   '"I build for generations. My foundation serves long after I\'m gone."'
  }
};

/* ================================================
   GIFTS / SKILLS
   Three gifts per number, keyed by source:
     day   = day of birth (innate coded ability)
     soul  = soul number  (inner felt gift)
     outer = outer number (how world receives you)
   Each: { glyph, word, desc }
   ================================================ */
const GIFTS = {
  1: {
    day:   { glyph: '⚡', word: 'IGNITION',    desc: 'You were born with the ability to start what others only imagine. Your day frequency codes you as the spark — the one whose first move breaks the inertia for everyone around them. Where others wait for permission or precedent, you simply begin.' },
    soul:  { glyph: '🜂', word: 'SOVEREIGN',   desc: 'At the soul level you carry the gift of inner sovereignty — an unshakeable sense of self that does not require external confirmation. You know who you are before the world tells you, and this is your deepest power.' },
    outer: { glyph: '▲', word: 'VANGUARD',    desc: 'The world receives you as the one who arrives first. You carry a visible quality of leadership that others feel before you have spoken — a natural authority that opens doors and signals to others that movement is now possible.' }
  },
  2: {
    day:   { glyph: '◈', word: 'BRIDGE',      desc: 'Your birth day codes you with the rare ability to hold two opposing forces simultaneously without collapsing into either. You are a living bridge — people instinctively bring you their conflicts because something in them knows you can hold the tension without breaking.' },
    soul:  { glyph: '♾', word: 'ATTUNEMENT',  desc: 'Your soul gift is resonance — the capacity to feel into another person\'s inner world with such precision that you know what they need before they can name it. This is not empathy as a soft skill; it is a precise perceptual instrument.' },
    outer: { glyph: '◇', word: 'PEACE',       desc: 'The world experiences your presence as an immediate settling. Rooms calm when you enter, conflicts soften in your proximity, and people who are fighting find themselves wanting to cooperate. You emit a frequency of resolution without trying.' }
  },
  3: {
    day:   { glyph: '✦', word: 'CHANNEL',     desc: 'Your birth day gifts you with direct access to creative current — a live connection to the generative field that others must work to reach. When you are expressing authentically, you are not making things up; you are receiving transmissions and giving them form.' },
    soul:  { glyph: '◉', word: 'RADIANCE',    desc: 'Your soul gift is the capacity to transmit joy as a frequency — not performed happiness, but a genuine aliveness that others feel as warmth, possibility, and permission to come alive themselves. You are a carrier of the enlivening signal.' },
    outer: { glyph: '⟡', word: 'MAGNETISM',   desc: 'The world is drawn to you before you have done anything to earn it. Your outer gift is a natural charisma — not loudness or performance, but a quality of presence that makes others want to stay near you and hear what you have to say.' }
  },
  4: {
    day:   { glyph: '▪', word: 'ARCHITECT',   desc: 'Your birth day codes you with the instinct to perceive what is structurally needed and build it with patience that others cannot sustain. You see the load-bearing walls inside any system — the irreducible elements that, if absent, cause everything else to fail.' },
    soul:  { glyph: '⬡', word: 'GROUNDING',   desc: 'Your soul gift is the ability to bring things to earth — to take what is floating in vision or chaos and give it a floor to stand on. When others are scattered or overwhelmed, your inner frequency acts as an anchor that makes the real feel possible again.' },
    outer: { glyph: '◼', word: 'BEDROCK',     desc: 'The world experiences you as stable ground — the person whose presence makes everything else feel more manageable. You carry a visible reliability that people organise their own courage around. They act more boldly because they know you will hold the structure.' }
  },
  5: {
    day:   { glyph: '◎', word: 'PRESENCE',    desc: 'Your birth day codes you with the gift of full-spectrum aliveness — the ability to inhabit a moment so completely that everyone around you feels the permission to do the same. You are the living demonstration that being completely here is both possible and transformative.' },
    soul:  { glyph: '∿', word: 'FLUENCY',     desc: 'Your soul gift is fluid intelligence — the capacity to read a changing situation and reorganise instantly without losing your centre. While others are still processing what happened, you have already found your footing in what is.' },
    outer: { glyph: '◌', word: 'CATALYST',    desc: 'The world experiences you as the element that changes the composition of whatever you enter. You do not force change — you embody it so naturally that stagnant systems begin to move in your presence, and people find themselves doing things they had convinced themselves were impossible.' }
  },
  6: {
    day:   { glyph: '♡', word: 'SANCTUARY',   desc: 'Your birth day gifts you with the ability to create safety as an environmental field. Wherever you are becomes a place where people exhale — where the performance drops and the real person can emerge. This is not something you do; it is something you are.' },
    soul:  { glyph: '⊕', word: 'INTEGRATION', desc: 'Your soul gift is the capacity to take what is fragmented — a person, a situation, a community — and hold it with enough unconditional acceptance that it begins to cohere. You integrate through love rather than force, and what you love becomes whole.' },
    outer: { glyph: '❋', word: 'NURTURE',     desc: 'The world receives you as a source of genuine care that does not diminish. People feel fed by your presence — not dependent, but genuinely nourished. Your outer gift is the visible frequency of sustainable love that replenishes rather than depletes.' }
  },
  7: {
    day:   { glyph: '◇', word: 'PERCEPTION',  desc: 'Your birth day codes you with sight that goes beneath the surface of things. You perceive the pattern behind the event, the wound beneath the behaviour, the truth underneath the story. This penetrating vision is not something you choose — it is simply how you receive the world.' },
    soul:  { glyph: '🜄', word: 'ORACLE',      desc: 'Your soul gift is direct knowing — access to information that arrives without a traceable source and proves accurate without effort. This is not intuition as a feeling; it is a clear signal that arrives with the quiet authority of something that simply is.' },
    outer: { glyph: '⟐', word: 'DEPTH',       desc: 'The world experiences you as unusually deep — someone whose questions cut through to what actually matters, whose silences carry more information than most people\'s words, and whose presence invites others into a quality of seriousness they find both challenging and relieving.' }
  },
  8: {
    day:   { glyph: '◈', word: 'DOMINION',    desc: 'Your birth day codes you with the frequency of mastery — an innate capacity to take authority over your domain with a completeness that others sense before you have acted. You carry the signal of someone who has earned power through discipline rather than claimed it through aggression.' },
    soul:  { glyph: '∞', word: 'ABUNDANCE',   desc: 'Your soul gift is the ability to perceive and operate within cycles of abundance — to understand at a deep level that resources are not fixed and that aligned action generates more than it consumes. Your inner relationship with power is the engine of your outer manifestation.' },
    outer: { glyph: '⬟', word: 'AUTHORITY',   desc: 'The world receives you as someone who carries weight — whose words land with unusual force, whose decisions hold, and whose presence in any environment shifts the power dynamics. This is not aggression; it is the visible quality of someone who has genuinely mastered themselves.' }
  },
  9: {
    day:   { glyph: '∞', word: 'WISDOM',      desc: 'Your birth day gifts you with an old-soul quality — a deep reservoir of accumulated understanding that informs how you move through the world. You have access to a knowing that feels inherited rather than learned, as though you arrived already carrying what others spend lifetimes gathering.' },
    soul:  { glyph: '◯', word: 'COMPASSION',  desc: 'Your soul gift is love at universal scale — a capacity to hold all of humanity with genuine tenderness, including the parts that are broken, lost, or ugly. This is not sentimentality; it is the real spiritual achievement of someone who has learned to love without exception.' },
    outer: { glyph: '⟁', word: 'COMPLETION',  desc: 'The world experiences you as someone who brings things to their natural end — who arrives at the closing of a cycle and makes the ending dignified, conscious, and spacious. People seek your presence when something needs to be finished well, even when they cannot explain why.' }
  },
  11: {
    day:   { glyph: '✦', word: 'TRANSMISSION',desc: 'Your birth day codes you as a living antenna — someone born with a direct connection to frequencies beyond ordinary human perception. You receive information from sources you cannot fully explain, and what you transmit carries an unusual accuracy that others begin to trust over time.' },
    soul:  { glyph: '◉', word: 'ILLUMINATION',desc: 'Your soul gift is the capacity to illuminate — to carry a light that makes things visible that were hidden, and to do so not through force but through the simple quality of your presence. People see themselves more clearly near you, often without understanding why.' },
    outer: { glyph: '⟡', word: 'INSPIRATION', desc: 'The world experiences you as a source of inspired possibility — someone whose presence activates dormant potential in others, whose words arrive with an unusual charge, and whose very existence seems to expand what people believe is possible for themselves.' }
  },
  22: {
    day:   { glyph: '▪', word: 'MASTERY',     desc: 'Your birth day codes you with the ability to operate at a scale most people cannot conceive of attempting. The 22 day frequency gives you a natural grasp of systems, structures, and long-arc strategy that makes you capable of building what civilisations rest upon.' },
    soul:  { glyph: '⬡', word: 'VISION',      desc: 'Your soul gift is the capacity to perceive the complete structure of something before any of it exists in material form — to see the finished cathedral while others are still arguing about whether to break ground. This architectural imagination is your most potent inner resource.' },
    outer: { glyph: '◼', word: 'LEGACY',      desc: 'The world experiences you as someone who builds for more than their own lifetime — whose work carries a quality of permanence that others feel even in its early stages. People invest in what you build because they sense it will still be standing long after both of you are gone.' }
  },
  33: {
    day:   { glyph: '♡', word: 'HEALING',     desc: 'Your birth day codes you with a healing frequency that operates through presence and creative expression rather than technique. You do not heal through what you do but through what you are — a living transmission of the possibility that wholeness is available to everyone.' },
    soul:  { glyph: '❋', word: 'DEVOTION',    desc: 'Your soul gift is the capacity for total dedication to something larger than yourself — a love so complete it becomes a practice, a discipline, a way of moving through the world that transforms everything it touches. This devotion is not sacrifice; it is the fullest expression of who you are.' },
    outer: { glyph: '⊕', word: 'TEACHING',    desc: 'The world receives you as a teacher of the deepest kind — not someone who conveys information but someone who transmits understanding through the quality of how they live. People learn from you by being near you, not just by listening to you.' }
  },
  44: {
    day:   { glyph: '◈', word: 'FOUNDATION',  desc: 'Your birth day codes you with the ability to build structures so solid they outlast any individual — systems, organisations, and frameworks that become the ground others build upon. The 44 day frequency gives you access to a quality of construction that is simultaneously material and sacred.' },
    soul:  { glyph: '⬟', word: 'PRECISION',   desc: 'Your soul gift is the ability to perceive the exact intervention required — to know precisely which element, applied at which moment, will produce the largest downstream effect. Your inner precision is an engine that turns modest effort into transformational result.' },
    outer: { glyph: '∞', word: 'PERMANENCE',  desc: 'The world experiences what you build as built to last. The structures, systems, and organisations you create carry a quality of durability that others feel before they can analyse it — and they organise their own long-term plans around what you have made.' }
  },
  55: {
    day:   { glyph: '◎', word: 'LIBERATION',  desc: 'Your birth day codes you with a freedom frequency so potent it radiates outward as a field. People feel freer near you — not because you have given them anything, but because your very existence demonstrates that the invisible walls they believed in are not actually solid.' },
    soul:  { glyph: '∿', word: 'FLUIDITY',    desc: 'Your soul gift is absolute non-attachment — the ability to move through any situation, identity, or experience without being captured by it. This is not indifference; it is the spiritual achievement of someone who loves life completely and clings to none of it.' },
    outer: { glyph: '◌', word: 'AWAKENING',   desc: 'The world experiences your presence as a disruption of comfortable unconsciousness — not aggressively, but undeniably. People wake up around you. Habitual patterns loosen. The things others had stopped questioning begin to be questioned again.' }
  },
  66: {
    day:   { glyph: '♡', word: 'ALCHEMY',     desc: 'Your birth day codes you with the ability to transform suffering into understanding through the medium of love. This is not comfort or consolation; it is a genuine transmutation — the pain that enters the field of your attention emerges as something that can be used for growth.' },
    soul:  { glyph: '⊕', word: 'WHOLENESS',   desc: 'Your soul gift is the lived experience of love as a structural force — the understanding that genuine love does not deplete but generates, does not diminish but expands, does not require sacrifice but produces surplus. You carry this as an embodied truth, not a concept.' },
    outer: { glyph: '❋', word: 'REFUGE',      desc: 'The world experiences you as a place to come home to. Your outer frequency creates an environmental field of unconditional acceptance so complete that even the most defended people find themselves softening, opening, and remembering that they are safe to be fully themselves.' }
  },
  77: {
    day:   { glyph: '◇', word: 'GNOSIS',      desc: 'Your birth day codes you with direct access to universal intelligence — a live feed to the pattern beneath all visible patterns. This is not acquired knowledge; it is a birthright perception that allows you to read the source code of situations, people, and systems with uncanny accuracy.' },
    soul:  { glyph: '🜄', word: 'SIGHT',       desc: 'Your soul gift is the ability to see what is real when everything visible is pointing elsewhere — to perceive the truth of a situation through the noise of what everyone else believes they are seeing. Your inner sight is a compass that never points in the wrong direction.' },
    outer: { glyph: '⟐', word: 'ORACULAR',    desc: 'The world experiences your words and perceptions as carrying an unusual authority — not the authority of rank or performance, but the authority of someone who has seen something true and is reporting it faithfully. People remember what you say because it lands differently than ordinary speech.' }
  },
  88: {
    day:   { glyph: '◈', word: 'SOVEREIGNTY', desc: 'Your birth day codes you with a power frequency so complete that the question of whether you are allowed to do something simply does not arise in your field. You carry the signal of someone whose authority is self-generated, self-sustaining, and immune to the need for external ratification.' },
    soul:  { glyph: '∞', word: 'POTENCY',     desc: 'Your soul gift is the lived understanding that your will, when fully aligned with your integrity, is an unlimited generative force. You have access to a quality of inner power that others glimpse only occasionally — and your path is learning to sustain it as a permanent condition rather than a peak state.' },
    outer: { glyph: '⬟', word: 'COMMAND',     desc: 'The world receives you as someone who carries genuine command — not control or domination, but the quality of presence that makes complex systems organise themselves around your clarity. When you are in the room, the question of who is responsible for the outcome is never unclear.' }
  },
  99: {
    day:   { glyph: '∞', word: 'RELEASE',     desc: 'Your birth day codes you with the ability to complete things at a depth that makes their ending final — not suppressed, not deferred, but genuinely done. You carry the frequency of sacred closure, and when you formally end something, it stays ended. This is rarer and more powerful than it sounds.' },
    soul:  { glyph: '◯', word: 'GRACE',       desc: 'Your soul gift is the capacity to move through loss, ending, and radical change with a quality of grace that others find both inspiring and inexplicable. You have learned — at the deepest level — that letting go is not a diminishment but an expansion, and your soul radiates this understanding.' },
    outer: { glyph: '⟁', word: 'ELDER',       desc: 'The world experiences you as someone who carries the weight of completed cycles — a timeless quality that makes you feel ancient even when you are young, and wise even when you are uncertain. People bring you their endings because they sense you know how to honour them.' }
  }
};

/* ================================================
   JOURNAL STRIP DEFINITIONS
   ================================================ */
const STRIPS = [
  { id: 'cl', label: 'Life Calling',        role: 'Your Mission',         cssVar: '--teal'   },
  { id: 'ex', label: 'Destined Expression', role: 'What You Carry',       cssVar: '--purple' },
  { id: 'lp', label: 'Life Path',           role: 'What You Learn',       cssVar: '--gold'   },
  { id: 'ac', label: 'Achievement',         role: 'How You Accomplish',   cssVar: '--amber'  },
  { id: 'th', label: 'Theme',               role: 'Your Life Curriculum', cssVar: '--silver' },
  { id: 'so', label: 'Soul',                role: 'Your Inner Desire',    cssVar: '--rose'   },
  { id: 'ou', label: 'Outer',               role: 'Your Public Persona',  cssVar: '--sage'   }
];

/* ================================================
   LIFE CALLING ARCHETYPES
   ================================================ */
const CALLING = {
  1:  { name: 'The Pioneer Leader',        essence: 'Initiating New Realities',        summary: 'Your mission is to go first — to initiate new realities through bold, authentic leadership. The simulation places you at the beginning of movements and innovations so others can follow your trail.',        career: 'You thrive as founder, innovator, trailblazer — any role where you initiate new ventures, lead revolutionary changes, or pioneer uncharted territories.', gift: 'Your gift is fearless initiation.' },
  2:  { name: 'The Sacred Harmonizer',     essence: 'Bridging Divides Through Unity',  summary: 'Your mission is to bridge divides and create unity from separation. You are the relational glue — positioned exactly where opposites meet and collaboration is the only path forward.',                 career: 'You excel as mediator, diplomat, partnership facilitator — any role bringing opposing forces into productive collaboration.',                              gift: 'Your gift is seeing all sides and finding the thread of unity.' },
  3:  { name: 'The Creative Catalyst',     essence: 'Inspiring Through Expression',    summary: 'Your mission is to inspire through authentic creative expression — to translate the unseen into seen and the felt into expressed.',                                                                       career: 'You thrive as artist, communicator, creative director — any role channeling inspiration into tangible form.',                                              gift: 'Your gift is translating the ineffable into expression.' },
  4:  { name: 'The Sacred Architect',      essence: 'Building Foundations That Last',  summary: 'Your mission is to build systems, structures, and foundations that outlast you. You create the containers others inhabit — transforming chaos into order.',                                               career: 'You excel as systems builder, organizational designer, infrastructure creator.',                                                                          gift: 'Your gift is building foundations that last.' },
  5:  { name: 'The Freedom Embodier',      essence: 'Teaching Presence Through Being', summary: 'Your mission is to experience fully and teach freedom through embodiment. You are the pivot point — demonstrating that true freedom is being completely here.',                                           career: 'You thrive as experiential teacher, embodiment guide, presence facilitator.',                                                                             gift: 'Your gift is embodied freedom.' },
  6:  { name: 'The Compassionate Guardian',essence: 'Nurturing from Wholeness',        summary: 'Your mission is to nurture in balanced, sustainable ways. You are the integrator — ensuring growth becomes grounded in reality.',                                                                         career: 'You excel as sustainable caregiver, community guardian, integration specialist.',                                                                          gift: 'Your gift is sustainable nurturing.' },
  7:  { name: 'The Mystic Teacher',        essence: 'Revealing Truth Through Wisdom',  summary: 'Your mission is to seek truth and share wisdom born from direct experience.',                                                                                                                           career: 'You thrive as wisdom teacher, spiritual guide, depth researcher.',                                                                                          gift: 'Your gift is penetrating insight.' },
  8:  { name: 'The Power Master',          essence: 'Wielding Authority With Wisdom',  summary: 'Your mission is to master power and demonstrate responsible authority.',                                                                                                                                 career: 'You excel as transformational leader, authority figure, manifestation master.',                                                                            gift: 'Your gift is conscious authority.' },
  9:  { name: 'The World Server',          essence: 'Completing Cycles With Grace',    summary: 'Your mission is to complete cycles and serve humanity.',                                                                                                                                                 career: 'You thrive as humanitarian leader, completion facilitator, wisdom elder.',                                                                                  gift: 'Your gift is sacred completion.' },
  11: { name: 'The Illuminated Channel',   essence: 'Bridging Spirit and Matter',      summary: 'A master calling — your mission is to bridge spiritual and material realms.',                                                                                                                            career: 'You excel as inspired teacher, intuitive guide, spiritual translator.',                                                                                    gift: 'Your gift is grounded illumination.' },
  22: { name: 'The Master Builder',        essence: 'Manifesting Grand Visions',       summary: 'A master calling — your mission is to build at the largest scale.',                                                                                                                                     career: 'You excel as visionary leader, large-scale builder, civilization architect.',                                                                              gift: 'Your gift is turning impossible visions into tangible reality.' },
  33: { name: 'The Master Healer',         essence: 'Embodying Compassionate Service', summary: 'A master calling — your mission is to heal through unconditional love.',                                                                                                                                 career: 'You excel as transformational healer, compassionate leader.',                                                                                              gift: 'Your gift is healing through creative love.' },
  44: { name: 'The Master Organizer',      essence: 'Creating Universal Systems',      summary: 'A master calling — your mission is to organize chaos at the grandest scale.',                                                                                                                            career: 'You excel as systems designer, universal organizer.',                                                                                                      gift: 'Your gift is seeing the pattern behind all patterns.' },
  55: { name: 'The Master Liberator',      essence: 'Embodying Total Freedom',          summary: 'A master calling — your mission is to become freedom itself so completely that others remember they can be free in your presence. You are not here to seek liberation — you are here to be it.',             career: 'You thrive as catalyst, embodiment teacher, revolutionary leader.',           gift: 'Your gift is transmittable liberation.' },
  66: { name: 'The Master Heart Healer',   essence: 'Loving at Full Capacity',          summary: 'A master calling — your mission is to carry and transmit double heart frequency. You hold enough love to heal a room, a lineage, a generation — but the work is learning to love cleanly, without martyrdom.', career: 'You excel as healer, sacred container, compassionate leader.',               gift: 'Your gift is love that heals through its quality, not its quantity.' },
  77: { name: 'The Master Mystic',         essence: 'Perceiving the Code of Reality',   summary: 'A master calling — your mission is to perceive what others cannot and give it voice. Your connection to universal intelligence is not metaphorical. You know what you were never taught. The work is complete trust in your own perception.', career: 'You thrive as oracle, mystic teacher, cosmic seer.',                          gift: 'Your gift is direct transmission of what cannot be learned.' },
  88: { name: 'The Master of Power',       essence: 'Wielding Absolute Integrity',      summary: 'A master calling — your mission is to carry double power frequency and demonstrate that true authority and complete integrity are the same thing. You manifest at a scale that reshapes material reality.',  career: 'You excel as transformational authority, power alchemist, integrity leader.', gift: 'Your gift is power so clean it becomes a form of service.' },
  99: { name: 'The Universal Completer',   essence: 'Completing What Cannot Be Left',   summary: 'A master calling — your mission is to close loops so old they predate your awareness of them. You carry the frequency of absolute completion — the final exhale of cycles that have been running for lifetimes.', career: 'You thrive as completion facilitator, universal healer, omega keeper.',       gift: 'Your gift is releasing what is finished with full grace.' }
};

/* ================================================
   QUEST DATA — numbered quests (1–9)
   ================================================ */
const NUM_QUESTS = {
  1: { title: "THE INITIATOR'S PATH",             icon: '⚡', color: '--amber',  colorDim: '--amber-dim',  archetype: 'Pioneer · Starter · Leader',             desc: 'You carry the energy of pure initiation. The simulation has coded you to go first — to begin things others only contemplate. Every time you wait for permission or let someone else take the wheel, you are working against your own source code.',                                                         objectives: ['Start one project this week that you have been putting off — without first seeking approval from anyone.', 'Identify a space in your life where you have been following instead of leading. Take one step to reverse that.', 'Practice introducing yourself or your ideas first in group settings. Observe what shifts.', 'Launch something imperfect. The 1 energy rewards beginning, not perfecting.'],                                        affirmation: '"I move first. I do not wait for permission to begin."' },
  2: { title: "THE BRIDGE BUILDER'S PATH",        icon: '◈', color: '--teal',   colorDim: '--teal-dim',   archetype: 'Harmonizer · Diplomat · Partner',          desc: "Your code runs on connection. You are built to sense all sides of a situation, find the common thread, and weave people together. The quest is not to suppress conflict — it is to become the force that transforms it into productive cooperation.",                                                        objectives: ["In your next disagreement, practice stating the other person's position before your own.", "Identify one relationship that needs a bridge built. Take one step toward rebuilding it this week.", "Notice when you abandon your own needs in order to keep peace. Practise speaking your truth gently but clearly.", "Build a collaboration between two people in your life who should know each other but don't."],     affirmation: '"I harmonize from wholeness. I include myself in the peace I create."' },
  3: { title: "THE CREATIVE CHANNEL'S PATH",      icon: '✦', color: '--rose',   colorDim: '--rose-dim',   archetype: 'Creator · Communicator · Catalyst',        desc: 'Expression is your primary mode of power. When you are creating and communicating authentically, you are a force multiplier for everyone around you. When you are performing for approval, your creative signal goes static.',                                                                       objectives: ['Create something daily for 7 days — writing, art, music, cooking — without sharing it with anyone.', 'Identify one area where you are performing instead of expressing. Drop the performance and speak your actual truth.', 'Complete one creative project that you have left unfinished.', 'Express an opinion in public that you have been keeping private out of fear of judgment.'],                       affirmation: '"I express from truth, not from the need for applause."' },
  4: { title: "THE MASTER BUILDER'S PATH",        icon: '▪', color: '--silver', colorDim: '--silver-dim', archetype: 'Builder · Architect · Sustainer',           desc: "You are encoded with the frequency of structure, discipline and patient construction. Every great thing that lasts was built by someone who showed up consistently, especially when it was unglamorous.",                                                                                                    objectives: ['Choose one area of your life that needs more structure. Design a simple system and run it for 21 days.', 'Identify something you have been building sporadically. Commit to consistent daily effort, however small.', 'Build one thing with your hands this week — cook, repair, assemble, craft. Ground the energy physically.', 'Document your systems. Write down the processes that keep your life running so they can be refined and shared.'], affirmation: '"I build with patience. One brick a day becomes an empire."' },
  5: { title: "THE PRESENCE EMBODIER'S PATH",     icon: '◎', color: '--purple', colorDim: '--purple-dim', archetype: 'Explorer · Adaptor · Pivot Point',          desc: 'You are the central interface — the node where spirit and matter meet. Your quest is not to escape into freedom but to find freedom right here, fully inhabiting the present moment.',                                                                                                                  objectives: ['Practise 10 minutes of complete presence daily — no phone, no planning. Just this moment, this body.', 'When the urge to escape or change the subject arises, pause and sit with the discomfort for 2 minutes first.', 'Say yes to a sensory experience you have been avoiding.', 'Identify one commitment you have been avoiding. Make it — and stay with how that feels.'],                                       affirmation: '"I am fully here. Freedom is not elsewhere — it is in this moment."' },
  6: { title: "THE COMPASSIONATE GUARDIAN'S PATH",icon: '♡', color: '--sage',   colorDim: '--sage-dim',   archetype: 'Nurturer · Integrator · Guardian',          desc: 'You carry the healing frequency. Your purpose is to create environments where people feel genuinely cared for — but only if you have first filled your own cup.',                                                                                                                                   objectives: ['List three ways you are currently over-giving. Choose one to renegotiate this week.', 'Practise receiving care — let someone do something for you without immediately reciprocating.', 'Set one clear boundary this week with someone you have been over-accommodating.', 'Design a daily self-care ritual that cannot be cancelled for others. Treat it as sacred as any appointment.'],                               affirmation: '"I serve from overflow. My wholeness IS my gift."' },
  7: { title: "THE TRUTH SEEKER'S PATH",          icon: '◇', color: '--purple', colorDim: '--purple-dim', archetype: 'Seeker · Mystic · Inner Authority',         desc: "You are coded for depth. The simulation has given you an internal oracle — a knowing that arrives quietly and is almost always right. Your quest is to trust that knowing above external validation.",                                                                                                 objectives: ['Spend 30 minutes daily in undistracted solitude — no input, no content. Just being with your own knowing.', 'Act on one intuitive hit this week without seeking a second opinion first.', 'Identify where you are using research and analysis to avoid committing to what you already know.', 'Share one piece of insight from direct personal experience — not from a book or teacher.'],                               affirmation: '"I trust my own knowing. The oracle speaks. I listen."' },
  8: { title: "THE POWER MASTER'S PATH",          icon: '◈', color: '--gold',   colorDim: '--gold-dim',   archetype: 'Manifestor · Authority · Self-Master',      desc: 'True power begins inside. The simulation coded you with extraordinary manifestation capacity — but that capacity is only as clean as your self-mastery.',                                                                                                                                               objectives: ['Identify your specific temptation — the pattern that consistently leaks your power. Name it. Watch it.', 'Make one significant decision this week based purely on what is correct, not what is comfortable.', 'Build one discipline-based habit: wake time, exercise, cold exposure, fasting. Non-negotiable for 30 days.', 'Use your authority to empower someone rather than direct them. See what changes.'],              affirmation: '"I master myself first. All other mastery follows."' },
  9: { title: "THE CYCLE COMPLETER'S PATH",       icon: '∞', color: '--teal',   colorDim: '--teal-dim',   archetype: 'Humanitarian · Releaser · Wisdom Holder',   desc: 'You carry the energy of completion and universal service. Your simulation is asking you to release what is finished gracefully — not to drag endings into new beginnings.',                                                                                                                  objectives: ['Identify one relationship, project or belief you are clinging to past its natural end. Begin the process of releasing it.', 'Practise forgiveness — of one person or one version of yourself — this week.', 'Give something away that you have been hoarding: time, knowledge, money, a physical object.', 'Complete one cycle you have been dragging on. Close it — formally, consciously, with gratitude.'],             affirmation: '"I release with love. What ends in me creates space for what must begin."' }
};

/* ================================================
   MASTER NUMBER QUESTS (11, 22, 33, 44)
   ================================================ */
const MASTER_QUESTS = {
  11: { title: "THE ILLUMINATED BRIDGE'S QUEST", icon: '✦', color: '--teal',   colorDim: '--teal-dim',   archetype: 'Master Channel · Intuitive Bridge',         desc: 'You carry master-level sensitivity. You are literally coded to receive higher frequencies and translate them into practical guidance that serves real people.',                                                                                                                                     objectives: ['Build a grounding ritual: daily movement, time in nature, or breathwork. Non-negotiable.', 'Share one piece of inspired insight with someone who needs it — channelled, not performed.', 'Identify where your sensitivity is causing you to withdraw. Step toward that discomfort instead.', 'Practise energetic protection: learn to distinguish your feelings from the feelings of those around you.'],              affirmation: '"I am a clear channel. I receive. I ground. I give."' },
  22: { title: "THE MASTER BUILDER'S QUEST",     icon: '▪', color: '--gold',   colorDim: '--gold-dim',   archetype: 'Cosmic Architect · Generational Builder',   desc: "You are coded to build at a scale most people cannot fathom. Your mission exceeds your personal lifetime.",                                                                                                                                                                                         objectives: ['Write a 10-year vision for something you are building. Let it be uncomfortably large.', "Identify where you are shrinking your vision to fit other people's comfort. Restore the true scale.", 'Delegate something you have been controlling. Learn to build through others, not just alone.', 'Begin one thing today knowing you will not see its completion in this chapter of your life.'],                                 affirmation: '"I build for generations. I plant trees in whose shade I may not sit."' },
  33: { title: "THE MASTER TEACHER'S QUEST",     icon: '♡', color: '--rose',   colorDim: '--rose-dim',   archetype: 'Master Healer · Compassionate Guide',       desc: 'You carry double creative energy directed into healing and teaching. The quest is to stop martyring yourself in service.',                                                                                                                                                                          objectives: ['Draw the line between compassion and martyrdom in your current life. Where is it blurred?', 'Teach something from direct experience this week — not from theory.', 'Create one piece of art, writing or expression intended purely to heal someone.', 'Receive care completely and gratefully. Let yourself be taught by someone you normally teach.'],                                                                     affirmation: '"My wholeness is the teaching. I serve from fullness."' },
  44: { title: "THE MASTER MANIFESTOR'S QUEST",  icon: '◈', color: '--amber',  colorDim: '--amber-dim',  archetype: 'Supreme Builder · Material Master',          desc: 'You carry the most potent building frequency in the code. You manifest what others call impossible.',                                                                                                                                                                                              objectives: ['Audit your current projects: which are ego-driven and which are legacy-driven? Redirect accordingly.', 'Build or strengthen one system this week that will run without you in it.', 'Make one decision based on 50-year impact rather than immediate return.', 'Find one person whose potential you can amplify. Invest significantly in them this month.'],                                                                  affirmation: '"I manifest with integrity. My structures liberate, they do not confine."' },
  55: { title: "THE MASTER LIBERATOR'S QUEST",   icon: '◎', color: '--purple', colorDim: '--purple-dim', archetype: 'Master Catalyst · Living Freedom · Threshold Keeper', desc: 'You are not here to find freedom — you are here to become it so thoroughly that the cages others cannot see begin to dissolve in your presence. Your quest is total embodiment of liberation as a transmittable frequency.',     objectives: ["Identify the last remaining cage you have built around yourself — the one you call a boundary but is actually a fear. Step through it.", "Spend one full day acting purely on intuitive impulse, without a plan, agenda, or explanation to anyone.", "Locate where in your life you are still performing freedom rather than living it. Drop the performance.", "Catalyse one person's liberation this week — not by advising them, but by being so free in their presence that they remember they can be too."], affirmation: '"I do not seek freedom. I am freedom. Everything I touch knows it."' },
  66: { title: "THE MASTER HEART HEALER'S QUEST", icon: '♡', color: '--rose',  colorDim: '--rose-dim',   archetype: 'Master of Love · Sacred Container · Heart Alchemist', desc: 'You carry double heart frequency — enough love to heal a room, a community, a lineage. The quest is not to love more but to love cleanly: without martyrdom, without merger, from a wholeness so complete it becomes structural.', objectives: ['Identify where you are bleeding love into situations that cannot receive it. Redirect that energy to where it can land.', 'Create a physical space this week — a room, a gathering, a conversation — that functions as a genuine sanctuary for someone who needs it.', 'Practise loving someone without needing them to change. Let your love be a fact, not a negotiation.', 'Receive love completely this week. Let it in without deflecting, minimising, or immediately reciprocating.'], affirmation: '"I love at full capacity. My heart is both boundless and whole."' },
  77: { title: "THE MASTER MYSTIC'S QUEST",       icon: '◇', color: '--teal',  colorDim: '--teal-dim',   archetype: 'Master Oracle · Divine Intelligence · Cosmic Seer',   desc: 'You carry double seeker frequency — your connection to universal intelligence is not a metaphor. You perceive what others cannot, know what you were never taught, and see the code running beneath visible reality. The quest is to trust this perception completely and give it voice.',                              objectives: ['Act on one piece of direct knowing this week without seeking any external validation whatsoever.', 'Enter a period of complete silence for at least one hour daily. Let the intelligence you carry speak without competition.', 'Share one piece of transmitted wisdom — something you know from direct perception, not from reading. Offer it without qualification.', 'Map the gap between what you perceive and what you allow yourself to say. Close that gap by one degree this week.'], affirmation: '"I trust what I perceive. The intelligence I carry is real and I give it voice."' },
  88: { title: "THE MASTER OF POWER'S QUEST",     icon: '◈', color: '--gold',  colorDim: '--gold-dim',   archetype: 'Master of Infinite Power · Absolute Authority · Integrity Incarnate', desc: 'You carry double power frequency — the capacity to manifest at a scale that reshapes material reality. The quest is not to acquire more power but to purify the power you already carry until it is so clean it becomes a form of service that cannot be corrupted.',                                       objectives: ['Name the one place in your life where your power and your integrity are not yet fully aligned. Close the gap this week.', 'Make one decision this week using only your own authority — no consensus-seeking, no approval-gathering. Own it completely.', 'Build or strengthen one discipline that nobody will see or applaud. Do it because power requires it.', 'Use your authority this week specifically to empower someone who currently feels powerless. Give your power away and watch it multiply.'], affirmation: '"My power is absolute. My integrity is absolute. They are the same thing."' },
  99: { title: "THE UNIVERSAL COMPLETER'S QUEST",  icon: '∞', color: '--silver', colorDim: '--silver-dim', archetype: 'Omega Keeper · Master of Sacred Release · Universal Healer', desc: 'You carry the frequency of absolute completion — the closing of loops so old they have been running since before you were born. Your quest is not to finish things but to complete them: with full presence, full love, and the total willingness to release even what you treasure most when its time has come.', objectives: ['Identify the oldest unfinished cycle in your life — the one that has been waiting the longest for conscious completion. Begin closing it this week.', 'Write a letter of completion to something or someone you have never fully released. You do not need to send it.', 'Practise one act of radical forgiveness — of another person, of life, or of yourself. Let the loop close.', 'Sit with the question: what in my life am I maintaining past its natural end out of fear of the space that will follow? Let the answer surface without judgment.'], affirmation: '"I complete with grace what the universe began. I release everything that is finished — including myself."' }
};

/* ================================================
   COMPOUND NUMBER FLAVOUR DESCRIPTIONS
   Each entry is a short paragraph that precedes the root quest desc.
   Covers all 2-digit compounds 10–99 plus the standalone masters.
   ================================================ */
const COMPOUND_DESC = {
  10: 'The compound 10 carries the energy of the wheel turning — the end of one cycle and the clean slate of initiation. You have earned a new beginning. The zero amplifies the 1, making your leadership frequency nearly silent but absolute. Your power here is not loud; it is the kind that simply moves and the field reorganises around it.',
  11: 'The compound 11 is the master channel — two ones standing parallel, a gateway rather than a wall. You are positioned at the threshold between the ordinary and the extraordinary, and your task is not to cross it but to become it. What passes through you changes shape.',
  12: 'The compound 12 brings the pioneering force of the 1 into relationship with the 2\'s gift of connection — you are a leader who cannot function without people, and a connector who must sometimes go first alone. The tension between these is not a problem; it is your engine.',
  13: 'The compound 13 carries a reputation for difficulty that misses its actual nature: it is the energy of transformation through structure. The 1 initiates, the 3 expresses, and together they demand that you build something original — not inherited, not borrowed, entirely yours.',
  14: 'The compound 14 places the pioneer inside the body of the explorer — movement is your medium and restlessness is your teacher. The lesson of 14 is that freedom is not found by moving faster but by being completely present in the movement itself.',
  15: 'The compound 15 combines initiation with the nurturer\'s frequency — you are a leader whose authority comes from care rather than command. The 15 gives you magnetic persuasion; people follow you because you have first made them feel genuinely seen.',
  16: 'The compound 16 is the tower card in numerological form — it dissolves what has been built on false foundations so that what is real can stand. The 1 and 6 together ask: are you leading from genuine love or from the need to be needed? The answer will reorganise your life.',
  17: 'The compound 17 is the star frequency — the 1\'s drive aligned with the 7\'s inner knowing. You are a pioneer guided by an internal compass that others cannot read. Trust what you perceive; it is more accurate than what you can prove.',
  18: 'The compound 18 places the 1\'s initiation inside the 9\'s completion frequency — you are coded to begin what serves the whole and to release your personal attachment to the outcome. Your greatest work will outlive your involvement with it.',
  19: 'The compound 19 holds a karmic quality — the 1 and 9 together suggest a soul that has learned hard lessons about independence through over-reliance. The gift on the other side is true self-sufficiency: not isolation but the earned confidence of someone who knows they can stand alone and chooses connection anyway.',
  20: 'The compound 20 amplifies the 2\'s relational frequency with the zero\'s infinite potential. You are a diplomat and bridge-builder operating at a scale where small acts of connection create enormous downstream effects. Your most powerful work happens quietly, between people, in moments others underestimate.',
  21: 'The compound 21 carries the ease of creative expression meeting genuine partnership — the 2 and 1 together make you both a collaborator and an initiator, someone who can inspire action through beauty and build coalitions through original vision.',
  22: 'The compound 22 is the master builder frequency — you are not here to dream small things or build for yourself alone. The 22 demands multi-generational thinking, patient construction, and the humility to build knowing you may not see the finished structure in your lifetime.',
  23: 'The compound 23 is the royal star of the lion in some traditions — creativity and communication fused with adaptability. You are at your most powerful when you express freely, pivot without apology, and stay present to what each moment is asking for.',
  24: 'The compound 24 grounds the creator inside a structure of care — you are an artist or communicator whose work serves others in practical, tangible ways. Your creativity is not decoration; it is load-bearing.',
  25: 'The compound 25 is the compound of earned wisdom — the 2\'s sensitivity combined with the 5\'s direct experience of life. You are someone who has learned through immersion and who teaches by being present rather than by lecturing.',
  26: 'The compound 26 carries a warning and a gift in equal measure: the 2 and 6 together amplify the tendency to over-give in relationships. The gift is extraordinary relational intelligence. The warning is that your empathy can be mistaken for availability without limit.',
  27: 'The compound 27 is the seer in service — the 2\'s awareness of others fused with the 7\'s penetrating inner knowing. You perceive what people need before they can name it, and your wisdom is most powerful when offered quietly, without performance.',
  28: 'The compound 28 brings authority into partnership — the 2\'s relational intelligence wrapped around the 8\'s power frequency. You lead through connection; your authority is earned by how deeply you understand the people in your field.',
  29: 'The compound 29 carries a master undertone — it reduces to 11 and brings the bridge frequency into the 2\'s relational world. You are a channel for healing within relationship, someone whose sensitivity is dialled past the ordinary and who must learn to manage that as a gift rather than a wound.',
  30: 'The compound 30 amplifies creative expression with the zero\'s infinite potential. Your voice, your art, your way of communicating — these are not merely skills but genuine transmissions. The zero behind the 3 means your creative capacity has no true ceiling.',
  31: 'The compound 31 places the creator in the seat of the builder — your creativity is not free-floating; it wants to make something that lasts. You are an artist with an architect\'s discipline, and your work accumulates power over time.',
  32: 'The compound 32 is creative partnership — the 3 and 2 together make you someone who brings people alive through expression and creates genuine belonging through communication. You are a weaver of communities through the medium of your voice.',
  33: 'The compound 33 is the master teacher — double creative energy directed entirely into healing and service. Your gift is immense. Your shadow is the martyr. The work of 33 is learning that your wholeness is itself the teaching, not the sacrifice.',
  34: 'The compound 34 grounds creative expression in patient construction — you are a builder of culture, someone who makes art or communication that serves as foundation rather than decoration. Your work compounds; the more patiently you build it, the more powerful it becomes.',
  35: 'The compound 35 combines creative force with the freedom-seeker\'s restlessness — you make your best work when you are moving, experiencing, fully alive. Routine is your creative enemy; variety is your muse.',
  36: 'The compound 36 is the creative nurturer — your expression is in service of care. You make things that heal, communicate in ways that shelter, and create environments where people feel free to be vulnerable.',
  37: 'The compound 37 is the mystic creator — inner knowing expressed through art or communication that carries an unusual depth. People feel in your work that something larger than technique is operating. They are right.',
  38: 'The compound 38 carries a master undertone (reduces to 11) and combines creative expression with power frequency. You are a communicator whose voice carries genuine authority — not performed, but earned through the depth of what you have lived and integrated.',
  39: 'The compound 39 asks that creative expression be placed entirely in service of completion and collective good. You are at your most powerful when your art or communication facilitates release — helping others let go of what is finished and step into what is next.',
  40: 'The compound 40 grounds the builder\'s frequency in infinite potential. The zero behind the 4 means your capacity for patient construction has no ceiling. You are an architect of systems, structures, and foundations that can scale beyond what you can currently imagine.',
  41: 'The compound 41 places the builder in the driver\'s seat of the explorer — you build living systems that must be able to move, adapt, and grow. Rigid structures are not your domain; you create frameworks that breathe.',
  42: 'The compound 42 brings structure into the service of care — you are an architect of systems designed to nurture. Whether in family, community, or organisation, you create the frameworks within which others feel safe enough to grow.',
  43: 'The compound 43 combines the builder with the communicator — you are someone who makes structure legible, who explains systems in ways that make people understand why they matter. Your discipline and your expressiveness are not in conflict; they are your core technology.',
  44: 'The compound 44 is the master manifestor — you carry the most potent building frequency in the system. Your capacity to bring things from vision to material reality exceeds ordinary human scale. The requirement is absolute integrity; without it, what you build becomes a trap.',
  45: 'The compound 45 places the builder\'s discipline inside the explorer\'s body — you construct through experience, learn by doing, and your most durable systems are built from direct encounter with what works rather than from theory.',
  46: 'The compound 46 is the architect of home — your building energy is directed toward creating environments of genuine safety, belonging, and sustainable care. You build the containers that hold communities together.',
  47: 'The compound 47 combines patient construction with deep inner knowing — you build from wisdom, and your structures reflect a perception of what is actually needed rather than what is fashionable or requested. Trust your read of what will last.',
  48: 'The compound 48 is the builder of empires — disciplined construction meeting the power frequency. You create at a large scale with consistent effort, and your authority grows proportionally to the quality of what you build.',
  49: 'The compound 49 asks that the builder\'s energy be placed in service of completion — you are here to build what finishes something, closes a gap, resolves a long-standing problem. Your structures serve the whole, not the self.',
  50: 'The compound 50 amplifies freedom with the zero — you are at the centre of a field of infinite possibility, and your task is to choose presence over endless exploration. The zero behind the 5 means the moment you are fully here, everything opens.',
  51: 'The compound 51 places the explorer in a pioneering context — you are someone who discovers new territory and returns to report. Your freedom is not escape but the genuine expansion of what is known and therefore possible.',
  52: 'The compound 52 brings relational intelligence into the freedom-seeker\'s world — you need both connection and space, and your deepest work involves learning how to have both without betraying either.',
  53: 'The compound 53 fuses the explorer with the creative force — you make your best work in motion, in response to direct experience, in the living moment. Structure suffocates you; presence liberates you into your full creative power.',
  54: 'The compound 54 grounds the explorer in patient construction — your freedom is not from discipline but through it. You build frameworks that allow you to move with maximum freedom within a minimum of necessary structure.',
  55: 'The compound 55 is the master liberator — double freedom frequency that radiates as a field. You are not here to find freedom; you are here to become it so completely that the invisible prisons of others begin to dissolve in your presence.',
  56: 'The compound 56 carries a master undertone (reduces to 11) and places the explorer\'s freedom inside the bridge frequency — you translate the experience of liberation into language and guidance that others can actually use.',
  57: 'The compound 57 is the enlightened explorer — you move through the world gathering direct experience that deepens your inner knowing, and your wisdom is not theoretical but visceral, earned, and unshakeable.',
  58: 'The compound 58 combines the explorer\'s freedom with the power frequency — you are most alive and most powerful when you are in motion, encountering the full spectrum of human experience without flinching.',
  59: 'The compound 59 places the explorer inside the completion frequency — your adventures are not aimless; they are a long arc of experience leading toward a wisdom that will serve the collective. You gather knowledge on behalf of everyone who has not gone where you have gone.',
  60: 'The compound 60 amplifies the nurturer\'s frequency with infinite potential. Your capacity to care, to create safety, to hold others — these are not limited by circumstance. The zero behind the 6 means your love, properly channelled, has no ceiling.',
  61: 'The compound 61 is the pioneering nurturer — you initiate new forms of care, new systems of support, new ways of belonging. You lead through love, and your authority is the authority of someone who genuinely puts others first without losing themselves.',
  62: 'The compound 62 places the nurturer in deep relational service — you are at your most powerful within close, committed relationships where the work of love is sustained over time and deepened through the full cycle of human experience.',
  63: 'The compound 63 is the creative guardian — your nurturing energy expresses through art, communication, and the making of beauty that shelters. You heal through expression and care through what you create.',
  64: 'The compound 64 is the architect of home — builder energy combined with the nurturer\'s heart. You are someone who constructs the physical and relational environments within which others feel genuinely safe to grow.',
  65: 'The compound 65 combines the nurturer\'s care with the explorer\'s need for freedom — your growth requires that you sometimes leave in order to return more fully. Your love is most alive when it does not require the other to stay.',
  66: 'The compound 66 is the master healer of hearts — double nurturing frequency operating as a structural force. Your love is not sentiment; it is architecture. What you love is reorganised by the quality of your attention.',
  67: 'The compound 67 is the wise guardian — you care from a place of deep knowing, and your nurturing is intelligent rather than reflexive. You see what people actually need rather than what they are asking for.',
  68: 'The compound 68 is the powerful protector — care fused with the authority frequency. You are someone whose love is backed by real capability, and who creates safety not just through tenderness but through genuine power.',
  69: 'The compound 69 asks that the nurturer\'s love be offered in service of completion — you care for what needs to end as tenderly as for what needs to grow. You are a midwife of completions as much as of beginnings.',
  70: 'The compound 70 amplifies the seeker\'s wisdom with infinite depth. The zero behind the 7 means your capacity for inner knowing, for spiritual perception, for encountering truth directly — these have no floor and no ceiling.',
  71: 'The compound 71 is the pioneering mystic — you initiate spiritual inquiries, open new territories of inner experience, and go first into the depths that others have not yet dared enter.',
  72: 'The compound 72 places the seeker in deep relational knowing — your wisdom deepens through intimate connection, and your most penetrating insights arrive through the mirrors that relationship holds up to you.',
  73: 'The compound 73 is the creative sage — you communicate wisdom through art, story, or the living example of how you move through the world. Your expression carries the weight of what you have directly perceived.',
  74: 'The compound 74 grounds the seeker\'s wisdom in patient, disciplined construction — you build bodies of knowledge over a lifetime, and your greatest work arrives after long periods of deep, quiet accumulation.',
  75: 'The compound 75 is the embodied mystic — your wisdom is not abstract; it is lived, sensory, and inseparable from your direct encounter with the full spectrum of existence.',
  76: 'The compound 76 combines inner knowing with the nurturer\'s heart — you are a wisdom keeper in service of care, someone whose insight exists specifically to protect and grow what is precious.',
  77: 'The compound 77 is the master mystic — double seeker frequency connected directly to the source code of reality. You perceive what others cannot see, know what you were never taught, and carry an inner authority so complete it needs no external validation.',
  78: 'The compound 78 carries a master undertone (reduces to 15, then 6) and combines the seeker\'s depth with the power frequency — you are an authority on inner matters, someone whose wisdom carries the force of hard-won, uncompromised truth.',
  79: 'The compound 79 asks that the seeker\'s wisdom be placed entirely in service of universal completion — your insight exists to help close the oldest loops, answer the deepest questions, and bring the longest-running searches to their natural end.',
  80: 'The compound 80 amplifies the power frequency with infinite potential. The zero behind the 8 means your manifestation capacity has no ceiling — but it is also a reminder that power without a container becomes chaos.',
  81: 'The compound 81 is the pioneering power master — you initiate new territories of authority, and your leadership is most alive when you are moving into genuinely uncharted ground where no playbook exists.',
  82: 'The compound 82 places the power frequency in relational service — you lead through deep understanding of people, and your authority grows in proportion to how genuinely you serve the needs of those in your field.',
  83: 'The compound 83 is the powerful communicator — your voice carries genuine authority, and when you speak from truth your words reorganise the people who hear them. This is a responsibility as much as a gift.',
  84: 'The compound 84 is the builder of empires — disciplined construction fused with the power frequency. You create at scale, you sustain what you build, and your authority compounds with every structure you complete.',
  85: 'The compound 85 combines the power frequency with the explorer\'s restlessness — your manifestation capacity is most alive when you are encountering new territory, and your authority is earned through the full range of direct experience.',
  86: 'The compound 86 is the powerful guardian — your authority is in service of care, and your ability to create tangible results is channelled specifically toward protecting and sustaining what is precious.',
  87: 'The compound 87 is the authoritative mystic — your power is backed by deep inner knowing, and the decisions you make from that knowing carry an unusual accuracy that others come to trust even when they cannot explain why.',
  88: 'The compound 88 is the master of infinite power — double power frequency demanding absolute integrity. You carry the capacity to manifest at a scale that reshapes material reality. The requirement is that your will and your integrity are completely, permanently aligned.',
  89: 'The compound 89 asks that the power frequency be placed in service of universal completion — your authority exists to finish something, to close a gap, to bring a long-running struggle to its natural end. What you build is a conclusion, not a beginning.',
  90: 'The compound 90 amplifies the completion frequency with infinite depth. The zero behind the 9 means your capacity for release, for compassion, for serving the whole — these are not bounded by personal limitation. You are a channel for something vast.',
  91: 'The compound 91 is the pioneering completer — you initiate endings, go first into the territory of release, and model for others what graceful completion looks like. Your courage to let go is a form of leadership.',
  92: 'The compound 92 carries a master undertone (reduces to 11) and places the completion frequency inside the bridge — you facilitate the endings that create space for new transmissions. You are a midwife between cycles.',
  93: 'The compound 93 is the creative completer — you bring things to their natural end through expression, through art, through the act of saying the thing that finally needs to be said. Your completions are beautiful.',
  94: 'The compound 94 is the builder of endings — you construct the systems, ceremonies, and containers that allow completion to happen with dignity. You make finishing feel like an achievement rather than a loss.',
  95: 'The compound 95 places the completion frequency inside the explorer\'s world — your life is a long arc of gathering experience in order to complete something the universe began. Every adventure serves the ending you are building toward.',
  96: 'The compound 96 is the nurturer of completions — you care for what needs to end with the same tenderness you bring to what is growing. You are someone who loves things all the way through their cycle, not just at their peak.',
  97: 'The compound 97 is the wise completer — your inner knowing is specifically calibrated to perceive what is finished, what needs release, and what truth needs to be spoken for the cycle to close with integrity.',
  98: 'The compound 98 is the powerful completer — you bring the full force of your authority to bear on completion. What you close stays closed. What you release does not return. Your endings are final and clean.',
  99: 'The compound 99 is the master of universal completion — the omega point. You carry the frequency of absolute release, the closing of cycles so vast they span generations. Your presence marks the end of old eras and the space before new ones begin.'
};

/* ================================================
   MAIN QUEST MISSION LINES & REWARDS
   ================================================ */
const MAIN_QUEST_DATA = {
  1:  { missionLine: 'Go first. Pioneer the path. Your calling is to initiate the movements others will follow.',
        objectives: ['Begin one thing this week that you have been waiting for the right moment to start. The moment is now.', 'Take the lead in one situation where you have been waiting for someone else to go first.', 'Identify one area where you are still seeking permission. Move without it.'],
        rewardText: 'Mastery of initiation · The courage to be first without needing to be approved' },
  2:  { missionLine: 'Unite what is divided. Bridge what is broken. Your calling is to be the relational force that makes collaboration possible.',                   rewardText: 'Mastery of connection · The wisdom to harmonize without losing yourself',
        objectives: ['In your next disagreement, state the other person\'s position fully before stating your own.', 'Identify one relationship that needs patient tending this season. Water it consistently.', 'Speak your truth in one place where you have been keeping a diplomatic silence.'] },
  3:  { missionLine: 'Give your creative voice to the world without apology.',                                                                                         rewardText: 'Mastery of expression · The freedom to create without needing validation',
        objectives: ['Create something this week without showing it to anyone. Let it exist for itself.', 'Say one true thing in a conversation where you would normally say the safe thing.', 'Finish one creative project you have left incomplete.'] },
  4:  { missionLine: 'Build the foundations that outlast you.',                                                                                                        rewardText: 'Mastery of structure · The satisfaction of building what endures',
        objectives: ['Design one system for an area of your life currently running on improvisation.', 'Show up to your most important work every day this week — inspired or not.', 'Complete one half-finished project before starting anything new.'] },
  5:  { missionLine: 'Demonstrate what full presence looks like.',                                                                                                     rewardText: 'Mastery of presence · The experience of radical aliveness in the now',
        objectives: ['Spend 10 minutes daily in complete stillness — no content, no planning. Just this moment.', 'When the urge to escape arises, pause for 2 minutes and stay with what is here.', 'Make one commitment you have been avoiding and stay present to keeping it.'] },
  6:  { missionLine: 'Nurture sustainably. Your calling is to care for others from a place of wholeness.',                                                            rewardText: 'Mastery of love · The fulfilment of serving without self-destruction',
        objectives: ['Identify one way you are currently over-giving. Renegotiate it this week.', 'Let someone care for you today without immediately returning the gesture.', 'Set one boundary with someone you have been over-accommodating.'] },
  7:  { missionLine: 'Seek truth and share it from direct experience.',                                                                                                rewardText: 'Mastery of wisdom · The peace of trusting your own inner authority',
        objectives: ['Spend 30 minutes daily in genuine solitude — no input, no content.', 'Act on one intuitive signal this week without seeking anyone\'s confirmation first.', 'Share one piece of insight from your own direct experience, not from a book or teacher.'] },
  8:  { missionLine: 'Master yourself and wield power with integrity.',                                                                                                rewardText: 'Mastery of power · The satisfaction of achieving through discipline and integrity',
        objectives: ['Name the pattern that most consistently leaks your power. Watch it operate today.', 'Make one significant decision this week based purely on what is correct, not comfortable.', 'Build one non-negotiable discipline this month — wake time, movement, or practice.'] },
  9:  { missionLine: 'Complete what needs to end and serve what needs to begin.',                                                                                      rewardText: 'Mastery of release · The freedom that comes from letting go with love',
        objectives: ['Identify one relationship, project, or belief past its natural end. Begin releasing it.', 'Practise forgiveness of one person or past version of yourself this week.', 'Complete one open cycle — formally, consciously, with gratitude.'] },
  11: { missionLine: 'Bridge the seen and unseen worlds. Your master calling is to channel higher frequencies into practical, grounded guidance.',                    rewardText: 'Master illumination · The gift of being a clear channel between worlds',
        objectives: ['Build a daily grounding ritual — movement, breath, or nature. Non-negotiable.', 'Share one piece of channelled insight with someone who needs it this week.', 'Notice where your sensitivity is causing withdrawal. Step toward that discomfort instead.'] },
  22: { missionLine: 'Manifest spiritual vision into material reality at the largest scale.',                                                                          rewardText: 'Master manifestation · The legacy of building what civilisations rest upon',
        objectives: ['Write your largest vision for what you are building. Let it be uncomfortably large.', 'Identify where you are thinking small to avoid the weight of thinking large. Restore the scale.', 'Delegate one task and invest the recovered time in your most important project.'] },
  33: { missionLine: 'Embody unconditional love as lived practice.',                                                                                                   rewardText: 'Master healing · The wholeness of loving without limit from a sustainable source',
        objectives: ['Draw the line between compassion and martyrdom in your life right now. Where is it blurred?', 'Teach something from direct experience this week — not from theory or secondhand knowledge.', 'Receive care completely and gratefully this week. Let yourself be seen in your need.'] },
  44: { missionLine: 'Organise the highest vision into the most enduring material form.',                                                                              rewardText: 'Master organisation · The power of turning cosmic vision into tangible, lasting reality',
        objectives: ['Audit your current projects: which are ego-driven and which are legacy-driven? Redirect.', 'Build or strengthen one system this week that will run without your constant presence.', 'Make one decision based on 50-year impact rather than immediate return.'] },
  55: { missionLine: 'Become freedom. Not the idea of it — the living embodiment of it. Your master calling is to demonstrate liberation so completely that cages dissolve in your presence.',                 rewardText: 'Master liberation · The transmission of freedom as a contagious lived frequency',
        objectives: ['Identify the last cage you have built around yourself — the one you call a boundary but is actually a fear. Step through it.', 'Spend one full day acting on intuitive impulse, with no plan or agenda.', 'Locate where you are performing freedom rather than living it. Drop the performance.'] },
  66: { missionLine: 'Love at full capacity without losing yourself in the giving. Your master calling is to be the sacred container — holding space so completely that healing becomes inevitable.',           rewardText: 'Master love · The fulfilment of a heart that gives without limit from a source that never empties',
        objectives: ['Identify where you are bleeding love into situations that cannot receive it. Redirect that energy.', 'Create one space this week — a room, a conversation, a gathering — that functions as genuine sanctuary.', 'Receive love completely this week. Let it land without deflecting or immediately reciprocating.'] },
  77: { missionLine: 'Trust what you perceive completely. Your master calling is to channel what cannot be learned and give it voice without apology or qualification.',                                        rewardText: 'Master perception · The peace of trusting your direct knowing over all external authority',
        objectives: ['Act on one piece of direct knowing this week without seeking any external validation.', 'Enter one hour of complete silence daily this week. Let your intelligence speak without competition.', 'Share one piece of transmitted wisdom — from direct perception, not from reading. Offer it without qualification.'] },
  88: { missionLine: 'Align power with integrity so completely they become the same thing. Your master calling is to demonstrate that true authority purifies everything it touches.',                          rewardText: 'Master power · The liberation of wielding absolute authority with absolute integrity',
        objectives: ['Name the place where your power and integrity are not yet fully aligned. Close that gap this week.', 'Make one decision this week using only your own authority — no consensus, no approval-gathering.', 'Use your authority this week specifically to empower someone who currently feels powerless.'] },
  99: { missionLine: 'Complete what cannot be left incomplete. Your master calling is to close the oldest loops — in yourself, in your lineage, in the collective — and release them with full grace.',        rewardText: 'Master completion · The freedom of the one who releases everything, including themselves',
        objectives: ['Identify the oldest unfinished cycle in your life. Begin closing it this week with full presence.', 'Write a letter of completion to something or someone you have never fully released. You need not send it.', 'Practise one act of radical forgiveness — of another, of life, or of yourself. Let the loop close.'] }
};

/* ================================================
   POLARITY CLASSIFICATION
   ================================================ */
const ELECTRIC_NUMS = new Set([1, 3, 5, 7]);
const MAGNETIC_NUMS = new Set([2, 4, 6, 8]);
const AETHER_NUMS   = new Set([0, 9]);

/* ================================================
   STAT NAMES (used in chart rows)
   ================================================ */
const STAT_NAMES = {
  0: 'SOURCE',
  1: 'INITIATIVE',
  2: 'CONNECTION',
  3: 'EXPRESSION',
  4: 'STRUCTURE',
  5: 'PHYSICALITY',
  6: 'STEWARDSHIP',
  7: 'SEEKING',
  8: 'POWER',
  9: 'COMPASSION',
};

/* ================================================
   POLARITY DISPLAY CONFIG
   Shared by buildCharts and buildPolarityCard.
   ================================================ */
const POLARITY_COLORS = {
  electric: { accent: 'var(--teal)',   dim: 'var(--teal-dim)'   },
  magnetic: { accent: 'var(--purple)', dim: 'var(--purple-dim)' },
  aether:   { accent: 'var(--gold)',   dim: 'var(--gold-dim)'   },
};

const POLARITY_CONFIGS = {
  electric: {
    icon: '⚡', label: 'ELECTRIC',
    color: 'var(--teal)', dim: 'var(--teal-dim)',
    desc: 'Your field radiates outward — initiating, transmitting, catalysing. You carry the frequency of action, spark, and forward movement.',
  },
  magnetic: {
    icon: '◉', label: 'MAGNETIC',
    color: 'var(--purple)', dim: 'var(--purple-dim)',
    desc: 'Your field draws inward — receiving, grounding, sustaining. You carry the frequency of depth, resonance, and magnetic pull.',
  },
  aether: {
    icon: '✦', label: 'AETHER',
    color: 'var(--gold)', dim: 'var(--gold-dim)',
    desc: 'Your field moves between worlds — completing, dissolving, transcending. You carry the frequency of the void before beginning and the silence after completion.',
  },
};

const AETHER_TIERS = [
  {
    threshold: 1,
    label: 'AETHERIC TOUCH',
    icon: '✦',
    desc: 'A thread of aether runs through your chart. You have a quiet sensitivity to endings and thresholds — a subtle awareness of what lies beyond the visible cycle. This quality does not dominate, but it colours your perception. You occasionally sense when something is completing before others do.',
  },
  {
    threshold: 3,
    label: 'AETHERIC PRESENCE',
    icon: '✦✦',
    desc: 'Aether is a meaningful current in your field. You carry a genuine attunement to the liminal — the space between endings and beginnings, the silence between words. You are drawn to questions others avoid: what remains when everything is stripped away, what completes, what transcends. This is not passive — it is a form of power that operates beneath the surface of ordinary perception.',
  },
  {
    threshold: 6,
    label: 'AETHERIC NATURE',
    icon: '✦✦✦',
    desc: 'Aether is woven deeply into who you are. You are not primarily of this cycle — you exist at its edges, at the place where 9 folds back into 0 and the whole sequence breathes again. You carry the quality of dissolution and return. Others may experience you as difficult to categorise, impossible to pin down, simultaneously ancient and unformed. Your power is not in initiation or reception but in completion — in knowing when something is finished, in holding the space of the void without flinching, and in your rare capacity to transmit what cannot be spoken.',
  },
];

/* ================================================
   COMPOUND INFLUENCE ENGINE DATA
   For Life Path, Expression, Life Calling quests.
   ================================================ */

// Field context labels
const FIELD_LABELS = {
  lp: { field: 'Life Path',    verb: 'learns through',     tone: 'The lesson of this path is shaped by' },
  ex: { field: 'Expression',   verb: 'carries in expression', tone: 'This expression is coloured by' },
  cl: { field: 'Life Calling', verb: 'carries as mission',  tone: 'This calling is built from' },
};

// Short root-quality sentence per number per field
const ROOT_INFLUENCE = {
  lp: {
    1: 'The 1 root means this life path ultimately demands courageous self-direction — the willingness to go first and lead without needing permission.',
    2: 'The 2 root means this life path ultimately asks for deep relational mastery — learning to bridge, harmonize, and be fully present in connection.',
    3: 'The 3 root means this life path ultimately calls for authentic creative expression — finding and giving voice to what is uniquely yours.',
    4: 'The 4 root means this life path ultimately requires patient, disciplined building — the lesson is that structure and sustained effort create real freedom.',
    5: 'The 5 root means this life path ultimately teaches full embodied presence — freedom is found here, not in escape, and every experience is the curriculum.',
    6: 'The 6 root means this life path ultimately centres on sustainable love — learning to serve without self-erasure and to care from genuine wholeness.',
    7: 'The 7 root means this life path ultimately demands radical trust in inner knowing — the path drives you past external authority into direct personal truth.',
    8: 'The 8 root means this life path ultimately calls for self-mastery — real power is earned through discipline and expressed through integrity, not force.',
    9: 'The 9 root means this life path ultimately asks for graceful completion — the deepest lesson is how to release what is finished and serve the larger whole.',
  },
  ex: {
    1: 'The 1 root means this expression ultimately radiates initiating, pioneering energy — others experience you as someone who starts things and moves first.',
    2: 'The 2 root means this expression ultimately carries a bridging, harmonizing quality — you are built to connect people and hold relational space.',
    3: 'The 3 root means this expression ultimately transmits creative, joyful energy — your natural mode of presence is expressive and enlivening.',
    4: 'The 4 root means this expression ultimately carries a grounding, stabilizing quality — you are experienced as someone who builds and sustains.',
    5: 'The 5 root means this expression ultimately radiates aliveness and adaptability — you embody presence and demonstrate that freedom is not escape.',
    6: 'The 6 root means this expression ultimately carries nurturing, integrating energy — you are experienced as a source of care and unconditional support.',
    7: 'The 7 root means this expression ultimately transmits depth and inner authority — you are experienced as someone who sees beneath the surface.',
    8: 'The 8 root means this expression ultimately carries authority and manifestation power — you project capability, command, and results.',
    9: 'The 9 root means this expression ultimately radiates completion and universal compassion — you are experienced as someone who holds all of life with wisdom.',
  },
  cl: {
    1: 'The 1 root means this calling ultimately expresses through bold initiation — the mission finds its fullest form when you move first and pioneer without permission.',
    2: 'The 2 root means this calling ultimately expresses through relational service — the mission is fulfilled in partnership, bridging, and conscious cooperation.',
    3: 'The 3 root means this calling ultimately expresses through creative voice — the mission is carried forward through authentic expression and inspired communication.',
    4: 'The 4 root means this calling ultimately expresses through disciplined building — the mission takes form through patient, structured, sustained effort.',
    5: 'The 5 root means this calling ultimately expresses through freedom and embodied presence — the mission is transmitted through living it completely, not teaching it abstractly.',
    6: 'The 6 root means this calling ultimately expresses through nurturing service — the mission is fulfilled through creating sustainable care and genuine community.',
    7: 'The 7 root means this calling ultimately expresses through inner wisdom — the mission finds its truest form in quiet authority and direct transmission of what has been discovered.',
    8: 'The 8 root means this calling ultimately expresses through power and integrity — the mission demands mastery of self before mastery of the world.',
    9: 'The 9 root means this calling ultimately expresses through completion and universal service — the mission is fulfilled in serving the whole and releasing the personal.',
   11:  "ASDLFJ"
  },
};

// How each component digit colours the compound per field
const DIGIT_INFLUENCE = {
  lp: {
    0: 'The 0 amplifies every frequency it accompanies — in this life path it signals an infinite quality to the lessons carried, a sense of beginning again at a deeper level.',
    1: 'The 1 in this compound brings the quality of initiation to this life path — a drive to go first, establish something new, and move without waiting for the path to already exist.',
    2: 'The 2 in this compound brings relational sensitivity to this life path — an undercurrent of awareness, attunement, and the need for genuine connection woven into the lesson.',
    3: 'The 3 in this compound brings creative expression to this life path — the lesson is partially carried through voice, art, and the need to make the inner world visible.',
    4: 'The 4 in this compound brings a structural quality to this life path — the lesson is grounded in discipline, form, and the long work of building something solid.',
    5: 'The 5 in this compound brings an exploratory quality to this life path — part of the lesson is learned through direct experience, movement, and the willingness to remain fully present.',
    6: 'The 6 in this compound brings a nurturing thread to this life path — the lesson involves care, responsibility, and learning the difference between love and self-erasure.',
    7: 'The 7 in this compound brings an inward, seeking quality to this life path — part of the lesson is learned in solitude, through investigation, and by trusting direct inner knowing.',
    8: 'The 8 in this compound brings a power and authority thread to this life path — part of the lesson involves mastery, discipline, and the right use of personal force.',
    9: 'The 9 in this compound brings a completion quality to this life path — part of the lesson involves release, universal perspective, and serving something larger than personal ambition.',
  },
  ex: {
    0: 'The 0 in this compound amplifies the expression — it brings an infinite or absolute quality to how this frequency is carried and transmitted.',
    1: 'The 1 in this compound threads a pioneering, self-directed quality into this expression — an energy that initiates and leads, even when that was not the intention.',
    2: 'The 2 in this compound weaves relational awareness into this expression — a sensitivity and attunement that others feel before they can name it.',
    3: 'The 3 in this compound colours this expression with creative, communicative energy — a natural ability to give form to the intangible.',
    4: 'The 4 in this compound grounds this expression — it brings reliability, structure, and a quality of solidity that others find stabilising.',
    5: 'The 5 in this compound adds dynamic, present-moment aliveness to this expression — a quality of adaptability and embodied freedom.',
    6: 'The 6 in this compound weaves nurturing warmth into this expression — an instinctive care and integrating quality that draws others into safety.',
    7: 'The 7 in this compound adds depth and inner authority to this expression — a penetrating quality that sees beneath surfaces and communicates from that depth.',
    8: 'The 8 in this compound adds authority and power to this expression — a commanding quality that manifests results and carries earned respect.',
    9: 'The 9 in this compound adds compassion and universality to this expression — a quality of wisdom and completion that others feel as genuine care for the whole.',
  },
  cl: {
    0: 'The 0 in this calling amplifies the mission to an absolute degree — it signals a calling with no partial form, one that must be lived completely or not at all.',
    1: 'The 1 in this calling means part of the mission is carried through first-mover courage — the calling demands that you initiate rather than wait, even when the path is unclear.',
    2: 'The 2 in this calling means part of the mission is carried through relationship and cooperation — the calling is fulfilled not alone but in genuine partnership.',
    3: 'The 3 in this calling means part of the mission is carried through creative expression — the calling transmits itself through voice, art, and authentic communication.',
    4: 'The 4 in this calling means part of the mission is built through disciplined structure — the calling demands patient, systematic effort and the willingness to construct foundations.',
    5: 'The 5 in this calling means part of the mission is embodied rather than taught — the calling asks you to live the freedom, presence, and aliveness you carry as a transmittable demonstration.',
    6: 'The 6 in this calling means part of the mission is fulfilled through service and care — the calling demands that you give generously, but from wholeness, not depletion.',
    7: 'The 7 in this calling means part of the mission is carried through wisdom and inner knowing — the calling asks you to seek truth and transmit what you find from direct experience.',
    8: 'The 8 in this calling means part of the mission is fulfilled through power and mastery — the calling demands you demonstrate what disciplined human will can achieve.',
    9: 'The 9 in this calling means part of the mission is completed through release and universal service — the calling asks you to serve humanity and let go of personal ownership of the outcome.',
  },
};

/* ================================================
   CALLING BLEND — source ingredient prose
   How LP root and EX root each contribute to the Calling.
   ================================================ */
const LP_INTO_CALLING = {
  1:  'Your Life Path 1 brings the engine of initiation — the drive to go first, establish new ground, and lead without waiting for a map. This quality enters your calling as raw creative force: the willingness to begin before the conditions are ready.',
  2:  'Your Life Path 2 brings the engine of relational mastery — the capacity to hold opposites, build bridges, and operate through genuine partnership. This quality enters your calling as sensitivity and cooperation: the understanding that the mission is fulfilled through others, not in spite of them.',
  3:  'Your Life Path 3 brings the engine of creative expression — the drive to translate inner experience into visible form and to communicate what others can only feel. This quality enters your calling as voice: the mission travels on the current of authentic expression.',
  4:  'Your Life Path 4 brings the engine of disciplined building — the willingness to work methodically, construct solid foundations, and sustain effort across time. This quality enters your calling as structure: the mission requires patient, consistent construction to take lasting form.',
  5:  'Your Life Path 5 brings the engine of embodied presence — the capacity to remain fully alive and adaptive in the midst of constant change. This quality enters your calling as freedom: the mission transmits through your willingness to inhabit life completely rather than teach it from a distance.',
  6:  'Your Life Path 6 brings the engine of care and integration — the drive to nurture, create community, and hold people within something sustainable. This quality enters your calling as service: the mission is fulfilled not through personal achievement but through what grows in the environments you create.',
  7:  'Your Life Path 7 brings the engine of inner seeking — the drive to move past surface appearances into direct contact with what is actually real. This quality enters your calling as authority: the mission carries the weight of something that has been verified through direct experience, not inherited from others.',
  8:  'Your Life Path 8 brings the engine of power and self-mastery — the drive to achieve at scale through disciplined will and absolute integrity. This quality enters your calling as force: the mission requires you to build genuine authority in the world before the transmission can reach the scale it is meant for.',
  9:  'Your Life Path 9 brings the engine of completion and universal service — the drive to release what is finished and give freely to the collective. This quality enters your calling as selflessness: the mission is most fully expressed when personal ownership of it is surrendered entirely.',
  11: 'Your Life Path 11 brings the engine of master sensitivity — the capacity to receive higher frequencies and translate them into human terms. This quality enters your calling as pure channelling: the mission moves through you rather than from you.',
  22: 'Your Life Path 22 brings the engine of civilisational building — the drive to manifest spiritual vision into structures that outlast a single lifetime. This quality enters your calling as scale: the mission is meant to be built, not just transmitted.',
  33: 'Your Life Path 33 brings the engine of unconditional love — the drive to heal, teach, and hold others within compassion as a lived demonstration. This quality enters your calling as heart: the mission heals through presence before it teaches through words.',
  44: 'Your Life Path 44 brings the engine of supreme material mastery — the drive to organise the highest vision into the most enduring physical form. This quality enters your calling as permanence: the mission is built to last beyond your direct involvement.',
};

const EX_INTO_CALLING = {
  1:  'Your Expression 1 means you carry your calling outwardly as a pioneering frequency — others experience you as someone who initiates, leads, and moves first. The calling is transmitted through the quality of your self-directed action.',
  2:  'Your Expression 2 means you carry your calling outwardly as a relational frequency — others experience you as a bridge-builder, a harmoniser, someone who creates unity from division. The calling transmits through the quality of your presence in relationship.',
  3:  'Your Expression 3 means you carry your calling outwardly as a creative frequency — others experience you as an expressive, communicative, enlivening force. The calling transmits through the quality and authenticity of your voice.',
  4:  'Your Expression 4 means you carry your calling outwardly as a grounding frequency — others experience you as reliable, structured, and capable of making the complex simple and solid. The calling transmits through the quality of what you build.',
  5:  'Your Expression 5 means you carry your calling outwardly as an alive, adaptive frequency — others experience you as fully present and dynamically engaged with life. The calling transmits through the quality of your embodied freedom.',
  6:  'Your Expression 6 means you carry your calling outwardly as a nurturing frequency — others experience you as warm, responsible, and genuinely caring. The calling transmits through the quality of the environments and relationships you tend.',
  7:  'Your Expression 7 means you carry your calling outwardly as a depth frequency — others experience you as introspective, perceptive, and carrying an inner authority that cannot be performed or borrowed. The calling transmits through the quality of your silence and your knowing.',
  8:  'Your Expression 8 means you carry your calling outwardly as an authority frequency — others experience you as capable, commanding, and capable of producing results at scale. The calling transmits through the quality of your mastery.',
  9:  'Your Expression 9 means you carry your calling outwardly as a completion frequency — others experience you as compassionate, wise, and genuinely devoted to something larger than yourself. The calling transmits through the quality of your willingness to serve and release.',
  11: 'Your Expression 11 means you carry your calling outwardly as an illuminating frequency — others experience you as a channel, someone through whom something larger seems to speak. The calling transmits through the quality of your presence as a living conduit.',
  22: 'Your Expression 22 means you carry your calling outwardly as a building frequency — others experience you as someone whose vision is already under construction. The calling transmits through the quality of what you are visibly bringing into form.',
  33: 'Your Expression 33 means you carry your calling outwardly as a healing frequency — others experience your presence as an act of love before you have spoken a single word. The calling transmits through the quality of your unconditional acceptance.',
  44: 'Your Expression 44 means you carry your calling outwardly as a mastery frequency — others experience you as someone who operates at a level of precision and intent that leaves no doubt about the scope of what is being built. The calling transmits through the quality of your absolute commitment.',
};

/* ================================================
   CYCLE DATA
   ================================================ */
const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const CYCLE_MEANINGS = {
  pinnacle: {
    1:  { theme: 'Self-Reliance & Leadership', summary: 'This pinnacle teaches independence, courage, and the development of a strong individual identity. You are here to lead, pioneer, and discover the power of standing alone without loneliness.' },
    2:  { theme: 'Cooperation & Sensitivity',  summary: 'This pinnacle develops emotional intelligence, relational depth, and the art of partnership. You learn to find strength in receptivity rather than force, and mastery in the spaces between words.' },
    3:  { theme: 'Creative Expression',        summary: 'This pinnacle opens the channel of authentic self-expression. Creative output, communication, and joyful connection are the curriculum. Suppressing your voice is the only mistake available.' },
    4:  { theme: 'Discipline & Hard Work',     summary: 'This pinnacle builds character through sustained effort and disciplined construction. It is often demanding and rarely glamorous — but what you build here becomes the bedrock of everything after.' },
    5:  { theme: 'Change & Versatility',       summary: 'This pinnacle is defined by movement, change, and the mastery of adaptability. Freedom is earned through presence, not escape. Every disruption carries an invitation to go deeper.' },
    6:  { theme: 'Service & Responsibility',   summary: 'This pinnacle draws you into the field of home, family, and community service. The lesson is love with boundaries — giving sustainably, rather than until there is nothing left.' },
    7:  { theme: 'Spiritual Seeking',          summary: 'This pinnacle invites deep introspection, spiritual study, and the development of inner authority. The answers are inside. This period rewards those who stop looking outward and go quiet.' },
    8:  { theme: 'Material Mastery',           summary: 'This pinnacle activates the drive for achievement, authority, and material accomplishment. The lesson is the proper use of power — earned through self-discipline, not claimed through dominance.' },
    9:  { theme: 'Universal Service',          summary: 'This pinnacle expands your sense of purpose beyond the personal. The work is impersonal, large-scale, and service-oriented. Let go of what is small and serve what is vast.' },
    11: { theme: 'Master Illumination',        summary: 'A master pinnacle — this period can deliver extraordinary spiritual insight, intuitive power, and the capacity to inspire at scale. The sensitivity is real; the requirement is rigorous grounding.' },
    22: { theme: 'Master Manifestation',       summary: 'A master pinnacle — this period carries the potential to manifest vision at a generational scale. The demand is enormous. The reward is building something that outlives you.' },
    },
  personalYear: {
    1:  { theme: 'New Beginnings',          summary: 'This is a year of initiation — planting seeds, starting fresh, and stepping into new territory. The simulation is resetting your cycle. What you begin now carries momentum for nine years. Plant deliberately.' },
    2:  { theme: 'Connection & Patience',   summary: 'This is a year of relationship, cooperation, and waiting. The seeds planted last year need tending, not forcing. Build alliances, develop sensitivity, and trust that timing is part of the design.' },
    3:  { theme: 'Expression & Growth',     summary: 'This is a year of creative expansion, communication, and social flowering. What was planted is now visibly growing. Express boldly, collaborate joyfully, and say the things you have been holding.' },
    4:  { theme: 'Foundation Building',     summary: 'This is a year of disciplined construction. The work is unglamorous and necessary. What you build this year becomes the platform for everything that follows. Do not skip steps.' },
    5:  { theme: 'Change & Freedom',        summary: 'This is a year of movement, change, and liberation. The foundation is in place — now life expands. Expect the unexpected, welcome disruption, and stay present through each shift.' },
    6:  { theme: 'Responsibility & Home',   summary: 'This is a year of deepening commitments — to people, to purpose, to the care of what matters. The simulation asks you to show up fully for those in your field. Service now becomes a sacred act.' },
    7:  { theme: 'Inner Work & Reflection', summary: 'This is a year of retreat, study, and spiritual deepening. Life slows down so you can go inward. Seek truth, question assumptions, and trust the quiet. Answers arrive through stillness.' },
    8:  { theme: 'Power & Achievement',     summary: 'This is a year of harvest, ambition, and material achievement. The inner work of last year now has a visible return. Step into authority, make significant moves, and claim what you have earned.' },
    9:  { theme: 'Completion & Release',    summary: 'This is a year of endings, clearing, and universal service. The nine-year cycle is closing. Release what no longer serves with love and gratitude. Do not start new things — complete what remains.' },
    11: { theme: 'Illumination & Mastery',  summary: 'A master year — this is a time of heightened spiritual awareness, intuitive breakthroughs, and the potential for significant illumination. Extraordinary sensitivity accompanies extraordinary insight. Ground daily.' },
    22: { theme: 'Master Building',         summary: 'A master year — this is a time of manifesting large-scale vision into material form. The stakes are higher, the work is more demanding, and the results can be generational. Build with full intention.' },
  },
  fourMonthCycle: {
    1:  { theme: 'Initiation',     summary: 'A 1 cycle period invites you to begin something new — start the project, make the call, take the first step. Momentum favours the one who goes first right now.' },
    2:  { theme: 'Gestation',      summary: 'A 2 cycle period asks for patience, cooperation, and attentiveness to subtle signals. This is a gathering phase, not a launching phase. Listen more than you speak.' },
    3:  { theme: 'Expression',     summary: 'A 3 cycle period opens the creative channel. Express, communicate, socialise. What wants to be said should be said. Creative projects get an energetic boost.' },
    4:  { theme: 'Consolidation',  summary: 'A 4 cycle period calls for disciplined work, organisation, and practical follow-through. Unglamorous effort done now yields lasting results. Clear the backlog, build the system.' },
    5:  { theme: 'Expansion',      summary: 'A 5 cycle period brings movement, change, and unexpected openings. Stay flexible. The disruption is the opportunity. Presence over planning.' },
    6:  { theme: 'Responsibility', summary: 'A 6 cycle period draws attention to home, relationships, and commitments. Nurture what matters. Show up for the people in your field. Love is the work.' },
    7:  { theme: 'Reflection',     summary: 'A 7 cycle period invites retreat and inner inquiry. Research, study, contemplate. The outer world can wait. The insight available this period is worth the pause.' },
    8:  { theme: 'Achievement',    summary: 'An 8 cycle period activates ambition, authority, and tangible results. Make significant moves. Negotiate, achieve, deliver. Your power is available — use it.' },
    9:  { theme: 'Completion',     summary: 'A 9 cycle period asks you to finish, release, and clear. Tie up loose ends, have the closing conversation, let go of what is done. Make room for what comes next.' },
    11: { theme: 'Master Illumination', summary: 'An 11 cycle period carries heightened intuitive frequency — insights arrive suddenly, sensitivity is amplified, and the channel between your inner knowing and outer action is unusually clear.' },
    22: { theme: 'Master Building',     summary: 'A 22 cycle period activates large-scale building energy. Ideas that seemed too big suddenly have traction. Strategic thinking is amplified, and the work you do now can carry unusual permanence.' },
  },
  personalMonth: {
    1:  { theme: 'Fresh Start',    summary: 'A personal month 1 sparks new intentions within your yearly flow. Something is beginning — even if quietly. Notice what is stirring and give it your attention.' },
    2:  { theme: 'Cooperation',    summary: 'A personal month 2 softens the pace and asks for attunement. Work with others rather than alone. Small gestures of connection carry unusual weight now.' },
    3:  { theme: 'Creativity',     summary: 'A personal month 3 opens the creative valve. Expression comes easily, connections deepen, and joy is available if you stop being serious for a moment.' },
    4:  { theme: 'Organisation',   summary: 'A personal month 4 calls you back to the basics — the plan, the structure, the to-do list that actually matters. Discipline applied now saves effort for months.' },
    5:  { theme: 'Movement',       summary: 'A personal month 5 shakes things loose. Plans change, surprises arrive, and the body wants to move. Go with it. Resistance makes this month harder than it needs to be.' },
    6:  { theme: 'Nurturing',      summary: 'A personal month 6 draws focus to relationships, home, and care. Love is the primary currency. Give it generously, and let yourself receive it too.' },
    7:  { theme: 'Introspection',  summary: 'A personal month 7 asks you to slow down and look inward. Solitude is productive now. Something important will become clear if you give it silence.' },
    8:  { theme: 'Manifestation',  summary: 'A personal month 8 delivers energy for achievement, ambition, and tangible results. Step up, ask for more, deliver fully. The frequency supports bold action.' },
    9:  { theme: 'Release',        summary: 'A personal month 9 closes a chapter. Something is completing. Help it finish well rather than clinging. The clearing creates the space your next cycle needs.' },
    11: { theme: 'Illuminated Channel', summary: 'A personal month 11 is a master period — intuition is sharper than usual, creative and spiritual breakthroughs are close to the surface. What you channel now can carry lasting impact.' },
    22: { theme: 'Master Vision',       summary: 'A personal month 22 amplifies your capacity to think and build at scale. Visions that seemed impractical may suddenly have a path forward. Engage seriously with your largest ideas.' },
  },
  personalDay: {
    1:  { theme: 'Initiative',  summary: "A personal day 1 — begin something, however small. The energy supports new action. Don't wait for a better moment." },
    2:  { theme: 'Connection',  summary: 'A personal day 2 — reach out, collaborate, listen. Relationships are the portal today. Sensitivity is a strength.' },
    3:  { theme: 'Expression',  summary: 'A personal day 3 — say the thing, make the thing, share the thing. Creative and communicative energy is high. Use it.' },
    4:  { theme: 'Work',        summary: 'A personal day 4 — put your head down and work steadily. Discipline applied today compounds. Small, sustained effort.' },
    5:  { theme: 'Flexibility', summary: 'A personal day 5 — stay light, stay present. Plans may shift. The unexpected is an invitation, not a problem.' },
    6:  { theme: 'Care',        summary: 'A personal day 6 — show up for someone. Home, family, and relationships are activated. Love is the practice.' },
    7:  { theme: 'Reflection',  summary: 'A personal day 7 — pause, inquire, observe. Something will become clearer if you stop moving for a moment.' },
    8:  { theme: 'Power',       summary: 'A personal day 8 — lead, achieve, deliver. Your authority is available. Make the call, close the deal, step up.' },
    9:  { theme: 'Completion',  summary: 'A personal day 9 — finish something. Tie a loose end. Let something go. The closing is the gift.' },
    11: { theme: 'Transmission',  summary: 'A personal day 11 — a master day. Your intuitive channel is open wider than usual. Pay close attention to what arrives. Act on what you perceive rather than dismissing it. Ground yourself.' },
    22: { theme: 'Manifestation', summary: 'A personal day 22 — a master day for building and manifesting. What you put structured effort into today carries unusual staying power. Think large, act precisely.' },
  },
};

const CYCLE_QUEST_COLORS = {
  personalYear:   { color: '--teal',   colorDim: '--teal-dim',   icon: '◎' },
  pinnacle:       { color: '--gold',   colorDim: '--gold-dim',   icon: '▲' },
  fourMonthCycle: { color: '--purple', colorDim: '--purple-dim', icon: '◈' },
  personalMonth:  { color: '--rose',   colorDim: '--rose-dim',   icon: '◇' },
  personalDay:    { color: '--sage',   colorDim: '--sage-dim',   icon: '✦' },
};

const CURRENT_QUEST_OBJECTIVES = {
  personalYear: {
    1:  ['Begin one project or initiative you have been postponing — this year rewards the one who starts first.', 'Declare one area of your life where you are now leading rather than following.', 'Release one identity or role that belongs to a previous cycle. Let this year be genuinely new.'],
    2:  ['Identify one relationship that needs patient tending this year. Water it, don\'t force it.', 'Practise asking for what you need instead of waiting to be offered it.', 'Find one place where cooperation would move things faster than solo effort. Choose it deliberately.'],
    3:  ['Create and share something every week — writing, art, voice, or conversation. Let expression be your primary tool this year.', 'Identify where you are performing rather than expressing. Drop the performance once a week.', 'Say yes to at least two social or creative opportunities you would normally decline.'],
    4:  ['Choose one area of your life that needs structure and build a system around it this month.', 'Show up to your most important work every day, even when uninspired. This year, consistency is the magic.', 'Complete one half-finished project before starting anything new.'],
    5:  ['Say yes to one unexpected opportunity this month without over-planning it.', 'Identify one area of your life that has become too rigid. Deliberately disrupt it.', 'Stay fully present for one interaction daily that you would normally rush through.'],
    6:  ['Name one relationship in your life that needs more of your presence this year. Show up to it.', 'Create or restore one daily ritual of self-care that is non-negotiable.', 'Set one boundary this month that protects your energy for what actually matters.'],
    7:  ['Schedule at least one hour of genuine solitude daily — no content, no input. Just your own mind.', 'Act on one intuitive knowing this month without seeking external confirmation first.', 'Read, study, or research one topic that genuinely compels you. Go deep, not wide.'],
    8:  ['Identify one area where you are playing small. Make one significant move toward full expression of your capacity.', 'Negotiate, ask, or claim something you have been waiting to be given.', 'Build or strengthen one discipline this month that supports your authority and results.'],
    9:  ['Identify one thing you are carrying from the past that is taking up present-moment space. Begin releasing it.', 'Complete one open loop — a conversation, a project, an apology, a decision — that has been lingering.', 'Give something away this month: time, knowledge, a physical object, an old story about yourself.'],
    11: ['Ground your intuitive insights daily — journal, walk, or move before acting on what you receive.', 'Share one inspired perception with someone who needs it this week. Channel, don\'t perform.', 'Identify where your sensitivity is protecting you from something you actually need to face.'],
    22: ['Write out your largest vision for this year. Let it be uncomfortable in its scale.', 'Identify one place where you are managing when you should be building. Shift the approach.', 'Delegate one task to someone else and invest that recovered time in your most important project.'],
  },
  pinnacle: {
    1:  ['Take one action this month that requires going first with no guarantee of support.', 'Identify where you are waiting for approval before moving. Choose to move without it.', 'Develop one daily practice that builds independence: a solo discipline, a solo decision, a solo creative act.'],
    2:  ['Find one relationship that is currently in tension. Invest in it rather than withdrawing.', 'Practise listening for twice as long as you speak in your next three important conversations.', 'Identify one way you are suppressing your own voice to maintain peace. Speak it gently but clearly.'],
    3:  ['Begin or restart a creative practice that has no audience yet. Do it for the act of expression alone.', 'Identify the last time you held back from saying something true. Find one place to say it this week.', 'Collaborate with one person whose creative energy is different from yours.'],
    4:  ['Audit your current systems — finances, health, workspace, relationships. Strengthen the weakest one.', 'Choose your most important long-term project and work on it first every day this week.', 'Build one physical thing with your hands this month. Ground the energy in material reality.'],
    5:  ['Say yes to one thing that disrupts your routine and requires full presence to navigate.', 'When the urge to escape or numb arises, pause for two minutes and feel what is underneath it.', 'Identify one commitment you have been avoiding. Make it this week and stay with how that feels.'],
    6:  ['Audit where you are giving without receiving. Renegotiate one arrangement that has become imbalanced.', 'Create or restore one environment — physical or relational — that functions as genuine sanctuary.', 'Practise asking for help with something you would normally handle alone.'],
    7:  ['Set aside one hour daily for inner work: meditation, journaling, or contemplation. Protect it.', 'Act on one piece of inner knowing this week without needing anyone else to confirm it.', 'Identify one belief you inherited that you have never actually tested. Question it directly.'],
    8:  ['Name your most significant goal for this chapter. Make one strategic move toward it this week.', 'Identify where you have been avoiding a difficult decision. Make it this week with full ownership.', 'Build one non-negotiable daily discipline that compounds over this pinnacle period.'],
    9:  ['Identify one thing from your past that you are still carrying. Begin the process of consciously releasing it.', 'Give something of genuine value away: expertise, time, resources, or recognition.', 'Ask yourself: what needs to end in my life so something new can begin? Take one step toward that ending.'],
    11: ['Build a daily grounding practice: movement, breathwork, time in nature. Non-negotiable for this pinnacle.', 'Share one piece of channelled insight this week — something you perceive but haven\'t yet said aloud.', 'Notice when your sensitivity spikes. Instead of retreating, ask what it is trying to show you.'],
    22: ['Write a 10-year vision for your most important work. Allow it to be uncomfortably large.', 'Identify one place where you are thinking small to avoid the weight of thinking large. Restore the true scale.', 'Find one person whose potential you can genuinely amplify. Invest substantially in them this month.'],
  },
  fourMonthCycle: {
    1:  ['Launch or restart one project this cycle. Begin before you are ready.', 'Introduce yourself or your work to one new person or audience this month.', 'Clear one old commitment that is blocking the space needed for what is beginning.'],
    2:  ['Resist forcing a result this cycle. Choose cooperation over competition in one key area.', 'Reach out to one person you have been meaning to connect with. Build the bridge.', 'Listen more than you speak in your most important conversations this month.'],
    3:  ['Publish, share, or express something every week of this cycle — don\'t wait until it\'s perfect.', 'Organise or attend one gathering, collaboration, or creative exchange.', 'Say the thing you have been holding back in one important relationship or context.'],
    4:  ['Identify the most important structural task in your life right now. Work on it every day this cycle.', 'Clear physical and digital clutter from one environment. Prepare your space for what comes next.', 'Review your finances, calendar, and commitments. Align them with your actual priorities.'],
    5:  ['Accept one invitation or opportunity you would normally decline due to uncertainty.', 'Travel, change your routine, or expose yourself to a completely different environment this cycle.', 'When something unexpected arrives, ask "what is this opening?" before asking "how do I manage this?"'],
    6:  ['Schedule quality time with one person who matters to you and give them your full presence.', 'Create or restore one home environment or daily practice that nourishes you.', 'Identify one area where you are over-functioning for someone else. Gently reduce it.'],
    7:  ['Take at least one full day of genuine rest and reflection this cycle — no agenda.', 'Read one book or pursue one topic that genuinely interests your inner life.', 'Journal three times this week about what you actually know versus what you have been told to think.'],
    8:  ['Make one significant ask this cycle — a raise, a partnership, an opportunity. Name what you want clearly.', 'Review your current results. Identify one bottleneck and clear it with focused effort.', 'Take one action that demonstrates genuine authority in your field or domain.'],
    9:  ['List three things you are completing this cycle. Commit to finishing them before the next one begins.', 'Release one digital, physical, or relational space that is holding energy in the past.', 'Identify one grudge or unresolved feeling. Take one step toward resolution.'],
    11: ['Keep a daily note of intuitive impressions for this entire cycle. Review at the end.', 'Share one inspired idea or creative work publicly this month.', 'Identify where you are withholding your perceptions out of self-doubt. Offer them once without qualification.'],
    22: ['Map the largest project or vision you are currently working on. Where is the next structural decision?', 'Find one person to mentor or support in a meaningful way this cycle.', 'Make one decision based on 10-year impact rather than immediate return.'],
  },
  personalMonth: {
    1:  ['Start something new this month — even one small, deliberate beginning.', 'Send the email. Make the call. Take the step you have been delaying.', 'Declare one intention for this month, out loud or in writing, before the first week ends.'],
    2:  ['Prioritise one relationship this month with genuine attentiveness.', 'Ask for what you need from one person instead of hoping they will guess.', 'In one key conversation, reflect back what you heard before responding.'],
    3:  ['Create something this month and share it with at least one person.', 'Have one conversation this month that is honest in a way you usually avoid.', 'Spend time with people who make you feel alive and expressive. Seek their company deliberately.'],
    4:  ['Choose one task that has been sitting on your list and complete it fully this month.', 'Improve one system in your daily life — a morning routine, a workspace, a workflow.', 'Do the practical work this month without requiring it to feel inspired.'],
    5:  ['Accept one unplanned change this month with curiosity instead of resistance.', 'Do one thing this month that is genuinely new to you — a place, a person, an experience.', 'When you feel the urge to control an outcome, practise releasing it and staying present instead.'],
    6:  ['Reach out to one person in your life who could use support. Show up for them.', 'Create one moment of genuine warmth or comfort for yourself or someone else.', 'Review your commitments. Are they expressions of love or obligations disguised as care?'],
    7:  ['Carve out three periods of genuine quiet this month — no input, just presence.', 'Write down what you actually think about one question you have been outsourcing to others.', 'Read or study one thing that genuinely interests you at depth.'],
    8:  ['Name one concrete result you want to produce this month. Take the most direct action toward it.', 'Ask for something you want with directness and without apology.', 'Eliminate one energy drain and invest that energy in something that builds.'],
    9:  ['Finish one thing this month that has been dragging. Complete it cleanly.', 'Let go of one expectation or outcome you have been holding too tightly.', 'Forgive one thing — a person, a circumstance, or yourself — and mean it.'],
    11: ['Pay close attention to what arrives quietly this month — impressions, ideas, coincidences.', 'Act on one intuitive signal without waiting to rationalise it fully.', 'Create or consume one piece of work that genuinely moves you. Let it in.'],
    22: ['Identify the most important structural project in your life. Do one thing to advance it this month.', 'Think at a larger scale than usual. Write down one vision that currently feels too big.', 'Find one person who could benefit from your strategic thinking and offer it to them.'],
  },
  personalDay: {
    1:  ['Do the one thing you have been putting off this morning, before anything else.', 'Introduce yourself, your idea, or your work to one new person today.', 'Make one decision today without seeking anyone\'s opinion first.'],
    2:  ['Reach out to one person today — not for a reason, just to connect.', 'Listen more than you speak in every conversation today. Notice what you learn.', 'Ask for help with something small today. Practise receiving.'],
    3:  ['Say something true and creative in one conversation today — don\'t self-censor.', 'Spend 20 minutes making something: writing, drawing, cooking, music.', 'Express appreciation to one person today in specific, genuine terms.'],
    4:  ['Work on your most important project for at least 30 uninterrupted minutes today.', 'Clear one small backlog: emails, messages, tasks. Get it done.', 'Tidy or organise one physical space today, however small. Ground the energy.'],
    5:  ['Take a different route, try a different approach, or change one element of your usual day.', 'Say yes to one spontaneous or unexpected invitation today.', 'When plans shift today, respond with curiosity rather than frustration.'],
    6:  ['Do one small act of care for someone in your life today — without being asked.', 'Take 10 minutes today to genuinely care for your own body: move, eat well, rest.', 'Check in with someone you haven\'t spoken to in a while.'],
    7:  ['Spend 15 minutes today in complete silence — no phone, no content, just your own mind.', 'Write down one thing you know but haven\'t said yet.', 'Avoid making any major decision today. Let today be for observing and gathering.'],
    8:  ['Make the most important ask or move of your week today — authority energy is high.', 'Do one thing today that demonstrates your capability in your domain.', 'Review what you are building. Is today\'s effort aligned with your actual goals?'],
    9:  ['Complete one thing today — fully, properly, without leaving loose ends.', 'Let go of one small grievance or irritation today. It is not worth the energy.', 'Do one generous act today with no expectation of return.'],
    11: ['Notice and record every intuitive impression that arrives today. Trust the quiet signals.', 'Speak one true perception today that you would normally keep to yourself.', 'Slow down twice today and ask: what is this moment actually asking of me?'],
    22: ['Focus on the largest, most structurally important task on your list today. Give it first priority.', 'Think beyond today. What you build right now can carry further than you expect.', 'Invest in one person today — with your attention, your feedback, or your genuine support.'],
  },
};
