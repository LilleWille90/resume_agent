"""Generate the recruiter-friendly one-page CV in public/Mattias-CV.pdf.

The maintained editorial source lives in content/cv.md. Keep meaningful changes in
both places: this file controls typography and layout, while cv.md feeds the site
knowledge base used by Resume Agent.
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "Mattias-CV.pdf"

INK = HexColor("#17212b")
MUTED = HexColor("#52616d")
ACCENT = HexColor("#196a70")
RULE = HexColor("#c9d4d8")
PALE = HexColor("#eef5f4")


def p(text, style):
    return Paragraph(text, style)


def section(title, styles):
    return [Spacer(1, 4), p(title.upper(), styles["section"]), Spacer(1, 2), HRFlowable(width="100%", thickness=0.55, color=RULE, spaceAfter=4)]


def role(title, dates, intro, bullets, styles):
    content = [
        Table([[p(title, styles["role"]), p(dates, styles["date"])]], colWidths=[116 * mm, 55 * mm]),
        Spacer(1, 1.5),
        p(intro, styles["body"]),
    ]
    for bullet in bullets:
        content += [Spacer(1, 1), p(f"<font color='#196a70'>•</font>&nbsp;&nbsp;{bullet}", styles["bullet"])]
    return KeepTogether(content + [Spacer(1, 4)])


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT), pagesize=A4,
        rightMargin=19 * mm, leftMargin=19 * mm,
        topMargin=15 * mm, bottomMargin=13 * mm,
        title="Mattias Willner - Product & Transformation Leader",
        author="Mattias Willner",
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="name", fontName="Helvetica-Bold", fontSize=21, leading=23, textColor=INK, spaceAfter=1))
    styles.add(ParagraphStyle(name="headline", fontName="Helvetica", fontSize=10.2, leading=13, textColor=ACCENT, spaceAfter=5))
    styles.add(ParagraphStyle(name="contact", fontName="Helvetica", fontSize=7.9, leading=10, textColor=MUTED))
    styles.add(ParagraphStyle(name="summary", fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=INK, spaceAfter=4))
    styles.add(ParagraphStyle(name="strengths", fontName="Helvetica", fontSize=7.8, leading=10.2, textColor=INK, backColor=PALE, borderPadding=5))
    styles.add(ParagraphStyle(name="section", fontName="Helvetica-Bold", fontSize=8.3, leading=9.5, textColor=ACCENT, spaceBefore=0, spaceAfter=0, tracking=0.5))
    styles.add(ParagraphStyle(name="role", fontName="Helvetica-Bold", fontSize=9.1, leading=11, textColor=INK))
    styles.add(ParagraphStyle(name="date", fontName="Helvetica-Bold", fontSize=7.7, leading=10, textColor=MUTED, alignment=2))
    styles.add(ParagraphStyle(name="body", fontName="Helvetica", fontSize=7.9, leading=10.4, textColor=INK))
    styles.add(ParagraphStyle(name="bullet", fontName="Helvetica", fontSize=7.75, leading=10.1, leftIndent=2, textColor=INK))
    styles.add(ParagraphStyle(name="project", fontName="Helvetica", fontSize=7.8, leading=10.2, textColor=INK, spaceAfter=2))
    styles.add(ParagraphStyle(name="footer", fontName="Helvetica", fontSize=7.6, leading=9.5, textColor=MUTED))

    story = [
        p("MATTIAS WILLNER", styles["name"]),
        p("<link href='tel:+46730490591'><font color='#52616d'>+46 730 490 591</font></link> &nbsp; | &nbsp; <link href='mailto:willner.mattias@gmail.com'><font color='#52616d'>willner.mattias@gmail.com</font></link> &nbsp; | &nbsp; Stockholm, Sweden", styles["contact"]),
        p("<link href='https://www.linkedin.com/in/mattias-willner-904a0465/'><font color='#52616d'>linkedin.com/in/mattias-willner-904a0465</font></link> &nbsp; | &nbsp; <link href='https://mattiaswillner.netlify.app'><font color='#196a70'>Mattias' Resume Agent</font></link>", styles["contact"]),
        Spacer(1, 7),
        p("Senior product and transformation leader with 10+ years of experience across connected consumer products, digital workplace, internal tooling and complex delivery environments. Combines product strategy and roadmap ownership with practical cross-functional leadership - grounding priorities in customer insight, data and technical constraints.", styles["summary"]),
        p("<b>CORE STRENGTHS</b>&nbsp;&nbsp; Product Strategy &amp; Roadmaps &nbsp;·&nbsp; Product Leadership &nbsp;·&nbsp; Customer Insight &amp; Problem Framing &nbsp;·&nbsp; Digital Transformation &nbsp;·&nbsp; Internal Tooling &amp; Workflow Design &nbsp;·&nbsp; AI-enabled Product Innovation &nbsp;·&nbsp; Cross-functional Leadership &nbsp;·&nbsp; Data &amp; Experimentation &nbsp;·&nbsp; Governance, Privacy &amp; Security &nbsp;·&nbsp; Vendor &amp; Stakeholder Management", styles["strengths"]),
    ]
    story += section("Experience", styles)
    story += [
        role("Product Manager - Electrolux AB", "2022-present", "Own product strategy and roadmap for the Wellbeing domain in Electrolux OneApp, a shared mobile platform across iOS and Android.", [
            "Lead prioritisation and delivery across mobile, backend, data, firmware, UX, legal and cybersecurity.",
            "Build connected-product experiences for air purifiers, ACs and robot vacuums, balancing multi-brand, multi-market, platform and device-release needs.",
            "Translate customer insight, product data and technical constraints into problem framing, priorities and iteration; work in an AI-enabled environment with Microsoft Copilot integrated into daily workflows, providing practical exposure to adoption, productivity use cases and human + AI ways of working.",
        ], styles),
        role("Digitalisation Manager - Epidemic Sound", "2020-2022", "Led internal digitalisation through tooling, automation and workflow improvement; acting Head of Digitalisation during leave.", [
            "Partnered across the organisation to map needs, prioritise initiatives and support adoption.",
            "Managed software budget, vendors and investments, connecting tool choices to business value and governance; planned and executed initiatives through yearly and quarterly OKRs.",
        ], styles),
        role("Senior Consultant / Consultant - Acando & CGI", "2016-2020", "Product Owner for a Digital Workplace at Arbetsförmedlingen, leading a cross-functional team delivering a modern client platform and workspace used by thousands of employees.", [
            "Also worked as agile coach and project manager for digital services and process development; service designer in healthcare; GDPR advisor for a housing organisation.",
        ], styles),
    ]
    story += section("Selected AI & Product Work", styles)
    story += [
        p("<b>BikeMaster</b> - Founder and product builder for a native iOS/watchOS connected cycling product. Uses GPS, IMU, sensors, weather and route intelligence; AI-assisted development accelerates delivery while core ride logic remains deterministic.", styles["project"]),
        p("<b>StoryTailor</b> - Built an end-to-end service turning a spoken story into a printed children's book: transcription, story and character analysis, page structure, prompts, image generation, PDF/layout, payment and Lulu print fulfilment using multiple AI services.", styles["project"]),
        p("<b>Resume Agent</b> - Want to know more? Reach out directly to me, or ask Mattias' Resume Agent - always available to answer questions about my experience, projects and working style.", styles["project"]),
    ]
    story += section("Education & Credentials", styles)
    story += [
        p("MSc, Engineering - Logistics &amp; Production Management / Production Economics, Lund University (LTH), 2010-2016. &nbsp; SAFe Agilist · Scrum · Digital Trust", styles["footer"]),
        Spacer(1, 2),
        p("Swedish (native) · English (fluent) · Norwegian (working) · Spanish (basic)", styles["footer"]),
    ]
    doc.build(story)


if __name__ == "__main__":
    main()
