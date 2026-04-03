/**
 * SOURCE CODE: LIFE â questObjectives.js
 * Quest objectives keyed by placement + root number.
 * Each placement (lp, cl, ex, so, ou, ac, th) has its own
 * objectives per root 1â9 and master numbers 11/22/33.
 * Multiple objectives per slot â system rotates through them.
 *
 * Also contains objectives for cycle quests:
 * personalDay, personalMonth, personalYear, fourMonthCycle, pinnacle.
 *
 * Structure:
 *   QUEST_OBJECTIVES[placement][root] = [ ...objectives ]
 *   CYCLE_OBJECTIVES[cycleType][root]  = [ ...objectives ]
 */

/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   LIFE FREQUENCY QUEST OBJECTIVES
   Placement-aware: LP 8 emphasises embodied authority;
   EX 8 emphasises how power moves through your expression;
   SO 8 emphasises what your soul truly hungers for beneath
   the drive for control.
   âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const QUEST_OBJECTIVES = {

  /* ââ LIFE PATH â the lesson you are here to learn ââ */
  lp: {
    1: [
      'Take the lead in one area of your life where you have been waiting for permission.',
      'Begin the project you have been circling. Start before it is ready.',
      'Make one significant decision this week using only your own authority â no consensus.',
      'Identify one space where you are following when your code says lead. Reverse it.',
    ],
    2: [
      'Build one genuine bridge between two people in your world who should know each other.',
      'In your next conflict, state the other person\'s position fully before defending your own.',
      'Speak your truth in one relationship where diplomatic silence has been keeping a false peace.',
      'Ask for what you need from someone today instead of waiting to be offered it.',
    ],
    3: [
      'Create something this week without showing it to anyone. Let it exist for itself.',
      'Say one completely honest thing in a conversation where the safe version was ready.',
      'Finish one creative project you have left incomplete. Completion is the practice.',
      'Express one opinion publicly that you have been keeping private out of fear of judgment.',
    ],
    4: [
      'Design one system for an area of your life currently running on improvisation.',
      'Show up to your most important work every day this week â inspired or not.',
      'Build something with your hands: cook, repair, assemble, craft. Ground the 4 energy physically.',
      'Complete one half-finished structure before starting anything new.',
    ],
    5: [
      'Spend 10 minutes daily in complete stillness â no content, no planning. Just this moment.',
      'When the urge to escape or avoid arises today, pause for two minutes and stay.',
      'Make one commitment you have been avoiding and stay fully present to keeping it.',
      'Say yes to one experience you have been indefinitely postponing.',
    ],
    6: [
      'Identify one way you are currently over-giving and renegotiate it this week.',
      'Let someone care for you today without immediately returning the gesture.',
      'Set one clear boundary with someone you have been over-accommodating.',
      'Design a daily self-care ritual that cannot be cancelled for other people. Hold it.',
    ],
    7: [
      'Spend 30 uninterrupted minutes in genuine solitude today â no input, no content.',
      'Act on one intuitive signal this week without seeking anyone\'s confirmation first.',
      'Share one piece of insight from your own direct experience, not from a book or teacher.',
      'Identify where analysis is being used to avoid a decision you already know to make.',
    ],
    8: [
      'Name the pattern that most consistently leaks your power. Observe it in operation today.',
      'Make one significant decision this week based purely on what is correct, not comfortable.',
      'Build one non-negotiable discipline this month â wake time, movement, or sustained practice.',
      'Use your authority today to genuinely empower someone rather than direct them.',
    ],
    9: [
      'Identify one relationship, project, or belief you are holding past its natural end. Begin releasing it.',
      'Practise forgiveness of one person or past version of yourself this week. Even just internally.',
      'Give something away you have been hoarding: time, knowledge, money, or attention.',
      'Complete one open cycle â formally, consciously, with gratitude for what it gave you.',
    ],
    11: [
      'Build a daily grounding ritual â movement, breath, or time in nature. Make it non-negotiable.',
      'Share one piece of channelled insight with someone who genuinely needs it this week.',
      'Notice where your sensitivity is causing you to withdraw. Step toward that discomfort once.',
      'Practice distinguishing your feelings from the feelings of those around you.',
    ],
    22: [
      'Write your largest vision for what you are building. Let the scale be uncomfortable.',
      'Identify one place where you are thinking small to avoid the weight of thinking large. Restore it.',
      'Delegate one task and invest the recovered time in your most important long-horizon project.',
      'Make one decision this week based on 10-year impact rather than immediate return.',
    ],
    33: [
      'Draw the line between compassion and martyrdom in your life right now. Where is it blurred?',
      'Teach something this week from direct experience â not from theory or secondhand knowledge.',
      'Receive care completely and gratefully this week. Let yourself be seen in your need.',
      'Create one thing intended purely to heal or comfort someone else.',
    ],
  },

  /* ââ LIFE CALLING â how you contribute and create impact ââ */
  cl: {
    1: [
      'Step into a leadership role in your field or community that you have been circling.',
      'Initiate one collaboration or project this week â you make the first move.',
      'Identify where your calling asks you to go first and where you have been waiting. Go first.',
      'Launch one idea from your calling this week, imperfect and early.',
    ],
    2: [
      'Your calling is amplified through partnership. Identify one person to build something with.',
      'Listen for what is needed in your community before deciding how to contribute this week.',
      'Bring two people together whose work or energy would benefit from connection.',
      'Find one place your calling asks you to support rather than lead. Show up fully there.',
    ],
    3: [
      'Share your work or ideas in a new format or channel you have not used before.',
      'Collaborate with someone whose style is different from yours. Let the contrast strengthen the work.',
      'Express one aspect of your calling publicly that you have been keeping internal.',
      'Create something this week that is in full service of your calling â without overthinking it.',
    ],
    4: [
      'Identify the structural foundation your calling requires right now. Begin laying it.',
      'Work on your most important calling-related project for a dedicated block each day this week.',
      'Build one repeatable system or process in your calling that does not require you to improvise.',
      'Review your commitments: which ones are aligned with your calling? Which ones are consuming it?',
    ],
    5: [
      'Your calling is asking for a pivot or expansion. Identify what that is and take one step toward it.',
      'Bring your calling into an unexpected context this week. Take it somewhere new.',
      'Release one structure in your calling that has become a constraint rather than a foundation.',
      'Say yes to one opportunity in your calling that involves genuine uncertainty.',
    ],
    6: [
      'Your calling serves others. Identify one person or group currently underserved by your contribution. Reach toward them.',
      'Ensure your calling work this week comes from genuine care, not obligation or performance.',
      'Create one environment, event, or offering in your calling that genuinely nourishes someone.',
      'Check: is your calling currently giving from overflow or from depletion? Adjust accordingly.',
    ],
    7: [
      'Spend one session this week in genuine inquiry about your calling â no outputs, just questions.',
      'Research or study one aspect of your calling that you have been taking for granted.',
      'Trust one piece of inner knowing about your calling direction this week without seeking external validation.',
      'What is your calling actually asking of you right now beneath the noise? Sit with that question.',
    ],
    8: [
      'Bring your full authority to your calling work this week. Do not soften, diminish, or hedge.',
      'Make one significant move in your calling this week â the ask, the offer, the decision.',
      'Identify where your calling is being undermined by your own ambivalence about your power. Address it.',
      'Use your calling to empower one other person this week. Give real power, not instruction.',
    ],
    9: [
      'Your calling is in service of something larger than yourself. Identify what that is clearly.',
      'Complete one calling-related cycle you have been dragging through. Close it with full presence.',
      'Release one aspect of your calling that belonged to a previous chapter. Let it complete.',
      'Give freely from your calling this week with zero expectation of return.',
    ],
    11: [
      'Your calling is to illuminate. Share one inspired insight in your field this week â channelled, not performed.',
      'Notice where your intuitive perceptions about your calling are being filtered by self-doubt. Offer one unfiltered.',
      'Ground your calling in practice this week â the vision is real but it needs a body to move through.',
      'Identify one place your calling is asking you to go ahead of others. Trust that.',
    ],
    22: [
      'Your calling is to build at scale. Identify the largest version of what you are building and orient today\'s work to it.',
      'Find one way to amplify your calling\'s reach â through partnership, platform, or structure.',
      'Make one decision in your calling based on generational impact rather than near-term return.',
      'Your calling requires legacy thinking. What will this work mean 20 years from now?',
    ],
    33: [
      'Your calling is to heal and teach. Identify one person whose growth you can genuinely serve this week.',
      'Create one piece of work in your calling that is designed entirely to uplift someone else.',
      'Ensure your calling is coming from wholeness this week, not sacrifice. Fill your cup first.',
      'Teach one thing from direct, lived experience. Not from what you have read â from what you know.',
    ],
  },

  /* ââ EXPRESSION â how you communicate and manifest outwardly ââ */
  ex: {
    1: [
      'Express one bold, original idea this week that you have been softening for the room.',
      'Introduce yourself first in one group or new context this week. Claim your presence.',
      'Share one creative or strategic vision publicly before it is fully formed.',
      'Speak up once this week in a situation where you would normally let someone else take the lead.',
    ],
    2: [
      'Express yourself in a way that genuinely connects today â not performs, connects.',
      'Write or speak something today that acknowledges someone else\'s perspective fully before offering your own.',
      'Find the most diplomatic way to say one honest thing you have been holding back.',
      'Collaborate in a creative or communicative project this week. Let the work be shared.',
    ],
    3: [
      'Publish or share one creative expression this week without waiting for it to be perfect.',
      'Say the most interesting true thing in every conversation today instead of the safest.',
      'Start a creative project you have been planning. Expression deferred is expression denied.',
      'Express appreciation or admiration for one person today in genuinely specific terms.',
    ],
    4: [
      'Structure your most important communication this week before you deliver it. Preparation is power.',
      'Express yourself with precision today â say exactly what you mean in as few words as needed.',
      'Build a consistent communication practice this week: write, record, or speak at the same time daily.',
      'Deliver one piece of work or communication that demonstrates your reliability and thoroughness.',
    ],
    5: [
      'Express yourself in a medium or format you have never used before this week.',
      'Take one communicative risk today â say the unexpected thing, take the unconventional angle.',
      'Bring curiosity rather than control to your expression today. Let it go somewhere new.',
      'Tell one story this week that is fully alive â not rehearsed, not safe.',
    ],
    6: [
      'Express care for someone today in words they will actually receive, not just words that feel true to you.',
      'Use your voice or creative expression this week in service of someone else\'s wellbeing.',
      'Express a boundary clearly and warmly today in a situation where you have been staying silent.',
      'Create one piece of communication this week that is intended purely to nurture.',
    ],
    7: [
      'Express one insight this week that you have arrived at through direct experience, not received wisdom.',
      'Write or speak something today that reflects what you actually know, not what you are supposed to say.',
      'Share one genuine question you are sitting with rather than pretending to have an answer.',
      'Express yourself slowly today â let each word carry actual weight.',
    ],
    8: [
      'Speak with full authority in one high-stakes conversation this week. Do not hedge or soften.',
      'Express your vision or position clearly and directly in a context where you have been equivocating.',
      'Use your communication today to open a door for someone â make an introduction, write a recommendation, offer a platform.',
      'Identify where your expression is leaking power through over-explanation. Say less, mean more.',
    ],
    9: [
      'Express something that completes a cycle: a thank you, an apology, a final word on something long open.',
      'Speak to someone this week in a way that helps them release something they have been carrying.',
      'Write or record one piece of expression this week that is in full service of something larger than yourself.',
      'Let your expression today be generous â give your best insight, your clearest thinking, your genuine warmth.',
    ],
    11: [
      'Express one intuitive perception this week without softening it with qualifications.',
      'Channel something today â let your expression come from a deeper place than your analytical mind.',
      'Share one transmission this week that you feel rather than think. Trust the feeling.',
      'Speak to the invisible reality in one conversation this week, not just the surface content.',
    ],
    22: [
      'Express the full scale of your vision this week without diminishing it for the audience.',
      'Communicate your most important strategic idea to one person who has the capacity to help build it.',
      'Write or speak about what you are building in terms of its 10-year impact, not its current status.',
      'Find the most structurally elegant way to express a complex idea this week.',
    ],
    33: [
      'Express one deeply felt truth this week that has the power to help someone heal.',
      'Create something this week through your expression that is designed to last â something teaching-quality.',
      'Let your expression today be a gift with nothing attached. No credit needed.',
      'Speak from love in one conversation where judgment or frustration would have been the default.',
    ],
  },

  /* ââ SOUL â your deepest authentic desire and inner drive ââ */
  so: {
    1: [
      'Your soul craves genuine autonomy. Identify one area where you are still seeking permission and withdraw it.',
      'Do one thing today that is completely, authentically yours â no audience, no approval.',
      'Your soul needs you to lead your own life. Where are you following a script someone else wrote?',
      'Take one action today that your soul has been waiting for your personality to catch up with.',
    ],
    2: [
      'Your soul craves deep connection. Reach out to one person today with full presence â no agenda.',
      'What relationship is your soul currently invested in? Give it genuine attention this week.',
      'Your soul finds peace in harmony. Identify one internal conflict that needs honest resolution.',
      'Let yourself be genuinely moved by someone today. Allow the connection to land.',
    ],
    3: [
      'Your soul craves authentic expression. Create one thing today purely for the joy of making it.',
      'Say one thing today that your soul has been wanting to express and your mind has been editing out.',
      'What does your soul genuinely want to communicate right now? Give it a channel.',
      'Your soul is fed by creativity. Spend 20 minutes making something with no purpose beyond expression.',
    ],
    4: [
      'Your soul craves stability and meaningful work. Identify what you are genuinely building and tend to it today.',
      'What does your soul need to feel secure right now? Take one practical step to provide that.',
      'Your soul is nourished by doing real, tangible work. Put in undivided effort on something that matters today.',
      'Build one thing this week â physical, creative, or structural â that your soul can feel proud of.',
    ],
    5: [
      'Your soul craves freedom through presence, not escape. Find the freedom available right here, right now.',
      'What is your soul actually curious about right now? Follow that thread for 30 minutes today.',
      'Your soul is not restless â it is alive. Let that aliveness express itself in one concrete way today.',
      'Say yes to one experience today that your soul is drawn to and your habit-mind is avoiding.',
    ],
    6: [
      'Your soul craves to love and be loved without conditions. Let someone in more fully today.',
      'What does your soul need to feel cared for right now? Provide it for yourself today.',
      'Your soul is nourished by beauty and belonging. Create one moment of genuine warmth today.',
      'Identify where you are giving from soul versus giving from obligation. Let only the former guide you today.',
    ],
    7: [
      'Your soul craves depth and inner knowing. Spend 20 minutes today in undistracted stillness.',
      'What does your soul actually know that your mind has been overriding? Listen for it today.',
      'Your soul is fed by truth-seeking. Ask one question today that you genuinely do not yet know the answer to.',
      'Trust one quiet inner perception today without explaining it away.',
    ],
    8: [
      'Your soul craves genuine power â not control, but mastery. Identify one discipline to deepen this week.',
      'What is your soul\'s actual ambition â beneath the approved version? Acknowledge it clearly.',
      'Your soul is fed by integrity. Identify one place where your actions and your deepest values are not aligned.',
      'Do one thing today from a place of genuine inner authority, not external pressure.',
    ],
    9: [
      'Your soul craves completion and universal love. Identify one cycle ready to close and help it finish.',
      'What is your soul ready to release that your personality is still gripping? Take one step toward letting go.',
      'Your soul is nourished by service. Do something generous today with no return expected.',
      'Practise seeing the larger pattern in one situation that has been frustrating you today.',
    ],
    11: [
      'Your soul craves illumination and transmission. What are you receiving right now that wants to be given?',
      'Ground your soul\'s sensitivity today â move your body, spend time in nature, breathe consciously.',
      'Your soul\'s knowing is accurate. Trust one perception today that your mind wants to dismiss.',
      'Identify what your soul most needs to feel safe right now. Provide it with care.',
    ],
    22: [
      'Your soul craves building something that matters beyond your lifetime. Tend to that work today.',
      'What is your soul\'s vision for your life at full scale? Write it down without editing.',
      'Your soul is nourished by meaningful impact. Identify one action today that serves your largest purpose.',
      'Let your soul\'s ambition be as large as it actually is. Stop making it smaller.',
    ],
    33: [
      'Your soul craves to heal and uplift. Do one thing today specifically intended to lighten someone\'s load.',
      'Your soul is fed by giving from wholeness. Fill your cup first today before offering anything to anyone.',
      'What does your soul most want to teach right now? Find one way to express it this week.',
      'Let yourself receive care today with genuine openness. Your soul needs that too.',
    ],
  },

  /* ââ OUTER SELF â how others first perceive and experience you ââ */
  ou: {
    1: [
      'Others experience you as a pioneer. Step into one room this week as if that is simply true.',
      'Your outer presence signals leadership. Use it deliberately in one situation this week.',
      'Arrive first, speak first, act first in one context today. Embody the 1 frequency visibly.',
      'Let your outer confidence invite rather than intimidate today. Lead with warmth and direction.',
    ],
    2: [
      'Others experience you as a mediator and connector. Use that gift deliberately in one situation today.',
      'Your outer presence creates safety for others. Show up fully present in your most important interaction today.',
      'Be the calm in one situation today where others are reactive. Your outer 2 is a resource.',
      'Let your natural attentiveness be your most visible quality in one interaction this week.',
    ],
    3: [
      'Others experience you as vibrant and expressive. Let that be genuine rather than performed today.',
      'Your outer presence lights up rooms. Bring that energy to one interaction that needs it.',
      'Let your natural creativity be visible in one exchange today â in how you speak, create, or connect.',
      'Smile with intent today. Your outer warmth is a real contribution to people around you.',
    ],
    4: [
      'Others experience you as reliable and grounded. Honour that today by being completely trustworthy in one commitment.',
      'Your outer presence signals stability. Be the steadiest person in the room in one situation this week.',
      'Let your thoroughness be visible today â do one thing with complete care and attention to detail.',
      'Your outer 4 builds trust over time. Identify one relationship where consistent reliability is the gift needed.',
    ],
    5: [
      'Others experience you as dynamic and engaging. Bring your most alive, present self to one interaction today.',
      'Your outer presence invites others to loosen up. Use that gift consciously in one situation this week.',
      'Let your natural adaptability be visible â navigate one unexpected change today with visible ease.',
      'Your outer energy is energising to others. Bring it fully to your most important interaction today.',
    ],
    6: [
      'Others experience you as warm and caring. Let that be real today, not just behavioural.',
      'Your outer presence creates a feeling of being seen. Give that gift fully to one person today.',
      'Be the person who makes the space feel safer in one situation today. Your outer 6 does this naturally.',
      'Let your genuine care be visible in one small, specific act today. Not grand â precise.',
    ],
    7: [
      'Others experience you as deep and considered. Honour that with real thoughtfulness in one exchange today.',
      'Your outer presence signals trustworthiness through depth. Let people see that you have actually thought.',
      'Speak with genuine precision today â fewer words, each one chosen.',
      'Your outer 7 creates a sense of mystery and depth. Let your silence speak as clearly as your words.',
    ],
    8: [
      'Others experience you as powerful and authoritative. Step into that today without apology.',
      'Your outer presence signals competence. Demonstrate it concretely in one high-stakes situation this week.',
      'Let your authority be felt in one interaction today â not through force, through unshakeable clarity.',
      'Your outer 8 opens doors. Walk through one of them this week that you have been standing outside of.',
    ],
    9: [
      'Others experience you as wise and compassionate. Offer that wisdom generously in one situation today.',
      'Your outer presence contains others. Be the most spacious person in the room in one interaction today.',
      'Let your genuine acceptance of people be visible today. Someone near you needs to feel that.',
      'Your outer 9 signals completion and perspective. Bring that energy to one situation needing resolution.',
    ],
    11: [
      'Others experience you as intuitive and illuminating. Share one perception today that others haven\'t voiced.',
      'Your outer presence carries unusual frequency. Ground it today so it is felt as warmth, not intensity.',
      'Let your sensitivity be a visible gift in one interaction today â notice what others miss.',
      'Your outer 11 can inspire. Bring one genuinely inspired thought into one conversation this week.',
    ],
    22: [
      'Others experience you as visionary and structurally powerful. Let that be evident in one interaction today.',
      'Your outer presence signals that big things are possible. Confirm that perception in one situation this week.',
      'Let your strategic thinking be visible and useful to one person today.',
      'Your outer 22 builds confidence in others. Be the person who makes the vision feel real today.',
    ],
    33: [
      'Others experience you as healing and deeply caring. Let that be unconditional in one interaction today.',
      'Your outer presence creates space for people to be seen. Offer that to one person who needs it.',
      'Let your compassion be precise today â not general warmth, but attunement to what one specific person needs.',
      'Your outer 33 can shift rooms. Show up with full love in one difficult or tense situation today.',
    ],
  },

  /* ââ ACHIEVEMENT â what you are here to accomplish ââ */
  ac: {
    1: [
      'Your achievement frequency calls you to initiate. What is the one thing you are here to start that hasn\'t started yet?',
      'Make one move this week toward your most important goal that requires no one\'s permission.',
      'Your greatest achievements begin alone. Identify the solo step that needs to happen this week.',
      'Take the first action on the project your achievement frequency is pointing at. Not the plan â the action.',
    ],
    2: [
      'Your achievement is amplified through partnership. Identify one alliance that would accelerate your most important work.',
      'What collective goal are you positioned to help achieve right now? Step fully into that role.',
      'Your achievement frequency is cooperative, not competitive. Where can you build something greater together?',
      'Reach out to one person this week whose skills complement yours. Your achievement needs this connection.',
    ],
    3: [
      'Your achievement comes through creative expression and communication. Create or communicate something today that advances it.',
      'What is the creative output your achievement frequency is calling for right now? Begin it.',
      'Your greatest achievement is leaving something expressive in the world. What wants to be made?',
      'Share work in progress this week. Your achievement frequency rewards visibility over perfection.',
    ],
    4: [
      'Your achievement is built through sustained, disciplined effort. Work on your most important project every day this week.',
      'Identify the foundational work your achievement requires. Do the unglamorous part today.',
      'Build one system that advances your most important achievement goal without requiring daily decisions.',
      'Your greatest achievements are the result of patience and precision. Slow down and do this right.',
    ],
    5: [
      'Your achievement thrives on versatility and adaptability. Where is a pivot needed right now?',
      'What opportunity in your achievement path requires a yes before you are fully ready? Say yes.',
      'Your achievement frequency needs movement. Take one concrete step today even if direction is not yet perfect.',
      'Bring your achievement into one new context or channel this week. Expand the reach.',
    ],
    6: [
      'Your achievement is in service of others. Identify who benefits most from your work and orient toward them.',
      'What can you accomplish this week that would make a genuine difference to someone who needs it?',
      'Your achievement frequency is relational. Invest in one key relationship that your work depends on.',
      'Create one thing this week in your domain of achievement that is designed to genuinely help.',
    ],
    7: [
      'Your achievement requires mastery through depth. Invest in one skill or area of knowledge this week.',
      'What do you need to learn, understand, or master to advance your most important achievement? Begin that.',
      'Your achievement is built on inner authority. Spend time this week deepening your expertise alone.',
      'Trust your own assessment of the next step in your achievement path. Stop seeking external confirmation.',
    ],
    8: [
      'Your achievement frequency is aligned with significant accomplishment. Raise the bar on one goal this week.',
      'Make one bold move toward your most important achievement this week. The 8 rewards decisive action.',
      'Your achievement requires you to claim your power fully. Where are you still playing small?',
      'Identify your most significant achievement goal and make the single most direct move toward it today.',
    ],
    9: [
      'Your achievement is in service of something larger than personal success. What is that larger purpose?',
      'Complete one achievement-level goal or project that has been left open. Close it properly.',
      'Give away one piece of your best work, knowledge, or insight this week with no return expected.',
      'Your achievement frequency calls for completion before new beginnings. What needs to finish first?',
    ],
    11: [
      'Your achievement is to inspire and illuminate. What insight or vision are you here to bring into the world?',
      'Share one inspired idea this week that your achievement frequency is pointing toward.',
      'Your greatest achievement may be what you transmit to others. What are you passing forward?',
      'Ground your vision in one practical step this week. Achievement requires both inspiration and action.',
    ],
    22: [
      'Your achievement frequency calls for building at a scale that outlasts you. What are you building today toward that?',
      'Identify the most structurally important action in your most important achievement goal. Do it this week.',
      'Your achievement needs a 10-year frame. Define what success looks like at that horizon.',
      'Find one way to leverage your work so it extends beyond your direct effort. Build for scale.',
    ],
    33: [
      'Your achievement is to heal and teach at scale. What is one way to bring that forward this week?',
      'Create one piece of work in your achievement domain that could help someone you will never meet.',
      'Your greatest achievement is being a clear channel for healing. Tend to your own wholeness first.',
      'Teach from your deepest experience this week. That is where your achievement frequency lives.',
    ],
  },

  /* ââ THEME â the overarching energy of your birth year ââ */
  th: {
    1: [
      'Your life theme is new beginnings. Where in your life is something genuinely starting? Give it your full attention.',
      'Your theme calls you to be the one who initiates. What has been waiting for you to go first?',
      'The 1 theme asks: are you living your own life or someone else\'s version of it? Take one step toward your own.',
      'Your theme is originality. Do one thing today that could only have come from you.',
    ],
    2: [
      'Your life theme is cooperation and sensitivity. Where are you being called to partner more deeply right now?',
      'Your theme asks you to trust that patience is productive. Rest in the collaborative process today.',
      'The 2 theme is relationship. Identify the most important relationship in your current chapter and invest in it.',
      'Your theme is attunement. What is the subtlest thing happening in your environment right now? Pay attention to it.',
    ],
    3: [
      'Your life theme is creative expression. What wants to be made by you that only you can make?',
      'Your theme calls you to communicate authentically. What truth have you been softening that wants to be spoken?',
      'The 3 theme is joy and expression. When did you last do something purely for the pleasure of doing it?',
      'Your theme is creativity. Create something today â not for outcome, for expression.',
    ],
    4: [
      'Your life theme is foundation building. What are you constructing right now that will still be standing in 10 years?',
      'Your theme calls for discipline and consistency. Identify the one daily practice that, if held, transforms everything.',
      'The 4 theme is patience and permanence. Are you building something real, or accumulating the appearance of building?',
      'Your theme is structure. Design or refine one system in your life that removes the need for daily decisions.',
    ],
    5: [
      'Your life theme is freedom and presence. Where are you still chasing the idea of freedom instead of inhabiting it?',
      'Your theme calls for adaptability. What change is arriving in your life that you are trying to manage instead of embrace?',
      'The 5 theme is aliveness. What makes you feel most fully alive? Do more of that deliberately.',
      'Your theme is versatility. What have you been treating as fixed that is actually movable?',
    ],
    6: [
      'Your life theme is love and responsibility. Where are you called to care more deeply right now?',
      'Your theme asks: are you giving from love or from fear? Check your motivations in your most important commitments.',
      'The 6 theme is beauty and belonging. Create one moment of genuine beauty in your daily environment today.',
      'Your theme is service with boundaries. Where is your care sustainable, and where is it costing you too much?',
    ],
    7: [
      'Your life theme is truth and inner wisdom. What do you know that you have not yet fully trusted?',
      'Your theme calls you inward. Spend time this week in genuine solitude without agenda.',
      'The 7 theme is depth over breadth. Where are you spreading yourself thin when mastery is what is needed?',
      'Your theme is spiritual intelligence. What is the deeper meaning in the pattern you are currently living through?',
    ],
    8: [
      'Your life theme is power and mastery. Where in your life are you still giving your power away?',
      'Your theme calls for material engagement. Your spirituality includes your finances, your body, your results.',
      'The 8 theme is abundance through integrity. Where are power and integrity currently misaligned in your life?',
      'Your theme is authority. In one domain of your life, step fully into the authority you actually carry.',
    ],
    9: [
      'Your life theme is completion and service. What cycle in your life is at its natural end right now?',
      'Your theme calls for generosity and release. Give something away this week that someone else needs more than you.',
      'The 9 theme is wisdom through experience. What is the deepest lesson from your life so far that you are being asked to share?',
      'Your theme is universal love. Practice seeing one difficult person or situation through the lens of compassion today.',
    ],
    11: [
      'Your life theme is illumination and mastery. What insight are you carrying that the world needs to hear?',
      'Your theme calls for grounded inspiration. Ensure your vision is connected to daily, embodied practice.',
      'The 11 theme is the bridge between worlds. Where are you translating higher understanding into practical guidance for others?',
      'Your theme is sensitivity as a superpower. What are you perceiving that others are not yet seeing?',
    ],
    22: [
      'Your life theme is master building. What are you building that could outlast you? Work on it today.',
      'Your theme calls for vision at scale. Stop making your vision small enough to be comfortable.',
      'The 22 theme is structure and legacy. What foundational work are you doing right now that will matter in 20 years?',
      'Your theme is practical idealism. Take the grandest vision you carry and make one tangible move toward it today.',
    ],
    33: [
      'Your life theme is compassionate mastery. Are you serving from genuine love or from a need to be needed?',
      'Your theme calls for healing through presence. Simply being fully yourself is often the most powerful thing you can offer.',
      'The 33 theme is the master teacher. What is the most important thing you know that you are not yet teaching?',
      'Your theme is love as a structural force. Bring unconditional positive regard to one difficult relationship this week.',
    ],
  },
};

