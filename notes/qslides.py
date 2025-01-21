import requests
from bs4 import BeautifulSoup
import os
import json
import time

def get_lecture_list():
    """Get list of all lecture URLs from the course page"""
    try:
        url = "http://15462.courses.cs.cmu.edu/fall2021/"
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        lectures = []
        
        # Look for lecture links in the page
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/lecture/' in href:
                lecture_name = href.split('/lecture/')[-1]
                lectures.append(lecture_name)
        
        return list(set(lectures))  # Remove duplicates
    except Exception as e:
        print(f"Error getting lecture list: {e}")
        # Fallback list based on known lectures
        return [
            "3drotations",
            "texture",
            "depthtransparency",
            "meshes",
            "animation",
            "basic",
            "rays",
            "sampling",
            "transforms",
            "intro",
            "color",
            "splines",
            "curves",
            "pipeline",
            "geometry",
            "radiometry",
            "illumination"
        ]

def get_slide_comments(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        comments = []
        
        comment_elements = soup.find_all('div', class_='comment')
        for element in comment_elements:
            text = element.find('div', class_='comment-data').find('p')
            if text:
                comments.append(text.text.strip())
        
        return comments
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return None
        print(f"Error fetching {url}: {e}")
        return []
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def process_lecture(lecture_name):
    base_url = "http://15462.courses.cs.cmu.edu/fall2021/lecture"
    lecture_url = f"{base_url}/{lecture_name}"
    
    print(f"\nProcessing lecture: {lecture_name}")
    print("=" * 50)
    
    lecture_comments = {}
    total_comments = 0
    slide_num = 1
    consecutive_empty = 0
    
    # First verify the lecture exists
    try:
        response = requests.get(f"{lecture_url}/slide_001")
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"Lecture {lecture_name} not found (404)")
            return
        
    while consecutive_empty < 3:
        slide_url = f"{lecture_url}/slide_{str(slide_num).zfill(3)}"
        comments = get_slide_comments(slide_url)
        
        if comments is None:
            consecutive_empty += 1
            if consecutive_empty == 1:
                print(f"Reached potential end at slide {slide_num}")
        elif comments:
            consecutive_empty = 0
            lecture_comments[f"slide_{slide_num}"] = comments
            total_comments += len(comments)
            print(f"Found {len(comments)} comments in slide {slide_num}")
        
        slide_num += 1
        time.sleep(1)  # Be nice to the server
    
    if lecture_comments:
        last_slide = max(int(key.split('_')[1]) for key in lecture_comments.keys())
        print(f"\nLecture Summary for {lecture_name}:")
        print(f"Total slides with comments: {len(lecture_comments)}")
        print(f"Last slide number: {last_slide}")
        print(f"Total comments: {total_comments}")
        
        os.makedirs("lecture_comments", exist_ok=True)
        filename = os.path.join("lecture_comments", f"{lecture_name}_comments.json")
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                "metadata": {
                    "lecture_name": lecture_name,
                    "total_slides_with_comments": len(lecture_comments),
                    "last_slide_number": last_slide,
                    "total_comments": total_comments
                },
                "comments": lecture_comments
            }, f, indent=2)
        print(f"Saved comments to {filename}")
    else:
        print(f"No comments found for lecture {lecture_name}")

if __name__ == "__main__":
    lectures = get_lecture_list()
    print(f"Found {len(lectures)} lectures to process:")
    print("\n".join(lectures))
    print("\nStarting processing...")
    
    for lecture in lectures:
        try:
            process_lecture(lecture)
        except Exception as e:
            print(f"Error processing lecture {lecture}: {e}")
            continue