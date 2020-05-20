import React, { PropsWithChildren } from "react";

class StyledComponents {
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
  public div<T>(
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
export const styled = styledInstance;
