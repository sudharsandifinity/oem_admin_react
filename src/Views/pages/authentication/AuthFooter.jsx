import { Bar, Text, Link } from "@ui5/webcomponents-react";

const AuthFooter = () => {
  return (
    <Bar design="Footer">
      <Text slot="startContent">© {new Date().getFullYear()} Your Company</Text>
      <Link
        slot="endContent"
        href="https://yourcompany.com/privacy"
        target="_blank"
      >
        Privacy Policy
      </Link>
    </Bar>
  );
};

export default AuthFooter;
