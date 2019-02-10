import React, { FunctionComponent, useEffect, useState } from 'react';
import 'github-markdown-css/github-markdown.css';
import markdownToHtml from '@/common/kit/functions/markdownToHtml';
import { Skeleton, message } from 'antd';

export default function MarkdownDiv({
  md,
  ...otherProps
}: { md: string } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const [ html, setHtml ] = useState('');
  const [ loading, setLoading ] = useState(true);
  useEffect(
    () => {
      (async () => {
        setLoading(true);
        try {
          const html = await markdownToHtml(md);
          setHtml(html); 
        } catch (err) {
          message.error("转换Markdown为HTML失败：",err);
        }
        setLoading(false);
      })();
    },
    [ md ]
  );
  return (
    <Skeleton loading={loading}>
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
    </Skeleton>
  );
}
