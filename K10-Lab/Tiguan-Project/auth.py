import gspread
from google.oauth2 import service_account

def get_gspread_client():
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    # Ensure service_key.json is in your Tiguan-Project folder
    creds = service_account.Credentials.from_service_account_file('service_key.json', scopes=scopes)
    client = gspread.authorize(creds)
    return client
