"""
Real Metadata Extractor & Forensics Analyzer
Extracts actual EXIF, PDF info, and file metadata from uploaded files.
Supports: Images (JPG, PNG, WebP, TIFF), PDFs, Videos, and generic files.
"""

import os
import struct
from datetime import datetime
from io import BytesIO

# ─── EXIF Tag Dictionary (Human-readable names) ────────────────────
EXIF_TAG_NAMES = {
    0x010F: "Camera Make",
    0x0110: "Camera Model",
    0x0112: "Orientation",
    0x011A: "X Resolution",
    0x011B: "Y Resolution",
    0x0128: "Resolution Unit",
    0x0131: "Software",
    0x0132: "Date/Time",
    0x013B: "Artist",
    0x8298: "Copyright",
    0x829A: "Exposure Time",
    0x829D: "F-Number",
    0x8822: "Exposure Program",
    0x8827: "ISO Speed",
    0x9000: "EXIF Version",
    0x9003: "Date Taken",
    0x9004: "Date Digitized",
    0x920A: "Focal Length",
    0xA001: "Color Space",
    0xA002: "Image Width",
    0xA003: "Image Height",
    0xA405: "Focal Length (35mm)",
    0xA430: "Camera Owner",
    0xA431: "Camera Serial Number",
    0xA432: "Lens Info",
    0xA433: "Lens Make",
    0xA434: "Lens Model",
}

GPS_TAG_NAMES = {
    0x0001: "Latitude Ref",
    0x0002: "Latitude",
    0x0003: "Longitude Ref",
    0x0004: "Longitude",
    0x0005: "Altitude Ref",
    0x0006: "Altitude",
}


def _convert_gps_coord(coord_tuple, ref):
    """Convert GPS EXIF tuple to decimal degrees."""
    try:
        degrees = float(coord_tuple[0])
        minutes = float(coord_tuple[1])
        seconds = float(coord_tuple[2])
        decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
        if ref in ('S', 'W'):
            decimal = -decimal
        return round(decimal, 6)
    except Exception:
        return None


