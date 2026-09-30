# AI Usage Note: Fulfillment Hub for XYZ

**Candidate Role**: Operations Analyst Candidate  
**Project**: Take-Home Project: Fulfillment Hub for XYZ E-Commerce  
**Document Limit**: Maximum 1 Page  

---

## 1. AI Tooling & How It Was Leveraged

During this project, I used **Antigravity (powered by Gemini & Claude models)** as an operational modeling and software synthesis partner. AI was utilized across three areas:

1. **Operational Data Synthesis & Metric Modeling**: Rapidly generating domain-authentic datasets matching XYZ's scale (250 orders/day volume profile, SKU variant confusion traps, dual-warehouse stock splits, and carrier rate/cutoff schedules).
2. **Component & Dashboard Scaffolding**: Accelerating the frontend build of the interactive KPI charts, Kanban pipeline, and barcode verification logic.
3. **Process Failure-Mode Stress-Testing**: Validating fulfillment edge cases (e.g., peak-hour labor bottlenecks, carrier pickup windows, and warehouse exception triage).

---

## 2. Critical Disagreements & Where Operational Judgment Overruled AI

While AI was effective for rapid scaffolding, relying solely on its suggestions would have resulted in an unworkable operational workflow. Below are two pivotal moments where my operational domain analysis contradicted AI recommendations, leading to superior design decisions.

### Moment 1: Rejecting a Dense Desktop ERP in Favor of a Poka-Yoke Warehouse Touch Kiosk

* **What the AI Suggested**: The AI initially generated a standard desktop data table with dense 12px font rows, multi-layered dropdown menus, and nested modals intended for both office and warehouse staff.
* **Operational Flaw**: The prompt noted: *"The warehouse team is experienced but not very comfortable with technology."* From a Lean / Human Factors perspective, expecting floor workers holding cartons in warehouse lighting to navigate small desktop table rows guarantees high error rates, slow pick times, and user rejection.
* **Operations Analyst Decision**: I overruled the AI and split the process into **two distinct interfaces**:
  1. An analytical **Office Operations Hub** for order intake, carrier optimization, and SLA tracking.
  2. A **Rugged Warehouse Touch Kiosk** built on **Poka-Yoke (mistake-proofing)** principles: oversized touch targets (48px+), visual product photos, clear aisle/shelf coordinates (`Aisle 2, Shelf A-01`), and interactive barcode validation that physically blocks the wrong variant from being packed.

---

### Moment 2: Overruling Automated Order Cancellation in Favor of an Inter-Warehouse Replenishment Loop

* **What the AI Suggested**: When architecting the missing inventory scenario, the AI proposed an automated cancellation webhook: if an item was missing from a shelf, the order would be auto-cancelled and a customer refund issued immediately.
* **Operational Flaw**: In e-commerce supply chains, premature cancellations destroy customer acquisition cost (CAC) and depress On-Time In-Full (OTIF) scores. Crucially, the prompt noted: *"When the main warehouse runs out of space, extra stock is kept in a second warehouse nearby."* Missing stock on a picking shelf does not mean stockout—it indicates an internal replenishment failure between the Secondary Annex and the Main Warehouse.
* **Operations Analyst Decision**: I rejected the AI's auto-cancellation logic and designed an **Inter-Warehouse Replenishment & Exception Triage Loop**:
  - The floor worker logs a 1-tap flag (`Missing Stock on Shelf`), which transitions the order to `BLOCKED` without stalling the rest of the queue.
  - The Office Operations Hub is alerted to trigger a **1-click Stock Transfer Request (`TR-XXXX`)** from the Secondary Annex.
  - Upon delivery at Dock 3, the inventory is received, the exception ticket is closed with an audit note, and the order is automatically returned to the priority pick lane.

---

## 3. Reflection on AI in Operations Analysis

In operations analysis, AI is a powerful accelerator for simulation and interface prototyping, but it lacks **empathy for physical operations**—it does not understand warehouse lighting, physical fatigue, or the supply chain cost of a cancelled customer order. By applying rigorous operational frameworks (Lean, Poka-Yoke, OTIF, and capacity modeling) on top of AI scaffolding, we created a system that is practical, robust, and scalable.
