import re

files = [
    "d:\\Divya-Drishti-Project\\src\\pages\\StudentPortal.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\StudentLogin.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\StudentHeader.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\BottomNav.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\ClassroomTab.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\VisionTab.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\EncyclopediaTab.jsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "import { motion }" not in content:
        content = re.sub(r"import React.*?\n", "\\g<0>import { motion, AnimatePresence } from 'framer-motion';\n", content, count=1)
        
        if "StudentPortal.jsx" in file:
            content = content.replace("<div style={{ height: '100vh'", "<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ height: '100vh'")
            content = content.replace("</div>\n  );\n}", "</motion.div>\n  );\n}")
            
            # Wrap the tabs in AnimatePresence (this is a bit complex for simple replace, so we just wrap the main content in motion.div)
            content = content.replace("<main style={{ flex: 1", "<main style={{ flex: 1") # Keep main as is, components will animate themselves

        elif "StudentLogin.jsx" in file:
            content = content.replace("<div style={{ padding: '60px'", "<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '60px'")
            content = content.replace("</div>\n  );\n}", "</motion.div>\n  );\n}")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")

        elif "StudentHeader.jsx" in file:
            content = content.replace("<header ", "<motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} ")
            content = content.replace("</header>", "</motion.header>")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")
            content = content.replace("<div \n          onClick={toggleMic}", "<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} \n          onClick={toggleMic}")
            content = content.replace("Mic Off (Tap to Wake)\"}\n        </div>", "Mic Off (Tap to Wake)\"}\n        </motion.div>")

        elif "BottomNav.jsx" in file:
            content = content.replace("<nav ", "<motion.nav initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} ")
            content = content.replace("</nav>", "</motion.nav>")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} ")
            content = content.replace("</button>", "</motion.button>")
            
        elif "ClassroomTab.jsx" in file:
            content = content.replace("<div style={{ flex: 1, display: 'flex', gap: '10px', width: '100%', animation: 'fadeIn 0.3s' }}>", "<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 100 }} style={{ flex: 1, display: 'flex', gap: '10px', width: '100%' }}>")
            # For the return div inside ZoneButton
            content = content.replace("<div \n        onMouseDown", "<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} \n        onMouseDown")
            content = content.replace("Key: {pcKey}</span>\n      </div>", "Key: {pcKey}</span>\n      </motion.div>")
            # Replace inner return component
            content = content.replace("</div>\n  );\n}", "</motion.div>\n  );\n}")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")

        elif "VisionTab.jsx" in file:
            content = content.replace("<div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s'", "<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column'")
            content = content.replace("</div>\n  );\n}", "</motion.div>\n  );\n}")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")

        elif "EncyclopediaTab.jsx" in file:
            # We have two returns in this file
            content = content.replace("<div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6, animation: 'fadeIn 0.3s'", "<motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'")
            content = content.replace("GO TO VISION SCANNER</button>\n      </div>", "GO TO VISION SCANNER</motion.button>\n      </motion.div>")
            
            content = content.replace("<div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s'", "<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column'")
            content = content.replace("</div>\n    </div>\n  );\n}", "</div>\n    </motion.div>\n  );\n}")
            content = content.replace("<button ", "<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} ")
            content = content.replace("</button>", "</motion.button>")

        with open(file, "w", encoding="utf-8") as f:
            f.write(content)

print("Student components upgraded with framer-motion.")
