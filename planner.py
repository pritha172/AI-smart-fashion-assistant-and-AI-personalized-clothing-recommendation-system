import urllib.request
import json
import random

# Color harmony matrix: maps primary color families to complementary pairings
COLOR_HARMONY = {
    "black": ["white", "grey", "blue", "red", "beige", "denim", "black"],
    "white": ["black", "blue", "denim", "grey", "navy", "green", "beige"],
    "blue": ["white", "grey", "beige", "black", "denim"],
    "navy": ["white", "beige", "grey", "red"],
    "grey": ["black", "white", "blue", "navy", "pink", "red"],
    "beige": ["white", "navy", "black", "blue", "brown"],
    "denim": ["white", "black", "grey", "red", "navy"],
    "red": ["black", "white", "blue", "denim"],
    "green": ["white", "black", "beige"]
}

def get_current_weather(lat=18.5204, lon=73.8567):
    """Fetches real-time temperature using Open-Meteo API (Default: Pune)."""
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        req = urllib.request.Request(url, headers={'User-Agent': 'WardrobeAI/1.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            temp_c = data['current_weather']['temperature']
            return temp_c
    except Exception as e:
        print(f"[Planner] Weather fetch failed, defaulting to 22°C: {e}")
        return 22.0  # Fallback temperature

def filter_by_weather(items, temp_c):
    """Categorizes items appropriate for the temperature."""
    suitable_items = []
    
    for item in items:
        # Expected item tuple: (title, image_data, category, tags)
        tags = [t.strip().lower() for t in item[3].split(',')]
        
        # Cold weather filtering (< 18°C)
        if temp_c < 18:
            if 'shorts' in tags or 'tank' in tags or 'sundress' in tags:
                continue
        # Hot weather filtering (> 28°C)
        elif temp_c > 28:
            if 'heavy' in tags or 'wool' in tags or 'coat' in tags or 'sweater' in tags:
                continue
                
        suitable_items.append(item)
        
    return suitable_items

def score_color_match(top_tags, bottom_tags):
    """Calculates color harmony score between top and bottom tags."""
    top_colors = set(top_tags).intersection(COLOR_HARMONY.keys())
    bottom_colors = set(bottom_tags).intersection(COLOR_HARMONY.keys())
    
    if not top_colors or not bottom_colors:
        return 1  # Neutral fallback score
        
    for tc in top_colors:
        for bc in bottom_colors:
            if bc in COLOR_HARMONY.get(tc, []):
                return 3  # High compatibility match
                
    return 0  # Color clash

def generate_outfit_recommendation(db_items, lat=18.5204, lon=73.8567, target_occasion="casual"):
    """Main decision pipeline: weather check -> category split -> scored pairing."""
    current_temp = get_current_weather(lat, lon)
    filtered_items = filter_by_weather(db_items, current_temp)
    
    tops, bottoms, outerwear, fullbody = [], [], [], []
    
    for item in filtered_items:
        # Tuple format: (title, image_data, category, tags)
        cat = item[2].lower()
        if 'top' in cat or 'shirt' in cat or 't-shirt' in cat:
            tops.append(item)
        elif 'bottom' in cat or 'pant' in cat or 'skirt' in cat or 'jeans' in cat:
            bottoms.append(item)
        elif 'outerwear' in cat or 'jacket' in cat or 'coat' in cat:
            outerwear.append(item)
        else:
            fullbody.append(item)

    recommendations = []

    # Strategy: Pair Tops + Bottoms with highest color harmony
    if tops and bottoms:
        scored_pairs = []
        for t in tops:
            t_tags = [tag.strip().lower() for tag in t[3].split(',')]
            for b in bottoms:
                b_tags = [tag.strip().lower() for tag in b[3].split(',')]
                score = score_color_match(t_tags, b_tags)
                scored_pairs.append((score, t, b))
                
        scored_pairs.sort(key=lambda x: x[0], reverse=True)
        top_picks = scored_pairs[:3]  # Best 3 pairings
        
        for score, top, bottom in top_picks:
            outfit = {
                "top": {"title": top[0], "image": top[1], "category": top[2]},
                "bottom": {"title": bottom[0], "image": bottom[1], "category": bottom[2]},
                "score": score
            }
            if outerwear and current_temp < 20:
                layer = random.choice(outerwear)
                outfit["outerwear"] = {"title": layer[0], "image": layer[1], "category": layer[2]}
            recommendations.append(outfit)

    return {
        "recommendations": recommendations
    }