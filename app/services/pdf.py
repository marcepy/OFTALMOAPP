from io import BytesIO

def generate_simple_pdf_bytes(title: str, body: str) -> bytes:
    # Placeholder minimalista: devolvemos "bytes" como si fuera PDF.
    # Luego lo reemplazamos por ReportLab/WeasyPrint según quieras.
    fake = f"{title}\n\n{body}\n".encode("utf-8")
    return fake
