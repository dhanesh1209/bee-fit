from flask import (
    Flask,
    request,
    make_response,
    redirect,
    jsonify,
    render_template,
)
import logging
import pandas as pd
from models import Base, engine, User
from sqlalchemy import select, insert, update, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from logging.handlers import RotatingFileHandler
from prediction import predict_level

app = Flask(__name__, static_folder="static")

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Set up a rotating log handler
handler = RotatingFileHandler("app.log", maxBytes=10000, backupCount=1)
handler.setLevel(logging.DEBUG)
logger.addHandler(handler)

# Setup the database engine
Base.metadata.bind = engine
# Create all tables
Base.metadata.create_all(engine)
# Create a session factory, bound to the engine
SessionFactory = sessionmaker(bind=engine)


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"csv", "xlsx"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload-file", methods=["POST"])
def upload_file():
    # Check if the post request has the file part
    if "file" not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files["file"]

    # If user does not select file, browser also
    # submits an empty part without filename
    if file.filename == "":
        return jsonify({"error": "No selected file"})

    # Check if the file is one of the allowed types/extensions
    if file and allowed_file(file.filename):
        # Read the file into a Pandas DataFrame
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(file)

        # Process the DataFrame as needed
        # For example, convert DataFrame to JSON
        # Tailor this to match the structure of your DataFrame and the needs of your form
        json_data = df.to_json(orient="records")

        # Return the JSON data
        return jsonify(json_data)

    return jsonify({"error": "Invalid file format"})


@app.route("/submit-form", methods=["POST"])
def submit_form():
    try:
        session = None  # Initialize session variable
        session = SessionFactory()  # Create a new session

        data = request.json
        logger.debug("Received Data: %s", data)

        if not data:
            raise ValueError("No data received")

        # Check if data is a dictionary
        if not isinstance(data, dict):
            raise ValueError("Received data is not a valid JSON object")

        user = User(**data)
        session.merge(user)
        session.commit()

        logger.debug(user.to_dict())

        message = "Data processed successfully"
        logger.debug(message)
    except ValueError as ve:
        logger.error("Validation Error: %s", ve)
        if session:
            session.rollback()
        return jsonify({"error": str(ve)}), 400
    except SQLAlchemyError as e:
        if session:
            session.rollback()
        logger.error("SQLAlchemy Error: %s", e)
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        if session:
            session.rollback()
        logger.error("Exception: %s", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if session:
            session.close()
        logger.debug("Session closed")

        user_data = user.to_dict()

        resp = make_response(jsonify({"user": user_data, "message": message}))
        resp.set_cookie(
            "Patient_Registration_Number", user_data["Patient_Registration_Number"]
        )
    return resp


@app.route("/update-score", methods=["POST"])
def update_score():
    try:
        session = None  # Initialize session variable
        session = SessionFactory()  # Create a new session

        data = request.json

        if not data:
            raise ValueError("No data received")

        # Check if data is a dictionary
        if not isinstance(data, dict):
            raise ValueError("Received data is not a valid JSON object")

        logger.debug(data)

        prn = request.cookies.get("Patient_Registration_Number")
        logger.debug("PRN: %s", prn)

        if not prn:
            raise ValueError("User not found")

        stmt = select(User).where(User.Patient_Registration_Number == prn)
        user = session.execute(stmt).scalar_one()

        if not user:
            raise ValueError("User not found")

        if user.Height_Score < data["score"]:
            stmt = (
                update(User)
                .where(
                    User.Patient_Registration_Number == user.Patient_Registration_Number
                )
                .values(Height_Score=data["score"])
            )
            with engine.connect() as conn:
                conn.execute(stmt)
                conn.commit()

        logger.debug(user.to_dict())

        message = "Score updated successfully"
    except ValueError as ve:
        logger.error("Validation Error: %s", ve)
        if session:
            session.rollback()
        return jsonify({"error": str(ve)}), 400
    except SQLAlchemyError as e:
        if session:
            session.rollback()
        logger.error("SQLAlchemy Error: %s", e)
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        if session:
            session.rollback()
        logger.error("Exception: %s", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if session:
            session.close()
        logger.debug("Session closed")

    return jsonify({"message": message})


@app.route("/")
def index():
    # Render the 'index.html' template
    return render_template("index.html")


@app.route("/hm-form")
def hmform():
    # Render the 'index.html' template
    return render_template("hmform.html")


@app.route("/game")
def game():
    try:
        session = None  # Initialize session variable
        session = SessionFactory()  # Create a new session
        prn = request.cookies.get("Patient_Registration_Number")
        logger.debug("PRN: %s", prn)
        if not prn:
            raise
        stmt = select(User).where(User.Patient_Registration_Number == prn)
        user = session.scalars(stmt).one()
        if not user:
            raise
    except Exception as e:
        if session:
            session.rollback()
        logger.error("Exception: %s", e)
        return redirect("/hm-form")
    finally:
        if session:
            session.close()
        logger.debug("Session closed")

    level = predict_level(user.to_dict())
    logger.debug("Level: %s", level)
    response = render_template("game.html", level=level)
    return response


@app.route("/leaderboard")
def leaderboard():
    try:
        session = None  # Initialize session variable
        session = SessionFactory()  # Create a new session
        users = []
        stmt = (
            select(
                User.Patient_Registration_Number,
                User.Education_level,
                User.Height_Score,
            )
            .order_by(User.Height_Score.desc())
            .limit(5)
        )
        with engine.connect() as conn:
            users = conn.execute(stmt).fetchall()
            for user in users:
                logger.debug(user)

    except Exception as e:
        if session:
            session.rollback()
        logger.error("Exception: %s", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if session:
            session.close()
        logger.debug("Session closed")

    response = render_template("leaderboard.html", users=users)
    return response


@app.route("/instructions")
def instructions():
    response = render_template("instructions.html")
    return response


@app.route("/ranking")
def ranking():
    try:
        session = None  # Initialize session variable
        session = SessionFactory()  # Create a new session
        users = []
        stmt = (
            select(
                User.Patient_Registration_Number,
                User.Height_Score,
            )
            .order_by(User.Height_Score.desc())
            .limit(5)
        )
        with engine.connect() as conn:
            users = conn.execute(stmt).fetchall()
            for user in users:
                logger.debug(user)

        users = [
            {"user_id": user.Patient_Registration_Number, "score": user.Height_Score}
            for user in users
        ]

    except Exception as e:
        if session:
            session.rollback()
        logger.error("Exception: %s", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if session:
            session.close()
        logger.debug("Session closed")

    return jsonify({"users": users})


if __name__ == "__main__":
    logger.debug("Starting Flask app")
    app.run(debug=True)
