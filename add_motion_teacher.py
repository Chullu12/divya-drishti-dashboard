import re

files = [
    "d:\\Divya-Drishti-Project\\src\\pages\\TeacherDash.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Teacher\\TeacherHeader.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Teacher\\ControlDashboard.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Teacher\\CurriculumManagement.jsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "import { motion }" not in content:
        # Add import
        content = re.sub(r"import React.*?\n", "\\g<0>import { motion } from 'framer-motion';\n", content, count=1)
        
        if "TeacherDash.jsx" in file:
            content = content.replace("<div style={{ maxWidth: '1200px'", "<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ maxWidth: '1200px'")
            content = content.replace("</div>\n  );\n}", "</motion.div>\n  );\n}")
        
        elif "TeacherHeader.jsx" in file:
            content = content.replace("<header ", "<motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} ")
            content = content.replace("</header>", "</motion.header>")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")
            
        elif "ControlDashboard.jsx" in file:
            content = content.replace("<div style={{ display: 'grid'", "<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid'")
            content = content.replace("</div>\n  );\n}", "</motion.div>\n  );\n}")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")
            
        elif "CurriculumManagement.jsx" in file:
            content = content.replace("<div>\n      <div style={{ display: 'grid'", "<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>\n      <div style={{ display: 'grid'")
            content = content.replace("</div>\n  );\n}", "</motion.div>\n  );\n}")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")
            
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)

print("Teacher components upgraded with framer-motion.")
