# 5-Minute Video Walkthrough Script: XYZ Fulfillment Hub

> **Role Context**: Operations Analyst Candidate  
> **Target Duration**: Under 5 minutes (~4 minutes 30 seconds)  
> **Key Goal**: Clearly explain how you understood the problem, what you built and how it works, and why you made your design choices.  
> **Tone**: Simple, natural, conversational spoken English.  

---

## Quick Timeline & Overview

| Time | Section | Screen Action | What You Explain |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:45** | **1. The Problem** | Main screen & role switcher | XYZ growing to 250 orders/day, spreadsheet breakdown, office vs warehouse needs. |
| **0:45 – 2:00** | **2. Warehouse Floor** | Switch to Warehouse view, open order, scan items, stage box | Big touch buttons, barcode check to prevent wrong items, organized staging bays. |
| **2:00 – 3:00** | **3. Office Operations** | Switch to Office view, check priority timer, create label | Order pipeline, rush countdowns, and choosing the best courier. |
| **3:00 – 3:45** | **4. Inventory & Exceptions** | Inventory tab, receive transfer, resolve exception | Managing the 2 warehouses, moving stock, and fixing order issues quickly. |
| **3:45 – 4:30** | **5. Operations Analytics** | Analytics tab | Order cycle time, team workload, and overall operational results. |
| **4:30 – 4:45** | **6. Wrap-Up** | Back to main screen | Quick wrap-up and closing thank you. |

---

## Word-for-Word Speaking Script

### [0:00 – 0:45] Section 1: The Problem & Our Approach

**[SCREEN ACTION]**:
- Have the app open at `http://localhost:5173/`.
- Hover your mouse over the top navigation bar showing **Office** and **Warehouse**.

**[WHAT TO SAY]**:
> "Hi everyone! Today I’m walking you through the Fulfillment Hub I designed for XYZ.
>
> When looking at XYZ as an Operations Analyst, the core problem is clear: the company grew to around 200 to 300 orders a day, but it’s still running on spreadsheets and shared folders.
>
> At this volume, spreadsheets start breaking down:
> - Priority orders get lost in the list and miss courier cutoff times.
> - Floor workers pick the wrong color or variant because paper pick lists have tiny text.
> - Stock is split between the Main Warehouse and a second overflow warehouse, so workers waste time looking for items that aren't on the shelf.
> - And packed boxes get misplaced before courier pickup.
>
> On top of that, the warehouse team isn't very comfortable with complicated software.
>
> That's why I made a key design choice: I split the app into two simple tools. A clean, touch-friendly screen for the warehouse floor, and a clear control hub for the office team. Let's look at the warehouse floor first."

---

### [0:45 – 2:00] Section 2: Warehouse Floor (Simple & Mistake-Proof)

**[SCREEN ACTION]**:
- Click **"Warehouse"** in the top navigation bar.
- Point to the station buttons (*Station 1, Station 2, Station 3*).
- Click **"PICK & PACK"** on order `#XYZ-9402` (the orange Rush order).
- In the pack modal, click **"Simulate Error"** to show the red warning.
- Then click **"Scan Barcode"** for both items to verify them.
- Choose a box size, note the staging bay (*Bay A*), and click **"Complete Pack"**.

**[WHAT TO SAY]**:
> "Here on the warehouse floor, simplicity is everything.
>
> We know the floor team isn't tech-savvy, so this screen has large buttons, high contrast, and zero clutter. 
>
> Notice that rush orders with urgent deadlines stay pinned at the top with a live timer. The worker doesn't have to search or guess what to pick next.
>
> Let's click 'Pick & Pack' on this priority order.
>
> In the old system, shipping the wrong variant was a major headache. For example, Midnight Blue looks almost identical to Navy in dim warehouse lighting.
>
> To stop this, I added visual product photos, exact shelf locations, and a barcode scan check.
>
> Watch what happens if a picker grabs the wrong item and scans it—I'll click 'Simulate Error'.
> The system immediately flashes red and blocks them. It is impossible to pack the wrong item.
>
> When the correct items are scanned, the screen confirms the match.
>
> Once packed, the app tells the worker exactly where to put the box: 'Place in Bay A for DHL Express'.
> By giving each courier its own physical bay, packed boxes never get lost in random corners again."

---

### [2:00 – 3:00] Section 3: Office Operations (SLA Tracking & Courier Choice)

