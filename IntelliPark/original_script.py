import cv2
from ultralytics import YOLO
from yt_dlp import YoutubeDL
import numpy as np
import json
import os

# Load YOLOv11 model
model = YOLO('yolo11s.pt')

# Function to load parking spaces from file
def load_parking_spaces():
    if os.path.exists('parking_spaces.json'):
        with open('parking_spaces.json', 'r') as f:
            parking_spaces_loaded = json.load(f)
            return [tuple(tuple(point) for point in space) for space in parking_spaces_loaded]
    else:
        return []  # Start with an empty list of parking spaces

# Function to save parking spaces to file
def save_parking_spaces():
    parking_spaces_serializable = [[list(point) for point in space] for space in parking_spaces]
    with open('parking_spaces.json', 'w') as f:
        json.dump(parking_spaces_serializable, f)

# Function to clear the last parking space
def clear_last_parking_space():
    global parking_spaces
    if parking_spaces:
        removed_space = parking_spaces.pop()
        save_parking_spaces()
        print(f"Last parking space {len(parking_spaces) + 1} cleared: {removed_space}")
    else:
        print("No parking spaces to clear.")

# Initialize parking spaces
parking_spaces = load_parking_spaces()

# Mouse callback globals
current_points = []
adding_space = False

# Mouse callback function to add parking spaces
def mouse_callback(event, x, y, flags, param):
    global current_points, adding_space, parking_spaces
    if event == cv2.EVENT_LBUTTONDOWN and adding_space:
        current_points.append((x, y))
        print(f"Point {len(current_points)}: ({x}, {y})")
        
        if len(current_points) == 4:
            new_space = tuple(current_points)
            parking_spaces.append(new_space)
            save_parking_spaces()
            print(f"Parking space {len(parking_spaces)} added and saved.")
            current_points.clear()
            adding_space = False

# Function to extract the best video stream URL from YouTube
def get_youtube_stream_url(youtube_url):
    ydl_opts = {'format': 'best'}
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(youtube_url, download=False)
        return info['url']

# Input YouTube URL
youtube_url = input("Enter the YouTube video URL: ")
video_url = get_youtube_stream_url(youtube_url)

# Open video stream
cap = cv2.VideoCapture(video_url)
if not cap.isOpened():
    print("Error: Could not open video stream.")
    exit()

# Get frame dimensions
ret, frame = cap.read()
if not ret:
    print("Error: Could not read frame.")
    exit()

frame_height, frame_width = frame.shape[:2]
resize_factor = 0.7  # Adjust frame size
frame_skip = 2  # Skip every 2nd frame for speed
frame_count = 0

# Setup window and mouse callback
cv2.namedWindow('YOLOv11 Parking Detection')
cv2.setMouseCallback('YOLOv11 Parking Detection', mouse_callback)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % frame_skip != 0:
        continue

    # Resize frame
    resized_frame = cv2.resize(frame, (int(frame_width * resize_factor), 
                                     int(frame_height * resize_factor)))
    
    # Vehicle detection
    results = model(resized_frame)
    occupied_spaces = set()

    # Process detections
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = box.conf[0]
            class_id = int(box.cls[0])

            if class_id == 2:  # Car class
                cv2.rectangle(resized_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                car_center = ((x1 + x2) // 2, (y1 + y2) // 2)
                
                # Check occupancy
                for idx, space in enumerate(parking_spaces):
                    space_poly = np.array(space, np.int32).reshape((-1, 1, 2))
                    if cv2.pointPolygonTest(space_poly, car_center, False) >= 0:
                        occupied_spaces.add(idx)

    # Save occupancy status to a JSON file
    status = {
        "total": len(parking_spaces),
        "occupied": len(occupied_spaces),
        "free": len(parking_spaces) - len(occupied_spaces),
        "spaces": {str(i): (i in occupied_spaces) for i in range(len(parking_spaces))}
    }

    with open("status.json", "w") as f:
        json.dump(status, f)

    # Draw parking spaces
    free_spaces = 0
    for idx, space in enumerate(parking_spaces):
        try:
            space_poly = np.array(space, np.int32).reshape((-1, 1, 2))
            if space_poly.size == 0:  # Skip if polygon is empty
                continue

            color = (0, 0, 255) if idx in occupied_spaces else (0, 255, 0)
            free_spaces += 0 if idx in occupied_spaces else 1
            
            # Transparent overlay
            overlay = resized_frame.copy()
            cv2.fillPoly(overlay, [space_poly], color)
            resized_frame = cv2.addWeighted(overlay, 0.3, resized_frame, 0.7, 0)
            
            # Border and number
            cv2.polylines(resized_frame, [space_poly], True, color, 2)
            text_pos = (space[2][0] - 20, space[2][1] + 20)
            cv2.putText(resized_frame, str(idx+1), text_pos, 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)
        except Exception as e:
            print(f"Error drawing parking space {idx + 1}: {e}")

    # Draw interactive points
    if adding_space:
        for i, (x, y) in enumerate(current_points):
            cv2.circle(resized_frame, (x, y), 5, (0, 0, 255), -1)
            if i > 0:
                cv2.line(resized_frame, current_points[i-1], (x,y), (0,0,255), 2)
        if len(current_points) == 4:
            cv2.line(resized_frame, current_points[3], current_points[0], (0,0,255), 2)

    # Status display (top-left, 2 cm below the top edge)
    status_x = 20  # Left margin
    status_y = 50  # 2 cm below the top edge (assuming ~25 pixels per cm)
    line_height = 30  # Vertical spacing between lines

    cv2.putText(resized_frame, f"Occupied: {len(occupied_spaces)}/{len(parking_spaces)}", 
               (status_x, status_y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255), 2)
    cv2.putText(resized_frame, f"Free: {free_spaces}/{len(parking_spaces)}", 
               (status_x, status_y + line_height), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
    
    if adding_space:
        cv2.putText(resized_frame, "ADDING SPACE: Click 4 points", 
                   (status_x, status_y + 2 * line_height), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
    cv2.putText(resized_frame, "Press 'A' to add | 'C' to clear last | 'Q' to quit", 
               (status_x, status_y + 3 * line_height), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 1)

    cv2.imshow('YOLOv11 Parking Detection', resized_frame)
    
    # Key handling
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):  # Quit
        break
    elif key == ord('a'):  # Add parking space
        adding_space = True
        current_points = []
        print("Ready to add new parking space - click 4 boundary points")
    elif key == ord('c'):  # Clear last parking space
        clear_last_parking_space()

cap.release()
cv2.destroyAllWindows()