def analyze_metadata_from_bytes(file_bytes: bytes, file_name: str) -> dict:
    """
    Main entry point — accepts raw file bytes and filename.
    Routes to the correct extractor based on file extension.
    """
    ext = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else ''
    file_size = len(file_bytes)

    # Common file info that every scan includes
    file_info = {
        "file_name": file_name,
        "file_size": _format_size(file_size),
        "file_type": ext.upper() or "Unknown",
    }

    if ext in ('jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'gif'):
        return _analyze_image(file_bytes, file_info, ext)
    elif ext == 'pdf':
        return _analyze_pdf(file_bytes, file_info)
    elif ext in ('mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'):
        return _analyze_video(file_bytes, file_info, ext)
    elif ext in ('mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'):
        return _analyze_audio(file_bytes, file_info, ext)
    else:
        return _analyze_generic(file_bytes, file_info, ext)


def _format_size(size_bytes):
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"


# ═══════════════════════════════════════════════════════════════
#  IMAGE ANALYSIS (Real EXIF Extraction using Pillow)
# ═══════════════════════════════════════════════════════════════
def _analyze_image(file_bytes, file_info, ext):
    from PIL import Image
    from PIL.ExifTags import TAGS, GPSTAGS

    checks = []
    score = 0
    extracted_metadata = []
    gps_info = None

    try:
        img = Image.open(BytesIO(file_bytes))

        # Basic image properties
        extracted_metadata.append({"label": "Image Size", "value": f"{img.width} x {img.height} px"})
        extracted_metadata.append({"label": "Color Mode", "value": img.mode})
        extracted_metadata.append({"label": "Format", "value": img.format or ext.upper()})

        # Extract EXIF
        exif_data = img._getexif() if hasattr(img, '_getexif') else None

        if exif_data:
            # Camera Info
            camera_make = exif_data.get(0x010F, None)
            camera_model = exif_data.get(0x0110, None)
            software = exif_data.get(0x0131, None)
            date_taken = exif_data.get(0x9003, None)
            date_modified = exif_data.get(0x0132, None)
            artist = exif_data.get(0x013B, None)
            copyright_info = exif_data.get(0x8298, None)
            iso = exif_data.get(0x8827, None)
            focal_length = exif_data.get(0x920A, None)
            exposure = exif_data.get(0x829A, None)
            f_number = exif_data.get(0x829D, None)
            lens_model = exif_data.get(0xA434, None)
            serial = exif_data.get(0xA431, None)

            if camera_make:
                extracted_metadata.append({"label": "Camera Make", "value": str(camera_make).strip()})
            if camera_model:
                extracted_metadata.append({"label": "Camera Model", "value": str(camera_model).strip()})
            if lens_model:
                extracted_metadata.append({"label": "Lens", "value": str(lens_model).strip()})
            if serial:
                extracted_metadata.append({"label": "Camera Serial #", "value": str(serial).strip()})
            if date_taken:
                extracted_metadata.append({"label": "Date Taken", "value": str(date_taken)})
            if date_modified:
                extracted_metadata.append({"label": "Last Modified", "value": str(date_modified)})
            if iso:
                extracted_metadata.append({"label": "ISO Speed", "value": str(iso)})
            if focal_length:
                try:
                    extracted_metadata.append({"label": "Focal Length", "value": f"{float(focal_length):.1f} mm"})
                except:
                    extracted_metadata.append({"label": "Focal Length", "value": str(focal_length)})
            if exposure:
                try:
                    extracted_metadata.append({"label": "Exposure Time", "value": f"1/{int(1/float(exposure))}s"})
                except:
                    extracted_metadata.append({"label": "Exposure Time", "value": str(exposure)})
            if f_number:
                try:
                    extracted_metadata.append({"label": "Aperture", "value": f"f/{float(f_number):.1f}"})
                except:
                    extracted_metadata.append({"label": "Aperture", "value": str(f_number)})
            if artist:
                extracted_metadata.append({"label": "Artist / Owner", "value": str(artist)})
            if copyright_info:
                extracted_metadata.append({"label": "Copyright", "value": str(copyright_info)})

            # Software Check (Editing detection)
            if software:
                sw = str(software).strip()
                extracted_metadata.append({"label": "Software", "value": sw})
                editing_tools = ['photoshop', 'gimp', 'lightroom', 'affinity', 'snapseed', 'canva', 'pixlr']
                if any(tool in sw.lower() for tool in editing_tools):
                    score += 35
                    checks.append({"label": "Photo Editing", "status": "fail", "value": f"Editing software detected: {sw}. This photo has been modified."})
                else:
                    checks.append({"label": "Photo Editing", "status": "pass", "value": f"Software used: {sw}. No known editing tools detected."})
            else:
                checks.append({"label": "Photo Editing", "status": "pass", "value": "No editing software was recorded in this photo."})

            # GPS Check
            gps_ifd = exif_data.get(0x8825, None)
            if gps_ifd and isinstance(gps_ifd, dict):
                lat_data = gps_ifd.get(2)
                lat_ref = gps_ifd.get(1)
                lon_data = gps_ifd.get(4)
                lon_ref = gps_ifd.get(3)

                if lat_data and lon_data:
                    lat = _convert_gps_coord(lat_data, lat_ref)
                    lon = _convert_gps_coord(lon_data, lon_ref)
                    if lat is not None and lon is not None:
                        gps_info = {"lat": lat, "lon": lon}
                        extracted_metadata.append({"label": "GPS Location", "value": f"{lat}, {lon}"})
                        checks.append({"label": "Location Data", "status": "pass", "value": f"GPS coordinates found: {lat}, {lon}"})
                    else:
                        checks.append({"label": "Location Data", "status": "warning", "value": "GPS data exists but could not be decoded."})
                        score += 10
                else:
                    checks.append({"label": "Location Data", "status": "warning", "value": "GPS tag exists but coordinates are empty — they may have been stripped."})
                    score += 15
            else:
                checks.append({"label": "Location Data", "status": "warning", "value": "No GPS location found. This could be a screenshot or the location was removed."})
                score += 10

            # Date Consistency Check
            if date_taken and date_modified:
                try:
                    dt_taken = datetime.strptime(str(date_taken), "%Y:%m:%d %H:%M:%S")
                    dt_modified = datetime.strptime(str(date_modified), "%Y:%m:%d %H:%M:%S")
                    if dt_taken > dt_modified:
                        score += 30
                        checks.append({"label": "Date Check", "status": "fail", "value": f"Date taken ({date_taken}) is AFTER date modified ({date_modified}). Dates may be faked."})
                    else:
                        checks.append({"label": "Date Check", "status": "pass", "value": "The dates are consistent and make sense."})
                except:
                    checks.append({"label": "Date Check", "status": "pass", "value": "Dates found but could not be fully compared."})
            elif date_taken:
                checks.append({"label": "Date Check", "status": "pass", "value": f"Photo was taken on: {date_taken}"})
            else:
                score += 5
                checks.append({"label": "Date Check", "status": "warning", "value": "No date information found in the photo."})

        else:
            # No EXIF at all
            score += 20
            checks.append({"label": "EXIF Data", "status": "warning", "value": "This image has NO metadata at all. It may be a screenshot, downloaded from the web, or intentionally stripped."})
            checks.append({"label": "Location Data", "status": "warning", "value": "No GPS data — no EXIF available."})
            checks.append({"label": "Photo Editing", "status": "warning", "value": "Cannot determine — no EXIF data to verify."})

    except Exception as e:
        checks.append({"label": "Image Reading", "status": "warning", "value": f"Could not fully read this image: {str(e)}"})

    # File structure check (magic bytes)
    file_check = _check_magic_bytes(file_bytes, ext)
    checks.append(file_check)
    if file_check["status"] == "fail":
        score += 25

    # Calculate verdict
    if score >= 50:
        verdict = "Tampered"
    elif score >= 20:
        verdict = "Suspicious"
    else:
        verdict = "Authentic"

    return {
        "score": min(score, 100),
        "verdict": verdict,
        "file_name": file_info["file_name"],
        "file_info": file_info,
        "extracted_metadata": extracted_metadata,
        "gps": gps_info,
        "checks": checks,
    }


# ═══════════════════════════════════════════════════════════════
#  PDF ANALYSIS (Real metadata extraction using PyPDF2)
# ═══════════════════════════════════════════════════════════════
def _analyze_pdf(file_bytes, file_info):
    from PyPDF2 import PdfReader

    checks = []
    score = 0
    extracted_metadata = []

    try:
        reader = PdfReader(BytesIO(file_bytes))
        info = reader.metadata

        num_pages = len(reader.pages)
        extracted_metadata.append({"label": "Number of Pages", "value": str(num_pages)})

        if info:
            author = info.get("/Author", None)
            creator = info.get("/Creator", None)
            producer = info.get("/Producer", None)
            title = info.get("/Title", None)
            subject = info.get("/Subject", None)
            creation_date = info.get("/CreationDate", None)
            mod_date = info.get("/ModDate", None)

            if title:
                extracted_metadata.append({"label": "Title", "value": str(title)})
            if author:
                extracted_metadata.append({"label": "Author", "value": str(author)})
            if creator:
                extracted_metadata.append({"label": "Creator App", "value": str(creator)})
            if producer:
                extracted_metadata.append({"label": "PDF Producer", "value": str(producer)})
            if subject:
                extracted_metadata.append({"label": "Subject", "value": str(subject)})
            if creation_date:
                extracted_metadata.append({"label": "Date Created", "value": str(creation_date)})
            if mod_date:
                extracted_metadata.append({"label": "Date Modified", "value": str(mod_date)})

            # Author vs Creator mismatch
            if author and creator:
                if str(author).strip().lower() != str(creator).strip().lower():
                    # This is normal for most PDFs (Word vs Adobe) so just info, not fail
                    checks.append({"label": "Document Creator", "status": "pass", "value": f"Author: '{author}', made with: '{creator}'."})
                else:
                    checks.append({"label": "Document Creator", "status": "pass", "value": f"Author and creator match: '{author}'."})
            elif author:
                checks.append({"label": "Document Creator", "status": "pass", "value": f"Author: '{author}'."})
            elif creator:
                checks.append({"label": "Document Creator", "status": "pass", "value": f"Made with: '{creator}'."})
            else:
                score += 10
                checks.append({"label": "Document Creator", "status": "warning", "value": "No author or creator information found."})

            # Date check
            if creation_date and mod_date:
                checks.append({"label": "Date Check", "status": "pass", "value": f"Created: {creation_date} | Modified: {mod_date}"})
            elif creation_date:
                checks.append({"label": "Date Check", "status": "pass", "value": f"Created: {creation_date}"})
            else:
                score += 5
                checks.append({"label": "Date Check", "status": "warning", "value": "No date information found in this PDF."})

            # Check for suspicious producer
            if producer:
                suspicious_producers = ['fake', 'crack', 'hack', 'pirate']
                if any(s in str(producer).lower() for s in suspicious_producers):
                    score += 40
                    checks.append({"label": "PDF Producer", "status": "fail", "value": f"Suspicious producer detected: '{producer}'."})
                else:
                    checks.append({"label": "PDF Producer", "status": "pass", "value": f"Producer: '{producer}'."})
        else:
            score += 15
            checks.append({"label": "PDF Metadata", "status": "warning", "value": "This PDF has no readable metadata at all."})

        # Check for encryption
        if reader.is_encrypted:
            score += 10
            checks.append({"label": "Encryption", "status": "warning", "value": "This PDF is encrypted or password-protected."})
            extracted_metadata.append({"label": "Encrypted", "value": "Yes"})
        else:
            checks.append({"label": "Encryption", "status": "pass", "value": "This PDF is not encrypted."})

    except Exception as e:
        checks.append({"label": "PDF Reading", "status": "warning", "value": f"Could not fully analyze this PDF: {str(e)}"})

    if score >= 50:
        verdict = "Tampered"
    elif score >= 15:
        verdict = "Suspicious"
    else:
        verdict = "Authentic"

    return {
        "score": min(score, 100),
        "verdict": verdict,
        "file_name": file_info["file_name"],
        "file_info": file_info,
        "extracted_metadata": extracted_metadata,
        "checks": checks,
    }


# ═══════════════════════════════════════════════════════════════
#  VIDEO ANALYSIS (Header-based extraction)
# ═══════════════════════════════════════════════════════════════
def _analyze_video(file_bytes, file_info, ext):
    checks = []
    score = 0
    extracted_metadata = []

    # Detect container format from magic bytes
    container = _detect_video_container(file_bytes)
    extracted_metadata.append({"label": "Container Format", "value": container or ext.upper()})

    # For MP4/MOV, try to read the moov atom for metadata
    if ext in ('mp4', 'mov', 'm4v') and len(file_bytes) > 8:
        mp4_meta = _extract_mp4_metadata(file_bytes)
        extracted_metadata.extend(mp4_meta.get("fields", []))
        if mp4_meta.get("has_gps"):
            checks.append({"label": "Location Data", "status": "pass", "value": "This video contains location data."})
        else:
            checks.append({"label": "Location Data", "status": "warning", "value": "No GPS data found in this video."})
            score += 5
    else:
        checks.append({"label": "Location Data", "status": "warning", "value": f"Deep metadata extraction is limited for .{ext} format."})
        score += 5

    # Magic bytes check
    file_check = _check_magic_bytes(file_bytes, ext)
    checks.append(file_check)
    if file_check["status"] == "fail":
        score += 25

    # File size reasonableness
    size_mb = len(file_bytes) / (1024 * 1024)
    extracted_metadata.append({"label": "File Size", "value": f"{size_mb:.2f} MB"})
    if size_mb < 0.01:
        score += 15
        checks.append({"label": "File Size", "status": "warning", "value": "This video is incredibly small. It could be corrupted or fake."})
    else:
        checks.append({"label": "File Size", "status": "pass", "value": f"Video size ({size_mb:.2f} MB) looks reasonable."})

    if score >= 40:
        verdict = "Suspicious"
    elif score >= 15:
        verdict = "Suspicious"
    else:
        verdict = "Authentic"

    return {
        "score": min(score, 100),
        "verdict": verdict,
        "file_name": file_info["file_name"],
        "file_info": file_info,
        "extracted_metadata": extracted_metadata,
        "checks": checks,
    }


# ═══════════════════════════════════════════════════════════════
#  AUDIO ANALYSIS
# ═══════════════════════════════════════════════════════════════
def _analyze_audio(file_bytes, file_info, ext):
    checks = []
    score = 0
    extracted_metadata = []

    extracted_metadata.append({"label": "Audio Format", "value": ext.upper()})

    # Magic bytes check
    file_check = _check_magic_bytes(file_bytes, ext)
    checks.append(file_check)
    if file_check["status"] == "fail":
        score += 25

    # MP3 ID3 tag extraction
    if ext == 'mp3' and len(file_bytes) > 128:
        id3 = _extract_id3_tags(file_bytes)
        extracted_metadata.extend(id3)
        if len(id3) > 0:
            checks.append({"label": "Audio Tags", "status": "pass", "value": f"Found {len(id3)} metadata tag(s) inside this audio file."})
        else:
            score += 5
            checks.append({"label": "Audio Tags", "status": "warning", "value": "No ID3 tags found in this MP3."})
    else:
        checks.append({"label": "Audio Tags", "status": "warning", "value": f"Tag extraction is limited for .{ext} format."})

    size_mb = len(file_bytes) / (1024 * 1024)
    extracted_metadata.append({"label": "File Size", "value": f"{size_mb:.2f} MB"})

    if score >= 30:
        verdict = "Suspicious"
    else:
        verdict = "Authentic"

    return {
        "score": min(score, 100),
        "verdict": verdict,
        "file_name": file_info["file_name"],
        "file_info": file_info,
        "extracted_metadata": extracted_metadata,
        "checks": checks,
    }


# ═══════════════════════════════════════════════════════════════
#  GENERIC FILE ANALYSIS
# ═══════════════════════════════════════════════════════════════
def _analyze_generic(file_bytes, file_info, ext):
    checks = []
    score = 0
    extracted_metadata = []

    extracted_metadata.append({"label": "File Extension", "value": f".{ext}" if ext else "None"})

    file_check = _check_magic_bytes(file_bytes, ext)
    checks.append(file_check)
    if file_check["status"] == "fail":
        score += 25

    if not ext:
        score += 10
        checks.append({"label": "File Extension", "status": "warning", "value": "This file has no extension. Be cautious."})
    else:
        checks.append({"label": "File Extension", "status": "pass", "value": f"Extension is .{ext}"})

    if score >= 25:
        verdict = "Suspicious"
    else:
        verdict = "Authentic"

    return {
        "score": min(score, 100),
        "verdict": verdict,
        "file_name": file_info["file_name"],
        "file_info": file_info,
        "extracted_metadata": extracted_metadata,
        "checks": checks,
    }


# ═══════════════════════════════════════════════════════════════
#  HELPER:  Magic Bytes Verification
# ═══════════════════════════════════════════════════════════════
MAGIC_BYTES = {
    'jpg':  [b'\xFF\xD8\xFF'],
    'jpeg': [b'\xFF\xD8\xFF'],
    'png':  [b'\x89PNG'],
    'gif':  [b'GIF87a', b'GIF89a'],
    'bmp':  [b'BM'],
    'webp': [b'RIFF'],
    'tiff': [b'II\x2A\x00', b'MM\x00\x2A'],
    'pdf':  [b'%PDF'],
    'mp4':  [b'\x00\x00\x00', b'ftyp'],
    'mov':  [b'\x00\x00\x00', b'ftyp'],
    'avi':  [b'RIFF'],
    'mkv':  [b'\x1A\x45\xDF\xA3'],
    'mp3':  [b'ID3', b'\xFF\xFB', b'\xFF\xF3', b'\xFF\xF2'],
    'wav':  [b'RIFF'],
    'ogg':  [b'OggS'],
    'flac': [b'fLaC'],
}

def _check_magic_bytes(file_bytes, ext):
    """Verify the file's actual type matches its extension."""
    if ext not in MAGIC_BYTES:
        return {"label": "File Authenticity", "status": "pass", "value": f"No magic-byte check available for .{ext} files."}

    header = file_bytes[:12]
    expected = MAGIC_BYTES[ext]
    for magic in expected:
        if magic in header:
            return {"label": "File Authenticity", "status": "pass", "value": f"The file structure matches a real .{ext} file."}

    return {"label": "File Authenticity", "status": "fail", "value": f"The file extension is .{ext} but the actual data inside does not match! This file may be disguised."}


# ═══════════════════════════════════════════════════════════════
#  HELPER: MP4 Metadata (Basic moov atom parsing)
# ═══════════════════════════════════════════════════════════════
def _extract_mp4_metadata(file_bytes):
    """Very basic MP4 atom walker to find metadata."""
    fields = []
    has_gps = False

    try:
        data = file_bytes
        i = 0
        while i < len(data) - 8 and i < 50000:  # Only scan first 50KB for speed
            size = struct.unpack('>I', data[i:i+4])[0]
            atom_type = data[i+4:i+8].decode('ascii', errors='ignore')

            if atom_type == 'ftyp':
                brand = data[i+8:i+12].decode('ascii', errors='ignore')
                fields.append({"label": "MP4 Brand", "value": brand})
            elif atom_type == 'moov':
                fields.append({"label": "Moov Atom", "value": "Found (contains video metadata)"})
            elif atom_type == 'free' or atom_type == 'mdat':
                pass  # Skip data atoms

            if size < 8:
                break
            i += size
    except:
        pass

    return {"fields": fields, "has_gps": has_gps}


# ═══════════════════════════════════════════════════════════════
#  HELPER: MP3 ID3v1 Tag Extraction
# ═══════════════════════════════════════════════════════════════
def _extract_id3_tags(file_bytes):
    """Extract ID3v1 tags from the last 128 bytes of an MP3."""
    tags = []
    try:
        tail = file_bytes[-128:]
        if tail[:3] == b'TAG':
            title = tail[3:33].decode('ascii', errors='ignore').strip('\x00').strip()
            artist = tail[33:63].decode('ascii', errors='ignore').strip('\x00').strip()
            album = tail[63:93].decode('ascii', errors='ignore').strip('\x00').strip()
            year = tail[93:97].decode('ascii', errors='ignore').strip('\x00').strip()

            if title: tags.append({"label": "Song Title", "value": title})
            if artist: tags.append({"label": "Artist", "value": artist})
            if album: tags.append({"label": "Album", "value": album})
            if year: tags.append({"label": "Year", "value": year})
    except:
        pass
    return tags


def _detect_video_container(file_bytes):
    """Detect video container format from header bytes."""
    header = file_bytes[:12]
    if b'ftyp' in header:
        brand = file_bytes[8:12].decode('ascii', errors='ignore')
        containers = {
            'isom': 'MP4 (ISO Base Media)',
            'mp41': 'MP4 v1',
            'mp42': 'MP4 v2',
            'M4V ': 'M4V (iTunes)',
            'qt  ': 'QuickTime MOV',
            'avc1': 'MP4 (H.264)',
        }
        return containers.get(brand, f"MP4 ({brand})")
    if header[:4] == b'RIFF':
        return "AVI (RIFF)"
    if header[:4] == b'\x1A\x45\xDF\xA3':
        return "Matroska (MKV/WebM)"
    return None
