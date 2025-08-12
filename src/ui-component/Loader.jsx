import { ProgressIndicator } from "@ui5/webcomponents-react";

export default function Loader() {
  return (
    <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1301              /* keep it above ShellBar / AppBar */
  }}
>
  {/* value → 0-100; set dynamically if you have real progress,
      or leave at 100 for an “indefinite” look. `displayValue=false`
      hides the “100 %” text. */}
  <ProgressIndicator
    value={100}
    displayValue={false}
    state="Information"       /* theme colour (Info = primary blue) */
  />
</div>
  );
}
