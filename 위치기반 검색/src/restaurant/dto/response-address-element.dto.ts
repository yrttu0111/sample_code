import { ApiProperty } from '@nestjs/swagger';

export class AddressElementResponseDto {
  @ApiProperty({
    description: '주소 타입',
  })
  types: string[];

  @ApiProperty({
    description: '긴 주소',
  })
  longName: string;

  @ApiProperty({
    description: '짧은 주소',
  })
  shortName: string;

  constructor(addressElement: AddressElementResponseDto) {
    this.types = addressElement.types;
    this.longName = addressElement.longName;
    this.shortName = addressElement.shortName;
  }
}
