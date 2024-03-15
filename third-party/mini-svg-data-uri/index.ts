import colorPatterns from "./shorter-css-color-names";

type ColorRegexPatterns = typeof colorPatterns;

const REGEX = {
  whitespace: /\s+/g,
  urlHexPairs: /%[\dA-F]{2}/g,
  quotes: /"/g,
};

function collapseWhitespace(str: string): string {
  return str.trim().replace(REGEX.whitespace, " ");
}

function dataURIPayload(string: string): string {
  return encodeURIComponent(string).replace(
    REGEX.urlHexPairs,
    specialHexEncode
  );
}

// `#` gets converted to `%23`, so quite a few CSS named colors are shorter than
// their equivalent URL-encoded hex codes.
function colorCodeToShorterNames(str: string): string {
  Object.keys(colorPatterns).forEach((key: keyof ColorRegexPatterns) => {
    const regex = colorPatterns[key];
    str = str.replace(regex, () => key as string);
  });

  return str;
}

function specialHexEncode(match: string): string {
  switch (match) {
    case "%20":
      return " ";
    case "%3D":
      return "=";
    case "%3A":
      return ":";
    case "%2F":
      return "/";
    default:
      return match.toLowerCase();
  }
}

function svgToTinyDataUri(svgString: string): string {
  if (typeof svgString !== "string") {
    throw new TypeError("Expected a string, but received " + typeof svgString);
  }
  // Strip the Byte-Order Mark if the SVG has one
  if (svgString.charCodeAt(0) === 0xfeff) {
    svgString = svgString.slice(1);
  }

  const body = colorCodeToShorterNames(collapseWhitespace(svgString)).replace(
    REGEX.quotes,
    "'"
  );
  return "data:image/svg+xml," + dataURIPayload(body);
}

svgToTinyDataUri.toSrcset = function toSrcset(svgString: string): string {
  return svgToTinyDataUri(svgString).replace(/ /g, "%20");
};

export default svgToTinyDataUri;
