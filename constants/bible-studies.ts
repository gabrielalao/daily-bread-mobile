export type BibleStudyPlan = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  readings: { day: number; reference: string; focus: string }[];
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
