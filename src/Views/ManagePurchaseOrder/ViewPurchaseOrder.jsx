import React from "react";
import {
  List,
  ListItemStandard,
  Label,
  FlexBox,
  FlexBoxDirection,
} from "@ui5/webcomponents-react";
const ViewPurchaseOrder = (viewItem) => {
  console.log("viewItem", viewItem);
  return (
    <div style={{ height: "flex", width: "300px", marginTop: "20px" }}>
      <List>
        {viewItem &&
          viewItem.viewItem &&
          Object.entries(viewItem.viewItem).map(([key, value]) => (
            <ListItemStandard>
              {key === "DocumentLines" ? (
                <>
                  <Label>DocumentLines</Label>
                  {console.log("documentloin")}
                </>
              ) : (
                <FlexBox
                  direction={FlexBoxDirection.Row}
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <Label>{key}</Label>
                  <Label>{value}</Label>
                </FlexBox>
              )}
            </ListItemStandard>
          ))}
      </List>
    </div>
  );
};

export default ViewPurchaseOrder;
