import pdfplumber
import re
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        import io
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            raw_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    raw_text += text + "\n"

        if not raw_text.strip():
            raise ValueError("No text found in PDF. It may be a scanned image.")

        cleaned = normalize_text(raw_text)
        logger.info(f"PDF parsed successfully. Characters extracted: {len(cleaned)}")
        return cleaned

    except ValueError as e:
        logger.error(f"PDF parsing failed: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during PDF parsing: {e}")
        raise ValueError("Failed to parse PDF. Please upload a valid resume.")


def normalize_text(text: str) -> str:
    # Fix broken line breaks
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    # Collapse multiple spaces
    text = re.sub(r' +', ' ', text)
    # Collapse multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Strip leading/trailing whitespace
    text = text.strip()
    return text
