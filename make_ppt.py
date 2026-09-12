import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(13.333)  # 16:9 Cinema Widescreen
prs.slide_height = Inches(7.5)

# Designer Palette
BG_DARK = RGBColor(11, 19, 43)        # Deep Void Blue
CARD_BG = RGBColor(28, 37, 65)        # Layered Slate Glass
CARD_BORDER = RGBColor(79, 70, 229)   # Royal Indigo Border
ACCENT_BLUE = RGBColor(56, 189, 248)  # Cyan Flare
ACCENT_VIOLET = RGBColor(168, 85, 247)# Neon Violet
WHITE = RGBColor(255, 255, 255)
MUTED = RGBColor(148, 163, 184)       # Muted Ice
ALERT_RED = RGBColor(244, 63, 94)     # Rose Alert
SUCCESS_GREEN = RGBColor(16, 185, 129)# Mint Green

def set_slide_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.fill.background()
    return bg

def add_header(slide, title_text, category_text="THE BIG CLASSES // PRODUCTION ARCHITECTURE"):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.1))
    tf = tb.text_frame
    tf.word_wrap = True
    
    cat_p = tf.paragraphs[0]
    cat_p.text = category_text.upper()
    cat_p.font.size = Pt(10)
    cat_p.font.bold = True
    cat_p.font.color.rgb = ACCENT_BLUE
    cat_p.space_after = Pt(2)
    
    title_p = tf.add_paragraph()
    title_p.text = title_text
    title_p.font.size = Pt(26)
    title_p.font.bold = True
    title_p.font.color.rgb = WHITE

def create_card(slide, left, top, width, height, title, desc="", border_color=CARD_BORDER, bg_color=CARD_BG):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.5)
    
    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.25)
    tf.margin_right = Inches(0.25)
    tf.margin_top = Inches(0.25)
    
    if title:
        tp = tf.paragraphs[0]
        tp.text = title
        tp.font.size = Pt(14)
        tp.font.bold = True
        tp.font.color.rgb = ACCENT_BLUE
        tp.space_after = Pt(6)
    
    if desc:
        dp = tf.add_paragraph()
        dp.text = desc
        dp.font.size = Pt(11)
        dp.font.color.rgb = MUTED
        dp.line_spacing = 1.2
    return card

def add_circle_badge(slide, left, top, diameter, text, bg_color=CARD_BORDER, text_color=WHITE):
    circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, diameter, diameter)
    circle.fill.solid()
    circle.fill.fore_color.rgb = bg_color
    circle.line.fill.background()
    tf = circle.text_frame
    p = tf.paragraphs[0]
    p.text = text
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = text_color
    return circle

def try_embed_image(slide, left, top, width, height, preferred_filenames):
    for fn in preferred_filenames:
        if os.path.exists(fn):
            try:
                slide.shapes.add_picture(fn, left, top, width=width, height=height)
                return True
            except:
                pass
    # Fallback decorative mock frame if image file isn't in root
    f = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    f.fill.solid()
    f.fill.fore_color.rgb = RGBColor(15, 23, 42)
    f.line.color.rgb = CARD_BORDER
    tf = f.text_frame
    p = tf.paragraphs[0]
    p.text = "LIVE DESK PREVIEW\n[Drop Screenshot Here]"
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(12)
    p.font.color.rgb = MUTED
    return False

# ====================================================
# SLIDE 1: HERO TITLE SLIDE (Cyber Aesthetic)
# ====================================================
s1 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s1)

add_circle_badge(s1, Inches(1.0), Inches(1.5), Inches(0.8), "AI", ACCENT_BLUE, BG_DARK)

tb1 = s1.shapes.add_textbox(Inches(2.0), Inches(1.4), Inches(10.0), Inches(3.0))
tf1 = tb1.text_frame
tf1.word_wrap = True

p_sub = tf1.paragraphs[0]
p_sub.text = "NEXT-GENERATION EXAMINATION & ASSESSMENT SUITE"
p_sub.font.size = Pt(11)
p_sub.font.bold = True
p_sub.font.color.rgb = ACCENT_BLUE

p_title = tf1.add_paragraph()
p_title.text = "THE BIG CLASSES"
p_title.font.size = Pt(50)
p_title.font.bold = True
p_title.font.color.rgb = WHITE
p_title.space_after = Pt(6)

p_tag = tf1.add_paragraph()
p_tag.text = "Dual-Role Architecture with Live Proctored Exam Arenas & Integrity Enforcement"
p_tag.font.size = Pt(14)
p_tag.font.color.rgb = MUTED

