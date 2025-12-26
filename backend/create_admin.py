from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()
email = "demo@oftalmoapp.com"
pw = "admin1234"

if not db.query(User).filter(User.email == email).first():
    u = User(email=email, full_name="Admin", role="admin", hashed_password=hash_password(pw))
    db.add(u)
    db.commit()
    print("Created:", email, pw)
else:
    print("Admin already exists")
db.close()
