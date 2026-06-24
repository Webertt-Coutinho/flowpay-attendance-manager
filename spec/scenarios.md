# Business Scenarios - FlowPay

## Scenario 1 - Subject-based routing

Given a ticket with subject "Problemas com cartão"
When it is created
Then it must be routed to the CARTOES team

---

## Scenario 2 - Automatic distribution

Given an available agent on the team
When a ticket is created
Then it must be automatically assigned to the agent with the lowest load

---

## Scenario 3 - Queue when at capacity

Given all agents on the team have 3 active tickets
When a new ticket is created
Then it must be placed in the team's queue

---

## Scenario 4 - Reassignment after completion

Given a ticket exists in the queue
And an agent completes a ticket
When a slot is freed
Then the next ticket in the queue must be automatically assigned

---

## Scenario 5 - Dashboard

Given the system is running
When the dashboard is queried
Then it must return up-to-date metrics for:
- active tickets
- queued tickets
- completed tickets