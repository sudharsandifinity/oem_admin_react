import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import {
  CheckBox,
  ComboBox,
  ComboBoxItem,
  FlexBox,
  FormItem,
  Label,
  Option,
  Select,
  Switch,
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";

const AssignBranch = ({
  assignEnabled,
  setAssignEnabled,
  selectedCompany,
  setSelectedCompany,
  selectedBranchIds,
  setSelectedBranchIds,
}) => {
  const { companies = [], loading } = useSelector((state) => state.companies);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!companies) {
      //dispatch(fetchCompanies());

      const fetchData = async () => {
        try {
          const res = await dispatch(fetchCompanies()).unwrap();
          console.log("resusers", res);

          if (res.message === "Please Login!") {
            navigate("/");
          }
        } catch (err) {
          console.log("Failed to fetch user", err.message);
          err.message && navigate("/");
        }
      };
      fetchData();
    }
  }, [dispatch, companies]);

  const handleCompanyChange = (event, value) => {
    setSelectedCompany(value);
    setSelectedBranchIds([]);
  };

  const handleBranchToggle = (branchId) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  return (
    <>
      <FlexBox direction="Column" style={{ marginTop: "2rem", gap: "0.5rem" }}>
        <FlexBox
          direction="Row"
          alignItems="Center"
          style={{ gap: "0.5rem", marginBottom: "1rem" }}
        >
          <Label style={{ minWidth: "120px" }}>Assign Branches</Label>
          <Switch
            style={{ transform: "scale(0.8)" }} // Scale down the switch
            checked={assignEnabled}
            onChange={(e) => {
              setAssignEnabled(e.target.checked);
              if (!e.target.checked) {
                setSelectedCompany(null);
                setSelectedBranchIds([]);
              }
            }}
          />
        </FlexBox>

        {assignEnabled && (
          <FlexBox direction="Column" style={{ margin: "1rem" }}>
            <FlexBox
              direction="Row"
              alignItems="Center"
              style={{ gap: "0.5rem" }}
            >
              {" "}
              Select Company
              <Select
                value={selectedCompany}
                onChange={handleCompanyChange}
                style={{ width: "500px" }}
              >
                {companies.map((val) => (
                  <Option value="1">{val.name}</Option>
                ))}
              </Select>
            </FlexBox>
            {selectedCompany && (
              <>
                <Label
                  style={{
                    minWidth: "120px",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  Select Branches
                </Label>
                {selectedCompany.Branches?.map((branch) => (
                  <CheckBox
                    style={{
                      justifyContent: "flex-start",
                      textAlign: "left",
                      width: "100%",
                    }}
                    checked={selectedBranchIds.includes(branch.id)}
                    onChange={() => handleBranchToggle(branch.id)}
                  />
                ))}
              </>
            )}
          </FlexBox>
        )}
      </FlexBox>
      <FlexBox
        justifyContent="End"
        style={{ marginTop: "1.5rem" }} // mt={3} ~= 24px or 1.5rem
      ></FlexBox>
    </>
  );
};

export default AssignBranch;
