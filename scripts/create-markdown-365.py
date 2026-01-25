#!/usr/bin/env python3
"""
Create a Markdown version of the 365 days content.
"""

import json

def create_markdown():
    """Create a beautiful Markdown document from the JSON."""
    
    # Read the JSON file
    with open('daily-bread-365-days-complete.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Start building the markdown
    md_lines = [
        "# 365 Days of Daily Bread",
        "",
        "Complete daily devotional content including devotions, prayers, and Bible studies for an entire year.",
        "",
        "---",
        ""
    ]
    
    for day_content in data:
        day = day_content['day']
        devotion = day_content.get('devotion', {})
        prayer = day_content.get('prayer', {})
        study = day_content.get('study', {})
        
        # Day header
        md_lines.extend([
            f"## Day {day}",
            ""
        ])
        
        # Devotion section
        if devotion:
            md_lines.extend([
                "### 📖 Daily Devotion",
                f"**{devotion.get('title', 'N/A')}**",
                "",
                f"*Scripture:* {devotion.get('scripture', 'N/A')}",
                "",
                f"> {devotion.get('verse', 'N/A')}",
                "",
                "**Reflection:**",
                devotion.get('reflection', 'N/A'),
                ""
            ])
        
        # Prayer section
        if prayer:
            md_lines.extend([
                "### 🙏 Daily Prayer",
                f"**{prayer.get('title', 'N/A')}**",
                "",
                f"*Scripture:* {prayer.get('scripture', 'N/A')}",
                "",
                f"> {prayer.get('verse', 'N/A')}",
                "",
                "**Prayer:**",
                prayer.get('prayer', 'N/A'),
                ""
            ])
        
        # Study section
        if study:
            md_lines.extend([
                "### 📚 Daily Study",
                f"**{study.get('title', 'N/A')}**",
                "",
                f"*Scripture:* {study.get('scripture', 'N/A')}",
                "",
                f"> {study.get('verse', 'N/A')}",
                "",
                "**Insight:**",
                study.get('insight', 'N/A'),
                "",
                "**Reflection Questions:**",
                study.get('reflection', 'N/A'),
                ""
            ])
        
        md_lines.extend([
            "---",
            ""
        ])
    
    # Write to file
    with open('daily-bread-365-days-complete.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(md_lines))
    
    print("✅ Created daily-bread-365-days-complete.md")
    content = '\n'.join(md_lines)
    print(f"📄 File size: {len(content) / 1024:.2f} KB")

if __name__ == "__main__":
    create_markdown()
