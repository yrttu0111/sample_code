import { RestaurantService } from "../service/restaurant.service.dto";

@ApiTags("음식점")
@Controller("restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: "좌표로 전체 조회" })
  @ApiResponse({ type: TrainerResponseDto, isArray: true })
  @Get("all")
  async findAll(
    @Query("") query: FindRestaurantDto
  ): Promise<PageDto<RestaurantResponseDto[]>> {
    return await this.restaurantService.findAll(query);
  }
}
