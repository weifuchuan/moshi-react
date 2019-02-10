import React, { FunctionComponent, useEffect, useState } from 'react';
import 'github-markdown-css/github-markdown.css';

export default function HtmlDiv({
  html,
  ...otherProps
}: { html: string } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      {...otherProps}
      className={
        otherProps.className ? (
          `${otherProps.className} markdown-body`
        ) : (
          'markdown-body'
        )
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
