import React, { useEffect, useState } from "react"
import { createOrgRequest, listOrgRequest } from "../services/organization"
import { toast } from "react-toastify";
import Header from "../layouts/Header";
import TreeView, { flattenTree } from "react-accessible-treeview";
import {IoMdArrowDropright} from "react-icons/io"
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import cx from "classnames"
import "./list.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FormControl, Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";

export default function OrgManagement(){
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)

    const [orgName, setOrgName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [website, setWebsite] = useState("")
    const [parentOrgId, setParentOrgId] = useState("")
    const [currentOrg, setCurrentOrg] = useState({})

    const [createOrgDialog, setCreateOrgDialog] = useState(false)

    const closeCreateOrgDialog = () =>{
      setCreateOrgDialog(false)
    }

    const [orgs, setOrgs] = useState(flattenTree({
        name: "Your organization",
        children: [
        ]
    }))

    const addProperty = (obj, path, value) => {
        let parts = path.split(">")
        let current = obj;
        for(let i = 0; i < parts.length; i++){   

            let index = current.children.findIndex(e => e.itemId === parts[i]);            
            if(index < 0){
                current.children.push({
                    name: value?.orgName,
                    children: [],
                    itemId: parts[i]
                })
                index =  current.children.findIndex(e => e.itemId === parts[i]);
                current = current.children[index];
            }
            else{
                // console.log(current)
                // current.children[index].children.push({
                //     name: value.orgName,
                //     children: []
                // })
                // console.log(value.orgName)
                // console.log(current)
                // let index2 =  current.children[index].children.findIndex(e => e.itemId === parts[i]);                
                // current = current.children[index].children[index2];   
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
    const createOrg = async() => {
      if(!orgName || !phoneNumber || !address){
        toast.error("Missing required fields")
      }else{
        const resp = await createOrgRequest(orgName, address, phoneNumber, website, parentOrgId)
        if(resp.isError){
          toast.error("Can not create new Organization")
        }else{
          await listOrg();
        }
      }
    }

    useEffect(() => {
        listOrg()        
    }, [page, size])
    return (
        <React.Fragment>
             <Header />
             <div className="main main-app p-3 p-lg-4">
                <div className="container-fluid">
                    <div className="row">
                      <div className="col-5">
                        <h3>
                          Danh sách công ty                          
                        </h3>
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
                                                onClick={(e) => {
                                                  handleSelect(e);
                                                  e.stopPropagation();
                                                }}
                                                variant={
                                                  isHalfSelected ? "some" : isSelected ? "all" : "none"
                                                }
                                              />
                                              <span className="name">{element.name}</span>
                                              <FontAwesomeIcon icon={faCirclePlus} size="sm" className="ps-2"
                                                onClick={() => {
                                                  setCreateOrgDialog(true)
                                                  setCurrentOrg(element)
                                                }}
                                              />
                                            </div>
                                        );
                                    }}
                                />
                        </div>
                        <div className="col-6">
                            <div className="container-fluid row-gap-3">
                              <div className="row">
                                <div className="col-4">
                                  Company name:
                                </div>
                                <div className="col-8">
                                  abc
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-4">
                                  Company address:
                                </div>
                                <div className="col-8">
                                  abc
                                </div>
                              </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
             </div>
             <Modal show={createOrgDialog} backdrop="static" onHide={closeCreateOrgDialog}>
                  <ModalHeader closeButton={true}>
                        Create new Organization for {currentOrg?.name}
                  </ModalHeader>
                  <ModalBody>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-4">
                          Company name:
                        </div>
                        <div className="col-8">
                          <FormControl type="input" onChange={e => setOrgName(e.target.value)}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4">
                          Company Phone:
                        </div>
                        <div className="col-8">
                          <FormControl type="input" onChange={e => setPhoneNumber(e.target.value)}/>
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col-4">
                          Company Address:
                        </div>
                        <div className="col-8">
                          <FormControl type="input" onChange={e => setAddress(e.target.value)}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4">
                          Company Website:
                        </div>
                        <div className="col-8">
                          <FormControl type="input" onChange={e => setWebsite(e.target.value)}/>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
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