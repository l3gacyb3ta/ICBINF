import { Item, TypeTag } from "./types";

export enum TypeTag {
  String,
  Number,
  Identifier,
  Tag,
  JSON,
}

export interface Item {
  tag: TypeTag;
  value: string | number | object;
}export interface Stack {
  main_stack: Item[];
  hold_stack: Item[];
}
interface StreamInterface<Type> {
  streamable: Type[];
  index: number;
}

export class Stream<Type> implements StreamInterface<Type> {
  streamable: Type[];
  index: number;
  constructor(value: Type[]) {
    this.streamable = value;
    this.index = 0;
  }
  consume(index: number = 1): Type | null {
    if ((this.index + 1) > this.streamable.length) return null;
    let value = this.streamable[this.index];
    this.index += index;
    return value;
  }
  peek(): Type | null {
    if ((this.index + 2) > this.streamable.length) return null;
    return this.streamable[this.index + 1];
  }
  seek(index: number): Type | null {
    if ((index + 1) > this.streamable.length) return null;
    this.index = index;
    return this.streamable[this.index];
  }
  seek_back(index: number): Type | null {
    if ((this.index + index + 1) > this.streamable.length) return null;
    this.index += index;
    return this.streamable[this.index];
  }
  inject(data: Type[]) {
    this.streamable.splice(this.index, 0, ...data);
  }
  replace(values: Type[]) {
    const newArray = [];
    for (let i = 0; i < this.index; i++) {
      newArray.push(this.streamable[i]);
    }
    newArray.push(...values);
    for (let i = this.index + 1; i < this.streamable.length; i++) {
      newArray.push(this.streamable[i]);
    }
    this.streamable = newArray;
  }

}
