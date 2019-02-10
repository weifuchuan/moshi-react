import immediateInterval from '@/common/kit/functions/immediateInterval';
import {
  Button,
  Icon,
  InputNumber,
  message,
  Modal,
  notification,
  Spin,
  Table
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import * as rxjs from 'rxjs';
import { Observable } from 'rxjs';
import { useObservable } from 'rxjs-hooks';
import * as operators from 'rxjs/operators';
import { take } from 'rxjs/operators';
import EventEmitter from 'wolfy87-eventemitter';
import './App.scss';
import CEI from './copy_example_image';

require('./recorder/recorder-core.js');
require('./recorder/engine/mp3.js');
require('./recorder/engine/mp3-engine.js');
declare var Recorder: any;

export default observer(function App() {
  useEffect(() => {
    document.getElementById('preloading')!.parentElement!.removeChild(
      document.getElementById('preloading')!
    );
  }, []);

  const steps = [ <Ready />, <Play />, <End /> ];

  return <div className={'App'}>{steps[store.step]}</div>;
});

interface TestItem {
  name: string;
  wordGroups: string[][];
  recordStartAt: number[][];
  recordEndAt: number[][];
}

class Store {
  @observable step = 0;

  @observable countdown = 5;

  @observable analyzed = false;
  @observable audioDownloadUrl = '';

  @observable items: TestItem[] = [];

  @computed
  get words(): string[] {
    return _.flatMap(this.items.map((item) => _.flatMap(item.wordGroups)));
  }

  @observable imported = false;
  @observable minWordsCount = 2;
  @observable maxWordsCount = 6;

  @computed
  get tableDataSource(): { [key: string]: string }[] {
    const nextId = (function*() {
      for (let i = 1; ; i++) {
        yield i.toString();
      }
    })();
    const nextSuffix = function*(this: Store) {
      const rowCount = this.words.length / (this.items.length || 1);
      for (let j = 0; j < this.items.length; j++) {
        for (let i = 0; i < rowCount; i++) {
          for (let k = this.minWordsCount; k <= this.maxWordsCount; k++)
            for (let t = 0; t < k; t++) yield `${k}`;
        }
      }
    }.bind(this)();
    return this.items.reduce(
      (ret, item) => {
        _.flatMap(item.wordGroups).forEach((word, i) => {
          ret[i][item.name] = word + ' / ' + nextSuffix.next().value;
        });
        return ret;
      },
      Array.from(
        new Array(this.words.length / (this.items.length || 1)),
        (_) => ({ id: nextId.next().value })
      ) as { [key: string]: string }[]
    );
  }

  @computed
  get analyzedTableDataSource(): {
    [key: string]: string | number;
  }[] {
    const nextId = (function*() {
      for (let i = 1; ; i++) {
        yield i.toString();
      }
    })();
    const nextSuffix = function*(this: Store) {
      const rowCount = this.words.length / (this.items.length || 1);
      for (let j = 0; j < this.items.length; j++) {
        for (let i = 0; i < rowCount; i++) {
          for (let k = this.minWordsCount; k <= this.maxWordsCount; k++)
            for (let t = 0; t < k; t++) yield `${k}`;
        }
      }
    }.bind(this)();
    return this.items.reduce(
      (ret, item) => {
        _.flatMap(
          item.wordGroups.map((group, i) =>
            group.map((word, j) => ({ word, i, j }))
          )
        ).forEach((word, i) => {
          ret[i][item.name] = word.word + ' / ' + nextSuffix.next().value;
          ret[i][item.name + ':' + 'time'] =
            item.recordEndAt[word.i][word.j] -
            item.recordStartAt[word.i][word.j];
        });
        return ret;
      },
      Array.from(
        new Array(this.words.length / (this.items.length || 1)),
        (_) => ({ id: nextId.next().value })
      ) as { [key: string]: string | number }[]
    );
  }

  @action
  randSort() {
    const words = this.words;
    for (let i = 0; i < words.length; i++) {
      const j = _.random(0, words.length - 1);
      const temp = words[i];
      words[i] = words[j];
      words[j] = temp;
    }
    const wordIter = (function*() {
      for (let word of words) {
        yield word;
      }
    })();
    this.items.forEach((item) => {
      item.wordGroups.forEach((group) => {
        for (let i = 0; i < group.length; i++) {
          group[i] = wordIter.next().value;
        }
      });
    });
  }
}

const store = new Store();

(window as any).store = store;

const Ready = observer(() => {
  const [ show, setShow ] = useState(false);
  const [ raw, setRaw ] = useState('');
  const [ showCEI, setShowCEI ] = useState(false);

  return (
    <div className="Ready">
      <Button
        type={'primary'}
        onClick={() => {
          store.randSort();
          store.step++;
        }}
        disabled={!store.imported}
        style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '1em' }}
      >
        开始测试（单词将随机重排序）
      </Button>
      <h3>
        单组单词数：
        <InputNumber
          min={1}
          max={store.maxWordsCount}
          value={store.minWordsCount}
          onChange={(value) => value && (store.minWordsCount = value)}
        />
        —
        <InputNumber
          min={store.minWordsCount}
          value={store.maxWordsCount}
          onChange={(value) => value && (store.maxWordsCount = value)}
        />
      </h3>
      <h3>
        测试数据：<Button onClick={() => setShow(true)}>导入数据</Button>
      </h3>
      <Table
        columns={store.items.map((item) => ({
          title: item.name,
          dataIndex: item.name
        }))}
        dataSource={store.tableDataSource}
        rowKey={'id'}
      />
      <Modal
        title="导入数据"
        visible={show}
        onOk={() => {
          try {
            const lines = raw.split('\n');
            const rows = lines
              .map((line) => line.trim())
              .filter((line) => !!line)
              .map((line) => line.split('\t'));
            store.items.splice(0, store.items.length);
            for (let i = 0; i < rows[0].length; i++) {
              const name = rows[0][i];
              const item: TestItem = {
                name: name,
                wordGroups: Array.from(
                  new Array(store.maxWordsCount - store.minWordsCount + 1),
                  (_, i) => {
                    return new Array(store.minWordsCount + i);
                  }
                ),
                recordStartAt: Array.from(
                  new Array(store.maxWordsCount - store.minWordsCount + 1),
                  (_, i) => {
                    return Array.from(
                      new Array(store.minWordsCount + i),
                      () => 0
                    );
                  }
                ),
                recordEndAt: Array.from(
                  new Array(store.maxWordsCount - store.minWordsCount + 1),
                  (_, i) => {
                    return Array.from(
                      new Array(store.minWordsCount + i),
                      () => 0
                    );
                  }
                )
              };
              const iter = (function*() {
                const data = rows.slice(1);
                for (let col of data) {
                  yield col[i];
                }
              })();
              for (let j = 0; j < item.wordGroups.length; j++) {
                const words = item.wordGroups[j];
                const length = words.length;
                for (let k = 0; k < length; k++) {
                  words[k] = iter.next().value;
                }
              }
              store.items.push(observable(item));
            }
            setShow(false);
            store.imported = true;
          } catch (error) {
            console.error(error);
            message.error('无法解析，检查数据格式');
          }
        }}
        onCancel={() => setShow(false)}
      >
        <Button
          onClick={() => setShowCEI(true)}
          style={{ marginBottom: '1em' }}
        >
          复制示例
        </Button>
        <TextArea
          placeholder="直接从Excel复制数据：&#13;&#10;Test1	Test2	Test3&#13;&#10;boss	mouth	team&#13;&#10;people	wife	fish&#13;&#10;&#13;&#10;flim	apple	bird&#13;&#10;room	key	car&#13;&#10;music	snow	dog&#13;&#10;&#13;&#10;girl	idea	shoe&#13;&#10;club	pen	door&#13;&#10;ball	world	baby&#13;&#10;family	face	air&#13;&#10;&#13;&#10;job	party	bed&#13;&#10;hobby	box	coat&#13;&#10;school	floor	toy&#13;&#10;arm	book	street&#13;&#10;tea	water	mother&#13;&#10;&#13;&#10;city	house	sky&#13;&#10;money	beer	train&#13;&#10;fish	sun	key&#13;&#10;dress	lunch	space&#13;&#10;boy	window	summer&#13;&#10;nurse	friend	bank&#13;&#10;"
          autosize={{ minRows: 10, maxRows: 15 }}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
      </Modal>
      {showCEI ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 10000000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rbga(0,0,0,125)'
          }}
          onClick={() => setShowCEI(false)}
        >
          <img src={CEI} />
        </div>
      ) : null}
    </div>
  );
});

