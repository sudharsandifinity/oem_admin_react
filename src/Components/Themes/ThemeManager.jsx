import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";

export const applyCustomTheme = () => {
  setTheme(""); // Use the base theme or reset to default
  
  const root = document.documentElement;

  /* Global theme variables */
  root.style.setProperty("--brand", "#1e6091");
  root.style.setProperty("--brand-700", "#0e1830");
 
  
   root.style.setProperty("--shellbar-height", "56px");
  root.style.setProperty("--success", "#16a34a");
  root.style.setProperty("--warning", "#f59e0b");
  root.style.setProperty("--danger", "#ef4444");
  root.style.setProperty("--bg-color", "#f6f8fb");
  root.style.setProperty("--surface", "#ffffff");
  root.style.setProperty("--muted", "#6b7280");
  root.style.setProperty("--text-color", "#000000");
  root.style.setProperty("--radius", "10px");
  root.style.setProperty("--gap", "16px");
  root.style.setProperty("--container-max", "1200px");



  /* ShellBar */
  root.style.setProperty("--sapShell_Background", "#E6E6E6");
  root.style.setProperty("--sapShell_TextColor", "#ffffff");
  root.style.setProperty("--sapShell_IconColor", "#ffffff");

  
  // Set Breadcrumb Separator Color
  root.style.setProperty("--_ui5wcr_breadcrumb_separator_color", "#000000"); // Separator color (white)

  // Set Filter Field Text Color
  root.style.setProperty("--_ui5_input_text_color", "#000000"); 


  /* Dynamic Page Header */
  root.style.setProperty("--_ui5wcr_dp_header_background", "#E1F0F6");
  root.style.setProperty("--_ui5wcr_dp_title_text_color", "#000000");
  root.style.setProperty("--_ui5wcr_dp_subtitle_text_color", "#000000");
 // Set Dynamic Page Header
  root.style.setProperty("--_ui5wcr_dp_header_background", "#E1F0F6"); // Dynamic Page header background color
  root.style.setProperty("--_ui5wcr_dp_title_text_color", "#000000"); // Dynamic Page header title text color

  

  /* Object Page Header */
  root.style.setProperty("--sapObjectHeader_Background", "#E1F0F6");
  root.style.setProperty("--sapObjectHeader_Title_TextColor", "#000000");
  root.style.setProperty("--sapObjectHeader_Subtitle_TextColor", "#000000");
  root.style.setProperty("--sapObjectHeader_IconColor", "#333333");
  root.style.setProperty("--sapObjectHeader_Attribute_TextColor", "#000000");
  root.style.setProperty("--sapObjectHeader_Number_TextColor", "#000000");
    root.style.setProperty("--sapObjectHeader_IconColor", "#333333");
  root.style.setProperty("--sapObjectHeader_Attribute_TextColor", "#000000");
  root.style.setProperty("--sapObjectHeader_Number_TextColor", "#000000");
  root.style.setProperty("--sapObjectStatus_TextColor", "#000000");

//   root.style.setProperty("--sapObjectHeader_Hover_Title_TextColor", "#000000"); 
//   root.style.setProperty("--sapObjectHeader_Hover_subtitle_TextColor", "#000000"); 
//    root.style.setProperty("--_ui5wcr_dp_Title_Hover_TextColor", "#000000"); 
//   root.style.setProperty("--_ui5wcr_dp_Hover_subtitle_TextColor", "#000000"); 

   /* Apply custom header styles */
  root.style.setProperty("--custom-header-background", "#E1F0F6");
  root.style.setProperty("--custom-header-text-color", "#000000");

  /* Breadcrumbs */
  root.style.setProperty("--sapLinkColor", "#333333");
  root.style.setProperty("--sapLink_Hover_Color", "#333333");
  root.style.setProperty("--sapLink_Active_Color", "#333333");

  /* Buttons */
  root.style.setProperty("--sapButton_Background", "#E6E6E6");
  root.style.setProperty("--sapButton_TextColor", "#000000");
  root.style.setProperty("--sapButton_Hover_Background", "#14578b");
  root.style.setProperty("--sapButton_Active_Background", "#bebbbb");
  root.style.setProperty("--sapButton_BorderColor", "#333333");
  root.style.setProperty("--sapButton_Hover_BorderColor", "#333333");


  root.style.setProperty("--_ui5_input_text_color", "#000000"); // Filter input field text color
   // Set Analytical Table Header (Column Header)
  root.style.setProperty("--sapTable_HeaderBackground", "#1e6091");  // Table header background color
  root.style.setProperty("--sapTable_HeaderTextColor", "#000000");  // Table header text color

  


  /* Analytical Table Header */
  root.style.setProperty("--sapList_HeaderBackground", "#fff"); // Background color
  root.style.setProperty("--sapList_HeaderTextColor", "#000000"); // Text color

  /* Column Header */
  root.style.setProperty("--sapTable_HeaderBackground", "#333333"); // Background color
  root.style.setProperty("--sapTable_HeaderTextColor", "#000000"); // Text color

  /* Column Hover */
  root.style.setProperty("--sapList_Hover_Background", "#E6E6E6");

  /* Background */
  root.style.setProperty("--sapBackgroundColor", "#f4f5f7");
  root.style.setProperty("--sapGroup_TitleTextColor", "#000000");

    root.style.setProperty("--sapLabel_TextColor", "#ffffff");  // Try this first

  // For any other relevant properties that might affect label colors globally, use these:
  root.style.setProperty("--sapTextColor", "#000000");  // This may affect general text color
  root.style.setProperty("--sapLinkColor", "#000000");  // This may affect clickable labels/links
  

 

  /* Apply header styles to .custom-header */
  const customHeaders = document.querySelectorAll('.custom-header');
  customHeaders.forEach(header => {
    header.style.backgroundColor = "var(--custom-header-background)";
    header.style.color = "var(--custom-header-text-color)";
  });

  /* ShellBar - Specific Override */
  const shellBar = document.querySelector("#shellbar");
  if (shellBar) {
    shellBar.style.backgroundColor = "var(--brand)";
    shellBar.style.color = "#fff";
  }

  /* Sidebar */
  root.style.setProperty("--sapSidebarBackground", "#ffffff");
  root.style.setProperty("--sapSidebarColor", "#f6f8fb");

  /* Apply custom header styles */
  const customHeader = document.querySelector(".custom-header");
  if (customHeader) {
    customHeader.style.backgroundColor = "var(--custom-header-background)";
    customHeader.style.color = "var(--custom-header-text-color)";
  }

  /* Footer Styles */
  root.style.setProperty("--footer-background", "#f6f8fb");
  root.style.setProperty("--footer-text-color", "#f6f8fb");

  /* Apply button hover effects */
  root.style.setProperty("--sapButton_Hover_Background", "#bec6ca");
  // Handle title toggle color change

};

export const resetTheme = (themeName) => {
  const root = document.documentElement;

  root.removeAttribute("style"); // clear overrides
  setTheme(themeName);
};

