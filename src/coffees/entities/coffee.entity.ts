import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coffee extends Document {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  brand: string;

  @Prop([String])
  flavour: string[];

  @Prop()
  rating: number;
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
