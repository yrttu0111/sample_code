@Injectable()
export class RestaurantService {
  constructor(
    private readonly prisma: PrismaService,
    private filesService: FilesService
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

    const totalString = `SELECT count(t.id) as count FROM restaurant r left join menu m on r.menu_id = m.id WHERE r.status != 'WITHDRAWAL' ${
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
}
