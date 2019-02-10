学习Rxjs是两个月前的事了，但没有用到在一个实际需求上。昨天收到一个需求，正好是一个很容易的可以抽象为由数据流的应用，于是我欣然用Rxjs结合React写之。

## 需求说明

需求原始说明为：

> 60个英文单词被分为三个组系，每个组系包括2-6个单词一组的五组单词。在测试中,测试单词以1词/秒的速率依次呈现在电脑屏幕上，被试大声朗读屏幕上的单词，当一组单词呈现结束时，屏幕上出现与该组数目相等的问号，提示被试用刚才呈现的单词造句。
两个一组时，屏幕上以1词/秒的速率依次出现“price”,“week”，两个单词后会出现??，受试用price造句，造完句后点下鼠标，屏幕上出现一个问号，受试用week造句，之后点鼠标进入三个一组，屏幕上以1词/秒的速率依次出现“bird”,“game”，“ star”，三个单词后会出现???，受试用bird造句，造完句后点下鼠标, 屏幕上出现两个问号，受试用game造句，再点下鼠标， 屏幕上出现一个问号，受试用star造句，之后点鼠标进入四个一组…以此类推。
>
>全程录音，计算机记录受试每个单词造句所用时间。

需求原始说明可能有些不易看明，经过与提供方的讨论，我归总如下：

1. 数据格式为：(`word.组系序号.组单词数.组内序号`)
    
    |Test1|Test2|Test3|
    |----|----|----|
    |word.1.2.1|word.2.2.1|word.3.2.1|
    |word.1.2.2|word.2.2.2|word.3.2.2|
    |word.1.3.1|word.2.3.1|word.3.3.1|
    |word.1.3.2|word.2.3.2|word.3.3.2|
    |word.1.3.3|word.2.3.3|word.3.3.3|
    |...|...|...|
    |word.1.6.6|word.2.6.6|word.3.6.6|
    
    由此，抽象为以下数据类型：

    ```ts
    // 代表一个组系
    interface TestItem {
      name: string; // 组系名，如：Test1, Test2, Test3
      /*
        二维数组表示的组系内数据项
        [word.1.2.1, word.1.2.2]
        [word.1.3.1, word.1.3.2, word.1.3.3]
        ...
      */
      wordGroups: string[][]; 
    }
    ```
    
    并将数据放入全局store：
    
    ```ts
    class Store {
      // 组系
      items: TestItem[] = [];
      // 每组最小单词数
      minWordsCount = 2;
      // 每组最大单词数
      maxWordsCount = 6;
      // 实验开始前倒计时秒数
      countdown = 5; 
    }
    ```
    
2. 流程：
    
    1. 倒计时
    2. 对每个组系：
        
        1. 对每一组：
            
            1. 依次显示单词，每个单词显示一秒
            2. 对每个单词：
                1. 显示`此组单词数 - i`个问号
                2. 如果`点击`事件发生，子流程结束
            3. 子流程结束
        2. 子流程结束
    3. 流程结束

## 数据流抽象

> 为了方便一些操作，我实现了一个`immediateInterval`，因为interval不是即时开始的：
> ```ts
> function immediateInterval(
>   period?: number | undefined,
>   scheduler?: SchedulerLike | undefined
> ): Observable<number> {
>   return new Observable(subscriber => {
>     subscriber.next(0);
>     const interval$ = interval(period, scheduler);
>     const next = subscriber.next; 
>     subscriber.next = function(this: Subscriber<number>, i: number) {
>       next.bind(this)(i + 1);
>     }.bind(subscriber);
>     interval$.subscribe(subscriber);
>   });
> }
> ```

由上节的流程，得到如下数据流：

1. 倒计时：使用`immediateInterval`**发出**`store.countdown`个值，每个值携带当前倒计时数，然后
2. 迭代`item of store.items`：
    
    1. 迭代`group of item.wordGroups`:
        
        1. 显示单词：使用`immediateInterval`**发出**`group.length`个值，每个值携带当前单词，然后
        2. 迭代`for(let i = 0; i < group.length; i++)`：
            
            1. **发出**值，携带`group.length - i`(问号数)
            2. 订阅全局`event bus`的`click`事件，当`click`激发时，`continue`此迭代

## 数据流实现


以下代码的一些设计点：

- 使用`event bus`的`emit`实现流程钩子
- 使用`async await`语法实现异步迭代：
    ```ts
    async () => {
      for(...){
        await new Promise(async (resolve) => {
          someAsyncCode(
            // 结束此Promise，以continue该for循环
            resolve(); 
          )
        })
      }
    }
    ```


```ts
// event bus
const bus = new EventEmitter();

const stream$ = new Observable<
  | { type: "倒计时"; count: number }
  | {
      type: "显示单词";
      word: string;
    }
  | {
      type: "显示问号";
      count: number;
    }
>(subscriber => {
  immediateInterval(1000)
    .pipe(take(store.countdown + 1))
    .subscribe(
      i => {
        if (i !== store.countdown)
          subscriber.next({ type: "倒计时", count: store.countdown - i });
      },
      console.error,
      async () => {
        bus.emit("start", { type: "full" }); // 全程开始

        for (let item of store.items) {
          await new Promise(async (resolve, reject) => {
            bus.emit("start", { type: "item", item }); // 一组系开始
            for (
              let groupIndex = 0;
              groupIndex < item.wordGroups.length;
              groupIndex++
            ) {
              const group = item.wordGroups[groupIndex];
              // 一组开始
              bus.emit("start", { type: "group", item, groupIndex }); // 一组开始
              await new Promise(async (resolve, reject) => {
                // 显示单词
                immediateInterval(1000)
                  .pipe(take(group.length))
                  .subscribe(
                    i => {
                      subscriber.next({ type: "显示单词", word: group[i] });
                    },
                    console.error,
                    () => {
                      // 显示问号
                      rxjs.timer(1000).subscribe(async () => {
                        for (
                          let i = group.length, wordIndex = 0;
                          i > 0;
                          i--, wordIndex++
                        ) {
                          // 开始造句
                          bus.emit("start", {
                            type: "sentence",
                            index: wordIndex,
                            item,
                            groupIndex
                          });
                          await new Promise(async (resolve, reject) => {
                            subscriber.next({ type: "显示问号", count: i });
                            const onClick = () => {
                              resolve(); // next 问号
                              bus.removeListener("click", onClick);
                            };
                            bus.addListener("click", onClick);
                          });
                          // 造句结束
                          bus.emit("end", {
                            type: "sentence",
                            index: wordIndex,
                            item,
                            groupIndex
                          });
                        }
                        resolve(); // next group
                      });
                    }
                  );
              });
              bus.emit("end", { type: "group", item, groupIndex }); // 一组结束
            }

            bus.emit("end", { type: "item", item }); // 一组系结束
            resolve(); // next test
          });
        }

        bus.emit("end", { type: "full" }); // 全程结束
        subscriber.complete();
      }
    );
});
```

连接到React组件（Hooks）：

```jsx
const Play = () => {
  const action = useObservable(() => stream$);

  let comp = null;

  if (!action) {
    comp = null;
  } else if (action.type === "倒计时") {
    comp = ...;
  } else if (action.type === "显示单词") {
    comp = ...;
  } else if (action.type === "显示问号") {
    comp = ...;
  }

  return ...; 
};
```

## 总结

Rxjs使得一些事情更容易(:

## 涉及到的一些库

rxjs

rxjs-hooks（rxjs与react hooks的结合库）

wolfy87-eventemitter（浏览器端的高效的EventEmitter）