const recorder = Recorder();

recorder.open(
  () => {},
  (err: any) => {
    notification.error({
      message: '获取录音权限失败，请检查麦克风是否正常',
      description: `错误信息：${err.toString()}`,
      duration: null
    });
  }
);

const bus = new EventEmitter();

bus.addListener('start', ({ type, ...params }: any) => {
  if (type === 'full') {
    recorder.start();
  } else if (type === 'item') {
    const item: TestItem = params.item;
  } else if (type === 'group') {
    const item: TestItem = params.item;
    const groupIndex: number = params.groupIndex;
  } else if (type === 'sentence') {
    const item: TestItem = params.item;
    const groupIndex: number = params.groupIndex;
    const index: number = params.index;
    item.recordStartAt[groupIndex][index] = Date.now();
  }
});

bus.addListener('end', ({ type, ...params }: any) => {
  if (type === 'full') {
    store.step++;
    recorder.stop(
      (blob: Blob, duration: number) => {
        store.audioDownloadUrl = URL.createObjectURL(blob);
        recorder.close();
        store.analyzed = true;
      },
      function(msg: any) {
        message.error('录音失败:' + msg);
      }
    );
  } else if (type === 'item') {
    const item: TestItem = params.item;
  } else if (type === 'group') {
    const item: TestItem = params.item;
    const groupIndex: number = params.groupIndex;
  } else if (type === 'sentence') {
    const item: TestItem = params.item;
    const groupIndex: number = params.groupIndex;
    const index: number = params.index;
    item.recordEndAt[groupIndex][index] = Date.now();
  }
});

