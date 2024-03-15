// Define types based on the provided declarations
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

// Helper function to convert a mixed input to a string value
function toVal(mix: ClassValue): string {
  let str: string = "";

  if (typeof mix === "string" || typeof mix === "number" || mix === null) {
    str += mix;
  } else if (typeof mix === "boolean" || typeof mix === "undefined") {
    // For boolean and undefined, don't add to string
  } else if (Array.isArray(mix)) {
    for (let k = 0; k < mix.length; k++) {
      const y = toVal(mix[k]);
      if (y) {
        str && (str += " ");
        str += y;
      }
    }
  } else {
    for (const key in mix) {
      if (mix.hasOwnProperty(key) && mix[key]) {
        str && (str += " ");
        str += key;
      }
    }
  }

  return str;
}

// Main clsx function
function clsx(...inputs: ClassValue[]): string {
  let str: string = "";

  for (let i = 0; i < inputs.length; i++) {
    const x = toVal(inputs[i]);
    if (x) {
      str && (str += " ");
      str += x;
    }
  }

  return str;
}

export default clsx;
