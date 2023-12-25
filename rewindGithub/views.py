from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.conf import settings
import requests, json, datetime
from datetime import datetime, timedelta

# environment variables
from django.conf import settings

# takes code as a par and returns the access token
def get_access_token(code):
    access_token_url = settings.GITHUB_ACCESS_TOKEN_URL
    headers = {
        'Accept': 'application/json',
        'User-Agent': 'Rewind'       
        }
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

# takes the access token as a parameter and retrieves the user info
def get_user_info(access_token):
    user_url = settings.GITHUB_USER_URL
    headers = {'Authorization': f'token {access_token}',
               'User-Agent': 'Rewind'}

    # creating a GET request to github APIs user endpoint
    response = requests.get(user_url, headers=headers)
    response_json = response.json()

    if 'message' in response_json and response_json['message'] == 'Bad credentials':
        return HttpResponseRedirect('/')
    
    # return a dictionary of user info
    return {'user_name': response_json.get('login'), 'profile_url': response_json.get('html_url'), 'avatar_url': response_json.get('avatar_url')}

def authenticate(request):
    client_id = settings.GITHUB_CLIENT_ID
    callback_url = settings.GITHUB_CALLBACK_URL
    
    github_oauth_url = f'https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={callback_url}'
    
    # this makes a request using the client ID to the github oauth url
    return HttpResponseRedirect(github_oauth_url)

def callback(request):
    # this code is used to exchange with an access token
    code = request.GET.get('code')
    access_token = get_access_token(code)

    # get user info
    user_info = get_user_info(access_token)

    if user_info is not None:
        if all(key in user_info for key in ['user_name', 'profile_url', 'avatar_url']):
            # unpack
            username = user_info['user_name']
            profile_url = user_info['profile_url']
            avatar_url = user_info['avatar_url']

            # get total commits
            total_commits = get_total_commits(access_token)

            # get starred repos count
            starred_repos_count = get_starred_repos_count(access_token)

            total_days, created_date = get_twitter_account_info(access_token)

            # get user repos
            repos = get_user_repos(access_token)
            if repos is not None:
                top_langs = get_top_langs(repos, access_token)
                return render(request, 'callback.html', {'username': username, 'profile_url': profile_url, 'avatar_url': avatar_url, 'repos': repos, 'top_langs': top_langs, 'total_commits': total_commits, 'starred': starred_repos_count, 'totalDays': total_days, 'createdDate': created_date })
            else:
                return render(request, 'callback.html', {'username': username, 'profile_url': profile_url, 'avatar_url': avatar_url, 'total_commits': total_commits, 'starred': starred_repos_count, 'totalDays': total_days, 'createdDate': created_date})
    else:
        return redirect('authenticate')

    return redirect('authenticate')

# renders the home page
def home_page(request):
    return render(request, 'home.html')

# renders the revoked user page
def revoked_view(request):
    return render(request, 'revoked.html')

# to get the users repo info
def get_user_repos(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'User-Agent': 'Rewind',
        'Accept': 'application/vnd.github.v3+json'
    }
    url = settings.GITHUB_USER_URL + '/repos'

    # amking a get request to the /repos endpoint
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        repos = response.json()
        return repos
    else:
        return None

def get_top_langs(repos, access_token):
    langs = {}

    for repo in repos:
        owner = repo['owner']['login']
        repo_name = repo['name']
        repo_url = f'https://api.github.com/repos/{owner}/{repo_name}'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'User-Agent': 'Rewind',
            'Accept': 'application/vnd.github.v3+json'
        }

        # Get request to the repository endpoint
        response = requests.get(repo_url, headers=headers)

        if response.status_code == 200:
            repo_info = response.json()
            
            # Check if the repository was created in the last year
            created_at = datetime.strptime(repo_info['created_at'], '%Y-%m-%dT%H:%M:%SZ')
            one_year_ago = datetime.now() - timedelta(days=365)

            if created_at >= one_year_ago:
                lang = repo_info['language']
                lang = purify(lang)
                
                if lang:
                    if lang in langs:
                        langs[lang] += 1
                    else:
                        langs[lang] = 1

    # Sort in reverse order
    sorted_langs = sorted(langs.items(), key=lambda x: x[1], reverse=True)
    top_3 = sorted_langs[:3]

    return top_3

# making the lang names compatible with devicons nomenclature
def purify(l):
    if l == "C++":
        l = "cplusplus"
        return l
    elif l == "C#":
        l = "csharp"
        return l
    elif l == "Jupyter Notebook":
        l = "jupyter"
        return l
    elif l == "Objective-C":
        l = "objectivec"
        return l
    elif l == "Shell":
        l = "bash"
        return l
    elif l == "Visual Basic .NET":
        l = "vbnet"
        return l
    elif l == "Vim script":
        l = "vim"
        return l
    elif l == "Dockerfile":
        l = "docker"
        return l
    elif l == "HTML":
        l = "html5"
        return l
    elif l == "CSS":
        l = "css3"
        return l
    elif l == "SCSS":
        l = "sass"
        return l
    else:
        return l
    
def get_total_commits(access_token):
    current_date = datetime.datetime.now().date()
    one_year_ago = current_date - datetime.timedelta(days=365)

    current_date_str = current_date.strftime("%Y-%m-%d")
    one_year_ago_str = one_year_ago.strftime("%Y-%m-%d")

    url = f"https://api.github.com/user/repos?per_page=100&sort=created&direction=desc&access_token={access_token}"
    response = requests.get(url)
    repos = response.json()

    total_commits = 0

    for repo in repos:
        repo_name = repo["name"]
        repo_url = repo["url"]

        commits_url = f"{repo_url}/commits?since={one_year_ago_str}&until={current_date_str}&access_token={access_token}"
        commits_response = requests.get(commits_url)
        commits = commits_response.json()

        total_commits += len(commits)

    return total_commits

def get_starred_repos_count(access_token):
    url = f"https://api.github.com/user/starred?access_token={access_token}"
    response = requests.get(url)
    starred_repos = response.json()
    starred_repos_count = len(starred_repos)

    return starred_repos_count

def get_twitter_account_info(access_token):
    url = f"https://api.github.com/user?access_token={access_token}"
    response = requests.get(url)
    user_info = response.json()

    twitter_username = user_info.get("twitter_username")

    if twitter_username:
        twitter_url = f"https://api.twitter.com/1.1/users/show.json?screen_name={twitter_username}"
        twitter_response = requests.get(twitter_url)
        twitter_info = twitter_response.json()

        created_at = twitter_info.get("created_at")

        if created_at:
            created_date = datetime.strptime(created_at, "%a %b %d %H:%M:%S %z %Y").date()
            current_date = datetime.now().date()
            total_days = (current_date - created_date).days

            return total_days, created_date

    return None, None