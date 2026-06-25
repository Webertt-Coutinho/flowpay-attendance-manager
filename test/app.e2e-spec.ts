import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';

describe('FlowPay (e2e)', () => {
  let app: INestApplication;

  const OTHER_TEAM = 'OUTROS';

  async function createOtherTeamTicket(subject: string) {
    const res = await request(app.getHttpServer())
      .post('/api/tickets')
      .send({ subject })
      .expect(201);

    expect(res.body.team).toBe(OTHER_TEAM);
    return res;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/tickets — creation', () => {
    it('creates a valid ticket', async () => {
      const subject = 'Problemas com cartão';

      const res = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject })
        .expect(201);

      expect(res.body.id).toEqual(expect.any(String));
      expect(res.body.subject).toBe(subject);
      expect(res.body.team).toEqual(expect.any(String));
      expect(res.body.status).toEqual(expect.any(String));
    });
  });

  describe('POST /api/tickets — subject routing', () => {
    it('routes "Problemas com cartão" to CARTOES', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject: 'Problemas com cartão' })
        .expect(201);

      expect(res.body.team).toBe('CARTOES');
    });

    it('routes "Contratação de empréstimo" to EMPRESTIMOS', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject: 'Contratação de empréstimo' })
        .expect(201);

      expect(res.body.team).toBe('EMPRESTIMOS');
    });

    it('routes any other subject to OUTROS', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject: 'Investment inquiry' })
        .expect(201);

      expect(res.body.team).toBe('OUTROS');
    });
  });

  describe('POST /api/tickets — distribution', () => {
    it('assigns ticket to an agent when the team has capacity', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject: 'Problemas com cartão' })
        .expect(201);

      expect(res.body.status).toBe('ASSIGNED');
      expect(res.body.agentId).toEqual(expect.any(String));
    });

    it('assigns ticket to the agent with the lowest load', async () => {
      const subject = 'Problemas com cartão';

      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/api/tickets')
          .send({ subject })
          .expect(201);
      }

      const res = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject })
        .expect(201);

      expect(res.body.status).toBe('ASSIGNED');
      expect(res.body.agentId).toBe('agent-2');
    });
  });

  describe('POST /api/tickets — capacity limit', () => {
    it('queues ticket when the team reaches maximum capacity', async () => {
      const subject = 'Problemas com cartão';

      for (let i = 0; i < 6; i++) {
        const res = await request(app.getHttpServer())
          .post('/api/tickets')
          .send({ subject })
          .expect(201);

        expect(res.body.status).toBe('ASSIGNED');
        expect(res.body.agentId).toEqual(expect.any(String));
      }

      const res = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject })
        .expect(201);

      expect(res.body.status).toBe('QUEUED');
      expect(res.body.agentId).toBeNull();
    });
  });

  describe('POST /api/tickets — FIFO (OUTROS team)', () => {
    it('assigns queue positions in arrival order', async () => {
      for (let i = 0; i < 3; i++) {
        await createOtherTeamTicket(`Filling slot ${i}`);
      }

      const ticketA = await createOtherTeamTicket('Ticket A');
      const ticketB = await createOtherTeamTicket('Ticket B');
      const ticketC = await createOtherTeamTicket('Ticket C');

      expect(ticketA.body).toMatchObject({
        status: 'QUEUED',
        queuePosition: 1,
      });
      expect(ticketB.body).toMatchObject({
        status: 'QUEUED',
        queuePosition: 2,
      });
      expect(ticketC.body).toMatchObject({
        status: 'QUEUED',
        queuePosition: 3,
      });
    });
  });

  describe('PATCH /api/tickets/:id/complete — completion', () => {
    it('completes an assigned ticket', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/tickets')
        .send({ subject: 'Problemas com cartão' })
        .expect(201);

      const res = await request(app.getHttpServer())
        .patch(`/api/tickets/${created.body.id}/complete`)
        .expect(200);

      expect(res.body.status).toBe('COMPLETED');
    });
  });

  describe('PATCH /api/tickets/:id/complete — queue processing (OUTROS team)', () => {
    it('assigns the next queued ticket when one is completed', async () => {
      const assigned = await createOtherTeamTicket('Filling slot 0');

      for (let i = 1; i < 3; i++) {
        await createOtherTeamTicket(`Filling slot ${i}`);
      }

      const ticketA = await createOtherTeamTicket('Ticket A');

      expect(ticketA.body.status).toBe('QUEUED');

      await request(app.getHttpServer())
        .patch(`/api/tickets/${assigned.body.id}/complete`)
        .expect(200);

      const summary = await request(app.getHttpServer())
        .get('/api/dashboard/summary')
        .expect(200);

      const outrosQueue = summary.body.queuesByTeam[OTHER_TEAM];

      expect(outrosQueue.queued).toBe(0);
      expect(outrosQueue.active).toBe(3);
      expect(
        outrosQueue.waiting.find((t: { id: string }) => t.id === ticketA.body.id),
      ).toBeUndefined();
    });
  });

  describe('GET /api/dashboard/summary', () => {
    it('returns totals and queues per team', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/summary')
        .expect(200);

      expect(res.body).toMatchObject({
        totalQueued: expect.any(Number),
        totalActive: expect.any(Number),
        totalCompleted: expect.any(Number),
        queuesByTeam: expect.any(Object),
      });

      const teamSummary = {
        queued: expect.any(Number),
        active: expect.any(Number),
        completed: expect.any(Number),
        waiting: expect.any(Array),
        assigned: expect.any(Array),
      };

      expect(res.body.queuesByTeam).toMatchObject({
        CARTOES: expect.objectContaining(teamSummary),
        EMPRESTIMOS: expect.objectContaining(teamSummary),
        OUTROS: expect.objectContaining(teamSummary),
      });
    });
  });
});
