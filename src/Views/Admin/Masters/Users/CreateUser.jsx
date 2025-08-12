import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../../store/slices/usersSlice";
import UserForm from "./UserForm";
import { useState } from "react";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addDetail, setAddDetail] = useState({
      companyId: "",
      formId: "",
      branchId: "",
    });

  const handleCreate = async (data) => {
    console.log("handlecreate", data,addDetail);
    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
        branchIds: data.branchIds,
        status: data.status,
      };
console.log("handlecreate payload", payload, addDetail);
      // const res = await dispatch(createUser(payload)).unwrap();
      // if (res.message === "Please Login!") {
      //   navigate("/login");
      // } else {
      //   navigate("/admin/users");
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return <UserForm addDetail={addDetail} setAddDetail={setAddDetail} onSubmitCreate={handleCreate} mode="create" />;
};

export default CreateUser;
