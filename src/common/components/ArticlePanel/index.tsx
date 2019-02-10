import React, { useEffect, useState } from 'react';
import Article, { IArticle, IArticleComment } from '@/common/models/Article';
import { Skeleton } from 'antd';
import MarkdownDiv from '../MarkdownDiv';
import { observer } from 'mobx-react-lite';
import { staticBaseUrl } from '@/common/kit/req';
import 'github-markdown-css/github-markdown.css';
import AudioPlayer from '../AudioPlayer';
const ReactAudioPlayer = require('react-audio-player').default;
import './index.scss'

interface Props {
  article: Article;
}

function ArticlePanel({ article }: Props) {
  const [ content, setContent ] = useState(
    <div dangerouslySetInnerHTML={{ __html: article.content }} />
  );
  useEffect(() => {
    article.fetchAudio();
    (async () => {
      if (article.contentType === 'html') {
      } else {
        setContent(<MarkdownDiv md={article.content} />);
      }
    })();
  }, []);

  let audio = null;
  if (article.audio) {
    if (__DEV__) {
      if (article.audio.resource.startsWith('/static')) {
        article.audio.resource = staticBaseUrl + article.audio.resource;
      }
    }
    audio = (
      <AudioPlayer
        recorder={article.audio.recorder}
        resource={article.audio.resource}
      />
    );
  }

  return (
    <div className={'ArticlePanel'}>
      <h1 className="Title">{article.title}</h1>
      <div className="AuthorInfo">
        <span>
          {new Date(article.publishAt || article.createAt).toLocaleDateString()}
        </span>
        <span style={{marginLeft:"1em"}} >{article.nickName}</span>
      </div>
      <div style={{marginBottom:"1em"}} >{audio}</div>
      <div className={'  markdown-body'}>{content}</div>
    </div>
  );
}

export default observer(ArticlePanel);
