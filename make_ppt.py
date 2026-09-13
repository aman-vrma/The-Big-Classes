from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(13.333)  # 16:9 Cinema Widescreen
prs.slide_height = Inches(7.5)

# Premium Dark Cyber Palette
BG_DARK = RGBColor(8, 13, 26)         # Deep Void Slate
CARD_BG = RGBColor(17, 24, 39)        # Slate 900
CARD_BORDER = RGBColor(37, 99, 235)   # Electric Blue
CYAN_ACCENT = RGBColor(56, 189, 248)  # Neon Cyan
WHITE = RGBColor(255, 255, 255)
MUTED = RGBColor(148, 163, 184)       # Slate 400
ALERT_RED = RGBColor(239, 68, 68)     # Warning Crimson
SUCCESS_GREEN = RGBColor(16, 185, 129)# Verified Mint

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
    cat_p.font.color.rgb = CYAN_ACCENT
    cat_p.space_after = Pt(2)
    
    title_p = tf.add_paragraph()
    title_p.text = title_text
    title_p.font.size = Pt(25)
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
        tp.font.size = Pt(13)
        tp.font.bold = True
        tp.font.color.rgb = CYAN_ACCENT
        tp.space_after = Pt(6)
    
    if desc:
        dp = tf.add_paragraph()
        dp.text = desc
        dp.font.size = Pt(10.5)
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
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = text_color
    return circle

# ====================================================
# SLIDE 1: COVER SLIDE
# ====================================================
s1 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s1)

tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(3.2))
tf1 = tb1.text_frame
tf1.word_wrap = True

p_sub = tf1.paragraphs[0]
p_sub.text = "NEXT-GENERATION DUAL-PORTAL ACADEMIC SUITE"
p_sub.font.size = Pt(11)
p_sub.font.bold = True
p_sub.font.color.rgb = CYAN_ACCENT
p_sub.space_after = Pt(6)

p_title = tf1.add_paragraph()
p_title.text = "THE BIG CLASSES"
p_title.font.size = Pt(48)
p_title.font.bold = True
p_title.font.color.rgb = WHITE
p_title.space_after = Pt(8)

p_tag = tf1.add_paragraph()
p_tag.text = "Unified AI Proctoring, Real-Time PIN Synchronization & Anti-Cheating Assessment Desk"
p_tag.font.size = Pt(14)
p_tag.font.color.rgb = MUTED

create_card(s1, Inches(1.0), Inches(5.3), Inches(3.6), Inches(1.5), "PROJECT LEAD", "Aman Verma\nFull-Stack Developer & Architecture Lead")
create_card(s1, Inches(4.9), Inches(5.3), Inches(3.6), Inches(1.5), "INTEGRITY CORE", "3-Strike Tab Switch Detection\nSingle-Attempt Result Lock")
create_card(s1, Inches(8.8), Inches(5.3), Inches(3.5), Inches(1.5), "TECHNOLOGY", "React 18 • TypeScript\nVite • Tailwind • Wouter")

# ====================================================
# SLIDE 2: PROBLEM VS SOLUTION
# ====================================================
s2 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s2)
add_header(s2, "Modern Examination Vulnerabilities vs The Big Classes", "PROBLEM & SOLUTION")

create_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "THE TRADITIONAL ASSESSMENT PROBLEM",
            "• Vulnerable Windows: Examinees easily switch tabs or browse solutions mid-test.\n\n"
            "• Fragmented Systems: Faculty drafts questions in one app while students test on another, leading to manual sync overhead.\n\n"
            "• Loopholes & Retakes: Lack of strict submission locks allows students to retry and manipulate test scores.\n\n"
            "• Cluttered Interfaces: Outdated LMS platforms cause cognitive distraction during timed exams.",
            ALERT_RED)

create_card(s2, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "THE BIG CLASSES SOLUTION",
            "• Built-In Proctoring: Native Page Visibility listeners trigger immediate disciplinary strikes upon blur.\n\n"
            "• 6-Digit PIN Synchronization: Unified room registry connects Faculty host directly with Student arena.\n\n"
            "• Strict Single-Attempt Lock: Completed sessions permanently lock retakes and issue verified PDF scorecards.\n\n"
            "• Netflix-Grade Dark Aesthetic: Clean, distraction-free environment with 100% pure white contrast.",
            SUCCESS_GREEN)

