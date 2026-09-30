# 5-Minute Video Walkthrough Script: XYZ Fulfillment Hub

> **Role Context**: Operations Analyst Candidate  
> **Target Duration**: 4 minutes 45 seconds (Strictly under the 5-minute limit)  
> **Core Focus**: Process diagnosis, throughput & cycle time analysis, labor capacity modeling, Poka-Yoke error-proofing, and courier economics.  
> **Tone**: Analytical, structured, operationally grounded, metrics-driven  

---

## Video Outline & Timestamps

| Timestamp | Section | Visual Focus on Screen | Operational Focus |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:45** | **1. Problem Diagnosis & Capacity Equation** | Home Screen & Persona Switcher | Scale (200-300 orders/day), labor equation (2-3 workers), informational silos |
| **0:45 - 2:00** | **2. Warehouse Floor: Poka-Yoke & Anti-Error Kiosk** | Warehouse Kiosk: Pick list, barcode validation, staging bay | Error elimination, tech-averse ergonomics, cycle time reduction |
| **2:00 - 3:00** | **3. Office Hub: SLA Monitoring & Courier Optimization** | Order pipeline, live SLA timers, carrier rate matrix | On-Time In-Full (OTIF), shipping cost optimization ($1.80/order saved) |
| **3:00 - 3:55** | **4. Supply Chain Topology: Replenishment & Exception Triage** | Dual-warehouse stock, transfer shuttle, exception desk | ROP thresholds, eliminating ghost inventory deadlocks |
| **3:55 - 4:45** | **5. Operations Analytics Dashboard & Business Impact** | Operations Analytics & KPI Center tab | Lead time funnel, labor capacity %, root-cause Pareto analysis |

---

## Word-for-Word Script & Screen Choreography

### [0:00 - 0:45] Section 1: Problem Diagnosis & Capacity Equation

**[SCREEN ACTION]**: Open application at `http://localhost:5173/`. Point cursor to the top persona toggle: **Office Operations** vs **Warehouse Handheld Kiosk**.

**[VOICEOVER SCRIPT]**:
> "Hello everyone. Looking at XYZ's fulfillment operations through an **Operations Analyst lens**, XYZ is experiencing the classic breakdown of scaling from 50 to 250 orders a day using spreadsheets.
>
> Let's look at the operational math: 250 orders per day with 1.4 items per order equals **350 physical shelf picks per day**. 
>
> With a floor team of 2 to 3 workers, that requires a steady throughput of **16 picks per worker per hour**. But because XYZ's warehouse team is experienced but not very comfortable with technology, traditional software with tiny desktop tables would slow them down and cause errors.
>
> Furthermore, inventory is split across a **Main Warehouse and a Secondary Annex**, leading to blindspots and missing stock.
>
> My solution is built around **two purpose-designed operational interfaces**: an oversized, mistake-proof Touch Kiosk for the floor team, and an analytical Command Center for the office. Let’s start on the warehouse floor."

---

### [0:45 - 2:00] Section 2: Warehouse Floor (Poka-Yoke Error Proofing)

**[SCREEN ACTION]**: Click **"Warehouse Handheld Kiosk"** in top navbar.
The screen switches to high-contrast dark mode with large cards.
Point to worker station pills (*Station 1 - Dave*).
Click **"PICK & PACK"** on order `#XYZ-9402` (Priority Rush).

**[VOICEOVER SCRIPT]**:
> "On the warehouse floor, our primary goal is **First-Time-Right accuracy** and **minimizing motion waste**.
>
> Notice the interface: high-contrast dark mode, large touch targets, zero clutter. Urgent priority orders with approaching carrier cutoffs are automatically pinned at the top with live countdowns so SLAs are never breached.
>
> Let’s open order 9402. In the old spreadsheet system, wrong variants were frequently shipped because paper pick lists had small text and variants like Midnight Blue versus Navy look identical in warehouse lighting.
>
> We solved this using a **Poka-Yoke mistake-proofing design**: we display high-res product photos, exact coordinates—like `Aisle 2, Shelf A-01`—and high-visibility variant warning banners."

**[SCREEN ACTION]**: Click **"Test Wrong Scan"**. 
Watch the card flash red with an immediate alert: *"WRONG ITEM/VARIANT! Expected 890123450002"*.

**[VOICEOVER SCRIPT]**:
> "Watch: if a picker grabs the wrong variant, scanning the barcode instantly triggers an error and blocks the packaging step. It is physically impossible to pack the wrong item."

