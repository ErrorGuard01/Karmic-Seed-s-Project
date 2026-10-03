# 4-Minute Video Walkthrough Script: XYZ Fulfillment Hub

> **Target Duration**: Exactly 4 minutes (~530 words at natural conversational speed)  
> **Role Context**: Operations Analyst Candidate  
> **Core Focus**: How you understood the problem, what you built, and why you made those choices.  
> **Tone**: Simple, friendly, confident spoken English.  

---

## 4-Minute Video Timeline

| Time | Section | Screen Action | Key Points |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:40** | **1. The Problem** | Main screen, toggle overview | XYZ scaling to 250 orders/day; spreadsheets breaking; why we built 2 separate views. |
| **0:40 – 1:40** | **2. Warehouse Floor** | Click **Warehouse**, pick order, simulate error, scan & stage | Big buttons for non-tech workers; barcode check stops wrong variants; staging bays. |
| **1:40 – 2:30** | **3. Office Hub** | Click **Office**, check cutoff timer, create label | Real-time visibility, live rush countdowns, smart courier selection. |
| **2:30 – 3:15** | **4. Inventory & Exceptions** | Click **Inventory** (receive stock), **Exceptions** (resolve issue) | Managing 2 warehouses separately; formal exception desk instead of lost notes. |
| **3:15 – 3:45** | **5. Analytics** | Click **Analytics**, show KPIs & funnel | Cycle time down from 2h+ to 74 mins; 99.4% accuracy; team workload at 80%. |
| **3:45 – 4:00** | **6. Wrap-Up** | Return to main screen, thank viewer | Summary of impact and thank you. |

---

## Word-for-Word Speaking Script

### [0:00 – 0:40] Section 1: The Problem & Our Approach (40s)

**[SCREEN ACTION]**:
- Start on the main app screen (`http://localhost:5173/`).
- Hover over the top bar showing **Office** and **Warehouse**.

**[WHAT TO SAY]**:
> "Hi everyone! Today I’m walking you through the Fulfillment Hub I built for XYZ.
>
> As an Operations Analyst, the core problem is clear: XYZ grew to 200 to 300 orders a day, but is still running on spreadsheets.
>
> At this scale, spreadsheets fail:
> - Priority orders miss courier cutoffs.
> - Workers pick the wrong color or variant.
> - Stock is split between two warehouses, so items look available but aren't on the shelf.
> - And the warehouse team isn't very comfortable with complex software.
>
> That's why I made a key choice: I separated the app into two simple tools. A touch-friendly screen for the warehouse floor, and a control hub for the office. Let’s start in the warehouse."

---

### [0:40 – 1:40] Section 2: Warehouse Floor (Simple & Mistake-Proof) (60s)

**[SCREEN ACTION]**:
- Click **"Warehouse"** in top navbar.
- Click **"PICK & PACK"** on order `#XYZ-9402` (the top Rush order).
- In the pack popup, click **"Simulate Error"** (screen flashes red).
- Click **"Scan Barcode"** for both items.
- Pick a box size, note **Bay A**, and click **"Complete Pack"**.

**[WHAT TO SAY]**:
> "On the warehouse floor, simplicity is key.
>
> We know the team isn't tech-savvy, so this screen has large buttons, high contrast, and zero clutter. 
> Priority rush orders stay pinned at the top with live countdowns so deadlines are never missed.
>
> Let's click 'Pick & Pack' on this rush order.
>
> Previously, shipping the wrong variant was a major problem—like sending Midnight Blue instead of Navy.
>
> I solved this with product photos, exact shelf locations, and barcode verification.
> Watch what happens if a picker grabs the wrong item—I'll click 'Simulate Error'.
> The screen flashes red and blocks them. It is impossible to pack the wrong item.
>
> When the right barcode is scanned, it confirms the match.
> Once packed, the app tells the worker: 'Place in Bay A for DHL Express'.
> Dedicated bays mean boxes are never lost in random corners."

---

### [1:40 – 2:30] Section 3: Office Operations (Live SLAs & Couriers) (50s)

**[SCREEN ACTION]**:
- Click **"Office"** in top navbar.
- Point to the KPI bar at top (Queue, Cutoffs, Staged, Exceptions).
- Click **"Create Label"** on unassigned order `#XYZ-9401`.
- Show the 4 couriers side by side with rates and cutoff times.

**[WHAT TO SAY]**:
> "Now let's switch to the Office view. With only 1 or 2 people in the office, they need complete visibility without digging through spreadsheets.
>
> The top bar tracks the full queue and approaching courier cutoffs in real time.
>
> When creating a shipping label, the office can compare couriers side by side: DHL, FedEx, Royal Mail, and City Courier.
>
> Instead of guessing, they can balance speed, cost, and pickup times. This simple comparison saves XYZ about a dollar eighty per package while meeting customer delivery promises."

---

### [2:30 – 3:15] Section 4: Dual Warehouses & Exception Desk (45s)

**[SCREEN ACTION]**:
- Click **"Inventory"** tab. Show Main Warehouse vs Warehouse 2 columns.
- Click **"Receive Stock"** on transfer `#TR-1082`.
- Click **"Exceptions"** tab. Click **"Resolve Exception"**.

**[WHAT TO SAY]**:
> "Next, let’s look at inventory. XYZ only ships from the Main Warehouse, but keeps extra stock in a second warehouse nearby.
>
> Spreadsheets combined these numbers, so workers would walk to empty shelves.
>
> Here in the Inventory tab, both facilities are tracked separately. When shelf stock runs low, the office requests a transfer. Once the van arrives, clicking 'Receive Stock' immediately unblocks orders.
>
> And in our Exceptions Desk, any missing or damaged item reported by floor workers is tracked until resolved. No more forgotten sticky notes."

---

### [3:15 – 3:45] Section 5: Operations Analytics (30s)

**[SCREEN ACTION]**:
- Click **"Analytics"** tab.
- Point to Cycle Time (74 min), Accuracy (99.4%), and Labor Utilization (80%).

**[WHAT TO SAY]**:
> "Finally, as an Operations Analyst, we track the metrics:
> - **Average Order Cycle Time** dropped from over 2 hours down to **74 minutes**—cutting fulfillment time in half.
> - **Pick Accuracy** reached **99.4%**, virtually eliminating wrong-item returns.
> - **Priority SLA Hit Rate** is at **100%**.
> - And our **Labor Utilization** shows the 3 floor workers operating at a healthy, sustainable 80% workload."

---

### [3:45 – 4:00] Section 6: Wrap-Up (15s)

**[SCREEN ACTION]**:
- Click back to the **Orders** tab.
- Smile at the camera.

**[WHAT TO SAY]**:
> "In summary, this Fulfillment Hub replaces spreadsheet chaos with a simple, mistake-proof tool for the warehouse and clear control for the office.
>
> Thank you so much for your time and for reviewing my project!"

---

## Recording Tips for a Crisp 4-Minute Video

1. **Speak naturally**: Speak at a comfortable conversation speed (~130–140 words per minute). Don't rush; the script is intentionally timed with breathing room.
2. **Move your mouse before you speak**: Move the cursor to each button or card a split-second before you mention it.
3. **Practice with a timer once**: You'll find this script lands comfortably between 3 minutes 45 seconds and 4 minutes.