**[SCREEN ACTION]**:
- Click **"Office"** in the top navigation bar.
- Point out the top summary numbers (Queue, Cutoffs, Staged, Exceptions).
- Switch from **Table** view to **Pipeline** view briefly to show the stages.
- Click **"Create Label"** on an unassigned order (`#XYZ-9401`).
- Show the courier options with cost, transit time, and cutoff hours.

**[WHAT TO SAY]**:
> "Now let's switch to the Office view. The office team has only one or two people, so they need to see everything at a glance without digging through spreadsheet tabs.
>
> At the top, they can see the whole queue, priority cutoffs, and staged boxes in real time.
>
> The countdown timers show exactly how much time is left before courier cutoffs. If an order is close to its deadline, it highlights immediately so it gets handled first.
>
> When the office creates a shipping label, they can compare couriers side by side.
> Instead of guessing, they can see the cost, delivery speed, and cutoff time for DHL, FedEx, Royal Mail, and City Courier.
>
> This lets the office pick the most cost-effective courier while still meeting customer delivery promises, saving about a dollar eighty per package."

---

### [3:00 – 3:45] Section 4: Dual Warehouses & Handling Exceptions

**[SCREEN ACTION]**:
- Click the **"Inventory"** tab.
- Point out the stock split between Main Warehouse and Warehouse 2.
- Click **"Receive Stock"** on transfer `#TR-1082`.
- Click the **"Exceptions"** tab.
- Click **"Resolve Exception"** and show how the order returns to the queue.
- Click the **"Staging & Dispatch"** tab and briefly open the **Dispatch Manifest**.

**[WHAT TO SAY]**:
> "Next, let's look at one of XYZ's biggest problems: inventory across two warehouses.
>
> Orders only ship from the Main Warehouse, but extra stock sits in Warehouse 2. In the old spreadsheet, numbers were lumped together. So a worker would walk to an empty shelf, not knowing the stock was still in the second building.
>
> Here in the Inventory tab, stock in both locations is tracked clearly. When main shelf stock runs low, the office requests a quick transfer. When the van arrives, one click on 'Receive Stock' puts the items back on the shelf.
>
> If a floor worker ever finds a missing or damaged item, they report it right from their screen. It instantly appears here in the Exceptions Desk so the office can fix it. No more forgotten sticky notes or verbal messages.
>
> And in Staging & Dispatch, we have a clear handover manifest for the courier driver to sign, making sure no box is left behind."

---

### [3:45 – 4:30] Section 5: Operations Analytics (Measuring Impact)

**[SCREEN ACTION]**:
- Click the **"Analytics"** tab.
- Point to the KPI cards: Cycle Time, Pick Accuracy, Priority SLA, Freight Cost.
- Show the **Cycle Time Funnel** and the **Labor Utilization** bar.

**[WHAT TO SAY]**:
> "Finally, let's look at the Analytics tab. As an Operations Analyst, measuring process performance is essential.
>
> Here we track our key operational improvements:
> - **Average Order Cycle Time** dropped from over two hours down to **74 minutes**—cutting order processing time in half.
> - **Pick Accuracy** is up to **99.4%**, because barcode verification stops variant mix-ups at the packing table.
> - **Priority SLA Hit Rate** is at **100%**, thanks to our live countdowns.
> - And our **Labor Utilization** shows that our 2 to 3 floor workers are working at a steady, sustainable 80% capacity without burning out.
>
> The cycle time funnel breaks down each step—from order review to shelf picking and staging—so we can spot bottlenecks before they cause delays."

---

### [4:30 – 4:45] Section 6: Conclusion

**[SCREEN ACTION]**:
- Navigate back to the **Orders** screen.
- Move cursor smoothly and smile at the camera.

**[WHAT TO SAY]**:
> "To wrap up: this application directly solves XYZ's core growing pains. 
> It gives the warehouse team a simple, mistake-proof tool that doesn't overwhelm them, and gives the office full visibility and control over orders, stock, and couriers.
>
> Thank you so much for your time and for reviewing my project!"

---

## Easy Recording Tips

1. **Keep your voice relaxed and conversational**: Imagine you are explaining the project to a friendly teammate over Zoom.
2. **Move your mouse deliberately**: Point to the button or section right before you speak about it.
3. **Practice once with a timer**: The script has around 650 words. Spoken at a normal, clear pace (around 140–150 words per minute), it takes about 4 minutes and 20 seconds, safely under the 5-minute limit.
4. **Don't worry about perfection**: If you stumble on a word, just take a breath and keep going naturally.
