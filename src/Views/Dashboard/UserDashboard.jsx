import {
  Card,
  CardHeader,
  FlexBox,
  FlexBoxDirection,
  Page,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import React, { useEffect, useState } from "react";
import { BulletChart } from "@ui5/webcomponents-react-charts";
import { useDispatch } from "react-redux";
import { fetchCustomerOrder } from "../../store/slices/CustomerOrderSlice";
import { fetchPurchaseOrder } from "../../store/slices/purchaseorderSlice";
import { fetchSalesQuotations } from "../../store/slices/SalesQuotationSlice";
import { fetchPurchaseQuotation } from "../../store/slices/PurchaseQuotation";
import { fetchPurchaseRequest } from "../../store/slices/PurchaseRequestSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState("Sales Order");
  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const cardData = [
    { title: "Sales Order", color: "#5b2c58ff" },
    { title: "Sales Quotation", color: "#1b4965ff" },
    { title: "Purchase Order", color: "#e35305ff" },
      
      { title: "Purchase Quotation", color: "#9b2226ff" },
      { title: "Purchase Request", color: "#2a9d8fff" },
  ];
  const data = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 50 },
    { name: "May", value: 75 },
  ];
const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 6000 },
  { name: "Mar", value: 8000 },
];

const purchaseData = [
  { name: "Jan", value: 3000 },
  { name: "Feb", value: 3500 },
  { name: "Mar", value: 5000 },
]

useEffect(() => {
  // Simulate fetching data for sales and purchase orders
const fetchInitialData = async() => {
  try{
     let res = "";
            if (selectedType === "Sales Order") {
              res = await dispatch(
                fetchCustomerOrder({ top: 100, skip: 0 }),
              ).unwrap();
            } else if (selectedType === "Sales Quotation") {
              res = await dispatch(
                fetchSalesQuotations({ top: 100, skip: 0 }),
              ).unwrap();
            } else if (selectedType === "Purchase Order") {
              res = await dispatch(
                fetchPurchaseOrder({ top: 100, skip: 0 }),
              ).unwrap();
            } else if (selectedType === "Purchase Quotation") {
              res = await dispatch(
                fetchPurchaseQuotation({ top: 100, skip: 0 }),
              ).unwrap();
            } else if (selectedType === "Purchase Request") {
              res = await dispatch(
                fetchPurchaseRequest({ top: 100, skip: 0 }),
              ).unwrap();
            }
    
            console.log("quotationdata", "sales", res, selectedType);
            const raw = res?.data?.value ?? res?.data ?? res;
    
            // Ensure it's an array
            const list = Array.isArray(raw)
              ? raw
              : raw
                ? [raw] // if it's single object
                : []; // if null or undefined
              setSelectedOrderData(list.map(order=>({ name: order.DocEntry, value: order.DocTotal })));
              setSelectedOrderDetails(list)
    console.log("selectedorderdata",selectedOrderData,list)
            
  }catch(err){
    console.error("Error fetching data:", err);
  }
}
  fetchInitialData();
}, [selectedType]);
const getMonthlyPerformance = (orders) => {
  const months = {};

  orders.forEach(order => {
    const month = new Date(order.DocDate).toLocaleString("default", {
      month: "short"
    });

    if (!months[month]) {
      months[month] = {
        month,
        totalAmount: 0,
        orderCount: 0
      };
    }

    months[month].totalAmount += Number(order.DocTotal);
    months[month].orderCount += 1;
  });

  return Object.values(months);
};
const monthlyData = React.useMemo(() => {
  return getMonthlyPerformance(selectedOrderDetails); // your API data
}, [selectedOrderDetails]);

  return (
    <>
    <style>
        {`
          ui5-page::part(content) {
            padding: 0px;
          }
        `}
      </style>
    <Page style={{ padding: "1rem", overflowY: "auto" }} > 
      <div style={{ flex: 1, flexDirection: "column" }}>
        {/* ShellBar */}

        {/* Welcome Text */}
        {/* <div> */}
          {/* <Title level="H2" style={{marginBottom: '15px'}}>Welcome, Admin</Title> */}

          {/* Colored Cards - Single Row */}
         <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
  {cardData.map(({ title, color }) => {
    const isActive = selectedType === title;

    return (
      <div
        key={title}
        onClick={() => setSelectedType(title)}
        style={{
          backgroundColor: color,
          color: "white",
          borderRadius: "10px",
          padding: "1rem",
          width: "150px",
          cursor: "pointer",
          opacity: isActive ? 1 : 0.6,
          border: isActive ? "3px solid #000" : "none",
          transition: "0.3s",
        }}
      >
        <h3>{title}</h3>
        <p>{Math.floor(Math.random() * 100)}</p>
      </div>
    );
  })}
</div>


          {/* Charts Row */}
          <FlexBox
  direction={FlexBoxDirection.Row}
  style={{ marginTop: "1rem", gap: "2rem" }}
>
  {/* Line Chart */}
  <Card
    header={
      <CardHeader
        titleText={`${selectedType} Monthly Trend`}
      />
    }
    style={{ width: "58%" }}
  >
    <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
      <ResponsiveContainer>
        <LineChart
          data={selectedOrderData}
        >
          <Line
            type="monotone"
            dataKey="value"
            stroke={selectedType === "Sales Order" ? "#5b2c58ff" : selectedType === "Sales Quotation" ? "#1b4965ff" : selectedType === "Purchase Order" ? "#e35305ff" : selectedType === "Purchase Quotation" ? "#9b2226ff" : "#2a9d8fff"}
            strokeWidth={2}
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>

  {/* Bullet Chart */}
  <Card
  header={<CardHeader titleText={`${selectedType} Performance`} />}
  style={{ width: "100%" }}
>
  <div style={{ width: "100%", height: 350, marginTop: "2rem" }}>
    <ResponsiveContainer>
      <LineChart data={monthlyData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalAmount"
          stroke="#5b2c58ff"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</Card>

</FlexBox>

        </div>
      {/* </div> */}
    </Page>
    </>
  );
};

export default UserDashboard;
