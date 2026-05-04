import re

def update_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Generic Replacements for UI
    
    # 1. Main Backgrounds
    content = content.replace("backgroundColor: '#fdf2f8'", "background: 'transparent'")
    content = content.replace("background: '#fdf2f8'", "background: 'transparent'")
    content = content.replace("backgroundColor: '#fff'", "background: 'transparent'")
    content = content.replace("background: '#ffffff'", "background: 'transparent'")
    content = content.replace("background: 'white'", "background: 'transparent'")
    
    # 2. Text Colors
    content = content.replace("color: '#db2777'", "color: 'var(--accent-pink)'")
    content = content.replace("color: '#333'", "color: 'var(--text-primary)'")
    content = content.replace("color: '#666'", "color: 'var(--text-secondary)'")
    content = content.replace("color: '#4b5563'", "color: 'var(--text-secondary)'")
    content = content.replace("color: '#1f2937'", "color: 'var(--text-primary)'")
    content = content.replace("color: '#000'", "color: 'white'")
    
    # 3. Class Injections
    # Buttons
    content = re.sub(r"style=\{\{.*?background: 'var\(--accent-pink\)'.*?\}\}", "className=\"btn-primary\" style={{}}", content)
    content = re.sub(r"style=\{\{.*?background: '#db2777'.*?\}\}", "className=\"btn-primary\" style={{}}", content)
    
    # Inputs/Selects
    content = re.sub(r"style=\{\{[^}]*?border: '2px solid var\(--accent-pink\)'.*?\}\}", "className=\"glass-input\" style={{ width: '100%' }}", content)
    
    # Headers
    content = content.replace("boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'", "")
    content = content.replace("borderTop: '6px solid var(--accent-pink)'", "borderTop: 'none'")
    
    if "TeacherHeader.jsx" in filepath or "StudentHeader.jsx" in filepath:
        content = content.replace("<motion.header ", "<motion.header className=\"glass-panel\" ")
        
    if "TeacherDash.jsx" in filepath:
        content = content.replace("color: 'var(--text-primary)'", "")
        
    if "StudentLogin.jsx" in filepath:
        content = content.replace("<motion.div initial=", "<motion.div className=\"glass-panel\" initial=")
        content = content.replace("boxShadow: '0 10px 30px rgba(0,0,0,0.05)'", "")
        
    if "ClassroomTab.jsx" in filepath:
        content = content.replace("backgroundColor: 'var(--accent-pink)'", "background: 'rgba(219, 39, 119, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(219,39,119,0.4)'")
        content = content.replace("backgroundColor: 'transparent'", "className: 'glass-card', background: 'transparent'")
        content = content.replace("border: '4px dashed #fbcfe8'", "border: '2px dashed rgba(255,255,255,0.2)'")
        content = content.replace("backgroundColor: '#f3f4f6'", "background: 'rgba(255,255,255,0.1)'")
        
    if "EncyclopediaTab.jsx" in filepath:
        content = content.replace("backgroundColor: 'transparent', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'", "className: 'glass-panel'")
        content = content.replace("backgroundColor: '#f9fafb'", "background: 'rgba(0,0,0,0.2)'")
        content = content.replace("background: '#f3f4f6'", "background: 'rgba(255,255,255,0.1)'")
        content = content.replace("background: '#e0e7ff'", "background: 'rgba(59,130,246,0.2)'")
        content = content.replace("color: '#3730a3'", "color: '#93c5fd'")
        
    if "VisionTab.jsx" in filepath:
        content = content.replace("backgroundColor: 'transparent', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'", "className: 'glass-panel'")
        
    if "ControlDashboard.jsx" in filepath or "CurriculumManagement.jsx" in filepath:
        content = content.replace("background: 'transparent', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0'", "background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

files = [
    "d:\\Divya-Drishti-Project\\src\\pages\\TeacherDash.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Teacher\\TeacherHeader.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Teacher\\ControlDashboard.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Teacher\\CurriculumManagement.jsx",
    "d:\\Divya-Drishti-Project\\src\\pages\\StudentPortal.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\StudentLogin.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\StudentHeader.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\BottomNav.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\ClassroomTab.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\VisionTab.jsx",
    "d:\\Divya-Drishti-Project\\src\\components\\Student\\EncyclopediaTab.jsx"
]

for f in files:
    update_file(f)

print("Applied Glassmorphism UI")