**[SCREEN ACTION]**: Click **"Scan Match"** for both items. Confetti fires!
Select box size (*Medium Box B2*), highlight designated staging bay (*Bay A - DHL Express*), and click **"Place in Bay A & Complete Pack"**.

**[VOICEOVER SCRIPT]**:
> "When the correct items match, the picker is directed to: *'Place in Bay A - DHL Express'*. 
> 
> Applying 5S Lean principles, every carrier has a dedicated physical staging bay. Boxes are never left in random corners, eliminating misplaced parcels."

---

### [2:00 - 3:00] Section 3: Office Hub (SLA Adherence & Courier Optimization)

**[SCREEN ACTION]**: Toggle back to **"Office Operations"**.
Show KPI bar at top. Toggle view from **Table** to **Pipeline (Kanban)**.
Open an unassigned order (`#XYZ-9401`) and click **"Create Label"**.

**[VOICEOVER SCRIPT]**:
> "Now let's switch to the Office Operations Hub. For the 1 to 2 office coordinators, this provides real-time throughput tracking.
>
> The live countdown timers monitor carrier cutoff deadlines in real time. If an order is within 60 minutes of cutoff, it flashes an urgent alert to prioritize processing.
>
> In the Courier Selection module, the office can compare carrier economics side-by-side: balancing speed, cost, and pickup window across DHL, FedEx, Royal Mail, and City Courier. 
> 
> This multi-carrier optimization saves XYZ an estimated **\$1.80 per order in freight costs**, while generating a thermal-ready barcode label that flows straight to the warehouse floor."

---

### [3:00 - 3:55] Section 4: Dual-Warehouse Topology & Exception Triage

**[SCREEN ACTION]**: Click **"Dual Warehouse Stock & Transfers"** tab.
Highlight `Heavy Aluminum Laptop Riser` showing `0 in Main Warehouse, 40 in Secondary Annex`.
Click **"Receive into Main Shelf"** on transfer `#TR-1082`.
Then switch to **"Exception Resolution Desk"** and resolve ticket `#EXC-101`.
Finally switch to **"Courier Staging & Dispatch"** and open the **Driver Pickup Manifest**.

**[VOICEOVER SCRIPT]**:
> "Next, let's examine supply chain topology. XYZ's biggest deadlock was inventory: customer orders only ship from the Main Warehouse, but bulk stock is kept in the Secondary Annex. 
>
> Under the spreadsheet model, an item showed 40 units in aggregate, but the picking shelf was empty, stalling the order.
>
> Here, stock across both facilities is tracked separately. When shelf stock falls below reorder point, an inter-warehouse transfer is requested. When the van arrives, clicking 'Receive into Main Shelf' replenishes inventory and unblocks waiting orders.
>
> In our Exception Desk, every issue reported on the floor is logged and audited—no more forgotten sticky notes. 
> 
> And at the courier dock, we generate an official **Driver Handover Manifest** for driver sign-off, completely eliminating missed pickups."

---

### [3:55 - 4:45] Section 5: Operations Analytics & Business Impact

**[SCREEN ACTION]**: Click the **"Operations Analytics & KPIs"** tab!
Walk through the KPI cards, the Fulfillment Funnel, the Labor Capacity meter, and the Root-Cause Pareto analysis.

**[VOICEOVER SCRIPT]**:
> "Finally, let's look at the **Operations Analytics & KPI Center**, built specifically for an operations analyst.
>
> We track our core operational metrics:
> - **Order-to-Ship Cycle Time** dropped from **147 minutes to 74 minutes**—a 50% cycle time reduction.
> - **Pick Accuracy** increased to **99.4%**, virtually eliminating variant returns.
> - **On-Time In-Full (OTIF)** is at **97.8%**.
> - Our **Labor Capacity Utilization** chart shows our 3 warehouse workers operating at a sustainable **82% load**, leaving a buffer for peak spikes.
> - And our **Fulfillment Velocity Funnel** pinpoints the exact duration of each step from order review to staging dwell time.
>
> In summary, this application transforms XYZ from a reactive, spreadsheet-dependent business into a structured, scalable, data-driven fulfillment engine. Thank you!"

---

## Recording Tips for Operations Analyst Candidates

1. **Speak with operational confidence**: Use terms like *cycle time, lead time, throughput, OTIF, Poka-Yoke, labor utilization, safety stock, and carrier mix*.
2. **Emphasize the Analytics Tab**: Showing the dedicated Analytics dashboard demonstrates that you think about processes quantitatively, not just cosmetically.
3. **Keep within the time limit**: The script is timed to 4:45. Maintain a brisk, professional pace.