const stream$ = new Observable<
  | { type: '倒计时'; count: number }
  | {
    type: '显示单词';
    word: string;
  }
  | {
    type: '显示问号';
    count: number;
  }
>((subscriber) => {
  immediateInterval(1000).pipe(take(store.countdown + 1)).subscribe((i) => {
    if (i !== store.countdown)
      subscriber.next({ type: '倒计时', count: store.countdown - i });
  }, console.error, async () => {
    bus.emit('start', { type: 'full' }); // 全程开始

    for (let item of store.items) {
      await new Promise(async (resolve, reject) => {
        bus.emit('start', { type: 'item', item }); // 一组系开始
        for (
          let groupIndex = 0;
          groupIndex < item.wordGroups.length;
          groupIndex++
        ) {
          const group = item.wordGroups[groupIndex];
          // 一组开始
          bus.emit('start', { type: 'group', item, groupIndex }); // 一组开始
          await new Promise(async (resolve, reject) => {
            // 显示单词
            immediateInterval(1000).pipe(take(group.length)).subscribe((i) => {
              subscriber.next({ type: '显示单词', word: group[i] });
            }, console.error, () => {
              // 显示问号
              rxjs.timer(1000).subscribe(async () => {
                for (
                  let i = group.length, wordIndex = 0;
                  i > 0;
                  i--, wordIndex++
                ) {
                  // 开始造句
                  bus.emit('start', {
                    type: 'sentence',
                    index: wordIndex,
                    item,
                    groupIndex
                  });
                  await new Promise(async (resolve, reject) => {
                    subscriber.next({ type: '显示问号', count: i });
                    const onClick = () => {
                      resolve(); // next 问号
                      bus.removeListener('click', onClick);
                    };
                    bus.addListener('click', onClick);
                  });
                  // 造句结束
                  bus.emit('end', {
                    type: 'sentence',
                    index: wordIndex,
                    item,
                    groupIndex
                  });
                }
                resolve(); // next group
              });
            });
          });
          bus.emit('end', { type: 'group', item, groupIndex }); // 一组结束
        }

        bus.emit('end', { type: 'item', item }); // 一组系结束
        resolve(); // next test
      });
    }

    bus.emit('end', { type: 'full' }); // 全程结束
    subscriber.complete();
  });
});

const Play = () => {
  const action = useObservable(() => stream$);

  let comp = null;

  if (!action) {
    comp = null;
  } else if (action.type === '倒计时') {
    comp = (
      <span style={{ fontSize: '3em', fontWeight: 'bolder' }}>
        倒计时：{action.count}
      </span>
    );
  } else if (action.type === '显示单词') {
    comp = (
      <span style={{ fontSize: '3em', fontWeight: 'bolder' }}>
        {action.word}
      </span>
    );
  } else if (action.type === '显示问号') {
    comp = (
      <span style={{ fontSize: '3em', fontWeight: 'bolder' }}>
        {Array.from(new Array(action.count), () => '？').reduce(
          (prev, curr) => prev + curr,
          ''
        )}
      </span>
    );
  }

  return (
    <div className={'Play'}>
      {comp}
      {action && action.type === '倒计时' ? null : (
        <React.Fragment>
          <div
            style={{
              position: 'fixed',
              left: '1em',
              bottom: '1em',
              textAlign: 'center'
            }}
          >
            <Icon type="sync" spin />
            <span>正在录音...</span>
          </div>
          <Button
            type={'primary'}
            style={{ position: 'fixed', right: '1em', bottom: '1em' }}
            onClick={() => bus.emit('click')}
          >
            NEXT
          </Button>
        </React.Fragment>
      )}
    </div>
  );
};

