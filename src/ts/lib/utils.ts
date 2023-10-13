import { TypeTag, Item } from "./types";

export function Tag(s: string): Item {
  return {
    tag: TypeTag.Tag,
    value: s
  };
}
export function DestructureTag(n: Item | undefined): string | null {
  if (!n) return null;
  if (n.tag == TypeTag.Tag && typeof (n.value) == "string") return n.value;
  return null;
} 

export function Number(n: number): Item {
  return {
    tag: TypeTag.Number,
    value: n
  };
}
export function DestructureNumber(n: Item | undefined): number | null {
  if (n == undefined) return null;
  if (n.tag == TypeTag.Number && typeof (n.value) == "number") return n.value;
  return null;
}

export function String(s: string): Item {
  return {
    tag: TypeTag.String,
    value: s
  };
}
export function DestructureString(n: Item | undefined): string | null {
  if (n == null) return null;
  if (n.value == "") return "";
  if (n.tag == TypeTag.String && typeof (n.value) == "string") return n.value;
  return null;
}

export function Identifier(s: string): Item {
  return {
    tag: TypeTag.Identifier,
    value: s
  };
}
export function DestructureIdentifier(n: Item | undefined): string | null {
  if (!n) return null;
  if (n.tag == TypeTag.Identifier && typeof (n.value) == "string") return n.value;
  return null;
}

export function isNumeric(str: string): boolean {
  if (typeof str != "string") return false;
  return !isNaN(parseFloat(str));
}
