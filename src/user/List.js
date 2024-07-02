import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import TreeView, { flattenTree } from 'react-accessible-treeview';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Toast,
  ToastBody,
  ToastHeader,
} from 'react-bootstrap';
import { FaCheckSquare, FaMinusSquare, FaSquare } from 'react-icons/fa';
import { IoMdArrowDropright } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import Header from '../layouts/Header';
import { listOrgRequest } from '../services/organization';
import {
  createUserRequest,
  editUserRequest,
  listUserRequest,
} from '../services/user';
import './list.scss';
import {
  listOrgDeviceRequest,
  requestGetSampleRequest,
} from '../services/device';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand } from '@fortawesome/free-solid-svg-icons';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);
  const [devices, setDevices] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedUser, setSelectedUser] = useState({});
  const [action, setAction] = useState(0); //0 - tạo, 1 - chỉnh sửa
  const [selectedTreeIds, setSelectedTreeIds] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState('');
  const [getSampleDialog, setGetSampleDialog] = useState(false);
  const [validated, setValidated] = useState(false);

  // const [currentSampleCommand, setCurrentSampleCommand] = useState("")
  const currentSampleCommandRef = useRef('');
  const [sampleDeviceId, setSampleDeviceId] = useState('');

  const [toastContent, setToastContent] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('Success');

  const [deleteAlert, setDeleteAlert] = useState(false);
  const navigate = useNavigate();

  const submitRef = useRef(null);

  const [orgs, setOrgs] = useState(
    flattenTree({
      name: 'Tổ chức của bạn',
      children: [],
    })
  );

  const [createUserDialog, setCreateUserDialog] = useState(false);

  const closeCreateUserDialog = async () => {
    await listUser();
    setCreateUserDialog(false);
  };
  const closeDeleteAlertDialog = async () => {
    await listUser();
    setDeleteAlert(false);
  };
  const closeGetSampleDialog = async () => {
    setGetSampleDialog(false);
  };

  useEffect(() => {
    listUser();
  }, [page, size]);

  const listUser = async () => {
    const resp = await listUserRequest(page, size);
    if (resp.isError) {
      toast.error('Không thể lấy dánh sách người dùng');
    } else {
      setUsers(resp.data.items);
      setTotal(resp.data.total);
    }
  };
  useEffect(() => {
    listOrg();
  }, []);

  const addProperty = (obj, path, value) => {
    let parts = path.split('>');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      let index = current.children.findIndex(e => e.itemId === parts[i]);
      if (index < 0) {
        current.children.push({
          name: value?.orgName,
          children: [],
          itemId: parts[i],
          metadata: {
            id: parts[i],
          },
        });
        index = current.children.findIndex(e => e.itemId === parts[i]);
        current = current.children[index];
      } else {
        current = current.children[index];
      }
    }
    return obj;
  };

  const listOrg = async () => {
    const resp = await listOrgRequest(page, size);
    if (resp.isError) {
      toast.error('Không thể lấy danh sách tổ chức');
    } else {
      let obj = { children: [], name: '' };
      for (let i = 0; i < resp.data.items.length; i++) {
        let item = resp.data.items[i];
        addProperty(obj, item.path, item);
      }
      setOrgs(flattenTree(obj));
    }
  };

  const listOrgDevice = async orgId => {
    const resp = await listOrgDeviceRequest(orgId);
    if (resp.isError) {
      toast.error('Không thể tải thiết bị của tổ chức');
    } else {
      setDevices(resp.data.items);
    }
  };

  const createUser = async () => {
    const resp = await createUserRequest(
      selectedUser.phoneNumber,
      selectedUser.fullName,
      selectedUser.status,
      selectedOrg
      // selectedDevice
    );
    if (resp.isError) {
      setToastContent('Không thể tạo người dùng mới');
      setToastVariant('danger');
      setShowToast(true);
    } else {
      setToastContent('Tạo người dùng thành công');
      setToastVariant('success');
      setShowToast(true);
      closeCreateUserDialog();
      closeCreateUserDialog();
    }
  };

  const editUser = async () => {
    const resp = await editUserRequest(
      selectedUser.fullName,
      selectedUser.status,
      selectedUser.orgs?.[0].orgId ?? null,
      selectedUser.id
    );
    if (resp.isError) {
      setToastContent('Không thể cập nhật thông tin người dùng');
      setToastVariant('danger');
      setShowToast(true);
    } else {
      setToastContent('Cập nhật thông tin người dùng thành công');
      setToastVariant('success');
      setShowToast(true);
      closeCreateUserDialog();
    }
  };

  const deleteUser = async user => {
    const resp = await editUserRequest(
      null,
      user.status === 'active' ? 'inactive' : 'active',
      null,
      selectedUser.id
    );
    if (resp.isError) {
      toast.error('Không thể đặt người dùng ở trạng thái không hoạt động');
    } else {
      closeDeleteAlertDialog();
    }
  };

  const handlePaginationCallback = async (pageSize, pageIndex) => {
    setSize(pageSize);
    setPage(pageIndex);
  };
  const handleSubmit = async event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    setValidated(true);
    await requestGetHandSample();
  };
  const requestGetHandSample = async () => {
    // https://stackoverflow.com/questions/54069253/the-usestate-set-method-is-not-reflecting-a-change-immediately
    const resp = await requestGetSampleRequest(
      sampleDeviceId,
      selectedUser.id,
      currentSampleCommandRef.current
    );
    if (resp.isError) {
      setToastContent("Không thể gửi lệnh 'Lấy mẫu' cho thiết bị");
      setToastVariant('danger');
      setShowToast(true);
    } else {
      setToastContent('Gửi lệnh đến thiết bị thành công');
      setToastVariant('success');
      setShowToast(true);
    }
  };

  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="container-fluid ">
          <div className="row mb-2">
            <div className="col-12 text-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedTreeIds([1]);
                  setCreateUserDialog(true);
                  setSelectedUser({
                    status: 'active',
                  });
                  setAction(0);
                }}
              >
                Thêm người dùng
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Họ tên</th>
                    <th>Số điện thoại</th>
                    <th>Tên công ty</th>
                    <th>Mẫu tay phải</th>
                    <th>Mẫu tay trái</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    return (
                      <tr key={user.id}>
                        <td>{index}</td>
                        <td>{user.fullName}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.orgs[0].orgName}</td>
                        <td></td>
                        <td></td>
                        <td>{user.status}</td>
                        <td className="d-flex flex-row justify-content-center">
                          <FontAwesomeIcon
                            icon={faHand}
                            className="align-self-center p-1"
                            onClick={() => {
                              setSelectedUser(user);
                              setGetSampleDialog(true);
                            }}
                          />
                          <i
                            class="ri-edit-box-line p-1"
                            onClick={() => {
                              let userOrgs = user.orgs;
                              let orgIds = [];
                              for (let i = 0; i < userOrgs.length; i++) {
                                orgIds.push(user.orgs[i].id);
                              }
                              let treeIds = [];
                              for (let i = 0; i < orgIds.length; i++) {
                                let index = orgs.findIndex(
                                  o => o.metadata?.id === orgIds[i]
                                );
                                if (index !== -1) {
                                  treeIds.push(orgs[index].id);
                                }
                              }
                              setSelectedTreeIds(treeIds);
                              setAction(1);
                              setSelectedUser(user);
                              setCreateUserDialog(true);
                            }}
                          ></i>
                          <i
                            class={`${user.status !== 'inactive' ? 'ri-git-repository-private-line' : 'ri-lock-unlock-line'} p-1`}
                            onClick={() => {
                              // setDeleteUserId(user.id)
                              setSelectedUser(user);
                              setDeleteAlert(true);
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-12 align-self-center">
              <Pagination
                total={total}
                pageSize={size}
                callback={handlePaginationCallback}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={createUserDialog}
        onHide={closeCreateUserDialog}
        backdrop="static"
        size="lg"
      >
        <ModalHeader closeButton>
          {action === 0 && <>Tạo người dùng mới</>}
          {action !== 0 && <>Chỉnh sửa người dùng</>}
        </ModalHeader>
        <ModalBody>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <label for="phone" className="form-label">
                  Số điện thoại:
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="phone"
                  value={selectedUser.phoneNumber}
                  onChange={e => {
                    const newItem = {
                      phoneNumber: e.target.value,
                    };
                    setSelectedUser(user => ({
                      ...selectedUser,
                      ...newItem,
                    }));
                  }}
                  disabled={action === 1}
                ></input>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label for="fullname" className="form-label">
                  Họ tên:
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="fullname"
                  value={selectedUser.fullName}
                  onChange={e => {
                    const newItem = {
                      fullName: e.target.value,
                    };
                    setSelectedUser(user => ({
                      ...selectedUser,
                      ...newItem,
                    }));
                  }}
                ></input>
              </div>
            </div>
            <div className="row border-bottom pb-3">
              <div className="col-12">
                <label for="status" className="form-label">
                  Trạng thái:
                </label>
                <select
                  id="status"
                  className="form-select"
                  value={selectedUser.status}
                  onChange={e => {
                    const newItem = {
                      status: e.target.value,
                    };
                    setSelectedUser(user => ({
                      ...selectedUser,
                      ...newItem,
                    }));
                  }}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="left_hand_sampling">Lấy mẫu tay trái</option>
                  <option value="right_hand_sampling">Lấy mẫu tay phải</option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">Chọn một công ty</div>
              {/* <div className="col-5">Chọn một thiết bị</div> */}
            </div>
            <div className="row">
              <div className="col-6 checkbox">
                <TreeView
                  data={orgs}
                  propagateSelect
                  propagateSelectUpwards
                  togglableSelect
                  selectedIds={selectedTreeIds}
                  nodeRenderer={({
                    element,
                    isBranch,
                    isExpanded,
                    isSelected,
                    isHalfSelected,
                    getNodeProps,
                    level,
                    handleSelect,
                    handleExpand,
                  }) => {
                    return (
                      <div
                        {...getNodeProps({ onClick: handleExpand })}
                        style={{ marginLeft: 40 * (level - 1) }}
                      >
                        {isBranch && <ArrowIcon isOpen={isExpanded} />}
                        <CheckBoxIcon
                          className="checkbox-icon"
                          onClick={e => {
                            handleSelect(e);
                            e.stopPropagation();
                          }}
                          variant={
                            isHalfSelected
                              ? 'some'
                              : isSelected
                                ? 'all'
                                : 'none'
                          }
                        />
                        <i className="ri-building-line me-1"></i>
                        <span
                          className="name"
                          onClick={() => {
                            setSelectedOrg(element.metadata.id);
                            // listOrgDevice(element.metadata.id);
                          }}
                        >
                          {element.name}
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
              {/* <div className="col-5">
                <select
                  className="form-select mt-2"
                  onChange={e => {
                    setSelectedDevice(e.target.value);
                  }}
                >
                  {devices.map((device, index) => {
                    return (
                      <option
                        selected={
                          action === 1
                            ? selectedUser.deviceId === device.id
                            : index === 0
                        }
                        key={device.id}
                        value={device.deviceId}
                      >
                        {device.deviceId}
                      </option>
                    );
                  })}
                </select>
              </div> */}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              if (action === 0) {
                createUser();
              } else {
                editUser();
              }
            }}
          >
            {action === 0 && <>Tạo</>}
            {action !== 0 && <>Cập nhật</>}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => closeCreateUserDialog()}
          >
            Hủy
          </button>
        </ModalFooter>
      </Modal>
      <Modal
        show={deleteAlert}
        onHide={closeDeleteAlertDialog}
        backdrop="static"
      >
        <ModalHeader closeButton>
          Bạn có chắc chắn muốn{' '}
          {selectedUser.status === 'active' ? 'vô hiệu hóa' : 'kích hoạt'} người
          dùng này không?
        </ModalHeader>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              deleteUser(selectedUser);
            }}
          >
            Có
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              closeDeleteAlertDialog();
            }}
          >
            Hủy
          </button>
        </ModalFooter>
      </Modal>
      <Modal
        show={getSampleDialog}
        onHide={closeGetSampleDialog}
        backdrop="static"
      >
        <ModalHeader closeButton>
          Yêu cầu lấy mẫu tay của {selectedUser.fullName}
        </ModalHeader>
        <ModalBody>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>DeviceID:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => setSampleDeviceId(e.target.value)}
                />
                <FormControl.Feedback type="invalid">
                  DeviceId là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <div className="d-flex flex-row justify-content-end mt-3 gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  currentSampleCommandRef.current = 'left_hand_sampling';
                  submitRef.current?.click();
                }}
              >
                Lấy mẫu tay trái
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeGetSampleDialog}
              >
                Hoàn thành
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  currentSampleCommandRef.current = 'right_hand_sampling';
                  submitRef.current?.click();
                }}
              >
                Lấy mẫu tay phải
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <Toast
        delay={3000}
        autohide
        show={showToast}
        onClose={() => setShowToast(false)}
        className="position-fixed bottom-0 end-0 p-3"
        bg={toastVariant}
        style={{ zIndex: 2000 }}
      >
        <ToastHeader>Thông báo</ToastHeader>
        <ToastBody>{toastContent}</ToastBody>
      </Toast>
    </React.Fragment>
  );
}
const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = 'arrow';
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({ variant, ...rest }) => {
  switch (variant) {
    case 'all':
      return <FaCheckSquare {...rest} />;
    case 'none':
      return <FaSquare {...rest} />;
    case 'some':
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};
