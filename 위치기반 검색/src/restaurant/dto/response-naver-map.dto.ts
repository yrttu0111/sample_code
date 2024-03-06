import { ApiProperty } from '@nestjs/swagger';
import { AddressElementResponseDto } from './response-address-element.dto';

export class NaverMapResponseDto {
  @ApiProperty({
    description: '도로명 주소',
  })
  roadAddress: string;

  @ApiProperty({
    description: '지번 주소',
  })
  jibunAddress: string;

  @ApiProperty({
    description: '영문 주소',
  })
  englishAddress: string;

  @ApiProperty({
    description: '시도',
  })
  sido?: string;

  @ApiProperty({
    description: '시구',
  })
  sigu?: string;

  @ApiProperty({
    description: '동',
  })
  dong?: string;

  @ApiProperty({
    description: 'x좌표',
  })
  x: number;

  @ApiProperty({
    description: 'y좌표',
  })
  y: number;

  @ApiProperty({
    description: '거리',
  })
  distance: number;

  constructor(
    naverMap: NaverMapResponseDto & {
      addressElements: AddressElementResponseDto[];
    },
  ) {
    this.roadAddress = naverMap.roadAddress;
    this.jibunAddress = naverMap.jibunAddress;
    this.englishAddress = naverMap.englishAddress;
    const addressElements = naverMap.addressElements.map(
      (element) => new AddressElementResponseDto(element),
    );
    this.sido =
      addressElements.find((element) => element.types[0] == 'SIDO')?.longName ??
      undefined;
    this.sigu =
      addressElements.find((element) => element.types[0] == 'SIGUGUN')
        ?.longName ?? undefined;
    this.dong =
      addressElements.find((element) => element.types[0] == 'DONGMYUN')
        ?.longName ?? undefined;

    this.x = naverMap.x;
    this.y = naverMap.y;
    this.distance = naverMap.distance;
  }
}
