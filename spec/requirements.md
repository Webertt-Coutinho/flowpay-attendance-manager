# System Requirements - FlowPay Attendance System

## 1. Objective

The system's goal is to manage and distribute customer support tickets among teams and agents, respecting routing rules, maximum capacity, and FIFO queueing.

---

## 2. Functional Requirements

### FR01 - Ticket creation
The system must allow creating tickets from customer requests.

### FR02 - Subject-based routing
The system must automatically route tickets to the correct teams:

- "Problemas com cartão" → CARTOES
- "Contratação de empréstimo" → EMPRESTIMOS
- Other subjects → OUTROS

### FR03 - Automatic distribution
The system must automatically assign the ticket to an available agent on the team.

### FR04 - Capacity limit
Each agent can have at most 3 active tickets at the same time.

### FR05 - Waiting queue
When no agents are available, the ticket must be placed in a queue.

### FR06 - FIFO
The queue must follow FIFO (First In, First Out) order per team.

### FR07 - Automatic reassignment
When completing a ticket, the system must free up capacity and automatically assign the next item in the queue.

### FR08 - Dashboard
The system must expose metrics to monitor the current state of tickets.