# Product Requirements Document (PRD)
**Project Name:** FloodGuard AI  
**Version:** 1.0.0  

---

## 1. Product Overview & Vision
**FloodGuard AI** is a proactive, AI-driven disaster management platform designed to predict and mitigate urban flooding before critical infrastructure submerges. By synthesizing real-time weather telemetry, radar overlays, and computer-vision-based CCTV analysis (Visual Perception Engine), the platform generates a dynamic **Flood Risk Index (FRI)** for monitored nodes. It equips municipal authorities and emergency responders with actionable intelligence, automated alert dispatches, and simulated forecasting capabilities.

---

## 2. Target Audience
* **Municipal Corporations & City Planners:** To monitor critical choke points (e.g., underpasses, main gates) and automate drain maintenance dispatches.
* **Emergency Response Units (NDRF, Local Police):** To receive real-time, targeted SMS alerts via AWS SNS when the FRI breaches critical thresholds.
* **Environmental/Smart City Researchers:** Utilizing the simulator architecture to model disaster scenarios and response times.

---

## 3. System Architecture & Tech Stack
### 3.1. Frontend
* **Framework:** Next.js 14 (App Router), React
* **Styling & UI:** Tailwind CSS, Aceternity UI (animations, glassmorphism), Lucide React (icons), Recharts (data visualization)
* **Map Engine:** React-Leaflet with OpenStreetMap (Dark mode inverted tiles) and Esri Satellite Tile layers.

### 3.2. Backend & Cloud Integration (AWS)
* **API Routes:** Next.js Serverless Edge Functions (`/api/analyze`, `/api/nodes`, `/api/dispatch`, `/api/weather`)
* **Computer Vision:** Amazon Rekognition (Object & Scene detection)
* **Notifications:** Amazon SNS (Simple Notification Service) for SMS/Email dispatching.
* **State Management:** Amazon DynamoDB (`FloodGuardState` table for managing TTL, node telemetry, and system states).
* **External APIs:** Open-Meteo (Real-time rainfall/weather data) and RainViewer (Live radar map tile overlays).

---

## 4. Key Features & Detailed Requirements

### 4.1. Command Center Dashboard (`/dashboard`)
The central hub for monitoring city-wide node health and real-time flood progression.
* **Interactive GIS Map:** 
  * Displays all monitored IoT/CCTV nodes across the region (e.g., Delhi NCR) using Leaflet. 
  * Seamlessly toggles between "Dark Street" (OSM inverted) and "Satellite" (Esri) views.
  * Dynamically calculates bounds to ensure all active nodes fit within the viewport on load.
* **Live Weather Integration (Open-Meteo & RainViewer):**
  * Fetches real-time precipitation metrics (mm/h) using batched Open-Meteo API requests (cached for 5 minutes).
  * Overlays live rain radar tiles directly onto the map via RainViewer.
* **Node Drawer (Detailed Telemetry):**
  * Clicking a map node slides open a detailed telemetry drawer.
  * Displays current FRI, localized weather metrics (temperature, rainfall), simulated drain choke status, and a historical FRI sparkline chart.
* **Data Source Toggle (Live vs. Simulation):**
  * **Simulation Mode:** Allows users to manually inject theoretical rainfall or choke-point blockages to observe FRI progression.
  * **Live Mode:** Overrides manual inputs with real-time API data, normalizing rainfall data (piecewise function: 0 mm/h -> 0.0 to 30+ mm/h -> 1.0) to dynamically compute the node's FRI.

### 4.2. Visual Perception Engine (CCTV Demo - `/demo`)
An interactive testing ground for the Amazon Rekognition pipeline.
* **Client-Side Image Normalization:** 
  * Users upload raw CCTV frames or photos (supports JPEG, PNG, WebP).
  * A hidden HTML5 Canvas dynamically scales the image to a maximum of 1600px on its longest edge and compresses it to an 85% quality JPEG. This guarantees the payload remains strictly under the Next.js 4MB body limit and AWS Rekognition's 5MB cap.
