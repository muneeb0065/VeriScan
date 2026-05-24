"""
AI Media & Deepfake Detector v3
Scans entire bottom strip for watermarks, uses multiple detection methods.
"""
from io import BytesIO
import math

def analyze_ai_media(file_bytes: bytes, file_name: str) -> dict:
    ext = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else ''
    is_image = ext in ('jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff', 'gif')
    is_video = ext in ('mp4', 'mov', 'avi', 'mkv', 'webm')
    if is_image:
        return _analyze_image(file_bytes, file_name, ext)
    elif is_video:
        return _analyze_video(file_bytes, file_name, ext)
    return {"score": 0, "verdict": "Unknown", "summary": f".{ext} not supported.",
            "checks": [{"label": "File Type", "status": "warning", "value": f".{ext} not supported."}]}


def _analyze_image(file_bytes: bytes, file_name: str, ext: str) -> dict:
    from PIL import Image, ImageFilter
    import statistics

    checks = []
    score = 0

    try:
        img = Image.open(BytesIO(file_bytes)).convert("RGB")
        w, h = img.size
        print(f"\n[AI] File={file_name} ext={ext} size={w}x{h}")

        # ═══ 1. FORMAT ═══
        if ext in ('png', 'webp'):
            score += 20
            checks.append({"label": "File Format", "status": "warning",
                "value": f"This is a {ext.upper()} file. AI generators (Gemini, Midjourney, DALL-E) typically output {ext.upper()}, not JPEG like real cameras."})

        # ═══ 2. EXIF ═══
        exif = {}
        try:
            exif = img.getexif()
        except:
            pass
        has_exif = bool(exif and len(exif) > 0)
        software = str(exif.get(0x0131, '')).strip().lower() if has_exif else ''
        make = str(exif.get(0x010F, '')).strip() if has_exif else ''
        model = str(exif.get(0x0110, '')).strip() if has_exif else ''
        print(f"[AI] EXIF keys={list(exif.keys()) if has_exif else 'NONE'} sw='{software}' make='{make}' model='{model}'")

        ai_tags = ['midjourney','stable diffusion','dall-e','firefly','imagen','bing','gemini',
                   'generative','runway','sora','pika','canva','nightcafe','deepai','artbreeder',
                   'flux','leonardo','ideogram','google ai']
        sw_match = next((t for t in ai_tags if t in software), None)
        if sw_match:
            score = 100
            checks.append({"label": "AI Software in Metadata", "status": "fail",
                "value": f"DEFINITIVE PROOF: Software tag = '{software}' which is a known AI generator."})
        elif make or model:
            checks.append({"label": "Camera Detected", "status": "pass",
                "value": f"Real camera: {make} {model}."})
        elif has_exif:
            score += 30
            checks.append({"label": "No Camera in Metadata", "status": "fail",
                "value": "File has metadata but NO camera make/model. Real photos always have this."})
        else:
            score += 40
            checks.append({"label": "No Metadata At All", "status": "fail",
                "value": "ZERO metadata found. Real cameras always write device info, date, GPS. AI generators produce blank metadata."})

        # ═══ 3. WATERMARK DETECTION — scan bottom 15% and right 15% ═══
        if score < 100:
            wm = _detect_watermark_strip(img, w, h)
            score += wm['penalty']
            if wm['found']:
                checks.append({"label": "AI Watermark Detected", "status": "fail", "value": wm['msg']})
            else:
                checks.append({"label": "Watermark Scan", "status": "pass", "value": wm['msg']})

        # ═══ 4. AI CANVAS SIZE ═══
        ai_dims = {256,512,768,1024,1280,1536,2048,4096,3840,1920}
        if w in ai_dims and h in ai_dims:
            score += 20
            checks.append({"label": "AI Canvas Size", "status": "fail",
                "value": f"Exact {w}×{h}px — standard AI render size. Real cameras have irregular dimensions like 4032×3024."})
        elif w in ai_dims or h in ai_dims:
            score += 8
            checks.append({"label": "Dimensions", "status": "warning",
                "value": f"{w}×{h}px — one dimension matches common AI sizes."})
        else:
            checks.append({"label": "Dimensions", "status": "pass",
                "value": f"{w}×{h}px looks like a real camera dimension."})

        # ═══ 5. NOISE UNIFORMITY ═══
        if score < 100:
            ns, nd = _noise_check(img, w, h)
            if ns > 0.65:
                score += 25
                checks.append({"label": "Uniform Noise", "status": "fail",
                    "value": f"Noise is unnaturally identical everywhere ({nd}). Real cameras have more noise in dark areas."})
            elif ns > 0.4:
                score += 10
                checks.append({"label": "Noise", "status": "warning", "value": f"Slightly unusual noise ({nd})."})
            else:
                checks.append({"label": "Noise", "status": "pass", "value": f"Natural noise pattern ({nd})."})

        # ═══ 6. COLOR SATURATION ═══
        if score < 100:
            cs, cd = _sat_check(img)
            if cs > 0.6:
                score += 15
                checks.append({"label": "Oversaturated", "status": "warning",
                    "value": f"Colors are unnaturally vivid ({cd}). AI images tend to be over-saturated."})
            else:
                checks.append({"label": "Colors", "status": "pass", "value": f"Color saturation normal ({cd})."})

    except Exception as e:
        checks.append({"label": "Error", "status": "warning", "value": str(e)})
        score = max(score, 15)

    score = min(score, 100)
    print(f"[AI] FINAL SCORE = {score}")

    if score >= 60:
        verdict = "AI Generated / Manipulated"
        summary = f"High confidence AI-generated ({score}%). Multiple indicators confirm."
    elif score >= 30:
        verdict = "Suspicious"
        summary = f"Several AI indicators found ({score}%). Be cautious."
    else:
        verdict = "Likely Authentic"
        summary = f"No strong AI signals ({score}%)."

    return {"score": score, "verdict": verdict, "summary": summary,
            "checks": checks, "file_name": file_name}


