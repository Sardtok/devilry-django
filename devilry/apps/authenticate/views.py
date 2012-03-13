from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django import http
from django.core.urlresolvers import reverse
from django.conf import settings
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _


def logout(request):
    auth.logout(request)
    return http.HttpResponseRedirect(reverse('login'))


class LoginForm(forms.Form):
    username = forms.CharField(label=_("Username"))
    next = forms.CharField(widget=forms.HiddenInput,
            required=False)
    password = forms.CharField(label=_("Password"), widget=forms.PasswordInput)

class RegisterForm(UserCreationForm):
    email = forms.EmailField()

def login(request):
    login_failed = False
    if request.POST:
        form = LoginForm(request.POST)
        if form.is_valid():
            user = auth.authenticate(username=form.cleaned_data['username'],
                                     password=form.cleaned_data['password'])
            if user is not None:
                if user.is_active:
                    auth.login(request, user)
                    next = form.cleaned_data.get('next') or \
                            settings.DEVILRY_URLPATH_PREFIX or '/'
                    return http.HttpResponseRedirect(next)
                else:
                    return http.HttpResponseForbidden("Account is not active")
            else:
                login_failed = True
    else:
        form = LoginForm(initial={'next': request.GET.get('next')})
    return render(request,
                  'authenticate/login.django.html',
                  {'form': form,
                   'login_failed': login_failed,
                   'register': False})

def register(request):
    login_failed = False
    if request.POST:
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = auth.models.User.objects.create_user(form.cleaned_data['username'],
                                                        form.cleaned_data['email'],
                                                        form.cleaned_data['password1'])
            
            user = auth.authenticate(username=form.cleaned_data['username'],
                                     password=form.cleaned_data['password1'])
            auth.login(request, user)
            next = form.cleaned_data.get('next') or \
                   settings.DEVILRY_URLPATH_PREFIX or '/'
            return http.HttpResponseRedirect(next)
        elif request.POST.get('registerlink') is not None:
            print "WAHOOO!"
            form = RegisterForm(initial={'next': request.GET.get('next')})
    else:
        form = RegisterForm(initial={'next': request.GET.get('next')})
    return render(request,
                  'authenticate/login.django.html',
                  {'form': form,
                   'login_failed': login_failed,
                   'register': True})
