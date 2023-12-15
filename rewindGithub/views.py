from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.conf import settings
import requests
import json

# environment variables
from django.conf import settings


def get_access_token(code):
    access_token_url = settings.GITHUB_ACCESS_TOKEN_URL
    headers = {'Accept': 'application/json'}
    data = {
        'client_id': settings.GITHUB_CLIENT_ID,
        'client_secret': settings.GITHUB_CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.GITHUB_CALLBACK_URL
    }

    response = requests.post(access_token_url, headers=headers, data=data)
    response_json = response.json()
    access_token = response_json.get('access_token')
    return access_token

def get_username(access_token):
    user_url = settings.GITHUB_USER_URL
    headers = {'Authorization': f'token {access_token}'}

    response = requests.get(user_url, headers=headers)
    response_json = response.json()

    if 'message' in response_json and response_json['message'] == 'Bad credentials':
        return HttpResponseRedirect('/')

    username = response_json.get('login')
    return username

def authenticate(request):
    client_id = 'c33d10cbd027033fc046'
    callback_url = 'http://localhost:8000/callback/'
    
    github_oauth_url = f'https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={callback_url}'
    
    return HttpResponseRedirect(github_oauth_url)

def callback(request):
    code = request.GET.get('code')
    access_token = get_access_token(code)
    username = get_username(access_token)

    if isinstance(username, HttpResponseRedirect):
        return username

    return render(request, 'callback.html', {'username': username})

def home_page(request):
    return render(request, 'home.html')

# handling revoked user
def revoked_view(request):
    return render(request, 'revoked.html')