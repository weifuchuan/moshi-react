import React, { FunctionComponent, useContext, useEffect } from 'react';
import { observer, useLocalStore, Observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { select, GET } from '@/common/kit/req';
import uniq from 'lodash/uniq';
import { Table, Popconfirm, message, AutoComplete, Button } from 'antd';
import colors from '@/common/styles/colors';
import Modal from '@/common/components/Modal';
import matchSorter from 'match-sorter';
import Course from '@/common/models/Course';

interface ICourseType {
  id: number;
  courseId: number;
  typeName: string;
}

const CourseType: FunctionComponent = observer(({ children }) => {
  const state = useLocalStore(() => ({
    courses: [] as { id: number; name: string }[],
    courseTypes: [] as ICourseType[],
    get typeNames() {
      return uniq(this.courseTypes.map((x) => x.typeName));
    },
    get courseIdToCourseTypes() {
      const map: { [key: number]: ICourseType[] } = {};
      this.courses.forEach(
        (x) => (map[x.id] = this.courseTypes.filter((z) => z.courseId === x.id))
      );
      return map;
    },
    get courseIdToCourse() {
      const map: { [key: number]: { id: number; name: string } } = {};
      this.courses.forEach((x) => (map[x.id] = x));
      return map;
    }
  }));

  useEffect(() => {
    (async () => {
      const courses = await select<{ id: number; name: string }>(
        '/select/manager',
        `
          select id, name 
          from course_m
        `
      );
      state.courses = courses;
    })();
    (async () => {
      const courseTypes = await select<{
        id: number;
        courseId: number;
        typeName: string;
      }>(
        '/select/manager',
        `
          select *
          from course_type_m
        `
      );
      state.courseTypes = courseTypes;
    })();
  }, []);

  return (
    <div>
      <Table
        columns={[
          {
            title: '课程名称',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '分类',
            key: 'id',
            dataIndex: 'id',
            render: (id) => {
              return (
                <Observer key={id} >
                  {() => (
                    <p>
                      {state.courseIdToCourseTypes[id].map((courseType) => {
                        return (
                          <_Type key={courseType.id}>
                            <span>{courseType.typeName}</span>
                            <Popconfirm
                              title={`Are you sure delete this type for course ${courseType.typeName}?`}
                              onConfirm={async () => {
                                try {
                                  const resp = await GET(
                                    '/admin/course/delCourseType',
                                    { id: courseType.id }
                                  );
                                  const ret = resp.data;
                                  if (ret.state === 'ok') {
                                    message.success('删除成功');
                                    const i = state.courseTypes.findIndex(
                                      (v) => v.id === courseType.id
                                    );
                                    if (i !== -1) {
                                      state.courseTypes.splice(i, 1);
                                    }
                                  } else {
                                    message.error(ret.msg);
                                  }
                                } catch (e) {
                                  message.error(e.toString());
                                }
                              }}
                              onCancel={() => {}}
                              okText="Yes"
                              cancelText="No"
                            >
                              <a style={{ marginLeft: '4px' }}>删</a>
                            </Popconfirm>
                          </_Type>
                        );
                      })}
                      <_Type>
                        <a
                          onClick={() => {
                            const pState = state;
                            const Add = observer(() => {
                              const state = useLocalStore(() => ({
                                t: ''
                              }));

                              return (
                                <div style={{ padding: '1rem' }}>
                                  <div>
                                    课程：{pState.courseIdToCourse[id].name}
                                  </div>
                                  <div style={{ marginTop: '1rem' }}>
                                    分类：<AutoComplete
                                      dataSource={pState.typeNames.slice()}
                                      value={state.t}
                                      style={{ width: 200 }}
                                      onChange={(x) => (state.t = x as string)}
                                      onSelect={(x) => (state.t = x as string)}
                                      onSearch={(x) =>
                                        matchSorter(pState.typeNames, x)}
                                    />
                                  </div>
                                  <div style={{ marginTop: '1rem' }}>
                                    <Button
                                      type="primary"
                                      disabled={!state.t.trim()}
                                      onClick={async () => {
                                        const ret = await Course.addCourseType(
                                          id,
                                          state.t.trim()
                                        );
                                        if (ret.state === 'ok') {
                                          hide();
                                          pState.courseTypes.push({
                                            courseId: id,
                                            typeName: state.t.trim(),
                                            id: ret.id
                                          });
                                        } else {
                                          message.error(ret.msg);
                                        }
                                      }}
                                    >
                                      提交
                                    </Button>
                                  </div>
                                </div>
                              );
                            });
                            const hide = Modal.show(<Add />, '80%');
                          }}
                        >
                          添加
                        </a>
                      </_Type>
                    </p>
                  )}
                </Observer>
              );
            }
          }
        ]}
        dataSource={state.courses.map((x) => ({
          ...x,
          key: x.id
        }))}
      />
    </div>
  );
});

export default CourseType;

const _CourseType = styled.div``;

const _Type = styled.span`
  padding: 4px;
  border-radius: 4px;
  border: ${`1px solid ${colors.DimGray}`};

  margin: 4px;
`;
