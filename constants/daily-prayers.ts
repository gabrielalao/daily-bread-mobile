export type DailyPrayer = {
  id: string;
  title: string;
  prayer: string;
  scripture: string;
  themes: string[]; // peace, strength, love, faith, guidance, forgiveness, gratitude, finances, health, parenting, career, purpose
};

export const dailyPrayers: DailyPrayer[] = [
  // 1. Peace/Anxiety - matches Devotional #1: Finding Peace in the Storm
  {
    id: "1",
    title: "Prayer for Peace in Anxiety",
    prayer: "Heavenly Father, I come to You with a heavy heart, carrying worries that feel too big to bear. Your Word says to cast all my anxieties on You because You care for me. Today, I choose to trust You with everything that troubles me - my relationships, my finances, my health, my future. Fill me with Your supernatural peace that transcends all understanding. Guard my heart and mind in Christ Jesus. Help me to remember that You are in control, and I can rest in Your loving care. In Jesus' name, Amen.",
    scripture: "1 Peter 5:7",
    themes: ["peace", "anxiety", "trust"],
  },
  // 2. Strength - matches Devotional #2: Strength for Today
  {
    id: "2",
    title: "Prayer for Strength and Renewal",
    prayer: "Lord, I feel weak and weary today. My strength is failing, and I don't know how much longer I can keep going. But Your Word promises that those who hope in You will renew their strength. I place my hope in You alone. Lift me up on wings like eagles. Give me strength to soar above my circumstances, energy to run through challenges, and endurance to simply take the next step. Be my strength when I have none left. In Jesus' name, Amen.",
    scripture: "Isaiah 40:29",
    themes: ["strength", "courage", "hope"],
  },
  // 3. Love - matches Devotional #3: Love in Action
  {
    id: "3",
    title: "Prayer for Love and Compassion",
    prayer: "Father of love, You first loved me when I was unlovable. Teach me to love others the way You love me - with patience, kindness, and compassion. Help me move beyond words to actions that demonstrate Your love. Show me opportunities today to serve someone, encourage someone, or simply be present for someone who needs Your love through me. Fill my heart with genuine care for others, and let Your love overflow from my life. In Jesus' name, Amen.",
    scripture: "1 Corinthians 13:4-7",
    themes: ["love", "compassion", "kindness"],
  },
  // 4. Finances/Stewardship - matches Devotional #4: The Heart of Stewardship
  {
    id: "4",
    title: "Prayer for Financial Wisdom",
    prayer: "Lord, You are my provider, and everything I have comes from Your hand. Help me to be a faithful steward of the resources You've entrusted to me. Give me wisdom to make sound financial decisions, discipline to live within my means, and generosity to give cheerfully. Teach me to honor You with my firstfruits, not my leftovers. Help me remember that true wealth is found in knowing You, not in earthly possessions. Provide for my needs and help me trust You completely. In Jesus' name, Amen.",
    scripture: "Matthew 6:33",
    themes: ["finances", "stewardship", "provision"],
  },
  // 5. Finances/Giving - matches Devotional #5: First Fruits, Not Leftovers
  {
    id: "5",
    title: "Prayer for Generous Giving",
    prayer: "Gracious Father, You gave everything for me through Jesus. Soften my heart toward generosity. Break the grip of materialism and the love of money in my life. Help me see my possessions as tools for Your kingdom, not treasures to hoard. Give me joy in giving, whether it's my tithe, an offering, or helping someone in need. Remind me that I cannot out-give You, and that when I give, I'm investing in eternity. In Jesus' name, Amen.",
    scripture: "2 Corinthians 9:7",
    themes: ["finances", "generosity", "stewardship"],
  },
  // 6. Finances/Contentment - matches Devotional #6: Contentment is Wealth
  {
    id: "6",
    title: "Prayer for Contentment",
    prayer: "Satisfying God, in a world that constantly tells me I need more, help me find contentment in You. Teach me that godliness with contentment is great gain. Help me be grateful for what I have rather than envious of what others possess. Free me from the comparison trap and the consumer mentality. Whether I have little or much, help me say with Paul that I've learned the secret of being content in any and every situation. You are enough. In Jesus' name, Amen.",
    scripture: "Philippians 4:11-13",
    themes: ["contentment", "gratitude", "peace"],
  },
  // 7. Finances/Generosity - matches Devotional #7: Generosity Opens Heaven's Windows
  {
    id: "7",
    title: "Prayer for Generous Giving",
    prayer: "Gracious Father, You gave everything for me through Jesus. Soften my heart toward generosity. Break the grip of materialism and the love of money in my life. Help me see my possessions as tools for Your kingdom, not treasures to hoard. Give me joy in giving, whether it's my tithe, an offering, or helping someone in need. Remind me that I cannot out-give You, and that when I give, I'm investing in eternity. In Jesus' name, Amen.",
    scripture: "2 Corinthians 9:7",
    themes: ["finances", "generosity", "stewardship"],
  },
  // 8. Career/Work - matches Devotional #8: Your Business Is Your Ministry
  {
    id: "8",
    title: "Prayer for Career and Work",
    prayer: "Lord, You've called me to work as unto You, not merely for human approval. Help me excel in my job while maintaining godly character. Give me integrity in business dealings, diligence in my tasks, and wisdom in workplace relationships. Whether I'm seeking employment, facing workplace challenges, or pursuing advancement, I trust You with my career. Help me see my work as ministry and my workplace as a mission field. Use me to bring Your light into my professional world. In Jesus' name, Amen.",
    scripture: "Colossians 3:23",
    themes: ["career", "work", "profession"],
  },
  // 9. Career/Integrity - matches Devotional #9: Integrity Over Profit
  {
    id: "9",
    title: "Prayer for Career and Work",
    prayer: "Lord, You've called me to work as unto You, not merely for human approval. Help me excel in my job while maintaining godly character. Give me integrity in business dealings, diligence in my tasks, and wisdom in workplace relationships. Whether I'm seeking employment, facing workplace challenges, or pursuing advancement, I trust You with my career. Help me see my work as ministry and my workplace as a mission field. Use me to bring Your light into my professional world. In Jesus' name, Amen.",
    scripture: "Colossians 3:23",
    themes: ["career", "work", "profession", "integrity"],
  },
  // 10. Stewardship/Faithfulness - matches Devotional #10: Faithful With Little, Trusted With Much
  {
    id: "10",
    title: "Prayer for Financial Wisdom",
    prayer: "Lord, You are my provider, and everything I have comes from Your hand. Help me to be a faithful steward of the resources You've entrusted to me. Give me wisdom to make sound financial decisions, discipline to live within my means, and generosity to give cheerfully. Teach me to honor You with my firstfruits, not my leftovers. Help me remember that true wealth is found in knowing You, not in earthly possessions. Provide for my needs and help me trust You completely. In Jesus' name, Amen.",
    scripture: "Matthew 6:33",
    themes: ["finances", "stewardship", "provision", "faithfulness"],
  },
  // 11. Purpose/Vision - matches Devotional #11: God-Sized Vision
  {
    id: "11",
    title: "Prayer for Purpose and Calling",
    prayer: "Father, You created me with purpose and intention. You prepared good works in advance for me to do. Help me discover and walk in my calling. Show me how to use my unique gifts, talents, and experiences for Your kingdom. Remove any confusion about my purpose and replace it with clarity and confidence. Whether my calling is in ministry, marketplace, or home, help me steward it faithfully. Let my life count for eternity. In Jesus' name, Amen.",
    scripture: "Ephesians 2:10",
    themes: ["purpose", "calling", "mission"],
  },
  // 12. Leadership/Servanthood - matches Devotional #12: Servant Leadership
  {
    id: "12",
    title: "Prayer for Humility and Servanthood",
    prayer: "Humble Savior, You came not to be served but to serve, washing Your disciples' feet as an example for me. Pride so easily creeps into my heart, making me think I'm better than others or deserve special treatment. Humble me, Lord. Help me consider others better than myself and look not only to my own interests but also to the interests of others. Give me the heart of a servant, ready to help, encourage, and support. In Jesus' name, Amen.",
    scripture: "Philippians 2:3-4",
    themes: ["humility", "servanthood", "love"],
  },
  // 13. Work/Excellence - matches Devotional #13: Excellence as Worship
  {
    id: "13",
    title: "Prayer for Career and Work",
    prayer: "Lord, You've called me to work as unto You, not merely for human approval. Help me excel in my job while maintaining godly character. Give me integrity in business dealings, diligence in my tasks, and wisdom in workplace relationships. Whether I'm seeking employment, facing workplace challenges, or pursuing advancement, I trust You with my career. Help me see my work as ministry and my workplace as a mission field. Use me to bring Your light into my professional world. In Jesus' name, Amen.",
    scripture: "Colossians 3:23",
    themes: ["career", "work", "profession", "excellence"],
  },
  // 14. Finances/Wealth - matches Devotional #14: Building Wealth God's Way
  {
    id: "14",
    title: "Prayer for Financial Wisdom",
    prayer: "Lord, You are my provider, and everything I have comes from Your hand. Help me to be a faithful steward of the resources You've entrusted to me. Give me wisdom to make sound financial decisions, discipline to live within my means, and generosity to give cheerfully. Teach me to honor You with my firstfruits, not my leftovers. Help me remember that true wealth is found in knowing You, not in earthly possessions. Provide for my needs and help me trust You completely. In Jesus' name, Amen.",
    scripture: "Matthew 6:33",
    themes: ["finances", "stewardship", "provision"],
  },
  // 15. Health/Body - matches Devotional #15: Your Body, God's Temple
  {
    id: "15",
    title: "Prayer for Health and Healing",
    prayer: "Great Physician, You are the healer of body, mind, and soul. I bring my health concerns before You today. Whether physical pain, mental struggles, or emotional wounds, I ask for Your healing touch. Restore what is broken, strengthen what is weak, and renew what is worn out. Give wisdom to healthcare providers and guide treatment decisions. Help me steward my body as Your temple through healthy choices. Even if healing doesn't come as I hope, help me trust that Your grace is sufficient. In Jesus' name, Amen.",
    scripture: "Jeremiah 17:14",
    themes: ["health", "healing", "wellness"],
  },
  // 16. Parenting - matches Devotional #16: Parenting as Discipleship
  {
    id: "16",
    title: "Prayer for Parenting Wisdom",
    prayer: "Loving Father, You've entrusted me with the precious responsibility of raising children. I feel inadequate for this task, but Your Word promises that You give wisdom generously. Help me parent with grace and truth, discipline and love, firmness and compassion. Give me patience when I'm frustrated, wisdom when I'm uncertain, and love when I'm exhausted. Help me model Christ to my children and point them toward You in everything. Protect them, guide them, and draw their hearts to Yourself. In Jesus' name, Amen.",
    scripture: "Proverbs 22:6",
    themes: ["parenting", "family", "children"],
  },
  // 17. Patience/Investing - matches Devotional #17: The Patient Investor
  {
    id: "17",
    title: "Prayer for Patience and Perseverance",
    prayer: "Patient Father, I'm tired of waiting. The situation I've been praying about seems unchanged, and I'm losing hope. Help me remember that Your timing is perfect, even when it doesn't match mine. Give me patience to wait on You and perseverance to keep pressing forward. Strengthen my resolve to not give up or give in. Help me run with endurance the race marked out for me, keeping my eyes fixed on Jesus. In His name, Amen.",
    scripture: "James 1:2-4",
    themes: ["patience", "perseverance", "hope"],
  },
  // 18. Finances/Debt - matches Devotional #18: The Debt-Free Dream
  {
    id: "18",
    title: "Prayer for Self-Control and Discipline",
    prayer: "Holy Spirit, produce in me the fruit of self-control. I struggle with habits, appetites, and impulses that don't honor You. Whether it's what I eat, watch, say, or think, I need Your help to discipline myself. Give me strength to say no to ungodliness and worldly passions, and to live self-controlled, upright, and godly lives. Help me bring every thought captive to the obedience of Christ. In Jesus' name, Amen.",
    scripture: "Galatians 5:22-23",
    themes: ["self-control", "discipline", "holiness"],
  },
  // 19. Career/Calling - matches Devotional #19: Your Career, God's Calling
  {
    id: "19",
    title: "Prayer for Purpose and Calling",
    prayer: "Father, You created me with purpose and intention. You prepared good works in advance for me to do. Help me discover and walk in my calling. Show me how to use my unique gifts, talents, and experiences for Your kingdom. Remove any confusion about my purpose and replace it with clarity and confidence. Whether my calling is in ministry, marketplace, or home, help me steward it faithfully. Let my life count for eternity. In Jesus' name, Amen.",
    scripture: "Ephesians 2:10",
    themes: ["purpose", "calling", "mission"],
  },
  // 20. Finances/Budgeting - matches Devotional #20: The Freedom of a Budget
  {
    id: "20",
    title: "Prayer for Financial Wisdom",
    prayer: "Lord, You are my provider, and everything I have comes from Your hand. Help me to be a faithful steward of the resources You've entrusted to me. Give me wisdom to make sound financial decisions, discipline to live within my means, and generosity to give cheerfully. Teach me to honor You with my firstfruits, not my leftovers. Help me remember that true wealth is found in knowing You, not in earthly possessions. Provide for my needs and help me trust You completely. In Jesus' name, Amen.",
    scripture: "Matthew 6:33",
    themes: ["finances", "stewardship", "provision"],
  },
  // 21. Communication/Words - matches Devotional #21: Words That Heal
  {
    id: "21",
    title: "Prayer for Relationships and Unity",
    prayer: "Lord of peace, You've called me to live at peace with everyone as much as it depends on me. I lift up my relationships to You - my marriage, family, friendships, and community. Heal broken relationships, restore trust where it's been damaged, and help me forgive those who've hurt me. Give me wisdom in conflicts, patience with difficult people, and love for those who are hard to love. Help me be a peacemaker, reflecting Your reconciling love. In Jesus' name, Amen.",
    scripture: "Romans 12:18",
    themes: ["relationships", "love", "peace"],
  },
  // 22. Finances/Income - matches Devotional #22: Increasing Your Income, God's Way
  {
    id: "22",
    title: "Prayer for Financial Wisdom",
    prayer: "Lord, You are my provider, and everything I have comes from Your hand. Help me to be a faithful steward of the resources You've entrusted to me. Give me wisdom to make sound financial decisions, discipline to live within my means, and generosity to give cheerfully. Teach me to honor You with my firstfruits, not my leftovers. Help me remember that true wealth is found in knowing You, not in earthly possessions. Provide for my needs and help me trust You completely. In Jesus' name, Amen.",
    scripture: "Matthew 6:33",
    themes: ["finances", "stewardship", "provision"],
  },
  // 23. Finances/Freedom - matches Devotional #23: True Financial Freedom
  {
    id: "23",
    title: "Prayer for Contentment",
    prayer: "Satisfying God, in a world that constantly tells me I need more, help me find contentment in You. Teach me that godliness with contentment is great gain. Help me be grateful for what I have rather than envious of what others possess. Free me from the comparison trap and the consumer mentality. Whether I have little or much, help me say with Paul that I've learned the secret of being content in any and every situation. You are enough. In Jesus' name, Amen.",
    scripture: "Philippians 4:11-13",
    themes: ["contentment", "gratitude", "peace"],
  },
  // 24. Health/Exercise - matches Devotional #24: Move Your Body, Honor Your God
  {
    id: "24",
    title: "Prayer for Health and Healing",
    prayer: "Great Physician, You are the healer of body, mind, and soul. I bring my health concerns before You today. Whether physical pain, mental struggles, or emotional wounds, I ask for Your healing touch. Restore what is broken, strengthen what is weak, and renew what is worn out. Give wisdom to healthcare providers and guide treatment decisions. Help me steward my body as Your temple through healthy choices. Even if healing doesn't come as I hope, help me trust that Your grace is sufficient. In Jesus' name, Amen.",
    scripture: "Jeremiah 17:14",
    themes: ["health", "healing", "wellness"],
  },
  // 25. Words/Blessing - matches Devotional #25: The Power of Spoken Blessings
  {
    id: "25",
    title: "Prayer for Simple Presence",
    prayer: "Father, teach me the ministry of presence. Help me show up for people without trying to fix everything. Give me the grace to sit with someone in their pain, to celebrate with those who rejoice, to simply be there without agenda or performance. Slow me down enough to truly see people and make them feel valued. Let Your love flow through my presence. Help me reflect You by being fully present in every moment and interaction. In Jesus' name, Amen.",
    scripture: "Romans 12:15",
    themes: ["presence", "love", "compassion"],
  },
  // 26. Rest/Sabbath - matches Devotional #26: Rest is Resistance
  {
    id: "26",
    title: "Prayer for Rest and Renewal",
    prayer: "God of rest, I am weary and burdened, and I need Your refreshing. You invite me to come to You and find rest for my soul. Help me to slow down, to say no to the endless demands, and to prioritize time with You. Teach me the rhythm of Sabbath rest. Restore my energy, renew my mind, and refresh my spirit. Help me trust that the world will keep turning even when I rest. You are my true rest. In Jesus' name, Amen.",
    scripture: "Matthew 11:28",
    themes: ["rest", "peace", "renewal"],
  },
  // 27. Friendship/Community - matches Devotional #27: Friendship as Spiritual Warfare
  {
    id: "27",
    title: "Prayer for Friendship and Community",
    prayer: "Father, You said it's not good for me to be alone. I need authentic friendships and genuine community. Bring godly friends into my life who will sharpen me, encourage me, and speak truth to me. Help me be vulnerable and real, not hiding behind masks. Give me the courage to pursue deep friendships and the wisdom to invest in them. Protect me from isolation and help me find my place in Your family. In Jesus' name, Amen.",
    scripture: "Proverbs 27:17",
    themes: ["friendship", "community", "relationships"],
  },
  // 28. Faith/Silence - matches Devotional #28: When God Seems Silent
  {
    id: "28",
    title: "Prayer When God Feels Distant",
    prayer: "Lord, I feel like You're far away. I pray but don't sense Your presence. I worship but feel nothing. My heart cries out, 'Where are You?' Yet I choose to trust that You are near even when I can't feel You. You promised to never leave me or forsake me. Help my unbelief. Strengthen my faith during this season of silence. Remind me that Your presence isn't based on my feelings but on Your faithful promises. I will wait for You. In Jesus' name, Amen.",
    scripture: "Psalm 13:1-2",
    themes: ["faith", "trust", "perseverance"],
  },
  // 29. Parenting/Legacy - matches Devotional #29: Generational Influence
  {
    id: "29",
    title: "Prayer for My Legacy",
    prayer: "Eternal God, help me live with eternity in mind. I want to leave a legacy of faith for those who come after me. Let my children and grandchildren see authentic faith lived out in my daily life. Help me model prayer, generosity, integrity, and love for You. May the impact of my life ripple through generations. Give me wisdom to invest in what lasts forever - relationships, character, and Your kingdom. In Jesus' name, Amen.",
    scripture: "Psalm 78:4",
    themes: ["legacy", "parenting", "purpose"],
  },
  // 30. Love/Presence - matches Devotional #30: The Ministry of Presence
  {
    id: "30",
    title: "Prayer for Simple Presence",
    prayer: "Father, teach me the ministry of presence. Help me show up for people without trying to fix everything. Give me the grace to sit with someone in their pain, to celebrate with those who rejoice, to simply be there without agenda or performance. Slow me down enough to truly see people and make them feel valued. Let Your love flow through my presence. Help me reflect You by being fully present in every moment and interaction. In Jesus' name, Amen.",
    scripture: "Romans 12:15",
    themes: ["presence", "love", "compassion"],
  },
];