/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   CYCLE QUEST OBJECTIVES
   For personal day/month/year, 4-month cycles, pinnacles.
   These are the same for everyone with that root number
   but separate from the frequency descriptions in data.js.
   Multiple objectives per root â system rotates through them.
   âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const CYCLE_OBJECTIVES = {

  personalDay: {
    1:  [
      'Do the one thing you have been putting off â before anything else today.',
      'Introduce yourself, your idea, or your work to one new person today.',
      'Make one decision today without seeking anyone\'s opinion first.',
      'Take the first step on something that has been waiting for the right moment. Today is it.',
    ],
    2:  [
      'Reach out to one person today â not for a reason, just to genuinely connect.',
      'Listen more than you speak in every conversation today. Notice what you actually hear.',
      'Ask for help with something small today. Practise receiving.',
      'Reflect back what someone says to you before responding. Do this in every conversation.',
    ],
    3:  [
      'Say something true and creative in one conversation today â don\'t self-censor.',
      'Spend 20 minutes making something: writing, drawing, cooking, music. No purpose but expression.',
      'Express appreciation to one person today in specific, genuine, unrepeated terms.',
      'Share something you have made or thought with one person today. Don\'t wait until it\'s finished.',
    ],
    4:  [
      'Work on your most important project for 30 uninterrupted minutes today.',
      'Clear one small backlog: emails, messages, tasks. Get one thing completely done.',
      'Tidy or organise one physical space today, however small. Ground the frequency.',
      'Do the structural work that needs doing â the part that is unglamorous and necessary.',
    ],
    5:  [
      'Take a different route, try a different approach, or change one element of your usual day.',
      'Say yes to one spontaneous or unexpected invitation today.',
      'When plans shift today, respond with curiosity rather than frustration.',
      'Follow one impulse today that your habit-mind is trying to plan away.',
    ],
    6:  [
      'Do one small act of genuine care for someone in your life today â without being asked.',
      'Take 10 minutes to care for your own body today: move, eat well, rest consciously.',
      'Check in with someone you haven\'t spoken to in a while. Just to see how they are.',
      'Make one moment of beauty or warmth in your environment or someone else\'s today.',
    ],
    7:  [
      'Spend 15 minutes today in complete silence â no phone, no content, just your own mind.',
      'Write down one thing you know but haven\'t said yet.',
      'Avoid making any major decision today. Let today be for observing and gathering.',
      'Ask one question today you genuinely don\'t know the answer to. Sit with not knowing.',
    ],
    8:  [
      'Make the most important ask or move of your week today â authority energy is high.',
      'Do one thing today that demonstrates your capability in your domain.',
      'Review what you are building. Is today\'s effort aligned with your actual goals?',
      'Make one decision from your own authority today. Trust your assessment.',
    ],
    9:  [
      'Complete one thing today â fully, properly, without leaving loose ends.',
      'Let go of one small grievance or irritation today. It is not worth the energy it costs.',
      'Do one generous act today with no expectation of return.',
      'Identify something that has already completed and release it consciously today.',
    ],
    11: [
      'Notice and record every intuitive impression that arrives today. Trust the quiet signals.',
      'Speak one true perception today that you would normally keep to yourself.',
      'Slow down twice today and ask: what is this moment actually asking of me?',
      'Ground yourself before any significant interaction today. Your channel is wide open.',
    ],
    22: [
      'Focus on the largest, most structurally important task on your list today. Give it first priority.',
      'Think beyond today. What you build right now can carry further than you expect.',
      'Invest in one person today â with your attention, your feedback, or your genuine support.',
      'Identify the most leveraged action available to you today and take it.',
    ],
  },

  personalMonth: {
    1:  [
      'Declare one intention for this month out loud or in writing before the first week ends.',
      'Start something new this month â even one small, deliberate beginning.',
      'Send the email. Make the call. Take the step you have been delaying for a month.',
      'Identify the single most important thing to initiate this month. Begin it today.',
    ],
    2:  [
      'Prioritise one relationship this month with genuine, consistent attentiveness.',
      'Ask for what you need from one person instead of hoping they will guess.',
      'In one key conversation this month, reflect back what you heard before responding.',
      'Build one bridge between two people or parts of your life that need connecting.',
    ],
    3:  [
      'Create something this month and share it with at least one person.',
      'Have one conversation this month that is honest in a way you usually avoid.',
      'Spend time with people who make you feel alive and expressive. Seek their company.',
      'Express yourself in a new medium or format this month.',
    ],
    4:  [
      'Choose one task that has been sitting on your list and complete it fully this month.',
      'Improve one system in your daily life â a routine, a workspace, a process.',
      'Do the practical work this month without requiring it to feel inspired.',
      'Identify the foundational work needed this month and show up for it every day.',
    ],
    5:  [
      'Accept one unplanned change this month with curiosity instead of resistance.',
      'Do one thing this month that is genuinely new to you â a place, a person, an experience.',
      'When you feel the urge to control an outcome this month, practise releasing it instead.',
      'Follow one thread of genuine interest or curiosity this month to see where it leads.',
    ],
    6:  [
      'Reach out to one person in your life who could use support this month. Show up for them.',
      'Create one moment of genuine warmth or comfort for yourself or someone else.',
      'Review your commitments. Are they expressions of love or obligations disguised as care?',
      'Design one nourishing ritual for yourself this month and protect it from cancellation.',
    ],
    7:  [
      'Carve out three periods of genuine quiet this month â no input, just presence.',
      'Write down what you actually think about one question you have been outsourcing to others.',
      'Read or study one thing that genuinely interests you at depth this month.',
      'Take one full day of rest and reflection this month with no agenda.',
    ],
    8:  [
      'Name one concrete result you want to produce this month. Take the most direct action toward it.',
      'Ask for something you want with directness and without apology this month.',
      'Eliminate one energy drain and invest that energy in something that builds.',
      'Make one significant move toward your most important goal this month.',
    ],
    9:  [
      'Finish one thing this month that has been dragging. Complete it cleanly.',
      'Let go of one expectation or outcome you have been holding too tightly.',
      'Forgive one thing â a person, a circumstance, or yourself â and mean it.',
      'Identify three open cycles this month. Commit to closing them before the month ends.',
    ],
    11: [
      'Pay close attention to what arrives quietly this month â impressions, ideas, coincidences.',
      'Act on one intuitive signal without waiting to rationalise it fully.',
      'Create or consume one piece of work that genuinely moves you. Let it in.',
      'Ground your heightened sensitivity this month through a consistent daily physical practice.',
    ],
    22: [
      'Identify the most important structural project in your life. Do one thing to advance it this month.',
      'Think at a larger scale than usual. Write down one vision that currently feels too big.',
      'Find one person who could benefit from your strategic thinking and offer it to them.',
      'Make one decision this month based on 10-year impact rather than near-term return.',
    ],
  },

  personalYear: {
    1:  [
      'Identify the single most important thing to initiate this year. Plant that seed before the first month ends.',
      'Declare one area of your life where you are now leading rather than following.',
      'Release one identity or role that belongs to a previous cycle. Let this year be genuinely new.',
      'Write down what you are beginning this year. The simulation rewards deliberate planting.',
    ],
    2:  [
      'Identify the most important relationship in this year\'s chapter. Invest in it consistently.',
      'Practise asking for what you need instead of waiting to be offered it.',
      'Find one place where cooperation would move things faster than solo effort. Choose it deliberately.',
      'Resist forcing outcomes this year. Identify one area asking for patience and honour it.',
    ],
    3:  [
      'Identify your primary creative channel this year and commit to expressing through it weekly.',
      'Say something bold and true in one public context this month. Build that practice.',
      'Collaborate with one person whose work amplifies yours. Initiate that connection.',
      'Complete one creative project that has been waiting for this expressive year to carry it through.',
    ],
    4:  [
      'Design the structural foundation your most important goal requires. Map it this week.',
      'Identify the one daily discipline that, if held this year, changes everything. Begin it.',
      'Build something this year that will still be standing in ten years. Work on it today.',
      'Clear the backlog â every incomplete project consuming energy. Decide: complete or release.',
    ],
    5:  [
      'Identify what this year is asking you to change, adapt, or release. Move toward it.',
      'Accept one significant disruption this year as an invitation rather than a problem.',
      'What freedom is available to you this year that wasn\'t available before? Claim it.',
      'Say yes to one major opportunity this year that requires stepping into genuine uncertainty.',
    ],
    6:  [
      'Identify your most important relationships and commitments this year. Deepen your investment in them.',
      'Create one environment or offering this year that genuinely serves those in your field.',
      'Set one significant boundary this year with something or someone that has been draining you.',
      'Your service this year becomes sacred. Identify what you are here to offer and offer it fully.',
    ],
    7:  [
      'Commit to a consistent inner practice this year â meditation, journaling, solitude. Non-negotiable.',
      'Study one area deeply this year. Master something rather than surveying many things.',
      'Identify the question your inner life is most asking this year. Pursue its answer.',
      'Trust your own knowing more than external consensus this year. Track where that takes you.',
    ],
    8:  [
      'Identify the most significant material or professional achievement available to you this year. Pursue it.',
      'Raise your standard in one important domain of your life this year. Decide what that means.',
      'Claim one form of authority or recognition this year that you have been underselling yourself for.',
      'Build one asset this year â financial, relational, reputational â that compounds beyond this cycle.',
    ],
    9:  [
      'Identify three major cycles in your life that are completing this year. Help them end well.',
      'Release one belief, relationship, or identity that belonged to a previous chapter.',
      'Find one way to serve something larger than yourself this year. Commit to it.',
      'Do not start new major cycles this year. Complete what is completing. Trust the clearing.',
    ],
    11: [
      'Commit to a grounding practice this year to match the amplified sensitivity you are carrying.',
      'Identify the illumination this master year is asking you to bring forward. Begin that work.',
      'Share inspired insight publicly this year â don\'t keep your perceptions private.',
      'Your intuition is operating at unusual depth this year. Trust it consistently, not selectively.',
    ],
    22: [
      'Identify the generational-scale project this master year is asking you to build or advance.',
      'Think beyond your lifetime in one major decision this year.',
      'Find one strategic partnership this year that amplifies the scale of what you are building.',
      'Invest in legacy this year â in people, in systems, in work that will outlast this chapter.',
    ],
  },

  fourMonthCycle: {
    1:  [
      'Launch or restart one project this cycle. Begin before you are ready.',
      'Introduce yourself or your work to one new person or audience this cycle.',
      'Clear one old commitment blocking the space needed for what is beginning.',
      'Take one initiating action in your most important domain before this cycle ends.',
    ],
    2:  [
      'Resist forcing a result this cycle. Choose cooperation over competition in one key area.',
      'Reach out to one person you have been meaning to connect with. Build the bridge.',
      'Listen more than you speak in your most important conversations this cycle.',
      'Tend one important relationship with consistent attentiveness through this entire cycle.',
    ],
    3:  [
      'Publish, share, or express something every week of this cycle â don\'t wait until it\'s perfect.',
      'Organise or attend one gathering, collaboration, or creative exchange.',
      'Say the thing you have been holding back in one important relationship or context.',
      'Complete one creative project this cycle. Finish it, share it, let it land.',
    ],
    4:  [
      'Identify the most important structural task this cycle. Work on it every day.',
      'Clear physical and digital clutter from one environment. Prepare your space for what comes next.',
      'Review your finances, calendar, and commitments. Align them with your actual priorities.',
      'Build one system this cycle that removes the need for daily willpower in one area of your life.',
    ],
    5:  [
      'Accept one invitation or opportunity you would normally decline due to uncertainty.',
      'Travel, change your routine, or expose yourself to a different environment this cycle.',
      'When something unexpected arrives this cycle, ask what it is opening before asking how to manage it.',
      'Follow one spontaneous thread of interest or opportunity this cycle to see where it leads.',
    ],
    6:  [
      'Schedule quality time with one person who matters and give them your full presence.',
      'Create or restore one home environment or daily practice that nourishes you.',
      'Identify one area where you are over-functioning for someone else. Gently reduce it this cycle.',
      'Do one act of genuine care every day of this cycle â for yourself or someone else.',
    ],
    7:  [
      'Take at least one full day of genuine rest and reflection this cycle â no agenda.',
      'Read one book or pursue one topic that genuinely interests your inner life.',
      'Journal three times this week about what you actually know versus what you have been told.',
      'Spend time daily in undistracted solitude through this cycle. Let something surface.',
    ],
    8:  [
      'Make one significant ask this cycle â a raise, a partnership, an opportunity.',
      'Review your current results. Identify one bottleneck and clear it with focused effort.',
      'Take one action that demonstrates genuine authority in your field or domain.',
      'Raise the bar on one achievement goal this cycle and take the most direct action toward it.',
    ],
    9:  [
      'List three things completing this cycle. Commit to finishing them before the next one begins.',
      'Release one digital, physical, or relational space holding energy in the past.',
      'Identify one grudge or unresolved feeling. Take one step toward resolution this cycle.',
      'Complete one open cycle with full presence and gratitude before this period closes.',
    ],
    11: [
      'Keep a daily note of intuitive impressions for this entire cycle. Review at the end.',
      'Share one inspired idea or creative work publicly this cycle.',
      'Identify where you are withholding your perceptions out of self-doubt. Offer one unfiltered.',
      'Ground your expanded sensitivity through a daily physical practice through this entire cycle.',
    ],
    22: [
      'Map the largest project or vision you are currently working on. Where is the next structural decision?',
      'Find one person to mentor or support in a meaningful way this cycle.',
      'Make one decision based on 10-year impact rather than immediate return.',
      'Build one thing this cycle that extends beyond your direct effort â a system, a framework, a platform.',
    ],
  },

  pinnacle: {
    1:  [
      'Your pinnacle asks for independence and self-leadership. Where are you still deferring when you should be deciding?',
      'Identify the pioneering work this chapter of your life is calling for. Begin it.',
      'Your pinnacle is a long arc of developing genuine self-reliance. What does that require right now?',
    ],
    2:  [
      'Your pinnacle is developing emotional intelligence and relational mastery. Where is that work most alive right now?',
      'Practise patience as a strategic skill in your most important current situation.',
      'Your pinnacle asks you to find strength in receptivity. Where are you forcing when you should be allowing?',
    ],
    3:  [
      'Your pinnacle is a chapter of creative expression and communication. What wants to be expressed through you in this era?',
      'Suppress nothing that wants authentic expression in this pinnacle. That is the only mistake available.',
      'Your pinnacle calls for joyful collaboration and creative output. What project or relationship embodies that now?',
    ],
    4:  [
      'Your pinnacle is demanding sustained effort and disciplined construction. What are you building that will outlast this chapter?',
      'The work of your pinnacle is unglamorous and necessary. Show up for it today.',
      'Your pinnacle is forging character through consistent, patient building. What does that look like right now?',
    ],
    5:  [
      'Your pinnacle is defined by adaptability and the mastery of change. What change is currently asking you to go deeper?',
      'Every disruption in this pinnacle carries an invitation. What is the current disruption opening?',
      'Your pinnacle calls for presence over planning. Where are you trying to manage what wants to move?',
    ],
    6:  [
      'Your pinnacle asks for love with boundaries â giving sustainably, not until there is nothing left.',
      'Who in your life most needs your full, boundaried presence right now? Show up for them.',
      'Your pinnacle is a chapter of deepening commitment. What commitment is asking for your fullest expression?',
    ],
    7:  [
      'Your pinnacle rewards those who go quiet and develop inner authority. The answers are available inside.',
      'Invest in the inner work your pinnacle is asking for. This is a chapter for depth, not breadth.',
      'What question is your current pinnacle most asking you to sit with? Spend time with it today.',
    ],
    8:  [
      'Your pinnacle activates the drive for achievement and the proper use of authority. Step into that.',
      'The lesson of your 8 pinnacle is self-mastery before material mastery. Work on both.',
      'Make one significant move in your domain of achievement this week. Your pinnacle supports bold action.',
    ],
    9:  [
      'Your pinnacle expands your purpose beyond the personal. Identify the impersonal service you are called to right now.',
      'What needs to be released in this pinnacle to make space for what comes next?',
      'Your pinnacle asks you to let go of what is small and serve what is vast. What does that mean right now?',
    ],
    11: [
      'Your master pinnacle brings extraordinary sensitivity and intuitive power. Ground yourself daily.',
      'The spiritual insight available in this pinnacle is real and significant. Pay attention to what arrives.',
      'Your 11 pinnacle can deliver capacity to inspire at scale. What are you being asked to illuminate?',
    ],
    22: [
      'Your master pinnacle carries the potential to manifest vision at a generational scale. What are you building?',
      'The demand of your 22 pinnacle is enormous. The reward is building something that outlives you. Stay in it.',
      'Your pinnacle asks: what will this work mean to people who are not yet born? Let that guide today\'s decisions.',
    ],
  },
};

/**
 * Get objectives for a given placement and root number.
 * Returns the objectives array, or empty array if not found.
 * @param {string} placement - 'lp','cl','ex','so','ou','ac','th'
 * @param {number} root - 1â9, 11, 22, 33
 */
function getPlacementObjectives(placement, root) {
  return (QUEST_OBJECTIVES[placement] && QUEST_OBJECTIVES[placement][root]) || [];
}

/**
 * Get objectives for a cycle quest type and root number.
 * @param {string} cycleType - 'personalDay','personalMonth','personalYear','fourMonthCycle','pinnacle'
 * @param {number} root
 */
function getCycleObjectives(cycleType, root) {
  return (CYCLE_OBJECTIVES[cycleType] && CYCLE_OBJECTIVES[cycleType][root]) || [];
}

/**
 * Pick one objective from an array, rotating by a seed value.
 * Same seed = same pick. Change seed to advance the rotation.
 * @param {Array} objs
 * @param {number} seed - e.g. day-of-year, week-of-year
 */
function pickObjective(objs, seed) {
  if (!objs || !objs.length) return '';
  return objs[seed % objs.length];
}
