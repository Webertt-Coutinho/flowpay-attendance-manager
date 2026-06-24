import { Module } from "@nestjs/common";
import { SubjectRouterService } from "./subject-router.service";

@Module({
  imports: [],
  controllers: [],
  providers: [SubjectRouterService],
  exports: [SubjectRouterService],
})
export class RoutingModule {}