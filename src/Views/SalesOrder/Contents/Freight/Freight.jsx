import React, { useEffect, useMemo, useState } from "react";
import FreightTable from "../FreightTable";
import {
  AnalyticalTable,
  Bar,
  Button,
  Dialog,
  FlexBox,
} from "@ui5/webcomponents-react";

const Freight = (props) => {
  const {
    mode,
    freightData,
    setFreightData,
    freightdialogOpen,
    setfreightDialogOpen,
    onselectFreightRow,
    itemTabledata,
    onRowSelect,
    freightRowSelection,
    setFreightRowSelection,
    taxData,
    setTaxData,
    inputvalue,
    setInputValue,
  } = props;
  const [originalfreightData, setOriginalFreightData] = useState([]);
  useEffect(() => {
    console.log("itemdatauseefect1", originalfreightData);
    if (freightdialogOpen) {
      console.log("itemdatauseefect", freightData);
      setOriginalFreightData(freightData); // backup (for reset/clear filter)
    }
  }, [freightdialogOpen]);

  return (
    <div style={{ background: "white" }}>
      <Dialog
        headerText="Select Freight"
        open={freightdialogOpen}
        onAfterClose={() => setfreightDialogOpen(false)}
        footer={<Bar design="Footer" endContent={<Button
          onClick={() => {
            setFreightData(originalfreightData);
            setfreightDialogOpen(false);
          }}
        >
          Continue...
        </Button>} />}
      >
        <FreightTable
          freightData={freightData}
          setFreightData={setFreightData}
          onselectFreightRow={onselectFreightRow}
          freightRowSelection={freightRowSelection}
          setFreightRowSelection={setFreightRowSelection}
          mode={mode}
          taxData={taxData}
          setTaxData={setTaxData}
          inputvalue={inputvalue}
          setInputValue={setInputValue}
        />
        
      </Dialog>
    </div>
  );
};

export default Freight;