# Highlight Metric Cards
create_card(s1, Inches(1.0), Inches(5.2), Inches(3.4), Inches(1.5), "STRICT INTEGRITY", "3-Strike Automated Tab Detection\nZero-Tolerance Cheating Policy", CARD_BORDER)
create_card(s1, Inches(4.8), Inches(5.2), Inches(3.4), Inches(1.5), "FAST ACCESS", "6-Digit Sync Room PIN\nInstant Candidate Roster Connect", ACCENT_BLUE)
create_card(s1, Inches(8.6), Inches(5.2), Inches(3.7), Inches(1.5), "ARCHITECTURE", "Lead: Aman Verma\nTech: React • TypeScript • Wouter", CARD_BORDER)

# ====================================================
# SLIDE 2: THE PROBLEM & CORE CONCEPT
# ====================================================
s2 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s2)
add_header(s2, "Modern Examination Pitfalls vs. The Big Classes Solution", "PROBLEM / SOLUTION")

create_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "THE TRADITIONAL ASSESSMENT GAP",
            "• Vulnerable Testing: Unmonitored tabs encourage candidates to search answers in real-time.\n\n"
            "• Disconnected Roles: Teachers and students use disparate tools requiring manual score compilation.\n\n"
            "• Laggy Platforms: Bloated enterprise LMS frameworks introduce friction and high latency during active exams.",
            ALERT_RED)

create_card(s2, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "THE BIG CLASSES PARADIGM",
            "• Proctored Browser Shield: Automatic visibility listeners penalize tab shifts instantly.\n\n"
            "• Real-Time Room Binding: Faculty room PINs directly stream quizzes to verified student desks.\n\n"
            "• Lightweight Dual Cockpit: Netflix-grade sleek dark UI optimized for distraction-free focus.",
            SUCCESS_GREEN)

# ====================================================
# SLIDE 3: SYSTEM ARCHITECTURE & TECH STACK
# ====================================================
s3 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s3)
add_header(s3, "Engineered for Resilience, High Speed & Type Safety", "TECH STACK MATRIX")

tech_cards = [
    ("FRONTEND CORE", "• React 18 SPA\n• TypeScript Safety\n• Vite Engine\n• Wouter Routing", Inches(0.8)),
    ("STATE & COMM", "• TanStack React Query\n• Centralized AuthContext\n• LocalStorage Sync Bus\n• Visibility Detection API", Inches(3.8)),
    ("DOCUMENT AI", "• PDF.js Document Worker\n• Ingestion Text Parser\n• CSV Candidate Exporter\n• Client PDF Certificate Engine", Inches(6.8)),
    ("UI & GRAPHICS", "• Tailwind CSS Engine\n• Lucide Vector Suite\n• High-Contrast Dark Theme\n• Custom Keyframe Flares", Inches(9.8))
]

for title, content, pos_x in tech_cards:
    create_card(s3, pos_x, Inches(1.8), Inches(2.7), Inches(5.0), title, content)

# ====================================================
# SLIDE 4: DUAL PORTAL WORKSPACE BREAKDOWN
# ====================================================
s4 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s4)
add_header(s4, "Two Dedicated Workspaces. Zero Cross-Contamination.", "PORTAL ISOLATION")

create_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "FACULTY COMMAND COCKPIT",
            "• AI Quiz Formulator: Transforms text & PDF syllabi into timed tests.\n\n"
            "• 6-Digit PIN Room Broadcast: One-click live room generation.\n\n"
            "• Real-Time Candidate Tracker: Live tracking of examinee status.\n\n"
            "• Scorecard Email Dispatch: Single-click mailto dispatch of results.")

create_card(s4, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "STUDENT EXAM ARENA",
            "• Clean Token Entry: Quick start with Candidate Name, Email & Room PIN.\n\n"
            "• Synchronized Questions: Pulls active quiz generated by faculty.\n\n"
            "• Anti-Tamper Policy: Permanent removal of re-attempt loops.\n\n"
            "• Verified Printable Certificate: Immediate tamper-evident PDF download.")

# ====================================================
# SLIDE 5: LIVE FLOWCHART SLIDE (Connected Flow Nodes)
# ====================================================
s5 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s5)
add_header(s5, "End-to-End Examination Execution Pipeline", "SYSTEM FLOWCHART")

flow_nodes = [
    ("NODE 1", "FACULTY DRAFT", "Upload PDF Syllabus\nor Prompt Topic", Inches(0.8)),
    ("NODE 2", "PIN BROADCAST", "Engine launches room\nGenerates 6-Digit PIN", Inches(3.8)),
    ("NODE 3", "STUDENT ARENA", "Student enters credentials\n& loads active test", Inches(6.8)),
    ("NODE 4", "INTEGRITY & LEDGER", "Real-Time 3 Strikes &\nAuto-Generated PDF", Inches(9.8))
]

