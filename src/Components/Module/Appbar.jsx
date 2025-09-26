import React from "react";
import { Bar, Title } from "@ui5/webcomponents-react";

export default function AppBar({ 
  title, 
  startContent, 
  endContent, 
  design = "Header" 
}) {
  return (
    <Bar
      style={{marginTop: "1rem"}}
      design={design}
      startContent={startContent}
      endContent={endContent}
    >
      <Title level="H4">{title}</Title>
    </Bar>
  );
}
