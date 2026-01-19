export type DailyStudy = {
  id: string;
  title: string;
  scripture: string;
  verse: string;
  insight: string;
  reflection: string;
  themes: string[]; // peace, strength, love, faith, guidance, forgiveness, gratitude, finances, health, parenting, career, purpose
};

export const dailyStudies: DailyStudy[] = [
  {
    id: "1",
    title: "The Promise of God's Peace",
    scripture: "John 14:27",
    verse: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    insight: "Jesus offers a peace that's fundamentally different from what the world offers. Worldly peace depends on circumstances - having enough money, health, or success. But Christ's peace is a settled confidence in God's sovereign control, regardless of external conditions.",
    reflection: "What situations in your life are currently disturbing your peace? How might Jesus' promise of 'not as the world gives' change your perspective on finding peace?",
    themes: ["peace", "trust", "faith"],
  },
  {
    id: "2",
    title: "Strength from the Lord",
    scripture: "Psalm 46:1",
    verse: "God is our refuge and strength, an ever-present help in trouble.",
    insight: "This psalm reminds us that God is not a distant deity, but an 'ever-present' help. The Hebrew word for 'strength' here implies security and might. God doesn't just give us strength; He IS our strength. When we feel weak, we can run to Him as our refuge.",
    reflection: "Where do you typically turn for strength when life gets difficult? How might your life look different if God was your first refuge rather than your last resort?",
    themes: ["strength", "refuge", "hope"],
  },
  {
    id: "3",
    title: "Love as Our Identity",
    scripture: "1 John 4:19",
    verse: "We love because he first loved us.",
    insight: "Our capacity to love others flows from understanding how deeply God loves us. This verse reveals that love is not primarily an emotion we generate, but a response to the love we've received. When we grasp God's unconditional love, it overflows naturally toward others.",
    reflection: "Do you truly believe God loves you unconditionally? How might a deeper understanding of God's love for you transform how you love difficult people in your life?",
    themes: ["love", "identity", "grace"],
  },
  {
    id: "4",
    title: "Faithful in Little Things",
    scripture: "Luke 16:10",
    verse: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
    insight: "God often tests our character in small, seemingly insignificant matters before entrusting us with greater responsibilities. This principle applies especially to finances. How we handle $10 reveals what we'd do with $10,000. Faithfulness isn't measured by the amount but by our attitude and integrity.",
    reflection: "What 'little things' is God asking you to be faithful with right now? How might your stewardship of small responsibilities prepare you for future opportunities?",
    themes: ["stewardship", "faithfulness", "finances"],
  },
  {
    id: "5",
    title: "Honor God with Firstfruits",
    scripture: "Proverbs 3:9-10",
    verse: "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing, and your vats will brim over with new wine.",
    insight: "The 'firstfruits' principle means giving God the first and best portion of our income, not the leftovers. This practice demonstrates that we trust God as our provider. The promise of overflow isn't about getting rich, but about experiencing God's supernatural provision when we put Him first financially.",
    reflection: "Do you give God your 'firstfruits' or your leftovers? What might change in your heart and finances if you honored God first before paying bills or spending on yourself?",
    themes: ["finances", "stewardship", "generosity"],
  },
  {
    id: "6",
    title: "Faith That Pleases God",
    scripture: "Hebrews 11:6",
    verse: "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.",
    insight: "Faith is the foundation of our relationship with God. This verse reveals two essential aspects: believing that God exists (His reality) and that He rewards those who seek Him (His goodness). True faith involves both intellectual belief and active pursuit of God.",
    reflection: "Is your faith primarily intellectual agreement or active trust? What would it look like to earnestly seek God today, believing He will reward your pursuit?",
    themes: ["faith", "belief", "seeking"],
  },
  {
    id: "7",
    title: "Trusting God's Guidance",
    scripture: "Proverbs 3:5-6",
    verse: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    insight: "These verses contain both a command and a promise. We're to trust God completely, even when His ways don't make sense to us. The promise is that when we submit all our ways to Him - not just spiritual matters but every decision - He will direct our paths. The 'straight' path doesn't mean easy, but right and purposeful.",
    reflection: "What decision are you currently facing where you're tempted to lean on your own understanding instead of trusting God? What might submission to God look like in this situation?",
    themes: ["guidance", "trust", "wisdom"],
  },
  {
    id: "8",
    title: "The Gift of Forgiveness",
    scripture: "Ephesians 1:7",
    verse: "In him we have redemption through his blood, the forgiveness of sins, in accordance with the riches of God's grace.",
    insight: "Forgiveness is not something we earn or deserve; it's a gift flowing from 'the riches of God's grace.' The price was Jesus' blood, but the supply is God's unlimited grace. No sin is too great, no failure too frequent. When we grasp how freely we've been forgiven, we can extend that same grace to others.",
    reflection: "Are you holding onto guilt over something God has already forgiven? Is there someone you need to forgive, remembering how much you've been forgiven?",
    themes: ["forgiveness", "grace", "redemption"],
  },
  {
    id: "9",
    title: "A Lifestyle of Gratitude",
    scripture: "1 Thessalonians 5:16-18",
    verse: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    insight: "Notice this says 'in all circumstances,' not 'for all circumstances.' We don't thank God for tragedy or evil, but we can find things to be grateful for even in difficult times. Gratitude shifts our focus from what's wrong to what's right, from what we lack to what we have. It's God's will because it transforms our perspective and protects our hearts.",
    reflection: "What's one thing you can genuinely thank God for today, even in the midst of current challenges? How might a gratitude practice change your outlook?",
    themes: ["gratitude", "thanksgiving", "joy"],
  },
  {
    id: "10",
    title: "Healing and Wholeness",
    scripture: "Psalm 147:3",
    verse: "He heals the brokenhearted and binds up their wounds.",
    insight: "God's healing extends beyond physical ailments to emotional and spiritual wounds. The phrase 'binds up' is a tender image of God carefully bandaging our hurts like a loving caregiver. He doesn't just cover wounds; He actively heals them. Sometimes healing is instant, sometimes gradual, but God is always the Great Physician working toward our wholeness.",
    reflection: "What broken areas of your heart need God's healing touch? Are you willing to let Him into those painful places to bind up your wounds?",
    themes: ["healing", "comfort", "restoration"],
  },
  {
    id: "11",
    title: "Wisdom for Parents",
    scripture: "Deuteronomy 6:6-7",
    verse: "These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.",
    insight: "This passage reveals that spiritual formation happens in everyday moments, not just formal teaching times. The instruction to talk about God's truth 'when you sit... walk... lie down... get up' means integrating faith into all of life. Children learn more from what they observe in our daily lives than from our intentional lessons.",
    reflection: "How naturally does faith conversation flow in your home? What ordinary moments could become opportunities to 'impress' God's truth on your children?",
    themes: ["parenting", "family", "faith"],
  },
  {
    id: "12",
    title: "Working for God's Glory",
    scripture: "1 Corinthians 10:31",
    verse: "So whether you eat or drink or whatever you do, do it all for the glory of God.",
    insight: "Paul includes even mundane activities like eating and drinking to show that every action can glorify God when done with the right heart. This transforms our view of work - it's not just about earning money or advancing careers, but about honoring God through excellence, integrity, and service. Even secular work becomes sacred when done 'unto the Lord.'",
    reflection: "How might your approach to work change if you viewed your job as a calling to glorify God? What would it look like to work 'unto the Lord' this week?",
    themes: ["work", "purpose", "calling"],
  },
  {
    id: "13",
    title: "Created with Purpose",
    scripture: "Jeremiah 29:11",
    verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    insight: "This beloved verse was originally spoken to Israel in exile, reminding them that even in hardship, God had a purpose and plan. The same is true for us. God's plans for us are good, filled with hope, and aimed at our ultimate prosperity (which often looks different from worldly success). Our job is to trust His timing and process.",
    reflection: "Do you believe God has a good plan for your life, even when circumstances seem contrary? What might it look like to trust His plans over your own agenda?",
    themes: ["purpose", "hope", "trust"],
  },
  {
    id: "14",
    title: "Courage Over Fear",
    scripture: "Joshua 1:9",
    verse: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    insight: "God commanded Joshua to be courageous three times in this chapter. Courage isn't the absence of fear, but choosing to obey despite fear. The foundation for courage is God's presence - 'the Lord your God will be with you.' We can face anything when we remember we never face it alone. God goes before us, beside us, and behind us.",
    reflection: "What are you afraid of today? How might remembering God's constant presence give you courage to take the next step?",
    themes: ["courage", "fear", "strength"],
  },
  {
    id: "15",
    title: "Unity in Relationships",
    scripture: "Ephesians 4:2-3",
    verse: "Be completely humble and gentle; be patient, bearing with one another in love. Make every effort to keep the unity of the Spirit through the bond of peace.",
    insight: "Unity doesn't mean uniformity - we can disagree while remaining united in Christ. Notice the active verbs: 'be humble,' 'be patient,' 'bearing with,' 'make every effort.' Unity requires intentional work. The qualities listed - humility, gentleness, patience, love, peace - are the building blocks of healthy relationships.",
    reflection: "Which relationship in your life needs more humility, patience, or gentleness? What specific step could you take today to 'make every effort' toward unity?",
    themes: ["relationships", "unity", "love"],
  },
  {
    id: "16",
    title: "The Secret of Contentment",
    scripture: "Philippians 4:12-13",
    verse: "I know what it is to be in need, and I know what it is to have plenty. I have learned the secret of being content in any and every situation, whether well fed or hungry, whether living in plenty or in want. I can do all this through him who gives me strength.",
    insight: "Paul reveals that contentment is learned, not natural. It's a 'secret' that comes through experiencing both abundance and lack while depending on Christ through both. The famous 'I can do all things' isn't about achieving worldly success, but about enduring any circumstance with Christ's strength. True contentment is Christ-sufficiency, not self-sufficiency.",
    reflection: "What circumstances are currently testing your contentment? How might Christ's strength enable you to be content regardless of what you have or don't have?",
    themes: ["contentment", "strength", "peace"],
  },
  {
    id: "17",
    title: "Perseverance Through Trials",
    scripture: "Romans 5:3-4",
    verse: "Not only so, but we also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.",
    insight: "This passage reveals God's process for spiritual growth: suffering → perseverance → character → hope. We don't seek suffering, but when it comes, God uses it to develop qualities that can't be formed any other way. Perseverance is like a spiritual muscle that only grows under resistance. The ultimate product is hope - confident expectation in God's faithfulness.",
    reflection: "What trial are you currently persevering through? Can you see how God might be using it to develop character and deepen your hope in Him?",
    themes: ["perseverance", "character", "hope"],
  },
  {
    id: "18",
    title: "The Fruit of Self-Control",
    scripture: "Proverbs 25:28",
    verse: "Like a city whose walls are broken through is a person who lacks self-control.",
    insight: "Ancient cities depended on walls for protection; without them, they were vulnerable to every enemy. Similarly, self-control protects us from destructive impulses, habits, and decisions. The Holy Spirit empowers us with self-control as part of His fruit (Galatians 5:23). It's not white-knuckled willpower but Spirit-enabled discipline that guards our hearts and lives.",
    reflection: "What area of your life feels like 'broken walls' - lacking protection and discipline? What would it look like to invite the Holy Spirit's power into that area?",
    themes: ["self-control", "discipline", "holiness"],
  },
  {
    id: "19",
    title: "Joy as Our Strength",
    scripture: "Psalm 16:11",
    verse: "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.",
    insight: "True joy is found in God's presence, not in circumstances. This verse connects joy with knowing God's path for our lives. When we walk in His will, in His presence, joy naturally flows. Unlike happiness, which depends on happenings, joy is rooted in our relationship with God and the eternal perspective He gives us.",
    reflection: "Where are you searching for joy? How might intentionally spending time in God's presence fill you with the joy you're seeking?",
    themes: ["joy", "presence", "worship"],
  },
  {
    id: "20",
    title: "Humble Service",
    scripture: "Mark 10:45",
    verse: "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
    insight: "Jesus redefines greatness as service. If the King of kings came to serve, how much more should we? True humility doesn't think less of itself but thinks of itself less. Serving others is how we follow Christ's example most directly. Every act of service, no matter how small, reflects the heart of Jesus who gave His life for us.",
    reflection: "Who can you serve today in a practical way? How might serving others actually be a way of serving and honoring Christ Himself?",
    themes: ["humility", "service", "love"],
  },
];

// Get today's study based on day cycling
export function getTodayDailyStudy(viewedIds: string[] = []): DailyStudy {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % dailyStudies.length;
  return dailyStudies[index];
}

// Get a study that correlates with devotional themes
export function getCorrelatedDailyStudy(
  devotionalThemes: string[],
  viewedIds: string[] = []
): DailyStudy {
  // Try to match study with devotional themes
  for (const theme of devotionalThemes) {
    const matchedStudy = dailyStudies.find(
      s => !viewedIds.includes(s.id) && s.themes.includes(theme)
    );
    if (matchedStudy) return matchedStudy;
  }
  
  // If no unviewed match, try any match regardless of viewed status
  for (const theme of devotionalThemes) {
    const matchedStudy = dailyStudies.find(s => s.themes.includes(theme));
    if (matchedStudy) return matchedStudy;
  }
  
  // Fallback to today's study
  return getTodayDailyStudy(viewedIds);
}
