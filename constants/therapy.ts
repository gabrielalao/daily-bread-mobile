export type TherapyContent = {
  id: string;
  date: string;
  title: string;
  category: string;
  topic: string;
  scripture: string;
  verse: string;
  therapeuticFocus: string;
  practicalSteps: string[];
  reflection: string;
  prayerPrompt: string;
};

export const therapyContents: TherapyContent[] = [
  {
    id: "1",
    date: "2025-01-25",
    title: "Breaking Free from Anxiety",
    category: "Mental Health",
    topic: "Anxiety & Worry",
    scripture: "Matthew 6:34",
    verse: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",
    therapeuticFocus: "Anxiety often stems from projecting our fears into the future. Christ teaches us to focus on today, practicing mindfulness rooted in God's presence. This isn't about ignoring real concerns, but about releasing what we cannot control and trusting God with our tomorrows.",
    practicalSteps: [
      "Take 5 deep breaths, naming one thing you're grateful for with each exhale",
      "Write down your worries and physically hand them to God in prayer",
      "Identify one small, actionable step you can take today",
      "When anxious thoughts arise, gently redirect your mind to God's faithfulness"
    ],
    reflection: "Jesus doesn't promise a life without troubles, but He does promise His presence in each moment. Today's struggles are enough to focus on - tomorrow's haven't arrived yet. What if God's grace is sufficient for today, and tomorrow's grace will be there when you need it?",
    prayerPrompt: "Lord, I release my grip on tomorrow and place it in Your hands. Help me be fully present in this moment, trusting that Your grace is sufficient for today."
  },
  {
    id: "2",
    date: "2025-01-26",
    title: "Healing from Past Wounds",
    category: "Emotional Healing",
    topic: "Trauma & Forgiveness",
    scripture: "Psalm 147:3",
    verse: "He heals the brokenhearted and binds up their wounds.",
    therapeuticFocus: "God doesn't minimize our pain or rush our healing. He enters into our suffering and slowly, gently restores what's been broken. Healing isn't linear - some days are harder than others. But with each small step, God is working restoration in ways we can't always see.",
    practicalSteps: [
      "Acknowledge your pain without judgment - it's okay to not be okay",
      "Identify one safe person you can share your story with",
      "Practice self-compassion: speak to yourself as God speaks to you - with kindness",
      "Journal about one small way you've grown through this pain"
    ],
    reflection: "Your wounds don't define you, but they're part of your story. God can use what was meant to harm you and transform it into a testimony of His faithfulness. Healing takes time, and that's okay. Be patient with yourself as God works His restorative power in your life.",
    prayerPrompt: "Healer God, You see my pain and You care. I invite You into the broken places of my heart. Begin Your work of restoration, even when I can't feel it yet."
  },
  {
    id: "3",
    date: "2025-01-27",
    title: "Finding Your Worth",
    category: "Identity & Self-Esteem",
    topic: "Self-Worth",
    scripture: "Ephesians 2:10",
    verse: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
    therapeuticFocus: "Your worth isn't determined by your productivity, appearance, or achievements. You are God's masterpiece - intentionally designed with purpose. When you struggle with self-worth, it's often because you're measuring yourself by the wrong standards.",
    practicalSteps: [
      "Make a list of 5 qualities God has placed in you (ask a trusted friend if needed)",
      "Replace 'I'm not enough' thoughts with 'I am God's handiwork'",
      "Identify one area where you're comparing yourself to others and choose to stop",
      "Celebrate one small accomplishment today, recognizing it as God working through you"
    ],
    reflection: "You were created with intention and purpose. Even on your worst day, your value hasn't changed because it's rooted in who God says you are, not in what you do or how you feel. What would change if you truly believed you were God's masterpiece?",
    prayerPrompt: "Creator God, help me see myself through Your eyes. When I feel inadequate, remind me that I am fearfully and wonderfully made, chosen and loved by You."
  },
  {
    id: "4",
    date: "2025-01-28",
    title: "Managing Depression",
    category: "Mental Health",
    topic: "Depression & Hope",
    scripture: "Psalm 42:11",
    verse: "Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.",
    therapeuticFocus: "Depression can make you feel isolated and hopeless, but notice how the psalmist talks to his own soul. You can acknowledge the darkness while still choosing hope. This isn't toxic positivity - it's honest faith that says 'I'm struggling, but I'm not giving up on God.'",
    practicalSteps: [
      "Do one small thing today: take a shower, step outside, or eat a nutritious meal",
      "Reach out to someone - even a simple text saying 'I'm struggling today'",
      "Identify one lie depression is telling you, then speak God's truth over it",
      "If depression persists, consider talking to a Christian counselor or healthcare provider"
    ],
    reflection: "Depression isn't a sign of weak faith - it's a real struggle that many biblical heroes faced. David, Elijah, and Jeremiah all experienced deep despair. God didn't condemn them; He met them in their darkness. He's doing the same for you right now.",
    prayerPrompt: "God of hope, depression feels overwhelming. I'm holding on to You, even when I can't feel Your presence. Be my light in this darkness and help me take the next small step forward."
  },
  {
    id: "5",
    date: "2025-01-29",
    title: "Setting Healthy Boundaries",
    category: "Relationships",
    topic: "Boundaries & Relationships",
    scripture: "Proverbs 4:23",
    verse: "Above all else, guard your heart, for everything you do flows from it.",
    therapeuticFocus: "Setting boundaries isn't selfish - it's wise stewardship of the life God has given you. Jesus Himself withdrew from crowds to rest and pray. Boundaries protect your mental, emotional, and spiritual health so you can love others from a place of fullness, not depletion.",
    practicalSteps: [
      "Identify one relationship or commitment that consistently drains you",
      "Practice saying 'no' to something this week without over-explaining",
      "Communicate one boundary clearly and kindly: 'I'm not able to... but I can...'",
      "Notice guilt that arises and remind yourself: boundaries are biblical, not selfish"
    ],
    reflection: "Healthy boundaries aren't walls that keep people out - they're fences that protect what God has entrusted to you. When you guard your heart, you're actually able to love others more authentically because you're giving from overflow, not from emptiness.",
    prayerPrompt: "Lord, give me wisdom to know when to say yes and courage to say no. Help me establish boundaries that honor You and protect the life You've given me to steward."
  },
  {
    id: "6",
    date: "2025-01-30",
    title: "Processing Grief and Loss",
    category: "Emotional Healing",
    topic: "Grief & Loss",
    scripture: "Psalm 34:18",
    verse: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    therapeuticFocus: "Grief is not something to 'get over' - it's something to move through. God doesn't hurry our healing or dismiss our pain. He enters into it with us. Whether you've lost a person, a dream, a relationship, or a season of life, your grief matters to God.",
    practicalSteps: [
      "Allow yourself to feel without judging your emotions - all feelings are valid",
      "Create a small ritual to honor what you've lost (write a letter, light a candle, visit a meaningful place)",
      "Reach out to a grief support group or counselor who understands loss",
      "Be patient with yourself - grief has no timeline"
    ],
    reflection: "Jesus wept at Lazarus' tomb even though He was about to raise him from the dead. This shows us that grief is not a lack of faith - it's a natural response to loss. God is big enough to hold your sorrow and your questions. You don't have to pretend to be okay.",
    prayerPrompt: "God of comfort, my heart is heavy with loss. Be near to me in this pain. Help me grieve honestly while holding on to the hope that You are making all things new."
  },
  {
    id: "7",
    date: "2025-01-31",
    title: "Finding Peace in Financial Stress",
    category: "Financial Wellness",
    topic: "Financial Stress & Stewardship",
    scripture: "Matthew 6:31-33",
    verse: "So do not worry, saying, 'What shall we eat?' or 'What shall we drink?' or 'What shall we wear?' For the pagans run after all these things, and your heavenly Father knows that you need them. But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    therapeuticFocus: "Financial stress is one of the most common sources of anxiety, but God invites us to shift our focus from lack to trust. This doesn't mean ignoring practical responsibilities, but rather approaching them with faith rather than fear. God promises to provide for our needs as we prioritize His kingdom.",
    practicalSteps: [
      "Write down your financial concerns and identify which ones are needs vs. wants",
      "Create a simple budget to gain clarity and control over your finances",
      "Practice gratitude by listing 10 ways God has provided for you in the past",
      "Consider one small step toward financial wisdom: start an emergency fund, reduce unnecessary expenses, or seek financial counseling"
    ],
    reflection: "Financial worry often stems from believing the lie that our provision depends solely on us. But when we remember that God is our ultimate provider and good steward, we can make wise financial decisions from a place of peace rather than panic. What if your current financial challenge is an opportunity to deepen your trust in God?",
    prayerPrompt: "Provider God, I bring my financial worries to You. Help me be wise with what You've given me while trusting that You will meet my needs. Teach me to be a faithful steward of Your resources."
  },
  {
    id: "8",
    date: "2025-02-01",
    title: "Breaking Free from Financial Bondage",
    category: "Financial Wellness",
    topic: "Debt & Financial Freedom",
    scripture: "Proverbs 22:7",
    verse: "The rich rule over the poor, and the borrower is slave to the lender.",
    therapeuticFocus: "Debt can feel like chains that limit your freedom and fuel anxiety. While debt itself isn't sin, it can become a burden that hinders your ability to follow God's calling. Breaking free requires both practical action and spiritual transformation - changing not just your spending habits, but your heart's relationship with money.",
    practicalSteps: [
      "Face your debt honestly: make a list of all debts with amounts and interest rates",
      "Create a debt payoff plan using the snowball (smallest first) or avalanche (highest interest first) method",
      "Identify one expense you can cut this week and redirect that money toward debt",
      "Find an accountability partner or Christian financial counselor to support your journey"
    ],
    reflection: "Financial freedom isn't just about having money - it's about being free to use your resources according to God's purposes rather than being controlled by obligations. Every small payment toward debt is a step toward freedom. Remember: the journey out of debt takes time, but God is faithful to provide wisdom and strength for each step.",
    prayerPrompt: "Lord, I confess I've made mistakes with money. Give me wisdom to make a plan, discipline to stick to it, and patience to see it through. Help me experience the freedom You desire for my life."
  },
  {
    id: "9",
    date: "2025-02-02",
    title: "Contentment in Every Season",
    category: "Financial Wellness",
    topic: "Contentment & Comparison",
    scripture: "Philippians 4:11-12",
    verse: "I have learned to be content whatever the circumstances. I know what it is to be in need, and I know what it is to have plenty. I have learned the secret of being content in any and every situation, whether well fed or hungry, whether living in plenty or in want.",
    therapeuticFocus: "In a culture of constant comparison and consumption, contentment is revolutionary. Financial stress often comes not from actual lack, but from comparing ourselves to others or believing we need more than we have. True contentment is learned - it's a spiritual discipline that frees us from the endless pursuit of more.",
    practicalSteps: [
      "Practice a 'content audit': identify areas where you're comparing your finances to others",
      "Implement a 24-hour rule before making non-essential purchases",
      "Unfollow social media accounts that trigger financial comparison or dissatisfaction",
      "Each day this week, thank God for one financial blessing you currently enjoy"
    ],
    reflection: "Paul's secret to contentment wasn't positive thinking - it was Christ's strength. He learned to rest in God's sufficiency whether he had much or little. What if contentment isn't about having enough money, but about knowing you have enough of God? When Christ is your treasure, you're rich regardless of your bank balance.",
    prayerPrompt: "Lord Jesus, You are my true treasure. Help me find my satisfaction in You rather than in things. Teach me to be content with what I have while being wise with what You've given me."
  },
  {
    id: "10",
    date: "2025-02-03",
    title: "Business Decisions & God's Wisdom",
    category: "Business & Entrepreneurship",
    topic: "Entrepreneurial Stress",
    scripture: "Proverbs 16:3",
    verse: "Commit to the Lord whatever you do, and he will establish your plans.",
    therapeuticFocus: "Running a business can create unique stress - decision fatigue, financial uncertainty, responsibility for employees, and pressure to succeed. God doesn't promise business will be easy, but He does promise wisdom when we commit our work to Him. Your business isn't separate from your faith - it's an extension of your calling and stewardship.",
    practicalSteps: [
      "Start your work day with prayer, committing your business decisions to God",
      "Create a 'God first' policy: pause before major decisions to pray and seek counsel",
      "Identify one business stress and write down 3 practical steps you can take today",
      "Find one trusted Christian mentor or business advisor for accountability"
    ],
    reflection: "Entrepreneurship requires both faith and wisdom. Success isn't measured solely by profits, but by faithfulness to God's principles in how you conduct business. When you commit your plans to the Lord, you're inviting Him into your boardroom, your customer interactions, and your strategic decisions. What if your business is not just about making money, but about advancing God's kingdom through ethical practices, generous employment, and excellent service?",
    prayerPrompt: "Lord, I commit my business to You. Give me wisdom for decisions, integrity in dealings, and peace in uncertainty. Help me build something that glorifies You and serves others well."
  },
  {
    id: "11",
    date: "2025-02-04",
    title: "Work-Life Balance for Entrepreneurs",
    category: "Business & Entrepreneurship",
    topic: "Burnout & Rest",
    scripture: "Mark 6:31",
    verse: "Then, because so many people were coming and going that they did not even have a chance to eat, he said to them, 'Come with me by yourselves to a quiet place and get some rest.'",
    therapeuticFocus: "Entrepreneurs often struggle with boundaries - your business is always with you. But even Jesus, in the midst of ministry demands, prioritized rest. Burnout doesn't honor God; it actually hinders your effectiveness. Sustainable success requires rhythms of work and rest, engagement and withdrawal. You can't pour from an empty cup.",
    practicalSteps: [
      "Set one non-negotiable boundary this week: a rest day, family time, or work cutoff hour",
      "Identify signs of burnout: irritability, exhaustion, loss of passion - address them now",
      "Delegate one task you've been holding onto but could train someone else to do",
      "Schedule a weekly Sabbath - completely disconnect from business for 24 hours"
    ],
    reflection: "Jesus had limited time on earth and an urgent mission, yet He regularly withdrew to rest and pray. If the Son of God needed rest, how much more do you? Your worth isn't in your productivity. Building a business is a marathon, not a sprint. What changes would create healthier rhythms in your work life?",
    prayerPrompt: "Father, help me release the lie that I must work constantly to succeed. Teach me to rest in Your timing and trust that You work while I sleep. Give me wisdom to build sustainable rhythms."
  },
  {
    id: "12",
    date: "2025-02-05",
    title: "Fear of Failure in Business",
    category: "Business & Entrepreneurship",
    topic: "Fear & Risk-Taking",
    scripture: "2 Timothy 1:7",
    verse: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    therapeuticFocus: "Entrepreneurship involves risk, and with risk comes fear of failure. But fear from God isn't the same as fear from circumstances. God gives power (to take action), love (for people and your calling), and a sound mind (to make wise decisions). Failure isn't fatal - it's often the path to wisdom. Many biblical heroes experienced setbacks before their greatest victories.",
    practicalSteps: [
      "Write down your worst business fear - then write God's truth that counters it",
      "Reframe 'failure' as 'learning': list 3 lessons from a past business setback",
      "Take one calculated risk you've been avoiding due to fear",
      "Create a support network: find 2-3 fellow Christian entrepreneurs for encouragement"
    ],
    reflection: "Thomas Edison said he didn't fail 10,000 times; he found 10,000 ways that didn't work. Biblical examples like David, Joseph, and Paul all faced major setbacks before their breakthroughs. Fear keeps you paralyzed; faith keeps you moving forward with wisdom. God isn't asking you to be reckless, but He is asking you to trust Him with the outcomes. What bold step is God asking you to take?",
    prayerPrompt: "Lord, I confess my fear of failure. Replace it with courage rooted in Your promises. Help me take wise risks, learn from mistakes, and trust that You work all things for good."
  },
  {
    id: "13",
    date: "2025-02-06",
    title: "Biblical Wealth Management",
    category: "Wealth Management",
    topic: "Financial Stewardship & Planning",
    scripture: "Luke 14:28",
    verse: "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost to see if you have enough money to complete it?",
    therapeuticFocus: "Many Christians feel anxiety around wealth management, caught between worldly financial pressure and spiritual values. But God doesn't condemn planning - He commends wise stewardship. Biblical wealth management means being intentional with resources, planning for the future, while keeping your heart anchored in God's kingdom, not in riches.",
    practicalSteps: [
      "Create or review your budget this week - track where money goes and align spending with biblical priorities",
      "Set up three financial 'buckets': giving (10%+), saving (20%), and living (70%)",
      "Identify one area of financial stress and write down three practical steps to address it",
      "Schedule a monthly 'financial stewardship review' to pray over your finances and adjust as needed"
    ],
    reflection: "Wealth management isn't about getting rich - it's about being faithful with what God has entrusted to you. Whether you have much or little, wise planning honors God and provides peace. Jesus taught planning in the parable of building a tower. When you manage money biblically, you're not trusting in wealth - you're trusting God enough to steward His resources well.",
    prayerPrompt: "Lord, teach me to manage money with wisdom and faith. Help me plan diligently while trusting You completely. Give me contentment with what I have and generosity with what You've given me."
  },
  {
    id: "14",
    date: "2025-02-07",
    title: "Investing with Kingdom Values",
    category: "Wealth Management",
    topic: "Wealth Building & Investing",
    scripture: "Matthew 25:27",
    verse: "Well then, you should have put my money on deposit with the bankers, so that when I returned I would have received it back with interest.",
    therapeuticFocus: "Some Christians feel guilty about investing or building wealth, but Jesus' parable of the talents teaches that multiplying resources is biblical stewardship. The question isn't whether to grow wealth, but how and why. Are you building wealth to hoard it or to increase your capacity to give, provide for your family, and advance God's kingdom?",
    practicalSteps: [
      "Research faith-based investment options that align with Christian values",
      "Set a long-term financial goal: retirement, kids' education, or ministry funding",
      "Start small if you haven't invested yet - even $50/month compounds over time",
      "Pray over investment decisions, asking God to guide you toward wise stewardship"
    ],
    reflection: "Building wealth isn't wrong when your motives are right. Joseph stored grain in Egypt's abundance to provide during famine. Solomon built immense wealth yet maintained wisdom about its limits. The key is keeping your heart unattached - using wealth as a tool for kingdom purposes, not as your source of security or identity.",
    prayerPrompt: "Father, help me build wealth with kingdom purposes in mind. Protect my heart from greed while giving me wisdom to multiply what You've given me. May my wealth become a blessing to others."
  },
  {
    id: "15",
    date: "2025-02-08",
    title: "Health as Holy Stewardship",
    category: "Health Management",
    topic: "Physical Health & Wellness",
    scripture: "1 Corinthians 6:19-20",
    verse: "Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own; you were bought at a price. Therefore honor God with your bodies.",
    therapeuticFocus: "Physical health is spiritual stewardship. Your body is the temple where God's Spirit dwells. Neglecting health isn't humility - it's poor stewardship that limits your ability to serve God and others. Taking care of your body through nutrition, exercise, rest, and medical care honors the One who created you and redeemed you.",
    practicalSteps: [
      "Commit to one health goal this week: 30 minutes of movement daily, more water, or better sleep",
      "Schedule any overdue medical appointments (checkup, dental, vision)",
      "Identify one unhealthy habit to replace with a healthier alternative",
      "Pray before meals, thanking God for nourishment and asking Him to help you honor your body"
    ],
    reflection: "Jesus cared for people's physical needs - He fed thousands, healed the sick, and rested when tired. He didn't separate spiritual and physical wellbeing. When you care for your health, you're not being selfish; you're being a faithful steward. A healthy body gives you energy to love others, serve God, and fulfill your calling.",
    prayerPrompt: "Lord, help me see my body as Your temple. Give me discipline to care for my health and wisdom to make choices that honor You. Heal what's broken and strengthen what's weak."
  },
  {
    id: "16",
    date: "2025-02-09",
    title: "Breaking Free from Health Anxiety",
    category: "Health Management",
    topic: "Health Anxiety & Trust",
    scripture: "Psalm 139:14",
    verse: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
    therapeuticFocus: "Health anxiety can be paralyzing - every symptom feels catastrophic, every ache triggers fear. But God created your body with incredible resilience and healing capacity. While it's wise to address real health concerns, obsessive worry doesn't change outcomes - it only steals peace. Trusting God with your health means taking practical steps while releasing fear.",
    practicalSteps: [
      "Write down specific health fears and place them in a 'God box' - physically giving them to Him",
      "Limit health-related internet searches to reliable sources and set a daily time limit",
      "Practice body gratitude: thank God for what your body can do, not just what worries you",
      "When anxiety spikes, take 10 deep breaths and pray 'Lord, I trust You with my health'"
    ],
    reflection: "Your body is fearfully and wonderfully made. Even in illness or weakness, God is present. David had health struggles, Paul had his 'thorn in the flesh,' yet they found strength in God's grace. Health anxiety isn't trusting God less - it's learning to trust Him more with something precious. He knows every cell, every system. You're held in His hands.",
    prayerPrompt: "God, You created my body and know it intimately. Calm my anxious thoughts about health. Help me take wise action without living in fear. I trust You with every breath I take."
  },
  {
    id: "17",
    date: "2025-02-10",
    title: "Raising Kids with Biblical Wisdom",
    category: "Parenting Management",
    topic: "Parenting & Discipleship",
    scripture: "Proverbs 22:6",
    verse: "Start children off on the way they should go, and even when they are old they will not turn from it.",
    therapeuticFocus: "Parenting is one of life's greatest joys and deepest challenges. The pressure to raise kids 'right' can feel overwhelming, but God doesn't expect perfection - He invites partnership. Biblical parenting isn't about control; it's about discipleship. You're not just raising children; you're shaping hearts, pointing them toward Jesus, and trusting God with the outcome.",
    practicalSteps: [
      "Implement a daily or weekly family devotional time - even 10 minutes of Scripture and prayer",
      "Choose one character trait to focus on this month (kindness, honesty, gratitude) and model it intentionally",
      "Create a 'blessing ritual' - speak words of affirmation over each child before bed",
      "Identify one parenting struggle and seek wisdom through prayer, a trusted mentor, or a parenting resource"
    ],
    reflection: "Even biblical parents like Abraham, David, and Hannah struggled. Perfect parenting doesn't exist, but present, intentional parenting makes a difference. Your kids don't need a flawless parent - they need a faithful one who points them to a perfect God. When you mess up, apologize and model grace. Your parenting matters more than you know.",
    prayerPrompt: "Lord, give me wisdom to parent these children You've entrusted to me. Help me model Your love, speak Your truth, and trust You with their futures. Fill in the gaps where I fall short."
  },
  {
    id: "18",
    date: "2025-02-11",
    title: "Parenting Through Burnout",
    category: "Parenting Management",
    topic: "Parenting Burnout & Self-Care",
    scripture: "Matthew 11:28-30",
    verse: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.",
    therapeuticFocus: "Parenting exhaustion is real. The constant demands, sleepless nights, emotional labor, and endless responsibilities can leave you depleted. But Jesus invites weary parents to come to Him. You can't pour from an empty cup. Caring for yourself isn't selfish - it's necessary to sustain your ability to care for your children. God wants you to rest in Him.",
    practicalSteps: [
      "Ask for help - trade babysitting with another parent, hire a sitter, or ask family to step in",
      "Schedule one weekly 'recharge activity': a walk, hobby, coffee with a friend, or uninterrupted quiet time",
      "Lower perfectionist standards - done is better than perfect in parenting",
      "Practice 5-minute resets throughout the day: step outside, pray, stretch, or take deep breaths"
    ],
    reflection: "Even Jesus withdrew from the crowds to rest and pray. If the Son of God needed rest, so do you. Parenting burnout doesn't mean you're failing - it means you're human and you need God's strength. Hannah, a mother in Scripture, poured out her heart to God in exhaustion. He heard her. He hears you too. Rest isn't weakness; it's wisdom.",
    prayerPrompt: "Jesus, I'm weary. This parenting journey is harder than I imagined. Give me Your rest. Help me release the pressure to be perfect and receive Your grace. Renew my strength and joy."
  },
  {
    id: "19",
    date: "2025-02-12",
    title: "Wise Investment Strategies",
    category: "Financial Wellness",
    topic: "Investment & Wealth Building",
    scripture: "Proverbs 13:11",
    verse: "Dishonest money dwindles away, but whoever gathers money little by little makes it grow.",
    therapeuticFocus: "Investment anxiety often stems from fear of loss or pressure to get rich quick. Biblical investing is about steady, patient growth - gathering 'little by little.' It's not gambling or speculation; it's wise stewardship that multiplies resources over time for kingdom purposes. God honors patient, principled investing that builds wealth for family provision and generous giving.",
    practicalSteps: [
      "Research low-cost index funds or Christian-based investment options as a starting point",
      "Set a modest monthly investment amount you can sustain long-term (even $25-50 compounds)",
      "Learn the basics: understand compound interest, diversification, and your risk tolerance",
      "Pray before investment decisions, seeking God's wisdom rather than chasing market trends"
    ],
    reflection: "Investment isn't just for the wealthy - it's for anyone who wants to steward resources wisely. Like the parable of the talents, God expects us to multiply what He's given, not bury it in fear. Time is your greatest asset when investing. Starting small today beats waiting to invest large amounts tomorrow. What if your consistent, faithful investing today becomes provision for your family and generosity for God's kingdom tomorrow?",
    prayerPrompt: "Lord, teach me to invest wisely. Give me patience for long-term growth and protect me from greed and fear. Help me build wealth that serves Your purposes and blesses others."
  },
  {
    id: "20",
    date: "2025-02-13",
    title: "Debt Payoff Strategy and Freedom",
    category: "Financial Wellness",
    topic: "Debt Elimination & Freedom",
    scripture: "Romans 13:8",
    verse: "Let no debt remain outstanding, except the continuing debt to love one another, for whoever loves others has fulfilled the law.",
    therapeuticFocus: "Debt creates emotional bondage - anxiety, shame, and a feeling of being trapped. But there's hope. Freedom from debt is possible through a strategic plan, discipline, and God's help. It won't happen overnight, but every payment moves you closer to liberation. The psychological weight lifted with each paid-off debt brings peace that money can't buy.",
    practicalSteps: [
      "List all debts with amounts, interest rates, and minimum payments - face the reality",
      "Choose a payoff strategy: snowball (smallest to largest) for motivation or avalanche (highest interest first) for savings",
      "Find one expense to cut immediately and redirect 100% toward extra debt payments",
      "Celebrate small wins - each paid-off debt is a victory worth acknowledging"
    ],
    reflection: "Debt feels permanent, but it's temporary when you commit to a plan. Many people who felt hopeless are now debt-free because they took the first step. Freedom isn't about having more money - it's about owing less. Imagine waking up without the weight of debt. That future is possible. God promises to provide wisdom and strength for this journey. Will you take the next step today?",
    prayerPrompt: "God, I want to be free from debt. Give me wisdom to create a plan, discipline to stick to it, and perseverance when progress feels slow. I trust You to help me break these chains."
  },
  {
    id: "21",
    date: "2025-02-14",
    title: "Career Development and Calling",
    category: "Career & Purpose",
    topic: "Career Growth & Purpose",
    scripture: "Colossians 3:23-24",
    verse: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.",
    therapeuticFocus: "Career anxiety often comes from uncertainty - Am I on the right path? Is this my calling? Career development isn't just about climbing a ladder; it's about growing into who God created you to be. Your work is an expression of worship when done for God's glory. Whether you're seeking promotion, considering a career change, or developing new skills, God guides those who seek His wisdom.",
    practicalSteps: [
      "Identify three skills you'd like to develop this year and find resources (courses, books, mentors) to grow",
      "Schedule a quarterly career review: assess progress, celebrate growth, and set new goals",
      "Seek mentorship from someone further along in your desired career path",
      "Pray weekly about your career direction, asking God to reveal His purposes for your work"
    ],
    reflection: "Your career isn't random - it's part of God's design for your life. Even seasons of frustration or stagnation can be preparation for what's next. Joseph's prison time prepared him for Pharaoh's palace. David's shepherding trained him for kingship. What if your current role is equipping you for greater impact? Career development isn't about ambition; it's about stewarding your gifts and expanding your capacity to serve.",
    prayerPrompt: "Lord, guide my career path. Show me where to grow, what to learn, and how to develop skills that serve Your kingdom. Help me work with excellence and purpose, knowing I ultimately serve You."
  },
  {
    id: "22",
    date: "2025-02-15",
    title: "Budgeting as Worship",
    category: "Financial Wellness",
    topic: "Budgeting & Financial Planning",
    scripture: "Luke 14:28",
    verse: "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost to see if you have enough money to complete it?",
    therapeuticFocus: "Many people resist budgeting because it feels restrictive, but a budget is actually freedom. It's a plan that tells your money where to go instead of wondering where it went. Budgeting reduces financial anxiety by creating clarity and control. It's not about depriving yourself; it's about aligning spending with values and priorities. When you budget, you're worshiping God through intentional stewardship.",
    practicalSteps: [
      "Track every expense for one week to understand where money actually goes",
      "Create a simple budget: list income, then allocate to categories (giving, saving, needs, wants)",
      "Use the 50/20/30 rule as a starting point: 50% needs, 20% savings/debt, 30% wants",
      "Review and adjust your budget monthly - it's a living document, not set in stone"
    ],
    reflection: "A budget doesn't limit your freedom - debt and financial chaos do. When you budget, you're making proactive decisions about your priorities rather than reactive decisions based on emotions or impulses. Jesus taught planning before building. A budget is your financial blueprint. It honors God by managing His resources wisely. What if budgeting is the key to the financial peace you've been seeking?",
    prayerPrompt: "Father, help me create and stick to a budget that honors You. Give me discipline to plan, wisdom to prioritize, and contentment with what I have. Let my budget reflect my trust in Your provision."
  },
  {
    id: "23",
    date: "2025-02-16",
    title: "Christ-Centered Communication",
    category: "Relationships",
    topic: "Communication Skills & Conflict",
    scripture: "Ephesians 4:29",
    verse: "Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up according to their needs, that it may benefit those who listen.",
    therapeuticFocus: "Most relationship problems stem from poor communication. Learning to listen actively, speak truthfully with grace, and manage conflict biblically transforms relationships. Communication isn't just about talking - it's about understanding and being understood. When you communicate like Christ, you build bridges instead of walls. Healthy communication skills reduce anxiety, strengthen connections, and honor God.",
    practicalSteps: [
      "Practice active listening this week: listen to understand, not to respond",
      "Use 'I feel... when... because...' statements instead of accusatory 'You always...' language",
      "Before responding in conflict, take a breath and pray: 'Help me speak with grace and truth'",
      "Ask clarifying questions instead of assuming intentions: 'What did you mean by that?'"
    ],
    reflection: "James says to be quick to listen and slow to speak. Most of us do the opposite. Healthy communication requires humility - the willingness to admit when you're wrong, the courage to speak truth in love, and the patience to truly hear others. Your words have power to build up or tear down. Choose to use that power wisely. What relationship in your life would transform if you improved your communication?",
    prayerPrompt: "Lord, tame my tongue and open my ears. Help me speak words that build up, listen with empathy, and communicate in ways that honor You and heal relationships."
  },
  {
    id: "24",
    date: "2025-02-17",
    title: "Maximizing Income with Kingdom Purpose",
    category: "Career & Purpose",
    topic: "Income Management & Growth",
    scripture: "Proverbs 10:4",
    verse: "Lazy hands make for poverty, but diligent hands bring wealth.",
    therapeuticFocus: "Income anxiety is real, especially when expenses exceed earnings. God honors diligent work and gives creativity for increasing income. Whether through advancing in your career, developing side income, or enhancing skills, there are biblical ways to grow your earning potential. Seeking to increase income isn't greedy when your motive is to better provide, give generously, and build financial security for your family.",
    practicalSteps: [
      "Assess your current income streams and identify one area for potential growth",
      "Research market rates for your skills - are you being paid fairly? Consider negotiating",
      "Develop one new income skill: freelancing, consulting, or a side business aligned with your gifts",
      "Invest in yourself: take courses, earn certifications, or gain experience that increases your value"
    ],
    reflection: "Joseph managed Egypt's resources. Lydia sold purple cloth. Paul made tents. Biblical figures understood the value of work and income. Increasing income isn't about greed - it's about expanding your capacity to provide and give. Diligence is rewarded. Are you working with all your heart, as unto the Lord? What untapped potential exists in your skills and gifts that could increase your income?",
    prayerPrompt: "Lord, show me how to increase my income through diligent work and wise decisions. Give me creativity, skill development opportunities, and favor in my career. Help me use increased income for Your glory."
  },
  {
    id: "25",
    date: "2025-02-18",
    title: "Walking in Financial Freedom",
    category: "Financial Wellness",
    topic: "Financial Freedom & Peace",
    scripture: "John 8:36",
    verse: "So if the Son sets you free, you will be free indeed.",
    therapeuticFocus: "Financial freedom isn't just about having money - it's about being free from money's control. True financial freedom means you have margin, choices, and peace. You're not controlled by debt, fear, or the pressure to keep up with others. Financial freedom allows you to give generously, weather emergencies, and make life decisions based on God's calling rather than paycheck necessity. It's possible, and it's worth pursuing.",
    practicalSteps: [
      "Define what financial freedom means to you: debt-free? 6 months expenses saved? Retirement funded?",
      "Create a 3-5 year plan with specific milestones toward your financial freedom goal",
      "Build an emergency fund: start with $1,000, then work toward 3-6 months of expenses",
      "Automate your finances: automatic transfers to savings, investments, and giving accounts"
    ],
    reflection: "Financial freedom doesn't happen by accident - it's the result of intentional choices made consistently over time. Every dollar saved, every debt payment made, every investment contribution is a step toward freedom. Christ came to set you free - including freedom from financial bondage. Imagine the peace of knowing you can handle emergencies, the joy of generous giving without stress, the liberty of making career choices based on calling, not necessity. That freedom is within reach. Will you commit to the journey?",
    prayerPrompt: "Father, I want to experience true financial freedom. Guide my steps toward this goal. Give me discipline, wisdom, and patience for the journey. Help me use freedom to serve You and bless others."
  },
  {
    id: "26",
    date: "2025-02-19",
    title: "Exercise as Spiritual Discipline",
    category: "Health Management",
    topic: "Physical Exercise & Wellness",
    scripture: "1 Timothy 4:8",
    verse: "For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.",
    therapeuticFocus: "Exercise isn't vanity - it's stewardship. While spiritual fitness is more important, physical training has real value. Regular exercise reduces anxiety, improves mood, increases energy, and helps you serve God and others more effectively. Your body is designed to move. When you exercise, you're caring for the temple God gave you, preparing yourself to fulfill His purposes with strength and vitality.",
    practicalSteps: [
      "Start small: commit to 10-15 minutes of movement daily (walk, stretch, bodyweight exercises)",
      "Schedule exercise like any important appointment - make it non-negotiable",
      "Find an activity you enjoy: hiking, dancing, sports, swimming - consistency beats intensity",
      "Pray during exercise: combine physical and spiritual training by walking and praying, or thanking God while working out"
    ],
    reflection: "Jesus walked everywhere - His ministry was physically demanding. Daniel and his friends were healthier through wise eating and likely exercise. Physical fitness enables ministry effectiveness. A healthy body supports a healthy mind and spirit. Exercise isn't selfish; it's preparing yourself to serve God with energy and longevity. What if improved physical health unlocked greater capacity to fulfill God's calling on your life?",
    prayerPrompt: "Lord, help me honor You with my body through regular exercise. Give me discipline to move, wisdom to make healthy choices, and strength to steward this temple well. Use my fitness to fuel my service to You."
  },
  {
    id: "27",
    date: "2025-02-20",
    title: "Healing Childhood Trauma",
    category: "Emotional Healing",
    topic: "Childhood Trauma & Inner Healing",
    scripture: "Isaiah 61:1",
    verse: "The Spirit of the Sovereign Lord is on me, because the Lord has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim freedom for the captives and release from darkness for the prisoners.",
    therapeuticFocus: "Childhood trauma shapes how we see ourselves, God, and the world. Wounds from neglect, abuse, or dysfunction create patterns that follow us into adulthood. But God specializes in healing what's been broken. Inner healing isn't about erasing memories - it's about inviting Jesus into those painful places and letting Him speak truth where lies took root.",
    practicalSteps: [
      "Acknowledge the wound: name what happened and give yourself permission to grieve",
      "Recognize unhealthy patterns formed from childhood trauma (trust issues, self-sabotage, emotional walls)",
      "Invite Jesus into specific painful memories - ask Him to show you where He was and what He wants to say to you",
      "Consider working with a trauma-informed Christian counselor trained in inner healing"
    ],
    reflection: "Your past doesn't define your future. God didn't cause your childhood pain, but He promises to heal it. Many adults struggle with the effects of childhood trauma - shame, fear, difficulty trusting others or God. But restoration is possible. The same Jesus who healed the brokenhearted 2,000 years ago is still healing today. What childhood wound is God inviting you to bring to Him?",
    prayerPrompt: "Jesus, I bring You the pain from my childhood that still affects me today. Come into those broken places and heal what was wounded. Replace the lies I believed with Your truth. I receive Your healing."
  },
  {
    id: "28",
    date: "2025-02-21",
    title: "Reparenting Your Inner Child",
    category: "Emotional Healing",
    topic: "Childhood Trauma & Self-Compassion",
    scripture: "Psalm 27:10",
    verse: "Though my father and mother forsake me, the Lord will receive me.",
    therapeuticFocus: "When childhood needs weren't met, part of us remains stuck at that age, still seeking what we lacked. Reparenting means giving yourself the love, validation, and safety your inner child never received. It's not about blaming parents - it's about becoming the nurturing presence you needed. God is the perfect Father who never forsakes, and He helps you provide for that wounded child within.",
    practicalSteps: [
      "Identify what your inner child needed but didn't receive (safety, affirmation, comfort, protection)",
      "Practice self-compassion: speak to yourself the way a loving parent speaks to a hurting child",
      "When triggered, pause and ask: 'How old do I feel right now?' Then comfort that younger version of yourself",
      "Journal a letter from your adult self to your child self, offering the love and validation you needed"
    ],
    reflection: "Healing childhood trauma involves grieving what you didn't receive and then learning to give it to yourself. This isn't selfish - it's necessary. You can't change the past, but you can change how you relate to the wounded parts of yourself. God's perfect love can fill the gaps left by imperfect parents. When you learn to nurture your inner child, you break cycles and build healthier relationships.",
    prayerPrompt: "Father God, You are the parent I needed. Help me extend to myself the love I longed for as a child. Heal the parts of me that were neglected or wounded. Teach me to be gentle with my own heart."
  },
  {
    id: "29",
    date: "2025-02-22",
    title: "Breaking the Cycle of Generational Curses",
    category: "Spiritual Warfare",
    topic: "Generational Curses & Freedom",
    scripture: "Galatians 3:13-14",
    verse: "Christ redeemed us from the curse of the law by becoming a curse for us, for it is written: 'Cursed is everyone who is hung on a pole.' He redeemed us in order that the blessing given to Abraham might come to the Gentiles through Christ Jesus.",
    therapeuticFocus: "Generational patterns - addiction, divorce, poverty, abuse, mental illness - can feel like an inescapable curse. But Christ broke every curse on the cross. What plagued your family doesn't have to define yours. Freedom requires recognizing these patterns, renouncing agreement with them, and declaring Christ's victory over your bloodline.",
    practicalSteps: [
      "Identify negative patterns that have repeated through generations in your family",
      "Pray specifically: 'I break agreement with [pattern] in Jesus' name and declare His blood covers my family line'",
      "Replace the curse with blessing: declare God's promises over your life and future generations",
      "Make intentional choices that break the pattern - seek counseling, establish new traditions, create healthy boundaries"
    ],
    reflection: "You are not doomed to repeat your family's mistakes. The power of Christ's blood is greater than any generational curse. When Jesus said 'It is finished,' He meant it - including the cycles that have plagued your family. Breaking generational curses isn't just about you - it's about your children and their children. What pattern is God asking you to be the one who says 'it stops here'?",
    prayerPrompt: "Lord Jesus, I declare Your blood breaks every generational curse over my family. I renounce [specific pattern] and claim Your promises of blessing instead. Let me be the generation that walks in freedom."
  },
  {
    id: "30",
    date: "2025-02-27",
    title: "Rewriting Your Family Legacy",
    category: "Spiritual Warfare",
    topic: "Generational Curses & New Patterns",
    scripture: "2 Corinthians 5:17",
    verse: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    therapeuticFocus: "Breaking generational curses is only half the battle - you must also establish new, godly patterns. Dysfunction can feel normal when it's all you've known. Creating a new legacy requires intentionally choosing different responses, building healthier relationships, and modeling Christ-like character for the next generation.",
    practicalSteps: [
      "Write out the legacy you want to leave - what values, behaviors, and faith you want to pass on",
      "Choose one unhealthy family pattern and intentionally do the opposite (e.g., if your family avoided conflict, practice healthy communication)",
      "Surround yourself with healthy families and mentors who model what you didn't see growing up",
      "Document your journey - let your children/future children know you broke the cycle"
    ],
    reflection: "You're not just breaking curses - you're establishing blessings. Every healthy choice you make today impacts generations you'll never meet. Joshua declared 'As for me and my house, we will serve the Lord.' That declaration still echoes. Your family history doesn't determine your family future. You are a new creation in Christ. What new legacy is God calling you to build?",
    prayerPrompt: "Father, help me build a new legacy rooted in Your truth. Give me wisdom to establish healthy patterns that honor You. Let my life be a testimony of Your redemptive power for generations to come."
  },
  {
    id: "31",
    date: "2025-02-23",
    title: "Mastering the Art of Spending",
    category: "Financial Wellness",
    topic: "Spending Habits & Self-Control",
    scripture: "Proverbs 21:20",
    verse: "The wise store up choice food and olive oil, but fools gulp theirs down.",
    therapeuticFocus: "Spending problems often mask deeper issues - emotional voids, identity struggles, or attempts to medicate pain. Compulsive spending creates a temporary high followed by guilt and financial stress. Healthy spending requires understanding your triggers, addressing root causes, and developing self-control rooted in contentment rather than consumption.",
    practicalSteps: [
      "Track your spending for one week without judgment - just observe patterns",
      "Identify emotional triggers: When do you spend impulsively? Boredom? Stress? Comparison?",
      "Implement the 24-hour rule: Wait a full day before making non-essential purchases",
      "Create spending boundaries: set limits for categories and stick to them"
    ],
    reflection: "Every dollar you spend is a vote for what you value. Are you spending in alignment with your stated priorities, or are impulses controlling your wallet? The Bible doesn't condemn spending - it warns against foolish spending. Wisdom stores up resources while foolishness consumes everything immediately. God wants you to enjoy His blessings, but also to steward them wisely. What spending pattern is sabotaging your financial goals?",
    prayerPrompt: "Lord, help me develop self-control in my spending. Show me the emotional needs I'm trying to meet through shopping. Give me contentment and wisdom to spend in ways that honor You."
  },
  {
    id: "32",
    date: "2025-02-24",
    title: "Intentional Spending with Purpose",
    category: "Financial Wellness",
    topic: "Spending & Stewardship",
    scripture: "Luke 14:28",
    verse: "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost to see if you have enough money to complete it?",
    therapeuticFocus: "Intentional spending means every dollar has a purpose aligned with your values and goals. It's not about deprivation - it's about direction. When spending decisions are intentional rather than impulsive, you experience financial peace and make progress toward what truly matters. Your spending reflects your heart's priorities.",
    practicalSteps: [
      "Create spending categories aligned with your values (giving, saving, needs, wants)",
      "Before each purchase ask: 'Does this align with my priorities and goals?'",
      "Plan for discretionary spending - give yourself permission to enjoy money within boundaries",
      "Review monthly spending and celebrate when choices aligned with intentions"
    ],
    reflection: "Jesus taught counting the cost before building. This applies to all spending decisions. Every purchase should pass through the filter of your values and goals. Intentional spending doesn't eliminate joy - it enhances it because you're choosing what truly matters rather than mindlessly consuming. When your spending aligns with God's priorities, money becomes a tool for kingdom purposes, not a source of stress. What would change if every spending decision was intentional?",
    prayerPrompt: "Father, help me spend with intention and purpose. Align my financial decisions with Your priorities. Give me wisdom to distinguish between needs and wants, and courage to choose what truly matters."
  },
  {
    id: "33",
    date: "2025-02-25",
    title: "Planning for Your Future",
    category: "Financial Wellness",
    topic: "Future Planning & Vision",
    scripture: "Proverbs 21:5",
    verse: "The plans of the diligent lead to profit as surely as haste leads to poverty.",
    therapeuticFocus: "Future planning reduces anxiety by creating clarity and control. When you have a plan, you're less reactive and more proactive. Biblical planning isn't about controlling everything - it's about stewarding today in light of tomorrow. Planning honors God by acknowledging His gifts and using them wisely for the future He's preparing.",
    practicalSteps: [
      "Define your 1-year, 5-year, and 10-year goals in key areas: spiritual, financial, relational, career, health",
      "Break big goals into smaller, actionable steps you can take this month",
      "Create a financial plan: emergency fund, retirement savings, debt payoff, major purchases",
      "Review and adjust your plan quarterly - life changes, and plans should adapt"
    ],
    reflection: "Proverbs teaches that planning leads to profit while haste leads to poverty. God doesn't condemn planning - He commends it. Jesus taught about counting costs and preparing for the future. Planning isn't lack of faith; it's faithful stewardship. When you plan, you're partnering with God to steward today's resources for tomorrow's opportunities. Without a plan, you drift. With a plan, you move toward purpose. What future is God calling you to plan for?",
    prayerPrompt: "Lord, give me wisdom to plan for the future You have for me. Help me be diligent in preparation while trusting You with outcomes. Show me the steps to take today that honor tomorrow."
  },
  {
    id: "34",
    date: "2025-02-26",
    title: "Balancing Present Joy and Future Security",
    category: "Financial Wellness",
    topic: "Future Planning & Present Living",
    scripture: "Matthew 6:34",
    verse: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",
    therapeuticFocus: "Future planning must be balanced with present living. Some people save obsessively and never enjoy life. Others live only for today with no regard for tomorrow. Biblical wisdom says plan wisely but don't be consumed by the future. Enjoy God's blessings today while preparing responsibly for tomorrow.",
    practicalSteps: [
      "Use the 80/20 principle: Live on 80% of income, save/invest 20% for the future",
      "Build 'joy' into your budget - allocate funds for experiences and enjoyment now",
      "Practice gratitude for today's blessings while planning for tomorrow's needs",
      "Avoid two extremes: hoarding everything for the future or spending everything today"
    ],
    reflection: "Jesus warned against worry about tomorrow, but He didn't condemn preparation. The wise virgins in His parable prepared oil for the future. Joseph stored grain in Egypt's abundance to prepare for famine. Biblical balance says: Trust God completely, plan wisely, and enjoy today's gifts without anxiety about tomorrow. Your future is secure in God's hands, but He expects you to steward today responsibly. Life is happening now - don't sacrifice present joy on the altar of future security. Are you living in balance?",
    prayerPrompt: "Father, help me balance planning for tomorrow with enjoying today. Keep me from worry about the future and from foolishness in the present. Teach me to trust You while stewarding wisely."
  }
];

export function getTodayTherapy(viewedIds: string[] = []): TherapyContent {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  const unviewed = therapyContents.filter(t => !viewedIds.includes(t.id));
  
  if (unviewed.length > 0) {
    return unviewed[dayOfYear % unviewed.length];
  }
  
  return therapyContents[dayOfYear % therapyContents.length];
}

export function getPersonalizedTherapy(viewedIds: string[], categories: string[] = []): TherapyContent {
  const unviewed = therapyContents.filter(t => !viewedIds.includes(t.id));
  
  if (unviewed.length === 0) {
    return therapyContents[Math.floor(Math.random() * therapyContents.length)];
  }
  
  if (categories.length > 0) {
    const preferredTherapy = unviewed.filter(t => 
      categories.some(cat => 
        t.category.toLowerCase().includes(cat.toLowerCase()) ||
        t.topic.toLowerCase().includes(cat.toLowerCase())
      )
    );
    
    if (preferredTherapy.length > 0) {
      return preferredTherapy[Math.floor(Math.random() * preferredTherapy.length)];
    }
  }
  
  return unviewed[Math.floor(Math.random() * unviewed.length)];
}
