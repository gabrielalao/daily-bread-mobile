export type DailyPrayer = {
  id: string;
  title: string;
  prayer: string;
  scripture: string;
  themes: string[]; // peace, strength, love, faith, guidance, forgiveness, gratitude, finances, health, parenting, career, purpose
};

export const dailyPrayers: DailyPrayer[] = [
  {
    id: "1",
    title: "Prayer for Peace in Anxiety",
    prayer: "Heavenly Father, I come to You with a heavy heart, carrying worries that feel too big to bear. Your Word says to cast all my anxieties on You because You care for me. Today, I choose to trust You with everything that troubles me - my relationships, my finances, my health, my future. Fill me with Your supernatural peace that transcends all understanding. Guard my heart and mind in Christ Jesus. Help me to remember that You are in control, and I can rest in Your loving care. In Jesus' name, Amen.",
    scripture: "1 Peter 5:7",
    themes: ["peace", "anxiety", "trust"],
  },
  {
    id: "2",
    title: "Prayer for Strength and Renewal",
    prayer: "Lord, I feel weak and weary today. My strength is failing, and I don't know how much longer I can keep going. But Your Word promises that those who hope in You will renew their strength. I place my hope in You alone. Lift me up on wings like eagles. Give me strength to soar above my circumstances, energy to run through challenges, and endurance to simply take the next step. Be my strength when I have none left. In Jesus' name, Amen.",
    scripture: "Isaiah 40:29",
    themes: ["strength", "courage", "hope"],
  },
  {
    id: "3",
    title: "Prayer for Love and Compassion",
    prayer: "Father of love, You first loved me when I was unlovable. Teach me to love others the way You love me - with patience, kindness, and compassion. Help me move beyond words to actions that demonstrate Your love. Show me opportunities today to serve someone, encourage someone, or simply be present for someone who needs Your love through me. Fill my heart with genuine care for others, and let Your love overflow from my life. In Jesus' name, Amen.",
    scripture: "1 Corinthians 13:4-7",
    themes: ["love", "compassion", "kindness"],
  },
  {
    id: "4",
    title: "Prayer for Financial Wisdom",
    prayer: "Lord, You are my provider, and everything I have comes from Your hand. Help me to be a faithful steward of the resources You've entrusted to me. Give me wisdom to make sound financial decisions, discipline to live within my means, and generosity to give cheerfully. Teach me to honor You with my firstfruits, not my leftovers. Help me remember that true wealth is found in knowing You, not in earthly possessions. Provide for my needs and help me trust You completely. In Jesus' name, Amen.",
    scripture: "Matthew 6:33",
    themes: ["finances", "stewardship", "provision"],
  },
  {
    id: "5",
    title: "Prayer for Generous Giving",
    prayer: "Gracious Father, You gave everything for me through Jesus. Soften my heart toward generosity. Break the grip of materialism and the love of money in my life. Help me see my possessions as tools for Your kingdom, not treasures to hoard. Give me joy in giving, whether it's my tithe, an offering, or helping someone in need. Remind me that I cannot out-give You, and that when I give, I'm investing in eternity. In Jesus' name, Amen.",
    scripture: "2 Corinthians 9:7",
    themes: ["finances", "generosity", "stewardship"],
  },
  {
    id: "6",
    title: "Prayer for Faith and Trust",
    prayer: "Father, increase my faith. When doubts creep in and circumstances seem impossible, remind me that You are the God of the impossible. Help me trust You even when I can't see the way forward. Strengthen my belief in Your goodness, Your power, and Your faithfulness. Like Abraham, help me believe Your promises even when they seem unlikely. Let my faith move mountains and bring glory to Your name. In Jesus' name, Amen.",
    scripture: "Hebrews 11:1",
    themes: ["faith", "trust", "belief"],
  },
  {
    id: "7",
    title: "Prayer for Guidance and Direction",
    prayer: "Lord, I need Your wisdom and direction. I don't know which path to take or what decision to make. Your Word says that if I lack wisdom, I should ask You, and You'll give it generously. I'm asking now. Show me Your will clearly. Open the right doors and close the wrong ones. Give me discernment to recognize Your voice above all others. Lead me in Your truth and teach me, for You are the God of my salvation. In Jesus' name, Amen.",
    scripture: "Proverbs 3:5-6",
    themes: ["guidance", "wisdom", "direction"],
  },
  {
    id: "8",
    title: "Prayer for Forgiveness and Mercy",
    prayer: "Merciful Father, I come to You burdened by guilt and shame. I've sinned against You and against others. But Your Word promises that if I confess my sins, You are faithful and just to forgive me and cleanse me from all unrighteousness. I confess my failures and shortcomings. Thank You for the blood of Jesus that washes me clean. Help me also to forgive those who have hurt me, releasing them from my judgment just as You've released me from Yours. In Jesus' name, Amen.",
    scripture: "1 John 1:9",
    themes: ["forgiveness", "mercy", "grace"],
  },
  {
    id: "9",
    title: "Prayer of Gratitude and Thanksgiving",
    prayer: "Heavenly Father, today I choose gratitude. Even in the midst of challenges, I thank You for Your countless blessings. Thank You for life, breath, and health. Thank You for family, friends, and community. Thank You for provision, protection, and purpose. Most of all, thank You for Jesus and the salvation He brought. Help me cultivate a grateful heart that sees Your goodness in every season. Let thanksgiving be my continual sacrifice of praise. In Jesus' name, Amen.",
    scripture: "1 Thessalonians 5:18",
    themes: ["gratitude", "thanksgiving", "praise"],
  },
  {
    id: "10",
    title: "Prayer for Health and Healing",
    prayer: "Great Physician, You are the healer of body, mind, and soul. I bring my health concerns before You today. Whether physical pain, mental struggles, or emotional wounds, I ask for Your healing touch. Restore what is broken, strengthen what is weak, and renew what is worn out. Give wisdom to healthcare providers and guide treatment decisions. Help me steward my body as Your temple through healthy choices. Even if healing doesn't come as I hope, help me trust that Your grace is sufficient. In Jesus' name, Amen.",
    scripture: "Jeremiah 17:14",
    themes: ["health", "healing", "wellness"],
  },
  {
    id: "11",
    title: "Prayer for Parenting Wisdom",
    prayer: "Loving Father, You've entrusted me with the precious responsibility of raising children. I feel inadequate for this task, but Your Word promises that You give wisdom generously. Help me parent with grace and truth, discipline and love, firmness and compassion. Give me patience when I'm frustrated, wisdom when I'm uncertain, and love when I'm exhausted. Help me model Christ to my children and point them toward You in everything. Protect them, guide them, and draw their hearts to Yourself. In Jesus' name, Amen.",
    scripture: "Proverbs 22:6",
    themes: ["parenting", "family", "children"],
  },
  {
    id: "12",
    title: "Prayer for Career and Work",
    prayer: "Lord, You've called me to work as unto You, not merely for human approval. Help me excel in my job while maintaining godly character. Give me integrity in business dealings, diligence in my tasks, and wisdom in workplace relationships. Whether I'm seeking employment, facing workplace challenges, or pursuing advancement, I trust You with my career. Help me see my work as ministry and my workplace as a mission field. Use me to bring Your light into my professional world. In Jesus' name, Amen.",
    scripture: "Colossians 3:23",
    themes: ["career", "work", "profession"],
  },
  {
    id: "13",
    title: "Prayer for Purpose and Calling",
    prayer: "Father, You created me with purpose and intention. You prepared good works in advance for me to do. Help me discover and walk in my calling. Show me how to use my unique gifts, talents, and experiences for Your kingdom. Remove any confusion about my purpose and replace it with clarity and confidence. Whether my calling is in ministry, marketplace, or home, help me steward it faithfully. Let my life count for eternity. In Jesus' name, Amen.",
    scripture: "Ephesians 2:10",
    themes: ["purpose", "calling", "mission"],
  },
  {
    id: "14",
    title: "Prayer for Overcoming Fear",
    prayer: "God of courage, Your Word tells me 365 times not to fear - one for every day of the year. Yet fear still grips my heart. Whether it's fear of failure, rejection, the future, or the unknown, I bring it all to You. You have not given me a spirit of fear, but of power, love, and a sound mind. Replace my fear with faith, my anxiety with peace, and my worry with trust. Help me remember that You are with me always, and I need not be afraid. In Jesus' name, Amen.",
    scripture: "2 Timothy 1:7",
    themes: ["courage", "fear", "strength"],
  },
  {
    id: "15",
    title: "Prayer for Relationships and Unity",
    prayer: "Lord of peace, You've called me to live at peace with everyone as much as it depends on me. I lift up my relationships to You - my marriage, family, friendships, and community. Heal broken relationships, restore trust where it's been damaged, and help me forgive those who've hurt me. Give me wisdom in conflicts, patience with difficult people, and love for those who are hard to love. Help me be a peacemaker, reflecting Your reconciling love. In Jesus' name, Amen.",
    scripture: "Romans 12:18",
    themes: ["relationships", "love", "peace"],
  },
  {
    id: "16",
    title: "Prayer for Contentment",
    prayer: "Satisfying God, in a world that constantly tells me I need more, help me find contentment in You. Teach me that godliness with contentment is great gain. Help me be grateful for what I have rather than envious of what others possess. Free me from the comparison trap and the consumer mentality. Whether I have little or much, help me say with Paul that I've learned the secret of being content in any and every situation. You are enough. In Jesus' name, Amen.",
    scripture: "Philippians 4:11-13",
    themes: ["contentment", "gratitude", "peace"],
  },
  {
    id: "17",
    title: "Prayer for Patience and Perseverance",
    prayer: "Patient Father, I'm tired of waiting. The situation I've been praying about seems unchanged, and I'm losing hope. Help me remember that Your timing is perfect, even when it doesn't match mine. Give me patience to wait on You and perseverance to keep pressing forward. Strengthen my resolve to not give up or give in. Help me run with endurance the race marked out for me, keeping my eyes fixed on Jesus. In His name, Amen.",
    scripture: "James 1:2-4",
    themes: ["patience", "perseverance", "hope"],
  },
  {
    id: "18",
    title: "Prayer for Self-Control and Discipline",
    prayer: "Holy Spirit, produce in me the fruit of self-control. I struggle with habits, appetites, and impulses that don't honor You. Whether it's what I eat, watch, say, or think, I need Your help to discipline myself. Give me strength to say no to ungodliness and worldly passions, and to live self-controlled, upright, and godly lives. Help me bring every thought captive to the obedience of Christ. In Jesus' name, Amen.",
    scripture: "Galatians 5:22-23",
    themes: ["self-control", "discipline", "holiness"],
  },
  {
    id: "19",
    title: "Prayer for Joy Despite Circumstances",
    prayer: "God of all joy, my circumstances are difficult, but Your Word says to count it all joy when I face trials. Help me find supernatural joy that doesn't depend on my situation but rests in Your unchanging character. Remind me that the joy of the Lord is my strength. Even in sorrow, plant seeds of joy deep in my heart. Let my life overflow with joy that testifies to Your goodness regardless of what I'm going through. In Jesus' name, Amen.",
    scripture: "Nehemiah 8:10",
    themes: ["joy", "hope", "strength"],
  },
  {
    id: "20",
    title: "Prayer for Humility and Servanthood",
    prayer: "Humble Savior, You came not to be served but to serve, washing Your disciples' feet as an example for me. Pride so easily creeps into my heart, making me think I'm better than others or deserve special treatment. Humble me, Lord. Help me consider others better than myself and look not only to my own interests but also to the interests of others. Give me the heart of a servant, ready to help, encourage, and support. In Jesus' name, Amen.",
    scripture: "Philippians 2:3-4",
    themes: ["humility", "servanthood", "love"],
  },
  {
    id: "21",
    title: "Prayer for Rest and Renewal",
    prayer: "God of rest, I am weary and burdened, and I need Your refreshing. You invite me to come to You and find rest for my soul. Help me to slow down, to say no to the endless demands, and to prioritize time with You. Teach me the rhythm of Sabbath rest. Restore my energy, renew my mind, and refresh my spirit. Help me trust that the world will keep turning even when I rest. You are my true rest. In Jesus' name, Amen.",
    scripture: "Matthew 11:28",
    themes: ["rest", "peace", "renewal"],
  },
  {
    id: "22",
    title: "Prayer for Friendship and Community",
    prayer: "Father, You said it's not good for me to be alone. I need authentic friendships and genuine community. Bring godly friends into my life who will sharpen me, encourage me, and speak truth to me. Help me be vulnerable and real, not hiding behind masks. Give me the courage to pursue deep friendships and the wisdom to invest in them. Protect me from isolation and help me find my place in Your family. In Jesus' name, Amen.",
    scripture: "Proverbs 27:17",
    themes: ["friendship", "community", "relationships"],
  },
  {
    id: "23",
    title: "Prayer When God Feels Distant",
    prayer: "Lord, I feel like You're far away. I pray but don't sense Your presence. I worship but feel nothing. My heart cries out, 'Where are You?' Yet I choose to trust that You are near even when I can't feel You. You promised to never leave me or forsake me. Help my unbelief. Strengthen my faith during this season of silence. Remind me that Your presence isn't based on my feelings but on Your faithful promises. I will wait for You. In Jesus' name, Amen.",
    scripture: "Psalm 13:1-2",
    themes: ["faith", "trust", "perseverance"],
  },
  {
    id: "24",
    title: "Prayer for My Legacy",
    prayer: "Eternal God, help me live with eternity in mind. I want to leave a legacy of faith for those who come after me. Let my children and grandchildren see authentic faith lived out in my daily life. Help me model prayer, generosity, integrity, and love for You. May the impact of my life ripple through generations. Give me wisdom to invest in what lasts forever - relationships, character, and Your kingdom. In Jesus' name, Amen.",
    scripture: "Psalm 78:4",
    themes: ["legacy", "parenting", "purpose"],
  },
  {
    id: "25",
    title: "Prayer for Those Who Hurt Me",
    prayer: "Merciful Father, someone has hurt me deeply, and I'm struggling to forgive. The wound is real and the pain is fresh. But Your Word calls me to forgive as I've been forgiven. Give me supernatural grace to release this person from my judgment. Heal my heart and help me see them through Your eyes of compassion. I choose to forgive, not because they deserve it, but because You've forgiven me. Free me from the prison of bitterness. In Jesus' name, Amen.",
    scripture: "Colossians 3:13",
    themes: ["forgiveness", "healing", "grace"],
  },
  {
    id: "26",
    title: "Prayer for My Workplace",
    prayer: "Lord, my workplace needs Your presence. Bring Your kingdom into my office, my meetings, my interactions with coworkers. Help me work with excellence and integrity, representing You well. Give me favor with my supervisors and wisdom to navigate challenges. Let my attitude and work ethic point others to You. Help me be salt and light in this environment, bringing hope, encouragement, and Your love to everyone I encounter. In Jesus' name, Amen.",
    scripture: "Colossians 3:23",
    themes: ["work", "career", "witness"],
  },
  {
    id: "27",
    title: "Prayer for Boldness in Faith",
    prayer: "Holy Spirit, fill me with holy boldness. Too often I'm silent when I should speak up for You. I hide my faith instead of sharing it. I play it safe instead of taking risks for Your kingdom. Give me courage like Peter and Paul, who boldly proclaimed the gospel despite opposition. Help me overcome my fear of rejection or criticism. Let me be unashamed of the gospel and confident in Your truth. Use me to be a bold witness for You. In Jesus' name, Amen.",
    scripture: "Acts 4:29",
    themes: ["courage", "boldness", "witness"],
  },
  {
    id: "28",
    title: "Prayer for Breaking Generational Patterns",
    prayer: "Father, I see patterns in my family that need to be broken - patterns of anger, addiction, fear, or dysfunction. I don't want to pass these to the next generation. By the power of Your Spirit, break these cycles in my life. Heal the wounds from my past and give me new patterns rooted in Your truth. Help me choose differently, respond differently, and live differently. Let my life be a new beginning for my family line. In Jesus' name, Amen.",
    scripture: "2 Corinthians 5:17",
    themes: ["healing", "family", "freedom"],
  },
  {
    id: "29",
    title: "Prayer for My Church",
    prayer: "Lord Jesus, You love the Church and gave Yourself for her. I pray for my church family today. Unite us in love and purpose. Give our leaders wisdom and protection. Help us be the hands and feet of Jesus in our community. Break down any divisions or conflicts. Revive our passion for You and for reaching the lost. Let our church be a place where people encounter Your presence, find healing, and grow in faith. In Jesus' name, Amen.",
    scripture: "Ephesians 5:25",
    themes: ["church", "unity", "love"],
  },
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
