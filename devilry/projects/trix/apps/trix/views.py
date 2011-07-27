from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from devilry.apps.core.models import Period
from models.status import Status
from models.exercisestatus import ExerciseStatus

def main(request):
    periods = [p for p in list(Period.objects.all()) if p.is_active()]
    exercises = {}
    exc_stats = {}

    for period in periods:
        p_excs = period.exercises.all()
        if p_excs:
            add = {}
            for exc in p_excs:
                e = {'title': exc.exercise.long_name,
                     'text': exc.exercise.text, 'status': -1}

                if request.user.is_authenticated():
                    try:
                        stats = exc.student_results.get(student=request.user)
                        e.update([['status', stats.id]]);
                    except ExerciseStatus.DoesNotExist, exception:
                        pass
                add.update( [[exc.id, e]] )
            exercises.update([[period, add]])

    statuses = []
    if request.user.is_authenticated():
        statuses = Status.objects.filter(active=True)

    return render(request,'trix/main.django.html',
                  {'exercises': exercises,
                   'exc_stats': exc_stats,
                   'statuses': statuses})
#                  {'exercises': Period.objects.all().exercises.all()})

