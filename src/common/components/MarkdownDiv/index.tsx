import React, { FunctionComponent, useEffect, useState } from "react";
import "github-markdown-css/github-markdown.css";
import { markdownToHtml } from "@/common/kit/functions";

export default function MarkdownDiv({
  md,
  ...otherProps
}: { md: string } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    markdownToHtml(md).then(setHtml);
  }, [md]);
  return (
    <div
      {...otherProps}
      className={
        otherProps.className
          ? `${otherProps.className} markdown-body`
          : "markdown-body"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
