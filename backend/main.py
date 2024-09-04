from fastapi import FastAPI, UploadFile, File, Request
import aiomysql
import bcrypt
from fastapi import FastAPI, HTTPException, Depends
from aiomysql import Pool, create_pool
from typing import Dict
import os
from secrets import token_hex
import json
#import main  # Assuming you have a main.py file with prepare_file and get_response_from_query functions
from fastapi.middleware.cors import CORSMiddleware
import time
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from util import check_for_failure,update_dictionaries,update_pass_dict
from glob import glob
import jwt
from datetime import datetime, timedelta
global file_path

# Aman DB connection start
DATABASE_CONFIG = {
    'host': '52.52.84.164',
    'port': 3306,
    'user': 'spanidea',
    'password': '9W]45d5Kzs>5',
    'db': 'span_subscription',
    'autocommit': True,
}

# Aman DB connection end


# JWT methods {AMAN}
SECRET_KEY = "Tutor/Melodi-APIs@SPANIDEA"  

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
# JWT methods {AMAN}

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Aman DB connection start
async def get_db_pool():
    return await create_pool(**DATABASE_CONFIG)

async def get_db_connection(db_pool: Pool = Depends(get_db_pool)):
    async with db_pool.acquire() as connection:
        yield connection
# Aman DB connection end


def remove_all_files_from_folder(folder_path: str):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            os.unlink(file_path)
UPLOAD_DIR = "uploads/"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.get("/update-pass-dictionary")
async def update_pass_dictionary():
    t=update_pass_dict('uploads')
    print("This is the returned Value : ",t,type(t))
    if t:
        return JSONResponse(content={"update": 1})
    else:
        return "not updated"

@app.post("/upload_multiple_files")
async def upload_multiple_files(files: list[UploadFile] = File(...)):
    for file in files:
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_location, "wb") as f:
            f.write(file.file.read())

    return JSONResponse(content={"message": "Files uploaded successfully"})

@app.post('/upload_pdf_file')
async def upload(file: UploadFile = File(...)):
    file_ext = file.filename.split(".").pop()
    global file_path
    file_name = token_hex(10)
    file_path = f"data/{file_name}.{file_ext}"
    if len(os.listdir('data')) >= 0:
        remove_all_files_from_folder('data/')
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    # main.prepare_file()
    # main.MESSAGES = []
    # print("this")
    return {"INFO": True}

@app.post("/chat")
async def chat_func(request: Request):
    data = await request.body()
    data = data.decode("utf-8")
    data_str = json.loads(data)['message']
    global file_path
    print(file_path)
    t=update_dictionaries(file_path)
    if t:
        return check_for_failure(file_path)


    #print(data_str)
   # response = main.get_response_from_query(data_str, main.collection, main.CHUNKS)
    else:
        return { " Failure_line": 90,
    "non_failure line ":90,
    "path_to_HTML_file":'test.html'
    }
@app.post("/analyze_file")
async def analyze_file(file: UploadFile = File(...)):
    # Here you would include the logic to analyze the uploaded file
    global file_path
    t=update_dictionaries(file_path)
    if t:
        return check_for_failure(file_path)


    #print(data_str)
   # response = main.get_response_from_query(data_str, main.collection, main.CHUNKS)
    else:
        return { " Failure_line": 90,
    "non_failure line ":90,
    "path_to_HTML_file":'test.html'
    }


# Aman's Auth code started here    

@app.post("/register")
async def register(request: Request, db: aiomysql.Connection = Depends(get_db_connection)):
    try:
        data = await request.json()
        UserId = data.get("UserId")
        password = data.get("password")
        ClientID = data.get("ClientID")

        if not UserId or not password:
            return JSONResponse(content={"error": "UserId and password are required"}, status_code=400)

        # converting password to array of bytes 
        byte = password.encode('utf-8') 
        
        # generating the salt 
        salt = bcrypt.gensalt() 
        
        # Hashing the password 
        hashed_password = bcrypt.hashpw(byte, salt) 

        async with db.cursor() as cursor:
            # Check if the UserId already exists

            await cursor.execute("SELECT `UID` FROM `User` WHERE UserId=%s", (UserId,))
            user = await cursor.fetchone()
            if user:
                return JSONResponse(content={"error": "Username already taken"}, status_code=400)
            print(hashed_password)
            # Insert the new user into the database
            await cursor.execute("INSERT INTO `User` (`UserId`, `Password`, `ClientID`) VALUES (%s, %s, %s)", (UserId, hashed_password, ClientID))
            await db.commit()

        return JSONResponse(content={"message": "User registered successfully"}, status_code=201)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        db.close()

@app.post("/login")
async def login(request: Request, db: aiomysql.Connection = Depends(get_db_connection)):
    try:
        data = await request.json()
        user_id = data.get("UserId")
        password = data.get("password")

        userBytes = password.encode('utf-8') 
    
        if not user_id or not password:
            return JSONResponse(content={"error": "UserId and password are required"}, status_code=400)

        async with db.cursor() as cursor:
            # Fetch user by user_id (assuming it's the same as username)
            query_to_get_user = """
                SELECT `UID`, `UserID`, `Password`, `ClientID` FROM `User` WHERE `UserId` = %s
            """
            await cursor.execute(query_to_get_user, (user_id,))
            user = await cursor.fetchone()

            if not user:
                return JSONResponse(content={"error": "User not found"}, status_code=404)

            column_names = [desc[0] for desc in cursor.description]
            user = dict(zip(column_names, user))
            
            hashed_password = user['Password']

            is_password_match = bcrypt.checkpw(userBytes, hashed_password.encode('utf-8') ) 

            # # Check if the provided password matches the hashed password
            if not is_password_match:
                return JSONResponse(content={"error": "Invalid credentials"}, status_code=401)

            ClientID = user['ClientID']

            query_to_get_subscription = """
                SELECT * FROM `Subscription` where `ClientID` = %s AND `endDate` >= %s
            """
            today_date = datetime.today().strftime('%Y-%m-%d')
            await cursor.execute(query_to_get_subscription, (ClientID, today_date))
            subscription = await cursor.fetchone()

            if not subscription:
                return JSONResponse(content={"error": "subscription not found"}, status_code=404)

            subscription_column_names = [desc[0] for desc in cursor.description]
            subscription = dict(zip(subscription_column_names, subscription))

            token_data = {"UID": user['UID'], "UserID": user["UserID"], "ClientID": user["ClientID"]}  # Example payload
            token = create_access_token(token_data, timedelta(days=2))
       
        return JSONResponse(content={"message": "Login successful", "token": token}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        db.close()

#Auth ended here

@app.get("/test.html")
async def get_test_html():
    with open("../test.html", "r") as file:
        html_content = file.read()
    return FileResponse(html_content)


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000,reload=True)
