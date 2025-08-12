import { motion } from "framer-motion";
import { Button } from "@ui5/webcomponents-react";

export const AnimatedUI5Button = ({ children, ...props }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button design="Emphasized" {...props}>
      {children}
    </Button>
  </motion.div>
);