// Get today's prayer based on day cycling
export function getTodayDailyPrayer(viewedIds: string[] = []): DailyPrayer {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % dailyPrayers.length;
  return dailyPrayers[index];
}

// Get a prayer that correlates with a devotional
// Priority: 1) Match by ID for perfect correlation, 2) Match by themes
export function getCorrelatedDailyPrayer(
  devotionalId: string,
  devotionalThemes: string[],
  viewedIds: string[] = []
): DailyPrayer {
  // PRIORITY 1: Perfect 1:1 correlation - match prayer by devotional ID
  const matchedById = dailyPrayers.find(p => p.id === devotionalId);
  if (matchedById) return matchedById;
  
  // PRIORITY 2: Try to match prayer with devotional themes (unviewed first)
  for (const theme of devotionalThemes) {
    const matchedPrayer = dailyPrayers.find(
      p => !viewedIds.includes(p.id) && p.themes.includes(theme)
    );
    if (matchedPrayer) return matchedPrayer;
  }
  
  // PRIORITY 3: Try any theme match regardless of viewed status
  for (const theme of devotionalThemes) {
    const matchedPrayer = dailyPrayers.find(p => p.themes.includes(theme));
    if (matchedPrayer) return matchedPrayer;
  }
  
  // PRIORITY 4: Fallback to today's prayer
  return getTodayDailyPrayer(viewedIds);
}