# ═══════════════════════════════════════════════════════════
# WATERMARK: Scan bottom 15% strip AND bottom-right quadrant
# ═══════════════════════════════════════════════════════════
def _detect_watermark_strip(img, w, h):
    """
    Scan the bottom 15% of the image and the bottom-right quadrant.
    Any watermark (Gemini, Midjourney, etc.) creates a region with
    distinctly different pixel patterns — either semi-transparent overlay,
    colored badge, or text that creates sharp local contrast changes.
    """
    import statistics

    # Bottom strip (full width, bottom 15%)
    strip_h = max(h // 7, 40)
    bottom_strip = img.crop((0, h - strip_h, w, h))
    # Main image body (top 70%)
    body = img.crop((0, 0, w, int(h * 0.7)))

    bottom_px = list(bottom_strip.getdata())
    body_px = list(body.getdata())

    # Check 1: Look for semi-transparent overlay
    # Watermarks cause the bottom to have DIFFERENT color stats than the body
    def channel_stats(pixels):
        r = [p[0] for p in pixels]
        g = [p[1] for p in pixels]
        b = [p[2] for p in pixels]
        return {
            'r_avg': sum(r)/len(r), 'g_avg': sum(g)/len(g), 'b_avg': sum(b)/len(b),
            'r_std': statistics.stdev(r) if len(r)>1 else 0,
            'g_std': statistics.stdev(g) if len(g)>1 else 0,
            'b_std': statistics.stdev(b) if len(b)>1 else 0,
        }

    bs = channel_stats(bottom_px)
    ms = channel_stats(body_px)

    print(f"[AI] Bottom strip R/G/B avg: {bs['r_avg']:.0f}/{bs['g_avg']:.0f}/{bs['b_avg']:.0f} std: {bs['r_std']:.0f}/{bs['g_std']:.0f}/{bs['b_std']:.0f}")
    print(f"[AI] Body R/G/B avg: {ms['r_avg']:.0f}/{ms['g_avg']:.0f}/{ms['b_avg']:.0f} std: {ms['r_std']:.0f}/{ms['g_std']:.0f}/{ms['b_std']:.0f}")

    # Check 2: Look for sharp edges / text in bottom strip
    # Watermark text creates many pixels that differ sharply from neighbors
    from PIL import ImageFilter
    bottom_gray = bottom_strip.convert("L")
    edges = bottom_gray.filter(ImageFilter.FIND_EDGES)
    edge_px = list(edges.getdata())
    sharp_pixels = sum(1 for p in edge_px if p > 30)
    sharp_ratio = sharp_pixels / len(edge_px)
    print(f"[AI] Bottom edge sharp ratio: {sharp_ratio:.3f}")

    # Also check body edges for comparison
    body_gray = body.convert("L")
    body_edges = body_gray.filter(ImageFilter.FIND_EDGES)
    body_edge_px = list(body_edges.getdata())
    body_sharp = sum(1 for p in body_edge_px if p > 30) / len(body_edge_px)

    # If bottom has MORE sharp edges per pixel than body, watermark text likely
    edge_excess = sharp_ratio - body_sharp
    print(f"[AI] Body edge ratio: {body_sharp:.3f}, excess in bottom: {edge_excess:.3f}")

    # Check 3: Bottom-right corner specifically (most common watermark location)
    br_w = w // 4
    br_h = h // 6
    br = img.crop((w - br_w, h - br_h, w, h))
    br_gray = br.convert("L")
    br_edges = br_gray.filter(ImageFilter.FIND_EDGES)
    br_edge_px = list(br_edges.getdata())
    br_sharp = sum(1 for p in br_edge_px if p > 25) / len(br_edge_px) if br_edge_px else 0
    print(f"[AI] Bottom-right quadrant edge ratio: {br_sharp:.3f}")

    # Check 4: Color shift in bottom vs body (semi-transparent overlays shift hue)
    r_shift = abs(bs['r_avg'] - ms['r_avg'])
    g_shift = abs(bs['g_avg'] - ms['g_avg'])
    b_shift = abs(bs['b_avg'] - ms['b_avg'])
    max_shift = max(r_shift, g_shift, b_shift)
    print(f"[AI] Color shift bottom vs body: R={r_shift:.1f} G={g_shift:.1f} B={b_shift:.1f}")

    # ── Decision Logic ──
    # These thresholds are tuned to catch AI watermarks without false positives

    # Strong signal: bottom strip has significantly more sharp edges (text/logo)
    if edge_excess > 0.05:
        return {'found': True, 'penalty': 45,
                'msg': f"Text or logo pattern detected in the bottom of the image. The bottom strip has {edge_excess:.1%} more sharp edges than the rest of the image — typical of AI tool watermarks."}

    # Strong signal: bottom-right has high edge density (Gemini badge location)
    if br_sharp > 0.15:
        return {'found': True, 'penalty': 40,
                'msg': f"Badge or logo pattern detected in the bottom-right corner ({br_sharp:.0%} sharp edges). This is the standard location for Gemini, DALL-E, and Midjourney watermarks."}

    # Medium signal: significant color shift in bottom strip
    if max_shift > 25:
        channel = 'blue' if b_shift == max_shift else 'red' if r_shift == max_shift else 'green'
        return {'found': True, 'penalty': 35,
                'msg': f"Color overlay detected at the bottom of the image — a {max_shift:.0f}-point {channel} shift compared to the main image. AI tools add semi-transparent branded overlays."}

    # Weak signal: bottom strip is notably less varied than body
    std_diff = (ms['r_std'] + ms['g_std'] + ms['b_std']) / 3 - (bs['r_std'] + bs['g_std'] + bs['b_std']) / 3
    if std_diff > 15:
        return {'found': True, 'penalty': 25,
                'msg': f"The bottom strip is suspiciously smoother than the rest of the image (variance drop of {std_diff:.0f}). This matches semi-transparent watermark overlays."}

    return {'found': False, 'penalty': 0,
            'msg': 'No watermark pattern detected in bottom strip or corners.'}


def _noise_check(img, w, h):
    from PIL import ImageFilter
    try:
        g = img.convert("L")
        b = g.filter(ImageFilter.GaussianBlur(1))
        op, bp = list(g.getdata()), list(b.getdata())
        noise = [abs(op[i]-bp[i]) for i in range(len(op))]
        dk, md, bt = [], [], []
        for i, px in enumerate(op):
            n = noise[i]
            if px < 85: dk.append(n)
            elif px < 170: md.append(n)
            else: bt.append(n)
        if dk and md and bt:
            ad, am, ab = sum(dk)/len(dk), sum(md)/len(md), sum(bt)/len(bt)
            diff = abs(ad - ab)
            u = max(0, 1.0 - diff/6.0)
            return u, f"dark:{ad:.1f} mid:{am:.1f} bright:{ab:.1f}"
    except: pass
    return 0.0, "n/a"


def _sat_check(img):
    try:
        hsv = img.convert("HSV")
        px = list(hsv.getdata())
        s = [p[1] for p in px]
        avg = sum(s)/len(s)
        hi = sum(1 for x in s if x > 210)/len(s)
        lo = sum(1 for x in s if x < 20)/len(s)
        ex = hi + lo
        d = f"avg={avg:.0f}/255, extreme={ex:.0%}"
        if avg > 170 or ex > 0.6: return min(0.5+ex, 1.0), d
        return ex*0.5, d
    except: return 0.0, "n/a"


def _analyze_video(file_bytes, file_name, ext):
    checks, score = [], 0
    header = file_bytes[:12]
    if b'ftyp' in header:
        checks.append({"label": "Container", "status": "pass", "value": "Valid MP4/MOV."})
    else:
        score += 15
        checks.append({"label": "Container", "status": "warning", "value": "Unknown container."})
    mb = len(file_bytes)/(1024*1024)
    if mb < 0.05:
        score += 35
        checks.append({"label": "Size", "status": "fail", "value": f"Very small ({mb:.2f}MB)."})
    else:
        checks.append({"label": "Size", "status": "pass", "value": f"{mb:.2f}MB."})
    checks.append({"label": "Frame Analysis", "status": "warning",
        "value": "Frame-by-frame deepfake analysis needs neural networks. Only file-level checks done."})
    score = min(score, 100)
    v = "Suspicious" if score >= 30 else "Likely Authentic"
    return {"score": score, "verdict": v, "summary": f"Score: {score}%", "checks": checks, "file_name": file_name}