let nextId = 0;

const End = observer(() => {
  const [ show, setShow ] = useState(false);

  return (
    <div className={'End'}>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: window.innerHeight * 0.1
        }}
      >
        {store.analyzed ? (
          <React.Fragment>
            <h3>
              测试结果：<Button onClick={() => setShow(true)}>导出数据</Button>
              <Button
                style={{ marginLeft: '1em' }}
                onClick={() => {
                  const anchor = document.createElement('a');
                  const id = (anchor.id = `download-anchor-${nextId++}`);
                  anchor.href = store.audioDownloadUrl;
                  anchor.download = '测试录音.mp3';
                  anchor.style.display = 'none';
                  document.querySelector('body')!.appendChild(anchor);
                  anchor.click();
                }}
              >
                下载录音
              </Button>
            </h3>
            <Table
              columns={[
                ...store.items.map(
                  (item) =>
                    ({
                      title: item.name,
                      children: [
                        { title: '单词', dataIndex: item.name },
                        { title: '用时(ms)', dataIndex: item.name + ':' + 'time' }
                      ]
                    } as ColumnProps<{
                      [key: string]: string | number;
                    }>)
                )
              ]}
              dataSource={store.analyzedTableDataSource}
              rowKey={'id'}
            />
            <Modal
              title="导出数据"
              visible={show}
              onOk={() => {
                setShow(false);
              }}
              onCancel={() => setShow(false)}
            >
              <Button
                onClick={() => {
                  const input = document.getElementById(
                    'export-data-input'
                  )! as HTMLTextAreaElement;
                  input.setSelectionRange(0, input.value.length);
                  document.execCommand('Copy', false);
                }}
                style={{ marginBottom: '1em' }}
              >
                复制
              </Button>
              <TextArea
                value={store.analyzedTableDataSource
                  .map((x) => {
                    let str = '';
                    for (let item of store.items) {
                      str += `${x[item.name]
                        .toString()
                        .substring(
                          0,
                          x[item.name].toString().lastIndexOf('/') - 1
                        )}	${x[item.name + ':' + 'time']}	`;
                    }
                    return str.trim();
                  })
                  .reduce((prev, curr) => prev + '\n' + curr, '')
                  .trim()}
                id={'export-data-input'}
                autosize={{ minRows: 10 }}
              />
            </Modal>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h3>测试结束，正在提取数据，请稍后</h3>
            <Spin size="large" />
          </React.Fragment>
        )}
      </div>
    </div>
  );
});

if (__DEV__) {
  store.items = observable([
    {
      name: 'Test1',
      wordGroups: [
        [ 'boss', 'people' ],
        [ 'flim', 'room', 'music' ],
        [ 'girl', 'club', 'ball', 'family' ],
        [ 'job', 'hobby', 'school', 'arm', 'tea' ],
        [ 'city', 'money', 'fish', 'dress', 'boy', 'nurse' ]
      ],
      recordStartAt: [
        [ 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
      ],
      recordEndAt: [
        [ 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
      ]
    },
    {
      name: 'Test2',
      wordGroups: [
        [ 'mouth', 'wife' ],
        [ 'apple', 'key', 'snow' ],
        [ 'idea', 'pen', 'world', 'face' ],
        [ 'party', 'box', 'floor', 'book', 'water' ],
        [ 'house', 'beer', 'sun', 'lunch', 'window', 'friend' ]
      ],
      recordStartAt: [
        [ 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
      ],
      recordEndAt: [
        [ 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
      ]
    },
    {
      name: 'Test3',
      wordGroups: [
        [ 'team', 'fish' ],
        [ 'bird', 'car', 'dog' ],
        [ 'shoe', 'door', 'baby', 'air' ],
        [ 'bed', 'coat', 'toy', 'street', 'mother' ],
        [ 'sky', 'train', 'key', 'space', 'summer', 'bank' ]
      ],
      recordStartAt: [
        [ 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
      ],
      recordEndAt: [
        [ 0, 0 ],
        [ 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0 ]
      ]
    }
  ]);
  store.imported = true;

  (window as any).r = rxjs;
  (window as any).o = operators;
  (window as any)._ = _;
  (window as any).bus = bus;
  (window as any).stream$ = stream$;
}
