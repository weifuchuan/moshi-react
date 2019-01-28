import * as React from "react";
import axios from "axios";
import { Converter } from "showdown";
import { Effect } from "@redux-saga/types";
import { all, call } from "@redux-saga/core/effects";
import moment from "moment";

moment.locale("zh-cn");

export async function retryDo<Result = any>(
  action: () => Promise<Result>,
  retryCount: number = 3
): Promise<Result> {
  if (retryCount > 1) {
    try {
      return await action();
    } catch (err) {
      return await retryDo(action, retryCount - 1);
    }
  } else {
    try {
      return await action();
    } catch (err) {
      throw err;
    }
  }
}

// repeat run f by timeout if f return false
export function repeat(f: () => boolean, timeout: number = 1000 / 60) {
  const g: any = (g: any) => {
    if (f()) {
      return;
    }
    setTimeout(() => {
      g(g);
    }, timeout);
  };
  g(g);
}

export function packToClassComponent<P>(C: React.FunctionComponent<P>) {
  return class extends React.Component<P> {
    render(): React.ReactNode {
      return <C {...this.props} />;
    }
  };
}

const onceLength = 100000;

const converter = new Converter();
converter.setFlavor("github");
const cache: Map<string, string> = new Map();
export async function markdownToHtml(md: string): Promise<string> {
  if (cache.has(md)) {
    return cache.get(md)!;
  }
  const lines = md.split("\n");
  let containsCode = false;
  for (let line of lines) {
    if (line.trim() === "```") {
      containsCode = true;
      break;
    }
  }
  if (containsCode) {
    const { data } = await axios.post(
      "https://api.github.com/markdown",
      { text: md, mode: "markdown" },
      { responseType: "text" }
    );
    cache.set(md, data);
    return data;
  } else {
    const data = converter.makeHtml(md);
    cache.set(md, data);
    return data;
  }
}

export function selectFiles(): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.style.display = "none";
    input.onchange = () => {
      if (input.files) {
        const files: File[] = [];
        for (let i = 0; i < input.files.length; i++) {
          files.push(input.files.item(i)!);
        }
        resolve(files);
      } else {
        reject();
      }
    };
    document
      .getElementsByTagName("html")!
      .item(0)!
      .appendChild(input);
    input.click();
  });
}

export function combineSagas(
  sagas: (() => IterableIterator<Effect<any>>)[]
): Effect<any> {
  return all(
    sagas
      .map(
        saga =>
          function*(): IterableIterator<Effect> {
            while (true) {
              try {
                yield call(saga);
                break; // saga退出时退出
              } catch (error) {
                // saga异常时重启
                console.error(error);
              }
            }
          }
      )
      .map(call)
  );
}

export function* repeatSaga(
  saga: () => IterableIterator<Effect>
): IterableIterator<Effect> {
  while (true) {
    yield* saga();
  }
}

export function formatTime(at: number) {
  return moment(at).format("YYYY-MM-DD HH:mm");
}

export function fromNow(at: number) {
  const days = (Date.now() - at) / (1000 * 60 * 60 * 24 * 30);
  if (days < 31) return moment(at).fromNow();
  else return formatTime(at);
}

if (__DEV__) {
  (window as any).markdownToHtml = markdownToHtml;
  (window as any).selectFiles = selectFiles;
}
