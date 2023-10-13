import { Item, TypeTag } from "./types";
import { Number, isNumeric } from "./utils";

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

export function split_up(input: string): string[] {
  let output: string[] = [];
  let parsing_string = false;
  let current_value = "";

  for (const c of input) {
    if (parsing_string) {
      if (c == '"') {
        parsing_string = false;
        current_value += c;
        continue;
      }
      current_value += c;
    } else if (c == " " || c == "\n" || c == "\t") {
      if (current_value != "") {
        output.push(current_value.trim());
      }
      current_value = "";
    } else if (c == '"') {
      current_value += c;
      parsing_string = true;
    } else {
      current_value += c;
    }
  }

  if (current_value != "") output.push(current_value.trim());

  return output;
}

export function parse_token(input: string): Item {
  if (input === "0") {
    return Number(0);
  }
  if (input.startsWith('"')) {
    return {
      tag: TypeTag.String,
      value: input.slice(1, -1)
    };
  } else if (input.startsWith("#")) {
    return {
      tag: TypeTag.Tag,
      value: input.slice(1)
    };
  } else if (isNumeric(input)) {
    return {
      tag: TypeTag.Number,
      value: parseFloat(input)
    };
  }
  return {
    tag: TypeTag.Identifier,
    value: input
  };
}

