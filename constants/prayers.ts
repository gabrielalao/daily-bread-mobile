export type PrayerGuide = {
  id: string;
  title: string;
  description: string;
  icon: string;
  prayers: string[];
  scriptures: { verse: string; reference: string }[];
};

export const prayerGuides: PrayerGuide[] = [
  {
    id: "anxiety",
    title: "Peace & Anxiety",
    description: "When worry overwhelms your heart",
    icon: "heart",
    prayers: [
      "Lord, I bring my anxious thoughts to You. Help me trust in Your perfect plan and find peace in Your presence.",
      "Father, calm the storm in my mind. Replace my fears with Your truth and my worry with Your peace.",
      "God, I choose to cast all my cares on You, knowing that You care for me deeply and personally.",
    ],
    scriptures: [
      { verse: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
      { verse: "Peace I leave with you; my peace I give you.", reference: "John 14:27" },
    ],
  },
  {
    id: "strength",
    title: "Strength & Courage",
    description: "For when you need God's power",
    icon: "shield",
    prayers: [
      "Lord, I feel weak, but Your Word says Your strength is made perfect in my weakness. Fill me with Your power today.",
      "Father, give me courage to face what lies ahead. Help me remember that You are with me always.",
      "God, when I am afraid, I will trust in You. Be my rock and my fortress.",
    ],
    scriptures: [
      { verse: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
      { verse: "Be strong and courageous. Do not be afraid.", reference: "Joshua 1:9" },
    ],
  },
  {
    id: "relationships",
    title: "Relationships",
    description: "Wisdom for family and friendships",
    icon: "users",
    prayers: [
      "Lord, help me love others as You have loved me - with patience, kindness, and grace.",
      "Father, heal the broken relationships in my life. Give me wisdom to know when to speak and when to listen.",
      "God, help me be a peacemaker. Let my words build up and not tear down.",
    ],
    scriptures: [
      { verse: "Love one another as I have loved you.", reference: "John 13:34" },
      { verse: "Be kind and compassionate to one another.", reference: "Ephesians 4:32" },
    ],
  },
  {
    id: "gratitude",
    title: "Gratitude & Praise",
    description: "Thanking God for His blessings",
    icon: "sparkles",
    prayers: [
      "Thank You, Lord, for Your countless blessings. Help me see Your goodness in every moment.",
      "Father, I praise You for who You are - loving, faithful, and good. You are worthy of all honor.",
      "God, even in difficult times, I choose to thank You. You work all things for my good.",
    ],
    scriptures: [
      { verse: "Give thanks in all circumstances.", reference: "1 Thessalonians 5:18" },
      { verse: "This is the day the Lord has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" },
    ],
  },
  {
    id: "guidance",
    title: "Guidance & Wisdom",
    description: "Seeking direction for decisions",
    icon: "compass",
    prayers: [
      "Lord, I need Your wisdom today. Guide my steps and help me make choices that honor You.",
      "Father, Your Word is a lamp to my feet. Illuminate the path I should take.",
      "God, I trust Your timing and Your plan. Give me patience to wait and courage to move when You call.",
    ],
    scriptures: [
      { verse: "Trust in the Lord with all your heart.", reference: "Proverbs 3:5-6" },
      { verse: "If any of you lacks wisdom, ask God.", reference: "James 1:5" },
    ],
  },
  {
    id: "forgiveness",
    title: "Forgiveness",
    description: "Finding freedom through grace",
    icon: "check-circle",
    prayers: [
      "Lord, help me forgive those who have hurt me, just as You have forgiven me.",
      "Father, I release the burden of bitterness. Fill my heart with Your peace and grace.",
      "God, thank You for Your mercy. Help me extend that same mercy to others.",
    ],
    scriptures: [
      { verse: "Forgive as the Lord forgave you.", reference: "Colossians 3:13" },
      { verse: "If we confess our sins, he is faithful and just to forgive us.", reference: "1 John 1:9" },
    ],
  },
  {
    id: "financial-wisdom",
    title: "Financial Wisdom",
    description: "Seeking God's guidance for money matters",
    icon: "dollar-sign",
    prayers: [
      "Lord, teach me to be a faithful steward of the resources You've entrusted to me. Give me wisdom to manage money according to Your principles.",
      "Father, I surrender my finances to You. Help me trust Your provision and seek Your kingdom first, knowing You will meet all my needs.",
      "God, break any unhealthy attachment to money in my heart. Help me use finances as a tool for Your glory, not as my source of security.",
      "Lord, give me discipline to budget wisely, generosity to give freely, and contentment with what I have. Protect me from greed and financial anxiety.",
    ],
    scriptures: [
      { verse: "Honor the Lord with your wealth, with the firstfruits of all your crops.", reference: "Proverbs 3:9" },
      { verse: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", reference: "Matthew 6:33" },
      { verse: "My God will meet all your needs according to the riches of his glory in Christ Jesus.", reference: "Philippians 4:19" },
    ],
  },
  {
    id: "debt-freedom",
    title: "Debt & Financial Freedom",
    description: "Breaking free from financial bondage",
    icon: "unlock",
    prayers: [
      "Lord, I bring my financial burdens to You. Give me wisdom to create a plan to eliminate debt and the discipline to follow through.",
      "Father, I confess I've made poor financial decisions. Forgive me and help me learn from my mistakes. Guide me toward financial freedom.",
      "God, I feel trapped by debt. Give me hope and clarity. Open doors for provision and help me make wise choices moving forward.",
      "Lord, as I work toward freedom from debt, help me remain generous and faithful in giving. Teach me to trust You even in financial difficulty.",
    ],
    scriptures: [
      { verse: "The rich rule over the poor, and the borrower is slave to the lender.", reference: "Proverbs 22:7" },
      { verse: "Let no debt remain outstanding, except the continuing debt to love one another.", reference: "Romans 13:8" },
      { verse: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
    ],
  },
  {
    id: "business-wisdom",
    title: "Business & Entrepreneurship",
    description: "Prayers for Christian entrepreneurs and business leaders",
    icon: "briefcase",
    prayers: [
      "Lord, I dedicate my business to You. Help me run it with integrity, wisdom, and excellence that brings glory to Your name.",
      "Father, give me discernment for important business decisions. Guide my strategies, my hiring, and my partnerships according to Your will.",
      "God, when I face business challenges and uncertainty, help me trust You as my ultimate provider and source of wisdom.",
      "Lord, help me treat my employees, customers, and competitors with Christ-like love and fairness. Let my business be a testimony of Your goodness.",
      "Father, protect me from greed and the love of money. Help me pursue profit ethically while keeping eternal values first.",
    ],
    scriptures: [
      { verse: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3" },
      { verse: "Whatever you do, work at it with all your heart, as working for the Lord.", reference: "Colossians 3:23" },
      { verse: "The Lord will open the heavens, the storehouse of his bounty, to bless all the work of your hands.", reference: "Deuteronomy 28:12" },
    ],
  },
  {
    id: "marketplace-impact",
    title: "Kingdom Impact in Business",
    description: "Using your business as a platform for God's purposes",
    icon: "target",
    prayers: [
      "Lord, help me see my business not just as a means of income, but as a ministry platform to advance Your kingdom.",
      "Father, give me opportunities to share Your love through my work. Let my ethics, generosity, and character point others to You.",
      "God, help me create a workplace culture that reflects Your values - where people are valued, excellence is pursued, and integrity is non-negotiable.",
      "Lord, give me wisdom to balance profit with purpose. Help me make decisions that honor You even when they cost me financially.",
      "Father, use my business to create jobs, serve communities, and be a force for good in the marketplace.",
    ],
    scriptures: [
      { verse: "You are the light of the world. Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", reference: "Matthew 5:14-16" },
      { verse: "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus.", reference: "Colossians 3:17" },
      { verse: "For we are God's handiwork, created in Christ Jesus to do good works.", reference: "Ephesians 2:10" },
    ],
  },
  {
    id: "work-life-harmony",
    title: "Work-Life Balance",
    description: "Finding rest and boundaries in entrepreneurship",
    icon: "scale",
    prayers: [
      "Lord, help me establish healthy boundaries between work and rest. Teach me that my worth isn't defined by my productivity.",
      "Father, give me wisdom to prioritize what truly matters - family, health, and spiritual growth alongside business success.",
      "God, protect me from burnout. Help me recognize when I need to rest and give me courage to step away when necessary.",
      "Lord, help me trust that You work while I rest. Free me from the anxiety that says I must work constantly to succeed.",
      "Father, as I pursue business goals, keep my heart anchored in You. Don't let success corrupt me or failure define me.",
    ],
    scriptures: [
      { verse: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28" },
      { verse: "In vain you rise early and stay up late, toiling for food to eat - for he grants sleep to those he loves.", reference: "Psalm 127:2" },
      { verse: "The Sabbath was made for man, not man for the Sabbath.", reference: "Mark 2:27" },
    ],
  },
  {
    id: "wealth-building",
    title: "Wealth Building & Investment",
    description: "Seeking God's wisdom for growing wealth responsibly",
    icon: "trending-up",
    prayers: [
      "Lord, teach me to be a wise steward who multiplies resources for Your kingdom. Guide my investment decisions with Your wisdom.",
      "Father, help me build wealth not for selfish gain, but to bless my family, support Your work, and create opportunities for generosity.",
      "God, give me discernment to recognize good opportunities and the courage to step out in faith when You lead me to invest.",
      "Lord, protect me from greed and the love of money. Keep my heart anchored in You as my true treasure, even as I grow in financial resources.",
    ],
    scriptures: [
      { verse: "Well then, you should have put my money on deposit with the bankers, so that when I returned I would have received it back with interest.", reference: "Matthew 25:27" },
      { verse: "Dishonest money dwindles away, but whoever gathers money little by little makes it grow.", reference: "Proverbs 13:11" },
      { verse: "The Lord will open the heavens, the storehouse of his bounty, to bless all the work of your hands.", reference: "Deuteronomy 28:12" },
    ],
  },
  {
    id: "health-healing",
    title: "Health & Healing",
    description: "Prayers for physical wellness and healing",
    icon: "heart-pulse",
    prayers: [
      "Lord, You are the Great Physician. I ask for Your healing touch on my body. Restore what is broken and strengthen what is weak.",
      "Father, help me honor You with my body through healthy choices. Give me discipline to care for the temple You've given me.",
      "God, when I struggle with health challenges, be my comfort and strength. Remind me that You are with me in every moment of weakness.",
      "Lord, guide the hands of doctors and medical professionals. Give them wisdom as they treat me, and work through their knowledge to bring healing.",
    ],
    scriptures: [
      { verse: "Do you not know that your bodies are temples of the Holy Spirit? Therefore honor God with your bodies.", reference: "1 Corinthians 6:19-20" },
      { verse: "Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.", reference: "Jeremiah 17:14" },
      { verse: "He himself bore our sins in his body on the cross, so that we might die to sins and live for righteousness; by his wounds you have been healed.", reference: "1 Peter 2:24" },
    ],
  },
  {
    id: "parenting-grace",
    title: "Parenting with Grace",
    description: "Wisdom and strength for raising children",
    icon: "users",
    prayers: [
      "Lord, give me wisdom to parent these precious children You've entrusted to me. Help me model Your love, grace, and truth in tangible ways.",
      "Father, when I feel overwhelmed and inadequate, remind me that You are the perfect parent and You guide me with Your Spirit.",
      "God, help me see my children through Your eyes. Give me patience when I'm frustrated, gentleness when I'm angry, and grace when I mess up.",
      "Lord, protect my children's hearts, minds, and bodies. Draw them close to You and let them experience Your love through our family.",
    ],
    scriptures: [
      { verse: "Start children off on the way they should go, and even when they are old they will not turn from it.", reference: "Proverbs 22:6" },
      { verse: "These commandments that I give you today are to be on your hearts. Impress them on your children.", reference: "Deuteronomy 6:6-7" },
      { verse: "Children are a heritage from the Lord, offspring a reward from him.", reference: "Psalm 127:3" },
    ],
  },
  {
    id: "investment-wisdom",
    title: "Investment & Wealth Building",
    description: "Prayers for wise investing and multiplying resources",
    icon: "trending-up",
    prayers: [
      "Lord, give me wisdom to invest the resources You've entrusted to me. Help me be patient, disciplined, and strategic in building wealth for Your purposes.",
      "Father, protect me from greed and the love of money as I invest. Keep my heart focused on You as my source, not on riches as my security.",
      "God, help me learn and grow in financial knowledge. Guide my investment decisions and multiply what I steward for Your glory and my family's provision.",
      "Lord, help me view investing as stewardship, not speculation. Give me discernment to make wise choices and patience to let resources grow steadily over time.",
    ],
    scriptures: [
      { verse: "Dishonest money dwindles away, but whoever gathers money little by little makes it grow.", reference: "Proverbs 13:11" },
      { verse: "The wise store up choice food and olive oil, but fools gulp theirs down.", reference: "Proverbs 21:20" },
      { verse: "Well then, you should have put my money on deposit with the bankers, so that when I returned I would have received it back with interest.", reference: "Matthew 25:27" },
    ],
  },
  {
    id: "career-calling",
    title: "Career Development",
    description: "Prayers for professional growth and career direction",
    icon: "briefcase",
    prayers: [
      "Lord, guide my career path. Show me opportunities to grow, skills to develop, and ways to increase my impact and value in the workplace.",
      "Father, help me see my career as part of Your calling on my life. Give me excellence in my work and clarity about my professional direction.",
      "God, open doors for advancement and close doors that don't align with Your purposes. Help me develop skills that serve Your kingdom and bless others.",
      "Lord, connect me with mentors, teachers, and opportunities that will develop my gifts and expand my capacity for meaningful work.",
    ],
    scriptures: [
      { verse: "Do you see someone skilled in their work? They will serve before kings.", reference: "Proverbs 22:29" },
      { verse: "Whatever you do, work at it with all your heart, as working for the Lord.", reference: "Colossians 3:23" },
      { verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
    ],
  },
  {
    id: "budgeting-stewardship",
    title: "Budgeting & Financial Planning",
    description: "Prayers for creating and maintaining wise financial plans",
    icon: "calculator",
    prayers: [
      "Lord, help me create a budget that honors You. Give me discipline to track spending, wisdom to prioritize needs, and contentment with what I have.",
      "Father, show me where money is being wasted and help me redirect it toward Your purposes - giving, saving, and wise living.",
      "God, help me be intentional with finances rather than reactive. Give me a plan that creates peace and aligns with Your priorities.",
      "Lord, when budgeting feels restrictive, remind me it's actually freedom - a tool that helps me steward Your resources faithfully.",
    ],
    scriptures: [
      { verse: "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost?", reference: "Luke 14:28" },
      { verse: "The plans of the diligent lead to profit as surely as haste leads to poverty.", reference: "Proverbs 21:5" },
      { verse: "Be sure you know the condition of your flocks, give careful attention to your herds.", reference: "Proverbs 27:23" },
    ],
  },
  {
    id: "communication-relationships",
    title: "Communication Skills",
    description: "Prayers for healthy, Christ-centered communication",
    icon: "message-circle",
    prayers: [
      "Lord, help me be quick to listen and slow to speak. Give me wisdom to communicate with grace, truth, and understanding.",
      "Father, tame my tongue. Help me speak words that build up rather than tear down, that heal rather than harm.",
      "God, teach me to listen with empathy, respond with patience, and resolve conflicts with humility and love.",
      "Lord, help me communicate clearly and kindly in my relationships. Give me courage to speak truth and grace to hear it.",
    ],
    scriptures: [
      { verse: "Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up.", reference: "Ephesians 4:29" },
      { verse: "Everyone should be quick to listen, slow to speak and slow to become angry.", reference: "James 1:19" },
      { verse: "A gentle answer turns away wrath, but a harsh word stirs up anger.", reference: "Proverbs 15:1" },
    ],
  },
  {
    id: "income-growth",
    title: "Income Management & Growth",
    description: "Prayers for increasing earning potential and managing income wisely",
    icon: "dollar-sign",
    prayers: [
      "Lord, show me opportunities to increase my income through diligent work, skill development, and wise decisions.",
      "Father, help me steward the income I have faithfully while seeking ways to expand my earning capacity for Your purposes.",
      "God, give me creativity and favor in the marketplace. Help me provide abundantly for my family and give generously to others.",
      "Lord, as my income grows, keep my heart humble and generous. Help me use increased resources for Your kingdom, not selfish gain.",
    ],
    scriptures: [
      { verse: "Lazy hands make for poverty, but diligent hands bring wealth.", reference: "Proverbs 10:4" },
      { verse: "Remember the Lord your God, for it is he who gives you the ability to produce wealth.", reference: "Deuteronomy 8:18" },
      { verse: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.", reference: "Philippians 4:19" },
    ],
  },
  {
    id: "financial-freedom-journey",
    title: "Journey to Financial Freedom",
    description: "Prayers for pursuing lasting financial peace and liberty",
    icon: "unlock",
    prayers: [
      "Lord, I commit to the journey toward financial freedom. Give me discipline to save, wisdom to plan, and patience to persevere.",
      "Father, help me break free from debt, financial anxiety, and the pressure to keep up with others. Let me find true freedom in You.",
      "God, help me build margin in my finances - an emergency fund, wise investments, and freedom from paycheck-to-paycheck living.",
      "Lord, financial freedom isn't just about money - it's about being free to follow Your calling. Help me pursue freedom that serves Your purposes.",
    ],
    scriptures: [
      { verse: "So if the Son sets you free, you will be free indeed.", reference: "John 8:36" },
      { verse: "The borrower is slave to the lender.", reference: "Proverbs 22:7" },
      { verse: "Let no debt remain outstanding, except the continuing debt to love one another.", reference: "Romans 13:8" },
    ],
  },
  {
    id: "exercise-fitness",
    title: "Exercise & Physical Fitness",
    description: "Prayers for honoring God through physical wellness",
    icon: "activity",
    prayers: [
      "Lord, help me honor You with my body through regular exercise. Give me discipline to move, energy to persevere, and joy in caring for this temple.",
      "Father, physical fitness isn't vanity - it's stewardship. Help me take care of my body so I can serve You and others more effectively.",
      "God, when I lack motivation to exercise, remind me that a healthy body supports a healthy mind and spirit. Strengthen my resolve to move daily.",
      "Lord, let exercise be an act of worship - a time to pray, give thanks, and prepare my body for Your purposes.",
    ],
    scriptures: [
      { verse: "Do you not know that your bodies are temples of the Holy Spirit? Therefore honor God with your bodies.", reference: "1 Corinthians 6:19-20" },
      { verse: "For physical training is of some value, but godliness has value for all things.", reference: "1 Timothy 4:8" },
      { verse: "I discipline my body like an athlete, training it to do what it should.", reference: "1 Corinthians 9:27" },
    ],
  },
];

export function getRecommendedPrayers(viewedIds: string[], preferredCategories: string[] = []): PrayerGuide[] {
  const unviewed = prayerGuides.filter(p => !viewedIds.includes(p.id));
  
  if (preferredCategories.length > 0) {
    const preferred = unviewed.filter(p => 
      preferredCategories.some(cat => 
        p.title.toLowerCase().includes(cat.toLowerCase()) ||
        p.description.toLowerCase().includes(cat.toLowerCase())
      )
    );
    
    const other = unviewed.filter(p => !preferred.includes(p));
    return [...preferred, ...other];
  }
  
  return [...unviewed, ...prayerGuides.filter(p => viewedIds.includes(p.id))];
}
