export type BibleStudyPlan = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  readings: { 
    day: number; 
    reference: string; 
    focus: string;
    spiritualInsight?: string;  // Deep spiritual interpretation
    keyThemes?: string[];       // Main theological themes
    practicalApplication?: string; // How to apply today
  }[];
};

export const bibleStudyPlans: BibleStudyPlan[] = [
  {
    id: "psalms-peace",
    title: "Psalms of Peace",
    description: "Find comfort in David's words during troubled times",
    duration: "7 days",
    category: "Peace",
    readings: [
      { day: 1, reference: "Psalm 23", focus: "The Lord is my shepherd" },
      { day: 2, reference: "Psalm 46", focus: "God is our refuge and strength" },
      { day: 3, reference: "Psalm 91", focus: "Dwelling in God's shelter" },
      { day: 4, reference: "Psalm 121", focus: "The Lord watches over you" },
      { day: 5, reference: "Psalm 139", focus: "You are fearfully and wonderfully made" },
      { day: 6, reference: "Psalm 27", focus: "The Lord is my light" },
      { day: 7, reference: "Psalm 103", focus: "Praise for God's benefits" },
    ],
  },
  {
    id: "fruit-of-spirit",
    title: "Fruit of the Spirit",
    description: "Cultivating Christian character in daily life",
    duration: "9 days",
    category: "Character",
    readings: [
      { day: 1, reference: "Galatians 5:22-23", focus: "Introduction to the fruit" },
      { day: 2, reference: "1 Corinthians 13", focus: "Love in action" },
      { day: 3, reference: "Philippians 4:4-7", focus: "Joy and peace" },
      { day: 4, reference: "James 1:2-4", focus: "Patience through trials" },
      { day: 5, reference: "Ephesians 4:32", focus: "Kindness and compassion" },
      { day: 6, reference: "Psalm 37:1-7", focus: "Goodness and faithfulness" },
      { day: 7, reference: "Proverbs 15:1", focus: "Gentleness in speech" },
      { day: 8, reference: "1 Timothy 4:7-8", focus: "Self-control and godliness" },
      { day: 9, reference: "Romans 8:5-6", focus: "Living by the Spirit" },
    ],
  },
  {
    id: "jesus-teachings",
    title: "Teachings of Jesus",
    description: "Core lessons from the Sermon on the Mount",
    duration: "5 days",
    category: "Teachings",
    readings: [
      { day: 1, reference: "Matthew 5:1-12", focus: "The Beatitudes" },
      { day: 2, reference: "Matthew 5:13-16", focus: "Salt and light" },
      { day: 3, reference: "Matthew 6:25-34", focus: "Do not worry" },
      { day: 4, reference: "Matthew 7:7-11", focus: "Ask, seek, knock" },
      { day: 5, reference: "Matthew 7:24-27", focus: "Build on the rock" },
    ],
  },
  {
    id: "faith-journey",
    title: "Faith & Trust",
    description: "Building confidence in God's promises",
    duration: "6 days",
    category: "Faith",
    readings: [
      { day: 1, reference: "Hebrews 11:1-6", focus: "The nature of faith" },
      { day: 2, reference: "Proverbs 3:5-6", focus: "Trust with all your heart" },
      { day: 3, reference: "Romans 4:18-22", focus: "Abraham's faith" },
      { day: 4, reference: "James 2:14-26", focus: "Faith and works" },
      { day: 5, reference: "Mark 9:14-29", focus: "Help my unbelief" },
      { day: 6, reference: "Matthew 14:22-33", focus: "Walking on water" },
    ],
  },
  {
    id: "biblical-finances",
    title: "Biblical Financial Wisdom",
    description: "God's principles for money, wealth, and stewardship",
    duration: "7 days",
    category: "Finances",
    readings: [
      { day: 1, reference: "Proverbs 3:9-10", focus: "Honor God with your wealth" },
      { day: 2, reference: "Malachi 3:8-12", focus: "The blessing of tithing" },
      { day: 3, reference: "Luke 16:10-13", focus: "Faithfulness with money" },
      { day: 4, reference: "1 Timothy 6:6-10", focus: "The love of money" },
      { day: 5, reference: "Proverbs 21:5", focus: "Planning and diligence" },
      { day: 6, reference: "Matthew 6:19-21", focus: "Treasures in heaven" },
      { day: 7, reference: "2 Corinthians 9:6-11", focus: "Generous giving" },
    ],
  },
  {
    id: "stewardship-mastery",
    title: "Mastering Biblical Stewardship",
    description: "Learning to manage God's resources wisely",
    duration: "10 days",
    category: "Finances",
    readings: [
      { day: 1, reference: "Genesis 1:26-28", focus: "God's original design for stewardship" },
      { day: 2, reference: "Psalm 24:1", focus: "Everything belongs to God" },
      { day: 3, reference: "Luke 12:13-21", focus: "The parable of the rich fool" },
      { day: 4, reference: "Matthew 25:14-30", focus: "The parable of the talents" },
      { day: 5, reference: "Proverbs 22:7", focus: "Avoiding the bondage of debt" },
      { day: 6, reference: "Romans 13:8", focus: "Owe no one anything but love" },
      { day: 7, reference: "Ecclesiastes 5:10-15", focus: "The emptiness of wealth" },
      { day: 8, reference: "Acts 2:44-47", focus: "Early church generosity" },
      { day: 9, reference: "Philippians 4:19", focus: "God's promise to provide" },
      { day: 10, reference: "Hebrews 13:5", focus: "Contentment over covetousness" },
    ],
  },
  {
    id: "kingdom-business",
    title: "Kingdom Business Principles",
    description: "Biblical wisdom for Christian entrepreneurs and business leaders",
    duration: "10 days",
    category: "Entrepreneurship",
    readings: [
      { day: 1, reference: "Genesis 39:1-6", focus: "Joseph: Excellence and integrity in work" },
      { day: 2, reference: "Proverbs 16:3-9", focus: "Committing your business to the Lord" },
      { day: 3, reference: "Colossians 3:23-24", focus: "Working for the Lord, not men" },
      { day: 4, reference: "Luke 19:11-27", focus: "The parable of the minas: using what you're given" },
      { day: 5, reference: "Proverbs 11:1-3", focus: "Honesty and integrity in business dealings" },
      { day: 6, reference: "James 5:1-6", focus: "Warning against greed and exploitation" },
      { day: 7, reference: "Deuteronomy 8:18", focus: "God gives the power to create wealth" },
      { day: 8, reference: "Nehemiah 1-2", focus: "Vision, planning, and bold action" },
      { day: 9, reference: "Acts 18:1-4", focus: "Paul: Tentmaking and ministry" },
      { day: 10, reference: "Ecclesiastes 11:1-6", focus: "Diversification and calculated risk" },
    ],
  },
  {
    id: "marketplace-ministry",
    title: "Marketplace Ministry",
    description: "Using your business as a platform for God's kingdom",
    duration: "7 days",
    category: "Entrepreneurship",
    readings: [
      { day: 1, reference: "Daniel 6:1-5", focus: "Excellence that points to God" },
      { day: 2, reference: "Matthew 5:13-16", focus: "Salt and light in the workplace" },
      { day: 3, reference: "Acts 16:14-15", focus: "Lydia: Business woman and ministry partner" },
      { day: 4, reference: "1 Thessalonians 4:11-12", focus: "Working with your hands and winning respect" },
      { day: 5, reference: "Proverbs 22:29", focus: "Skilled work brings honor" },
      { day: 6, reference: "Ephesians 6:5-9", focus: "Working as unto the Lord" },
      { day: 7, reference: "1 Corinthians 10:31", focus: "Doing everything for God's glory" },
    ],
  },
  {
    id: "wisdom-for-leaders",
    title: "Biblical Leadership Wisdom",
    description: "Leading teams and making decisions with godly wisdom",
    duration: "8 days",
    category: "Entrepreneurship",
    readings: [
      { day: 1, reference: "Exodus 18:13-27", focus: "Moses learns to delegate" },
      { day: 2, reference: "1 Kings 3:5-14", focus: "Solomon asks for wisdom" },
      { day: 3, reference: "Proverbs 15:22", focus: "The value of wise counsel" },
      { day: 4, reference: "Mark 10:42-45", focus: "Servant leadership" },
      { day: 5, reference: "Titus 2:7-8", focus: "Leading by example and integrity" },
      { day: 6, reference: "Proverbs 29:18", focus: "Vision casting and direction" },
      { day: 7, reference: "Philippians 2:3-8", focus: "Humility in leadership" },
      { day: 8, reference: "James 3:13-18", focus: "Wisdom from above vs. earthly wisdom" },
    ],
  },
  {
    id: "wealth-management-plan",
    title: "Biblical Wealth Management",
    description: "God's wisdom for managing money, building wealth, and financial freedom",
    duration: "7 days",
    category: "Finances",
    readings: [
      { day: 1, reference: "Luke 14:28-30", focus: "Count the cost: Planning and budgeting" },
      { day: 2, reference: "Proverbs 21:5", focus: "Diligent planning leads to profit" },
      { day: 3, reference: "Matthew 25:14-30", focus: "The parable of the talents: Multiplying resources" },
      { day: 4, reference: "Ecclesiastes 11:1-2", focus: "Diversification and wise investing" },
      { day: 5, reference: "1 Timothy 6:17-19", focus: "Rich toward God: Generous wealth building" },
      { day: 6, reference: "Proverbs 13:11", focus: "Wealth from hard work vs. get-rich-quick schemes" },
      { day: 7, reference: "Luke 12:15-21", focus: "Avoiding greed while building wealth" },
    ],
  },
  {
    id: "health-wellness",
    title: "Honoring God with Your Body",
    description: "Biblical principles for physical health, wellness, and self-care",
    duration: "5 days",
    category: "Health",
    readings: [
      { day: 1, reference: "1 Corinthians 6:19-20", focus: "Your body is a temple of the Holy Spirit" },
      { day: 2, reference: "3 John 1:2", focus: "Prosper in health as your soul prospers" },
      { day: 3, reference: "1 Corinthians 9:24-27", focus: "Training and discipline for the body" },
      { day: 4, reference: "Daniel 1:8-16", focus: "Daniel's health through wise choices" },
      { day: 5, reference: "Psalm 127:2", focus: "The gift of rest and sleep" },
    ],
  },
  {
    id: "parenting-wisdom",
    title: "Biblical Parenting",
    description: "Raising children with faith, wisdom, and grace",
    duration: "7 days",
    category: "Parenting",
    readings: [
      { day: 1, reference: "Proverbs 22:6", focus: "Train up a child in the way they should go" },
      { day: 2, reference: "Deuteronomy 6:4-9", focus: "Teaching faith in everyday moments" },
      { day: 3, reference: "Ephesians 6:4", focus: "Do not exasperate your children" },
      { day: 4, reference: "Proverbs 29:15", focus: "Discipline and wisdom" },
      { day: 5, reference: "Colossians 3:21", focus: "Encouraging, not discouraging" },
      { day: 6, reference: "1 Samuel 1:24-28", focus: "Hannah's dedication and trust" },
      { day: 7, reference: "Luke 2:51-52", focus: "Jesus' growth in wisdom and stature" },
    ],
  },
  {
    id: "investment-stewardship",
    title: "Biblical Investment Principles",
    description: "Learning to multiply resources wisely for God's kingdom",
    duration: "5 days",
    category: "Finances",
    readings: [
      { day: 1, reference: "Matthew 25:14-30", focus: "The parable of the talents: God expects multiplication" },
      { day: 2, reference: "Proverbs 13:11", focus: "Gathering money little by little" },
      { day: 3, reference: "Ecclesiastes 11:1-6", focus: "Diversification and spreading risk" },
      { day: 4, reference: "Proverbs 21:5", focus: "Diligent planning leads to profit" },
      { day: 5, reference: "1 Timothy 6:17-19", focus: "Rich toward God while building wealth" },
    ],
  },
  {
    id: "debt-freedom-path",
    title: "Breaking Free from Debt",
    description: "Biblical wisdom for eliminating debt and finding financial freedom",
    duration: "6 days",
    category: "Finances",
    readings: [
      { day: 1, reference: "Proverbs 22:7", focus: "The borrower is slave to the lender" },
      { day: 2, reference: "Romans 13:8", focus: "Let no debt remain outstanding" },
      { day: 3, reference: "Psalm 37:21", focus: "The righteous give generously and pay debts" },
      { day: 4, reference: "Luke 14:28-30", focus: "Count the cost before committing" },
      { day: 5, reference: "Proverbs 6:1-5", focus: "Urgency in freeing yourself from debt" },
      { day: 6, reference: "Philippians 4:19", focus: "God's promise to provide" },
    ],
  },
  {
    id: "career-excellence",
    title: "Excellence in Your Career",
    description: "Biblical principles for professional development and workplace witness",
    duration: "6 days",
    category: "Career",
    readings: [
      { day: 1, reference: "Colossians 3:23-24", focus: "Working for the Lord, not men" },
      { day: 2, reference: "Proverbs 22:29", focus: "Skilled workers serve before kings" },
      { day: 3, reference: "Daniel 6:1-5", focus: "Excellence that stands out" },
      { day: 4, reference: "Proverbs 12:24", focus: "Diligence leads to leadership" },
      { day: 5, reference: "1 Thessalonians 4:11-12", focus: "Working with your hands" },
      { day: 6, reference: "Ephesians 6:5-9", focus: "Serving with sincerity of heart" },
    ],
  },
  {
    id: "budgeting-planning",
    title: "Biblical Budgeting",
    description: "Learning to plan and manage money according to God's wisdom",
    duration: "5 days",
    category: "Finances",
    readings: [
      { day: 1, reference: "Luke 14:28-30", focus: "Count the cost and estimate expenses" },
      { day: 2, reference: "Proverbs 27:23-24", focus: "Know the condition of your resources" },
      { day: 3, reference: "Proverbs 21:5", focus: "Plans of the diligent lead to profit" },
      { day: 4, reference: "Proverbs 21:20", focus: "The wise store up resources" },
      { day: 5, reference: "Matthew 25:1-13", focus: "The parable of the wise virgins: preparation matters" },
    ],
  },
  {
    id: "communication-wisdom",
    title: "Biblical Communication",
    description: "Learning to speak, listen, and resolve conflict God's way",
    duration: "7 days",
    category: "Relationships",
    readings: [
      { day: 1, reference: "James 1:19-20", focus: "Quick to listen, slow to speak" },
      { day: 2, reference: "Ephesians 4:29", focus: "Words that build up" },
      { day: 3, reference: "Proverbs 15:1", focus: "A gentle answer turns away wrath" },
      { day: 4, reference: "Proverbs 18:13", focus: "Listen before answering" },
      { day: 5, reference: "Matthew 5:23-24", focus: "Reconcile before worship" },
      { day: 6, reference: "Colossians 4:6", focus: "Let your conversation be full of grace" },
      { day: 7, reference: "Proverbs 25:11", focus: "Words fitly spoken" },
    ],
  },
  {
    id: "income-increase",
    title: "Growing Your Income Biblically",
    description: "Biblical principles for increasing earning potential and managing provision",
    duration: "5 days",
    category: "Career",
    readings: [
      { day: 1, reference: "Proverbs 10:4", focus: "Diligent hands bring wealth" },
      { day: 2, reference: "Deuteronomy 8:18", focus: "God gives ability to produce wealth" },
      { day: 3, reference: "Proverbs 12:11", focus: "Those who work their land have abundant food" },
      { day: 4, reference: "2 Thessalonians 3:10-12", focus: "Work to earn your living" },
      { day: 5, reference: "Proverbs 14:23", focus: "All hard work brings profit" },
    ],
  },
  {
    id: "financial-freedom-journey",
    title: "The Path to Financial Freedom",
    description: "Biblical steps toward lasting financial peace and independence",
    duration: "8 days",
    category: "Finances",
    readings: [
      { day: 1, reference: "John 8:31-36", focus: "True freedom comes from Christ" },
      { day: 2, reference: "Proverbs 22:7", focus: "The borrower is slave to the lender" },
      { day: 3, reference: "Philippians 4:11-13", focus: "Contentment in all circumstances" },
      { day: 4, reference: "1 Timothy 6:6-10", focus: "Godliness with contentment is great gain" },
      { day: 5, reference: "Hebrews 13:5", focus: "Keep your lives free from the love of money" },
      { day: 6, reference: "Proverbs 13:11", focus: "Gathering wealth little by little" },
      { day: 7, reference: "Luke 12:15-21", focus: "Life is not measured by possessions" },
      { day: 8, reference: "Matthew 6:19-21", focus: "Store treasures in heaven" },
    ],
  },
  {
    id: "exercise-discipline",
    title: "Physical Discipline for God's Glory",
    description: "Biblical perspective on fitness, health, and caring for your body",
    duration: "5 days",
    category: "Health",
    readings: [
      { day: 1, reference: "1 Corinthians 6:19-20", focus: "Your body is God's temple" },
      { day: 2, reference: "1 Timothy 4:8", focus: "Physical training has value" },
      { day: 3, reference: "1 Corinthians 9:24-27", focus: "Running with purpose and discipline" },
      { day: 4, reference: "Daniel 1:8-16", focus: "Wise health choices bring blessing" },
      { day: 5, reference: "3 John 1:2", focus: "Prosper in health as your soul prospers" },
    ],
  },
  {
    id: "chronological-book-focused",
    title: "Chronological + Book-Focused Bible Reading",
    description: "Read the Bible in historical order while diving into complete books - experience God's story as it unfolded",
    duration: "52 weeks (1 year)",
    category: "Reading Plan",
    readings: [
      // Week 1-4: Beginnings (Genesis + Job + Psalms)
      { 
        day: 1, 
        reference: "Genesis 1-3", 
        focus: "Creation and the Fall",
        spiritualInsight: "God's creation reveals His character: powerful, orderly, creative, and deeply personal. Notice how He creates with intentional progression—from light to life, from seas to stars, from fish to humanity. The pinnacle is mankind, made 'in Our image' (Gen 1:26), showing the Trinity at work. Yet paradise is lost through disobedience. But even in judgment, God shows mercy—He clothes Adam and Eve and promises a Redeemer (Gen 3:15, the first gospel).",
        keyThemes: ["God's sovereignty in creation", "Humanity made in God's image", "The entrance of sin", "The promise of redemption (Gen 3:15)"],
        practicalApplication: "Today, remember you are made in God's image—you have inherent worth and dignity. But we are also fallen and desperately need a Savior. Thank God for Jesus, the promised seed who would crush the serpent's head."
      },
      { 
        day: 2, 
        reference: "Genesis 4-7", 
        focus: "Cain, Abel, and Noah",
        spiritualInsight: "Sin escalates quickly. Cain's jealousy leads to murder, and by Genesis 6, 'every inclination of the thoughts of the human heart was only evil all the time' (Gen 6:5). Yet God preserves a remnant through Noah. The flood is both judgment and mercy—God judges sin but saves those who find grace in His eyes. Noah's ark foreshadows Christ, our ark of salvation from God's wrath.",
        keyThemes: ["Sin's rapid spread", "God's righteous judgment", "Grace in the midst of judgment", "Faith and obedience (Noah)", "The ark as a type of Christ"],
        practicalApplication: "Like Noah, we are called to walk with God in a crooked generation. Build your 'ark' through faith in Christ. When God's final judgment comes, will you be found in Him?"
      },
      { 
        day: 3, 
        reference: "Genesis 8-11", 
        focus: "The Flood and Tower of Babel",
        spiritualInsight: "After the flood, God makes a covenant with Noah (Gen 9:8-17)—the rainbow is God's promise never to destroy the earth by flood again. But humanity's pride resurfaces at Babel: 'Let US make a name for ourselves' (Gen 11:4). God confuses their language and scatters them. Babel shows that humanity united in rebellion against God is dangerous. Yet God will one day unite a people for His glory—the Church, speaking in many tongues at Pentecost (Acts 2).",
        keyThemes: ["God's covenant faithfulness", "The rainbow as a sign", "Human pride and rebellion", "God's sovereignty over nations", "Babel reversed at Pentecost"],
        practicalApplication: "Are you building your 'tower' to make a name for yourself, or are you living for God's glory? Humble yourself under His mighty hand, and He will lift you up in due time (1 Peter 5:6)."
      },
      { 
        day: 4, 
        reference: "Genesis 12-15", 
        focus: "Abraham's call and covenant",
        spiritualInsight: "God calls Abraham to leave everything familiar and go to a land 'I will show you' (Gen 12:1). Abram's faith is credited to him as righteousness (Gen 15:6)—this is the foundation of justification by faith alone! God makes an unconditional covenant with Abraham: his descendants will be as numerous as the stars, and through his seed, all nations will be blessed. That seed is ultimately Christ (Galatians 3:16).",
        keyThemes: ["The call to radical faith", "Justification by faith (Gen 15:6)", "God's unconditional covenant", "The promise of Christ through Abraham's seed", "Faith and patience"],
        practicalApplication: "God calls you to faith, not sight. Like Abraham, you may not see the full picture, but trust that God is faithful. He who promised is faithful (Hebrews 10:23)."
      },
      { 
        day: 5, 
        reference: "Genesis 16-20", 
        focus: "Abraham and Ishmael",
        spiritualInsight: "Abraham and Sarah try to 'help' God fulfill His promise through Hagar, resulting in Ishmael. But God's promise was for Isaac, the child of promise, not Ishmael, the child of the flesh. Paul uses this allegory in Galatians 4:21-31—Ishmael represents works of the flesh, Isaac represents the promise of grace. We cannot manufacture God's promises through our own efforts. We must wait on His timing.",
        keyThemes: ["Impatience and unbelief", "Works vs. faith (flesh vs. Spirit)", "God's faithfulness despite our failures", "The promised son vs. the son of the flesh", "Consequences of disobedience"],
        practicalApplication: "Are you trying to 'help' God by taking matters into your own hands? Trust His timing. Wait patiently for the Lord; He will act (Psalm 37:7)."
      },
      { 
        day: 6, 
        reference: "Genesis 21-24", 
        focus: "Isaac and Rebekah",
        spiritualInsight: "Isaac is finally born—the child of promise! But then God tests Abraham: 'Take your son, your only son Isaac, whom you love, and sacrifice him' (Gen 22:2). Abraham obeys, believing God could raise Isaac from the dead (Hebrews 11:19). At the last moment, God provides a ram. This is one of the most powerful foreshadowings of Christ in the Old Testament: the Father offering His only Son, the substitute sacrifice, on Mount Moriah (the same location as Golgotha).",
        keyThemes: ["God's promise fulfilled", "The testing of faith", "The binding of Isaac (foreshadowing Christ)", "God will provide (Jehovah Jireh)", "Abraham's obedience"],
        practicalApplication: "God may test your faith, but He will never fail you. When He asks you to surrender what you love most, trust that He will provide. He did not spare His own Son for you (Romans 8:32)."
      },
      { 
        day: 7, 
        reference: "Genesis 25-28", 
        focus: "Jacob and Esau",
        spiritualInsight: "Jacob, the deceiver, steals Esau's birthright and blessing. Yet God chose Jacob over Esau before they were born (Romans 9:10-13). This shows God's sovereign election—salvation is not based on human effort or desire, but on God's mercy. Jacob's story is one of transformation: the deceiver becomes Israel ('he who wrestles with God'). God chooses the unlikely, the broken, the deceiver—just like He chooses us.",
        keyThemes: ["God's sovereign election", "Jacob the deceiver chosen by grace", "The struggle for the blessing", "God's faithfulness to His covenant", "Transformation through God's grace"],
        practicalApplication: "You may feel unqualified or unworthy, but God delights in choosing the weak and foolish to shame the strong and wise (1 Cor 1:27). Trust that He is at work in your life, even when you don't see it."
      },
      
      { day: 8, reference: "Genesis 29-32", focus: "Jacob's family and wrestling with God" },
      { day: 9, reference: "Genesis 33-36", focus: "Jacob returns home" },
      { day: 10, reference: "Genesis 37-40", focus: "Joseph sold into slavery" },
      { day: 11, reference: "Genesis 41-44", focus: "Joseph in Egypt" },
      { day: 12, reference: "Genesis 45-48", focus: "Family reunion" },
      { day: 13, reference: "Genesis 49-50", focus: "Jacob's blessing and death" },
      { day: 14, reference: "Job 1-7", focus: "Job's suffering begins" },
      
      { day: 15, reference: "Job 8-14", focus: "Job and his friends debate" },
      { day: 16, reference: "Job 15-21", focus: "Continued dialogue" },
      { day: 17, reference: "Job 22-28", focus: "Where is wisdom?" },
      { day: 18, reference: "Job 29-34", focus: "Job's final defense" },
      { day: 19, reference: "Job 35-39", focus: "Elihu speaks" },
      { day: 20, reference: "Job 40-42", focus: "God answers; Job is restored" },
      { day: 21, reference: "Psalm 1-10", focus: "Blessed is the one who trusts the Lord" },
      
      { day: 22, reference: "Psalm 11-20", focus: "Songs of trust and deliverance" },
      { day: 23, reference: "Psalm 21-30", focus: "Praise and lament" },
      { day: 24, reference: "Psalm 31-41", focus: "Refuge in the Lord" },
      { day: 25, reference: "Exodus 1-6", focus: "Israel enslaved; Moses called" },
      { day: 26, reference: "Exodus 7-12", focus: "Plagues on Egypt" },
      { day: 27, reference: "Exodus 13-18", focus: "The Exodus and Red Sea crossing" },
      { day: 28, reference: "Exodus 19-24", focus: "The Ten Commandments" },
      
      // Week 5-8: Law and Tabernacle
      { day: 29, reference: "Exodus 25-30", focus: "Tabernacle instructions" },
      { day: 30, reference: "Exodus 31-36", focus: "Golden calf and renewal" },
      { day: 31, reference: "Exodus 37-40", focus: "Tabernacle completed" },
      { day: 32, reference: "Psalm 42-52", focus: "Longing for God" },
      { day: 33, reference: "Leviticus 1-7", focus: "Offerings and sacrifices" },
      { day: 34, reference: "Leviticus 8-15", focus: "Priests and purity" },
      { day: 35, reference: "Leviticus 16-22", focus: "Day of Atonement" },
      
      { day: 36, reference: "Leviticus 23-27", focus: "Feasts and holiness" },
      { day: 37, reference: "Numbers 1-6", focus: "Census and camps" },
      { day: 38, reference: "Numbers 7-12", focus: "Tabernacle dedication" },
      { day: 39, reference: "Numbers 13-18", focus: "Spies and rebellion" },
      { day: 40, reference: "Numbers 19-24", focus: "Wilderness wandering" },
      { day: 41, reference: "Numbers 25-30", focus: "Balaam and vows" },
      { day: 42, reference: "Numbers 31-36", focus: "Inheritance and cities" },
      
      { day: 43, reference: "Deuteronomy 1-6", focus: "Moses recounts the journey" },
      { day: 44, reference: "Deuteronomy 7-12", focus: "Commands for the Promised Land" },
      { day: 45, reference: "Deuteronomy 13-20", focus: "Laws and warfare" },
      { day: 46, reference: "Deuteronomy 21-27", focus: "More laws and blessings" },
      { day: 47, reference: "Deuteronomy 28-31", focus: "Covenant renewal" },
      { day: 48, reference: "Deuteronomy 32-34", focus: "Moses' song and death" },
      { day: 49, reference: "Psalm 53-62", focus: "God is my rock" },
      
      // Week 8-12: Conquest and Judges
      { day: 50, reference: "Joshua 1-6", focus: "Entering Canaan; Jericho falls" },
      { day: 51, reference: "Joshua 7-12", focus: "Conquest continues" },
      { day: 52, reference: "Joshua 13-19", focus: "Land divided" },
      { day: 53, reference: "Joshua 20-24", focus: "Cities of refuge; Joshua's farewell" },
      { day: 54, reference: "Judges 1-5", focus: "Israel struggles; Deborah judges" },
      { day: 55, reference: "Judges 6-10", focus: "Gideon and other judges" },
      { day: 56, reference: "Judges 11-16", focus: "Jephthah and Samson" },
      
      { day: 57, reference: "Judges 17-21", focus: "Israel's dark days" },
      { day: 58, reference: "Ruth 1-4", focus: "A story of redemption" },
      { day: 59, reference: "Psalm 63-72", focus: "Songs of David" },
      { day: 60, reference: "1 Samuel 1-7", focus: "Samuel's birth and calling" },
      { day: 61, reference: "1 Samuel 8-14", focus: "Saul becomes king" },
      { day: 62, reference: "1 Samuel 15-20", focus: "David anointed; meets Goliath" },
      { day: 63, reference: "1 Samuel 21-26", focus: "David flees from Saul" },
      
      { day: 64, reference: "1 Samuel 27-31", focus: "Saul's death" },
      { day: 65, reference: "2 Samuel 1-6", focus: "David becomes king" },
      { day: 66, reference: "2 Samuel 7-12", focus: "God's covenant with David; David and Bathsheba" },
      { day: 67, reference: "2 Samuel 13-18", focus: "Absalom's rebellion" },
      { day: 68, reference: "2 Samuel 19-24", focus: "David restored; his last words" },
      { day: 69, reference: "Psalm 73-82", focus: "Psalms of Asaph" },
      { day: 70, reference: "Psalm 83-92", focus: "Dwelling in God's house" },
      
      // Week 11-16: Kingdom Era - Solomon and Division
      { day: 71, reference: "1 Kings 1-5", focus: "Solomon becomes king" },
      { day: 72, reference: "1 Kings 6-10", focus: "Temple built; Queen of Sheba" },
      { day: 73, reference: "Proverbs 1-7", focus: "Wisdom's call" },
      { day: 74, reference: "Proverbs 8-15", focus: "The path of wisdom" },
      { day: 75, reference: "Proverbs 16-23", focus: "Wise sayings" },
      { day: 76, reference: "Proverbs 24-31", focus: "More wisdom; the virtuous woman" },
      { day: 77, reference: "Ecclesiastes 1-6", focus: "Meaningless pursuits" },
      
      { day: 78, reference: "Ecclesiastes 7-12", focus: "Fear God and keep His commands" },
      { day: 79, reference: "Song of Solomon 1-8", focus: "Love and devotion" },
      { day: 80, reference: "1 Kings 11-15", focus: "Solomon's fall; kingdom divided" },
      { day: 81, reference: "1 Kings 16-20", focus: "Elijah and Ahab" },
      { day: 82, reference: "1 Kings 21-22", focus: "Naboth's vineyard; Ahab's death" },
      { day: 83, reference: "2 Kings 1-6", focus: "Elijah and Elisha" },
      { day: 84, reference: "2 Kings 7-12", focus: "Israel and Judah's kings" },
      
      { day: 85, reference: "2 Kings 13-17", focus: "Israel falls to Assyria" },
      { day: 86, reference: "Psalm 93-102", focus: "The Lord reigns" },
      { day: 87, reference: "Psalm 103-112", focus: "Praise the Lord" },
      { day: 88, reference: "Joel 1-3", focus: "The Day of the Lord" },
      { day: 89, reference: "Jonah 1-4", focus: "God's mercy to Nineveh" },
      { day: 90, reference: "Amos 1-5", focus: "Judgment on Israel" },
      { day: 91, reference: "Amos 6-9", focus: "Israel will be restored" },
      
      // Week 14-20: Prophets and Fall of Judah
      { day: 92, reference: "Hosea 1-7", focus: "God's unfailing love" },
      { day: 93, reference: "Hosea 8-14", focus: "Return to the Lord" },
      { day: 94, reference: "Isaiah 1-6", focus: "Isaiah's vision and calling" },
      { day: 95, reference: "Isaiah 7-12", focus: "Immanuel is coming" },
      { day: 96, reference: "Isaiah 13-20", focus: "Oracles against nations" },
      { day: 97, reference: "Isaiah 21-28", focus: "Woe to the rebellious" },
      { day: 98, reference: "Isaiah 29-35", focus: "Trust in the Lord" },
      
      { day: 99, reference: "Isaiah 36-41", focus: "Comfort for God's people" },
      { day: 100, reference: "Isaiah 42-48", focus: "The Servant of the Lord" },
      { day: 101, reference: "Isaiah 49-54", focus: "Israel's restoration" },
      { day: 102, reference: "Isaiah 55-60", focus: "Seek the Lord while He may be found" },
      { day: 103, reference: "Isaiah 61-66", focus: "The Spirit of the Lord is upon me" },
      { day: 104, reference: "Micah 1-7", focus: "Justice, mercy, and humility" },
      { day: 105, reference: "Nahum 1-3", focus: "Judgment on Nineveh" },
      
      { day: 106, reference: "2 Kings 18-22", focus: "Hezekiah and Josiah" },
      { day: 107, reference: "2 Kings 23-25", focus: "Judah falls to Babylon" },
      { day: 108, reference: "Zephaniah 1-3", focus: "The day of the Lord is near" },
      { day: 109, reference: "Habakkuk 1-3", focus: "The just shall live by faith" },
      { day: 110, reference: "Jeremiah 1-6", focus: "Jeremiah called; warning to Judah" },
      { day: 111, reference: "Jeremiah 7-12", focus: "False religion and true faith" },
      { day: 112, reference: "Jeremiah 13-18", focus: "The broken covenant" },
      
      { day: 113, reference: "Jeremiah 19-24", focus: "Good and bad figs" },
      { day: 114, reference: "Jeremiah 25-30", focus: "70 years of exile; future restoration" },
      { day: 115, reference: "Jeremiah 31-36", focus: "New covenant promised" },
      { day: 116, reference: "Jeremiah 37-42", focus: "Jerusalem falls" },
      { day: 117, reference: "Jeremiah 43-48", focus: "Oracles against nations" },
      { day: 118, reference: "Jeremiah 49-52", focus: "More prophecies; Jerusalem destroyed" },
      { day: 119, reference: "Lamentations 1-5", focus: "Mourning over Jerusalem" },
      
      // Week 21-26: Exile and Prophets
      { day: 120, reference: "Obadiah 1", focus: "Judgment on Edom" },
      { day: 121, reference: "Ezekiel 1-6", focus: "Ezekiel's vision and calling" },
      { day: 122, reference: "Ezekiel 7-12", focus: "Judgment on Jerusalem" },
      { day: 123, reference: "Ezekiel 13-18", focus: "False prophets; individual responsibility" },
      { day: 124, reference: "Ezekiel 19-24", focus: "Allegories and warnings" },
      { day: 125, reference: "Ezekiel 25-30", focus: "Prophecies against nations" },
      { day: 126, reference: "Ezekiel 31-36", focus: "New heart and new spirit" },
      
      { day: 127, reference: "Ezekiel 37-42", focus: "Valley of dry bones; new temple" },
      { day: 128, reference: "Ezekiel 43-48", focus: "Glory returns; land divided" },
      { day: 129, reference: "Daniel 1-3", focus: "Daniel in Babylon; fiery furnace" },
      { day: 130, reference: "Daniel 4-6", focus: "God humbles kingdoms; lion's den" },
      { day: 131, reference: "Daniel 7-9", focus: "Visions of empires; 70 weeks" },
      { day: 132, reference: "Daniel 10-12", focus: "Final vision; end times" },
      { day: 133, reference: "Psalm 113-122", focus: "Hallel psalms" },
      
      // Week 27-30: Return from Exile
      { day: 134, reference: "Ezra 1-6", focus: "First return; temple rebuilt" },
      { day: 135, reference: "Haggai 1-2", focus: "Rebuild the temple" },
      { day: 136, reference: "Zechariah 1-6", focus: "Visions of restoration" },
      { day: 137, reference: "Zechariah 7-14", focus: "The coming King" },
      { day: 138, reference: "Esther 1-5", focus: "Esther becomes queen" },
      { day: 139, reference: "Esther 6-10", focus: "Jews delivered from destruction" },
      { day: 140, reference: "Ezra 7-10", focus: "Ezra's return and reforms" },
      
      { day: 141, reference: "Nehemiah 1-6", focus: "Walls rebuilt" },
      { day: 142, reference: "Nehemiah 7-11", focus: "The people return" },
      { day: 143, reference: "Nehemiah 12-13", focus: "Dedication and reforms" },
      { day: 144, reference: "Malachi 1-4", focus: "The messenger is coming" },
      { day: 145, reference: "Psalm 123-132", focus: "Songs of ascent" },
      { day: 146, reference: "Psalm 133-141", focus: "Praise and prayer" },
      { day: 147, reference: "Psalm 142-150", focus: "Let everything praise the Lord!" },
      
      // Week 31-35: 400 Silent Years → Gospels Begin
      { day: 148, reference: "1 Chronicles 1-9", focus: "Genealogies from Adam" },
      { day: 149, reference: "1 Chronicles 10-16", focus: "David's reign" },
      { day: 150, reference: "1 Chronicles 17-22", focus: "Temple preparations" },
      { day: 151, reference: "1 Chronicles 23-29", focus: "David's final instructions" },
      { day: 152, reference: "2 Chronicles 1-9", focus: "Solomon's reign and temple" },
      { day: 153, reference: "2 Chronicles 10-18", focus: "Kingdom divided" },
      { day: 154, reference: "2 Chronicles 19-26", focus: "Judah's kings" },
      
      { day: 155, reference: "2 Chronicles 27-36", focus: "Fall of Jerusalem; exile" },
      { day: 156, reference: "Matthew 1-4", focus: "Birth of Jesus; ministry begins" },
      { day: 157, reference: "Matthew 5-7", focus: "Sermon on the Mount" },
      { day: 158, reference: "Matthew 8-11", focus: "Miracles and teachings" },
      { day: 159, reference: "Matthew 12-15", focus: "Opposition grows" },
      { day: 160, reference: "Matthew 16-19", focus: "Peter's confession; transfiguration" },
      { day: 161, reference: "Matthew 20-23", focus: "Parables and woes" },
      
      { day: 162, reference: "Matthew 24-26", focus: "End times; last supper" },
      { day: 163, reference: "Matthew 27-28", focus: "Crucifixion and resurrection" },
      { day: 164, reference: "Mark 1-4", focus: "Jesus' early ministry" },
      { day: 165, reference: "Mark 5-8", focus: "Miracles and teachings" },
      { day: 166, reference: "Mark 9-12", focus: "Journey to Jerusalem" },
      { day: 167, reference: "Mark 13-16", focus: "Passion week and resurrection" },
      { day: 168, reference: "Luke 1-3", focus: "Birth narratives; John the Baptist" },
      
      // Week 36-42: Gospel of Luke and John
      { day: 169, reference: "Luke 4-6", focus: "Jesus' ministry and teachings" },
      { day: 170, reference: "Luke 7-9", focus: "Miracles and the Twelve" },
      { day: 171, reference: "Luke 10-12", focus: "Parables and warnings" },
      { day: 172, reference: "Luke 13-16", focus: "More parables" },
      { day: 173, reference: "Luke 17-19", focus: "Coming of the Kingdom" },
      { day: 174, reference: "Luke 20-22", focus: "Last teachings; last supper" },
      { day: 175, reference: "Luke 23-24", focus: "Crucifixion and resurrection" },
      
      { day: 176, reference: "John 1-3", focus: "The Word became flesh; new birth" },
      { day: 177, reference: "John 4-6", focus: "Living water; bread of life" },
      { day: 178, reference: "John 7-9", focus: "Light of the world" },
      { day: 179, reference: "John 10-12", focus: "Good Shepherd; Lazarus raised" },
      { day: 180, reference: "John 13-15", focus: "Upper room discourse" },
      { day: 181, reference: "John 16-18", focus: "High priestly prayer; arrest" },
      { day: 182, reference: "John 19-21", focus: "Crucifixion, resurrection, restoration" },
      
      // Week 43-47: Acts and Early Church
      { day: 183, reference: "Acts 1-3", focus: "Ascension and Pentecost" },
      { day: 184, reference: "Acts 4-6", focus: "Early church grows" },
      { day: 185, reference: "Acts 7-9", focus: "Stephen martyred; Saul converted" },
      { day: 186, reference: "Acts 10-12", focus: "Gospel to Gentiles; Peter freed" },
      { day: 187, reference: "Acts 13-15", focus: "Paul's first journey; Jerusalem Council" },
      { day: 188, reference: "Acts 16-18", focus: "Paul's second journey" },
      { day: 189, reference: "Acts 19-21", focus: "Paul's third journey" },
      
      { day: 190, reference: "Acts 22-24", focus: "Paul arrested in Jerusalem" },
      { day: 191, reference: "Acts 25-28", focus: "Paul appeals to Caesar; Rome" },
      { day: 192, reference: "James 1-5", focus: "Faith and works" },
      { day: 193, reference: "Galatians 1-3", focus: "Justified by faith alone" },
      { day: 194, reference: "Galatians 4-6", focus: "Freedom in Christ; fruit of the Spirit" },
      { day: 195, reference: "1 Thessalonians 1-5", focus: "Living to please God; Christ's return" },
      { day: 196, reference: "2 Thessalonians 1-3", focus: "Stand firm; day of the Lord" },
      
      // Week 48-52: Paul's Letters and General Epistles
      { day: 197, reference: "1 Corinthians 1-6", focus: "Divisions and immorality" },
      { day: 198, reference: "1 Corinthians 7-11", focus: "Marriage, freedom, and worship" },
      { day: 199, reference: "1 Corinthians 12-14", focus: "Spiritual gifts and love" },
      { day: 200, reference: "1 Corinthians 15-16", focus: "Resurrection hope" },
      { day: 201, reference: "2 Corinthians 1-6", focus: "Ministry of reconciliation" },
      { day: 202, reference: "2 Corinthians 7-10", focus: "Godly sorrow; spiritual warfare" },
      { day: 203, reference: "2 Corinthians 11-13", focus: "Paul's apostolic authority" },
      
      { day: 204, reference: "Romans 1-4", focus: "All have sinned; justified by faith" },
      { day: 205, reference: "Romans 5-8", focus: "Freedom from sin and death" },
      { day: 206, reference: "Romans 9-12", focus: "God's sovereignty; living sacrifice" },
      { day: 207, reference: "Romans 13-16", focus: "Love fulfills the law" },
      { day: 208, reference: "Colossians 1-4", focus: "Christ is preeminent" },
      { day: 209, reference: "Ephesians 1-3", focus: "Blessed in Christ" },
      { day: 210, reference: "Ephesians 4-6", focus: "Walk in love; spiritual armor" },
      
      { day: 211, reference: "Philippians 1-4", focus: "Joy in Christ; press on" },
      { day: 212, reference: "Philemon 1", focus: "Forgiveness and brotherhood" },
      { day: 213, reference: "1 Timothy 1-3", focus: "Sound doctrine and church leadership" },
      { day: 214, reference: "1 Timothy 4-6", focus: "Godliness and contentment" },
      { day: 215, reference: "Titus 1-3", focus: "Good works and sound teaching" },
      { day: 216, reference: "2 Timothy 1-4", focus: "Guard the deposit; finish well" },
      { day: 217, reference: "1 Peter 1-3", focus: "Living hope; holy living" },
      
      { day: 218, reference: "1 Peter 4-5", focus: "Suffering and glory" },
      { day: 219, reference: "2 Peter 1-3", focus: "Grow in grace; day of the Lord" },
      { day: 220, reference: "Hebrews 1-4", focus: "Jesus is superior" },
      { day: 221, reference: "Hebrews 5-8", focus: "Jesus, our High Priest" },
      { day: 222, reference: "Hebrews 9-11", focus: "New covenant; hall of faith" },
      { day: 223, reference: "Hebrews 12-13", focus: "Run the race with endurance" },
      
      { day: 224, reference: "1 John 1-3", focus: "Walk in the light; love one another" },
      { day: 225, reference: "1 John 4-5", focus: "God is love; overcoming the world" },
      { day: 226, reference: "2 John 1", focus: "Truth and love" },
      { day: 227, reference: "3 John 1", focus: "Walk in truth" },
      { day: 228, reference: "Jude 1", focus: "Contend for the faith" },
      { day: 229, reference: "Revelation 1-3", focus: "Letters to seven churches" },
      { day: 230, reference: "Revelation 4-7", focus: "Throne room vision; seals opened" },
      
      { day: 231, reference: "Revelation 8-11", focus: "Trumpets sound; two witnesses" },
      { day: 232, reference: "Revelation 12-14", focus: "Dragon and beasts; harvest" },
      { day: 233, reference: "Revelation 15-18", focus: "Bowls of wrath; Babylon falls" },
      { day: 234, reference: "Revelation 19-22", focus: "Christ returns; new heaven and earth" },
    ],
  },
];

