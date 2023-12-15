from django.shortcuts import render, redirect
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

def get_user_info(access_token):
    user_url = settings.GITHUB_USER_URL
    headers = {'Authorization': f'token {access_token}'}

    response = requests.get(user_url, headers=headers)
    response_json = response.json()

    if 'message' in response_json and response_json['message'] == 'Bad credentials':
        return HttpResponseRedirect('/')
    
    return {'user_name': response_json.get('login'), 'profile_url': response_json.get('html_url'), 'avatar_url': response_json.get('avatar_url')}

def authenticate(request):
    client_id = settings.GITHUB_CLIENT_ID
    callback_url = settings.GITHUB_CALLBACK_URL
    
    github_oauth_url = f'https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={callback_url}'
    
    return HttpResponseRedirect(github_oauth_url)

def callback(request):
    code = request.GET.get('code')
    access_token = get_access_token(code)
    user_info = get_user_info(access_token)

    if user_info is not None:
        if all(key in user_info for key in ['user_name', 'profile_url', 'avatar_url']):
            # unpack
            username = user_info['user_name']
            profile_url = user_info['profile_url']
            avatar_url = user_info['avatar_url']

            return render(request, 'callback.html', {'username': username, 'profile_url': profile_url, 'avatar_url': avatar_url})
    else:
        return redirect('authenticate')

    return redirect('authenticate')

def home_page(request):
    return render(request, 'home.html')

def revoked_view(request):
    return render(request, 'revoked.html')