from django.contrib import auth
from django import forms
from django import http
from django.core.urlresolvers import reverse
from django.conf import settings
from django.shortcuts import render


def logout(request):
    auth.logout(request)
    return http.HttpResponseRedirect(reverse('login'))


class LoginForm(forms.Form):
    username = forms.CharField()
    next = forms.CharField(widget=forms.HiddenInput,
            required=False)
    password = forms.CharField(widget=forms.PasswordInput)


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
                    return http.HttpResponseForbidden("Acount is not active")
            else:
                login_failed = True
    else:
        form = LoginForm(initial={'next': request.GET.get('next')})
    return render(request,
                  'authenticate/login.django.html',
                  {'form': form,
                   'login_failed': login_failed})