export function getRecommendedStudies(viewedIds: string[], preferredCategories: string[] = []): BibleStudyPlan[] {
  const unviewed = bibleStudyPlans.filter(s => !viewedIds.includes(s.id));
  
  if (preferredCategories.length > 0) {
    const preferred = unviewed.filter(s => 
      preferredCategories.some(cat => 
        s.category.toLowerCase().includes(cat.toLowerCase()) ||
        s.title.toLowerCase().includes(cat.toLowerCase()) ||
        s.description.toLowerCase().includes(cat.toLowerCase())
      )
    );
    
    const other = unviewed.filter(s => !preferred.includes(s));
    return [...preferred, ...other];
  }
  
  return [...unviewed, ...bibleStudyPlans.filter(s => viewedIds.includes(s.id))];
}

export function getTodayStudy(viewedIds: string[] = []): BibleStudyPlan {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  const unviewed = bibleStudyPlans.filter(s => !viewedIds.includes(s.id));
  
  if (unviewed.length > 0) {
    return unviewed[dayOfYear % unviewed.length];
  }
  
  return bibleStudyPlans[dayOfYear % bibleStudyPlans.length];
}

export function getPersonalizedStudy(viewedIds: string[], preferences: string[] = []): BibleStudyPlan {
  const unviewed = bibleStudyPlans.filter(s => !viewedIds.includes(s.id));
  
  if (unviewed.length === 0) {
    return bibleStudyPlans[Math.floor(Math.random() * bibleStudyPlans.length)];
  }
  
  if (preferences.length > 0) {
    const preferredStudies = unviewed.filter(s => 
      preferences.some(pref => 
        s.title.toLowerCase().includes(pref.toLowerCase()) ||
        s.description.toLowerCase().includes(pref.toLowerCase()) ||
        s.category.toLowerCase().includes(pref.toLowerCase())
      )
    );
    
    if (preferredStudies.length > 0) {
      return preferredStudies[Math.floor(Math.random() * preferredStudies.length)];
    }
  }
  
  return unviewed[Math.floor(Math.random() * unviewed.length)];
}
