import React, { useEffect, useState } from "react"
import { listOrgRequest } from "../services/organization"
import { toast } from "react-toastify";
import Header from "../layouts/Header";
import TreeView, { flattenTree } from "react-accessible-treeview";
import {IoMdArrowDropright} from "react-icons/io"
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import cx from "classnames"
import "./list.scss"

export default function OrgManagement(){
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [orgs, setOrgs] = useState(flattenTree({
        name: "Your organization",
        children: [
        ]
    }))

    const addProperty = (obj, path) => {
        console.log("===================")
        let parts = path.split(">")
        let current = obj;
        for(let i = 0; i < parts.length; i++){
            // console.log(parts[i])
            // console.log(current)
            let index = current.children.findIndex(e => e.name === parts[i]);
            
            if(index < 0){
                current.children.push({
                    name: parts[i],
                    children: []
                })
                index =  current.children.findIndex(e => e.name === parts[i]);
                current = current.children[index];
            }else{
                current.children[index].children.push({
                    name: parts[i],
                    children: []
                })
                let index2 =  current.children[index].children.findIndex(e => e.name === parts[i]);
                current = current.children[index].children[index2];
                console.log(current)
            }
            
        }
        // console.log(obj)
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
                addProperty(obj, item.path)
                
            }
            
            setOrgs(flattenTree(obj))
        }
    }

    useEffect(() => {
        listOrg()
        addProperty({children: [], name: ""}, "Ihub Access Control > Ihub Access Control 1 > Ihub Access Control 2")
    }, [page, size])
    return (
        <React.Fragment>
             <Header />
             <div className="main main-app p-3 p-lg-4">
                <div className="container">
                    <div className="row">
                        <div className="col">
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
                                            </div>
                                        );
                                    }}
                                />
                        </div>
                    </div>
                </div>
             </div>
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