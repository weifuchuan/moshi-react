import {
  OptionalCell,
  OptionalTimeCell,
  TimeCell
} from "@/admin/components/tables";
import { StoreContext } from "@/admin/store";
import Account, { IAccount } from "@/common/models/Account";
import { observer, useObservable, Observer } from "mobx-react-lite";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import ReactTable, { Column } from "react-table";
import "react-table/react-table.css";
import "./index.scss";
import { Button, Tooltip, message, Radio, Popover, Switch, Icon } from "antd";
import Modal from "@/common/components/Modal";
import AccountForm from "@/admin/components/forms/AccountForm";
import { POST_FORM } from "@/common/kit/req";
import BitKit from "@/common/kit/BitKit";
import { toJS } from "mobx";

const ButtonGroup = Button.Group;

const User: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  const accounts = useObservable<IAccount[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const page = async (pn: number) => {
    const {
      totalRow,
      totalPage,
      list,
      pageSize,
      pageNumber
    } = await store.pageAccounts(pn);
    accounts.splice(0, accounts.length, ...list);
    setTotalRow(totalRow);
    setTotalPage(totalPage);
    setPageSize(pageSize);
    setPageNumber(pageNumber);
  };

  useEffect(() => {
    page(pageNumber);
  }, []);

  return (
    <div className={"User"}>
      <ReactTable
        data={accounts.slice()}
        columns={accountColumns}
        pageSize={pageSize}
        // page={pageNumber}
        pages={totalPage}
        onPageChange={page}
        showPageSizeOptions={false}
      />
    </div>
  );
};

export default observer(User);

const accountColumns: Column<IAccount>[] = [
  {
    Header: "操作",
    accessor: "id",
    Cell: ({ value, row }) => {
      return (
        <ButtonGroup>
          <Tooltip placement="top" title={"更新"}>
            <Button
              size={"small"}
              onClick={() => {
                function UpdateAccount({ account }: { account: IAccount }) {
                  return (
                    <div
                      style={{ width: "100%", height: "100%", padding: "1em" }}
                    >
                      <AccountForm
                        account={account}
                        onSave={async account => {
                          const resp = await POST_FORM(
                            "/admin/account/update",
                            toJS(account)
                          );
                          if (resp.data.state === "ok") {
                            Object.assign(row, toJS(account));
                            message.success("更新成功");
                          } else {
                            message.error("更新失败");
                          }
                          hide();
                        }}
                      />
                    </div>
                  );
                }
                const hide = Modal.show(
                  <UpdateAccount account={row} />,
                  "480px",
                  "80%"
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
                  <Switch
                    checkedChildren={<Icon type="lock" />}
                    unCheckedChildren={<Icon type="check" />}
                    defaultChecked={Account.STATUS.isLock(row)}
                    onChange={async lock => {
                      if (lock && !Account.STATUS.isLock(row)) {
                        const resp = await POST_FORM("/admin/account/lock", {
                          id: row.id
                        });
                        const ret = resp.data;
                        if (ret.state === "ok") {
                          row.status = BitKit.set(row.status, 0, 1);
                        } else {
                          message.error(ret.msg);
                        }
                      } else if (!lock && Account.STATUS.isLock(row)) {
                        const resp = await POST_FORM("/admin/account/unlock", {
                          id: row.id
                        });
                        const ret = resp.data;
                        if (ret.state === "ok") {
                          row.status = BitKit.set(row.status, 0, 0);
                        } else {
                          message.error(ret.msg);
                        }
                      }
                    }}
                  />
                )}
              </Observer>
            }
            trigger="click"
            placement="bottom"
          >
            <Tooltip placement="top" title={"锁定"}>
              <Button size={"small"} onClick={() => {}}>
                L
              </Button>
            </Tooltip>
          </Popover>
          <Tooltip placement="top" title={"分配角色"}>
            <Button size={"small"}>R</Button>
          </Tooltip>
        </ButtonGroup>
      );
    }
  },
  {
    Header: "id",
    accessor: "id"
  },
  {
    Header: "昵称",
    accessor: "nickName"
  },
  {
    Header: "邮箱",
    accessor: "email"
  },
  {
    Header: "手机",
    accessor: "phone",
    Cell: OptionalCell
  },
  {
    Header: "头像",
    accessor: "avatar"
  },
  {
    Header: "真名",
    accessor: "realName",
    Cell: OptionalCell
  },
  {
    Header: "身份证号",
    accessor: "identityNumber",
    Cell: OptionalCell
  },
  {
    Header: "年龄",
    accessor: "age",
    Cell: OptionalCell
  },
  {
    Header: "公司",
    accessor: "company",
    Cell: OptionalCell
  },
  {
    Header: "职位",
    accessor: "position",
    Cell: OptionalCell
  },
  {
    Header: "个人简介",
    accessor: "personalProfile",
    Cell: OptionalCell
  },
  {
    Header: "性别",
    accessor: "sex",
    Cell: OptionalCell
  },
  {
    Header: "生日",
    accessor: "birthday",
    Cell: OptionalTimeCell
  },
  {
    Header: "学位",
    accessor: "education",
    Cell: OptionalCell
  },
  {
    Header: "专业",
    accessor: "profession",
    Cell: OptionalCell
  },
  {
    Header: "创建时间",
    accessor: "createAt",
    Cell: TimeCell
  },
  {
    Header: "状态",
    accessor: "status",
    Cell: OptionalCell
  }
];
