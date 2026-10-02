import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SessionEntity, SessionSchema } from './session.entity';

@Schema({ collection: 'films' })
export class FilmEntity {
  @Prop({ required: true, unique: true }) id: string;
  @Prop({ required: true }) rating: number;
  @Prop({ required: true }) director: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ required: true }) image: string;
  @Prop({ required: true }) cover: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) about: string;
  @Prop({ required: true }) description: string;
  @Prop({ type: [SessionSchema], default: [] }) schedule: SessionEntity[];
}
export const FilmSchema = SchemaFactory.createForClass(FilmEntity);