for idx, title, desc, left_pos in flow_nodes:
    create_card(s5, left_pos, Inches(2.3), Inches(2.7), Inches(2.4), f"[{title}]", desc, ACCENT_BLUE)
    add_circle_badge(s5, left_pos + Inches(1.05), Inches(1.9), Inches(0.6), str(idx.split()[1]), ACCENT_VIOLET)

# Connection Arrows between Nodes
for x in [Inches(3.5), Inches(6.5), Inches(9.5)]:
    arrow = s5.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x, Inches(3.2), Inches(0.25), Inches(0.2))
    arrow.fill.solid()
    arrow.fill.fore_color.rgb = ACCENT_BLUE
    arrow.line.fill.background()

# Flowchart Bottom Summary Box
create_card(s5, Inches(0.8), Inches(5.2), Inches(11.7), Inches(1.5), 
            "DATA PIPELINE INTEGRITY", 
            "localStorage room-store acts as the ultra-fast synchronized data bridge. Both teacher tracking and student submission update simultaneously without database overhead.",
            CARD_BORDER)

# ====================================================
# SLIDE 6: UI SPOTLIGHT & LIVE DESK PROOFS
# ====================================================
s6 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s6)
add_header(s6, "High-Contrast UI & Live Portal Showcase", "INTERFACE EXCELLENCE")

# Left Column: Design highlights
create_card(s6, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.0),
            "CLEAN NETFLIX-GRADE UI",
            "• Pure White Text (#FFFFFF) against Deep Void (#0B132B) for high clarity.\n\n"
            "• Single Identity Focus: Removed confusing status capsules & clutter.\n\n"
            "• Instant Responsive Grids: Designed for mobile examinees and widescreen desktop faculty setups.\n\n"
            "• Embedded Live Desk Frame on the right shows active proctored experience.")

# Right Column: Actual Image Embed Frame
try_embed_image(s6, Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.0), 
                ["image_4019ed.png", "image_3fb52e.png", "image_408eac.png", "image_40256c.png"])

# ====================================================
# SLIDE 7: ANTI-CHEATING & THREE-STRIKE MECHANISM
# ====================================================
s7 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s7)
add_header(s7, "Automated Behavioral Proctoring Shield", "EXAM SECURITY")

create_card(s7, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "1. TAB VISIBILITY DETECT",
            "Harnesses HTML5 Page Visibility API.\n\n"
            "• Instant detection of Alt+Tab\n"
            "• Tracks split-screen maneuvers\n"
            "• Detects minimized windows\n"
            "• Real-time logging of violations",
            CARD_BORDER)

create_card(s7, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "2. THE 3-STRIKE PENALTY",
            "Direct progressive warning system.\n\n"
            "• Strike 1: Notice alert on screen\n"
            "• Strike 2: Severe violation penalty\n"
            "• Strike 3: AUTOMATIC SUBMIT\n"
            "• Prevents candidate tampering",
            ALERT_RED)

create_card(s7, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "3. EXPULSION & LEDGER",
            "Candidate ledger permanently updated.\n\n"
            "• Flagged as 'Disqualified (3 Strikes)'\n"
            "• Faculty monitor updates live\n"
            "• Scorecard stamps disciplinary mark\n"
            "• Retake option locked down",
            ACCENT_VIOLET)

# ====================================================
# SLIDE 8: ROADMAP & FUTURE EVOLUTION
# ====================================================
s8 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s8)
add_header(s8, "Future Evolution & Project Conclusion", "WHAT'S NEXT")

create_card(s8, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "PHASE 1: COMPUTER VISION",
            "• Browser Webcam Eye Tracking\n"
            "• Multi-face detection alerts\n"
            "• Background noise audio analysis\n"
            "• AI-driven head pose estimation")

create_card(s8, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "PHASE 2: CLOUD & LMS",
            "• Supabase/Firebase persistent sync\n"
            "• Google Classroom integration\n"
            "• Automated SMTP score mailer\n"
            "• Student performance analytics")

create_card(s8, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "PROJECT WRAP-UP",
            "THE BIG CLASSES delivers a solid, tamper-resistant assessment ecosystem.\n\n"
            "Developed with focus on speed, design precision, and academic integrity.\n\n"
            "Thank You!\nLead Developer: Aman Verma",
            SUCCESS_GREEN)

# Save
prs.save("The_Big_Classes_Presentation.pptx")
print("Presentation created successfully: The_Big_Classes_Presentation.pptx (8 Professional Slides)")