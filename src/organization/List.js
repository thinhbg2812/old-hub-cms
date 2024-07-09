import React, { useEffect, useState } from "react";
import {
  createOrgRequest,
  getOrgRequest,
  listOrgRequest,
  updateOrgRequest,
} from "../services/organization";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { IoMdArrowDropright } from "react-icons/io";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import cx from "classnames";
import "./list.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/Header";

export default function OrgManagement() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [orgName, setOrgName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [currentOrg, setCurrentOrg] = useState({});

  const [createOrgDialog, setCreateOrgDialog] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState({});
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const closeCreateOrgDialog = async () => {
    setCreateOrgDialog(false);
    await listOrg();
  };

  const [orgs, setOrgs] = useState(
    flattenTree({
      name: "Tổ chức của bạn",
      children: [],
    })
  );

  const addProperty = (obj, path, value) => {
    let parts = path.split(">");
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
      toast.error("Không thể lấy danh sách tổ chức");
    } else {
      let obj = { children: [], name: "" };
      for (let i = 0; i < resp.data.items.length; i++) {
        let item = resp.data.items[i];
        addProperty(obj, item.path, item);
      }
      setOrgs(flattenTree(obj));
    }
  };
  const createOrg = async () => {
    if (!orgName || !phoneNumber || !address) {
      toast.error("Thiếu các trường bắt buộc");
    } else {
      const resp = await createOrgRequest(
        orgName,
        address,
        phoneNumber,
        website,
        currentOrg.metadata.id
      );
      if (resp.isError) {
        toast.error("Không thể tạo tổ chức mới");
      } else {
        closeCreateOrgDialog();
      }
    }
  };

  const getOrg = async orgId => {
    const resp = await getOrgRequest(orgId);
    if (resp.isError) {
      toast.error("Không thể lấy thông tin tổ chức");
    } else {
      setSelectedOrg(resp.data);
    }
  };

  useEffect(() => {
    listOrg();
  }, [page, size]);

  const handleSubmit = async event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    setValidated(true);
    await createOrg();
  };
  const updateOrg = async () => {
    const resp = await updateOrgRequest(selectedOrg, selectedOrg.id);
    if (resp.isError) {
      toast.error("Không thể cập nhật thông tin tổ chức");
    } else {
      toast.success("Cập nhật thông tin tổ chức thành công");
      await listOrg();
    }
  };
  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-5">
              <h3>Danh sách công ty</h3>
            </div>
            <div className="col-6">
              <h3>Thông tin chi tiết</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-5 checkbox border-end">
              <TreeView
                data={orgs}
                propagateSelect
                propagateSelectUpwards
                togglableSelect
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
                          isHalfSelected ? "some" : isSelected ? "all" : "none"
                        }
                      />
                      <span
                        className="name"
                        onClick={() => {
                          getOrg(element.metadata.id);
                        }}
                      >
                        {element.name}
                      </span>
                      <i
                        className="ri-add-circle-line ps-2"
                        onClick={() => {
                          setCreateOrgDialog(true);
                          setCurrentOrg(element);
                        }}
                      ></i>
                    </div>
                  );
                }}
              />
            </div>
            <div className="col-6">
              <div className="container-fluid row-gap-3">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="orgName" className="form-label">
                          Tên công ty:
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="phone"
                          value={selectedOrg.orgName || ""}
                          onChange={e => {
                            let newItem = {
                              orgName: e.target.value,
                            };
                            setSelectedOrg(selectedOrg => ({
                              ...selectedOrg,
                              ...newItem,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="phoneNumber" className="form-label">
                          Số điện thoại:
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="phoneNumber"
                          value={selectedOrg?.phoneNumber || ""}
                          onChange={e => {
                            let newItem = {
                              phoneNumber: e.target.value,
                            };
                            setSelectedOrg(selectedOrg => ({
                              ...selectedOrg,
                              ...newItem,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="address" className="form-label">
                          Địa chỉ:
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="address"
                          value={selectedOrg?.address || ""}
                          onChange={e => {
                            let newItem = {
                              address: e.target.value,
                            };
                            setSelectedOrg(selectedOrg => ({
                              ...selectedOrg,
                              ...newItem,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="website" className="form-label">
                          Trang web:
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="website"
                          value={selectedOrg?.website || ""}
                          onChange={e => {
                            let newItem = {
                              website: e.target.value,
                            };
                            setSelectedOrg(selectedOrg => ({
                              ...selectedOrg,
                              ...newItem,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={updateOrg}
                        >
                          Cập nhật
                        </button>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => {
                            if (!selectedOrg.id) {
                              toast.error("Chưa chọn công ty");
                            } else {
                              navigate(`/room/list?orgId=${selectedOrg.id}`);
                            }
                          }}
                        >
                          Quản lý phòng
                        </button>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            if (!selectedOrg.id) {
                              toast.error("Chưa chọn công ty");
                            } else {
                              navigate(`/vehicle/list?orgId=${selectedOrg.id}`);
                            }
                          }}
                        >
                          Quản lý phương tiện
                        </button>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() => {
                            if (!selectedOrg.id) {
                              toast.error("Chưa chọn công ty");
                            } else
                              navigate(`/device/list?orgId=${selectedOrg.id}`);
                          }}
                        >
                          Quản lý thiết bị
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="row mt-3">
                  <div className="col-9">
                    
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={createOrgDialog}
        backdrop="static"
        onHide={closeCreateOrgDialog}
      >
        <ModalHeader closeButton={true}>
          Tạo tổ chức mới cho {currentOrg?.name}
        </ModalHeader>
        <ModalBody>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Tên công ty:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => setOrgName(e.target.value)}
                />
                <FormControl.Feedback type="invalid">
                  Tên công ty là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Số điện thoại:</FormLabel>
                <FormControl
                  type="input"
                  onChange={e => setPhoneNumber(e.target.value)}
                />
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Địa chỉ:</FormLabel>
                <FormControl
                  type="input"
                  onChange={e => setAddress(e.target.value)}
                />
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Trang web:</FormLabel>
                <FormControl
                  type="input"
                  onChange={e => setWebsite(e.target.value)}
                />
              </FormGroup>
            </Row>
            <div className="d-flex flex-row justify-content-end mt-3">
              <button type="submit" className="btn btn-success me-2">
                Tạo
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  closeCreateOrgDialog();
                }}
              >
                Hủy
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer position="bottom-right" />
    </React.Fragment>
  );
}

const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = "arrow";
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
    case "all":
      return <FaCheckSquare {...rest} />;
    case "none":
      return <FaSquare {...rest} />;
    case "some":
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};
