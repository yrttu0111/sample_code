import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { SubwaysService } from "@subways/service/subways.service";
import { FilesModule } from "@files/files.module";

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, SubwaysService],
  imports: [HttpModule, FilesModule],
})
export class RestaurantModule {}
