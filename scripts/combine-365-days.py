#!/usr/bin/env python3
"""
Extract and combine 365 days of devotions, prayers, and studies into a single file.
Each day includes: devotion, prayer, and study content.
"""

import json
import re

def extract_typescript_array(file_path, array_name):
    """Extract the TypeScript array data from a constants file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the array declaration
    pattern = rf'export const {array_name}.*?=\s*\[(.*?)\];'
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        raise ValueError(f"Could not find {array_name} array in {file_path}")
    
    array_content = match.group(1)
    
    # Parse objects from the array
    items = []
    # Split by },\n  { to get individual objects
    object_pattern = r'\{([^}]+(?:\{[^}]+\}[^}]*)*)\}'
    objects = re.finditer(object_pattern, array_content, re.DOTALL)
    
    for obj_match in objects:
        obj_str = obj_match.group(1)
        item = {}
        
        # Extract properties
        # Handle simple properties
        for prop in ['id', 'title', 'date', 'prayer', 'scripture', 'verse', 'reflection', 'insight']:
            prop_pattern = rf'{prop}:\s*["\'](.+?)["\'](?:,|\s*\n)'
            prop_match = re.search(prop_pattern, obj_str, re.DOTALL)
            if prop_match:
                value = prop_match.group(1)
                # Unescape quotes
                value = value.replace(r"\'", "'").replace(r'\"', '"')
                item[prop] = value
        
        # Handle themes array
        themes_pattern = r'themes:\s*\[(.*?)\]'
        themes_match = re.search(themes_pattern, obj_str, re.DOTALL)
        if themes_match:
            themes_str = themes_match.group(1)
            themes = re.findall(r'["\']([^"\']+)["\']', themes_str)
            item['themes'] = themes
        
        if 'id' in item:  # Only add if we successfully parsed it
            items.append(item)
    
    return items

def combine_daily_content():
    """Combine devotions, prayers, and studies for all 365 days."""
    
    print("📖 Reading devotionals...")
    devotionals = extract_typescript_array('constants/devotionals.ts', 'devotionals')
    print(f"   Found {len(devotionals)} devotionals")
    
    print("🙏 Reading prayers...")
    prayers = extract_typescript_array('constants/daily-prayers.ts', 'dailyPrayers')
    print(f"   Found {len(prayers)} prayers")
    
    print("📚 Reading studies...")
    studies = extract_typescript_array('constants/daily-studies.ts', 'dailyStudies')
    print(f"   Found {len(studies)} studies")
    
    # Combine by day
    combined = []
    max_days = max(len(devotionals), len(prayers), len(studies))
    
    print(f"\n✨ Combining content for {max_days} days...")
    
    for i in range(max_days):
        day = i + 1
        day_content = {
            "day": day,
            "devotion": devotionals[i] if i < len(devotionals) else None,
            "prayer": prayers[i] if i < len(prayers) else None,
            "study": studies[i] if i < len(studies) else None
        }
        combined.append(day_content)
    
    return combined

def main():
    print("=" * 70)
    print("📅 365 DAYS OF DAILY BREAD - CONTENT COMPILER")
    print("=" * 70)
    print()
    
    try:
        combined_content = combine_daily_content()
        
        # Save as JSON
        output_file = 'daily-bread-365-days-complete.json'
        print(f"\n💾 Saving to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(combined_content, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Successfully created {output_file}")
        print(f"📊 Total days: {len(combined_content)}")
        print(f"💿 File size: {len(json.dumps(combined_content)) / 1024:.2f} KB")
        print()
        print("=" * 70)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