# ====================================================
# SLIDE 3: SYSTEM ARCHITECTURE & TECH STACK
# ====================================================
s3 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s3)
add_header(s3, "High-Performance Modular Tech Stack", "TECHNICAL ARCHITECTURE")

create_card(s3, Inches(0.8), Inches(1.8), Inches(2.7), Inches(5.0),
            "1. FRONTEND CORE",
            "• React 18 SPA Framework\n\n"
            "• TypeScript for strict types\n\n"
            "• Vite Bundler for lightning-fast HMR builds\n\n"
            "• Wouter for lightweight routing")

create_card(s3, Inches(3.8), Inches(1.8), Inches(2.7), Inches(5.0),
            "2. STATE & SYNC",
            "• TanStack React Query for async caching\n\n"
            "• Centralized AuthContext for role switching\n\n"
            "• Synchronized Room Store (LocalStorage Bridge)\n\n"
            "• Active Candidate Poller")

create_card(s3, Inches(6.8), Inches(1.8), Inches(2.7), Inches(5.0),
            "3. PROCTORING & DOCS",
            "• HTML5 Page Visibility API (Cheating strikes)\n\n"
            "• PDF.js Document Worker (Syllabus extraction)\n\n"
            "• Dynamic HTML-to-Print Scorecard Engine\n\n"
            "• CSV Ledger Exporter")

create_card(s3, Inches(9.8), Inches(1.8), Inches(2.7), Inches(5.0),
            "4. DESIGN SYSTEM",
            "• Tailwind CSS Framework\n\n"
            "• Pure Slate Background (#080D1A)\n\n"
            "• Pure Crisp Font (#FFFFFF)\n\n"
            "• Lucide React Icons")

# ====================================================
# SLIDE 4: DUAL-PORTAL BREAKDOWN
# ====================================================
s4 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s4)
add_header(s4, "Separation of Concerns: Dual Specialized Workspaces", "PORTAL MATRIX")

create_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "FACULTY COMMAND COCKPIT",
            "• AI Question Generation: Ingests raw text or uploaded PDF course material to formulate targeted MCQs.\n\n"
            "• Room Token Host: Issues 6-digit access codes with duration and difficulty bounds.\n\n"
            "• Live Monitoring Ledger: Tracks active examinees, ongoing attempts, and strike violations in real time.\n\n"
            "• Scorecard Dispatch: Single-click email delivery of student evaluation reports and CSV ledger export.\n\n"
            "• Academic Utilities: Integrated Lesson Planner, Assignment Creator, and Answer Grader.")

create_card(s4, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
            "STUDENT EXAMINATION ARENA",
            "• Streamlined Verification: Direct authentication using Candidate Name, Email, and 6-Digit Room PIN.\n\n"
            "• Synchronized Test Load: Instantly pulls and executes faculty-drafted exam questions.\n\n"
            "• Anti-Cheat Perimeter: Displays active countdown timer and real-time strike warning counters.\n\n"
            "• Verified Printable Certificate: One-click generation of official cryptographic PDF scorecards.\n\n"
            "• Zero Retake Loophole: Exam submission locks the desk permanently to avoid multiple attempts.")

# ====================================================
# SLIDE 5: SYSTEM FLOWCHART (Full Step-by-Step Flow)
# ====================================================
s5 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s5)
add_header(s5, "End-to-End Exam Synchronization Flow", "WORKFLOW FLOWCHART")

steps = [
    ("1", "FACULTY DRAFT", "Uploads syllabus PDF\nor inputs topic prompt\nAI builds questions", Inches(0.8)),
    ("2", "PIN BROADCAST", "Room launched;\nUnique 6-Digit PIN saved\nto shared room store", Inches(3.8)),
    ("3", "STUDENT JOIN", "Candidate inputs details\n& PIN; active questions\nloaded into exam arena", Inches(6.8)),
    ("4", "SUBMISSION", "Proctor logs strikes;\nScore finalized;\nVerified PDF generated", Inches(9.8))
]

