import React, { useEffect, useState } from "react";
import Header from "../layouts/Header"
import Pagination from "../components/Pagination"
import { createUserRequest, listUserRequest } from "../services/user";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import { listOrgRequest } from "../services/organization";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { IoMdArrowDropright } from "react-icons/io";
import { FaCheckSquare, FaMinusSquare, FaSquare } from "react-icons/fa";
import cx from "classnames"
import "./list.scss"
import { listOrgDeviceRequest } from "../services/device";

export default function UserManagement() {
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(0)
    const [size, setSize] = useState(10)
    const [page, setPage] = useState(0)
    const [devices, setDevices] = useState([])

    const [phoneNumber, setPhoneNumber] = useState("")
    const [fullname, setFullname] = useState("");
    const [status, setStatus] = useState("active")
    const [selectedOrg, setSelectedOrg] = useState("")
    const [selectedDevice, setSelectedDevice] = useState("")
    const [selectedUser, setSelectedUser] = useState({})
    const [action, setAction] = useState(0)//0 - create, 1 - edit
    const [selectedTreeIds, setSelectedTreeIds] = useState([])

    const [orgs, setOrgs] = useState(flattenTree({
        name: "Your organization",
        children: [
        ]
    }))

    const [createUserDialog, setCreateUserDialog] = useState(false)

    const clostCreateUserDialog = () => {
        setCreateUserDialog(false)
    }

    useEffect(() => {
        listUser()
    }, [page, size])

    const listUser = async() => {
        const resp = await listUserRequest(page, size)
        if(resp.isError){
            toast.error("Can not list user")
        }else{
            setUsers(resp.data.items)
            setTotal(resp.data.total)
        }
    }
    useEffect(() => {
        listOrg()
    }, [])

    const addProperty = (obj, path, value) => {
        let parts = path.split(">")
        let current = obj;
        for(let i = 0; i < parts.length; i++){   

            let index = current.children.findIndex(e => e.itemId === parts[i]);            
            if(index < 0){
                current.children.push({
                    name: value?.orgName,
                    children: [],
                    itemId: parts[i],
                    metadata: {
                      id: parts[i]
                    }
                })
                index =  current.children.findIndex(e => e.itemId === parts[i]);
                current = current.children[index];
            }
            else{ 
                current = current.children[index]                            
            }             
            
        }
        return obj;
    }

    const listOrg = async() => {
        const resp = await listOrgRequest(page, size);
        if(resp.isError){
            toast.error("Can not list organization")
        }else{
            let obj = {children: [], name: ""};
            for(let i = 0; i < resp.data.items.length; i++){
                let item = resp.data.items[i]
                addProperty(obj, item.path, item)
                
            }
            setOrgs(flattenTree(obj))
        }
    }

    const listOrgDevice = async(orgId) => {
        const resp = await listOrgDeviceRequest(orgId)
        console.log(resp)
        if(resp.isError){
            toast.error("Can not load organization's device")
        }else{
            setDevices(resp.data.items)
        }
    }
    
    const createUser = async() => {
        const resp = await createUserRequest(selectedUser.phoneNumber, selectedUser.fullName, selectedUser.status, selectedOrg, selectedDevice)
        if(resp.isError){
            toast.error("Can not create new user")
        }else{
            listUser()
            clostCreateUserDialog()
        }
    }

    const handlePaginationCallback = async (pageSize, pageIndex) => {
        setSize(pageSize);
        setPage(pageIndex);
    }
    return (
        <React.Fragment>
            <Header />
            <div className="main main-app p-3 p-lg-4">
                <div className="container-fluid ">
                    <div className="row mb-2">
                        <div className="col-12 text-end">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                setSelectedTreeIds([1])
                                setCreateUserDialog(true)
                                setSelectedUser({
                                    status: "active"
                                })
                                setAction(0)
                            }}>Add user</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Full name</th>
                                        <th>Phone number</th>
                                        <th>Company name</th>
                                        <th>ZaloId</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) =>  {
                                        return (
                                            <tr key={user.id}>
                                                <td>{index}</td>
                                                <td>{user.fullName}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td></td>
                                                <td>{user.zaloId}</td>
                                                <td>{user.status}</td>
                                                <td className="d-flex flex-row justify-content-center">
                                                    <i class="ri-edit-box-line" onClick={() => {
                                                        let userOrgs = user.orgs;
                                                        let orgIds = []
                                                        for(let i = 0; i < userOrgs.length; i++){
                                                            orgIds.push(user.orgs[i].id)
                                                        }
                                                        let treeIds = []
                                                        for(let i = 0; i < orgIds.length; i++){
                                                            let index = orgs.findIndex(o => o.metadata?.id === orgIds[i])
                                                            if(index !== -1){
                                                                treeIds.push(orgs[index].id)
                                                            }
                                                        }
                                                        setSelectedTreeIds(treeIds)
                                                        setAction(1)
                                                        setSelectedUser(user)
                                                        setCreateUserDialog(true)
                                                    }}></i>
                                                    <i class="ri-delete-bin-line"></i>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-12 align-self-center">
                            <Pagination total={total} pageSize={size}  callback={handlePaginationCallback}/>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={createUserDialog} onHide={clostCreateUserDialog} backdrop="static" size="lg">
                <ModalHeader closeButton>
                    {action === 0 &&
                        <>Create new user</>
                    }
                    {action !== 0 &&
                        <>Edit user</>
                    }
                </ModalHeader>
                <ModalBody>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <label for="phone" className="form-label">Phone number:</label>
                                <input type="text" className="form-control form-control-sm" id="phone" 
                                value={selectedUser.phoneNumber}
                                onChange={(e) => {
                                    const newItem = {
                                        phoneNumber: e.target.value
                                    }
                                    setSelectedUser(user => ({
                                        ...selectedUser,
                                        ...newItem
                                    }))
                                }} disabled={action === 1}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <label for="fullname" className="form-label">Full name:</label>
                                <input type="text" className="form-control form-control-sm" id="fullname" 
                                value={selectedUser.fullName}
                                onChange={(e) => {
                                    const newItem = {
                                        fullName: e.target.value
                                    }
                                    setSelectedUser(user => ({
                                        ...selectedUser,
                                        ...newItem
                                    }))
                                }}></input>
                            </div>
                        </div>
                        <div className="row border-bottom pb-3">
                            <div className="col-12">
                                <label for="status" className="form-label">Status:</label>
                                <select id="status" className="form-select" value={selectedUser.status} onChange={(e) => {
                                    const newItem = {
                                        status: e.target.value
                                    }
                                    setSelectedUser(user => ({
                                        ...selectedUser,
                                        ...newItem
                                    }))
                                }}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="left_hand_sampling">Left hand sampling</option>
                                    <option value="right_hand_sampling">Right hand sampling</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6">
                                Select a company
                            </div>
                            <div className="col-5">
                                Select a device
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 checkbox">
                                <TreeView 
                                    data={orgs}
                                    propagateSelect
                                    propagateSelectUpwards
                                    togglableSelect
                                    selectedIds={[1, 2]}
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
                                                onClick={(e) => {
                                                  handleSelect(e);
                                                  e.stopPropagation();
                                                }}
                                                variant={
                                                  isHalfSelected ? "some" : isSelected ? "all" : "none"
                                                }
                                              />
                                              <i className="ri-building-line me-1"></i>
                                              <span className="name" onClick={() => {
                                                setSelectedOrg(element.metadata.id)
                                                listOrgDevice(element.metadata.id)
                                              }}>{element.name}</span>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                            <div className="col-5">
                                <select className="form-select mt-2" onChange={(e) => {
                                    setSelectedDevice(e.target.value)
                                }}>
                                    {devices.map((device, index) => {
                                        return (
                                            <option selected={action === 1 ? (selectedUser.deviceId === device.id) : (index === 0)} key={device.id} value={device.deviceId}>{device.deviceId}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success" onClick={() => {
                        if(action === 0){
                            createUser()
                        }else{

                        }
                    }}>
                        {action === 0 &&
                            <>Create</>
                        }
                        {action !== 0 &&
                            <>Update</>
                        }
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => clostCreateUserDialog()}>Cancel</button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    )
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