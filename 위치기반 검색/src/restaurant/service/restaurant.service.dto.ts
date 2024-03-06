import { NaverMapResponseDto } from "./../dto/response-naver-map.dto";
import { RestaurantResponseDto } from "./../dto/response-restaurant.dto";
@Injectable()
export class RestaurantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly httpService: HttpService,
    private readonly subwaysService: SubwaysService
  ) {}

  async findAll(
    query: FindRestaurantDto
  ): Promise<PageDto<RestaurantResponseDto[]>> {
    const querystring = `SELECT r.id,
    ST_DISTANCE_SPHERE( POINT(${query.x}, ${
      query.y
    }), POINT(r.x, r.y)) AS distance FROM restaurant r left join menu m on r.menu_id = m.id WHERE r.status != 'WITHDRAWAL' ${
      query.districtCode ? `AND r.districtCode = '${query.districtCode}'` : ""
    } AND ST_DISTANCE_SPHERE(POINT(${query.x}, ${
      query.y
    }), POINT(r.x, r.y)) <= ${query.maxDistance}  ORDER BY distance LIMIT ${
      query.offset
    } OFFSET ${query.page * query.offset};`;

    const ids = await this.prisma.$queryRaw<
      (Restaurant & { distance: number })[]
    >(new Sql([querystring], []));

    const restaurant = await this.prisma.restaurant.findMany({
      where: {
        id: {
          in: ids.map((id) => id.id),
        },
      },
      include: {
        images: true,
      },
    });

    ids.map((id) => {
      Object.assign(
        id,
        id.distance,
        restaurant.find((r) => r.id === id.id)
      );
    });

    const totalString = `SELECT count(r.id) as count FROM restaurant r left join menu m on r.menu_id = m.id WHERE r.status != 'WITHDRAWAL' ${
      query.districtCode ? `AND r.districtCode = '${query.districtCode}'` : ""
    }  AND ST_DISTANCE_SPHERE(POINT(${query.x}, ${
      query.y
    }),POINT(r.x, r.y)) <= ${query.maxDistance}`;
    const total = await this.prisma.$queryRaw<{ count: number }[]>(
      new Sql([totalString], [])
    );

    return new PageDto({
      page: query.page,
      offset: query.offset,
      total: total[0].count,
      data: ids.map((id) => new RestaurantResponseDto(id)),
    });
  }
  async create(
    createRestaurantDto: CreateRestaurantDto
  ): Promise<RestaurantResponseDto> {
    if (
      await this.prisma.restaurant.findFirst({
        where: {
          name: createRestaurantDto.name,
          address: createRestaurantDto.address,
          status: { not: Status.WITHDRAWAL },
        },
      })
    ) {
      throw new DuplicateGymEntryException();
    }

    // naver map - geocode api 주소로 좌표 및 행정구역 정보 가져오기
    let response;
    await firstValueFrom(
      this.httpService
        .get(`https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode`, {
          headers: {
            "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
          },
          params: {
            query: createRestaurantDto.address,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException(error.message);
          })
        )
    ).then((res) => {
      response = res.data.addresses;
    });
    if (!response) {
      throw new NotFoundException("주소를 찾을 수 없습니다.");
    }
    response = new NaverMapResponseDto(response[0]);

    const nearestSubway = await this.subwaysService.findNearestSubway(
      response.x,
      response.y
    );

    const district = await this.prisma.district.findFirst({
      where: {
        sido: response.sido,
        sigu: response.sigu,
        dong: response.dong,
      },
    });

    const restaurant = await this.prisma.restaurant.create({
      data: {
        ...createRestaurantDto,
        subway: nearestSubway.name,
        subwayDistance: nearestSubway.distance?.toFixed(2),
        districtCode: district?.code,
        x: response.x,
        y: response.y,
        createdAt: dbNow(),
        updatedAt: dbNow(),
      },
    });

    Object.assign(restaurant, {
      district,
    });
    return new RestaurantResponseDto(restaurant);
  }
}
