from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def main(request):
    print "Trying to grab the URLs"
    return render(request,'trix/main.django.html')

