# System Domain - FlowPay

## 1. Entities

### Team

Represents the support teams.

- CARTOES
- EMPRESTIMOS
- OUTROS

---

### Agent

Represents a support agent in the system.

**Fields:**
- id
- name
- team (CARTOES | EMPRESTIMOS | OUTROS)
- activeTickets (derived)

**Rules:**
- An agent belongs to only one team
- Can have at most 3 active tickets

---

### Ticket

Represents a support request.

**Fields:**
- id
- subject
- team
- status (QUEUED | ASSIGNED | COMPLETED)
- agentId (optional)
- createdAt
- queuePosition (optional)

---

## 2. Ticket Status

- QUEUED → waiting in queue
- ASSIGNED → assigned to an agent
- COMPLETED → completed

---

## 3. Business Rules

### BR01 - Capacity
An agent can have at most 3 ASSIGNED tickets.

---

### BR02 - Distribution
The system must prioritize agents with the lowest active ticket load.

---

### BR03 - Queue
The queue must be separated by team and follow FIFO.

---

### BR04 - Reassignment
When completing a ticket:
1. Free up the agent's capacity
2. Check the queue for the same team
3. Automatically assign the next ticket