* **AI Analysis via AWS Rekognition:** 
  * Scans the image for environmental tags (Max 10 labels, 70% min confidence).
  * Automatically calculates `V_pooling` (Visual Pooling Metric) based on the presence of targeted keywords.
* **Intelligent Results View:**
  * **Priority Sorting:** Crucial environmental labels (e.g., `Flood`, `Flash Flood`, `Water`, `Puddle`, `Road`, `Vehicle`) are aggressively hoisted to the top of the list and highlighted in cyan. Secondary labels descend by confidence.
  * **Bounding Boxes:** Draws geometric bounding boxes strictly over priority labels by default, reducing visual clutter. A toggle enables "Show all bounding boxes" on demand.
  * **Smart Tag Placement:** Box tags hide themselves if the detected object is too small (<40px) to prevent textual overlap, and automatically invert from `-top` to `bottom` if rendering too close to the image ceiling.
  * **Flood Verdict & Reason:** Synthesizes the AI data into a binary "FLOOD DETECTED" or "CLEAR" ruling, displaying the exact trigger logic (e.g., "Water/Flood keyword detected").
* **Emergency Dispatch Trigger:** A direct action button to fire a payload to `/api/dispatch`, triggering a live Amazon SNS SMS to response teams with the exact Node ID and FRI data.

### 4.3. Algorithmic Risk Scoring (FRI)
* Calculates the **Flood Risk Index (0.0 to 1.0)**.
* **Inputs:** Precipitation intensity (live or simulated), node elevation, baseline drainage capacity, and simulated/visual choke-point multipliers.
* Drives the color-coding (Green/Yellow/Red) of map markers and triggers automated alerts when breaking the 0.85 (Critical) threshold.

---

## 5. User Flows

1. **Passive Monitoring Flow:**
   * User navigates to `/dashboard`.
   * Application verifies AWS credentials dynamically.
   * Node locations, live weather data, and radar tiles render. Map markers pulse yellow/red if Open-Meteo detects heavy localized rain driving the FRI up.
2. **Predictive Simulation Flow:**
   * User toggles "Data Source" to "Simulation".
   * User adjusts the global rainfall slider to 25mm/h. 
   * The dashboard instantly recalculates the FRI for all nodes, demonstrating which sectors of the city will flood first. 
3. **Automated Detection Flow (`/demo`):**
   * Traffic camera captures an image of a waterlogged street.
   * Image is normalized and posted to `/api/analyze`.
   * AWS Rekognition tags `['Water', 'Vehicle']`.
   * The system computes a V_pooling score > 0.85, outputs "FLOOD DETECTED", and prompts the user/system to push an SNS dispatch.

---

## 6. Non-Functional Requirements (NFRs)
* **Robust Error Handling:** Strict mapping of AWS Exceptions (e.g., `ImageTooLargeException` -> 413, `AccessDenied` -> 502). The system must never crash on unhandled promise rejections or expose AWS traces.
* **Security & Secrets:** AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) must remain strictly server-side. No API keys are leaked to the client. Missing environments gracefully fall back to a "Demo Data" UI state rather than throwing 500s.
* **Performance:** Leaflet maps must dynamically load via `next/dynamic` (`ssr: false`) to prevent hydration mismatches and window errors. Client-side image canvas manipulation must execute in < 200ms.
* **Design System:** Strict adherence to a dark-mode, high-contrast palette (Neutral-900 backgrounds, Cyan/Orange/Red accents) utilizing Aceternity UI's `HoverBorderGradient` and `Lucide` iconography.

---

## 7. Future Roadmap
* **Automated CCTV Polling:** Move the `/demo` manual upload functionality to a cron-job backend that polls static RTSP frame buffers every 5 minutes.
* **DynamoDB Historical Logging:** Transition from in-memory state arrays to full DynamoDB time-series querying to populate 24-hour predictive trend graphs inside the Node Drawer.
* **Push Notifications:** Introduce WebSockets/FCM for real-time browser push notifications in the command center when a node breaches the critical FRI threshold.