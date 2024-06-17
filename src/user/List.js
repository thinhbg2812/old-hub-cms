import React, { useEffect, useState } from "react";
import Header from "../layouts/Header"
import Pagination from "../components/Pagination"
import { listUserRequest } from "../services/user";
import { toast } from "react-toastify";

export default function UserManagement() {
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(0)
    const [size, setSize] = useState(10)
    const [page, setPage] = useState(0)

    useEffect(() => {
        listUser()
    }, [page, size])

    const listUser = async() => {
        const resp = await listUserRequest(page, size)
        if(resp.isError){
            toast.error("Can not list user")
        }else{

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
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Username</th>
                                        <th>ZaloId</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) =>  {
                                        return (
                                            <tr>
                                                <td>{index}</td>
                                                <td>{user.username}</td>
                                                <td>{user.zaloId}</td>
                                                <td>{user.status}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Pagination total={total} pageSize={size}  callback={handlePaginationCallback}/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}