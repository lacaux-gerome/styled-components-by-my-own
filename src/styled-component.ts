import React, { PropsWithChildren } from "react";

enum DomElements {
  a = "a",
  col = "col",
  colgroup = "colgroup",
  data = "data",
  datalist = "datalist",
  dd = "dd",
  del = "del",
  details = "details",
  dfn = "dfn",
  dialog = "dialog",
  div = "div",
  dl = "dl",
  dt = "dt",
  em = "em",
  embed = "embed",
  fieldset = "fieldset",
  figcaption = "figcaption",
  figure = "figure",
  footer = "footer",
  form = "form",
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
  head = "head",
  header = "header",
  hgroup = "hgroup",
  hr = "hr",
  html = "html",
  i = "i",
  iframe = "iframe",
  img = "img",
  input = "input",
  ins = "ins",
  kbd = "kbd",
  keygen = "keygen",
  label = "label",
  legend = "legend",
  li = "li",
  link = "link",
  main = "main",
  map = "map",
  mark = "mark",
  marquee = "marquee",
  menu = "menu",
  menuitem = "menuitem",
  meta = "meta",
  meter = "meter",
  nav = "nav",
  noscript = "noscript",
  object = "object",
  ol = "ol",
  optgroup = "optgroup",
  option = "option",
  output = "output",
  p = "p",
  param = "param",
  picture = "picture",
  pre = "pre",
  progress = "progress",
  q = "q",
  rp = "rp",
  rt = "rt",
  ruby = "ruby",
  s = "s",
  samp = "samp",
  script = "script",
  section = "section",
  select = "select",
  small = "small",
  source = "source",
  span = "span",
  strong = "strong",
  style = "style",
  sub = "sub",
  summary = "summary",
  sup = "sup",
  table = "table",
  tbody = "tbody",
  td = "td",
  textarea = "textarea",
  tfoot = "tfoot",
  th = "th",
  thead = "thead",
  time = "time",
  title = "title",
  tr = "tr",
  track = "track",
  u = "u",
  ul = "ul",
  var = "var",
  video = "video",
  wbr = "wbr",
  circle = "circle",
  clipPath = "clipPath",
  defs = "defs",
  ellipse = "ellipse",
  foreignObject = "foreignObject",
  g = "g",
  image = "image",
  line = "line",
  linearGradient = "linearGradient",
  marker = "marker",
  mask = "mask",
  path = "path",
  pattern = "pattern",
  polygon = "polygon",
  polyline = "polyline",
  radialGradient = "radialGradient",
  rect = "rect",
  stop = "stop",
  svg = "svg",
  text = "text",
  tspan = "tspan",
}

class StyledComponents {
  constructor() {
    Object.values(DomElements).forEach((key) => {
      // @ts-ignore
      this[key] = this.__constructDomApi;
    });
  }
  /**
   * Recursive generation for random className
   */
  private __generateClassName(
    length: number,
    { index = 0, value }: { index: number; value: string }
  ): string {
    if (index === length) {
      return value;
    }
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    const randomChar = characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
    return this.__generateClassName(length, {
      index: index + 1,
      value: `${value}${randomChar}`,
    });
  }

  private __getStyle() {
    let styleElement: HTMLStyleElement | null = null;
    if (styleElement) return styleElement;
    styleElement = this.__styleCreation();
    return styleElement;
  }

  private __styleCreation() {
    const style = document.createElement("style");
    style.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(style);
    return style;
  }
  /**
   * generic template for each dom element
   */
  public __constructDomApi<T>(
    css: TemplateStringsArray,
    ...exprs: ((props: T) => string)[]
  ): (props: PropsWithChildren<T>) => JSX.Element {
    const generatedClassName = this.__generateClassName(7, {
      index: 0,
      value: "",
    });
    const style = this.__getStyle();
    return (props: T) => {
      const cssParsed = exprs.reduce(
        (str: string, item: ((props: T) => string) | string, index: number) => {
          const toStringExpr = guardIsFunction(item) ? item(props) : item;
          return `${str}${css[index]}${toStringExpr}`;
        },
        ""
      );
      style.innerHTML = `.${generatedClassName} {
        ${cssParsed}
      }`;
      const ownProps = {
        className: generatedClassName,
        ...props,
      };
      return React.createElement("div", ownProps);
    };
  }
}
const guardIsFunction = (expr: any): expr is (...props: any) => any =>
  typeof expr === "function";

const styledInstance = new StyledComponents();
export const styled = styledInstance as StyledComponents &
  Record<
    DomElements,
    <T>(
      css: TemplateStringsArray,
      ...exprs: ((props: T) => string)[]
    ) => (props: React.PropsWithChildren<T>) => JSX.Element
  >;
