import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitComplaintDto {
  @ApiProperty({
    description: 'Judul aduan',
    example: 'Jalan rusak di depan rumah',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Isi detail aduan',
    example: 'Jalan di depan rumah nomor 42 rusak parah, ada lubang besar',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  content: string;

  @ApiProperty({
    description: 'NIK warga (opsional)',
    example: '1234567890123456',
    required: false,
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @IsOptional()
  @Length(16, 16)
  nik?: string;
}

export class SubmitLetterDto {
  @ApiProperty({
    description: 'Jenis surat',
    enum: ['SKTM', 'Domisili', 'Pengantar', 'Keterangan Usaha'],
  })
  @IsString()
  @IsNotEmpty()
  type: 'SKTM' | 'Domisili' | 'Pengantar' | 'Keterangan Usaha';

  @ApiProperty({
    description: 'NIK pemohon (16 digit)',
    example: '1234567890123456',
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  nik: string;

  @ApiProperty({
    description: 'Keperluan/alasan pengajuan',
    example: 'Mendaftar sekolah',
    required: false,
  })
  @IsString()
  @IsOptional()
  keperluan?: string;
}