for num, title, desc, left_pos in steps:
    create_card(s5, left_pos, Inches(2.2), Inches(2.7), Inches(2.5), title, desc, CYAN_ACCENT)
    add_circle_badge(s5, left_pos + Inches(1.05), Inches(1.8), Inches(0.6), num, CARD_BORDER)

# Arrow Connectors
for x in [Inches(3.5), Inches(6.5), Inches(9.5)]:
    arrow = s5.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x, Inches(3.2), Inches(0.25), Inches(0.2))
    arrow.fill.solid()
    arrow.fill.fore_color.rgb = CYAN_ACCENT
    arrow.line.fill.background()

# Technical Bridge Architecture Note
create_card(s5, Inches(0.8), Inches(5.1), Inches(11.7), Inches(1.6),
            "DATA BUS ARCHITECTURE: REAL-TIME CLIENT-SIDE SYNCHRONIZATION",
            "• Faculty and Student portals communicate through the standardized room-store bridge.\n"
            "• Student tab-switch events and strike increments update candidate records instantly.\n"
            "• Faculty Candidate Monitor polls updates every 2 seconds, displaying live progress and final marks without page refresh.")

# ====================================================
# SLIDE 6: PROCTORING & 3-STRIKE CHEATING SHIELD
# ====================================================
s6 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s6)
add_header(s6, "Automated Behavioral Anti-Cheating Protocol", "SECURITY & COMPLIANCE")

create_card(s6, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "1. VISIBILITY DETECTION",
            "Leverages browser Document Visibility API.\n\n"
            "• Instant detection when student tabs out\n\n"
            "• Logs window minimization attempts\n\n"
            "• Flags split-screen side tasks\n\n"
            "• Works without intrusive camera requirements",
            CARD_BORDER)

create_card(s6, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "2. THE 3-STRIKE LADDER",
            "Progressive disciplinary counter.\n\n"
            "• Strike 1: Warning prompt on screen\n\n"
            "• Strike 2: Severe violation penalty recorded\n\n"
            "• Strike 3: AUTOMATIC TERMINATION\n\n"
            "• Forces test auto-submission immediately",
            ALERT_RED)

create_card(s6, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "3. PERMANENT LEDGER",
            "Disciplinary action recorded in real time.\n\n"
            "• Marked 'Disqualified (3 Strikes)' on dashboard\n\n"
            "• PDF certificate stamped with violation tag\n\n"
            "• Retake buttons removed permanently\n\n"
            "• Faculty receives instant disqualified alert",
            CYAN_ACCENT)

# ====================================================
# SLIDE 7: ROADMAP & CONCLUSION
# ====================================================
s7 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(s7)
add_header(s7, "Future Roadmap & Project Conclusion", "PROJECT ROADMAP")

create_card(s7, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "PHASE 1: AUTH & ROLES",
            "• Super-Admin Command Panel (/admin)\n\n"
            "• Centralized Faculty approval workflow\n\n"
            "• Telegram/Email registration webhook alerts\n\n"
            "• Institutional multi-tenant support")

create_card(s7, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "PHASE 2: AI AUDIT",
            "• Computer vision eye-tracking algorithms\n\n"
            "• Background ambient noise analysis\n\n"
            "• Direct SMTP scorecard email dispatch\n\n"
            "• LMS connectors (Canvas & Google Classroom)")

create_card(s7, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
            "SUMMARY & IMPACT",
            "THE BIG CLASSES provides an academic examination ecosystem that bridges speed, proctoring security, and design clarity.\n\n"
            "• Live on Vercel & GitHub\n"
            "• Zero Cheating Tolerance\n\n"
            "Thank You!\nLead Developer: Aman Verma",
            SUCCESS_GREEN)

# Save Presentation
prs.save("The_Big_Classes_Presentation.pptx")
print("Presentation generated successfully: 7 Slides, Flowchart Included, Zero Image Dependency.")