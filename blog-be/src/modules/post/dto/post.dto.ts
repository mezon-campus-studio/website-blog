import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

const normalizeStringArray = (value: unknown): string[] | unknown => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : item))
      .filter((item): item is string => typeof item === 'string' && item.length > 0);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === 'string' ? item.trim() : item))
          .filter((item): item is string => typeof item === 'string' && item.length > 0);
      }
    } catch {
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return [];
  }

  return value;
};

export class CreatePostDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => normalizeStringArray(value))
  tagIds?: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => normalizeStringArray(value))
  tagIds?: string[];
}
