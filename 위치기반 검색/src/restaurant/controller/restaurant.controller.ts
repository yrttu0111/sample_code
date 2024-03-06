import { CreateRestaurantDto } from "../dto/create-restaurant.dto";
import { RestaurantResponseDto } from "../dto/response-restaurant.dto";
import { RestaurantService } from "../service/restaurant.service.dto";

@ApiTags("음식점")
@Controller("restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: "좌표로 전체 조회" })
  @ApiResponse({ type: RestaurantResponseDto, isArray: true })
  @Get("all")
  async findAll(
    @Query("") query: FindRestaurantDto
  ): Promise<PageDto<RestaurantResponseDto[]>> {
    return await this.restaurantService.findAll(query);
  }
  @ApiOperation({ summary: "식당 등록" })
  @ApiBody({ type: CreateGymDto })
  @ApiResponse({ type: RestaurantResponseDto })
  @Post()
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto
  ): Promise<RestaurantResponseDto> {
    return this.restaurantService.create(createRestaurantDto);
  }
}
