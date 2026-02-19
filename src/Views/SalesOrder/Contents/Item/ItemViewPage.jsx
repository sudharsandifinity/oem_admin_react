import React from "react";
import {
  List,
  ListItemStandard,
  Label,
  FlexBox,
  FlexBoxDirection,
} from "@ui5/webcomponents-react";
const ItemViewPage = (viewItem) => {
  return (
    <div style={{ height: "flex", width: "300px",marginTop:"20px" }}>
      <List>
        {Object.entries(viewItem.viewItem).map(([key, value]) => (
          <ListItemStandard >
            <FlexBox
              direction={FlexBoxDirection.Row}
              style={{ justifyContent: "space-between", width: "100%" }}
            >
              <Label>{key}</Label>
              <Label>{value}</Label>
            </FlexBox>
          </ListItemStandard>
        ))}
      </List>
    </div>
  );
};

export default ItemViewPage;
