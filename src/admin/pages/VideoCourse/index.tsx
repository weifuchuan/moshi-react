import CourseForm from '@/admin/components/forms/CourseForm';
import CourseAdmin from '@/admin/models/CourseAdmin';
import { StoreContext } from '@/admin/store';
import Modal from '@/common/components/Modal';
import {
  OptionalCell,
  OptionalTimeCell,
  TextCell,
  TimeCell
} from '@/common/components/tables';
import BitKit from '@/common/kit/BitKit';
import { POST_FORM } from '@/common/kit/req';
import { ICourse } from '@/common/models/Course';
import { Button, Icon, message, Popover, Switch, Tooltip } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { observer, Observer } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import { Control } from 'react-keeper';
import ReactTable, { Column } from 'react-table';
import 'react-table/react-table.css';
import './index.less';

const VideoCourse: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  const courses = store.videoCourses;

  const [ isSelf, setIsSelf ] = useState(!/video\/\d+$/.test(Control.path));

  const f = () => {
    if (/video\/\d+$/.test(Control.path)) {
      setIsSelf(false);
    } else {
      setIsSelf(true);
    }
  };

  useEffect(() => {
    store.fetchVideoCourses();
    f();
    bus.addListener('routePathChange', f);
    return () => {
      bus.removeListener('routePathChange', f);
    };
  }, []);

  return (
    <div className={'VideoCourse'}>
      {isSelf ? (
        <ReactTable
          data={courses.slice()}
          columns={columns}
          defaultPageSize={10}
        />
      ) : (
        children
      )}
    </div>
  );
};

export default observer(VideoCourse);

const columns: Column<ICourse>[] = [
  {
    Header: '操作',
    Cell: ({ original }) => {
      const course: CourseAdmin = original;
      return (
        <StoreContext.Consumer>
          {(store) => (
            <Observer>
              {() => {
                return (
                  <ButtonGroup>
                    <Tooltip placement="top" title={'更新'}>
                      <Button
                        size={'small'}
                        onClick={() => {
                          function Update({ course }: { course: CourseAdmin }) {
                            return (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: '1em'
                                }}
                              >
                                <CourseForm
                                  course={course}
                                  onSubmit={async (values) => {
                                    try {
                                      await course.update(values);
                                      message.success('更新成功');
                                      hide();
                                    } catch (err) {
                                      message.error(err);
                                    }
                                  }}
                                />
                              </div>
                            );
                          }
                          const hide = Modal.show(
                            <Update course={course} />,
                            '640px',
                            '90%'
                          );
                        }}
                      >
                        U
                      </Button>
                    </Tooltip>
                    <Popover
                      content={
                        <Observer>
                          {() => (
                            <div className={'LockSwitch'}>
                              <Switch
                                checkedChildren={<Icon type="lock" />}
                                unCheckedChildren={<Icon type="check" />}
                                defaultChecked={CourseAdmin.STATUS.isLock(
                                  course
                                )}
                                onChange={async (lock) => {
                                  if (
                                    lock &&
                                    !CourseAdmin.STATUS.isLock(course)
                                  ) {
                                    const resp = await POST_FORM(
                                      '/admin/course/lock',
                                      {
                                        id: course.id
                                      }
                                    );
                                    const ret = resp.data;
                                    if (ret.state === 'ok') {
                                      course.status = BitKit.set(
                                        course.status,
                                        0,
                                        1
                                      );
                                    } else {
                                      message.error(ret.msg);
                                    }
                                  } else if (
                                    !lock &&
                                    CourseAdmin.STATUS.isLock(course)
                                  ) {
                                    const resp = await POST_FORM(
                                      '/admin/course/unlock',
                                      {
                                        id: course.id
                                      }
                                    );
                                    const ret = resp.data;
                                    if (ret.state === 'ok') {
                                      course.status = BitKit.set(
                                        course.status,
                                        0,
                                        0
                                      );
                                    } else {
                                      message.error(ret.msg);
                                    }
                                  }
                                }}
                              />
                            </div>
                          )}
                        </Observer>
                      }
                      trigger="click"
                      placement="bottom"
                    >
                      <Tooltip placement="top" title={'锁定'}>
                        <Button size={'small'} onClick={() => {}}>
                          L
                        </Button>
                      </Tooltip>
                    </Popover>
                    <Popover
                      content={
                        <Observer>
                          {() => (
                            <div className={'LockSwitch'}>
                              <Switch
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="lock" />}
                                defaultChecked={CourseAdmin.STATUS.isPublish(
                                  course
                                )}
                                onChange={async (pub) => {
                                  if (
                                    pub &&
                                    !CourseAdmin.STATUS.isPublish(course)
                                  ) {
                                    const resp = await POST_FORM(
                                      '/admin/course/publish',
                                      {
                                        id: course.id
                                      }
                                    );
                                    const ret = resp.data;
                                    if (ret.state === 'ok') {
                                      course.status = BitKit.set(
                                        course.status,
                                        2,
                                        1
                                      );
                                    } else {
                                      message.error(ret.msg);
                                    }
                                  } else if (
                                    !pub &&
                                    CourseAdmin.STATUS.isPublish(course)
                                  ) {
                                    const resp = await POST_FORM(
                                      '/admin/course/unpublish',
                                      {
                                        id: course.id
                                      }
                                    );
                                    const ret = resp.data;
                                    if (ret.state === 'ok') {
                                      course.status = BitKit.set(
                                        course.status,
                                        2,
                                        0
                                      );
                                    } else {
                                      message.error(ret.msg);
                                    }
                                  }
                                }}
                              />
                            </div>
                          )}
                        </Observer>
                      }
                      trigger="click"
                      placement="bottom"
                    >
                      <Tooltip placement="top" title={'发布'}>
                        <Button size={'small'} onClick={() => {}}>
                          P
                        </Button>
                      </Tooltip>
                    </Popover>
                    <Tooltip placement="top" title={'文章管理'}>
                      <Button
                        size={'small'}
                        onClick={() => {
                          Control.go(`/home/course/video/${course.id}`);
                        }}
                      >
                        A
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                );
              }}
            </Observer>
          )}
        </StoreContext.Consumer>
      );
    }
  },
  {
    Header: 'id',
    accessor: 'id'
  },
  {
    Header: '名称',
    accessor: 'name',
    Cell: TextCell
  },
  {
    Header: '作者',
    accessor: 'nickName',
    Cell: TextCell
  },
  {
    Header: '简介',
    accessor: 'introduce',
    Cell: TextCell
  },
  {
    Header: '简介图片',
    accessor: 'introduceImage',
    Cell: OptionalCell
  },
  {
    Header: '订阅须知',
    accessor: 'note',
    Cell: OptionalCell
  },
  {
    Header: '创建时间',
    accessor: 'createAt',
    Cell: TimeCell
  },
  {
    Header: '发布时间',
    accessor: 'publishAt',
    Cell: OptionalTimeCell
  },
  {
    Header: '订阅人数',
    accessor: 'buyerCount',
    Cell: TextCell
  },
  {
    Header: '价格',
    accessor: 'price',
    Cell: OptionalCell
  },
  {
    Header: '折扣价',
    accessor: 'discountedPrice',
    Cell: OptionalCell
  },
  {
    Header: '优惠到',
    accessor: 'offerTo',
    Cell: OptionalTimeCell
  }
];
